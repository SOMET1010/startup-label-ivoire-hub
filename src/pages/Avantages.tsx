
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CTA from "@/components/CTA";
import { Link } from "react-router-dom";

const Avantages = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {/* Hero section */}
        <section className="bg-gray-50 py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl font-bold mb-4">Avantages du Label Startup</h1>
              <p className="text-xl text-gray-600">
                Découvrez les bénéfices exclusifs offerts aux startups labellisées
              </p>
            </div>
          </div>
        </section>

        {/* Main content */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              {/* Fiscal benefits */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold mb-6 text-ivoire-orange">Avantages Fiscaux</h2>
                <div className="bg-white rounded-xl shadow-sm p-8">
                  <ul className="space-y-4">
                    <li className="flex items-start">
                      <div className="flex-shrink-0 h-6 w-6 rounded-full bg-ivoire-orange flex items-center justify-center mr-3 mt-1">
                        <span className="text-white font-bold text-xs">1</span>
                      </div>
                      <div>
                        <h3 className="font-bold">Exonération de l'impôt sur les bénéfices</h3>
                        <p className="text-gray-600">Exonération totale pendant les trois premières années suivant l'obtention du label, puis réduction de 50% pendant les deux années suivantes.</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 h-6 w-6 rounded-full bg-ivoire-orange flex items-center justify-center mr-3 mt-1">
                        <span className="text-white font-bold text-xs">2</span>
                      </div>
                      <div>
                        <h3 className="font-bold">Exonération de la contribution des patentes</h3>
                        <p className="text-gray-600">Dispense totale du paiement de la patente pendant cinq ans à compter de l'obtention du label.</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 h-6 w-6 rounded-full bg-ivoire-orange flex items-center justify-center mr-3 mt-1">
                        <span className="text-white font-bold text-xs">3</span>
                      </div>
                      <div>
                        <h3 className="font-bold">Exonération de taxes sur les salaires</h3>
                        <p className="text-gray-600">Réduction des charges sociales et patronales pour favoriser la création d'emplois.</p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Access to public markets */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold mb-6 text-ivoire-green">Accès aux Marchés Publics</h2>
                <div className="bg-white rounded-xl shadow-sm p-8">
                  <ul className="space-y-4">
                    <li className="flex items-start">
                      <div className="flex-shrink-0 h-6 w-6 rounded-full bg-ivoire-green flex items-center justify-center mr-3 mt-1">
                        <span className="text-white font-bold text-xs">1</span>
                      </div>
                      <div>
                        <h3 className="font-bold">Marchés réservés</h3>
                        <p className="text-gray-600">Accès à des marchés publics spécifiquement réservés aux startups labellisées.</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 h-6 w-6 rounded-full bg-ivoire-green flex items-center justify-center mr-3 mt-1">
                        <span className="text-white font-bold text-xs">2</span>
                      </div>
                      <div>
                        <h3 className="font-bold">Préférence nationale</h3>
                        <p className="text-gray-600">Traitement préférentiel dans l'attribution des marchés publics à compétences équivalentes.</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 h-6 w-6 rounded-full bg-ivoire-green flex items-center justify-center mr-3 mt-1">
                        <span className="text-white font-bold text-xs">3</span>
                      </div>
                      <div>
                        <h3 className="font-bold">Allègement des garanties</h3>
                        <p className="text-gray-600">Réduction des exigences de garanties financières pour les startups labellisées soumissionnant aux appels d'offres publics.</p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Funding and support */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold mb-6 text-startup-DEFAULT">Financement et Accompagnement</h2>
                <div className="bg-white rounded-xl shadow-sm p-8">
                  <ul className="space-y-4">
                    <li className="flex items-start">
                      <div className="flex-shrink-0 h-6 w-6 rounded-full bg-startup-DEFAULT flex items-center justify-center mr-3 mt-1">
                        <span className="text-white font-bold text-xs">1</span>
                      </div>
                      <div>
                        <h3 className="font-bold">Accès prioritaire aux fonds publics</h3>
                        <p className="text-gray-600">Priorité dans l'accès aux fonds d'investissements publics et aux programmes de subventions gouvernementales.</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 h-6 w-6 rounded-full bg-startup-DEFAULT flex items-center justify-center mr-3 mt-1">
                        <span className="text-white font-bold text-xs">2</span>
                      </div>
                      <div>
                        <h3 className="font-bold">Mise en relation avec les investisseurs</h3>
                        <p className="text-gray-600">Accès facilité aux réseaux d'investisseurs locaux et internationaux à travers la plateforme.</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 h-6 w-6 rounded-full bg-startup-DEFAULT flex items-center justify-center mr-3 mt-1">
                        <span className="text-white font-bold text-xs">3</span>
                      </div>
                      <div>
                        <h3 className="font-bold">Mentoring et formation</h3>
                        <p className="text-gray-600">Accès à des programmes de mentoring et de formation spécialement conçus pour les startups labellisées.</p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Visibility and networking */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold mb-6 text-investor-DEFAULT">Visibilité et Réseautage</h2>
                <div className="bg-white rounded-xl shadow-sm p-8">
                  <ul className="space-y-4">
                    <li className="flex items-start">
                      <div className="flex-shrink-0 h-6 w-6 rounded-full bg-investor-DEFAULT flex items-center justify-center mr-3 mt-1">
                        <span className="text-white font-bold text-xs">1</span>
                      </div>
                      <div>
                        <h3 className="font-bold">Référencement dans l'annuaire officiel</h3>
                        <p className="text-gray-600">Présence dans l'annuaire national des startups labellisées avec une fiche détaillée de présentation.</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 h-6 w-6 rounded-full bg-investor-DEFAULT flex items-center justify-center mr-3 mt-1">
                        <span className="text-white font-bold text-xs">2</span>
                      </div>
                      <div>
                        <h3 className="font-bold">Participation aux événements nationaux</h3>
                        <p className="text-gray-600">Invitations privilégiées aux événements officiels, salons professionnels et missions économiques.</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 h-6 w-6 rounded-full bg-investor-DEFAULT flex items-center justify-center mr-3 mt-1">
                        <span className="text-white font-bold text-xs">3</span>
                      </div>
                      <div>
                        <h3 className="font-bold">Communauté et réseau</h3>
                        <p className="text-gray-600">Intégration dans une communauté d'entrepreneurs innovants pour échanger des idées et développer des partenariats.</p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="text-center mt-12">
                <p className="text-xl mb-4">Prêt à bénéficier de tous ces avantages ?</p>
                <Link to="/postuler" className="inline-block px-6 py-3 bg-ivoire-orange text-white font-bold rounded-lg hover:bg-opacity-90 transition-colors">
                  Postuler au label maintenant
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

export default Avantages;
