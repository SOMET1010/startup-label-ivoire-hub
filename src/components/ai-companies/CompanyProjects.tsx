import { AICompany } from "@/types/aiCompany";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Building2, TrendingUp } from "lucide-react";

interface CompanyProjectsProps {
  company: AICompany;
}

const CompanyProjects = ({ company }: CompanyProjectsProps) => {
  if (!company.projects || company.projects.length === 0) return null;
  
  return (
    <section>
      <h2 className="text-3xl font-bold mb-6">Projets Réalisés</h2>
      
      <div className="space-y-6">
        {company.projects.map((project, idx) => (
          <Card key={idx} className="overflow-hidden hover:shadow-lg transition-shadow">
            <CardContent className="p-0">
              <div className="md:flex">
                {/* Image */}
                <div className="md:w-1/3 aspect-video md:aspect-square bg-muted overflow-hidden">
                  <img 
                    src={project.image} 
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Content */}
                <div className="p-6 md:w-2/3">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-2xl font-bold">{project.title}</h3>
                    <Badge variant="outline" className="text-lg px-3 py-1">
                      {project.year}
                    </Badge>
                  </div>
                  
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    {project.description}
                  </p>
                  
                  <div className="grid sm:grid-cols-2 gap-4 mb-4">
                    <div className="flex items-start gap-2">
                      <Building2 className="h-4 w-4 text-primary mt-0.5" />
                      <div>
                        <div className="text-xs text-muted-foreground">Client</div>
                        <div className="font-medium text-sm">{project.client}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-2">
                      <TrendingUp className="h-4 w-4 text-primary mt-0.5" />
                      <div>
                        <div className="text-xs text-muted-foreground">Résultats</div>
                        <div className="font-medium text-sm">{project.results}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-muted-foreground mb-2">Technologies utilisées</div>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech, techIdx) => (
                        <Badge key={techIdx} variant="secondary">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default CompanyProjects;
