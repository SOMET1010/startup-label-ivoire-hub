import { Globe, MapPin, Mail, Calendar, Building2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { NetworkStartup } from '@/hooks/useNetwork';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface NetworkStartupCardProps {
  startup: NetworkStartup;
  onContact?: (startup: NetworkStartup) => void;
}

const sectorLabels: Record<string, string> = {
  fintech: 'FinTech',
  edtech: 'EdTech',
  healthtech: 'HealthTech',
  agritech: 'AgriTech',
  ecommerce: 'E-commerce',
  saas: 'SaaS',
  other: 'Autre',
};

export function NetworkStartupCard({ startup, onContact }: NetworkStartupCardProps) {
  const initials = startup.name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start gap-4">
          <Avatar className="h-14 w-14 border-2 border-primary/20">
            <AvatarImage src={startup.logo_url || undefined} alt={startup.name} />
            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <CardTitle className="text-lg truncate">{startup.name}</CardTitle>
              {startup.sector && (
                <Badge variant="secondary" className="shrink-0">
                  {sectorLabels[startup.sector] || startup.sector}
                </Badge>
              )}
            </div>
            {startup.description && (
              <CardDescription className="line-clamp-2 mt-1">
                {startup.description}
              </CardDescription>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex flex-wrap gap-y-2 gap-x-4 text-sm text-muted-foreground">
          {startup.address && (
            <div className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4" />
              <span>{startup.address}</span>
            </div>
          )}
          {startup.label_granted_at && (
            <div className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              <span>Labellisée depuis {format(new Date(startup.label_granted_at), 'MMMM yyyy', { locale: fr })}</span>
            </div>
          )}
        </div>

        {startup.founder_info && (
          <div className="flex items-center gap-2 text-sm">
            <Building2 className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">{startup.founder_info}</span>
          </div>
        )}

        <div className="flex gap-2 pt-2">
          {startup.website && (
            <Button variant="outline" size="sm" className="gap-2" asChild>
              <a href={startup.website} target="_blank" rel="noopener noreferrer">
                <Globe className="h-4 w-4" />
                Site web
              </a>
            </Button>
          )}
          <Button 
            variant="secondary" 
            size="sm" 
            className="gap-2"
            onClick={() => onContact?.(startup)}
          >
            <Mail className="h-4 w-4" />
            Contacter
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
