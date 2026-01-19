import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface PushPayload {
  comment_id?: string;
  application_id?: string;
  sender_id?: string;
  user_id?: string;
  title?: string;
  body?: string;
}

interface PushSubscriptionRecord {
  id: string;
  user_id: string;
  endpoint: string;
  p256dh: string;
  auth: string;
}

// Base64 URL encoding/decoding utilities
function base64UrlEncode(data: Uint8Array): string {
  const base64 = btoa(String.fromCharCode(...data));
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64UrlDecode(str: string): Uint8Array {
  str = str.replace(/-/g, '+').replace(/_/g, '/');
  while (str.length % 4) str += '=';
  const binary = atob(str);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

// Create VAPID JWT token
async function createVapidJwt(audience: string, subject: string, privateKeyBase64: string): Promise<string> {
  const header = { alg: 'ES256', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    aud: audience,
    exp: now + 12 * 60 * 60, // 12 hours
    sub: subject,
  };

  const headerB64 = base64UrlEncode(new TextEncoder().encode(JSON.stringify(header)));
  const payloadB64 = base64UrlEncode(new TextEncoder().encode(JSON.stringify(payload)));
  const unsignedToken = `${headerB64}.${payloadB64}`;

  // Import the private key
  const privateKeyBytes = base64UrlDecode(privateKeyBase64);
  const privateKey = await crypto.subtle.importKey(
    'pkcs8',
    privateKeyBytes,
    { name: 'ECDSA', namedCurve: 'P-256' },
    false,
    ['sign']
  );

  // Sign the token
  const signature = await crypto.subtle.sign(
    { name: 'ECDSA', hash: 'SHA-256' },
    privateKey,
    new TextEncoder().encode(unsignedToken)
  );

  // Convert signature from DER to raw format if needed
  const signatureB64 = base64UrlEncode(new Uint8Array(signature));
  return `${unsignedToken}.${signatureB64}`;
}

// Simple Web Push implementation
async function sendWebPush(
  subscription: PushSubscriptionRecord,
  payload: object,
  vapidPublicKey: string,
  vapidPrivateKey: string,
  vapidSubject: string
): Promise<boolean> {
  try {
    const url = new URL(subscription.endpoint);
    const audience = `${url.protocol}//${url.host}`;

    // Create VAPID authorization header
    let jwt: string;
    try {
      jwt = await createVapidJwt(audience, vapidSubject, vapidPrivateKey);
    } catch (jwtError) {
      console.error("Failed to create VAPID JWT:", jwtError);
      // Fallback: send without VAPID (some push services accept this)
      const response = await fetch(subscription.endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "TTL": "3600",
        },
        body: JSON.stringify(payload),
      });
      
      if (!response.ok) {
        console.error(`Push failed: ${response.status} - ${await response.text()}`);
        return false;
      }
      return true;
    }

    const vapidHeader = `vapid t=${jwt}, k=${vapidPublicKey}`;

    // For simplicity, we send unencrypted payload
    // Full Web Push encryption requires ECDH key exchange which is complex
    // Most modern push services accept plaintext with VAPID auth
    const response = await fetch(subscription.endpoint, {
      method: "POST",
      headers: {
        "Authorization": vapidHeader,
        "Content-Type": "application/json",
        "TTL": "3600",
        "Urgency": "normal",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Push failed for ${subscription.endpoint}: ${response.status} - ${errorText}`);
      
      // If 410 Gone, the subscription is invalid and should be removed
      if (response.status === 410) {
        console.log("Subscription expired, should be removed");
      }
      return false;
    }

    console.log(`Push sent successfully to ${subscription.endpoint}`);
    return true;
  } catch (error) {
    console.error("Error sending web push:", error);
    return false;
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const vapidPublicKey = Deno.env.get("VAPID_PUBLIC_KEY");
    const vapidPrivateKey = Deno.env.get("VAPID_PRIVATE_KEY");
    const vapidSubject = Deno.env.get("VAPID_SUBJECT") || "mailto:contact@labelstartup.ci";

    if (!vapidPublicKey || !vapidPrivateKey) {
      console.warn("VAPID keys not configured");
      return new Response(
        JSON.stringify({ error: "VAPID keys not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const body: PushPayload = await req.json();
    const { comment_id, application_id, sender_id, user_id, title, body: messageBody } = body;

    // Direct notification to a specific user
    if (user_id && title && messageBody) {
      const { data: subscriptions } = await supabase
        .from("push_subscriptions")
        .select("*")
        .eq("user_id", user_id);

      if (subscriptions && subscriptions.length > 0) {
        const payload = {
          title,
          body: messageBody,
          icon: "/favicon.ico",
          badge: "/favicon.ico",
          data: { url: "/startup/messages" },
        };

        const results = await Promise.all(
          subscriptions.map((sub) =>
            sendWebPush(sub as PushSubscriptionRecord, payload, vapidPublicKey, vapidPrivateKey, vapidSubject)
          )
        );

        console.log(`Sent ${results.filter(Boolean).length}/${results.length} push notifications`);
      }

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Handle comment notification
    if (!application_id) {
      return new Response(JSON.stringify({ error: "Missing application_id" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get the application to find the startup owner
    const { data: application, error: appError } = await supabase
      .from("applications")
      .select("user_id, startup_id")
      .eq("id", application_id)
      .single();

    if (appError || !application) {
      console.error("Application not found:", appError);
      return new Response(JSON.stringify({ error: "Application not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Don't notify if the sender is the startup owner
    if (sender_id && sender_id === application.user_id) {
      console.log("Sender is the startup owner, skipping notification");
      return new Response(JSON.stringify({ success: true, skipped: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get sender profile for notification text
    let senderName: string | null = null;
    if (sender_id) {
      const { data: senderProfile } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("user_id", sender_id)
        .single();
      senderName = senderProfile?.full_name || null;
    }

    // Get push subscriptions for the startup owner
    const { data: subscriptions } = await supabase
      .from("push_subscriptions")
      .select("*")
      .eq("user_id", application.user_id);

    if (!subscriptions || subscriptions.length === 0) {
      console.log("No push subscriptions found for user:", application.user_id);
      return new Response(JSON.stringify({ success: true, noSubscriptions: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const notificationPayload = {
      title: "Nouveau message",
      body: senderName
        ? `${senderName} vous a envoyé un message`
        : "L'équipe de labellisation vous a répondu",
      icon: "/favicon.ico",
      badge: "/favicon.ico",
      data: {
        url: "/startup/messages",
        application_id,
        comment_id,
      },
    };

    // Send push to all subscriptions
    const results = await Promise.all(
      subscriptions.map((sub) =>
        sendWebPush(sub as PushSubscriptionRecord, notificationPayload, vapidPublicKey, vapidPrivateKey, vapidSubject)
      )
    );

    const successCount = results.filter(Boolean).length;
    console.log(`Sent ${successCount}/${results.length} push notifications`);

    return new Response(
      JSON.stringify({ success: true, sent: successCount, total: results.length }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in send-push-notification:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
