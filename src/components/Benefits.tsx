
import { CalendarDays, Building2, ScrollText, Coins, Users, Rocket } from "lucide-react";
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

const Benefits = () => {
  return (
    <section className="py-16 bg-gray-50" id="avantages">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Avantages du Label Startup</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Découvrez les nombreux avantages offerts aux startups labellisées pour accélérer leur croissance
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <Card 
              key={index}
              className="hover:shadow-lg transition-shadow duration-300 bg-white"
            >
              <CardHeader className="space-y-1">
                <div className="w-12 h-12 bg-gradient-to-br from-ivoire-orange to-ivoire-green rounded-lg flex items-center justify-center mb-4">
                  <benefit.icon className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-xl">{benefit.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{benefit.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Benefits;

