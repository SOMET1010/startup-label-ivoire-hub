import { AICompany } from "@/types/aiCompany";
import { Card, CardContent } from "@/components/ui/card";

interface CompanyHistoryProps {
  company: AICompany;
}

const CompanyHistory = ({ company }: CompanyHistoryProps) => {
  if (!company.history) return null;
  
  return (
    <section>
      <h2 className="text-3xl font-bold mb-6">Notre Histoire</h2>
      
      <Card>
        <CardContent className="p-6">
          <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
            {company.history.story}
          </p>
          
          <h3 className="text-xl font-semibold mb-6">Étapes clés</h3>
          
          <div className="relative space-y-6 before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
            {company.history.milestones.map((milestone, idx) => (
              <div key={idx} className="relative pl-8">
                <div className="absolute left-0 top-1.5 w-4 h-4 rounded-full bg-primary border-4 border-background" />
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-2xl font-bold text-primary">{milestone.year}</span>
                    <span className="text-lg font-semibold">{milestone.title}</span>
                  </div>
                  <p className="text-muted-foreground">{milestone.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default CompanyHistory;
