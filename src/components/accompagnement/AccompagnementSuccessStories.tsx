import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Quote, Rocket, Award, TrendingUp } from "lucide-react";

const stories = [
  {
    startup: "Koulé Éducation",
    structure: "Orange Digital Center",
    program: "Orange Fab",
    sector: "EdTech",
    description:
      "Koulé Éducation a intégré le programme Orange Fab et a pu structurer son offre de formation en ligne pour les étudiants ivoiriens. En 9 mois, la startup a multiplié par 5 son nombre d'utilisateurs actifs.",
    result: "50 000 étudiants actifs",
    founderQuote:
      "L'accompagnement d'Orange Digital Center nous a permis de passer d'une idée à un produit utilisé dans tout le pays.",
    founderName: "Mariam Bamba",
    founderRole: "Co-fondatrice",
  },
  {
    startup: "Gnamakoudji Energy",
    structure: "Incub'Ivoire",
    program: "Green Start",
    sector: "CleanTech",
    description:
      "Accompagnée par Incub'Ivoire, Gnamakoudji Energy a développé une solution de micro-réseaux solaires pour les communautés rurales. Le programme Green Start l'a aidée à obtenir le label et un premier financement.",
    result: "3 villages électrifiés",
    founderQuote:
      "Le mentoring technique et business a été déterminant. Nous avons appris à structurer notre modèle économique.",
    founderName: "Ibrahim Sanogo",
    founderRole: "Fondateur & CEO",
  },
  {
    startup: "Wôrô Logistics",
    structure: "Seedstars Abidjan",
    program: "Seedstars Growth",
    sector: "Logistics",
    description:
      "Wôrô Logistics a bénéficié de l'accélération Seedstars pour optimiser sa plateforme de livraison du dernier kilomètre à Abidjan. Le programme lui a ouvert les portes de partenariats clés avec des e-commerçants.",
    result: "+200 livreurs actifs",
    founderQuote:
      "Le réseau international de Seedstars nous a connectés avec des mentors et des clients que nous n'aurions jamais atteints seuls.",
    founderName: "Yves Konan",
    founderRole: "CEO",
  },
];

export function AccompagnementSuccessStories() {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4 text-sm">
            <Award className="h-3.5 w-3.5 mr-1" />
            Témoignages
          </Badge>
          <h2 className="text-3xl font-bold mb-4">
            Startups accompagnées avec succès
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Ces startups ont bénéficié de l'accompagnement de nos structures
            partenaires pour accélérer leur croissance
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {stories.map((story, index) => (
            <Card key={index} className="overflow-hidden h-full">
              <CardContent className="p-6 flex flex-col h-full">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-lg">{story.startup}</h3>
                    <div className="flex gap-2 mt-1">
                      <Badge variant="secondary">{story.sector}</Badge>
                    </div>
                  </div>
                  <Rocket className="h-5 w-5 text-primary" />
                </div>

                <div className="bg-muted/50 rounded-lg p-3 mb-4 text-sm">
                  <p className="font-medium">{story.structure}</p>
                  <p className="text-muted-foreground">
                    Programme : {story.program}
                  </p>
                </div>

                <p className="text-muted-foreground text-sm mb-4 flex-grow">
                  {story.description}
                </p>

                <div className="flex items-center gap-2 bg-primary/5 rounded-lg p-3 mb-4">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  <p className="text-sm font-medium text-primary">
                    {story.result}
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
