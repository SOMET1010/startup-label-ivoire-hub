import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useLabelStatus } from '@/hooks/useLabelStatus';
import { Loader2, ShieldX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface LabelGateProps {
  children: ReactNode;
}

export function LabelGate({ children }: LabelGateProps) {
  const { isLabeled, loading } = useLabelStatus();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isLabeled) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-muted/30">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="mx-auto bg-destructive/10 p-3 rounded-full w-fit mb-4">
              <ShieldX className="h-8 w-8 text-destructive" />
            </div>
            <CardTitle>Accès réservé aux startups labellisées</CardTitle>
            <CardDescription>
              Cette section est exclusivement accessible aux startups ayant obtenu le Label Startup Numérique.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground text-center">
              Si vous avez déjà soumis une candidature, veuillez attendre la validation de votre dossier. 
              Sinon, vous pouvez déposer votre candidature dès maintenant.
            </p>
            <div className="flex flex-col gap-2">
              <Button asChild className="w-full">
                <a href="/startup/suivi">Suivre ma candidature</a>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <a href="/postuler">Déposer une candidature</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}
