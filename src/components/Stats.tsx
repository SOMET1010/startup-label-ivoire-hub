import { Building2, Users, Briefcase, TrendingUp, MapPin } from "lucide-react";
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
    value: "15M$",
    label: "Investissements",
    description: "levés par les startups",
  },
];

const Stats = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-primary via-primary/95 to-primary/90 text-primary-foreground relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary-foreground/5 rounded-full blur-3xl" />
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
        <div className="text-center mb-16">
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
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className="bg-primary-foreground/10 backdrop-blur-sm rounded-2xl p-6 text-center border border-primary-foreground/10 hover:bg-primary-foreground/15 transition-all duration-300 group"
            >
              <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-secondary/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <stat.icon className="w-7 h-7 text-secondary" />
              </div>
              <div className="text-4xl md:text-5xl font-bold text-primary-foreground mb-2">
                {stat.value}
              </div>
              <div className="text-lg font-semibold text-primary-foreground/90 mb-1">
                {stat.label}
              </div>
              <p className="text-sm text-primary-foreground/60">
                {stat.description}
              </p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link to="/annuaire">
            <Button 
              size="lg" 
              variant="secondary"
              className="bg-secondary text-secondary-foreground hover:bg-secondary/90 px-8 py-6 text-lg font-semibold shadow-lg"
            >
              Voir les startups labellisées
              <TrendingUp className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Stats;
