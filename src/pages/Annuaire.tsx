
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Search } from "lucide-react";

// Mock data for startups
const startups = [
  {
    id: 1,
    name: "FinPay CI",
    logo: "https://randomuser.me/api/portraits/men/32.jpg",
    description: "Solution de paiement mobile pour les PME ivoiriennes avec des options de crédit intégrées.",
    sector: "FinTech",
    founded: 2020,
    location: "Abidjan",
    website: "https://finpay.ci",
    isLabeled: true
  },
  {
    id: 2,
    name: "AgroConnect",
    logo: "https://randomuser.me/api/portraits/women/44.jpg",
    description: "Plateforme connectant les agriculteurs aux acheteurs et proposant des conseils agricoles via IA.",
    sector: "AgriTech",
    founded: 2021,
    location: "Yamoussoukro",
    website: "https://agroconnect.ci",
    isLabeled: true
  },
  {
    id: 3,
    name: "EduPlus",
    logo: "https://randomuser.me/api/portraits/men/67.jpg",
    description: "Application mobile d'apprentissage adaptée au curriculum ivoirien avec contenu hors ligne.",
    sector: "EdTech",
    founded: 2019,
    location: "Abidjan",
    website: "https://eduplus.ci",
    isLabeled: true
  },
  {
    id: 4,
    name: "MedConnect",
    logo: "https://randomuser.me/api/portraits/women/22.jpg",
    description: "Service de télémédecine connectant patients et médecins pour consultations à distance.",
    sector: "HealthTech",
    founded: 2022,
    location: "Bouaké",
    website: "https://medconnect.ci",
    isLabeled: true
  },
  {
    id: 5,
    name: "LogiTrans",
    logo: "https://randomuser.me/api/portraits/men/54.jpg",
    description: "Solution logistique optimisant le transport de marchandises dans toute l'Afrique de l'Ouest.",
    sector: "LogisTech",
    founded: 2020,
    location: "Abidjan",
    website: "https://logitrans.ci",
    isLabeled: false
  },
  {
    id: 6,
    name: "TourismeCI",
    logo: "https://randomuser.me/api/portraits/women/28.jpg",
    description: "Plateforme de découverte d'expériences touristiques locales en Côte d'Ivoire.",
    sector: "TravelTech",
    founded: 2021,
    location: "San-Pédro",
    website: "https://tourismeci.com",
    isLabeled: false
  },
];

const Annuaire = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sectorFilter, setSectorFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [labelFilter, setLabelFilter] = useState("");
  
  // Filter startups based on search and filters
  const filteredStartups = startups.filter((startup) => {
    const matchesSearch = startup.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          startup.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSector = sectorFilter === "" || startup.sector === sectorFilter;
    
    const matchesLocation = locationFilter === "" || startup.location === locationFilter;
    
    const matchesLabel = labelFilter === "" || 
                         (labelFilter === "labeled" && startup.isLabeled) || 
                         (labelFilter === "unlabeled" && !startup.isLabeled);
    
    return matchesSearch && matchesSector && matchesLocation && matchesLabel;
  });
  
  // Extract unique sectors and locations for filters
  const sectors = [...new Set(startups.map(startup => startup.sector))];
  const locations = [...new Set(startups.map(startup => startup.location))];
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Annuaire des Startups</h1>
            <p className="text-xl text-gray-600">
              Découvrez les startups innovantes de l'écosystème numérique ivoirien
            </p>
          </div>
          
          {/* Search and Filters */}
          <div className="mb-8 bg-white p-6 rounded-xl shadow-sm">
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input 
                  placeholder="Rechercher une startup..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:w-2/3">
                <Select value={sectorFilter} onValueChange={setSectorFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Secteur d'activité" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Tous les secteurs</SelectItem>
                    {sectors.map((sector) => (
                      <SelectItem key={sector} value={sector}>{sector}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select value={locationFilter} onValueChange={setLocationFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Localisation" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Toutes les localisations</SelectItem>
                    {locations.map((location) => (
                      <SelectItem key={location} value={location}>{location}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select value={labelFilter} onValueChange={setLabelFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Statut de labellisation" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Tous les statuts</SelectItem>
                    <SelectItem value="labeled">Startups labellisées</SelectItem>
                    <SelectItem value="unlabeled">Startups non labellisées</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-500">
                {filteredStartups.length} startup{filteredStartups.length !== 1 ? "s" : ""} trouvée{filteredStartups.length !== 1 ? "s" : ""}
              </div>
              
              <Button variant="outline" size="sm" onClick={() => {
                setSearchTerm("");
                setSectorFilter("");
                setLocationFilter("");
                setLabelFilter("");
              }}>
                Réinitialiser les filtres
              </Button>
            </div>
          </div>
          
          {/* Startups Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStartups.map((startup) => (
              <Card key={startup.id} className="overflow-hidden card-hover">
                <CardContent className="p-0">
                  <div className="p-4">
                    <div className="flex items-center mb-4">
                      <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100 mr-4">
                        <img 
                          src={startup.logo} 
                          alt={`${startup.name} logo`} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-bold text-xl">{startup.name}</h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant={startup.isLabeled ? "default" : "outline"} className={startup.isLabeled ? "bg-ivoire-green" : ""}>
                            {startup.isLabeled ? "Labellisée" : "Non labellisée"}
                          </Badge>
                          <Badge variant="secondary">{startup.sector}</Badge>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {startup.description}
                    </p>
                    
                    <div className="flex justify-between text-sm text-gray-500">
                      <div>Fondée en {startup.founded}</div>
                      <div>{startup.location}</div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between">
                      <a 
                        href={startup.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-ivoire-orange hover:underline text-sm font-medium"
                      >
                        Visiter le site web
                      </a>
                      
                      <Button size="sm" variant="ghost">Voir détails</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {filteredStartups.length === 0 && (
            <div className="text-center py-12">
              <div className="text-2xl font-bold text-gray-400 mb-2">Aucune startup trouvée</div>
              <p className="text-gray-500">Essayez de modifier vos critères de recherche</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Annuaire;
