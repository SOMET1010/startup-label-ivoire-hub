import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { HelpCircle, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";

const faqs = [
  {
    question: "Comment choisir la bonne structure d'accompagnement ?",
    answer:
      "Le choix dépend de votre secteur d'activité, de votre stade de développement et de vos besoins spécifiques. Les incubateurs conviennent mieux aux projets en phase d'idéation, les accélérateurs aux startups avec un MVP, et les studios de venture building aux projets à fort potentiel technologique. Consultez les fiches de chaque structure pour trouver la meilleure correspondance.",
  },
  {
    question: "L'accompagnement est-il gratuit ?",
    answer:
      "La plupart des programmes d'accompagnement proposés par nos structures partenaires sont gratuits pour les startups labellisées. Certains programmes d'accélération peuvent impliquer une participation en equity (généralement entre 3% et 8%). Les détails financiers sont précisés dans la fiche de chaque programme.",
  },
  {
    question: "Quelle est la différence entre l'accompagnement et le test d'éligibilité ?",
    answer:
      "Le test d'éligibilité vérifie si votre startup remplit les critères pour obtenir le Label Startup. L'accompagnement est un programme de soutien proposé par nos structures partenaires (incubateurs, accélérateurs) pour aider votre startup à se développer. Vous pouvez bénéficier de l'accompagnement indépendamment du Label, mais les startups labellisées ont un accès prioritaire.",
  },
  {
    question: "Combien de temps dure un programme d'accompagnement ?",
    answer:
      "La durée varie selon les programmes : de 3 mois pour les programmes d'accélération intensive à 12 mois pour les programmes d'incubation complets. Chaque structure propose des formats adaptés aux différents stades de développement des startups.",
  },
  {
    question: "Puis-je intégrer plusieurs programmes simultanément ?",
    answer:
      "En général, il est recommandé de se concentrer sur un seul programme à la fois pour en tirer le maximum de bénéfices. Cependant, il est possible de participer à des événements et formations ponctuels proposés par d'autres structures en complément de votre programme principal.",
  },
  {
    question: "Comment postuler à un programme d'accompagnement ?",
    answer:
      "Cliquez sur le bouton 'Contacter' de la structure qui vous intéresse pour envoyer votre demande. Vous pouvez également visiter directement le site web de la structure pour consulter les appels à candidatures en cours. Les startups labellisées bénéficient d'un traitement prioritaire.",
  },
];

export function AccompagnementFAQ() {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-2 mb-4">
            <HelpCircle className="h-6 w-6 text-primary" />
            <h2 className="text-3xl font-bold">Questions fréquentes</h2>
          </div>
          <p className="text-muted-foreground">
            Tout ce que vous devez savoir sur l'accompagnement des startups
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full space-y-2">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="bg-card border rounded-lg px-4"
            >
              <AccordionTrigger className="text-left font-medium hover:no-underline">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="text-center mt-8">
          <p className="text-muted-foreground mb-4">
            Vous n'avez pas trouvé la réponse à votre question ?
          </p>
          <div className="flex gap-3 justify-center">
            <Button variant="outline" asChild>
              <Link to="/faq">
                <HelpCircle className="mr-2 h-4 w-4" />
                Toutes les FAQ
              </Link>
            </Button>
            <Button asChild>
              <Link to="/#contact">
                <MessageCircle className="mr-2 h-4 w-4" />
                Nous contacter
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
