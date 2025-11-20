import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Building2, MapPin, Users, Cpu, Brain, Key, AlertCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MapView from "@/components/ai-companies/MapView";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Mock data for AI companies
const aiCompanies = [
  {
    id: 1,
    name: "Ivoire AI Labs",
    logo: "/placeholder.svg",
    description: "Centre de recherche et développement en intelligence artificielle, spécialisé dans le traitement du langage naturel pour les langues africaines.",
    sector: "Recherche & Développement",
    specialization: "NLP",
    founded: 2020,
    location: "Abidjan",
    coordinates: { lat: 5.3600, lng: -4.0083 },
    employees: "15-50",
    website: "https://ivoireailabs.ci",
    isLabeled: true,
    services: ["Traduction automatique", "Analyse de sentiments", "Chatbots"]
  },
  {
    id: 2,
    name: "AgriSmart CI",
    logo: "/placeholder.svg",
    description: "Solutions d'IA pour l'agriculture intelligente : prédiction des récoltes, détection des maladies des cultures et optimisation des ressources.",
    sector: "AgriTech",
    specialization: "Computer Vision",
    founded: 2021,
    location: "Yamoussoukro",
    coordinates: { lat: 6.8276, lng: -5.2893 },
    employees: "10-25",
    website: "https://agrismart.ci",
    isLabeled: true,
    services: ["Analyse d'images satellitaires", "Prédiction météo", "Conseil personnalisé"]
  },
  {
    id: 3,
    name: "MedTech AI",
    logo: "/placeholder.svg",
    description: "Intelligence artificielle appliquée à la santé : diagnostic assisté par IA, analyse d'imagerie médicale et prédiction de maladies.",
    sector: "HealthTech",
    specialization: "Medical AI",
    founded: 2022,
    location: "Abidjan",
    coordinates: { lat: 5.3600, lng: -4.0083 },
    employees: "25-50",
    website: "https://medtechai.ci",
    isLabeled: true,
    services: ["Diagnostic par imagerie", "Prédiction de risques", "Télémédecine"]
  },
  {
    id: 4,
    name: "FinPredict",
    logo: "/placeholder.svg",
    description: "Solutions d'IA pour la finance : scoring de crédit, détection de fraude et prédiction de risques financiers adaptés au marché africain.",
    sector: "FinTech",
    specialization: "Machine Learning",
    founded: 2021,
    location: "Abidjan",
    coordinates: { lat: 5.3600, lng: -4.0083 },
    employees: "20-40",
    website: "https://finpredict.ci",
    isLabeled: false,
    services: ["Scoring crédit", "Anti-fraude", "Analyse prédictive"]
  },
  {
    id: 5,
    name: "EduBot CI",
    logo: "/placeholder.svg",
    description: "Plateforme éducative utilisant l'IA pour personnaliser l'apprentissage et fournir du tutorat intelligent aux étudiants.",
    sector: "EdTech",
    specialization: "NLP & Adaptive Learning",
    founded: 2020,
    location: "Bouaké",
    coordinates: { lat: 7.6944, lng: -5.0319 },
    employees: "15-30",
    website: "https://edubot.ci",
    isLabeled: true,
    services: ["Tutorat intelligent", "Évaluation adaptative", "Recommandations personnalisées"]
  },
  {
    id: 6,
    name: "VisionTech Africa",
    logo: "/placeholder.svg",
    description: "Spécialiste de la vision par ordinateur pour la surveillance, la sécurité et l'analyse vidéo en temps réel.",
    sector: "Security & Surveillance",
    specialization: "Computer Vision",
    founded: 2019,
    location: "Abidjan",
    coordinates: { lat: 5.3600, lng: -4.0083 },
    employees: "30-60",
    website: "https://visiontech.ci",
    isLabeled: false,
    services: ["Reconnaissance faciale", "Détection d'objets", "Analyse comportementale"]
  },
  {
    id: 7,
    name: "DataMind CI",
    logo: "/placeholder.svg",
    description: "Cabinet de conseil en data science et IA, accompagnant les entreprises dans leur transformation numérique.",
    sector: "Conseil & Services",
    specialization: "Data Science",
    founded: 2021,
    location: "Abidjan",
    coordinates: { lat: 5.3600, lng: -4.0083 },
    employees: "10-20",
    website: "https://datamind.ci",
    isLabeled: true,
    services: ["Audit data", "Formation IA", "Développement sur mesure"]
  },
  {
    id: 8,
    name: "SmartCity Ivoire",
    logo: "/placeholder.svg",
    description: "Solutions IoT et IA pour la gestion intelligente des villes : trafic, énergie, déchets et services urbains.",
    sector: "Smart City",
    specialization: "IoT & AI",
    founded: 2020,
    location: "Yamoussoukro",
    coordinates: { lat: 6.8276, lng: -5.2893 },
    employees: "20-35",
    website: "https://smartcity.ci",
    isLabeled: false,
    services: ["Gestion du trafic", "Smart lighting", "Gestion des déchets"]
  }
];

