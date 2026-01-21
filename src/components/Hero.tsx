import { CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import PremiumBadge from "./PremiumBadge";
import { HERO_STATS } from "@/lib/constants/features";

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

/**
 * Hero simplifié - 1 CTA unique + 3 mini-stats
 * Suppression: bannière des 4 benefits (redondante avec AdvantagesSection)
 * Correction: devise en FCFA
 */
const Hero = () => {
  const { t } = useTranslation('home');

  return (
    <section 
      className="relative min-h-[85vh] flex items-center overflow-hidden bg-gradient-to-br from-background via-background to-muted/50"
      aria-labelledby="hero-title"
    >
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
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
        <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20" />
      </div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        <motion.div 
          className="max-w-3xl mx-auto text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Premium Badge */}
          <motion.div 
            className="mb-6 flex justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <PremiumBadge variant="official" animated />
          </motion.div>

          {/* Main heading */}
          <motion.h1 
            id="hero-title"
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight"
            variants={itemVariants}
          >
            {t('hero.title')} <span className="text-primary">{t('hero.titleHighlight')}</span>
            <br />
            <span className="gradient-text">Startups Numériques</span> Ivoiriennes
          </motion.h1>

          {/* Subtitle */}
          <motion.p 
            className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed"
            variants={itemVariants}
          >
            {t('hero.subtitle')}
          </motion.p>

          {/* Single CTA */}
          <motion.div 
            className="flex flex-col items-center gap-4 mb-10"
            variants={itemVariants}
          >
            <Link to="/eligibilite">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button 
                  size="lg" 
                  className="gradient-premium text-primary-foreground px-10 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
                  aria-label={t('hero.cta')}
                >
                  <CheckCircle2 className="mr-2 w-5 h-5" aria-hidden="true" />
                  {t('hero.cta')}
                </Button>
              </motion.div>
            </Link>
            
            {/* Secondary link */}
            <Link 
              to="/avantages" 
              className="text-sm text-muted-foreground hover:text-primary transition-colors underline-offset-4 hover:underline"
            >
              {t('hero.learnMore')} →
            </Link>
          </motion.div>

          {/* Mini stats - 3 items */}
          <motion.div 
            className="flex flex-wrap justify-center gap-8 md:gap-12"
            variants={itemVariants}
          >
            {HERO_STATS.map((stat, index) => (
              <motion.div 
                key={stat.label} 
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
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" aria-hidden="true" />
    </section>
  );
};

export default Hero;
