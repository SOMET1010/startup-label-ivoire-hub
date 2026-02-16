import { useCallback } from "react";
import { AlertBanner } from "@/components/shared/AlertBanner";
import { ShieldAlert, ExternalLink } from "lucide-react";

/**
 * Displays a dismissible reminder for upcoming password-policy reviews.
 * Re-appears every 30 days after dismissal.
 */
export default function SecurityReviewBanner() {
  const handleViewGuide = useCallback(() => {
    window.open("/documents/enable-leaked-password-protection.md", "_blank");
  }, []);

  return (
    <AlertBanner
      variant="warning"
      icon={ShieldAlert}
      title="Rappel sécurité — Revue de la politique de mots de passe"
      description="Vérifiez que la protection HIBP (mots de passe compromis) est activée et que les paramètres d'authentification sont à jour. Une revue trimestrielle est recommandée."
      dismissible
      persistKey="security-review-reminder"
      persistDuration={30 * 24 * 60 * 60 * 1000}
      action={{
        label: "Voir le guide de remédiation",
        onClick: handleViewGuide,
        icon: ExternalLink,
      }}
    />
  );
}
