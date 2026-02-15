import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { PageBreadcrumb } from "@/components/shared/PageBreadcrumb";
import { SEOHead } from "@/components/shared/SEOHead";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import CTA from "@/components/CTA";
import { InvestorContactDialog } from "@/components/investor/InvestorContactDialog";
import { InvestorSuccessStories } from "@/components/investor/InvestorSuccessStories";

// Mock data for investors with Ivorian context
const investors = [
  {
    id: 1,
    name: "Orange Digital Ventures Afrique",
    logo: "/placeholder.svg",
    description: "Fonds d'investissement de Orange dédié aux startups africaines innovantes dans les secteurs de la fintech, e-santé, énergie et éducation.",
    investmentStages: ["Seed", "Series A"],
    ticketSize: "50M-500M FCFA",
    sectors: ["FinTech", "E-commerce", "HealthTech", "EdTech"],
    portfolio: ["MobilPay", "SanteYako", "Koulé Éducation"],
    website: "https://digitalventures.orange.com"
  },
  {
    id: 2,
    name: "Réseau des Business Angels de Côte d'Ivoire",
    logo: "/placeholder.svg",
    description: "Réseau d'investisseurs providentiels ivoiriens finançant les startups locales à fort potentiel de croissance et d'impact social.",
    investmentStages: ["Pre-seed", "Seed"],
    ticketSize: "5M-50M FCFA",
    sectors: ["AgriTech", "FinTech", "Retail", "Logistics"],
    portfolio: ["Wôrô Logistics", "Cocoa Connect"],
    website: "https://businessangels.ci"
  },
  {
    id: 3,
    name: "Fonds CI Innovations",
    logo: "/placeholder.svg",
    description: "Fonds d'investissement public-privé soutenu par l'État ivoirien pour financer les startups innovantes contribuant au développement numérique du pays.",
    investmentStages: ["Seed", "Series A"],
    ticketSize: "25M-150M FCFA",
    sectors: ["FinTech", "AgriTech", "CleanTech", "EdTech"],
    portfolio: ["Gnamakoudji Energy", "Ivoiro-Tech"],
    website: "https://ciinnovations.ci"
  },
  {
    id: 4,
    name: "Comoe Capital",
    logo: "/placeholder.svg",
    description: "Société de capital-investissement spécialisée dans le financement des PME et startups en Côte d'Ivoire et dans la sous-région ouest-africaine.",
    investmentStages: ["Series A", "Series B"],
    ticketSize: "100M-1B FCFA",
    sectors: ["FinTech", "HealthTech", "Energy", "Infrastructure"],
    portfolio: ["Akwaba Tour", "MobilPay", "Gnamakoudji Energy"],
    website: "https://comoecapital.com"
  },
  {
    id: 5,
    name: "Impact Hub Abidjan Ventures",
    logo: "/placeholder.svg",
    description: "Fonds d'amorçage de l'incubateur Impact Hub Abidjan, soutenant les entrepreneurs à fort impact social et environnemental.",
    investmentStages: ["Pre-seed", "Seed"],
    ticketSize: "10M-50M FCFA",
    sectors: ["EdTech", "HealthTech", "CleanTech", "AgriTech"],
    portfolio: ["SanteYako", "Cocoa Connect"],
    website: "https://abidjan.impacthub.net"
  },
  {
    id: 6,
    name: "Afrique Innovation Fund",
    logo: "/placeholder.svg",
    description: "Fonds de capital-risque panafricain avec un bureau à Abidjan, spécialisé dans les investissements dans les startups technologiques africaines.",
    investmentStages: ["Seed", "Series A"],
    ticketSize: "25M-250M FCFA",
    sectors: ["FinTech", "AgriTech", "E-commerce", "Mobile"],
    portfolio: ["Adjamé Market", "Cocoa Connect", "Ivoiro-Tech"],
    website: "https://afriqueinnovation.fund"
  }
];