const EntreprisesIA = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sectorFilter, setSectorFilter] = useState("all");
  const [specializationFilter, setSpecializationFilter] = useState("all");
  const [labelFilter, setLabelFilter] = useState("all");
  const [mapboxApiKey, setMapboxApiKey] = useState("");
  const [tempApiKey, setTempApiKey] = useState("");
  
  // Load API key from localStorage on mount
  useEffect(() => {
    const savedKey = localStorage.getItem('mapboxApiKey');
    if (savedKey) {
      setMapboxApiKey(savedKey);
    }
  }, []);
  
  // Save API key to localStorage
  const handleSaveApiKey = () => {
    if (tempApiKey.trim()) {
      localStorage.setItem('mapboxApiKey', tempApiKey.trim());
      setMapboxApiKey(tempApiKey.trim());
    }
  };
  
  // Filter companies based on search and filters
  const filteredCompanies = aiCompanies.filter((company) => {
    const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          company.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSector = sectorFilter === "all" || company.sector === sectorFilter;
    
    const matchesSpecialization = specializationFilter === "all" || company.specialization === specializationFilter;
    
    const matchesLabel = labelFilter === "all" || 
                         (labelFilter === "labeled" && company.isLabeled) || 
                         (labelFilter === "unlabeled" && !company.isLabeled);
    
    return matchesSearch && matchesSector && matchesSpecialization && matchesLabel;
  });
  
  // Extract unique sectors and specializations for filters
  const sectors = [...new Set(aiCompanies.map(company => company.sector))];
  const specializations = [...new Set(aiCompanies.map(company => company.specialization))];
  
  // Group companies by location for map view
  const companiesByLocation = filteredCompanies.reduce((acc, company) => {
    if (!acc[company.location]) {
      acc[company.location] = [];
    }
    acc[company.location].push(company);
    return acc;
  }, {} as Record<string, typeof aiCompanies>);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-12 bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <Brain className="h-12 w-12 text-primary" />
              </div>
            </div>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Cartographie des Entreprises IA
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Découvrez l'écosystème de l'intelligence artificielle en Côte d'Ivoire
            </p>
          </div>
          
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-4 text-center">
                <Building2 className="h-8 w-8 mx-auto mb-2 text-primary" />
                <div className="text-2xl font-bold">{aiCompanies.length}</div>
                <div className="text-sm text-muted-foreground">Entreprises IA</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Cpu className="h-8 w-8 mx-auto mb-2 text-primary" />
                <div className="text-2xl font-bold">{sectors.length}</div>
                <div className="text-sm text-muted-foreground">Secteurs d'activité</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Brain className="h-8 w-8 mx-auto mb-2 text-primary" />
                <div className="text-2xl font-bold">{specializations.length}</div>
                <div className="text-sm text-muted-foreground">Spécialisations</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <MapPin className="h-8 w-8 mx-auto mb-2 text-primary" />
                <div className="text-2xl font-bold">{Object.keys(companiesByLocation).length}</div>
                <div className="text-sm text-muted-foreground">Villes</div>
              </CardContent>
            </Card>
          </div>
          
          {/* Search and Filters */}
          <div className="mb-8 bg-card p-6 rounded-xl shadow-sm border">
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Rechercher une entreprise IA..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:w-2/3">
                <Select value={sectorFilter} onValueChange={setSectorFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Secteur" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les secteurs</SelectItem>
                    {sectors.map((sector) => (
                      <SelectItem key={sector} value={sector}>{sector}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select value={specializationFilter} onValueChange={setSpecializationFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Spécialisation" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes les spécialisations</SelectItem>
                    {specializations.map((spec) => (
                      <SelectItem key={spec} value={spec}>{spec}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select value={labelFilter} onValueChange={setLabelFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les statuts</SelectItem>
                    <SelectItem value="labeled">Labellisées</SelectItem>
                    <SelectItem value="unlabeled">Non labellisées</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="text-sm text-muted-foreground">
                {filteredCompanies.length} entreprise{filteredCompanies.length !== 1 ? "s" : ""} trouvée{filteredCompanies.length !== 1 ? "s" : ""}
              </div>
              
              <Button variant="outline" size="sm" onClick={() => {
                setSearchTerm("");
                setSectorFilter("all");
                setSpecializationFilter("all");
                setLabelFilter("all");
              }}>
                Réinitialiser les filtres
              </Button>
            </div>
          </div>
          
          {/* Tabs for List and Map View */}
          <Tabs defaultValue="list" className="w-full">
            <TabsList className="grid w-full md:w-[400px] grid-cols-2 mb-6">
              <TabsTrigger value="list">Vue Liste</TabsTrigger>
              <TabsTrigger value="map">Vue Cartographique</TabsTrigger>
            </TabsList>
            
            {/* List View */}
            <TabsContent value="list">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCompanies.map((company) => (
                  <Card key={company.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <CardContent className="p-0">
                      <div className="p-6">
                        <div className="flex items-start mb-4">
                          <div className="w-14 h-14 rounded-lg overflow-hidden bg-muted mr-4 flex-shrink-0">
                            <img 
                              src={company.logo} 
                              alt={`${company.name} logo`} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-grow">
                            <h3 className="font-bold text-lg mb-1">{company.name}</h3>
                            <div className="flex flex-wrap gap-1">
                              <Badge variant={company.isLabeled ? "default" : "outline"} className="text-xs">
                                {company.isLabeled ? "Labellisée" : "Non labellisée"}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        
                        <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                          {company.description}
                        </p>
                        
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Cpu className="h-3 w-3 mr-2" />
                            <span className="font-medium">{company.specialization}</span>
                          </div>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <MapPin className="h-3 w-3 mr-2" />
                            <span>{company.location}</span>
                          </div>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Users className="h-3 w-3 mr-2" />
                            <span>{company.employees} employés</span>
                          </div>
                        </div>
                        
                        <div className="mb-4">
                          <div className="text-xs font-medium mb-2">Services :</div>
                          <div className="flex flex-wrap gap-1">
                            {company.services.slice(0, 3).map((service, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                {service}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div className="pt-4 border-t flex justify-between items-center">
                          <a 
                            href={company.website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-primary hover:underline text-sm font-medium"
                          >
                            Visiter le site
                          </a>
                          
                          <Button size="sm" variant="ghost">Détails</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              {filteredCompanies.length === 0 && (
                <div className="text-center py-12">
                  <Brain className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
                  <div className="text-2xl font-bold text-muted-foreground mb-2">Aucune entreprise trouvée</div>
                  <p className="text-muted-foreground">Essayez de modifier vos critères de recherche</p>
                </div>
              )}
            </TabsContent>
            
            {/* Map View */}
            <TabsContent value="map">
              {!mapboxApiKey ? (
                <Card>
                  <CardContent className="p-8">
                    <div className="max-w-2xl mx-auto">
                      <div className="flex items-start gap-4 mb-6">
                        <div className="p-3 bg-primary/10 rounded-full">
                          <Key className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold mb-2">Configuration de la carte interactive</h3>
                          <p className="text-muted-foreground mb-4">
                            Pour afficher la cartographie interactive des entreprises IA, vous devez fournir une clé publique Mapbox.
                          </p>
                        </div>
                      </div>
                      
                      <Alert className="mb-6">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          <strong>Comment obtenir votre clé Mapbox :</strong>
                          <ol className="list-decimal ml-4 mt-2 space-y-1">
                            <li>Créez un compte gratuit sur <a href="https://mapbox.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">mapbox.com</a></li>
                            <li>Accédez à la section "Tokens" dans votre dashboard</li>
                            <li>Copiez votre clé publique (elle commence par "pk.")</li>
                            <li>Collez-la dans le champ ci-dessous</li>
                          </ol>
                        </AlertDescription>
                      </Alert>
                      
                      <div className="flex gap-2">
                        <Input 
                          type="text"
                          placeholder="pk.eyJ1Ijoi..." 
                          value={tempApiKey}
                          onChange={(e) => setTempApiKey(e.target.value)}
                          className="flex-grow"
                        />
                        <Button onClick={handleSaveApiKey} disabled={!tempApiKey.trim()}>
                          Enregistrer
                        </Button>
                      </div>
                      
                      <p className="text-xs text-muted-foreground mt-4">
                        Votre clé sera stockée localement dans votre navigateur. Les clés publiques Mapbox (commençant par "pk.") sont sécuritaires à utiliser côté client.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-end">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        setMapboxApiKey("");
                        setTempApiKey("");
                        localStorage.removeItem('mapboxApiKey');
                      }}
                    >
                      Modifier la clé API
                    </Button>
                  </div>
                  
                  {filteredCompanies.length > 0 ? (
                    <MapView companies={filteredCompanies} apiKey={mapboxApiKey} />
                  ) : (
                    <Card>
                      <CardContent className="p-12 text-center">
                        <MapPin className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
                        <div className="text-2xl font-bold text-muted-foreground mb-2">Aucune entreprise à afficher</div>
                        <p className="text-muted-foreground">Essayez de modifier vos critères de recherche</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default EntreprisesIA;
