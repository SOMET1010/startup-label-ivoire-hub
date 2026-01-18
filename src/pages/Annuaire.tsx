import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Search } from "lucide-react";

// Mock data for startups with Ivorian names and context
const startups = [
  {
    id: 1,
    name: "Cocoa Connect",
    logo: "/placeholder.svg",
    description: "Plateforme de mise en relation des producteurs de cacao avec les acheteurs internationaux, utilisant la blockchain pour garantir la traçabilité.",
    sector: "AgriTech",
    founded: 2021,
    location: "Abidjan",
    website: "https://coaconnect.ci",
    isLabeled: true
  },
  {
    id: 2,
    name: "MobilPay",
    logo: "/placeholder.svg",
    description: "Solution de paiement mobile adaptée spécifiquement aux besoins des PME et commerçants des marchés ivoiriens.",
    sector: "FinTech",
    founded: 2020,
    location: "Abidjan",
    website: "https://mobilpay.ci",
    isLabeled: true
  },
  {
    id: 3,
    name: "SanteYako",
    logo: "/placeholder.svg",
    description: "Application de télémédecine permettant de mettre en relation patients et médecins, avec un système de livraison de médicaments intégré.",
    sector: "HealthTech",
    founded: 2022,
    location: "Yamoussoukro",
    website: "https://santeyako.ci",
    isLabeled: true
  },
  {
    id: 4,
    name: "Koulé Éducation",
    logo: "/placeholder.svg",
    description: "Plateforme éducative proposant des contenus adaptés au programme scolaire ivoirien, accessibles même sans connexion internet.",
    sector: "EdTech",
    founded: 2019,
    location: "Bouaké",
    website: "https://koule-edu.ci",
    isLabeled: true
  },
  {
    id: 5,
    name: "Wôrô Logistics",
    logo: "/placeholder.svg",
    description: "Solution de gestion logistique optimisant le transport de marchandises entre zones rurales et centres urbains en Côte d'Ivoire.",
    sector: "LogisTech",
    founded: 2020,
    location: "San-Pédro",
    website: "https://woro-logistics.ci",
    isLabeled: false
  },
  {
    id: 6,
    name: "Akwaba Tour",
    logo: "/placeholder.svg",
    description: "Application de découverte touristique mettant en valeur le patrimoine culturel et naturel ivoirien à travers des expériences immersives.",
    sector: "TravelTech",
    founded: 2021,
    location: "Grand-Bassam",
    website: "https://akwabatour.ci",
    isLabeled: false
  },
  {
    id: 7,
    name: "Adjamé Market",
    logo: "/placeholder.svg",
    description: "Marketplace en ligne connectant les artisans ivoiriens aux marchés internationaux, avec un focus sur l'artisanat traditionnel.",
    sector: "E-commerce",
    founded: 2022,
    location: "Abidjan",
    website: "https://adjamemarket.ci",
    isLabeled: false
  },
  {
    id: 8,
    name: "Gnamakoudji Energy",
    logo: "/placeholder.svg",
    description: "Startup spécialisée dans le développement de solutions d'énergie solaire adaptées aux besoins des zones rurales ivoiriennes.",
    sector: "CleanTech",
    founded: 2021,
    location: "Korhogo",
    website: "https://gnamakoudji-energy.ci",
    isLabeled: true
  },
  {
    id: 9,
    name: "Ivoiro-Tech",
    logo: "/placeholder.svg",
    description: "Studio de développement spécialisé dans la création d'applications mobiles et de solutions digitales adaptées au marché africain.",
    sector: "Software",
    founded: 2019,
    location: "Abidjan",
    website: "https://ivoirotech.ci",
    isLabeled: true
  }
];

const Annuaire = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sectorFilter, setSectorFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");
  const [labelFilter, setLabelFilter] = useState("all");
  
  // Filter startups based on search and filters
  const filteredStartups = startups.filter((startup) => {
    const matchesSearch = startup.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          startup.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSector = sectorFilter === "all" || startup.sector === sectorFilter;
    
    const matchesLocation = locationFilter === "all" || startup.location === locationFilter;
    
    const matchesLabel = labelFilter === "all" || 
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
      <main className="flex-grow py-12 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Annuaire des Startups</h1>
            <p className="text-xl text-muted-foreground">
              Découvrez les startups innovantes de l'écosystème numérique ivoirien
            </p>
          </div>
          
          {/* Search and Filters */}
          <div className="mb-8 bg-card p-6 rounded-xl shadow-sm">
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground/70" />
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
                    <SelectItem value="all">Tous les secteurs</SelectItem>
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
                    <SelectItem value="all">Toutes les localisations</SelectItem>
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
                    <SelectItem value="all">Tous les statuts</SelectItem>
                    <SelectItem value="labeled">Startups labellisées</SelectItem>
                    <SelectItem value="unlabeled">Startups non labellisées</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="text-sm text-muted-foreground">
                {filteredStartups.length} startup{filteredStartups.length !== 1 ? "s" : ""} trouvée{filteredStartups.length !== 1 ? "s" : ""}
              </div>
              
              <Button variant="outline" size="sm" onClick={() => {
                setSearchTerm("");
                setSectorFilter("all");
                setLocationFilter("all");
                setLabelFilter("all");
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
                      <div className="w-16 h-16 rounded-full overflow-hidden bg-muted mr-4">
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
                    
                    <p className="text-muted-foreground mb-4 line-clamp-3">
                      {startup.description}
                    </p>
                    
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <div>Fondée en {startup.founded}</div>
                      <div>{startup.location}</div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-border flex justify-between">
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
              <div className="text-2xl font-bold text-muted-foreground/70 mb-2">Aucune startup trouvée</div>
              <p className="text-muted-foreground">Essayez de modifier vos critères de recherche</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Annuaire;
