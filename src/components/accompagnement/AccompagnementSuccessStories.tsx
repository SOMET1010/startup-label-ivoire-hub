import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Quote, Rocket, Award, TrendingUp } from "lucide-react";
import { useSuccessStories } from "@/hooks/useSuccessStories";
import { Skeleton } from "@/components/ui/skeleton";

export function AccompagnementSuccessStories() {
  const { data: stories = [], isLoading } = useSuccessStories();

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

        {isLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="overflow-hidden h-full">
                <CardContent className="p-6 space-y-4">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-10 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {stories.map((story) => (
              <Card key={story.id} className="overflow-hidden h-full">
                <CardContent className="p-6 flex flex-col h-full">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-lg">{story.startup_name}</h3>
                      <div className="flex gap-2 mt-1">
                        <Badge variant="secondary">{story.sector}</Badge>
                      </div>
                    </div>
                    <Rocket className="h-5 w-5 text-primary" aria-hidden="true" />
                  </div>

                  <div className="bg-muted/50 rounded-lg p-3 mb-4 text-sm">
                    <p className="font-medium">{story.structure_name}</p>
                    <p className="text-muted-foreground">
                      Programme : {story.program_name}
                    </p>
                  </div>

                  <p className="text-muted-foreground text-sm mb-4 flex-grow">
                    {story.description}
                  </p>

                  <div className="flex items-center gap-2 bg-primary/5 rounded-lg p-3 mb-4">
                    <TrendingUp className="h-4 w-4 text-primary" aria-hidden="true" />
                    <p className="text-sm font-medium text-primary">
                      {story.result}
                    </p>
                  </div>

                  <div className="border-t border-border pt-4 mt-auto">
                    <Quote className="h-4 w-4 text-muted-foreground/50 mb-2" aria-hidden="true" />
                    <p className="text-sm italic text-muted-foreground mb-2">
                      "{story.founder_quote}"
                    </p>
                    <p className="text-xs font-medium">
                      {story.founder_name},{" "}
                      <span className="text-muted-foreground">
                        {story.founder_role}
                      </span>
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
