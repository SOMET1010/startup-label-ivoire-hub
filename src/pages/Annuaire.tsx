import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Building2, MapPin, Globe, Users, ExternalLink, Award } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { SEOHead } from "@/components/shared/SEOHead";
import { PageBreadcrumb } from "@/components/shared/PageBreadcrumb";
import { SECTORS, STAGES, LOCATIONS } from "@/lib/constants/startup";

interface Startup {
  id: string;
  name: string;
  description: string | null;
  sector: string | null;
  founded_date: string | null;
  website: string | null;
  logo_url: string | null;
  address: string | null;
  team_size: number | null;
  stage: string | null;
  label_granted_at: string | null;
}

const Annuaire = () => {
  const [startups, setStartups] = useState<Startup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [sectorFilter, setSectorFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");
  const [stageFilter, setStageFilter] = useState("all");

  // Charger les startups labellisées depuis Supabase
  useEffect(() => {
    const fetchStartups = async () => {
      if (!supabase) {
        setIsLoading(false);
        return;
      }

      try {
        const { data, error: fetchError } = await supabase
          .from("startups")
          .select(`
            id,
            name,
            description,
            sector,
            founded_date,
            website,
            logo_url,
            address,
            team_size,
            stage,
            label_granted_at
          `)
          .eq("is_visible_in_directory", true)
          .not("label_granted_at", "is", null)
          .order("label_granted_at", { ascending: false });

        if (fetchError) throw fetchError;

        setStartups(data || []);
      } catch (err: unknown) {
        console.error("Error fetching startups:", err);
        setError(err instanceof Error ? err.message : "Erreur inconnue");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStartups();
  }, []);

  const filteredStartups = useMemo(() => {
    return startups.filter((startup) => {
      const matchesSearch =
        searchTerm === "" ||
        startup.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (startup.description?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);

      const matchesSector =
        sectorFilter === "all" || startup.sector === sectorFilter;

      const matchesLocation =
        locationFilter === "all" ||
        (startup.address?.toLowerCase().includes(locationFilter.toLowerCase()) ?? false);

      const matchesStage =
        stageFilter === "all" || startup.stage === stageFilter;

      return matchesSearch && matchesSector && matchesLocation && matchesStage;
    });
  }, [startups, searchTerm, sectorFilter, locationFilter, stageFilter]);

  const availableLocations = useMemo(() => {
    const locs = new Set<string>();
    startups.forEach((s) => {
      if (s.address) {
        LOCATIONS.forEach((loc) => {
          if (s.address?.toLowerCase().includes(loc.toLowerCase())) {
            locs.add(loc);
          }
        });
      }
    });
    return Array.from(locs).sort();
  }, [startups]);

  const resetFilters = () => {
    setSearchTerm("");
    setSectorFilter("all");
    setLocationFilter("all");
    setStageFilter("all");
  };

  const getSectorLabel = (value: string | null) => {
    if (!value) return "Non spécifié";
    return SECTORS.find((s) => s.value === value)?.label || value;
  };

  const getStageLabel = (value: string | null) => {
    if (!value) return null;
    return STAGES.find((s) => s.value === value)?.label || value;
  };

  const getFoundedYear = (date: string | null) => {
    if (!date) return null;
    return new Date(date).getFullYear();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead
        title="Annuaire des Startups Labellisées"
        description="Explorez l'annuaire des startups labellisées en Côte d'Ivoire. Trouvez des entreprises innovantes par secteur, ville et stade de développement."
        path="/annuaire"
      />
      <Navbar />
      <main id="main-content" className="flex-grow py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <PageBreadcrumb />
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm mb-4">
              <Award className="h-4 w-4" />
              Startups Labellisées
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-3">
              Annuaire des Startups
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Découvrez les startups innovantes de l'écosystème numérique ivoirien, 
              reconnues par le Label Startup Numérique
            </p>
          </div>

          {/* Filtres */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="relative flex-grow">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher une startup..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:w-2/3">
                  <Select value={sectorFilter} onValueChange={setSectorFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Secteur" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les secteurs</SelectItem>
                      {SECTORS.map((sector) => (
                        <SelectItem key={sector.value} value={sector.value}>
                          {sector.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={locationFilter} onValueChange={setLocationFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Localisation" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes les villes</SelectItem>
                      {(availableLocations.length > 0 ? availableLocations : LOCATIONS).map((loc) => (
                        <SelectItem key={loc} value={loc}>
                          {loc}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={stageFilter} onValueChange={setStageFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Stade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les stades</SelectItem>
                      {STAGES.map((stage) => (
                        <SelectItem key={stage.value} value={stage.value}>
                          {stage.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-between items-center mt-4 pt-4 border-t border-border">
                <p className="text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">{filteredStartups.length}</span>
                  {" "}startup{filteredStartups.length !== 1 ? "s" : ""} trouvée{filteredStartups.length !== 1 ? "s" : ""}
                </p>
                <Button variant="ghost" size="sm" onClick={resetFilters}>
                  Réinitialiser
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Loading state */}
          {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <Skeleton className="h-16 w-16 rounded-full" />
                      <div className="flex-1">
                        <Skeleton className="h-5 w-32 mb-2" />
                        <Skeleton className="h-4 w-20" />
                      </div>
                    </div>
                    <Skeleton className="h-16 w-full mb-4" />
                    <Skeleton className="h-4 w-24" />
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Error state */}
          {error && (
            <Card className="text-center py-12">
              <CardContent>
                <p className="text-destructive font-medium mb-2">Erreur de chargement</p>
                <p className="text-muted-foreground">{error}</p>
              </CardContent>
            </Card>
          )}

          {/* Grille des startups */}
          {!isLoading && !error && (
            <>
              {filteredStartups.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredStartups.map((startup) => (
                    <Card key={startup.id} className="overflow-hidden card-hover group">
                      <CardContent className="p-0">
                        <div className="p-6">
                          <div className="flex items-start gap-4 mb-4">
                            <div className="w-16 h-16 rounded-xl overflow-hidden bg-muted flex items-center justify-center border border-border">
                              {startup.logo_url ? (
                                <img
                                  src={startup.logo_url}
                                  alt={`${startup.name} logo`}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <Building2 className="h-8 w-8 text-muted-foreground" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-bold text-lg truncate">{startup.name}</h3>
                              <div className="flex items-center flex-wrap gap-2 mt-1">
                                <Badge className="bg-success/10 text-success border-success/20">
                                  <Award className="h-3 w-3 mr-1" />
                                  Labellisée
                                </Badge>
                                <Badge variant="secondary">
                                  {getSectorLabel(startup.sector)}
                                </Badge>
                              </div>
                            </div>
                          </div>

                          <p className="text-muted-foreground text-sm line-clamp-3 mb-4">
                            {startup.description || "Aucune description disponible"}
                          </p>

                          <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                            {startup.address && (
                              <div className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                <span className="truncate max-w-[120px]">{startup.address}</span>
                              </div>
                            )}
                            {startup.team_size && (
                              <div className="flex items-center gap-1">
                                <Users className="h-3 w-3" />
                                <span>{startup.team_size} employé{startup.team_size > 1 ? "s" : ""}</span>
                              </div>
                            )}
                            {getFoundedYear(startup.founded_date) && (
                              <div className="flex items-center gap-1">
                                <span>Fondée en {getFoundedYear(startup.founded_date)}</span>
                              </div>
                            )}
                          </div>

                          {getStageLabel(startup.stage) && (
                            <div className="mt-3">
                              <Badge variant="outline" className="text-xs">
                                {getStageLabel(startup.stage)}
                              </Badge>
                            </div>
                          )}
                        </div>

                        <div className="px-6 py-4 bg-muted/30 border-t border-border flex items-center justify-between">
                          {startup.website ? (
                            <a
                              href={startup.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
                            >
                              <Globe className="h-4 w-4" />
                              Visiter le site
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          ) : (
                            <span className="text-sm text-muted-foreground">Pas de site web</span>
                          )}
                          <Button variant="ghost" size="sm" asChild>
                            <Link to={`/annuaire/${startup.id}`}>
                              Voir détails
                            </Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="text-center py-16">
                  <CardContent>
                    <Building2 className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                    <h3 className="text-xl font-semibold text-muted-foreground mb-2">
                      Aucune startup trouvée
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
            </>
          )}

          {!isLoading && startups.length > 0 && (
            <div className="mt-12 text-center">
              <p className="text-muted-foreground">
                <span className="font-semibold text-foreground">{startups.length}</span> startups labellisées 
                contribuent à l'innovation numérique en Côte d'Ivoire
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Annuaire;
