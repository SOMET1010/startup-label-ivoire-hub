import { Calendar, MapPin, Video, Users, ExternalLink, Clock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LabelEvent } from '@/hooks/useEvents';
import { format, isToday, isTomorrow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface EventCardProps {
  event: LabelEvent;
}

export function EventCard({ event }: EventCardProps) {
  const eventDate = new Date(event.event_date);
  const isEventToday = isToday(eventDate);
  const isEventTomorrow = isTomorrow(eventDate);

  const getDateBadge = () => {
    if (isEventToday) return { label: "Aujourd'hui", variant: 'destructive' as const };
    if (isEventTomorrow) return { label: 'Demain', variant: 'secondary' as const };
    return null;
  };

  const dateBadge = getDateBadge();

  return (
    <Card className="hover:shadow-md transition-shadow overflow-hidden">
      <div className={`h-2 ${event.is_virtual ? 'bg-cyan-500' : 'bg-primary'}`} />
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            {event.is_virtual ? (
              <Badge variant="outline" className="gap-1 bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300 border-0">
                <Video className="h-3 w-3" />
                En ligne
              </Badge>
            ) : (
              <Badge variant="outline" className="gap-1 bg-primary/10 text-primary border-0">
                <MapPin className="h-3 w-3" />
                Présentiel
              </Badge>
            )}
            {dateBadge && (
              <Badge variant={dateBadge.variant}>{dateBadge.label}</Badge>
            )}
          </div>
          {event.max_participants && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>{event.max_participants} places</span>
            </div>
          )}
        </div>
        <CardTitle className="text-lg mt-3">{event.title}</CardTitle>
        {event.description && (
          <CardDescription className="line-clamp-2">{event.description}</CardDescription>
        )}
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex flex-col gap-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{format(eventDate, 'EEEE dd MMMM yyyy', { locale: fr })}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{format(eventDate, 'HH:mm', { locale: fr })}</span>
          </div>
          {event.location && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{event.location}</span>
            </div>
          )}
        </div>

        {event.registration_url && (
          <Button className="w-full gap-2" asChild>
            <a href={event.registration_url} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4" />
              S'inscrire
            </a>
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
