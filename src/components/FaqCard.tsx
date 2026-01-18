
import { HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useState } from "react";

const FaqCard = () => {
  const [isOpen, setIsOpen] = useState(false);
  
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

  return (
    <Card className="bg-muted/50 border-ivoire-orange/20 shadow-sm hover:shadow transition-shadow">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center text-xl gap-2">
          <HelpCircle className="h-5 w-5 text-ivoire-orange" />
          Questions fréquentes
        </CardTitle>
        <CardDescription>Trouvez rapidement des réponses à vos questions</CardDescription>
      </CardHeader>
      <CardContent>
        <Collapsible open={isOpen} onOpenChange={setIsOpen} className="mb-4">
          <div className="space-y-3">
            {quickFaqs.slice(0, isOpen ? 3 : 1).map((faq, index) => (
              <div key={index} className="bg-card p-3 rounded-md border border-border shadow-sm">
                <h4 className="font-medium text-foreground">{faq.question}</h4>
                <p className="text-muted-foreground text-sm mt-1">{faq.answer}</p>
              </div>
            ))}
          </div>
          
          <CollapsibleContent className="space-y-3 mt-3">
          </CollapsibleContent>
          
          <CollapsibleTrigger asChild className="mt-3">
            <Button variant="outline" size="sm" className="w-full">
              {isOpen ? "Voir moins" : "Voir plus"}
            </Button>
          </CollapsibleTrigger>
        </Collapsible>
        
        <Button variant="outline" asChild className="w-full">
          <Link to="/faq" className="w-full">
            Consulter toute notre FAQ
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};

export default FaqCard;
