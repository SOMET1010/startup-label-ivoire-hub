/**
 * JSON-LD structured data generators for SEO
 */

const BASE_URL = "https://startup-label-ivoire-hub.lovable.app";

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Ivoire Hub",
    url: BASE_URL,
    logo: `${BASE_URL}/favicon.ico`,
    description:
      "Plateforme officielle de labellisation et d'accompagnement des startups numériques en Côte d'Ivoire.",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Abidjan",
      addressCountry: "CI",
    },
    contactPoint: {
      "@type": "ContactPoint",
      email: "contact@ivoirehub.ci",
      contactType: "customer service",
      availableLanguage: ["French", "English"],
    },
    sameAs: [
      "https://facebook.com",
      "https://twitter.com",
      "https://linkedin.com",
    ],
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Ivoire Hub",
    url: BASE_URL,
    description:
      "Plateforme officielle de labellisation des startups numériques en Côte d'Ivoire.",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${BASE_URL}/annuaire?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function faqPageJsonLd(
  faqs: { question: string; answer: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function breadcrumbJsonLd(
  items: { name: string; url: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function articleJsonLd(article: {
  title: string;
  description: string;
  image?: string;
  datePublished: string;
  dateModified?: string;
  author?: string;
  url: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    image: article.image,
    datePublished: article.datePublished,
    dateModified: article.dateModified || article.datePublished,
    author: {
      "@type": "Organization",
      name: article.author || "Ivoire Hub",
    },
    publisher: {
      "@type": "Organization",
      name: "Ivoire Hub",
      logo: {
        "@type": "ImageObject",
        url: `${BASE_URL}/favicon.ico`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": article.url,
    },
  };
}
