import { Card, CardContent } from "@/components/ui/card";
import { Quote, TrendingUp, Users, DollarSign } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const successStories = [
  {
    startup: "MobilPay",
    sector: "FinTech",
    investor: "Orange Digital Ventures Afrique",
    amount: "200M FCFA",
    year: 2024,
    description:
      "MobilPay a levé 200 millions FCFA en seed auprès d'Orange Digital Ventures pour développer sa solution de paiement mobile interopérable. Depuis, l'entreprise a triplé sa base d'utilisateurs.",
    result: "Base utilisateurs ×3 en 12 mois",
    founderQuote:
      "Le Label Startup nous a donné la crédibilité nécessaire pour convaincre les investisseurs de notre potentiel.",
    founderName: "Amadou Koné",
    founderRole: "CEO & Co-fondateur",
  },
  {
    startup: "Cocoa Connect",
    sector: "AgriTech",
    investor: "Afrique Innovation Fund",
    amount: "150M FCFA",
    year: 2023,
    description:
      "Cocoa Connect a sécurisé un financement de 150 millions FCFA pour numériser la chaîne de valeur du cacao en Côte d'Ivoire, connectant directement les producteurs aux exportateurs.",
    result: "+5 000 producteurs connectés",
    founderQuote:
      "Grâce à la plateforme, nous avons été mis en relation avec le bon investisseur au bon moment.",
    founderName: "Fatou Diallo",
    founderRole: "Fondatrice",
  },
  {
    startup: "SantéYako",
    sector: "HealthTech",
    investor: "Impact Hub Abidjan Ventures",
    amount: "40M FCFA",
    year: 2024,
    description:
      "SantéYako a obtenu un financement d'amorçage pour sa plateforme de téléconsultation médicale, rendant les soins de santé accessibles dans les zones rurales de Côte d'Ivoire.",
    result: "12 cliniques partenaires",
    founderQuote:
      "L'accompagnement des investisseurs va bien au-delà du financement : mentorat, réseau, expertise.",
    founderName: "Dr. Awa Touré",
    founderRole: "CEO & Médecin",
  },
];

export function InvestorSuccessStories() {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4 text-sm">
            Success Stories
          </Badge>
          <h2 className="text-3xl font-bold mb-4">
            Ils ont obtenu un financement
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Découvrez les startups labellisées qui ont réussi à lever des fonds
            grâce à la mise en relation avec nos investisseurs partenaires
          </p>
        </div>

        {/* Stats banner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          {[
            { icon: DollarSign, label: "Montant total levé", value: "390M+ FCFA" },
            { icon: Users, label: "Startups financées", value: "15+" },
            { icon: TrendingUp, label: "Taux de succès", value: "72%" },
          ].map((stat, i) => (
            <div
              key={i}
              className="flex items-center gap-4 bg-muted/50 rounded-xl p-5"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <stat.icon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Stories */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {successStories.map((story, index) => (
            <Card key={index} className="overflow-hidden h-full">
              <CardContent className="p-6 flex flex-col h-full">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-lg">{story.startup}</h3>
                    <div className="flex gap-2 mt-1">
                      <Badge variant="secondary">{story.sector}</Badge>
                      <Badge variant="outline">{story.year}</Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-primary">{story.amount}</p>
                  </div>
                </div>

                <p className="text-muted-foreground text-sm mb-4 flex-grow">
                  {story.description}
                </p>

                <div className="bg-primary/5 rounded-lg p-3 mb-4">
                  <p className="text-sm font-medium text-primary">{story.result}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Investisseur : {story.investor}
                  </p>
                </div>

                <div className="border-t border-border pt-4 mt-auto">
                  <Quote className="h-4 w-4 text-muted-foreground/50 mb-2" />
                  <p className="text-sm italic text-muted-foreground mb-2">
                    "{story.founderQuote}"
                  </p>
                  <p className="text-xs font-medium">
                    {story.founderName},{" "}
                    <span className="text-muted-foreground">
                      {story.founderRole}
                    </span>
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
