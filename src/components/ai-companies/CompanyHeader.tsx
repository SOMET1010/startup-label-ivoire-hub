import { AICompany } from "@/types/aiCompany";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Mail, Phone, Linkedin, Twitter, Facebook } from "lucide-react";

interface CompanyHeaderProps {
  company: AICompany;
}

const CompanyHeader = ({ company }: CompanyHeaderProps) => {
  return (
    <div className="relative bg-gradient-to-br from-primary/10 via-background to-muted/20 border-b">
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Logo */}
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl overflow-hidden bg-background shadow-lg flex-shrink-0">
            <img 
              src={company.logo} 
              alt={`${company.name} logo`} 
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Info */}
          <div className="flex-grow">
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <h1 className="text-4xl md:text-5xl font-bold">{company.name}</h1>
              {company.isLabeled && (
                <Badge className="text-sm px-3 py-1">
                  ✓ Labellisée
                </Badge>
              )}
            </div>
            
            <p className="text-xl text-muted-foreground mb-6 max-w-3xl">
              {company.description}
            </p>
            
            <div className="flex flex-wrap gap-3">
              <Button asChild>
                <a href={company.website} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Visiter le site
                </a>
              </Button>
              
              {company.contact && (
                <>
                  {company.contact.email && (
                    <Button variant="outline" asChild>
                      <a href={`mailto:${company.contact.email}`}>
                        <Mail className="mr-2 h-4 w-4" />
                        Contact
                      </a>
                    </Button>
                  )}
                  
                  {company.contact.phone && (
                    <Button variant="outline" asChild>
                      <a href={`tel:${company.contact.phone}`}>
                        <Phone className="mr-2 h-4 w-4" />
                        Appeler
                      </a>
                    </Button>
                  )}
                </>
              )}
            </div>
            
            {/* Social Media */}
            {company.contact?.socialMedia && (
              <div className="flex gap-3 mt-4">
                {company.contact.socialMedia.linkedin && (
                  <a
                    href={company.contact.socialMedia.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Linkedin className="h-5 w-5" />
                  </a>
                )}
                {company.contact.socialMedia.twitter && (
                  <a
                    href={company.contact.socialMedia.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Twitter className="h-5 w-5" />
                  </a>
                )}
                {company.contact.socialMedia.facebook && (
                  <a
                    href={company.contact.socialMedia.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Facebook className="h-5 w-5" />
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyHeader;
