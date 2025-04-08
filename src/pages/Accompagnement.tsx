
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search } from "lucide-react";
import { useState } from "react";

// Mock data for incubators and accelerators
const structures = [
  {
    id: 1,
    name: "Orange Digital Center",
    logo: "https://randomuser.me/api/portraits/men/1.jpg",
    description: "Un espace dédié à l'innovation, à la formation et au soutien des startups dans le domaine du numérique.",
    type: "Incubateur",
    focus: ["FinTech", "EdTech", "HealthTech"],
    location: "Abidjan",
    website: "https://orangedigitalcenter.ci",
    programs: [
      {
        name: "Orange Fab",
        duration: "6 mois",
        description: "Programme d'accélération pour startups matures."
      },
      {
        name: "Orange Fab Academy",
        duration: "3 mois",
        description: "Formation et mentorat pour entrepreneurs early-stage."
      }
    ]
  },
  {
    id: 2,
    name: "Incub'Ivoire",
    logo: "https://randomuser.me/api/portraits/women/2.jpg",
    description: "Structure d'accompagnement spécialisée dans les startups à impact social et environnemental en Côte d'Ivoire.",
    type: "Incubateur",
    focus: ["GreenTech", "AgriTech", "CleanTech"],
    location: "Abidjan",
    website: "https://incubivoire.ci",
    programs: [
      {
        name: "Green Start",
        duration: "9 mois",
        description: "Incubation complète pour projets écologiques."
      }
    ]
  },
  {
    id: 3,
    name: "Seedstars Abidjan",
    logo: "https://randomuser.me/api/portraits/men/3.jpg",
    description: "Antenne locale de Seedstars, réseau international d'innovation et d'entrepreneuriat dans les marchés émergents.",
    type: "Accélérateur",
    focus: ["FinTech", "InsurTech", "E-commerce"],
    location: "Abidjan",
    website: "https://seedstars.com",
    programs: [
      {
        name: "Seedstars Growth",
        duration: "4 mois",
        description: "Accélération avec possibilité d'investissement."
      }
    ]
  },
  {
    id: 4,
    name: "Yamoussoukro Tech Hub",
    logo: "https://randomuser.me/api/portraits/women/4.jpg",
    description: "Centre technologique dédié à la formation, l'innovation et l'entrepreneuriat dans le centre du pays.",
    type: "Incubateur",
    focus: ["EdTech", "AgriTech"],
    location: "Yamoussoukro",
    website: "https://yamtechhub.ci",
    programs: [
      {
        name: "YTH Starter",
        duration: "12 mois",
        description: "Programme d'incubation complet."
      },
      {
        name: "Tech4Women",
        duration: "6 mois",
        description: "Programme dédié aux femmes entrepreneures."
      }
    ]
  },
  {
    id: 5,
    name: "CIV Innovation Lab",
    logo: "https://randomuser.me/api/portraits/men/5.jpg",
    description: "Laboratoire d'innovation centré sur la recherche appliquée et la commercialisation des innovations technologiques.",
    type: "Studio",
    focus: ["DeepTech", "AI", "Robotique"],
    location: "Abidjan",
    website: "https://civinnovationlab.org",
    programs: [
      {
        name: "Tech Venture Builder",
        duration: "12 mois",
        description: "Co-création de startups deep tech."
      }
    ]
  },
  {
    id: 6,
    name: "Entrepreneurs Factory",
    logo: "https://randomuser.me/api/portraits/women/6.jpg",
    description: "Espace de coworking et d'incubation proposant un environnement collaboratif et des événements de networking.",
    type: "Accélérateur",
    focus: ["E-commerce", "FinTech", "MarTech"],
    location: "Bouaké",
    website: "https://entrepreneursfactory.ci",
    programs: [
      {
        name: "Fast Track",
        duration: "3 mois",
        description: "Accélération intensive pour startups avec MVP."
      }
    ]
  },
];

