import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Configuration des rappels
const REMINDER_CONFIGS = [
  { type: "6_months", days: 180, urgency: "low", color: "#3B82F6" },
  { type: "3_months", days: 90, urgency: "medium", color: "#F59E0B" },
  { type: "1_month", days: 30, urgency: "high", color: "#EF4444" },
] as const;

// Templates d'email
const EMAIL_TEMPLATES = {
  "6_months": {
    subject: "📋 Préparez le renouvellement de votre Label Startup Numérique",
    heading: "Votre label expire dans 6 mois",
    message: `C'est le moment idéal pour préparer vos documents et planifier votre renouvellement. 
              Nous vous recommandons de commencer à rassembler les pièces justificatives nécessaires.`,
    cta: "Préparer mon renouvellement",
    color: "#3B82F6",
  },
  "3_months": {
    subject: "⏰ Il est temps de renouveler votre Label Startup Numérique",
    heading: "Votre label expire dans 3 mois",
    message: `Nous vous recommandons de soumettre votre demande de renouvellement dès maintenant 
              pour garantir la continuité de vos avantages.`,
    cta: "Renouveler maintenant",
    color: "#F59E0B",
  },
  "1_month": {
    subject: "🚨 Action requise : Votre Label expire dans 1 mois",
    heading: "URGENT : Votre label expire très bientôt",
    message: `Sans renouvellement, vous perdrez l'accès aux avantages du programme Label Startup Numérique. 
              Soumettez votre demande immédiatement pour éviter toute interruption.`,
    cta: "Renouveler immédiatement",
    color: "#EF4444",
  },
};

interface ReminderRequest {
  source?: "cron" | "manual";
  dry_run?: boolean;
}

interface StartupToNotify {
  startup_id: string;
  startup_name: string;
  user_id: string;
  expiration_date: string;
  email: string;
  full_name: string;
}

const generateEmailHTML = (
  template: typeof EMAIL_TEMPLATES["6_months"],
  startupName: string,
  expirationDate: string,
  daysRemaining: number
) => {
  const formattedDate = new Date(expirationDate).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td style="padding: 40px 0;">
        <table role="presentation" style="width: 600px; margin: 0 auto; background-color: white; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <tr>
            <td style="background-color: ${template.color}; padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 24px;">${template.heading}</h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <p style="font-size: 16px; color: #333; margin: 0 0 20px;">
                Bonjour,
              </p>
              <p style="font-size: 16px; color: #333; margin: 0 0 20px;">
                Le <strong>Label Startup Numérique</strong> de <strong>${startupName}</strong> 
                arrive à expiration le <strong>${formattedDate}</strong>.
              </p>
              <p style="font-size: 16px; color: #666; margin: 0 0 30px;">
                ${template.message}
              </p>
              
              <!-- Stats Box -->
              <table role="presentation" style="width: 100%; margin-bottom: 30px;">
                <tr>
                  <td style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center;">
                    <p style="margin: 0; font-size: 48px; font-weight: bold; color: ${template.color};">
                      ${daysRemaining}
                    </p>
                    <p style="margin: 5px 0 0; color: #666; font-size: 14px;">
                      jours restants
                    </p>
                  </td>
                </tr>
              </table>
              
              <!-- CTA Button -->
              <table role="presentation" style="width: 100%;">
                <tr>
                  <td style="text-align: center;">
                    <a href="https://startup-label-ivoire-hub.lovable.app/startup/renewal" 
                       style="display: inline-block; background-color: ${template.color}; color: white; 
                              padding: 16px 32px; text-decoration: none; border-radius: 8px; 
                              font-weight: 600; font-size: 16px;">
                      ${template.cta}
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f8f9fa; padding: 20px 30px; border-radius: 0 0 12px 12px; text-align: center;">
              <p style="margin: 0; font-size: 12px; color: #999;">
                Cet email a été envoyé automatiquement par le Programme Label Startup Numérique de Côte d'Ivoire.
              </p>
              <p style="margin: 10px 0 0; font-size: 12px; color: #999;">
                © ${new Date().getFullYear()} Label Startup Numérique - Tous droits réservés
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
};

