import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Shield, Clock } from "lucide-react";
import PremiumBadge from "./PremiumBadge";
import FaqCard from "./FaqCard";
import { TRUST_INDICATORS } from "@/lib/constants/features";

const iconMap = {
  online: Shield,
  response: Clock,
  free: CheckCircle2,
} as const;

/**
 * CTA final simplifié avec FAQ intégré
 * 1 seul bouton principal + indicateurs de confiance + FAQ rapide
 */
const CTA = () => {
  return (
    <section 
      className="py-20 bg-gradient-to-br from-primary via-primary/95 to-primary/90 text-primary-foreground relative overflow-hidden"
      aria-labelledby="cta-title"
    >
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-secondary/15 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary-foreground/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: CTA content */}
          <div className="text-center lg:text-left">
            {/* Badge */}
            <div className="flex justify-center lg:justify-start mb-6">
              <PremiumBadge 
                variant="certified" 
                className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground" 
              />
            </div>

            {/* Heading */}
            <h2 id="cta-title" className="text-3xl md:text-4xl font-bold mb-4">
              Rejoignez les startups d'élite
            </h2>
            <p className="text-lg md:text-xl mb-8 text-primary-foreground/90 max-w-lg">
              Obtenez la reconnaissance officielle de l'État et accédez aux opportunités exclusives du label
            </p>

            {/* Single CTA */}
            <div className="mb-8">
              <Link to="/eligibilite">
                <Button 
                  size="lg" 
                  className="bg-secondary text-secondary-foreground hover:bg-secondary/90 px-8 py-6 text-lg font-semibold shadow-lg"
                  aria-label="Vérifier votre éligibilité au Label Startup"
                >
                  <CheckCircle2 className="mr-2 w-5 h-5" aria-hidden="true" />
                  Vérifier mon éligibilité
                </Button>
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-6 text-primary-foreground/80">
              {TRUST_INDICATORS.map((indicator) => {
                const Icon = iconMap[indicator.key];
                return (
                  <div key={indicator.key} className="flex items-center gap-2">
                    <Icon className="w-4 h-4" aria-hidden="true" />
                    <span className="text-sm font-medium">{indicator.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: FAQ Card */}
          <div className="lg:pl-8">
            <FaqCard />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
