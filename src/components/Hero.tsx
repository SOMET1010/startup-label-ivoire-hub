import { ArrowRight, CheckCircle2, Shield, TrendingUp, Building2, Users } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import PremiumBadge from "./PremiumBadge";

const benefits = [
  { icon: Shield, label: "Fiscalité avantageuse" },
  { icon: Building2, label: "Marchés publics" },
  { icon: TrendingUp, label: "Visibilité nationale" },
  { icon: Users, label: "Réseau d'entrepreneurs" },
];

const stats = [
  { value: "500+", label: "Startups actives" },
  { value: "50+", label: "Labellisées" },
  { value: "15M$", label: "Investissements" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
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

const Hero = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-br from-background via-background to-muted/50">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Gradient orbs */}
        <motion.div 
          className="absolute top-20 -left-32 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
        <motion.div 
          className="absolute bottom-20 -right-32 w-96 h-96 bg-secondary/10 rounded-full blur-3xl"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, delay: 0.3, ease: "easeOut" }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-primary/5 to-secondary/5 rounded-full blur-3xl" />
        
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-30" />
      </div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        <motion.div 
          className="max-w-4xl mx-auto text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Premium Badge */}
          <motion.div 
            className="mb-8 flex justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <PremiumBadge variant="official" animated />
          </motion.div>

          {/* Main heading */}
          <motion.h1 
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight"
            variants={itemVariants}
          >
            Le <span className="text-primary">Label Officiel</span> des
            <br />
            <span className="gradient-text">Startups Numériques</span> Ivoiriennes
          </motion.h1>

          {/* Subtitle */}
          <motion.p 
            className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed"
            variants={itemVariants}
          >
            Une reconnaissance de l'État pour les startups innovantes à fort impact.
            Accédez aux avantages exclusifs réservés aux entreprises labellisées.
          </motion.p>

          {/* CTAs */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
            variants={itemVariants}
          >
            <Link to="/eligibilite">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button 
                  size="lg" 
                  className="gradient-premium text-primary-foreground px-8 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all w-full sm:w-auto"
                >
                  <CheckCircle2 className="mr-2 w-5 h-5" />
                  Vérifier mon éligibilité
                </Button>
              </motion.div>
            </Link>
            <Link to="/avantages">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="px-8 py-6 text-lg font-semibold border-2 border-primary/20 hover:bg-primary/5 w-full sm:w-auto"
                >
                  Comprendre les avantages
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </motion.div>
            </Link>
          </motion.div>

          {/* Benefits banner */}
          <motion.div 
            className="bg-card/80 backdrop-blur-sm rounded-2xl border border-border p-6 mb-12 shadow-lg"
            variants={itemVariants}
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {benefits.map((benefit, index) => (
                <motion.div 
                  key={index} 
                  className="flex items-center justify-center gap-2 text-muted-foreground"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                >
                  <benefit.icon className="w-5 h-5 text-primary" />
                  <span className="text-sm font-medium">{benefit.label}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Mini stats */}
          <motion.div 
            className="flex flex-wrap justify-center gap-8 md:gap-12"
            variants={itemVariants}
          >
            {stats.map((stat, index) => (
              <motion.div 
                key={index} 
                className="text-center"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
              >
                <div className="text-3xl md:text-4xl font-bold text-primary">{stat.value}</div>
                <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default Hero;
