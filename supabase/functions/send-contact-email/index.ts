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
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
              .content { background: #ffffff; padding: 30px; border: 1px solid #e0e0e0; border-top: none; }
              .summary { background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0; }
              .footer { background: #f9f9f9; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; font-size: 14px; color: #666; }
              .button { display: inline-block; background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 0; }
              h1 { margin: 0; font-size: 24px; }
              h2 { color: #667eea; font-size: 18px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>✓ Message envoyé avec succès</h1>
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
                <p>Cet email a été envoyé automatiquement depuis la plateforme Label Startup Numérique Côte d'Ivoire.</p>
                <p>© ${new Date().getFullYear()} Label Startup Numérique CI - Tous droits réservés</p>
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
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
              .content { background: #ffffff; padding: 30px; border: 1px solid #e0e0e0; border-top: none; }
              .contact-details { background: #f0f4ff; padding: 20px; border-left: 4px solid #667eea; margin: 20px 0; }
              .message-box { background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0; }
              .footer { background: #f9f9f9; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; font-size: 14px; color: #666; }
              .button { display: inline-block; background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 0; }
              h1 { margin: 0; font-size: 24px; }
              h2 { color: #667eea; font-size: 18px; margin-top: 0; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>📩 Nouvelle demande de contact</h1>
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
                <p style="font-size: 16px; color: #667eea;"><strong>${safeSubject}</strong></p>
                
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
                <p>Cet email a été envoyé automatiquement depuis la plateforme Label Startup Numérique Côte d'Ivoire.</p>
                <p>© ${new Date().getFullYear()} Label Startup Numérique CI - Tous droits réservés</p>
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
