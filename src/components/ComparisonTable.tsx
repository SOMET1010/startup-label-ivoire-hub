import { Check, X, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

const comparisons = [
  {
    without: "Visibilité limitée auprès des partenaires",
    with: "Visibilité nationale et reconnaissance officielle",
  },
  {
    without: "Accès difficile aux marchés publics",
    with: "Accès facilité aux appels d'offres publics",
  },
  {
    without: "Crédibilité à construire seul",
    with: "Crédibilité instantanée avec le sceau officiel",
  },
  {
    without: "Fiscalité standard",
    with: "Exonérations fiscales jusqu'à 5 ans",
  },
  {
    without: "Réseau limité à vos contacts",
    with: "Intégration à l'écosystème startup ivoirien",
  },
  {
    without: "Accompagnement à trouver",
    with: "Mentorat et accompagnement dédiés",
  },
];

const ComparisonTable = () => {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="badge-premium mb-4">Comparez les avantages</span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Pourquoi obtenir le label ?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Le label Startup Numérique transforme votre positionnement sur le marché
          </p>
        </div>

        {/* Comparison Table - Desktop */}
        <div className="hidden md:block max-w-4xl mx-auto mb-12">
          <div className="grid grid-cols-2 gap-6">
            {/* Without Label Column */}
            <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border">
                <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">
                  <X className="w-5 h-5 text-destructive" />
                </div>
                <h3 className="font-semibold text-foreground">Sans Label</h3>
              </div>
              <ul className="space-y-4">
                {comparisons.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <X className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{item.without}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* With Label Column */}
            <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl border-2 border-primary/20 p-6 shadow-lg relative overflow-hidden">
              {/* Premium glow */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 rounded-full blur-3xl -z-10" />
              
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-primary/20">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Check className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold text-primary">Avec Label ✓</h3>
              </div>
              <ul className="space-y-4">
                {comparisons.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-foreground font-medium">{item.with}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Comparison Cards - Mobile */}
        <div className="md:hidden space-y-4 mb-12">
          {comparisons.map((item, index) => (
            <div key={index} className="bg-card rounded-xl border border-border p-4 shadow-sm">
              <div className="flex items-center gap-2 text-destructive mb-2">
                <X className="w-4 h-4" />
                <span className="text-sm line-through text-muted-foreground">{item.without}</span>
              </div>
              <div className="flex items-center gap-2 text-primary">
                <Check className="w-4 h-4" />
                <span className="text-sm font-medium">{item.with}</span>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link to="/eligibilite">
            <Button 
              size="lg" 
              className="gradient-premium text-primary-foreground px-8 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              Vérifier mon éligibilité
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ComparisonTable;
