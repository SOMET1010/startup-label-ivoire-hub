import { AICompany } from "@/types/aiCompany";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, MapPin, Users, Cpu, Calendar } from "lucide-react";

interface CompanyOverviewProps {
  company: AICompany;
}

const CompanyOverview = ({ company }: CompanyOverviewProps) => {
  return (
    <section>
      <h2 className="text-3xl font-bold mb-6">Vue d'ensemble</h2>
      
      <div className="grid md:grid-cols-2 gap-6">
        {/* Informations principales */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-4">Informations clés</h3>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Building2 className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <div className="text-sm text-muted-foreground">Secteur</div>
                  <div className="font-medium">{company.sector}</div>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Cpu className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <div className="text-sm text-muted-foreground">Spécialisation</div>
                  <div className="font-medium">{company.specialization}</div>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <div className="text-sm text-muted-foreground">Localisation</div>
                  <div className="font-medium">{company.location}, Côte d'Ivoire</div>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <div className="text-sm text-muted-foreground">Année de création</div>
                  <div className="font-medium">{company.founded}</div>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Users className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <div className="text-sm text-muted-foreground">Effectif</div>
                  <div className="font-medium">{company.employees} employés</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Services et certifications */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-4">Services & Expertises</h3>
            
            <div className="space-y-6">
              <div>
                <div className="text-sm text-muted-foreground mb-2">Services offerts</div>
                <div className="flex flex-wrap gap-2">
                  {company.services.map((service, idx) => (
                    <Badge key={idx} variant="secondary">
                      {service}
                    </Badge>
                  ))}
                </div>
              </div>
              
              {company.certifications && company.certifications.length > 0 && (
                <div>
                  <div className="text-sm text-muted-foreground mb-2">Certifications</div>
                  <div className="flex flex-wrap gap-2">
                    {company.certifications.map((cert, idx) => (
                      <Badge key={idx} variant="outline" className="border-primary/50">
                        {cert}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              {company.partners && company.partners.length > 0 && (
                <div>
                  <div className="text-sm text-muted-foreground mb-2">Partenaires</div>
                  <div className="flex flex-wrap gap-2">
                    {company.partners.map((partner, idx) => (
                      <Badge key={idx} variant="outline">
                        {partner}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default CompanyOverview;
