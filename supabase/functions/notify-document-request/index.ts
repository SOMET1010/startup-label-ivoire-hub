import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

import { getCorsHeaders, handleCorsPreflightRequest } from "../_shared/cors.ts";

interface DocumentRequestNotification {
  application_id: string;
  document_type: string;
  document_label: string;
  message?: string;
}

const handler = async (req: Request): Promise<Response> => {
  console.log("notify-document-request: Function called");

  const corsResponse = handleCorsPreflightRequest(req);
  if (corsResponse) return corsResponse;
  const corsHeaders = getCorsHeaders(req);

  try {
    const { application_id, document_type, document_label, message }: DocumentRequestNotification = await req.json();

    console.log("notify-document-request: Received request", { application_id, document_type, document_label });

    if (!application_id || !document_type || !document_label) {
      console.error("notify-document-request: Missing required fields");
      return new Response(
        JSON.stringify({ error: "Missing required fields: application_id, document_type, document_label" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Create Supabase client with service role
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get application with startup info
    const { data: application, error: appError } = await supabase
      .from("applications")
      .select("id, user_id, startup_id, startups(name)")
      .eq("id", application_id)
      .single();

    if (appError || !application) {
      console.error("notify-document-request: Application not found", appError);
      return new Response(
        JSON.stringify({ error: "Application not found" }),
        { status: 404, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log("notify-document-request: Application found", application);

    // Get user profile with email
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("email, full_name")
      .eq("user_id", application.user_id)
      .single();

    if (profileError || !profile?.email) {
      console.error("notify-document-request: Profile/email not found", profileError);
      return new Response(
        JSON.stringify({ error: "User email not found" }),
        { status: 404, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log("notify-document-request: Profile found", { email: profile.email, name: profile.full_name });

    const startupName = (application.startups as any)?.name || "Votre startup";
    const userName = profile.full_name || "Cher porteur de projet";
    const appUrl = Deno.env.get("APP_URL") || "https://startup-label-ivoire-hub.lovable.app";

    // Escape HTML in message to prevent XSS
    const escapeHtml = (text: string) => {
      return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    };

    const messageSection = message ? `
      <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px; margin: 20px 0; border-radius: 0 8px 8px 0;">
        <p style="margin: 0 0 8px 0; font-weight: 600; color: #92400e;">📝 Message de l'équipe :</p>
        <p style="margin: 0; color: #78350f; font-style: italic;">"${escapeHtml(message)}"</p>
      </div>
    ` : '';

    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document requis - Label Startup Numérique</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f4f4f5;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #f97316 0%, #16a34a 100%); padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
            <h1 style="margin: 0; color: white; font-size: 24px; font-weight: 700;">
              Label Startup Numérique
            </h1>
            <p style="margin: 8px 0 0 0; color: rgba(255,255,255,0.9); font-size: 14px;">
              Côte d'Ivoire
            </p>
          </div>
          
          <!-- Content -->
          <div style="background-color: white; padding: 32px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <h2 style="margin: 0 0 20px 0; color: #18181b; font-size: 20px;">
              📄 Document supplémentaire requis
            </h2>
            
            <p style="margin: 0 0 20px 0; color: #3f3f46; line-height: 1.6;">
              Bonjour ${escapeHtml(userName)},
            </p>
            
            <p style="margin: 0 0 20px 0; color: #3f3f46; line-height: 1.6;">
              Dans le cadre de l'examen de votre candidature pour <strong>${escapeHtml(startupName)}</strong>, 
              un document supplémentaire est nécessaire pour compléter votre dossier.
            </p>
            
            <!-- Document Type Box -->
            <div style="background-color: #fff7ed; border: 2px solid #f97316; padding: 20px; border-radius: 12px; margin: 24px 0; text-align: center;">
              <p style="margin: 0 0 8px 0; color: #9a3412; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">
                Document demandé
              </p>
              <p style="margin: 0; color: #c2410c; font-size: 18px; font-weight: 700;">
                📎 ${escapeHtml(document_label)}
              </p>
            </div>
            
            ${messageSection}
            
            <!-- CTA Button -->
            <div style="text-align: center; margin: 32px 0;">
              <a href="${appUrl}/suivi-candidature" 
                 style="display: inline-block; background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); color: white; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(249, 115, 22, 0.3);">
                Fournir le document
              </a>
            </div>
            
            <!-- Info Box -->
            <div style="background-color: #f4f4f5; padding: 16px; border-radius: 8px; margin-top: 24px;">
              <p style="margin: 0; color: #52525b; font-size: 14px; line-height: 1.6;">
                ⏱️ <strong>Délai recommandé :</strong> 7 jours<br>
                📧 Pour toute question, répondez directement à cet email.
              </p>
            </div>
          </div>
          
          <!-- Footer -->
          <div style="text-align: center; padding: 24px; color: #71717a; font-size: 12px;">
            <p style="margin: 0 0 8px 0;">
              Label Startup Numérique - Ministère de la Transition Numérique
            </p>
            <p style="margin: 0;">
              © ${new Date().getFullYear()} Côte d'Ivoire. Tous droits réservés.
            </p>
          </div>
        </div>
      </body>
      </html>
    `;

    console.log("notify-document-request: Sending email to", profile.email);

    const emailResponse = await resend.emails.send({
      from: "Label Startup Numérique <no-reply@notifications.ansut.ci>",
      to: [profile.email],
      subject: `📄 Document requis pour ${startupName} - Label Startup Numérique`,
      html: emailHtml,
    });

    console.log("notify-document-request: Email sent successfully", emailResponse);

    return new Response(
      JSON.stringify({ success: true, emailId: emailResponse.id }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );

  } catch (error: any) {
    console.error("notify-document-request: Error", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
