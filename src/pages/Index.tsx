import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import AdvantagesSection from "@/components/AdvantagesSection";
import Stats from "@/components/Stats";
import Testimonials from "@/components/Testimonials";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import StartupJourney from "@/components/StartupJourney";
import { SEOHead } from "@/components/shared/SEOHead";
import { organizationJsonLd, websiteJsonLd } from "@/lib/seo/jsonld";

/**
 * Page d'accueil restructurée - 6 sections (vs 10 avant)
 * 
 * Structure:
 * 1. Hero - CTA unique + 3 stats
 * 2. StartupJourney - Parcours simplifié
 * 3. AdvantagesSection - 6 avantages (fusion Features + Benefits)
 * 4. Stats - Impact national (inchangé)
 * 5. Testimonials - Témoignages (inchangé)
 * 6. CTA - Conversion finale + FAQ intégré
 * 
 * Sections supprimées/déplacées:
 * - ComparisonTable → page /avantages uniquement
 * - Benefits → fusionné dans AdvantagesSection
 * - NewsFeed → page /actualites
 * - Contact → page dédiée + footer
 * - FaqCard standalone → intégré dans CTA
 */
const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead
        title="Ivoire Hub — Plateforme de labellisation des startups"
        description="Plateforme officielle de labellisation et d'accompagnement des startups numériques en Côte d'Ivoire. Obtenez le label, accédez au financement et à l'accompagnement."
        path="/"
        jsonLd={[organizationJsonLd(), websiteJsonLd()]}
      />
      <Navbar />
      <main id="main-content" className="flex-grow">
        {/* 1. Hero - Positionnement & CTA unique */}
        <Hero />
        
        {/* 2. Parcours - Timeline simplifiée */}
        <StartupJourney />
        
        {/* 3. Avantages - Fusion Features + Benefits */}
        <AdvantagesSection />
        
        {/* 4. Stats - Impact National */}
        <Stats />
        
        {/* 5. Témoignages - Preuve sociale */}
        <Testimonials />
        
        {/* 6. CTA Final + FAQ intégré */}
        <CTA />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
