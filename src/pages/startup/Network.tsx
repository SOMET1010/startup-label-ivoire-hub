import { useState } from 'react';
import { Users, Search, Loader2, Mail } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { NetworkStartupCard } from '@/components/label-space/NetworkStartupCard';
import { useNetwork, NetworkStartup } from '@/hooks/useNetwork';
import { EmptyState } from '@/components/shared/EmptyState';
import { AlertBanner } from '@/components/shared/AlertBanner';

const sectors = [
  { value: 'all', label: 'Tous les secteurs' },
  { value: 'fintech', label: 'FinTech' },
  { value: 'edtech', label: 'EdTech' },
  { value: 'healthtech', label: 'HealthTech' },
  { value: 'agritech', label: 'AgriTech' },
  { value: 'ecommerce', label: 'E-commerce' },
  { value: 'saas', label: 'SaaS' },
  { value: 'other', label: 'Autre' },
];

export default function Network() {
  const [selectedSector, setSelectedSector] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [contactStartup, setContactStartup] = useState<NetworkStartup | null>(null);
  const [contactMessage, setContactMessage] = useState('');
  const { startups, loading, error } = useNetwork(selectedSector);

  const filteredStartups = startups.filter(startup =>
    startup.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    startup.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleContact = (startup: NetworkStartup) => {
    setContactStartup(startup);
    setContactMessage('');
  };

  const handleSendMessage = () => {
    // In a real app, this would send an email or create a message in the database
    toast.success(`Demande de contact envoyée à ${contactStartup?.name}`);
    setContactStartup(null);
    setContactMessage('');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                <Users className="h-6 w-6 text-amber-700 dark:text-amber-300" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Réseau des startups labellisées</h1>
                <p className="text-muted-foreground">
                  Connectez-vous avec les autres startups du programme
                </p>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="mb-6 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher une startup..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedSector} onValueChange={setSelectedSector}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Secteur" />
              </SelectTrigger>
              <SelectContent>
                {sectors.map((sector) => (
                  <SelectItem key={sector.value} value={sector.value}>
                    {sector.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Stats */}
          <div className="mb-6 p-4 bg-muted/50 rounded-lg flex items-center gap-4">
            <Users className="h-5 w-5 text-primary" />
            <span className="text-sm">
              <strong>{startups.length}</strong> startups labellisées dans le réseau
            </span>
          </div>

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
          ) : filteredStartups.length === 0 ? (
            <EmptyState
              icon={Users}
              illustration={searchQuery ? 'search' : 'empty'}
              title="Aucune startup trouvée"
              description={searchQuery 
                ? "Essayez d'autres termes de recherche"
                : "Aucune startup labellisée pour le moment"}
              action={searchQuery ? {
                label: "Réinitialiser la recherche",
                onClick: () => setSearchQuery('')
              } : undefined}
            />
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredStartups.map((startup) => (
                <NetworkStartupCard 
                  key={startup.id} 
                  startup={startup} 
                  onContact={handleContact}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Contact Dialog */}
      <Dialog open={!!contactStartup} onOpenChange={() => setContactStartup(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Contacter {contactStartup?.name}
            </DialogTitle>
            <DialogDescription>
              Envoyez une demande de mise en relation. L'équipe ANSUT transmettra votre message.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              placeholder="Votre message..."
              value={contactMessage}
              onChange={(e) => setContactMessage(e.target.value)}
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setContactStartup(null)}>
              Annuler
            </Button>
            <Button onClick={handleSendMessage} disabled={!contactMessage.trim()}>
              Envoyer la demande
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
