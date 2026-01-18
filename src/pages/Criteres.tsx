import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CTA from "@/components/CTA";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ClipboardCheck, ArrowRight } from "lucide-react";
import { useBrand } from "@/hooks/useBrand";
import { InstitutionalHero, InstitutionalCard, OfficialBadge } from "@/components/gov";

const Criteres = () => {
  const { brand } = useBrand();
  const isInstitutional = brand === 'ansut';

  const criteria = [
    {
      title: "Être une entreprise légalement constituée en Côte d'Ivoire",
      description: "Votre entreprise doit être formellement enregistrée auprès des autorités compétentes avec un numéro RCCM valide.",
      variant: "primary" as const,
    },
    {
      title: "Avoir moins de 8 ans d'existence",
      description: "La date de création de votre entreprise, telle qu'elle figure sur les documents d'immatriculation, ne doit pas excéder 8 ans au moment de la demande.",
      variant: "success" as const,
    },
    {
      title: "Proposer un produit ou service innovant",
      description: "Votre offre doit intégrer une innovation technologique significative et se différencier des solutions existantes sur le marché.",
      variant: "primary" as const,
    },
    {
      title: "Avoir un modèle d'affaires scalable",
      description: "Votre modèle économique doit démontrer un potentiel de croissance rapide et une capacité à se développer à grande échelle.",
      variant: "success" as const,
    },
    {
      title: "Être détenue majoritairement par des personnes physiques",
      description: "Le capital social de votre entreprise doit être détenu à plus de 50% par des personnes physiques.",
      variant: "primary" as const,
    },
    {
      title: "Avoir un potentiel de création d'emplois",
      description: "Votre startup doit démontrer sa capacité à générer des emplois directs ou indirects en Côte d'Ivoire.",
      variant: "success" as const,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {/* Hero section */}
        {isInstitutional ? (
          <InstitutionalHero>
            <div className="max-w-3xl mx-auto text-center">
              <OfficialBadge variant="officiel" className="mb-4 inline-flex" />
              <h1 className="text-4xl font-bold mb-4">Critères d'éligibilité</h1>
              <p className="text-xl text-white/80">
                Découvrez les conditions requises pour obtenir le Label Startup numérique conformément à la Loi n°2023-901 du 23 novembre 2023.
              </p>
            </div>
          </InstitutionalHero>
        ) : (
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
        )}

        {/* Quiz CTA */}
        <section className={`py-8 border-y ${isInstitutional ? 'bg-gov-blue/5 border-gov-blue/10' : 'bg-primary/5 border-primary/10'}`}>
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isInstitutional ? 'bg-gov-blue/10' : 'bg-primary/10'}`}>
                  <ClipboardCheck className={`w-6 h-6 ${isInstitutional ? 'text-gov-blue' : 'text-primary'}`} />
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
            <div className="max-w-4xl mx-auto">
              {isInstitutional ? (
                <InstitutionalCard variant="primary" className="mb-8">
                  <h2 className="text-2xl font-bold mb-6 text-gov-blue">
                    Pour être éligible au Label Startup, votre entreprise doit :
                  </h2>
                  <div className="space-y-4">
                    {criteria.map((criterion, index) => (
                      <InstitutionalCard key={index} variant={criterion.variant} className="py-4">
                        <h3 className="font-bold text-lg mb-2">{criterion.title}</h3>
                        <p className="text-muted-foreground">{criterion.description}</p>
                      </InstitutionalCard>
                    ))}
                  </div>
                </InstitutionalCard>
              ) : (
                <div className="bg-card rounded-xl shadow-sm p-8">
                  <h2 className="text-2xl font-bold mb-6 text-ivoire-orange">Pour être éligible au Label Startup, votre entreprise doit :</h2>
                  <div className="space-y-6">
                    {criteria.map((criterion, index) => (
                      <div 
                        key={index} 
                        className={`border-l-4 pl-4 py-2 ${criterion.variant === 'primary' ? 'border-ivoire-orange' : 'border-ivoire-green'}`}
                      >
                        <h3 className="font-bold text-lg mb-2">{criterion.title}</h3>
                        <p className="text-muted-foreground">{criterion.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Documents requis */}
              {isInstitutional ? (
                <InstitutionalCard variant="success" showBadge badgeVariant="certifie" className="mt-8">
                  <h3 className="font-bold text-lg mb-4">Documents requis :</h3>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    <li>Formulaire de demande de labellisation (disponible sur la plateforme)</li>
                    <li>Registre de Commerce et du Crédit Mobilier (RCCM)</li>
                    <li>Déclaration fiscale d'existence</li>
                    <li>Statuts de l'entreprise</li>
                    <li>Business plan démontrant le caractère innovant et scalable</li>
                    <li>CV des fondateurs et membres clés de l'équipe</li>
                    <li>Présentation du produit ou service (pitch deck)</li>
                  </ul>
                </InstitutionalCard>
              ) : (
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
              )}
              
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