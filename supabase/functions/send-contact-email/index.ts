import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

import { getCorsHeaders, handleCorsPreflightRequest } from "../_shared/cors.ts";

interface ContactEmailRequest {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  companyName: string;
  companyEmail: string;
}

const handler = async (req: Request): Promise<Response> => {
  const corsResponse = handleCorsPreflightRequest(req);
  if (corsResponse) return corsResponse;
  const corsHeaders = getCorsHeaders(req);

  try {
    const { 
      name, 
      email, 
      phone, 
      subject, 
      message, 
      companyName, 
      companyEmail 
    }: ContactEmailRequest = await req.json();

    // Server-side validation with strict input sanitization
    if (!name || typeof name !== 'string' || name.trim().length === 0 || name.length > 100) {
      throw new Error("Nom invalide");
    }
    
    // Strict email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || typeof email !== 'string' || !emailRegex.test(email) || email.length > 255) {
      throw new Error("Email invalide");
    }
    
    if (phone && (typeof phone !== 'string' || phone.length > 20)) {
      throw new Error("Téléphone invalide");
    }
    
    if (!subject || typeof subject !== 'string' || subject.trim().length === 0 || subject.length > 200) {
      throw new Error("Sujet invalide");
    }
    
    if (!message || typeof message !== 'string' || message.trim().length < 10 || message.length > 2000) {
      throw new Error("Message invalide (10-2000 caractères requis)");
    }
    
    if (!companyName || typeof companyName !== 'string' || companyName.length > 200) {
      throw new Error("Nom d'entreprise invalide");
    }
    
    if (!companyEmail || typeof companyEmail !== 'string' || !emailRegex.test(companyEmail) || companyEmail.length > 255) {
      throw new Error("Email entreprise invalide");
    }

    // Sanitize inputs for HTML context (basic HTML entity encoding)
    const escapeHtml = (str: string): string => {
      return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    };
    
    const safeName = escapeHtml(name.trim());
    const safeSubject = escapeHtml(subject.trim());
    const safeMessage = escapeHtml(message.trim());
    const safeCompanyName = escapeHtml(companyName.trim());
    const safePhone = phone ? escapeHtml(phone.trim()) : null;

    console.log(`Sending contact emails for company`);

    // Email 1: Confirmation au visiteur
    const confirmationEmail = await resend.emails.send({
      from: "Label Startup Numérique <no-reply@notifications.ansut.ci>",
      to: [email],
      subject: `Votre message a bien été envoyé à ${safeCompanyName}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f5; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #f97316 0%, #16a34a 100%); color: white; padding: 30px; text-align: center; border-radius: 12px 12px 0 0; }
              .content { background: #ffffff; padding: 32px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
              .summary { background: #fff7ed; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f97316; }
              .footer { text-align: center; padding: 24px; font-size: 12px; color: #71717a; }
              .button { display: inline-block; background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 10px 0; box-shadow: 0 4px 12px rgba(249,115,22,0.3); }
              h1 { margin: 0; font-size: 24px; font-weight: 700; }
              h2 { color: #c2410c; font-size: 18px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>✓ Message envoyé avec succès</h1>
                <p style="margin: 8px 0 0; opacity: 0.9; font-size: 14px;">Label Startup Numérique · Côte d'Ivoire</p>
              </div>
              <div class="content">
                <p>Bonjour <strong>${safeName}</strong>,</p>
                <p>Nous avons bien reçu votre message destiné à <strong>${safeCompanyName}</strong>.</p>
                
                <div class="summary">
                  <h2>Résumé de votre demande</h2>
                  <p><strong>Sujet :</strong> ${safeSubject}</p>
                  <p><strong>Message :</strong></p>
                  <p style="white-space: pre-wrap;">${safeMessage}</p>
                </div>
                
                <p>L'entreprise vous répondra sous <strong>48 heures ouvrées</strong> à l'adresse : <strong>${email}</strong></p>
                
                <p><strong>Coordonnées de l'entreprise :</strong></p>
                <ul>
                  <li>Email : <a href="mailto:${companyEmail}">${companyEmail}</a></li>
                </ul>
              </div>
              <div class="footer">
                <p style="margin: 0 0 8px;">Label Startup Numérique - Ministère de la Transition Numérique</p>
                <p style="margin: 0;">© ${new Date().getFullYear()} Côte d'Ivoire. Tous droits réservés.</p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    console.log("Confirmation email sent:", confirmationEmail);

    // Email 2: Notification à l'entreprise
    const notificationEmail = await resend.emails.send({
      from: "Label Startup Numérique <no-reply@notifications.ansut.ci>",
      to: [companyEmail],
      replyTo: email,
      subject: `Nouvelle demande de contact - Label Startup Numérique`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f5; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #f97316 0%, #16a34a 100%); color: white; padding: 30px; text-align: center; border-radius: 12px 12px 0 0; }
              .content { background: #ffffff; padding: 32px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
              .contact-details { background: #fff7ed; padding: 20px; border-left: 4px solid #f97316; margin: 20px 0; border-radius: 0 8px 8px 0; }
              .message-box { background: #f4f4f5; padding: 20px; border-radius: 8px; margin: 20px 0; }
              .footer { text-align: center; padding: 24px; font-size: 12px; color: #71717a; }
              .button { display: inline-block; background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 10px 0; box-shadow: 0 4px 12px rgba(249,115,22,0.3); }
              h1 { margin: 0; font-size: 24px; font-weight: 700; }
              h2 { color: #c2410c; font-size: 18px; margin-top: 0; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>📩 Nouvelle demande de contact</h1>
                <p style="margin: 8px 0 0; opacity: 0.9; font-size: 14px;">Label Startup Numérique · Côte d'Ivoire</p>
              </div>
              <div class="content">
                <p>Bonjour,</p>
                <p>Vous avez reçu une nouvelle demande de contact via la plateforme Label Startup Numérique.</p>
                
                <div class="contact-details">
                  <h2>Informations du visiteur</h2>
                  <p><strong>Nom :</strong> ${safeName}</p>
                  <p><strong>Email :</strong> <a href="mailto:${email}">${email}</a></p>
                  <p><strong>Téléphone :</strong> ${safePhone || "Non fourni"}</p>
                </div>
                
                <p><strong>Sujet de la demande :</strong></p>
                <p style="font-size: 16px; color: #c2410c;"><strong>${safeSubject}</strong></p>
                
                <div class="message-box">
                  <h2>Message complet</h2>
                  <p style="white-space: pre-wrap;">${safeMessage}</p>
                </div>
                
                <p><strong>Date de soumission :</strong> ${new Date().toLocaleString("fr-FR", { 
                  timeZone: "Africa/Abidjan",
                  dateStyle: "full",
                  timeStyle: "short"
                })}</p>
                
                <center>
                  <a href="mailto:${email}?subject=Re: ${encodeURIComponent(safeSubject)}" class="button">
                    Répondre par email
                  </a>
                </center>
              </div>
              <div class="footer">
                <p style="margin: 0 0 8px;">Label Startup Numérique - Ministère de la Transition Numérique</p>
                <p style="margin: 0;">© ${new Date().getFullYear()} Côte d'Ivoire. Tous droits réservés.</p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    console.log("Notification email sent:", notificationEmail);

    return new Response(
      JSON.stringify({ 
        success: true, 
        confirmationId: confirmationEmail.id,
        notificationId: notificationEmail.id 
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
    console.error("Error in send-contact-email function:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message || "Une erreur est survenue lors de l'envoi" 
      }),
      {
        status: 500,
        headers: { 
          "Content-Type": "application/json", 
          ...corsHeaders 
        },
      }
    );
  }
};

serve(handler);
