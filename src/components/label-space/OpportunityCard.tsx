import { Calendar, ExternalLink, Building2, Coins, Handshake, CalendarDays, GraduationCap, Clock, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LabelOpportunity } from '@/hooks/useOpportunities';
import { format, differenceInDays, isPast } from 'date-fns';
import { fr } from 'date-fns/locale';

interface OpportunityCardProps {
  opportunity: LabelOpportunity;
}

const typeConfig = {
  marche_public: { icon: Building2, label: 'Marché public', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' },
  financement: { icon: Coins, label: 'Financement', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' },
  partenariat: { icon: Handshake, label: 'Partenariat', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' },
  evenement: { icon: CalendarDays, label: 'Événement', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300' },
  formation: { icon: GraduationCap, label: 'Formation', color: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300' },
};

export function OpportunityCard({ opportunity }: OpportunityCardProps) {
  const config = typeConfig[opportunity.type] || typeConfig.partenariat;
  const IconComponent = config.icon;

  const deadlineDate = opportunity.deadline ? new Date(opportunity.deadline) : null;
  const isDeadlinePassed = deadlineDate ? isPast(deadlineDate) : false;
  const daysUntilDeadline = deadlineDate ? differenceInDays(deadlineDate, new Date()) : null;

  const getDeadlineStatus = () => {
    if (!daysUntilDeadline) return null;
    if (isDeadlinePassed) return { label: 'Terminé', variant: 'destructive' as const };
    if (daysUntilDeadline <= 7) return { label: `${daysUntilDeadline}j restants`, variant: 'destructive' as const };
    if (daysUntilDeadline <= 30) return { label: `${daysUntilDeadline}j restants`, variant: 'secondary' as const };
    return null;
  };

  const deadlineStatus = getDeadlineStatus();

  return (
    <Card className={`hover:shadow-md transition-shadow ${isDeadlinePassed ? 'opacity-60' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className={`p-2 rounded-lg ${config.color}`}>
            <IconComponent className="h-5 w-5" />
          </div>
          <div className="flex items-center gap-2">
            {deadlineStatus && (
              <Badge variant={deadlineStatus.variant}>{deadlineStatus.label}</Badge>
            )}
            <Badge variant="outline" className={config.color}>
              {config.label}
            </Badge>
          </div>
        </div>
        <CardTitle className="text-lg mt-3">{opportunity.title}</CardTitle>
        <CardDescription className="line-clamp-2">{opportunity.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {opportunity.deadline && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Date limite: {format(new Date(opportunity.deadline), 'dd MMMM yyyy', { locale: fr })}</span>
          </div>
        )}

        {opportunity.eligibility_criteria && (
          <div className="flex items-start gap-2 text-sm">
            <CheckCircle2 className="h-4 w-4 mt-0.5 text-primary" />
            <span className="text-muted-foreground">{opportunity.eligibility_criteria}</span>
          </div>
        )}

        <div className="flex gap-2 pt-2">
          {opportunity.external_url && !isDeadlinePassed && (
            <Button size="sm" className="gap-2" asChild>
              <a href={opportunity.external_url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4" />
                Postuler
              </a>
            </Button>
          )}
          {opportunity.contact_info && (
            <Button variant="outline" size="sm" className="gap-2">
              Contacter
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
