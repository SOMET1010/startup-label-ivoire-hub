import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  MapPin, 
  Users, 
  ExternalLink, 
  Building2, 
  Award,
  Filter,
  Map,
  List,
  TrendingUp,
  Globe,
  Briefcase
} from 'lucide-react';
import { aiCompanies } from '@/data/aiCompanies';
import MapView from '@/components/ai-companies/MapView';

const EntreprisesIA = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sectorFilter, setSectorFilter] = useState('all');
  const [specializationFilter, setSpecializationFilter] = useState('all');
  const [labelFilter, setLabelFilter] = useState('all');

  // Filter companies based on search and filters
  const filteredCompanies = useMemo(() => {
    return aiCompanies.filter(company => {
      const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           company.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           company.specialization.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesSector = sectorFilter === 'all' || company.sector === sectorFilter;
      const matchesSpecialization = specializationFilter === 'all' || company.specialization === specializationFilter;
      const matchesLabel = labelFilter === 'all' || 
                          (labelFilter === 'labeled' && company.isLabeled) ||
                          (labelFilter === 'not-labeled' && !company.isLabeled);
      
      return matchesSearch && matchesSector && matchesSpecialization && matchesLabel;
    });
  }, [searchTerm, sectorFilter, specializationFilter, labelFilter]);

  // Get unique sectors and specializations for filters
  const sectors = [...new Set(aiCompanies.map(c => c.sector))];
  const specializations = [...new Set(aiCompanies.map(c => c.specialization))];

  const resetFilters = () => {
    setSearchTerm('');
    setSectorFilter('all');
    setSpecializationFilter('all');
    setLabelFilter('all');
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-grow">
        {/* Header */}
        <div className="bg-gradient-to-br from-primary/10 via-background to-accent/10 py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl">
              <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20">
                <Building2 className="w-3 h-3 mr-1" />
                Annuaire IA
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                Entreprises IA en Côte d'Ivoire
              </h1>
              <p className="text-xl text-muted-foreground">
                Découvrez l'écosystème des startups et entreprises spécialisées en intelligence artificielle en Côte d'Ivoire.
              </p>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="container mx-auto px-4 -mt-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="bg-background border-border">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Building2 className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{aiCompanies.length}</p>
                  <p className="text-sm text-muted-foreground">Entreprises</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-background border-border">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-accent/10">
                  <Briefcase className="w-5 h-5 text-accent-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{sectors.length}</p>
                  <p className="text-sm text-muted-foreground">Secteurs</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-background border-border">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-secondary">
                  <TrendingUp className="w-5 h-5 text-secondary-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{specializations.length}</p>
                  <p className="text-sm text-muted-foreground">Spécialisations</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-background border-border">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-muted">
                  <Globe className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {[...new Set(aiCompanies.map(c => c.location))].length}
                  </p>
                  <p className="text-sm text-muted-foreground">Villes</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Filters */}
        <div className="container mx-auto px-4 py-8">
          <Card className="bg-background border-border">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Search */}
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher une entreprise..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Sector Filter */}
                <Select value={sectorFilter} onValueChange={setSectorFilter}>
                  <SelectTrigger className="w-full lg:w-48">
                    <SelectValue placeholder="Secteur" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les secteurs</SelectItem>
                    {sectors.map(sector => (
                      <SelectItem key={sector} value={sector}>{sector}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Specialization Filter */}
                <Select value={specializationFilter} onValueChange={setSpecializationFilter}>
                  <SelectTrigger className="w-full lg:w-48">
                    <SelectValue placeholder="Spécialisation" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes spécialisations</SelectItem>
                    {specializations.map(spec => (
                      <SelectItem key={spec} value={spec}>{spec}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Label Filter */}
                <Select value={labelFilter} onValueChange={setLabelFilter}>
                  <SelectTrigger className="w-full lg:w-48">
                    <SelectValue placeholder="Statut label" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les statuts</SelectItem>
                    <SelectItem value="labeled">Labellisées</SelectItem>
                    <SelectItem value="not-labeled">Non labellisées</SelectItem>
                  </SelectContent>
                </Select>

                {/* Reset Button */}
                <Button variant="outline" onClick={resetFilters} className="lg:w-auto">
                  <Filter className="w-4 h-4 mr-2" />
                  Réinitialiser
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Results */}
        <div className="container mx-auto px-4 pb-16">
          <Tabs defaultValue="list" className="w-full">
            <div className="flex items-center justify-between mb-6">
              <p className="text-muted-foreground">
                <span className="font-medium text-foreground">{filteredCompanies.length}</span> entreprise{filteredCompanies.length !== 1 ? 's' : ''} trouvée{filteredCompanies.length !== 1 ? 's' : ''}
              </p>
              <TabsList>
                <TabsTrigger value="list" className="gap-2">
                  <List className="w-4 h-4" />
                  Liste
                </TabsTrigger>
                <TabsTrigger value="map" className="gap-2">
                  <Map className="w-4 h-4" />
                  Carte
                </TabsTrigger>
              </TabsList>
            </div>

            {/* List View */}
            <TabsContent value="list">
              {filteredCompanies.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCompanies.map(company => (
                    <Card key={company.id} className="group hover:shadow-lg transition-all duration-300 bg-background border-border overflow-hidden">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center overflow-hidden">
                              {company.logo ? (
                                <img src={company.logo} alt={company.name} className="w-full h-full object-cover" />
                              ) : (
                                <Building2 className="w-6 h-6 text-muted-foreground" />
                              )}
                            </div>
                            <div>
                              <CardTitle className="text-lg group-hover:text-primary transition-colors">
                                {company.name}
                              </CardTitle>
                              <CardDescription className="text-sm">
                                {company.sector}
                              </CardDescription>
                            </div>
                          </div>
                          {company.isLabeled && (
                            <Badge className="bg-primary/10 text-primary">
                              <Award className="w-3 h-3 mr-1" />
                              Labellisée
                            </Badge>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {company.description}
                        </p>
                        
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="secondary" className="text-xs">
                            {company.specialization}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {company.location}
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {company.employees}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 pt-2">
                          {company.services?.slice(0, 2).map((service, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {service}
                            </Badge>
                          ))}
                          {company.services && company.services.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{company.services.length - 2}
                            </Badge>
                          )}
                        </div>
                        
                        <div className="flex gap-2 pt-2">
                          <Button asChild variant="default" size="sm" className="flex-1">
                            <Link to={`/entreprises-ia/${company.id}`}>
                              Voir le profil
                            </Link>
                          </Button>
                          {company.website && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => window.open(company.website, '_blank')}
                            >
                              <ExternalLink className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="bg-background border-border">
                  <CardContent className="p-12 text-center">
                    <Building2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      Aucune entreprise trouvée
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Essayez de modifier vos critères de recherche
                    </p>
                    <Button variant="outline" onClick={resetFilters}>
                      Réinitialiser les filtres
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Map View */}
            <TabsContent value="map">
              {filteredCompanies.length > 0 ? (
                <MapView companies={filteredCompanies} />
              ) : (
                <Card className="bg-background border-border">
                  <CardContent className="p-12 text-center">
                    <Map className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      Aucune entreprise à afficher
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Modifiez vos filtres pour voir des entreprises sur la carte
                    </p>
                    <Button variant="outline" onClick={resetFilters}>
                      Réinitialiser les filtres
                    </Button>
                  </CardContent>
                </Card>
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
