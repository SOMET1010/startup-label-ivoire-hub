import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface VotingNotificationRequest {
  event_type: 'quorum_reached' | 'decision_applied';
  application_id: string;
  decision?: 'approved' | 'rejected';
  decision_source?: 'automatic' | 'manual' | 'override';
  notes?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { event_type, application_id, decision, decision_source, notes }: VotingNotificationRequest = await req.json();

    console.log(`Processing ${event_type} notification for application ${application_id}`);

    // Validate required fields
    if (!event_type || !application_id) {
      throw new Error("Missing required fields: event_type and application_id");
    }

    // Create Supabase client with service role
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch application with startup details
    const { data: application, error: appError } = await supabase
      .from("applications")
      .select("id, status, startup_id, user_id")
      .eq("id", application_id)
      .maybeSingle();

    if (appError || !application) {
      console.error("Error fetching application:", appError);
      throw new Error("Application not found");
    }

    // Fetch startup details
    const { data: startup, error: startupError } = await supabase
      .from("startups")
      .select("name, sector")
      .eq("id", application.startup_id)
      .maybeSingle();

    if (startupError || !startup) {
      console.error("Error fetching startup:", startupError);
      throw new Error("Startup not found");
    }

    const notificationsSent: string[] = [];

    if (event_type === 'quorum_reached') {
      // Notify all admins when quorum is reached
      console.log("Quorum reached - notifying admins");

      // Get all admin user IDs
      const { data: adminRoles, error: rolesError } = await supabase
        .from("user_roles")
        .select("user_id")
        .eq("role", "admin");

      if (rolesError) {
        console.error("Error fetching admin roles:", rolesError);
        throw new Error("Could not fetch admin users");
      }

      // Count submitted evaluations
      const { count: evalCount } = await supabase
        .from("evaluations")
        .select("*", { count: 'exact', head: true })
        .eq("application_id", application_id)
        .eq("is_submitted", true);

      // Create in-app notifications for all admins
      const adminNotifications = (adminRoles || []).map(role => ({
        user_id: role.user_id,
        type: 'quorum_reached',
        title: 'Quorum atteint',
        message: `Le quorum est atteint pour ${startup.name} (${evalCount || 0} évaluations soumises). Une décision peut être prise.`,
        link: `/admin?app=${application_id}`,
        metadata: {
          application_id,
          startup_name: startup.name,
          evaluation_count: evalCount || 0,
        },
      }));

      if (adminNotifications.length > 0) {
        const { error: notifError } = await supabase
          .from("startup_notifications")
          .insert(adminNotifications);

        if (notifError) {
          console.error("Error creating admin notifications:", notifError);
        } else {
          notificationsSent.push(`${adminNotifications.length} admin notifications`);
        }
      }

    } else if (event_type === 'decision_applied') {
      // Notify the startup owner when a decision is applied
      console.log(`Decision applied (${decision}) - notifying startup owner`);

      if (!decision) {
        throw new Error("Missing decision for decision_applied event");
      }

      const isApproved = decision === 'approved';
      const decisionLabel = isApproved ? 'approuvée' : 'rejetée';
      const sourceLabel = decision_source === 'automatic' 
        ? '(décision automatique)' 
        : decision_source === 'override' 
          ? '(décision manuelle)'
          : '';

      // Create notification for startup owner
      const { error: startupNotifError } = await supabase
        .from("startup_notifications")
        .insert({
          user_id: application.user_id,
          type: 'decision_applied',
          title: isApproved ? '🎉 Candidature approuvée !' : 'Décision sur votre candidature',
          message: isApproved 
            ? `Félicitations ! Votre candidature pour ${startup.name} a été approuvée ${sourceLabel}. Bienvenue dans le Label Startup Numérique !`
            : `Votre candidature pour ${startup.name} a été examinée ${sourceLabel}. Nous vous invitons à consulter les détails.`,
          link: '/suivi-candidature',
          metadata: {
            application_id,
            startup_name: startup.name,
            decision,
            decision_source,
            notes,
          },
        });

      if (startupNotifError) {
        console.error("Error creating startup notification:", startupNotifError);
      } else {
        notificationsSent.push("startup owner notification");
      }

      // Also notify all admins about the decision
      const { data: adminRoles } = await supabase
        .from("user_roles")
        .select("user_id")
        .eq("role", "admin");

      const adminNotifications = (adminRoles || []).map(role => ({
        user_id: role.user_id,
        type: 'decision_applied',
        title: isApproved ? 'Candidature approuvée' : 'Candidature rejetée',
        message: `La candidature de ${startup.name} a été ${decisionLabel} ${sourceLabel}.`,
        link: `/admin?app=${application_id}`,
        metadata: {
          application_id,
          startup_name: startup.name,
          decision,
          decision_source,
        },
      }));

      if (adminNotifications.length > 0) {
        const { error: adminNotifError } = await supabase
          .from("startup_notifications")
          .insert(adminNotifications);

        if (!adminNotifError) {
          notificationsSent.push(`${adminNotifications.length} admin notifications`);
        }
      }

      // Fetch user profile for email
      const { data: profile } = await supabase
        .from("profiles")
        .select("email, full_name")
        .eq("user_id", application.user_id)
        .maybeSingle();

      // Send email notification via the existing edge function
      if (profile?.email) {
        try {
          const emailResponse = await resend.emails.send({
            from: "Label Startup Numérique <onboarding@resend.dev>",
            to: [profile.email],
            subject: isApproved 
              ? `🎉 Félicitations ! Votre candidature pour ${startup.name} a été approuvée`
              : `Décision concernant votre candidature - ${startup.name}`,
            html: `
              <!DOCTYPE html>
              <html>
                <head>
                  <meta charset="utf-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                  <style>
                    body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f5f5f5; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: linear-gradient(135deg, #F97316 0%, #22C55E 100%); color: white; padding: 40px 30px; text-align: center; border-radius: 12px 12px 0 0; }
                    .header h1 { margin: 0; font-size: 28px; font-weight: 700; }
                    .content { background: #ffffff; padding: 40px 30px; border-left: 1px solid #e0e0e0; border-right: 1px solid #e0e0e0; }
                    .status-badge { display: inline-block; background: ${isApproved ? '#10B981' : '#EF4444'}; color: white; padding: 8px 20px; border-radius: 20px; font-weight: 600; }
                    .button { display: inline-block; background: linear-gradient(135deg, #F97316 0%, #22C55E 100%); color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; }
                    .footer { background: #f9f9f9; padding: 30px; text-align: center; border-radius: 0 0 12px 12px; font-size: 14px; color: #666; border: 1px solid #e0e0e0; border-top: none; }
                  </style>
                </head>
                <body>
                  <div class="container">
                    <div class="header">
                      <h1>Label Startup Numérique</h1>
                      <p>Côte d'Ivoire</p>
                    </div>
                    <div class="content">
                      <p>Bonjour <strong>${profile.full_name || 'Cher(e) candidat(e)'}</strong>,</p>
                      
                      ${isApproved ? `
                        <p>Nous avons le plaisir de vous informer que votre candidature au <strong>Label Startup Numérique</strong> a été <span class="status-badge">Approuvée</span></p>
                        <p>Votre startup <strong>${startup.name}</strong> fait désormais partie de l'écosystème des startups labellisées de Côte d'Ivoire !</p>
                      ` : `
                        <p>Nous vous remercions pour votre candidature au <strong>Label Startup Numérique</strong>.</p>
                        <p>Après examen de votre dossier pour <strong>${startup.name}</strong>, le comité a décidé de ne pas retenir votre candidature à ce stade.</p>
                        <p>Cette décision ne remet pas en cause la valeur de votre projet. Nous vous encourageons à continuer et à soumettre une nouvelle candidature.</p>
                      `}
                      
                      ${notes ? `<p style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0;"><strong>Note du comité :</strong> ${notes}</p>` : ''}
                      
                      <center style="margin: 30px 0;">
                        <a href="https://startup-label-ivoire-hub.lovable.app/suivi-candidature" class="button">
                          Voir le détail
                        </a>
                      </center>
                    </div>
                    <div class="footer">
                      <p><strong>Label Startup Numérique Côte d'Ivoire</strong></p>
                      <p>© ${new Date().getFullYear()} - Tous droits réservés</p>
                    </div>
                  </div>
                </body>
              </html>
            `,
          });
          console.log("Email sent:", emailResponse);
          notificationsSent.push("email notification");
        } catch (emailError) {
          console.error("Error sending email:", emailError);
        }
      }
    }

    console.log(`Notifications sent: ${notificationsSent.join(', ')}`);

    return new Response(
      JSON.stringify({
        success: true,
        event_type,
        notifications_sent: notificationsSent,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error("Error in notify-voting-decision function:", error);
    return new Response(
      JSON.stringify({
        error: error.message || "An error occurred",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  }
};

serve(handler);
