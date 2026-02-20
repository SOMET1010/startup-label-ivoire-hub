import { FileText, FolderOpen, Users, Trophy, Rocket, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
} as const;

const StartupJourney = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-background to-muted/30" aria-labelledby="journey-title">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
        >
          <span className="badge-gold mb-4">Processus simplifié</span>
          <h2 id="journey-title" className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Votre parcours vers le label
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Un processus 100% en ligne, transparent et rapide pour obtenir votre certification officielle
          </p>
        </motion.div>

        {/* Timeline - Desktop */}
        <div className="hidden lg:block relative mb-12">
          {/* Progress line */}
          <motion.div 
            className="absolute top-16 left-0 right-0 h-1 bg-border overflow-hidden"
            aria-hidden="true"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <motion.div 
              className="h-full bg-gradient-to-r from-primary via-secondary to-primary/50 rounded-full"
              initial={{ scaleX: 0, transformOrigin: "left" }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
            />
          </motion.div>

          {/* Steps */}
          <motion.div 
            className="relative grid grid-cols-5 gap-4"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >
            {steps.map((step, index) => (
              <motion.div 
                key={index} 
                className="flex flex-col items-center text-center group"
                variants={itemVariants}
              >
                {/* Icon circle */}
                <motion.div 
                  className={cn(
                    "relative z-10 w-14 h-14 rounded-full flex items-center justify-center",
                    "transition-all duration-300",
                    step.bgColor,
                    "border-4 border-background shadow-lg"
                  )}
                  whileHover={{ scale: 1.15 }}
                  initial={{ scale: 0, rotate: -180 }}
                  whileInView={{ scale: 1, rotate: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1, type: "spring", stiffness: 200 }}
                >
                  <step.icon className={cn("w-6 h-6", step.color)} aria-hidden="true" />
                </motion.div>
                
                {/* Step number */}
                <motion.div 
                  className="mt-4 w-8 h-8 rounded-full bg-card border-2 border-primary/20 flex items-center justify-center"
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                >
                  <span className="text-sm font-bold text-primary">{index + 1}</span>
                </motion.div>

                {/* Content */}
                <h3 className="mt-4 font-semibold text-foreground">{step.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed px-2">
                  {step.description}
                </p>

                {/* Arrow between steps */}
                {index < steps.length - 1 && (
                  <ChevronRight className="absolute top-16 right-0 transform translate-x-1/2 -translate-y-1/2 w-5 h-5 text-primary/50 hidden xl:block" aria-hidden="true" />
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Timeline - Mobile */}
        <motion.div 
          className="lg:hidden space-y-6 mb-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {steps.map((step, index) => (
            <motion.div 
              key={index} 
              className="flex gap-4"
              variants={itemVariants}
            >
              {/* Left side - Icon and line */}
              <div className="flex flex-col items-center">
                <motion.div 
                  className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center shrink-0",
                    step.bgColor,
                    "border-2 border-background shadow-md"
                  )}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <step.icon className={cn("w-5 h-5", step.color)} aria-hidden="true" />
                </motion.div>
                {index < steps.length - 1 && (
                  <motion.div 
                    className="w-0.5 h-full bg-gradient-to-b from-primary/30 to-secondary/30 mt-2"
                    initial={{ scaleY: 0, transformOrigin: "top" }}
                    whileInView={{ scaleY: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  />
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
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Link to="/postuler">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button size="lg" className="gradient-premium text-primary-foreground px-8 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all">
                Commencer maintenant
                <ChevronRight className="ml-2 w-5 h-5" />
              </Button>
            </motion.div>
          </Link>
          <p className="mt-4 text-sm text-muted-foreground">
            Processus 100% en ligne • Réponse sous 30 jours
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default StartupJourney;