serve(async (req: Request): Promise<Response> => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const resendApiKey = Deno.env.get("RESEND_API_KEY");

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const resend = resendApiKey ? new Resend(resendApiKey) : null;

    // Parse request body
    let requestBody: ReminderRequest = { source: "cron", dry_run: false };
    try {
      requestBody = await req.json();
    } catch {
      // Use defaults if no body
    }

    const { dry_run = false, source = "cron" } = requestBody;

    console.log(`[renewal-reminders] Started - source: ${source}, dry_run: ${dry_run}`);

    const results = {
      processed: 0,
      notifications_sent: 0,
      emails_sent: 0,
      errors: [] as string[],
      details: [] as { startup: string; type: string; email_sent: boolean; notification_sent: boolean }[],
    };

    // Process each reminder type
    for (const config of REMINDER_CONFIGS) {
      console.log(`[renewal-reminders] Checking ${config.type} reminders (${config.days} days)`);

      // Find startups with labels expiring at exactly this interval
      const targetDate = new Date();
      targetDate.setDate(targetDate.getDate() + config.days);
      const targetDateStr = targetDate.toISOString().split("T")[0];

      // Query startups with expiring labels that haven't received this reminder
      const { data: startupsToNotify, error: queryError } = await supabase.rpc("get_startups_for_renewal_reminder", {
        target_date: targetDateStr,
        reminder_type: config.type,
      });

      if (queryError) {
        // If RPC doesn't exist, use direct query
        console.log(`[renewal-reminders] RPC not found, using direct query`);
        
        const { data: directQueryResult, error: directError } = await supabase
          .from("startups")
          .select(`
            id,
            name,
            user_id,
            label_expires_at
          `)
          .eq("label_expires_at", targetDateStr);

        if (directError) {
          console.error(`[renewal-reminders] Query error: ${directError.message}`);
          results.errors.push(`Query error for ${config.type}: ${directError.message}`);
          continue;
        }

        if (!directQueryResult || directQueryResult.length === 0) {
          console.log(`[renewal-reminders] No startups found for ${config.type}`);
          continue;
        }

        // Get profile info for each startup
        for (const startup of directQueryResult) {
          // Check if reminder already sent
          const { data: existingReminder } = await supabase
            .from("renewal_reminders_sent")
            .select("id")
            .eq("startup_id", startup.id)
            .eq("reminder_type", config.type)
            .eq("expiration_date", startup.label_expires_at)
            .single();

          if (existingReminder) {
            console.log(`[renewal-reminders] Reminder already sent for ${startup.name}`);
            continue;
          }

          // Get user profile
          const { data: profile } = await supabase
            .from("profiles")
            .select("email, full_name")
            .eq("user_id", startup.user_id)
            .single();

          if (!profile?.email) {
            console.log(`[renewal-reminders] No email found for startup ${startup.name}`);
            continue;
          }

          results.processed++;

          if (dry_run) {
            results.details.push({
              startup: startup.name,
              type: config.type,
              email_sent: false,
              notification_sent: false,
            });
            continue;
          }

          const template = EMAIL_TEMPLATES[config.type];
          const daysRemaining = config.days;
          let emailSent = false;
          let notificationSent = false;

          // Send email
          if (resend && profile.email) {
            try {
              await resend.emails.send({
                from: "Label Startup Numérique <onboarding@resend.dev>",
                to: [profile.email],
                subject: template.subject,
                html: generateEmailHTML(template, startup.name, startup.label_expires_at!, daysRemaining),
              });
              emailSent = true;
              results.emails_sent++;
              console.log(`[renewal-reminders] Email sent to ${profile.email}`);
            } catch (emailError: any) {
              console.error(`[renewal-reminders] Email error: ${emailError.message}`);
              results.errors.push(`Email error for ${startup.name}: ${emailError.message}`);
            }
          }

          // Create in-app notification
          const { error: notifError } = await supabase.from("startup_notifications").insert({
            user_id: startup.user_id,
            type: "renewal_reminder",
            title: template.heading,
            message: `Le label de ${startup.name} expire le ${new Date(startup.label_expires_at!).toLocaleDateString("fr-FR")}. ${daysRemaining} jours restants.`,
            link: "/startup/renewal",
            metadata: {
              startup_id: startup.id,
              reminder_type: config.type,
              expiration_date: startup.label_expires_at,
              days_remaining: daysRemaining,
            },
          });

          if (notifError) {
            console.error(`[renewal-reminders] Notification error: ${notifError.message}`);
            results.errors.push(`Notification error for ${startup.name}: ${notifError.message}`);
          } else {
            notificationSent = true;
            results.notifications_sent++;
            console.log(`[renewal-reminders] Notification created for ${startup.name}`);
          }

          // Record that reminder was sent
          const { error: recordError } = await supabase.from("renewal_reminders_sent").insert({
            startup_id: startup.id,
            reminder_type: config.type,
            expiration_date: startup.label_expires_at,
            email_sent: emailSent,
            notification_sent: notificationSent,
          });

          if (recordError) {
            console.error(`[renewal-reminders] Record error: ${recordError.message}`);
            results.errors.push(`Record error for ${startup.name}: ${recordError.message}`);
          }

          results.details.push({
            startup: startup.name,
            type: config.type,
            email_sent: emailSent,
            notification_sent: notificationSent,
          });
        }
      }
    }

    console.log(`[renewal-reminders] Completed - processed: ${results.processed}, notifications: ${results.notifications_sent}, emails: ${results.emails_sent}`);

    return new Response(
      JSON.stringify({
        success: true,
        dry_run,
        source,
        timestamp: new Date().toISOString(),
        results,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error(`[renewal-reminders] Fatal error: ${error.message}`);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});
