
import { Check } from "lucide-react";

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

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Avantages du Label Startup</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            La labellisation de votre startup numérique vous ouvre les portes à de nombreux avantages exclusifs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className={`${feature.color} border ${feature.borderColor} rounded-xl p-6 card-hover`}
            >
              <div className="flex items-center mb-4">
                <div className="mr-2">{feature.icon}</div>
                <h3 className="text-xl font-bold">{feature.title}</h3>
              </div>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
