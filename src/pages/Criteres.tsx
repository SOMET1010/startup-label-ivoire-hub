
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CTA from "@/components/CTA";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Criteres = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {/* Hero section */}
        <section className="bg-gray-50 py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl font-bold mb-4">Critères d'éligibilité</h1>
              <p className="text-xl text-gray-600">
                Découvrez les conditions requises pour obtenir le Label Startup numérique conformément à la Loi n°2023-901 du 23 novembre 2023.
              </p>
            </div>
          </div>
        </section>

        {/* Main content */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm p-8">
              <h2 className="text-2xl font-bold mb-6 text-ivoire-orange">Pour être éligible au Label Startup, votre entreprise doit :</h2>
              
              <div className="space-y-6">
                <div className="border-l-4 border-ivoire-orange pl-4 py-2">
                  <h3 className="font-bold text-lg mb-2">Être une entreprise légalement constituée en Côte d'Ivoire</h3>
                  <p className="text-gray-600">Votre entreprise doit être formellement enregistrée auprès des autorités compétentes avec un numéro RCCM valide.</p>
                </div>
                
                <div className="border-l-4 border-ivoire-green pl-4 py-2">
                  <h3 className="font-bold text-lg mb-2">Avoir moins de 8 ans d'existence</h3>
                  <p className="text-gray-600">La date de création de votre entreprise, telle qu'elle figure sur les documents d'immatriculation, ne doit pas excéder 8 ans au moment de la demande.</p>
                </div>
                
                <div className="border-l-4 border-ivoire-orange pl-4 py-2">
                  <h3 className="font-bold text-lg mb-2">Proposer un produit ou service innovant</h3>
                  <p className="text-gray-600">Votre offre doit intégrer une innovation technologique significative et se différencier des solutions existantes sur le marché.</p>
                </div>
                
                <div className="border-l-4 border-ivoire-green pl-4 py-2">
                  <h3 className="font-bold text-lg mb-2">Avoir un modèle d'affaires scalable</h3>
                  <p className="text-gray-600">Votre modèle économique doit démontrer un potentiel de croissance rapide et une capacité à se développer à grande échelle.</p>
                </div>
                
                <div className="border-l-4 border-ivoire-orange pl-4 py-2">
                  <h3 className="font-bold text-lg mb-2">Être détenue majoritairement par des personnes physiques</h3>
                  <p className="text-gray-600">Le capital social de votre entreprise doit être détenu à plus de 50% par des personnes physiques.</p>
                </div>
                
                <div className="border-l-4 border-ivoire-green pl-4 py-2">
                  <h3 className="font-bold text-lg mb-2">Avoir un potentiel de création d'emplois</h3>
                  <p className="text-gray-600">Votre startup doit démontrer sa capacité à générer des emplois directs ou indirects en Côte d'Ivoire.</p>
                </div>
              </div>
              
              <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-bold text-lg mb-2">Documents requis :</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-600">
                  <li>Formulaire de demande de labellisation (disponible sur la plateforme)</li>
                  <li>Registre de Commerce et du Crédit Mobilier (RCCM)</li>
                  <li>Déclaration fiscale d'existence</li>
                  <li>Statuts de l'entreprise</li>
                  <li>Business plan démontrant le caractère innovant et scalable</li>
                  <li>CV des fondateurs et membres clés de l'équipe</li>
                  <li>Présentation du produit ou service (pitch deck)</li>
                </ul>
              </div>
              
              <div className="mt-8 flex justify-center">
                <Link to="/postuler">
                  <Button size="lg">
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
