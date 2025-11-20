import { AICompany } from "@/types/aiCompany";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Mail, ExternalLink } from "lucide-react";

interface CompanyContactProps {
  company: AICompany;
}

const CompanyContact = ({ company }: CompanyContactProps) => {
  if (!company.contact) return null;
  
  return (
    <section>
      <h2 className="text-3xl font-bold mb-6">Nous Contacter</h2>
      
      <div className="grid md:grid-cols-2 gap-6">
        {/* Coordonnées */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-6">Coordonnées</h3>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-sm text-muted-foreground">Adresse</div>
                  <div className="font-medium">{company.contact.address}</div>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-sm text-muted-foreground">Téléphone</div>
                  <a 
                    href={`tel:${company.contact.phone}`}
                    className="font-medium hover:text-primary transition-colors"
                  >
                    {company.contact.phone}
                  </a>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-sm text-muted-foreground">Email</div>
                  <a 
                    href={`mailto:${company.contact.email}`}
                    className="font-medium hover:text-primary transition-colors"
                  >
                    {company.contact.email}
                  </a>
                </div>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t">
              <Button className="w-full" asChild>
                <a href={company.website} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Visiter le site web
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Carte */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-4">Localisation</h3>
            
            <div className="aspect-video bg-muted rounded-lg overflow-hidden">
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <MapPin className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">{company.location}</p>
                  <p className="text-xs">Côte d'Ivoire</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default CompanyContact;
