import { Quote, TrendingUp, Award, Target } from "lucide-react";
import { cn } from "@/lib/utils";

const testimonials = [
  {
    quote: "Grâce au label, nous avons remporté notre premier marché public de 50M FCFA avec le Ministère de la Santé.",
    author: "Marie Konan",
    role: "CEO, TechInnov",
    company: "HealthTech",
    image: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=200&h=200&fit=crop&crop=face",
    impact: "50M FCFA",
    impactLabel: "Marché remporté",
    icon: Target,
  },
  {
    quote: "Les exonérations fiscales nous ont permis d'économiser 30% et de recruter 5 développeurs supplémentaires.",
    author: "Karim Diallo",
    role: "Fondateur, FinTech CI",
    company: "FinTech",
    image: "https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?w=200&h=200&fit=crop&crop=face",
    impact: "30%",
    impactLabel: "Économies fiscales",
    icon: TrendingUp,
  },
  {
    quote: "Notre crédibilité auprès des investisseurs a été multipliée par 3. Nous avons levé notre premier tour en 6 mois.",
    author: "Esther Bamba",
    role: "CTO, EduSolutions",
    company: "EdTech",
    image: "https://images.unsplash.com/photo-1589156280159-27698a70f29e?w=200&h=200&fit=crop&crop=face",
    impact: "x3",
    impactLabel: "Crédibilité investisseurs",
    icon: Award,
  }
];

const Testimonials = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="badge-gold mb-4">Témoignages</span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            L'impact concret du label
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Découvrez comment le label a transformé la trajectoire de ces startups ivoiriennes
          </p>
        </div>

        {/* Testimonials grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index} 
              className={cn(
                "relative bg-card rounded-2xl p-8 shadow-sm border border-border",
                "card-hover group"
              )}
            >
              {/* Impact badge */}
              <div className="absolute -top-4 right-6">
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary text-secondary-foreground font-bold text-sm shadow-lg">
                  <testimonial.icon className="w-4 h-4" />
                  <span>{testimonial.impact}</span>
                </div>
              </div>

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
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
