// Shared CORS configuration for all Edge Functions
// Sécurise les origines autorisées au lieu de '*'

const ALLOWED_ORIGINS = [
  "https://startup-label-ivoire-hub.lovable.app",
  "https://id-preview--dd3b9da6-66d1-4628-963c-165b447fe9e7.lovable.app",
];

export function getCorsHeaders(request: Request): Record<string, string> {
  const origin = request.headers.get("Origin") || "";
  
  // Autoriser tous les sous-domaines .lovable.app pour les previews
  const isAllowed = ALLOWED_ORIGINS.includes(origin) || origin.endsWith(".lovable.app");
  
  return {
    "Access-Control-Allow-Origin": isAllowed ? origin : ALLOWED_ORIGINS[0],
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  };
}

export function handleCorsPreflightRequest(request: Request): Response | null {
  if (request.method === "OPTIONS") {
    return new Response(null, { headers: getCorsHeaders(request) });
  }
  return null;
}
