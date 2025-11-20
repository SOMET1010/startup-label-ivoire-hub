import { useParams, Link, useNavigate } from "react-router-dom";
import { aiCompanies } from "@/data/aiCompanies";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CompanyHeader from "@/components/ai-companies/CompanyHeader";
import CompanyOverview from "@/components/ai-companies/CompanyOverview";
import CompanyHistory from "@/components/ai-companies/CompanyHistory";
import CompanyTeam from "@/components/ai-companies/CompanyTeam";
import CompanyProjects from "@/components/ai-companies/CompanyProjects";
import CompanyContact from "@/components/ai-companies/CompanyContact";
import CompanyStats from "@/components/ai-companies/CompanyStats";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

const EntrepriseIADetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const company = aiCompanies.find(c => c.id === Number(id));
  
  if (!company) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Entreprise non trouvée</h1>
            <p className="text-muted-foreground mb-6">L'entreprise que vous recherchez n'existe pas.</p>
            <Button asChild>
              <Link to="/entreprises-ia">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour à la liste
              </Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  const currentIndex = aiCompanies.findIndex(c => c.id === company.id);
  const previousCompany = currentIndex > 0 ? aiCompanies[currentIndex - 1] : null;
  const nextCompany = currentIndex < aiCompanies.length - 1 ? aiCompanies[currentIndex + 1] : null;
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <CompanyHeader company={company} />
        
        <div className="container mx-auto px-4 py-12 space-y-16">
          <CompanyOverview company={company} />
          
          {company.keyStats && <CompanyStats company={company} />}
          
          {company.history && <CompanyHistory company={company} />}
          
          {company.team && company.team.length > 0 && <CompanyTeam company={company} />}
          
          {company.projects && company.projects.length > 0 && <CompanyProjects company={company} />}
          
          {company.contact && <CompanyContact company={company} />}
        </div>
        
        {/* Navigation vers entreprises précédente/suivante */}
        <div className="border-t bg-muted/30">
          <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center">
              {previousCompany ? (
                <Button
                  variant="outline"
                  onClick={() => navigate(`/entreprises-ia/${previousCompany.id}`)}
                  className="group"
                >
                  <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                  <div className="text-left">
                    <div className="text-xs text-muted-foreground">Précédent</div>
                    <div className="font-medium">{previousCompany.name}</div>
                  </div>
                </Button>
              ) : (
                <div />
              )}
              
              <Button variant="ghost" asChild>
                <Link to="/entreprises-ia">Retour à la liste</Link>
              </Button>
              
              {nextCompany ? (
                <Button
                  variant="outline"
                  onClick={() => navigate(`/entreprises-ia/${nextCompany.id}`)}
                  className="group"
                >
                  <div className="text-right">
                    <div className="text-xs text-muted-foreground">Suivant</div>
                    <div className="font-medium">{nextCompany.name}</div>
                  </div>
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              ) : (
                <div />
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default EntrepriseIADetail;
