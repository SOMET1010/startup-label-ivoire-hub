import { Quote, TrendingUp, Award, Target } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import marieKonanImg from "@/assets/testimonials/marie-konan.jpg";
import karimDialloImg from "@/assets/testimonials/karim-diallo.jpg";
import estherBambaImg from "@/assets/testimonials/esther-bamba.jpg";

const testimonials = [
  {
    quote: "Grâce au label, nous avons remporté notre premier marché public de 50M FCFA avec le Ministère de la Santé.",
    author: "Marie Konan",
    role: "CEO, TechInnov",
    company: "HealthTech",
    image: marieKonanImg,
    impact: "50M FCFA",
    impactLabel: "Marché remporté",
    icon: Target,
  },
  {
    quote: "Les exonérations fiscales nous ont permis d'économiser 30% et de recruter 5 développeurs supplémentaires.",
    author: "Karim Diallo",
    role: "Fondateur, FinTech CI",
    company: "FinTech",
    image: karimDialloImg,
    impact: "30%",
    impactLabel: "Économies fiscales",
    icon: TrendingUp,
  },
  {
    quote: "Notre crédibilité auprès des investisseurs a été multipliée par 3. Nous avons levé notre premier tour en 6 mois.",
    author: "Esther Bamba",
    role: "CTO, EduSolutions",
    company: "EdTech",
    image: estherBambaImg,
    impact: "x3",
    impactLabel: "Crédibilité investisseurs",
    icon: Award,
  }
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
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
} as const;

const Testimonials = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
        >
          <span className="badge-gold mb-4">Témoignages</span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            L'impact concret du label
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Découvrez comment le label a transformé la trajectoire de ces startups ivoiriennes
          </p>
        </motion.div>

        {/* Testimonials grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {testimonials.map((testimonial, index) => (
            <motion.div 
              key={index} 
              className={cn(
                "relative bg-card rounded-2xl p-8 shadow-sm border border-border",
                "group"
              )}
              variants={itemVariants}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              {/* Impact badge */}
              <motion.div 
                className="absolute -top-4 right-6"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
              >
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary text-secondary-foreground font-bold text-sm shadow-lg">
                  <testimonial.icon className="w-4 h-4" />
                  <span>{testimonial.impact}</span>
                </div>
              </motion.div>

              {/* Quote icon */}
              <div className="mb-6">
                <Quote className="w-10 h-10 text-primary/20" />
              </div>

              {/* Quote text */}
              <p className="text-foreground mb-6 leading-relaxed text-lg">
                "{testimonial.quote}"
              </p>

              {/* Impact label */}
              <div className="mb-6 pb-6 border-b border-border">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {testimonial.impactLabel}
                </span>
              </div>

              {/* Author */}
              <div className="flex items-center gap-4">
                <img 
                  src={testimonial.image} 
                  alt={testimonial.author} 
                  className="w-14 h-14 rounded-full object-cover border-2 border-primary/20"
                />
                <div>
                  <h4 className="font-bold text-foreground">{testimonial.author}</h4>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  <span className="inline-block mt-1 px-2 py-0.5 rounded text-xs font-medium bg-primary/10 text-primary">
                    {testimonial.company}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;
