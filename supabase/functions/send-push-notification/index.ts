import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import {
  ApplicationServerKeys,
  PushSubscription as WebPushSubscription,
  generatePushHTTPRequest,
} from "https://esm.sh/@anthropic-ai/webpush@0.0.2";

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

async function sendWebPush(
  subscription: PushSubscriptionRecord,
  payload: object,
  applicationServerKeys: ApplicationServerKeys
): Promise<boolean> {
  try {
    const webPushSubscription: WebPushSubscription = {
      endpoint: subscription.endpoint,
      keys: {
        p256dh: subscription.p256dh,
        auth: subscription.auth,
      },
    };

    const payloadString = JSON.stringify(payload);

    const { headers, body, endpoint } = await generatePushHTTPRequest({
      applicationServerKeys,
      payload: new TextEncoder().encode(payloadString),
      target: webPushSubscription,
      adminContact: Deno.env.get("VAPID_SUBJECT") || "mailto:contact@labelstartup.ci",
      ttl: 60 * 60, // 1 hour
    });

    const response = await fetch(endpoint, {
      method: "POST",
      headers,
      body,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Push failed for ${subscription.endpoint}: ${response.status} - ${errorText}`);
      return false;
    }

    console.log(`Push sent successfully to ${subscription.endpoint}`);
    return true;
  } catch (error) {
    console.error("Error sending web push:", error);
    return false;
  }
}

async function getApplicationServerKeys(): Promise<ApplicationServerKeys | null> {
  const vapidPublicKey = Deno.env.get("VAPID_PUBLIC_KEY");
  const vapidPrivateKey = Deno.env.get("VAPID_PRIVATE_KEY");

  if (!vapidPublicKey || !vapidPrivateKey) {
    console.warn("VAPID keys not configured");
    return null;
  }

  try {
    // Import the VAPID keys
    const applicationServerKeys = await ApplicationServerKeys.fromJSON({
      publicKey: vapidPublicKey,
      privateKey: vapidPrivateKey,
    });
    return applicationServerKeys;
  } catch (error) {
    console.error("Error importing VAPID keys:", error);
    return null;
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

    const applicationServerKeys = await getApplicationServerKeys();
    if (!applicationServerKeys) {
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
            sendWebPush(sub as PushSubscriptionRecord, payload, applicationServerKeys)
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
        sendWebPush(sub as PushSubscriptionRecord, notificationPayload, applicationServerKeys)
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
