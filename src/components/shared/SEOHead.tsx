import { Helmet } from "react-helmet-async";

interface JsonLdData {
  [key: string]: unknown;
}

interface SEOHeadProps {
  title: string;
  description: string;
  path?: string;
  ogImage?: string;
  ogType?: string;
  noindex?: boolean;
  jsonLd?: JsonLdData | JsonLdData[];
}

const SITE_NAME = "Ivoire Hub";
const BASE_URL = "https://startup-label-ivoire-hub.lovable.app";
const DEFAULT_OG_IMAGE = `${BASE_URL}/og-image.png`;

export function SEOHead({
  title,
  description,
  path = "/",
  ogImage,
  ogType = "website",
  noindex = false,
  jsonLd,
}: SEOHeadProps) {
  const fullTitle = path === "/" ? title : `${title} | ${SITE_NAME}`;
  const canonicalUrl = `${BASE_URL}${path}`;
  const image = ogImage || DEFAULT_OG_IMAGE;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />

      {noindex && <meta name="robots" content="noindex, nofollow" />}

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="fr_CI" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* JSON-LD */}
      {jsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(Array.isArray(jsonLd) ? jsonLd : jsonLd)}
        </script>
      )}
    </Helmet>
  );
}
