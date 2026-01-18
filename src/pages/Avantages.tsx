import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CTA from "@/components/CTA";
import { Link } from "react-router-dom";
import { useBrand } from "@/hooks/useBrand";
import { InstitutionalHero, InstitutionalCard, OfficialBadge } from "@/components/gov";

const Avantages = () => {
  const { brand } = useBrand();
  const isInstitutional = brand === 'ansut';

  const fiscalBenefits = [
    {
      title: "Exonération de l'impôt sur les bénéfices",
      description: "Exonération totale pendant les trois premières années suivant l'obtention du label, puis réduction de 50% pendant les deux années suivantes.",
    },
    {
      title: "Exonération de la contribution des patentes",
      description: "Dispense totale du paiement de la patente pendant cinq ans à compter de l'obtention du label.",
    },
    {
      title: "Exonération de taxes sur les salaires",
      description: "Réduction des charges sociales et patronales pour favoriser la création d'emplois.",
    },
  ];

  const publicMarkets = [
    {
      title: "Marchés réservés",
      description: "Accès à des marchés publics spécifiquement réservés aux startups labellisées.",
    },
    {
      title: "Préférence nationale",
      description: "Traitement préférentiel dans l'attribution des marchés publics à compétences équivalentes.",
    },
    {
      title: "Allègement des garanties",
      description: "Réduction des exigences de garanties financières pour les startups labellisées soumissionnant aux appels d'offres publics.",
    },
  ];

  const funding = [
    {
      title: "Accès prioritaire aux fonds publics",
      description: "Priorité dans l'accès aux fonds d'investissements publics et aux programmes de subventions gouvernementales.",
    },
    {
      title: "Mise en relation avec les investisseurs",
      description: "Accès facilité aux réseaux d'investisseurs locaux et internationaux à travers la plateforme.",
    },
    {
      title: "Mentoring et formation",
      description: "Accès à des programmes de mentoring et de formation spécialement conçus pour les startups labellisées.",
    },
  ];

  const visibility = [
    {
      title: "Référencement dans l'annuaire officiel",
      description: "Présence dans l'annuaire national des startups labellisées avec une fiche détaillée de présentation.",
    },
    {
      title: "Participation aux événements nationaux",
      description: "Invitations privilégiées aux événements officiels, salons professionnels et missions économiques.",
    },
    {
      title: "Communauté et réseau",
      description: "Intégration dans une communauté d'entrepreneurs innovants pour échanger des idées et développer des partenariats.",
    },
  ];

  const renderBenefitList = (
    items: { title: string; description: string }[],
    color: string,
    isInstitutional: boolean
  ) => (
    <ul className="space-y-4">
      {items.map((item, index) => (
        <li key={index} className="flex items-start">
          <div className={`flex-shrink-0 h-6 w-6 rounded-full flex items-center justify-center mr-3 mt-1 ${
            isInstitutional ? 'bg-gov-blue' : `bg-${color}`
          }`}>
            <span className="text-white font-bold text-xs">{index + 1}</span>
          </div>
          <div>
            <h3 className="font-bold">{item.title}</h3>
            <p className="text-muted-foreground">{item.description}</p>
          </div>
        </li>
      ))}
    </ul>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {/* Hero section */}
        {isInstitutional ? (
          <InstitutionalHero>
            <div className="max-w-3xl mx-auto text-center">
              <OfficialBadge variant="officiel" className="mb-4 inline-flex" />
              <h1 className="text-4xl font-bold mb-4">Avantages du Label Startup</h1>
              <p className="text-xl text-white/80">
                Découvrez les bénéfices exclusifs offerts aux startups labellisées
              </p>
            </div>
          </InstitutionalHero>
        ) : (
          <section className="bg-muted/50 py-12">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto text-center">
                <h1 className="text-4xl font-bold mb-4">Avantages du Label Startup</h1>
                <p className="text-xl text-muted-foreground">
                  Découvrez les bénéfices exclusifs offerts aux startups labellisées
                </p>
              </div>
            </div>
          </section>
        )}

        {/* Main content */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto space-y-12">
              {/* Fiscal benefits */}
              <div>
                <h2 className={`text-2xl font-bold mb-6 ${isInstitutional ? 'text-gov-blue' : 'text-ivoire-orange'}`}>
                  Avantages Fiscaux
                </h2>
                {isInstitutional ? (
                  <InstitutionalCard variant="primary" showBadge badgeVariant="certifie">
                    {renderBenefitList(fiscalBenefits, 'ivoire-orange', isInstitutional)}
                  </InstitutionalCard>
                ) : (
                  <div className="bg-card rounded-xl shadow-sm p-8">
                    {renderBenefitList(fiscalBenefits, 'ivoire-orange', isInstitutional)}
                  </div>
                )}
              </div>

              {/* Access to public markets */}
              <div>
                <h2 className={`text-2xl font-bold mb-6 ${isInstitutional ? 'text-gov-green' : 'text-ivoire-green'}`}>
                  Accès aux Marchés Publics
                </h2>
                {isInstitutional ? (
                  <InstitutionalCard variant="success" showBadge badgeVariant="officiel">
                    {renderBenefitList(publicMarkets, 'ivoire-green', isInstitutional)}
                  </InstitutionalCard>
                ) : (
                  <div className="bg-card rounded-xl shadow-sm p-8">
                    {renderBenefitList(publicMarkets, 'ivoire-green', isInstitutional)}
                  </div>
                )}
              </div>

              {/* Funding and support */}
              <div>
                <h2 className={`text-2xl font-bold mb-6 ${isInstitutional ? 'text-gov-blue' : 'text-startup-DEFAULT'}`}>
                  Financement et Accompagnement
                </h2>
                {isInstitutional ? (
                  <InstitutionalCard variant="primary">
                    {renderBenefitList(funding, 'startup-DEFAULT', isInstitutional)}
                  </InstitutionalCard>
                ) : (
                  <div className="bg-card rounded-xl shadow-sm p-8">
                    {renderBenefitList(funding, 'startup-DEFAULT', isInstitutional)}
                  </div>
                )}
              </div>

              {/* Visibility and networking */}
              <div>
                <h2 className={`text-2xl font-bold mb-6 ${isInstitutional ? 'text-gov-green' : 'text-investor-DEFAULT'}`}>
                  Visibilité et Réseautage
                </h2>
                {isInstitutional ? (
                  <InstitutionalCard variant="success">
                    {renderBenefitList(visibility, 'investor-DEFAULT', isInstitutional)}
                  </InstitutionalCard>
                ) : (
                  <div className="bg-card rounded-xl shadow-sm p-8">
                    {renderBenefitList(visibility, 'investor-DEFAULT', isInstitutional)}
                  </div>
                )}
              </div>

              <div className="text-center mt-12">
                <p className="text-xl mb-4">Prêt à bénéficier de tous ces avantages ?</p>
                <Link to="/postuler" className={`inline-block px-6 py-3 text-white font-bold rounded-lg hover:opacity-90 transition-opacity ${
                  isInstitutional ? 'bg-gov-blue' : 'bg-ivoire-orange'
                }`}>
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