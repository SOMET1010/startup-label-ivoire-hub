import { AICompany } from "@/types/aiCompany";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Linkedin } from "lucide-react";

interface CompanyTeamProps {
  company: AICompany;
}

const CompanyTeam = ({ company }: CompanyTeamProps) => {
  if (!company.team || company.team.length === 0) return null;
  
  return (
    <section>
      <h2 className="text-3xl font-bold mb-6">Notre Équipe</h2>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {company.team.map((member, idx) => (
          <Card key={idx} className="overflow-hidden hover:shadow-lg transition-shadow">
            <CardContent className="p-0">
              <div className="aspect-square bg-muted overflow-hidden">
                <img 
                  src={member.photo} 
                  alt={member.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="p-6">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-bold text-lg">{member.name}</h3>
                    <p className="text-sm text-primary font-medium">{member.role}</p>
                  </div>
                  
                  {member.linkedin && (
                    <Button size="sm" variant="ghost" asChild>
                      <a href={member.linkedin} target="_blank" rel="noopener noreferrer">
                        <Linkedin className="h-4 w-4" />
                      </a>
                    </Button>
                  )}
                </div>
                
                <p className="text-sm text-muted-foreground">{member.bio}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default CompanyTeam;
