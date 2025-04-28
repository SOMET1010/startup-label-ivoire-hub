
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const FAQ = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const isMobile = useIsMobile();

  const faqCategories = [
    {
      category: "Le Label Startup",
      questions: [
        {
          question: "Qu'est-ce que le Label Startup Numérique en Côte d'Ivoire ?",
          answer: "Le Label Startup Numérique est une reconnaissance officielle accordée par le gouvernement ivoirien aux entreprises innovantes du secteur numérique répondant à des critères spécifiques. Institué par la loi n°2023-901 du 23 novembre 2023, ce label vise à promouvoir l'écosystème entrepreneurial numérique en Côte d'Ivoire."
        },
        {
          question: "Quelle est la durée de validité du Label Startup ?",
          answer: "Le Label Startup est accordé pour une période de 5 ans, renouvelable sous conditions. Pendant cette période, les startups labellisées doivent soumettre un rapport annuel d'activité pour maintenir leur statut."
        },
        {
          question: "Comment puis-je vérifier l'authenticité d'un Label Startup ?",
          answer: "L'authenticité d'un Label Startup peut être vérifiée sur notre plateforme Ivoire Hub dans la section 'Annuaire des startups labellisées'. Chaque startup labellisée dispose d'un certificat numérique avec un QR code permettant de vérifier sa validité."
        }
      ]
    },
    {
      category: "Éligibilité",
      questions: [
        {
          question: "Qui peut postuler pour le Label Startup ?",
          answer: "Toute entreprise légalement constituée en Côte d'Ivoire, ayant moins de 8 ans d'existence, opérant principalement dans le secteur numérique, et proposant un produit, service ou modèle d'affaires innovant peut postuler pour le Label Startup."
        },
        {
          question: "Ma startup doit-elle déjà être rentable pour postuler ?",
          answer: "Non, la rentabilité n'est pas un critère d'éligibilité. Cependant, vous devez présenter un business model viable et démontrer le potentiel de croissance de votre solution."
        },
        {
          question: "Les startups étrangères peuvent-elles obtenir le label ?",
          answer: "Les startups étrangères peuvent obtenir le label à condition d'être légalement enregistrées en Côte d'Ivoire et que leurs activités principales soient exercées sur le territoire ivoirien."
        }
      ]
    },
    {
      category: "Processus de candidature",
      questions: [
        {
          question: "Comment postuler pour le Label Startup ?",
          answer: "Pour postuler, créez un compte sur la plateforme Ivoire Hub, complétez le formulaire de candidature en ligne, téléchargez les documents requis et soumettez votre dossier. Vous recevrez un identifiant de suivi pour suivre l'état de votre candidature."
        },
        {
          question: "Quels documents dois-je fournir pour ma candidature ?",
          answer: "Les documents requis incluent : le registre de commerce, l'attestation fiscale, le business plan, la présentation de l'équipe fondatrice, la description détaillée du produit/service, et les preuves de l'innovation (brevets, prototypes, etc.)."
        },
        {
          question: "Combien de temps prend le processus d'évaluation ?",
          answer: "Le processus d'évaluation prend généralement entre 45 et 60 jours, incluant l'examen du dossier, les entretiens potentiels et la décision finale du Comité de Labellisation."
        },
        {
          question: "Ma candidature a été rejetée. Puis-je postuler à nouveau ?",
          answer: "Oui, vous pouvez soumettre une nouvelle candidature après un délai de 6 mois. Nous vous recommandons de prendre en compte les retours fournis suite à votre première candidature pour améliorer votre dossier."
        }
      ]
    },
    {
      category: "Avantages et obligations",
      questions: [
        {
          question: "Quels sont les avantages fiscaux du Label Startup ?",
          answer: "Les startups labellisées bénéficient d'exonérations d'impôts sur les bénéfices, de la contribution des patentes et d'autres taxes locales pendant 5 ans. Elles sont également exonérées des droits de douane sur les équipements techniques importés liés à leur activité principale."
        },
        {
          question: "Comment accéder aux marchés publics réservés aux startups labellisées ?",
          answer: "Les startups labellisées ont accès à une plateforme dédiée aux appels d'offres publics réservés. Elles bénéficient également d'une préférence de 15% dans l'attribution des marchés publics dans leur domaine d'expertise."
        },
        {
          question: "Quelles sont les obligations des startups labellisées ?",
          answer: "Les startups labellisées doivent soumettre un rapport annuel d'activité, maintenir une activité principale dans le secteur numérique, participer aux événements de l'écosystème, et mentionner leur statut de startup labellisée dans leurs communications."
        }
      ]
    },
    {
      category: "Accompagnement",
      questions: [
        {
          question: "Quel type d'accompagnement est offert aux startups labellisées ?",
          answer: "Les startups labellisées bénéficient d'un accompagnement personnalisé incluant du mentorat, des formations, l'accès à des espaces de travail partagés, la mise en relation avec des investisseurs potentiels et l'accès à des événements exclusifs de l'écosystème."
        },
        {
          question: "Comment puis-je être mis en relation avec des investisseurs ?",
          answer: "La plateforme Ivoire Hub organise régulièrement des sessions de pitch et des événements de networking avec des investisseurs locaux et internationaux. Les startups labellisées peuvent également demander à être mises en relation directe avec des investisseurs partenaires via leur espace personnel."
        },
        {
          question: "Les startups labellisées peuvent-elles accéder à des financements publics ?",
          answer: "Oui, les startups labellisées ont un accès prioritaire aux programmes de financement publics comme le Fonds pour l'Innovation Numérique (FIN) et peuvent bénéficier de garanties pour faciliter l'obtention de prêts bancaires."
        }
      ]
    }
  ];

  const filteredFaqs = searchTerm 
    ? faqCategories.map(category => ({
        ...category,
        questions: category.questions.filter(q => 
          q.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
          q.answer.toLowerCase().includes(searchTerm.toLowerCase())
        )
      })).filter(category => category.questions.length > 0)
    : faqCategories;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <div className="bg-gradient-to-r from-ivoire-orange to-ivoire-green py-16 text-white">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Foire Aux Questions</h1>
            <p className="text-xl opacity-90 max-w-3xl mx-auto">
              Tout ce que vous devez savoir sur le Label Startup Numérique en Côte d'Ivoire
            </p>
            <div className="relative max-w-xl mx-auto mt-8">
              <Input
                type="text"
                placeholder="Rechercher une question..."
                className="pl-10 py-6 bg-white/10 border-white/20 text-white placeholder:text-white/70"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-3 text-white/70" />
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          {filteredFaqs.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium text-gray-700">Aucun résultat trouvé</h3>
              <p className="text-gray-500 mt-2">Essayez de modifier votre recherche</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1">
                <Card className={`sticky ${isMobile ? "" : "top-10"} p-4 bg-gray-50`}>
                  <h2 className="text-xl font-bold mb-4">Catégories</h2>
                  <nav>
                    <ul className="space-y-2">
                      {filteredFaqs.map((category, i) => (
                        <li key={i}>
                          <a 
                            href={`#${category.category.toLowerCase().replace(/\s+/g, '-')}`}
                            className="block p-2 hover:bg-gray-100 rounded-md transition-colors text-ivoire-green"
                          >
                            {category.category} ({category.questions.length})
                          </a>
                        </li>
                      ))}
                    </ul>
                  </nav>
                </Card>
              </div>
              
              <div className="lg:col-span-2">
                {filteredFaqs.map((category, i) => (
                  <div key={i} className="mb-12" id={category.category.toLowerCase().replace(/\s+/g, '-')}>
                    <h2 className="text-2xl font-bold mb-6 pb-2 border-b">{category.category}</h2>
                    <Accordion type="single" collapsible className="space-y-4">
                      {category.questions.map((item, j) => (
                        <AccordionItem key={j} value={`item-${i}-${j}`} className="bg-white rounded-lg shadow-sm">
                          <AccordionTrigger className="px-4 py-4 hover:bg-gray-50 font-medium">
                            {item.question}
                          </AccordionTrigger>
                          <AccordionContent className="px-4 py-2 text-gray-600">
                            {item.answer}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default FAQ;
