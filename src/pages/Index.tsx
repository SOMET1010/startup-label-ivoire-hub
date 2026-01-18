import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Stats from "@/components/Stats";
import Testimonials from "@/components/Testimonials";
import Contact from "@/components/Contact";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import NewsFeed from "@/components/NewsFeed";
import FaqCard from "@/components/FaqCard";
import Benefits from "@/components/Benefits";
import StartupJourney from "@/components/StartupJourney";
import ComparisonTable from "@/components/ComparisonTable";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Premium - Positionnement & Confiance */}
        <Hero />
        
        {/* Parcours Startup - Timeline horizontale */}
        <StartupJourney />
        
        {/* Features - Avantages du label */}
        <Features />
        
        {/* Tableau Comparatif - Conversion */}
        <ComparisonTable />
        
        {/* Benefits - Détails des avantages */}
        <Benefits />
        
        {/* Stats - Impact National */}
        <Stats />
        
        {/* Témoignages - Preuve sociale */}
        <Testimonials />
        
        {/* Actualités */}
        <NewsFeed />
        
        {/* FAQ rapide */}
        <div className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-md mx-auto">
              <FaqCard />
            </div>
          </div>
        </div>
        
        {/* Contact */}
        <Contact />
        
        {/* CTA Final Premium */}
        <CTA />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
