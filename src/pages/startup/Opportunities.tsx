import { useState } from 'react';
import { Briefcase, Search, Calendar, ArrowUpDown, Loader2, RotateCcw } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { OpportunityCard } from '@/components/label-space/OpportunityCard';
import { useOpportunities } from '@/hooks/useOpportunities';
import { EmptyState } from '@/components/shared/EmptyState';
import { AlertBanner } from '@/components/shared/AlertBanner';

const types = [
  { value: 'all', label: 'Toutes' },
  { value: 'marche_public', label: 'Marchés publics' },
  { value: 'financement', label: 'Financement' },
  { value: 'partenariat', label: 'Partenariats' },
  { value: 'formation', label: 'Formations' },
];

export default function Opportunities() {
  const [selectedType, setSelectedType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('deadline');
  const { opportunities, loading, error } = useOpportunities(selectedType);

  const filteredOpportunities = opportunities
    .filter(opp =>
      opp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'deadline') {
        if (!a.deadline) return 1;
        if (!b.deadline) return -1;
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      }
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <Briefcase className="h-6 w-6 text-green-700 dark:text-green-300" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Opportunités</h1>
                <p className="text-muted-foreground">
                  Marchés publics, financements et partenariats exclusifs
                </p>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="mb-6 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher une opportunité..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <ArrowUpDown className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Trier par" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="deadline">Date limite</SelectItem>
                <SelectItem value="recent">Plus récentes</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Type Tabs */}
          <Tabs value={selectedType} onValueChange={setSelectedType} className="mb-6">
            <TabsList className="flex-wrap h-auto gap-1">
              {types.map((type) => (
                <TabsTrigger key={type.value} value={type.value} className="text-sm">
                  {type.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          {/* Content */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <AlertBanner
              variant="error"
              title="Erreur de chargement"
              description={error}
            />
          ) : filteredOpportunities.length === 0 ? (
            <EmptyState
              icon={Briefcase}
              illustration={searchQuery ? 'search' : 'empty'}
              title="Aucune opportunité trouvée"
              description={searchQuery 
                ? "Essayez d'autres termes de recherche"
                : "De nouvelles opportunités seront bientôt disponibles"}
              action={searchQuery ? {
                label: "Réinitialiser les filtres",
                icon: RotateCcw,
                onClick: () => {
                  setSearchQuery('');
                  setSelectedType('all');
                }
              } : undefined}
            />
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredOpportunities.map((opportunity) => (
                <OpportunityCard key={opportunity.id} opportunity={opportunity} />
              ))}
            </div>
          )}

          {/* Stats */}
          {!loading && filteredOpportunities.length > 0 && (
            <div className="mt-8 p-4 bg-muted/50 rounded-lg flex items-center justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{filteredOpportunities.filter(o => o.deadline).length} avec date limite</span>
              </div>
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4" />
                <span>{filteredOpportunities.length} opportunités actives</span>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
