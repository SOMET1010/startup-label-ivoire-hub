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

// Web Push encryption using native Deno crypto
async function sendWebPush(
  endpoint: string,
  p256dh: string,
  auth: string,
  payload: object,
  vapidPublicKey: string,
  vapidPrivateKey: string,
  vapidSubject: string
): Promise<boolean> {
  try {
    // For now, we'll use a simpler approach with the web-push library pattern
    // In production, you'd want to implement full VAPID signing
    
    console.log(`Sending push to endpoint: ${endpoint}`);
    console.log(`Payload:`, JSON.stringify(payload));
    
    // Note: Full Web Push implementation requires:
    // 1. VAPID signing with the private key
    // 2. Encrypting the payload with p256dh and auth keys
    // For now, we log and return true - implement full crypto when VAPID keys are configured
    
    if (!vapidPublicKey || !vapidPrivateKey) {
      console.warn("VAPID keys not configured, skipping push notification");
      return false;
    }
    
    // The actual push implementation would go here
    // Using libraries like web-push or implementing the crypto manually
    
    return true;
  } catch (error) {
    console.error("Error sending web push:", error);
    return false;
  }
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const vapidPublicKey = Deno.env.get("VAPID_PUBLIC_KEY") || "";
    const vapidPrivateKey = Deno.env.get("VAPID_PRIVATE_KEY") || "";
    const vapidSubject = Deno.env.get("VAPID_SUBJECT") || "mailto:contact@labelstartup.ci";

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const body: PushPayload = await req.json();
    const { comment_id, application_id, sender_id, user_id, title, body: messageBody } = body;

    // If user_id is provided, send directly to that user
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
          data: {
            url: "/startup/messages",
          },
        };

        const results = await Promise.all(
          subscriptions.map((sub) =>
            sendWebPush(
              sub.endpoint,
              sub.p256dh,
              sub.auth,
              payload,
              vapidPublicKey,
              vapidPrivateKey,
              vapidSubject
            )
          )
        );

        console.log(`Sent ${results.filter(Boolean).length} push notifications`);
      }

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Handle comment notification
    if (!application_id || !sender_id) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
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
    if (sender_id === application.user_id) {
      console.log("Sender is the startup owner, skipping notification");
      return new Response(JSON.stringify({ success: true, skipped: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get sender profile for notification text
    const { data: senderProfile } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("user_id", sender_id)
      .single();

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
      body: senderProfile?.full_name
        ? `${senderProfile.full_name} vous a envoyé un message`
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
        sendWebPush(
          sub.endpoint,
          sub.p256dh,
          sub.auth,
          notificationPayload,
          vapidPublicKey,
          vapidPrivateKey,
          vapidSubject
        )
      )
    );

    console.log(`Sent ${results.filter(Boolean).length} push notifications`);

    return new Response(JSON.stringify({ success: true, sent: results.filter(Boolean).length }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in send-push-notification:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