const Accompagnement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [focusFilter, setFocusFilter] = useState("");
  
  // Get all unique focus areas
  const allFocusAreas = [...new Set(structures.flatMap(structure => structure.focus))].sort();
  
  // Filter structures based on search, type and focus
  const filteredStructures = structures.filter(structure => {
    const matchesSearch = structure.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          structure.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = typeFilter === "all" || structure.type.toLowerCase() === typeFilter.toLowerCase();
    
    const matchesFocus = focusFilter === "" || structure.focus.includes(focusFilter);
    
    return matchesSearch && matchesType && matchesFocus;
  });
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Structures d'Accompagnement</h1>
            <p className="text-xl text-gray-600">
              Découvrez les incubateurs, accélérateurs et studios qui soutiennent les startups ivoiriennes
            </p>
          </div>
          
          {/* Search and Filters */}
          <div className="mb-8 bg-white p-6 rounded-xl shadow-sm">
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input 
                  placeholder="Rechercher une structure d'accompagnement..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="flex gap-2 flex-wrap md:flex-nowrap">
                <Tabs defaultValue="all" value={typeFilter} onValueChange={setTypeFilter} className="w-full md:w-auto">
                  <TabsList>
                    <TabsTrigger value="all">Tous</TabsTrigger>
                    <TabsTrigger value="incubateur">Incubateurs</TabsTrigger>
                    <TabsTrigger value="accélérateur">Accélérateurs</TabsTrigger>
                    <TabsTrigger value="studio">Studios</TabsTrigger>
                  </TabsList>
                </Tabs>
                
                <select 
                  className="rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
                  value={focusFilter}
                  onChange={(e) => setFocusFilter(e.target.value)}
                >
                  <option value="">Tous les secteurs</option>
                  {allFocusAreas.map(focus => (
                    <option key={focus} value={focus}>{focus}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-500">
                {filteredStructures.length} structure{filteredStructures.length !== 1 ? "s" : ""} trouvée{filteredStructures.length !== 1 ? "s" : ""}
              </div>
              
              <Button variant="outline" size="sm" onClick={() => {
                setSearchTerm("");
                setTypeFilter("all");
                setFocusFilter("");
              }}>
                Réinitialiser les filtres
              </Button>
            </div>
          </div>
          
          {/* Structures Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredStructures.map((structure) => (
              <Card key={structure.id} className="overflow-hidden card-hover">
                <CardContent className="p-0">
                  <div className="flex flex-col h-full">
                    <div className="p-6">
                      <div className="flex items-center mb-4">
                        <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100 mr-4">
                          <img 
                            src={structure.logo} 
                            alt={`${structure.name} logo`} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="font-bold text-xl">{structure.name}</h3>
                          <div className="flex items-center mt-1">
                            <Badge className="mr-2" variant="secondary">{structure.type}</Badge>
                            <span className="text-sm text-gray-500">{structure.location}</span>
                          </div>
                        </div>
                      </div>
                      
                      <p className="text-gray-600 mb-4">
                        {structure.description}
                      </p>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        {structure.focus.map((focus, index) => (
                          <Badge key={index} variant="outline">{focus}</Badge>
                        ))}
                      </div>
                      
                      <div className="mt-4">
                        <h4 className="font-semibold mb-2">Programmes proposés</h4>
                        <div className="space-y-2">
                          {structure.programs.map((program, index) => (
                            <div key={index} className="bg-gray-50 p-3 rounded">
                              <div className="flex justify-between">
                                <span className="font-medium">{program.name}</span>
                                <span className="text-sm text-gray-500">{program.duration}</span>
                              </div>
                              <p className="text-sm text-gray-600 mt-1">{program.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-auto border-t border-gray-100 p-4 flex justify-between items-center">
                      <a 
                        href={structure.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-ivoire-orange hover:underline text-sm font-medium"
                      >
                        Visiter le site web
                      </a>
                      
                      <Button size="sm">Contacter</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {filteredStructures.length === 0 && (
            <div className="text-center py-12">
              <div className="text-2xl font-bold text-gray-400 mb-2">Aucune structure trouvée</div>
              <p className="text-gray-500">Essayez de modifier vos critères de recherche</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Accompagnement;
