import { HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useState } from "react";

const quickFaqs = [
  {
    question: "Qu'est-ce que le Label Startup ?",
    answer: "Le Label Startup est une reconnaissance officielle accordée par le gouvernement ivoirien aux entreprises innovantes du secteur numérique."
  },
  {
    question: "Quels sont les critères d'éligibilité ?",
    answer: "Une entreprise légalement constituée en Côte d'Ivoire, ayant moins de 8 ans d'existence, opérant dans le numérique avec un produit/service innovant."
  },
  {
    question: "Quelle est la durée du Label ?",
    answer: "Le Label est accordé pour une période de 5 ans, renouvelable sous conditions."
  }
];

/**
 * Carte FAQ compacte - utilisée dans le CTA final
 * Style adapté pour fond sombre (CTA section)
 */
const FaqCard = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card className="bg-card/95 backdrop-blur-sm border-border/50 shadow-xl">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-lg gap-2 text-foreground">
          <HelpCircle className="h-5 w-5 text-primary" aria-hidden="true" />
          Questions fréquentes
        </CardTitle>
        <CardDescription>Réponses rapides à vos questions</CardDescription>
      </CardHeader>
      <CardContent>
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <div className="space-y-2">
            {quickFaqs.slice(0, isOpen ? 3 : 1).map((faq, index) => (
              <div 
                key={index} 
                className="bg-muted/50 p-3 rounded-lg border border-border/50"
              >
                <h4 className="font-medium text-foreground text-sm">{faq.question}</h4>
                <p className="text-muted-foreground text-xs mt-1 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
          
          <CollapsibleContent className="space-y-2 mt-2" />
          
          <div className="flex gap-2 mt-4">
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="flex-1">
                {isOpen ? "Voir moins" : "Voir plus"}
              </Button>
            </CollapsibleTrigger>
            <Button variant="outline" size="sm" asChild className="flex-1">
              <Link to="/faq">
                Toutes les FAQ
              </Link>
            </Button>
          </div>
        </Collapsible>
      </CardContent>
    </Card>
  );
};

export default FaqCard;
