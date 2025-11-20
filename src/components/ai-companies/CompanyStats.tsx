import { AICompany } from "@/types/aiCompany";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, CheckCircle2, DollarSign } from "lucide-react";

interface CompanyStatsProps {
  company: AICompany;
}

const CompanyStats = ({ company }: CompanyStatsProps) => {
  if (!company.keyStats) return null;
  
  return (
    <section>
      <h2 className="text-3xl font-bold mb-6">Chiffres Clés</h2>
      
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-primary/10 to-background border-primary/20">
          <CardContent className="p-6 text-center">
            <TrendingUp className="h-12 w-12 mx-auto mb-4 text-primary" />
            <div className="text-4xl font-bold mb-2">{company.keyStats.growth}</div>
            <div className="text-muted-foreground">Croissance annuelle</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-primary/10 to-background border-primary/20">
          <CardContent className="p-6 text-center">
            <CheckCircle2 className="h-12 w-12 mx-auto mb-4 text-primary" />
            <div className="text-4xl font-bold mb-2">{company.keyStats.projectsCompleted}</div>
            <div className="text-muted-foreground">Projets réalisés</div>
          </CardContent>
        </Card>
        
        {company.keyStats.revenue && (
          <Card className="bg-gradient-to-br from-primary/10 to-background border-primary/20">
            <CardContent className="p-6 text-center">
              <DollarSign className="h-12 w-12 mx-auto mb-4 text-primary" />
              <div className="text-4xl font-bold mb-2">{company.keyStats.revenue}</div>
              <div className="text-muted-foreground">Chiffre d'affaires</div>
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  );
};

export default CompanyStats;