const Investisseurs = () => {
  const [contactOpen, setContactOpen] = useState(false);
  const [selectedInvestor, setSelectedInvestor] = useState("");

  const handleContact = (investorName: string) => {
    setSelectedInvestor(investorName);
    setContactOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead
        title="Investisseurs"
        description="Découvrez les startups labellisées en Côte d'Ivoire et investissez dans l'innovation numérique africaine."
        path="/investisseurs"
      />
      <Navbar />
      <PageBreadcrumb className="py-3 bg-muted/30 border-b border-border" />
      <main id="main-content" className="flex-grow">
        {/* Hero section */}
        <section className="bg-gradient-to-r from-investor-dark to-investor-DEFAULT text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold mb-4">Investisseurs</h1>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              Découvrez les investisseurs actifs dans l'écosystème startup en Côte d'Ivoire et entrez en relation avec eux
            </p>
            <Button variant="secondary" size="lg" className="bg-background text-investor-DEFAULT hover:bg-accent">
              Proposer un pitch
            </Button>
          </div>
        </section>

        {/* Main content */}
        <section className="py-12 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {investors.map((investor) => (
                <Card key={investor.id} className="overflow-hidden card-hover h-full">
                  <CardContent className="p-0">
                    <div className="p-6">
                      <div className="flex items-center mb-6">
                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted mr-4 flex items-center justify-center">
                          <img 
                            src={investor.logo} 
                            alt={`${investor.name} logo`} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="font-bold text-xl">{investor.name}</h3>
                        </div>
                      </div>
                      
                      <p className="text-muted-foreground mb-6">
                        {investor.description}
                      </p>
                      
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-sm font-semibold text-muted-foreground mb-1">Stades d'investissement</h4>
                          <div className="flex flex-wrap gap-2">
                            {investor.investmentStages.map((stage, index) => (
                              <Badge key={index} variant="outline">{stage}</Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-semibold text-muted-foreground mb-1">Ticket moyen</h4>
                          <p className="text-foreground font-medium">{investor.ticketSize}</p>
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-semibold text-muted-foreground mb-1">Secteurs ciblés</h4>
                          <div className="flex flex-wrap gap-2">
                            {investor.sectors.map((sector, index) => (
                              <Badge key={index} variant="secondary">{sector}</Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-semibold text-muted-foreground mb-1">Portfolio (sélection)</h4>
                          <p className="text-foreground">
                            {investor.portfolio.join(", ")}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border-t border-border p-4 bg-muted/50 flex justify-between items-center">
                      <a 
                        href={investor.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-investor-DEFAULT hover:underline text-sm font-medium"
                      >
                        Visiter le site web
                      </a>
                      
                      <Button size="sm" onClick={() => handleContact(investor.name)}>
                        Contacter
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Success Stories */}
        <InvestorSuccessStories />
        
        {/* Process section */}
        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Comment obtenir un financement ?</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Suivez ces étapes pour maximiser vos chances d'obtenir un investissement
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-card rounded-xl p-6 text-center">
                <div className="w-16 h-16 bg-investor-light rounded-full flex items-center justify-center text-investor-DEFAULT text-2xl font-bold mx-auto mb-4">1</div>
                <h3 className="text-xl font-bold mb-2">Préparez votre pitch</h3>
                <p className="text-muted-foreground">
                  Élaborez un pitch deck convaincant présentant votre solution, votre marché et votre équipe.
                </p>
              </div>
              
              <div className="bg-card rounded-xl p-6 text-center">
                <div className="w-16 h-16 bg-investor-light rounded-full flex items-center justify-center text-investor-DEFAULT text-2xl font-bold mx-auto mb-4">2</div>
                <h3 className="text-xl font-bold mb-2">Identifiez les investisseurs adaptés</h3>
                <p className="text-muted-foreground">
                  Recherchez des investisseurs correspondant à votre secteur, stade de développement et ticket d'investissement.
                </p>
              </div>
              
              <div className="bg-card rounded-xl p-6 text-center">
                <div className="w-16 h-16 bg-investor-light rounded-full flex items-center justify-center text-investor-DEFAULT text-2xl font-bold mx-auto mb-4">3</div>
                <h3 className="text-xl font-bold mb-2">Entrez en contact</h3>
                <p className="text-muted-foreground">
                  Utilisez la plateforme pour soumettre votre pitch aux investisseurs sélectionnés et suivre vos candidatures.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        <CTA />
      </main>
      <Footer />

      <InvestorContactDialog
        open={contactOpen}
        onOpenChange={setContactOpen}
        investorName={selectedInvestor}
      />
    </div>
  );
};

export default Investisseurs;
