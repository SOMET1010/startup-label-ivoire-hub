import { Check } from "lucide-react";
import { motion } from "framer-motion";

const Features = () => {
  const features = [
    {
      title: "Exonérations fiscales",
      description: "Bénéficiez d'exonérations d'impôts sur les bénéfices, de la contribution des patentes et d'autres taxes pendant 5 ans.",
      color: "bg-ivoire-orange/10",
      borderColor: "border-ivoire-orange",
      icon: <Check className="h-5 w-5 text-ivoire-orange" />,
    },
    {
      title: "Accès aux marchés publics",
      description: "Accédez à des marchés publics dédiés aux startups labellisées et bénéficiez d'une préférence dans l'attribution des contrats.",
      color: "bg-ivoire-green/10",
      borderColor: "border-ivoire-green",
      icon: <Check className="h-5 w-5 text-ivoire-green" />,
    },
    {
      title: "Financement facilité",
      description: "Accédez plus facilement aux financements publics et privés grâce à la reconnaissance officielle du label.",
      color: "bg-startup-DEFAULT/10",
      borderColor: "border-startup-DEFAULT",
      icon: <Check className="h-5 w-5 text-startup-DEFAULT" />,
    },
    {
      title: "Accompagnement personnalisé",
      description: "Profitez d'un accompagnement par des structures spécialisées pour accélérer votre croissance.",
      color: "bg-incubator-DEFAULT/10",
      borderColor: "border-incubator-DEFAULT",
      icon: <Check className="h-5 w-5 text-incubator-DEFAULT" />,
    },
    {
      title: "Visibilité internationale",
      description: "Bénéficiez d'une visibilité accrue auprès des partenaires internationaux et des investisseurs étrangers.",
      color: "bg-investor-DEFAULT/10",
      borderColor: "border-investor-DEFAULT",
      icon: <Check className="h-5 w-5 text-investor-DEFAULT" />,
    },
    {
      title: "Réseau d'innovateurs",
      description: "Rejoignez une communauté dynamique d'entrepreneurs innovants pour partager des expériences et collaborer.",
      color: "bg-ivoire-orange/10",
      borderColor: "border-ivoire-orange",
      icon: <Check className="h-5 w-5 text-ivoire-orange" />,
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

  return (
    <section className="py-16 bg-muted/50">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold mb-4">Avantages du Label Startup</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            La labellisation de votre startup numérique vous ouvre les portes à de nombreux avantages exclusifs
          </p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              className={`${feature.color} border ${feature.borderColor} rounded-xl p-6`}
              variants={itemVariants}
              whileHover={{ y: -5, scale: 1.02, transition: { duration: 0.2 } }}
            >
              <div className="flex items-center mb-4">
                <motion.div 
                  className="mr-2"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 0.2 + index * 0.05, type: "spring", stiffness: 200 }}
                >
                  {feature.icon}
                </motion.div>
                <h3 className="text-xl font-bold">{feature.title}</h3>
              </div>
              <p className="text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Features;
