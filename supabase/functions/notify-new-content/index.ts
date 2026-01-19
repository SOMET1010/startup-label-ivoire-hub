import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

import { getCorsHeaders, handleCorsPreflightRequest } from "../_shared/cors.ts";

interface NotifyRequest {
  content_type: "event" | "opportunity" | "resource";
  content_id: string;
  title: string;
  message?: string;
}

serve(async (req) => {
  const corsResponse = handleCorsPreflightRequest(req);
  if (corsResponse) return corsResponse;
  const corsHeaders = getCorsHeaders(req);

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { content_type, content_id, title, message }: NotifyRequest = await req.json();

    console.log(`Notifying about new ${content_type}: ${title}`);

    // Get all labeled startups (approved applications)
    const { data: labeledStartups, error: startupsError } = await supabase
      .from("applications")
      .select(`
        user_id,
        startup:startups!inner(
          user_id
        )
      `)
      .eq("status", "approved");

    if (startupsError) {
      console.error("Error fetching labeled startups:", startupsError);
      throw startupsError;
    }

    // Get unique user IDs
    const userIds = [...new Set(labeledStartups?.map(s => s.user_id) || [])];

    if (userIds.length === 0) {
      console.log("No labeled startups to notify");
      return new Response(
        JSON.stringify({ success: true, notified: 0 }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Determine notification type and link
    const typeMap = {
      event: { type: "new_event", link: "/startup/events" },
      opportunity: { type: "new_opportunity", link: "/startup/opportunities" },
      resource: { type: "new_resource", link: "/startup/resources" },
    };

    const notifConfig = typeMap[content_type];
    const notificationMessage = message || `Nouveau contenu disponible : ${title}`;

    // Create notifications for all labeled startups
    const notifications = userIds.map(userId => ({
      user_id: userId,
      type: notifConfig.type,
      title: title,
      message: notificationMessage,
      link: notifConfig.link,
      metadata: { content_id, content_type },
    }));

    const { error: insertError } = await supabase
      .from("startup_notifications")
      .insert(notifications);

    if (insertError) {
      console.error("Error inserting notifications:", insertError);
      throw insertError;
    }

    console.log(`Successfully notified ${userIds.length} users about new ${content_type}`);

    return new Response(
      JSON.stringify({ success: true, notified: userIds.length }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("Error in notify-new-content:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
