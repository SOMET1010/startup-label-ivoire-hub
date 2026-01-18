import { FileText, FolderOpen, Users, Trophy, Rocket, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

const steps = [
  {
    icon: FileText,
    title: "Créer mon profil",
    description: "Inscrivez-vous et renseignez les informations de votre startup",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    icon: FolderOpen,
    title: "Soumettre le dossier",
    description: "Téléchargez les documents requis pour l'évaluation",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    icon: Users,
    title: "Évaluation",
    description: "Le comité analyse votre candidature selon les critères officiels",
    color: "text-secondary",
    bgColor: "bg-secondary/10",
  },
  {
    icon: Trophy,
    title: "Labellisation",
    description: "Recevez votre certification officielle de startup numérique",
    color: "text-secondary",
    bgColor: "bg-secondary/10",
  },
  {
    icon: Rocket,
    title: "Opportunités",
    description: "Accédez aux avantages exclusifs du label",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
];

const StartupJourney = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="badge-gold mb-4">Processus simplifié</span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Votre parcours vers le label
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Un processus 100% en ligne, transparent et rapide pour obtenir votre certification officielle
          </p>
        </div>

        {/* Timeline - Desktop */}
        <div className="hidden lg:block relative mb-12">
          {/* Progress line */}
          <div className="absolute top-16 left-0 right-0 h-1 bg-border">
            <div className="h-full w-full bg-gradient-to-r from-primary via-secondary to-primary/50 rounded-full" />
          </div>

          {/* Steps */}
          <div className="relative grid grid-cols-5 gap-4">
            {steps.map((step, index) => (
              <div key={index} className="flex flex-col items-center text-center group">
                {/* Icon circle */}
                <div className={cn(
                  "relative z-10 w-14 h-14 rounded-full flex items-center justify-center",
                  "transition-all duration-300 group-hover:scale-110",
                  step.bgColor,
                  "border-4 border-background shadow-lg"
                )}>
                  <step.icon className={cn("w-6 h-6", step.color)} />
                </div>
                
                {/* Step number */}
                <div className="mt-4 w-8 h-8 rounded-full bg-card border-2 border-primary/20 flex items-center justify-center">
                  <span className="text-sm font-bold text-primary">{index + 1}</span>
                </div>

                {/* Content */}
                <h3 className="mt-4 font-semibold text-foreground">{step.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed px-2">
                  {step.description}
                </p>

                {/* Arrow between steps */}
                {index < steps.length - 1 && (
                  <ChevronRight className="absolute top-16 right-0 transform translate-x-1/2 -translate-y-1/2 w-5 h-5 text-primary/50 hidden xl:block" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Timeline - Mobile */}
        <div className="lg:hidden space-y-6 mb-12">
          {steps.map((step, index) => (
            <div key={index} className="flex gap-4">
              {/* Left side - Icon and line */}
              <div className="flex flex-col items-center">
                <div className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center shrink-0",
                  step.bgColor,
                  "border-2 border-background shadow-md"
                )}>
                  <step.icon className={cn("w-5 h-5", step.color)} />
                </div>
                {index < steps.length - 1 && (
                  <div className="w-0.5 h-full bg-gradient-to-b from-primary/30 to-secondary/30 mt-2" />
                )}
              </div>

              {/* Right side - Content */}
              <div className="pb-8">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-medium text-muted-foreground">Étape {index + 1}</span>
                </div>
                <h3 className="font-semibold text-foreground">{step.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link to="/postuler">
            <Button size="lg" className="gradient-premium text-primary-foreground px-8 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all">
              Commencer maintenant
              <ChevronRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
          <p className="mt-4 text-sm text-muted-foreground">
            Processus 100% en ligne • Réponse sous 30 jours
          </p>
        </div>
      </div>
    </section>
  );
};

export default StartupJourney;
