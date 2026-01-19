import { hasSupabase } from "@/integrations/supabase/client";
import { AlertBanner } from "@/components/shared/AlertBanner";

const CloudStatusBanner = () => {
  if (hasSupabase) {
    return null;
  }

  return (
    <AlertBanner
      variant="warning"
      title="Backend non configuré - Fonctionnalités limitées"
      position="sticky-top"
      dismissible
      persistKey="cloud-banner"
      persistDuration={24 * 60 * 60 * 1000}
      description={
        <div className="space-y-3">
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
        </div>
      }
    />
  );
};

export default CloudStatusBanner;
