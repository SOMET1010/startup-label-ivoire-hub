
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import CTA from "@/components/CTA";

// Mock data for investors
const investors = [
  {
    id: 1,
    name: "Orange Ventures Africa",
    logo: "https://randomuser.me/api/portraits/lego/1.jpg",
    description: "Fonds d'investissement corporate dédié aux startups africaines innovantes dans les domaines des technologies et des services numériques.",
    investmentStages: ["Seed", "Series A"],
    ticketSize: "€50K - €500K",
    sectors: ["FinTech", "E-commerce", "HealthTech", "EdTech"],
    portfolio: ["Demo Company 1", "Demo Company 2", "Demo Company 3"],
    website: "https://orangeventures.com"
  },
  {
    id: 2,
    name: "Côte d'Ivoire Angels",
    logo: "https://randomuser.me/api/portraits/lego/2.jpg",
    description: "Réseau d'investisseurs providentiels ivoiriens finançant les startups locales à fort potentiel de croissance.",
    investmentStages: ["Pre-seed", "Seed"],
    ticketSize: "€10K - €100K",
    sectors: ["AgriTech", "FinTech", "Retail", "Logistics"],
    portfolio: ["Demo Company 4", "Demo Company 5"],
    website: "https://cotedivoireangels.org"
  },
  {
    id: 3,
    name: "Startup Invest CI",
    logo: "https://randomuser.me/api/portraits/lego/3.jpg",
    description: "Fonds d'investissement public-privé dédié au financement et à l'accompagnement des startups innovantes ivoiriennes.",
    investmentStages: ["Seed", "Series A"],
    ticketSize: "€50K - €300K",
    sectors: ["FinTech", "AgriTech", "CleanTech", "EdTech"],
    portfolio: ["Demo Company 6", "Demo Company 7"],
    website: "https://startupinvestci.ci"
  },
  {
    id: 4,
    name: "Afric Invest Partners",
    logo: "https://randomuser.me/api/portraits/lego/4.jpg",
    description: "Société de capital-investissement panafricaine avec une attention particulière pour les entreprises innovantes à fort impact.",
    investmentStages: ["Series A", "Series B"],
    ticketSize: "€200K - €2M",
    sectors: ["FinTech", "HealthTech", "Energy", "Infrastructure"],
    portfolio: ["Demo Company 8", "Demo Company 9", "Demo Company 10"],
    website: "https://africinvest.com"
  },
  {
    id: 5,
    name: "Digital Africa Seed Fund",
    logo: "https://randomuser.me/api/portraits/lego/5.jpg",
    description: "Fonds d'amorçage pour les startups du secteur numérique à fort impact social et économique en Afrique.",
    investmentStages: ["Pre-seed", "Seed"],
    ticketSize: "€20K - €100K",
    sectors: ["EdTech", "HealthTech", "FinTech", "GreenTech"],
    portfolio: ["Demo Company 11", "Demo Company 12"],
    website: "https://digital-africa.co"
  },
  {
    id: 6,
    name: "Savannah Fund",
    logo: "https://randomuser.me/api/portraits/lego/6.jpg",
    description: "Fonds de capital-risque spécialisé dans les investissements early-stage dans les startups technologiques en Afrique.",
    investmentStages: ["Seed", "Series A"],
    ticketSize: "€25K - €500K",
    sectors: ["FinTech", "AgriTech", "E-commerce", "Mobile"],
    portfolio: ["Demo Company 13", "Demo Company 14", "Demo Company 15"],
    website: "https://savannah.vc"
  }
];

const Investisseurs = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {/* Hero section */}
        <section className="bg-gradient-to-r from-investor-dark to-investor-DEFAULT text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold mb-4">Investisseurs</h1>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              Découvrez les investisseurs actifs dans l'écosystème startup en Côte d'Ivoire et entrez en relation avec eux
            </p>
            <Button variant="secondary" size="lg" className="bg-white text-investor-DEFAULT hover:bg-gray-100">
              Proposer un pitch
            </Button>
          </div>
        </section>

        {/* Main content */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {investors.map((investor) => (
                <Card key={investor.id} className="overflow-hidden card-hover h-full">
                  <CardContent className="p-0">
                    <div className="p-6">
                      <div className="flex items-center mb-6">
                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 mr-4 flex items-center justify-center">
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
                      
                      <p className="text-gray-600 mb-6">
                        {investor.description}
                      </p>
                      
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-sm font-semibold text-gray-500 mb-1">Stades d'investissement</h4>
                          <div className="flex flex-wrap gap-2">
                            {investor.investmentStages.map((stage, index) => (
                              <Badge key={index} variant="outline">{stage}</Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-semibold text-gray-500 mb-1">Ticket moyen</h4>
                          <p className="text-gray-800 font-medium">{investor.ticketSize}</p>
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-semibold text-gray-500 mb-1">Secteurs ciblés</h4>
                          <div className="flex flex-wrap gap-2">
                            {investor.sectors.map((sector, index) => (
                              <Badge key={index} variant="secondary">{sector}</Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-semibold text-gray-500 mb-1">Portfolio (sélection)</h4>
                          <p className="text-gray-700">
                            {investor.portfolio.join(", ")}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border-t border-gray-100 p-4 bg-gray-50 flex justify-between items-center">
                      <a 
                        href={investor.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-investor-DEFAULT hover:underline text-sm font-medium"
                      >
                        Visiter le site web
                      </a>
                      
                      <Button size="sm">
                        Contacter
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
        
        {/* Process section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Comment obtenir un financement ?</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Suivez ces étapes pour maximiser vos chances d'obtenir un investissement
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-gray-50 rounded-xl p-6 text-center">
                <div className="w-16 h-16 bg-investor-light rounded-full flex items-center justify-center text-investor-DEFAULT text-2xl font-bold mx-auto mb-4">1</div>
                <h3 className="text-xl font-bold mb-2">Préparez votre pitch</h3>
                <p className="text-gray-600">
                  Élaborez un pitch deck convaincant présentant votre solution, votre marché et votre équipe.
                </p>
              </div>
              
              <div className="bg-gray-50 rounded-xl p-6 text-center">
                <div className="w-16 h-16 bg-investor-light rounded-full flex items-center justify-center text-investor-DEFAULT text-2xl font-bold mx-auto mb-4">2</div>
                <h3 className="text-xl font-bold mb-2">Identifiez les investisseurs adaptés</h3>
                <p className="text-gray-600">
                  Recherchez des investisseurs correspondant à votre secteur, stade de développement et ticket d'investissement.
                </p>
              </div>
              
              <div className="bg-gray-50 rounded-xl p-6 text-center">
                <div className="w-16 h-16 bg-investor-light rounded-full flex items-center justify-center text-investor-DEFAULT text-2xl font-bold mx-auto mb-4">3</div>
                <h3 className="text-xl font-bold mb-2">Entrez en contact</h3>
                <p className="text-gray-600">
                  Utilisez la plateforme pour soumettre votre pitch aux investisseurs sélectionnés et suivre vos candidatures.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        <CTA />
      </main>
      <Footer />
    </div>
  );
};

export default Investisseurs;
