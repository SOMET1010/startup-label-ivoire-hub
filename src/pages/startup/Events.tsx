import { useState } from 'react';
import { Calendar, MapPin, Video, Loader2 } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { EventCard } from '@/components/label-space/EventCard';
import { useEvents } from '@/hooks/useEvents';
import { EmptyState } from '@/components/shared/EmptyState';
import { AlertBanner } from '@/components/shared/AlertBanner';

export default function Events() {
  const [showPast, setShowPast] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'virtual' | 'presential'>('all');
  const { events, loading, error } = useEvents(showPast);

  const filteredEvents = events.filter(event => {
    if (filterType === 'virtual') return event.is_virtual;
    if (filterType === 'presential') return !event.is_virtual;
    return true;
  });

  const virtualCount = events.filter(e => e.is_virtual).length;
  const presentialCount = events.filter(e => !e.is_virtual).length;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <Calendar className="h-6 w-6 text-purple-700 dark:text-purple-300" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Événements</h1>
                <p className="text-muted-foreground">
                  Networking, formations et rencontres exclusives
                </p>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <Tabs value={filterType} onValueChange={(v) => setFilterType(v as typeof filterType)}>
              <TabsList>
                <TabsTrigger value="all" className="gap-2">
                  Tous ({events.length})
                </TabsTrigger>
                <TabsTrigger value="presential" className="gap-2">
                  <MapPin className="h-4 w-4" />
                  Présentiel ({presentialCount})
                </TabsTrigger>
                <TabsTrigger value="virtual" className="gap-2">
                  <Video className="h-4 w-4" />
                  En ligne ({virtualCount})
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex items-center gap-2">
              <Switch
                id="show-past"
                checked={showPast}
                onCheckedChange={setShowPast}
              />
              <Label htmlFor="show-past" className="text-sm text-muted-foreground">
                Afficher les événements passés
              </Label>
            </div>
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
          ) : filteredEvents.length === 0 ? (
            <EmptyState
              icon={Calendar}
              title="Aucun événement trouvé"
              description={showPast 
                ? "Aucun événement dans l'historique"
                : "De nouveaux événements seront bientôt programmés"}
              action={!showPast ? {
                label: "Voir les événements passés",
                onClick: () => setShowPast(true)
              } : undefined}
            />
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
