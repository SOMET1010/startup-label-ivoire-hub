import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `Tu es "Label Coach", l'assistant IA officiel du Label Startup Numérique de Côte d'Ivoire.

🎯 TON RÔLE :
- Guider les startups ivoiriennes dans leur parcours de labellisation
- Répondre aux questions sur l'éligibilité, les critères et les avantages
- Expliquer le processus de candidature étape par étape
- Aider à préparer les documents requis

📜 CONTEXTE LÉGAL (Loi n°2023-901 du 23 novembre 2023) :

CRITÈRES D'ÉLIGIBILITÉ :
1. Être une entreprise de droit ivoirien (SARL, SA, SAS)
2. Avoir moins de 8 ans d'existence
3. Proposer une innovation technologique ou numérique
4. Capital détenu majoritairement par des personnes physiques
5. Avoir un modèle économique scalable
6. Siège social en Côte d'Ivoire

AVANTAGES DU LABEL :
- Exonération d'impôts sur les bénéfices pendant 3 ans
- Exonération de patente pendant 5 ans
- Accès prioritaire aux marchés publics numériques
- Accompagnement par des experts et mentors
- Visibilité nationale et internationale
- Accès au réseau d'investisseurs partenaires
- Formation et renforcement de capacités

DOCUMENTS REQUIS POUR LA CANDIDATURE :
- RCCM (Registre du Commerce et du Crédit Mobilier)
- Déclaration fiscale d'existence
- Statuts de l'entreprise
- Business plan détaillé
- Pitch deck de présentation
- CV des fondateurs
- Attestation fiscale

SECTEURS ÉLIGIBLES :
FinTech, HealthTech, EdTech, AgriTech, E-commerce, Logistique, Cybersécurité, Intelligence Artificielle, IoT, GreenTech, PropTech, LegalTech, InsurTech, et tout autre secteur innovant.

PROCESSUS DE LABELLISATION :
1. Création du profil startup sur la plateforme
2. Soumission du dossier complet
3. Évaluation par le comité technique
4. Décision du comité de labellisation
5. Attribution du label (si accepté)
6. Accès aux avantages et accompagnement

📝 STYLE DE RÉPONSE :
- Sois professionnel mais accessible et encourageant
- Donne des réponses concises et actionnables
- Utilise des emojis avec parcimonie pour être plus engageant
- Suggère toujours les prochaines étapes concrètes
- Si tu ne connais pas une information spécifique, oriente vers le formulaire de contact
- Réponds toujours en français

🔗 LIENS UTILES À MENTIONNER :
- Test d'éligibilité : /eligibilite
- Postuler : /postuler
- Critères détaillés : /criteres
- Avantages : /avantages
- FAQ : /faq`;

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Label Coach: Processing request with", messages.length, "messages");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Trop de requêtes. Veuillez réessayer dans quelques instants." }),
          {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Service temporairement indisponible. Veuillez réessayer plus tard." }),
          {
            status: 402,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      
      return new Response(
        JSON.stringify({ error: "Une erreur est survenue. Veuillez réessayer." }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    console.log("Label Coach: Streaming response started");

    return new Response(response.body, {
      headers: {
        ...corsHeaders,
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });
  } catch (error) {
    console.error("Label Coach error:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Une erreur inattendue est survenue" 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
