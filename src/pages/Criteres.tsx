import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CTA from "@/components/CTA";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ClipboardCheck, ArrowRight } from "lucide-react";

const Criteres = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {/* Hero section */}
        <section className="bg-muted/50 py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl font-bold mb-4">Critères d'éligibilité</h1>
              <p className="text-xl text-muted-foreground">
                Découvrez les conditions requises pour obtenir le Label Startup numérique conformément à la Loi n°2023-901 du 23 novembre 2023.
              </p>
            </div>
          </div>
        </section>

        {/* Quiz CTA */}
        <section className="py-8 bg-primary/5 border-y border-primary/10">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <ClipboardCheck className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="font-semibold text-lg">Vérifiez votre éligibilité en 3 minutes</h2>
                  <p className="text-muted-foreground text-sm">
                    Répondez à quelques questions pour savoir si votre startup peut obtenir le Label
                  </p>
                </div>
              </div>
              <Link to="/eligibilite">
                <Button size="lg" className="gap-2 whitespace-nowrap">
                  Tester mon éligibilité
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Main content */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto bg-card rounded-xl shadow-sm p-8">
              <h2 className="text-2xl font-bold mb-6 text-ivoire-orange">Pour être éligible au Label Startup, votre entreprise doit :</h2>
              
              <div className="space-y-6">
                <div className="border-l-4 border-ivoire-orange pl-4 py-2">
                  <h3 className="font-bold text-lg mb-2">Être une entreprise légalement constituée en Côte d'Ivoire</h3>
                  <p className="text-muted-foreground">Votre entreprise doit être formellement enregistrée auprès des autorités compétentes avec un numéro RCCM valide.</p>
                </div>
                
                <div className="border-l-4 border-ivoire-green pl-4 py-2">
                  <h3 className="font-bold text-lg mb-2">Avoir moins de 8 ans d'existence</h3>
                  <p className="text-muted-foreground">La date de création de votre entreprise, telle qu'elle figure sur les documents d'immatriculation, ne doit pas excéder 8 ans au moment de la demande.</p>
                </div>
                
                <div className="border-l-4 border-ivoire-orange pl-4 py-2">
                  <h3 className="font-bold text-lg mb-2">Proposer un produit ou service innovant</h3>
                  <p className="text-muted-foreground">Votre offre doit intégrer une innovation technologique significative et se différencier des solutions existantes sur le marché.</p>
                </div>
                
                <div className="border-l-4 border-ivoire-green pl-4 py-2">
                  <h3 className="font-bold text-lg mb-2">Avoir un modèle d'affaires scalable</h3>
                  <p className="text-muted-foreground">Votre modèle économique doit démontrer un potentiel de croissance rapide et une capacité à se développer à grande échelle.</p>
                </div>
                
                <div className="border-l-4 border-ivoire-orange pl-4 py-2">
                  <h3 className="font-bold text-lg mb-2">Être détenue majoritairement par des personnes physiques</h3>
                  <p className="text-muted-foreground">Le capital social de votre entreprise doit être détenu à plus de 50% par des personnes physiques.</p>
                </div>
                
                <div className="border-l-4 border-ivoire-green pl-4 py-2">
                  <h3 className="font-bold text-lg mb-2">Avoir un potentiel de création d'emplois</h3>
                  <p className="text-muted-foreground">Votre startup doit démontrer sa capacité à générer des emplois directs ou indirects en Côte d'Ivoire.</p>
                </div>
              </div>
              
              <div className="mt-8 p-4 bg-muted/50 rounded-lg">
                <h3 className="font-bold text-lg mb-2">Documents requis :</h3>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Formulaire de demande de labellisation (disponible sur la plateforme)</li>
                  <li>Registre de Commerce et du Crédit Mobilier (RCCM)</li>
                  <li>Déclaration fiscale d'existence</li>
                  <li>Statuts de l'entreprise</li>
                  <li>Business plan démontrant le caractère innovant et scalable</li>
                  <li>CV des fondateurs et membres clés de l'équipe</li>
                  <li>Présentation du produit ou service (pitch deck)</li>
                </ul>
              </div>
              
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/eligibilite">
                  <Button variant="outline" size="lg" className="gap-2 w-full sm:w-auto">
                    <ClipboardCheck className="w-4 h-4" />
                    Vérifier mon éligibilité
                  </Button>
                </Link>
                <Link to="/postuler">
                  <Button size="lg" className="w-full sm:w-auto">
                    Postuler au label
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
        
        <CTA />
      </main>
      <Footer />
    </div>
  );
};

export default Criteres;
