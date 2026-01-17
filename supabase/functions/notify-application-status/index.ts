import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface NotificationRequest {
  application_id: string;
  new_status: string;
  old_status?: string;
  notes?: string;
}

const STATUS_LABELS: Record<string, string> = {
  pending: "En attente",
  under_review: "En cours d'examen",
  approved: "Approuvée",
  rejected: "Rejetée",
};

const STATUS_COLORS: Record<string, string> = {
  pending: "#FFA500",
  under_review: "#3B82F6",
  approved: "#10B981",
  rejected: "#EF4444",
};

const escapeHtml = (str: string): string => {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { application_id, new_status, old_status, notes }: NotificationRequest = await req.json();

    console.log(`Processing notification for application ${application_id}, status: ${old_status} -> ${new_status}`);

    // Validate required fields
    if (!application_id || !new_status) {
      throw new Error("Missing required fields: application_id and new_status");
    }

    // Create Supabase client with service role
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch application with startup and user details
    const { data: application, error: appError } = await supabase
      .from("applications")
      .select("id, status, submitted_at, startup_id, user_id")
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

    // Fetch user profile for email
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("email, full_name")
      .eq("user_id", application.user_id)
      .maybeSingle();

    if (profileError || !profile || !profile.email) {
      console.error("Error fetching profile:", profileError);
      throw new Error("User profile or email not found");
    }

    const statusLabel = STATUS_LABELS[new_status] || new_status;
    const statusColor = STATUS_COLORS[new_status] || "#666666";
    const userName = profile.full_name || "Cher(e) candidat(e)";
    const startupName = escapeHtml(startup.name);
    const safeNotes = notes ? escapeHtml(notes) : null;

    // Determine email subject and content based on status
    let subject: string;
    let mainMessage: string;
    let actionText: string;

    switch (new_status) {
      case "approved":
        subject = `🎉 Félicitations ! Votre candidature pour ${startupName} a été approuvée`;
        mainMessage = `
          <p>Nous avons le plaisir de vous informer que votre candidature au <strong>Label Startup Numérique</strong> a été <strong style="color: ${statusColor};">approuvée</strong> par le Comité de Labellisation.</p>
          <p>Votre startup <strong>${startupName}</strong> fait désormais partie de l'écosystème des startups labellisées de Côte d'Ivoire !</p>
          <p>Vous bénéficiez maintenant de tous les avantages du label : visibilité accrue, accompagnement personnalisé, accès aux investisseurs, et bien plus encore.</p>
        `;
        actionText = "Découvrir vos avantages";
        break;

      case "rejected":
        subject = `Décision concernant votre candidature - ${startupName}`;
        mainMessage = `
          <p>Nous vous remercions pour l'intérêt que vous portez au <strong>Label Startup Numérique</strong>.</p>
          <p>Après examen attentif de votre dossier, le Comité de Labellisation a décidé de ne pas retenir votre candidature pour <strong>${startupName}</strong> à ce stade.</p>
          <p>Cette décision ne remet pas en cause la valeur de votre projet. Nous vous encourageons à continuer à développer votre startup et à soumettre une nouvelle candidature lorsque vous aurez franchi de nouvelles étapes.</p>
        `;
        actionText = "Consulter les critères";
        break;

      case "under_review":
        subject = `Votre candidature est en cours d'examen - ${startupName}`;
        mainMessage = `
          <p>Nous vous informons que votre candidature au <strong>Label Startup Numérique</strong> est désormais <strong style="color: ${statusColor};">en cours d'examen</strong> par notre comité d'évaluation.</p>
          <p>Nos experts analysent actuellement votre dossier pour <strong>${startupName}</strong>. Cette phase d'évaluation peut prendre quelques jours.</p>
          <p>Vous serez notifié(e) dès qu'une décision sera prise.</p>
        `;
        actionText = "Suivre ma candidature";
        break;

      default:
        subject = `Mise à jour de votre candidature - ${startupName}`;
        mainMessage = `
          <p>Le statut de votre candidature au <strong>Label Startup Numérique</strong> pour <strong>${startupName}</strong> a été mis à jour.</p>
          <p>Nouveau statut : <strong style="color: ${statusColor};">${statusLabel}</strong></p>
        `;
        actionText = "Suivre ma candidature";
    }

    // Send email
    const emailResponse = await resend.emails.send({
      from: "Label Startup Numérique <onboarding@resend.dev>",
      to: [profile.email],
      subject: subject,
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
              .header p { margin: 10px 0 0; opacity: 0.9; font-size: 16px; }
              .content { background: #ffffff; padding: 40px 30px; border-left: 1px solid #e0e0e0; border-right: 1px solid #e0e0e0; }
              .status-badge { display: inline-block; background: ${statusColor}; color: white; padding: 8px 20px; border-radius: 20px; font-weight: 600; font-size: 14px; margin: 20px 0; }
              .info-box { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid ${statusColor}; }
              .info-box h3 { margin: 0 0 10px; color: #333; font-size: 16px; }
              .notes-box { background: #FFF9E6; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #F59E0B; }
              .notes-box h3 { margin: 0 0 10px; color: #92400E; font-size: 16px; }
              .button { display: inline-block; background: linear-gradient(135deg, #F97316 0%, #22C55E 100%); color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; }
              .button:hover { opacity: 0.9; }
              .footer { background: #f9f9f9; padding: 30px; text-align: center; border-radius: 0 0 12px 12px; font-size: 14px; color: #666; border: 1px solid #e0e0e0; border-top: none; }
              .footer a { color: #F97316; text-decoration: none; }
              .divider { height: 1px; background: #e0e0e0; margin: 25px 0; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Label Startup Numérique</h1>
                <p>Côte d'Ivoire</p>
              </div>
              <div class="content">
                <p>Bonjour <strong>${escapeHtml(userName)}</strong>,</p>
                
                ${mainMessage}
                
                <div class="info-box">
                  <h3>📋 Détails de votre candidature</h3>
                  <p><strong>Startup :</strong> ${startupName}</p>
                  <p><strong>Statut :</strong> <span class="status-badge">${statusLabel}</span></p>
                  <p><strong>Date de soumission :</strong> ${application.submitted_at ? new Date(application.submitted_at).toLocaleDateString("fr-FR", { dateStyle: "long" }) : "N/A"}</p>
                </div>
                
                ${safeNotes ? `
                <div class="notes-box">
                  <h3>📝 Remarques du comité</h3>
                  <p>${safeNotes}</p>
                </div>
                ` : ""}
                
                <center>
                  <a href="https://startup-label-ivoire-hub.lovable.app/suivi-candidature" class="button">
                    ${actionText}
                  </a>
                </center>
                
                <div class="divider"></div>
                
                <p style="font-size: 14px; color: #666;">
                  Pour toute question, n'hésitez pas à nous contacter à 
                  <a href="mailto:support@labelstartup.ci" style="color: #F97316;">support@labelstartup.ci</a>
                </p>
              </div>
              <div class="footer">
                <p><strong>Label Startup Numérique Côte d'Ivoire</strong></p>
                <p>Ministère de la Transition Numérique et de la Digitalisation</p>
                <p style="margin-top: 15px;">
                  <a href="https://startup-label-ivoire-hub.lovable.app">Visiter notre site</a> • 
                  <a href="https://startup-label-ivoire-hub.lovable.app/contact">Nous contacter</a>
                </p>
                <p style="margin-top: 15px; font-size: 12px; color: #999;">
                  © ${new Date().getFullYear()} Label Startup Numérique CI - Tous droits réservés
                </p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(
      JSON.stringify({
        success: true,
        emailId: emailResponse.id,
        recipient: profile.email,
        status: new_status,
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
    console.error("Error in notify-application-status function:", error);
    return new Response(
      JSON.stringify({
        error: error.message || "An error occurred while sending notification",
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
