import { Award, Calendar, AlertTriangle, CheckCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { useLabelStatus } from '@/hooks/useLabelStatus';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Link } from 'react-router-dom';

export function LabelStatusCard() {
  const { startup, application, daysUntilExpiration } = useLabelStatus();

  if (!startup || !application) return null;

  const labelGrantedDate = startup.label_granted_at 
    ? format(new Date(startup.label_granted_at), 'dd MMMM yyyy', { locale: fr })
    : application.submitted_at
      ? format(new Date(application.submitted_at), 'dd MMMM yyyy', { locale: fr })
      : 'N/A';

  const expirationDate = startup.label_expires_at || application.label_valid_until;
  const formattedExpiration = expirationDate
    ? format(new Date(expirationDate), 'dd MMMM yyyy', { locale: fr })
    : 'Non définie';

  // Calculate progress (assuming 3-year validity = 1095 days)
  const totalDays = 1095;
  const daysRemaining = daysUntilExpiration ?? totalDays;
  const progress = Math.max(0, Math.min(100, ((totalDays - daysRemaining) / totalDays) * 100));

  const isExpiringSoon = daysUntilExpiration !== null && daysUntilExpiration <= 90;
  const isExpired = daysUntilExpiration !== null && daysUntilExpiration <= 0;

  return (
    <Card className={`border-2 ${isExpired ? 'border-destructive bg-destructive/5' : isExpiringSoon ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/20' : 'border-primary bg-primary/5'}`}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full ${isExpired ? 'bg-destructive/20' : 'bg-primary/20'}`}>
              <Award className={`h-6 w-6 ${isExpired ? 'text-destructive' : 'text-primary'}`} />
            </div>
            <div>
              <h3 className="font-semibold text-lg">{startup.name}</h3>
              <p className="text-sm text-muted-foreground">{startup.sector || 'Secteur non défini'}</p>
            </div>
          </div>
          <Badge variant={isExpired ? 'destructive' : isExpiringSoon ? 'secondary' : 'default'} className="text-sm">
            {isExpired ? 'Label expiré' : 'Label actif'}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center gap-2 text-sm">
            <CheckCircle className="h-4 w-4 text-primary" />
            <span className="text-muted-foreground">Obtenu le:</span>
            <span className="font-medium">{labelGrantedDate}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Expire le:</span>
            <span className="font-medium">{formattedExpiration}</span>
          </div>
        </div>

        {daysUntilExpiration !== null && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Validité du label (3 ans)</span>
              <span className={`font-medium ${isExpiringSoon ? 'text-amber-600' : ''}`}>
                {isExpired ? 'Expiré' : `${daysRemaining} jours restants`}
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}

        {isExpiringSoon && !isExpired && (
          <div className="mt-4 p-3 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
              <span className="text-sm font-medium text-amber-800 dark:text-amber-200">
                Votre label expire bientôt
              </span>
            </div>
            <Button size="sm" variant="outline" asChild>
              <Link to="/startup/renouvellement">Renouveler</Link>
            </Button>
          </div>
        )}

        {isExpired && (
          <div className="mt-4 p-3 bg-destructive/10 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <span className="text-sm font-medium text-destructive">
                Votre label a expiré
              </span>
            </div>
            <Button size="sm" asChild>
              <Link to="/startup/renouvellement">Demander le renouvellement</Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
