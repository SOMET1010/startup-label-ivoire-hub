import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  ApplicationStatus,
  normalizeStatus,
  STATUS_CONFIG,
} from "@/components/shared/StatusBadge";
import { CheckCircle, Circle } from "lucide-react";

interface ApplicationStatusWidgetProps {
  status: string | null | undefined;
  submittedAt?: string | null;
  className?: string;
}

// Timeline des étapes
const TIMELINE_STEPS: { status: ApplicationStatus; label: string }[] = [
  { status: "draft", label: "Brouillon" },
  { status: "pending", label: "Soumis" },
  { status: "verification", label: "Vérification" },
  { status: "under_review", label: "Évaluation" },
  { status: "approved", label: "Validé" },
];

export function ApplicationStatusWidget({
  status,
  submittedAt,
  className,
}: ApplicationStatusWidgetProps) {
  const normalizedStatus = normalizeStatus(status);
  const config = STATUS_CONFIG[normalizedStatus];
  const Icon = config.icon;

  // Calculer l'index du statut actuel
  const currentIndex = TIMELINE_STEPS.findIndex(
    (step) => step.status === normalizedStatus
  );

  // Gérer les cas spéciaux (rejected, expired, incomplete)
  const isSpecialStatus = ["rejected", "expired", "incomplete"].includes(
    normalizedStatus
  );

  return (
    <Card className={cn("h-full", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <div className={cn("p-1.5 rounded-lg", config.bgClass)}>
            <Icon className={cn("h-4 w-4", config.colorClass)} />
          </div>
          Statut de la candidature
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Statut actuel */}
        <div
          className={cn(
            "flex items-center gap-3 p-3 rounded-lg mb-4",
            config.bgClass,
            config.borderClass,
            "border"
          )}
        >
          <Icon className={cn("h-5 w-5", config.colorClass)} />
          <div>
            <p className={cn("font-semibold", config.colorClass)}>
              {config.label}
            </p>
            <p className="text-xs text-muted-foreground">
              {config.description}
            </p>
          </div>
        </div>

        {/* Timeline visuelle */}
        {!isSpecialStatus && (
          <div className="relative">
            {/* Ligne de progression */}
            <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-border" />
            <div
              className="absolute left-[11px] top-2 w-0.5 bg-primary transition-all duration-500"
              style={{
                height: `${Math.max(0, (currentIndex / (TIMELINE_STEPS.length - 1)) * 100)}%`,
              }}
            />

            {/* Étapes */}
            <div className="space-y-3">
              {TIMELINE_STEPS.map((step, index) => {
                const isCompleted = index < currentIndex;
                const isCurrent = index === currentIndex;

                return (
                  <div
                    key={step.status}
                    className="flex items-center gap-3 relative"
                  >
                    <div
                      className={cn(
                        "relative z-10 flex items-center justify-center w-6 h-6 rounded-full border-2 transition-colors",
                        isCompleted || isCurrent
                          ? "bg-primary border-primary"
                          : "bg-background border-border"
                      )}
                    >
                      {isCompleted ? (
                        <CheckCircle className="h-4 w-4 text-primary-foreground" />
                      ) : isCurrent ? (
                        <Circle className="h-3 w-3 text-primary-foreground fill-primary-foreground" />
                      ) : (
                        <Circle className="h-3 w-3 text-muted-foreground" />
                      )}
                    </div>
                    <span
                      className={cn(
                        "text-sm",
                        isCompleted || isCurrent
                          ? "text-foreground font-medium"
                          : "text-muted-foreground"
                      )}
                    >
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Message pour statuts spéciaux */}
        {isSpecialStatus && (
          <div className="text-sm text-muted-foreground">
            {normalizedStatus === "incomplete" && (
              <p>
                Des documents supplémentaires sont requis pour poursuivre
                l'examen de votre dossier.
              </p>
            )}
            {normalizedStatus === "rejected" && (
              <p>
                Votre candidature n'a pas été retenue. Consultez les motifs
                détaillés dans le suivi.
              </p>
            )}
            {normalizedStatus === "expired" && (
              <p>
                Votre label a expiré. Vous pouvez demander un renouvellement.
              </p>
            )}
          </div>
        )}

        {/* Date de soumission */}
        {submittedAt && (
          <div className="mt-4 pt-3 border-t border-border">
            <p className="text-xs text-muted-foreground">
              Soumis le{" "}
              {new Date(submittedAt).toLocaleDateString("fr-FR", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default ApplicationStatusWidget;
