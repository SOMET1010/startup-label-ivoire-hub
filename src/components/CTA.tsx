import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Clock, CheckCircle2 } from "lucide-react";
import PremiumBadge from "./PremiumBadge";

const CTA = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-primary via-primary/95 to-primary/90 text-primary-foreground relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary-foreground/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 text-center relative z-10">
        {/* Badge */}
        <div className="flex justify-center mb-8">
          <PremiumBadge variant="certified" className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground" />
        </div>

        {/* Heading */}
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
          Rejoignez les startups d'élite
        </h2>
        <p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto text-primary-foreground/90">
          Obtenez la reconnaissance officielle de l'État et accédez aux opportunités exclusives du label
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
          <Link to="/eligibilite">
            <Button 
              size="lg" 
              className="w-full sm:w-auto bg-secondary text-secondary-foreground hover:bg-secondary/90 px-8 py-6 text-lg font-semibold shadow-lg"
            >
              <CheckCircle2 className="mr-2 w-5 h-5" />
              Vérifier mon éligibilité
            </Button>
          </Link>
          <Link to="/postuler">
            <Button 
              size="lg" 
              variant="outline" 
              className="w-full sm:w-auto border-2 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 px-8 py-6 text-lg font-semibold"
            >
              Postuler maintenant
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>

        {/* Trust indicators */}
        <div className="flex flex-wrap justify-center gap-6 md:gap-10 text-primary-foreground/80">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            <span className="text-sm font-medium">Processus 100% en ligne</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            <span className="text-sm font-medium">Réponse sous 30 jours</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5" />
            <span className="text-sm font-medium">Accompagnement gratuit</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
