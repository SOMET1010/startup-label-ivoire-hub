import { CalendarDays, Building2, ScrollText, Coins, Users, Rocket } from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const benefits = [
  {
    title: "Avantages fiscaux",
    description: "Bénéficiez d'exonérations fiscales et de réductions d'impôts pendant les premières années d'activité",
    icon: Coins,
  },
  {
    title: "Accès aux marchés publics",
    description: "Participez aux appels d'offres publics avec des conditions préférentielles",
    icon: Building2,
  },
  {
    title: "Accompagnement personnalisé",
    description: "Profitez d'un suivi régulier et de conseils d'experts pour développer votre startup",
    icon: Users,
  },
  {
    title: "Simplification administrative",
    description: "Bénéficiez de procédures simplifiées et d'un accès prioritaire aux services administratifs",
    icon: ScrollText,
  },
  {
    title: "Réseau d'innovateurs",
    description: "Rejoignez une communauté dynamique de startups et d'entrepreneurs innovants",
    icon: Rocket,
  },
  {
    title: "Visibilité accrue",
    description: "Augmentez votre visibilité grâce au label et aux événements exclusifs",
    icon: CalendarDays,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
} as const;

const Benefits = () => {
  return (
    <section className="py-16 bg-muted/50" id="avantages">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Avantages du Label Startup</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Découvrez les nombreux avantages offerts aux startups labellisées pour accélérer leur croissance
          </p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <Card className="hover:shadow-lg transition-shadow duration-300 bg-card h-full">
                <CardHeader className="space-y-1">
                  <motion.div 
                    className="w-12 h-12 bg-gradient-to-br from-ivoire-orange to-ivoire-green rounded-lg flex items-center justify-center mb-4"
                    whileHover={{ rotate: 5, scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                  >
                    <benefit.icon className="w-6 h-6 text-white" />
                  </motion.div>
                  <CardTitle className="text-xl">{benefit.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{benefit.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Benefits;
