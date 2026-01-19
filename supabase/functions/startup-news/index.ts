import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

import { getCorsHeaders, handleCorsPreflightRequest } from "../_shared/cors.ts";

serve(async (req) => {
  const corsResponse = handleCorsPreflightRequest(req);
  if (corsResponse) return corsResponse;
  const corsHeaders = getCorsHeaders(req);

  try {
    const PERPLEXITY_API_KEY = Deno.env.get("PERPLEXITY_API_KEY");
    if (!PERPLEXITY_API_KEY) {
      throw new Error("PERPLEXITY_API_KEY is not configured");
    }

    const { 
      query = "startups technologiques Côte d'Ivoire actualités",
      category = null,
      limit = 10
    } = await req.json().catch(() => ({}));

    const categoryFilter = category ? ` dans la catégorie ${category}` : "";

    console.log("Fetching news for query:", query);

    const response = await fetch("https://api.perplexity.ai/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${PERPLEXITY_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "sonar",
        messages: [
          {
            role: "system",
            content: `Tu es un journaliste spécialisé dans l'écosystème startup africain, particulièrement en Côte d'Ivoire. 
            Tu dois retourner les actualités les plus récentes et pertinentes au format JSON.
            Chaque actualité doit avoir: id, title, excerpt (résumé court), date (format YYYY-MM-DD), category, sourceUrl.
            Les catégories possibles sont: Annonces, Événements, Succès, Partenariats, Formations, Investissements.
            Retourne uniquement le JSON sans aucun texte avant ou après.`
          },
          {
            role: "user",
            content: `Trouve les ${limit} dernières actualités sur ${query}${categoryFilter}. Retourne un tableau JSON avec les actualités les plus récentes et pertinentes.`
          }
        ],
        search_recency_filter: "month",
        response_format: {
          type: "json_schema",
          json_schema: {
            name: "news_response",
            schema: {
              type: "object",
              properties: {
                news: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      id: { type: "string" },
                      title: { type: "string" },
                      excerpt: { type: "string" },
                      date: { type: "string" },
                      category: { type: "string" },
                      sourceUrl: { type: "string" }
                    },
                    required: ["id", "title", "excerpt", "date", "category"]
                  }
                }
              },
              required: ["news"]
            }
          }
        }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Perplexity API error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Limite de requêtes atteinte, veuillez réessayer plus tard." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    console.log("Perplexity response:", JSON.stringify(data));

    const content = data.choices?.[0]?.message?.content;
    const citations = data.citations || [];
    
    let newsData;
    try {
      newsData = typeof content === "string" ? JSON.parse(content) : content;
    } catch (e) {
      console.error("Failed to parse news content:", content);
      newsData = { news: [] };
    }

    return new Response(
      JSON.stringify({
        news: newsData.news || [],
        citations,
        lastUpdated: new Date().toISOString()
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error in startup-news function:", error);
    return new Response(
      JSON.stringify({ error: error.message, news: [] }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
