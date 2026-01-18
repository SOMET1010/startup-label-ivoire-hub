import { useState, useEffect } from 'react';
import { RefreshCw, Calendar, Clock, FileText, AlertTriangle, CheckCircle2, Loader2, Upload } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useLabelStatus } from '@/hooks/useLabelStatus';
import { supabase } from '@/integrations/supabase/client';

interface RenewalRequest {
  id: string;
  status: string;
  requested_at: string;
  expires_at: string | null;
  notes: string | null;
  reviewed_at: string | null;
}

const statusConfig: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline'; icon: typeof Clock }> = {
  pending: { label: 'En attente', variant: 'secondary', icon: Clock },
  under_review: { label: 'En cours d\'examen', variant: 'default', icon: RefreshCw },
  approved: { label: 'Approuvé', variant: 'default', icon: CheckCircle2 },
  rejected: { label: 'Refusé', variant: 'destructive', icon: AlertTriangle },
};

export default function Renewal() {
  const { startup, application, daysUntilExpiration } = useLabelStatus();
  const [renewalRequests, setRenewalRequests] = useState<RenewalRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [notes, setNotes] = useState('');

  const canRequestRenewal = daysUntilExpiration !== null && daysUntilExpiration <= 180;
  const hasActivePending = renewalRequests.some(r => r.status === 'pending' || r.status === 'under_review');

  useEffect(() => {
    async function fetchRenewals() {
      if (!startup || !supabase) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('label_renewals')
          .select('*')
          .eq('startup_id', startup.id)
          .order('requested_at', { ascending: false });

        if (error) throw error;
        setRenewalRequests(data as RenewalRequest[]);
      } catch (err) {
        console.error('Error fetching renewals:', err);
        toast.error('Erreur lors du chargement des demandes');
      } finally {
        setLoading(false);
      }
    }

    fetchRenewals();
  }, [startup]);

  const handleSubmitRenewal = async () => {
    if (!startup || !application || !supabase) return;

    setSubmitting(true);
    try {
      const { error } = await supabase
        .from('label_renewals')
        .insert({
          startup_id: startup.id,
          application_id: application.id,
          expires_at: startup.label_expires_at || application.label_valid_until,
          notes: notes || null,
        });

      if (error) throw error;

      toast.success('Demande de renouvellement soumise avec succès');
      setNotes('');
      
      // Refresh renewals
      const { data } = await supabase
        .from('label_renewals')
        .select('*')
        .eq('startup_id', startup.id)
        .order('requested_at', { ascending: false });
      
      if (data) setRenewalRequests(data as RenewalRequest[]);
    } catch (err) {
      console.error('Error submitting renewal:', err);
      toast.error('Erreur lors de la soumission');
    } finally {
      setSubmitting(false);
    }
  };

  const expirationDate = startup?.label_expires_at || application?.label_valid_until;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-cyan-100 dark:bg-cyan-900/30 rounded-lg">
                <RefreshCw className="h-6 w-6 text-cyan-700 dark:text-cyan-300" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Renouvellement du label</h1>
                <p className="text-muted-foreground">
                  Gérez le renouvellement de votre Label Startup Numérique
                </p>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="space-y-6">
              {/* Current Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    Statut actuel du label
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Startup</span>
                    <span className="font-medium">{startup?.name}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Date d'expiration</span>
                    <span className="font-medium">
                      {expirationDate 
                        ? format(new Date(expirationDate), 'dd MMMM yyyy', { locale: fr })
                        : 'Non définie'}
                    </span>
                  </div>
                  {daysUntilExpiration !== null && (
                    <>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Jours restants</span>
                        <Badge variant={daysUntilExpiration <= 90 ? 'destructive' : 'secondary'}>
                          {daysUntilExpiration <= 0 ? 'Expiré' : `${daysUntilExpiration} jours`}
                        </Badge>
                      </div>
                      <Progress value={Math.max(0, Math.min(100, ((1095 - daysUntilExpiration) / 1095) * 100))} className="h-2" />
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Request Renewal */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    Demander le renouvellement
                  </CardTitle>
                  <CardDescription>
                    Vous pouvez demander le renouvellement de votre label jusqu'à 6 mois avant son expiration
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {!canRequestRenewal && daysUntilExpiration && daysUntilExpiration > 180 ? (
                    <div className="p-4 bg-muted rounded-lg text-center">
                      <Clock className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-muted-foreground">
                        Vous pourrez demander le renouvellement à partir du{' '}
                        <strong>
                          {expirationDate && format(
                            new Date(new Date(expirationDate).getTime() - 180 * 24 * 60 * 60 * 1000),
                            'dd MMMM yyyy',
                            { locale: fr }
                          )}
                        </strong>
                      </p>
                    </div>
                  ) : hasActivePending ? (
                    <div className="p-4 bg-primary/10 rounded-lg text-center">
                      <RefreshCw className="h-8 w-8 text-primary mx-auto mb-2" />
                      <p className="font-medium">Une demande de renouvellement est en cours</p>
                      <p className="text-sm text-muted-foreground">
                        Vous recevrez une notification dès qu'elle sera traitée
                      </p>
                    </div>
                  ) : (
                    <>
                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          Notes complémentaires (optionnel)
                        </label>
                        <Textarea
                          placeholder="Informations importantes concernant votre demande de renouvellement..."
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          rows={3}
                        />
                      </div>
                      <div className="bg-muted/50 p-4 rounded-lg">
                        <h4 className="font-medium mb-2">Documents requis</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>• Attestation fiscale à jour</li>
                          <li>• Rapport d'activité des 3 dernières années</li>
                          <li>• RCCM mis à jour (si applicable)</li>
                        </ul>
                        <p className="text-xs text-muted-foreground mt-2">
                          Ces documents seront demandés lors de l'instruction de votre demande
                        </p>
                      </div>
                      <Button 
                        className="w-full gap-2" 
                        onClick={handleSubmitRenewal}
                        disabled={submitting}
                      >
                        {submitting ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <RefreshCw className="h-4 w-4" />
                        )}
                        Soumettre la demande de renouvellement
                      </Button>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* History */}
              {renewalRequests.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-primary" />
                      Historique des demandes
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {renewalRequests.map((request) => {
                        const config = statusConfig[request.status] || statusConfig.pending;
                        const StatusIcon = config.icon;
                        
                        return (
                          <div 
                            key={request.id} 
                            className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                          >
                            <div className="flex items-center gap-3">
                              <StatusIcon className="h-5 w-5 text-muted-foreground" />
                              <div>
                                <p className="font-medium text-sm">
                                  Demande du {format(new Date(request.requested_at), 'dd MMMM yyyy', { locale: fr })}
                                </p>
                                {request.notes && (
                                  <p className="text-xs text-muted-foreground">{request.notes}</p>
                                )}
                              </div>
                            </div>
                            <Badge variant={config.variant}>{config.label}</Badge>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
