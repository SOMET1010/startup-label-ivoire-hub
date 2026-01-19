import { Building2, Users, Briefcase, TrendingUp, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const stats = [
  {
    icon: Building2,
    value: "500+",
    label: "Startups actives",
    description: "dans l'écosystème numérique",
  },
  {
    icon: Users,
    value: "25+",
    label: "Incubateurs",
    description: "partenaires du programme",
  },
  {
    icon: Briefcase,
    value: "5000+",
    label: "Emplois créés",
    description: "dans le secteur tech",
  },
  {
    icon: TrendingUp,
    value: "10 Mds",
    unit: "FCFA",
    label: "Investissements",
    description: "levés par les startups",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
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

const Stats = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-primary via-primary/95 to-primary/90 text-primary-foreground relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          className="absolute top-0 right-0 w-96 h-96 bg-secondary/20 rounded-full blur-3xl"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        />
        <motion.div 
          className="absolute bottom-0 left-0 w-96 h-96 bg-primary-foreground/5 rounded-full blur-3xl"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2 }}
        />
        {/* Map pattern overlay */}
        <div className="absolute inset-0 opacity-5">
          <MapPin className="absolute top-20 left-[20%] w-8 h-8" />
          <MapPin className="absolute top-32 left-[45%] w-6 h-6" />
          <MapPin className="absolute bottom-40 left-[30%] w-10 h-10" />
          <MapPin className="absolute top-40 right-[25%] w-7 h-7" />
          <MapPin className="absolute bottom-20 right-[35%] w-8 h-8" />
        </div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/10 text-primary-foreground/90 font-medium text-sm mb-4 border border-primary-foreground/20">
            <TrendingUp className="w-4 h-4" />
            Impact National
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Construisons l'écosystème numérique ivoirien
          </h2>
          <p className="text-xl text-primary-foreground/80 max-w-3xl mx-auto">
            Le label Startup Numérique, moteur d'innovation, d'emplois et de souveraineté digitale
          </p>
        </motion.div>

        {/* Stats grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {stats.map((stat, index) => (
            <motion.div 
              key={index} 
              className="bg-primary-foreground/10 backdrop-blur-sm rounded-2xl p-6 text-center border border-primary-foreground/10 hover:bg-primary-foreground/15 transition-all duration-300 group"
              variants={itemVariants}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <motion.div 
                className="w-14 h-14 mx-auto mb-4 rounded-xl bg-secondary/20 flex items-center justify-center group-hover:scale-110 transition-transform"
                whileHover={{ rotate: 5 }}
              >
                <stat.icon className="w-7 h-7 text-secondary" />
              </motion.div>
              <div className="text-4xl md:text-5xl font-bold text-primary-foreground mb-1">
                {stat.value}
              </div>
              {stat.unit && (
                <div className="text-sm font-medium text-primary-foreground/70 mb-1">
                  {stat.unit}
                </div>
              )}
              <div className="text-lg font-semibold text-primary-foreground/90 mb-1">
                {stat.label}
              </div>
              <p className="text-sm text-primary-foreground/60">
                {stat.description}
              </p>
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
          <Link to="/annuaire">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button 
                size="lg" 
                variant="secondary"
                className="bg-secondary text-secondary-foreground hover:bg-secondary/90 px-8 py-6 text-lg font-semibold shadow-lg"
              >
                Voir les startups labellisées
                <TrendingUp className="ml-2 w-5 h-5" />
              </Button>
            </motion.div>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default Stats;
