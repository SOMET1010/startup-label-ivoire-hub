import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  ApplicationStatus,
  normalizeStatus,
  STATUS_CONFIG,
} from "@/components/shared/StatusBadge";
import { ArrowRight, Sparkles } from "lucide-react";

interface NextActionCardProps {
  status: string | null | undefined;
  startupName?: string;
  hasUnreadComments?: boolean;
  missingDocumentsCount?: number;
  className?: string;
}

export function NextActionCard({
  status,
  startupName,
  hasUnreadComments = false,
  missingDocumentsCount = 0,
  className,
}: NextActionCardProps) {
  const normalizedStatus = normalizeStatus(status);
  const config = STATUS_CONFIG[normalizedStatus];
  const Icon = config.icon;

  // Définir l'action prioritaire
  let actionTitle = config.actionLabel || "Voir le suivi";
  let actionPath = config.actionPath || "/startup/suivi";
  let actionDescription = config.description;
  let isUrgent = false;

  // Surcharges contextuelles
  if (hasUnreadComments) {
    actionTitle = "Répondre aux commentaires du comité";
    actionPath = "/startup/suivi";
    actionDescription = "Vous avez des messages non lus de l'équipe d'évaluation.";
    isUrgent = true;
  } else if (missingDocumentsCount > 0 && normalizedStatus === "incomplete") {
    actionTitle = `Fournir ${missingDocumentsCount} document${missingDocumentsCount > 1 ? "s" : ""} manquant${missingDocumentsCount > 1 ? "s" : ""}`;
    actionPath = "/startup/candidature";
    actionDescription = "Des documents sont requis pour poursuivre l'examen de votre dossier.";
    isUrgent = true;
  }

  // Couleurs basées sur le statut
  const statusColorMap: Record<ApplicationStatus, string> = {
    draft: "from-muted to-muted/50",
    pending: "from-info/20 to-info/5",
    verification: "from-info/20 to-info/5",
    incomplete: "from-warning/20 to-warning/5",
    under_review: "from-primary/20 to-primary/5",
    approved: "from-success/20 to-success/5",
    rejected: "from-destructive/20 to-destructive/5",
    expired: "from-warning/20 to-warning/5",
  };

  return (
    <Card
      className={cn(
        "relative overflow-hidden border-2 transition-all duration-300",
        isUrgent ? "border-warning shadow-md" : "border-primary/20",
        className
      )}
    >
      {/* Gradient Background */}
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-br opacity-50",
          statusColorMap[normalizedStatus]
        )}
      />

      <CardContent className="relative p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          {/* Left section */}
          <div className="flex-1">
            {/* Badge urgent */}
            {isUrgent && (
              <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-warning/20 text-warning text-xs font-medium mb-3">
                <Sparkles className="h-3 w-3" />
                Action requise
              </div>
            )}

            {/* Header avec icône */}
            <div className="flex items-start gap-3 mb-2">
              <div
                className={cn(
                  "p-3 rounded-xl",
                  config.bgClass,
                  config.borderClass,
                  "border"
                )}
              >
                <Icon className={cn("h-6 w-6", config.colorClass)} />
              </div>
              <div className="flex-1">
                <h2 className="text-xl md:text-2xl font-bold text-foreground">
                  {actionTitle}
                </h2>
                {startupName && (
                  <p className="text-sm text-muted-foreground">
                    Startup: {startupName}
                  </p>
                )}
              </div>
            </div>

            <p className="text-muted-foreground mt-3 max-w-lg">
              {actionDescription}
            </p>
          </div>

          {/* Right section - CTA */}
          <div className="flex-shrink-0">
            <Button
              asChild
              size="lg"
              className={cn(
                "group gap-2 shadow-sm",
                isUrgent
                  ? "bg-warning text-warning-foreground hover:bg-warning/90"
                  : ""
              )}
            >
              <Link to={actionPath}>
                {normalizedStatus === "draft" ? "Continuer" : "Voir détails"}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Progress indicator for draft */}
        {normalizedStatus === "draft" && (
          <div className="mt-6 pt-4 border-t border-border/50">
            <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
              <span>Progression du dossier</span>
              <span>Non soumis</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-500"
                style={{ width: "25%" }}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default NextActionCard;
