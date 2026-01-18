
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <div className="relative overflow-hidden bg-background">
      {/* Decorative elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-gradient-to-br from-ivoire-orange/20 to-ivoire-green/20 blur-3xl"></div>
        <div className="absolute left-0 bottom-0 h-72 w-72 rounded-full bg-gradient-to-tr from-ivoire-green/20 to-ivoire-orange/20 blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 md:pr-8 animate-fade-in">
            <div className="inline-block bg-gradient-to-r from-ivoire-orange to-ivoire-green rounded-full px-3 py-1 text-white text-sm font-medium mb-4">
              Loi n°2023-901 du 23 novembre 2023
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
              Labellisation des <span className="gradient-text">Startups Numériques</span> en Côte d'Ivoire
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Bénéficiez d'avantages fiscaux, accédez aux marchés publics et rejoignez un réseau d'innovateurs grâce au label Startup numérique ivoirien.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/postuler">
                <Button size="lg" className="w-full sm:w-auto">
                  Postuler au label
                </Button>
              </Link>
              <Link to="/criteres">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Critères d'éligibilité
                </Button>
              </Link>
            </div>
            <div className="mt-8 grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-ivoire-orange">500+</div>
                <div className="text-sm text-muted-foreground">Startups éligibles</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-ivoire-green">50+</div>
                <div className="text-sm text-muted-foreground">Startups labellisées</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">30+</div>
                <div className="text-sm text-muted-foreground">Structures d'accompagnement</div>
              </div>
            </div>
          </div>
          
          <div className="md:w-1/2 mt-8 md:mt-0 animate-slide-in">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-ivoire-orange to-ivoire-green rounded-xl transform rotate-3 scale-105"></div>
              <div className="relative bg-card rounded-xl shadow-lg p-8">
                <h3 className="text-xl font-bold mb-4">Comment obtenir le label ?</h3>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <div className="flex-shrink-0 bg-ivoire-orange/20 p-1 rounded-full mr-3 mt-1">
                      <div className="w-5 h-5 bg-ivoire-orange rounded-full flex items-center justify-center text-white font-bold text-xs">1</div>
                    </div>
                    <div>
                      <h4 className="font-bold">Créez un compte</h4>
                      <p className="text-muted-foreground text-sm">Inscrivez-vous sur la plateforme Ivoire Hub</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 bg-ivoire-orange/40 p-1 rounded-full mr-3 mt-1">
                      <div className="w-5 h-5 bg-ivoire-orange rounded-full flex items-center justify-center text-white font-bold text-xs">2</div>
                    </div>
                    <div>
                      <h4 className="font-bold">Complétez votre dossier</h4>
                      <p className="text-muted-foreground text-sm">Renseignez les informations sur votre startup et soumettez les documents requis</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 bg-ivoire-orange/60 p-1 rounded-full mr-3 mt-1">
                      <div className="w-5 h-5 bg-ivoire-orange rounded-full flex items-center justify-center text-white font-bold text-xs">3</div>
                    </div>
                    <div>
                      <h4 className="font-bold">Évaluation du comité</h4>
                      <p className="text-muted-foreground text-sm">Votre dossier est examiné par le Comité de Labellisation</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 bg-ivoire-orange/80 p-1 rounded-full mr-3 mt-1">
                      <div className="w-5 h-5 bg-ivoire-orange rounded-full flex items-center justify-center text-white font-bold text-xs">4</div>
                    </div>
                    <div>
                      <h4 className="font-bold">Obtention du label</h4>
                      <p className="text-muted-foreground text-sm">Recevez votre certification officielle et profitez des avantages</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
