import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ADVANTAGES } from "@/lib/constants/features";

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

/**
 * Section unifiée des avantages du Label Startup
 * Fusionne les anciens composants Features.tsx et Benefits.tsx
 * Affiche 6 avantages en grille responsive 3x2
 */
const AdvantagesSection = () => {
  return (
    <section className="py-16 bg-muted/30" id="avantages" aria-labelledby="advantages-title">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 id="advantages-title" className="text-3xl md:text-4xl font-bold mb-4">
            Avantages du Label Startup
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Découvrez les avantages exclusifs offerts aux startups labellisées
          </p>
        </motion.div>

        {/* Grid 3x2 */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {ADVANTAGES.map((advantage, index) => (
            <motion.div
              key={advantage.title}
              variants={itemVariants}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
            >
              <Card className="h-full bg-card hover:shadow-md transition-shadow duration-300 border-border/50">
                <CardHeader className="pb-3">
                  <motion.div 
                    className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-3"
                    whileHover={{ rotate: 5, scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                    aria-hidden="true"
                  >
                    <advantage.icon className="w-6 h-6 text-primary" />
                  </motion.div>
                  <CardTitle className="text-lg font-semibold">{advantage.title}</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {advantage.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default AdvantagesSection;
