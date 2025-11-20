import { useState, useEffect } from "react";
import { AlertCircle, X } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { hasSupabase } from "@/integrations/supabase/client";

const CloudStatusBanner = () => {
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem("cloud-banner-dismissed");
    const dismissedTime = dismissed ? parseInt(dismissed) : 0;
    const now = Date.now();
    const twentyFourHours = 24 * 60 * 60 * 1000;

    if (dismissedTime && now - dismissedTime < twentyFourHours) {
      setIsDismissed(true);
    } else if (dismissedTime) {
      localStorage.removeItem("cloud-banner-dismissed");
    }
  }, []);

  const handleDismiss = () => {
    localStorage.setItem("cloud-banner-dismissed", Date.now().toString());
    setIsDismissed(true);
  };

  if (hasSupabase || isDismissed) {
    return null;
  }

  return (
    <div className="sticky top-0 z-40 w-full">
      <Alert variant="default" className="rounded-none border-x-0 border-t-0 border-amber-400 bg-amber-50 text-amber-900">
        <AlertCircle className="h-5 w-5 text-amber-600" />
        <AlertTitle className="flex items-center justify-between text-base font-semibold">
          Backend non configuré - Fonctionnalités limitées
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDismiss}
            className="h-6 w-6 text-amber-900 hover:bg-amber-100 hover:text-amber-950"
            aria-label="Masquer pour 24h"
          >
            <X className="h-4 w-4" />
          </Button>
        </AlertTitle>
        <AlertDescription className="mt-2 space-y-3 text-sm text-amber-800">
          <div>
            <p className="font-medium mb-1">Les fonctionnalités suivantes sont désactivées :</p>
            <ul className="list-disc list-inside space-y-0.5 ml-2">
              <li>Authentification (connexion, inscription)</li>
              <li>Candidatures au label</li>
              <li>Gestion des startups</li>
              <li>Envoi de messages</li>
            </ul>
          </div>
          
          <div>
            <p className="font-medium mb-1">Pour activer le backend :</p>
            <ol className="list-decimal list-inside space-y-0.5 ml-2">
              <li>Cliquez sur l'onglet "Cloud" dans la barre latérale gauche</li>
              <li>Cliquez sur "Enable Lovable Cloud"</li>
              <li>Attendez la fin du provisioning (1-2 minutes)</li>
              <li>Exécutez le script SQL depuis IMPLEMENTATION_GUIDE.md</li>
            </ol>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default CloudStatusBanner;
