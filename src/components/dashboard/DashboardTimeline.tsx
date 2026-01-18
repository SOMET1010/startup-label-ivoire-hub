import { cn } from "@/lib/utils";
import {
  ApplicationStatus,
  normalizeStatus,
  STATUS_CONFIG,
} from "@/components/shared/StatusBadge";
import { CheckCircle, Circle } from "lucide-react";

interface TimelineStep {
  status: ApplicationStatus;
  label: string;
  estimatedDays?: number;
}

const TIMELINE_STEPS: TimelineStep[] = [
  { status: "draft", label: "Brouillon", estimatedDays: 0 },
  { status: "pending", label: "Soumission", estimatedDays: 0 },
  { status: "verification", label: "Vérification", estimatedDays: 3 },
  { status: "under_review", label: "Évaluation", estimatedDays: 14 },
  { status: "approved", label: "Décision", estimatedDays: 7 },
];

interface DashboardTimelineProps {
  status: string | null | undefined;
  submittedAt?: string | null;
  compact?: boolean;
  className?: string;
}

export function DashboardTimeline({
  status,
  submittedAt,
  compact = false,
  className,
}: DashboardTimelineProps) {
  const normalizedStatus = normalizeStatus(status);
  
  // Trouver l'index du statut actuel
  const currentIndex = TIMELINE_STEPS.findIndex(
    (step) => step.status === normalizedStatus
  );
  
  // Gérer les statuts spéciaux
  const isRejected = normalizedStatus === "rejected";
  const isExpired = normalizedStatus === "expired";
  const isIncomplete = normalizedStatus === "incomplete";

  // Calculer les dates estimées
  const getEstimatedDate = (stepIndex: number): string | null => {
    if (!submittedAt || stepIndex <= 1) return null;
    
    const submitted = new Date(submittedAt);
    let totalDays = 0;
    
    for (let i = 2; i <= stepIndex; i++) {
      totalDays += TIMELINE_STEPS[i]?.estimatedDays || 0;
    }
    
    const estimated = new Date(submitted);
    estimated.setDate(estimated.getDate() + totalDays);
    
    return estimated.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
    });
  };

  if (compact) {
    // Version compacte - barre horizontale
    const progress = Math.max(0, (currentIndex / (TIMELINE_STEPS.length - 1)) * 100);
    
    return (
      <div className={cn("w-full", className)}>
        {/* Barre de progression */}
        <div className="relative">
          <div className="w-full h-2 bg-muted rounded-full">
            <div
              className={cn(
                "h-2 rounded-full transition-all duration-700",
                isRejected ? "bg-destructive" : isExpired ? "bg-warning" : "bg-primary"
              )}
              style={{ width: `${isRejected || isExpired ? 100 : progress}%` }}
            />
          </div>
          
          {/* Points sur la barre */}
          <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between px-0">
            {TIMELINE_STEPS.map((step, index) => {
              const isCompleted = index < currentIndex;
              const isCurrent = index === currentIndex;
              
              return (
                <div
                  key={step.status}
                  className={cn(
                    "w-4 h-4 rounded-full border-2 transition-colors",
                    isCompleted || isCurrent
                      ? isRejected 
                        ? "bg-destructive border-destructive"
                        : "bg-primary border-primary"
                      : "bg-background border-muted-foreground/30"
                  )}
                />
              );
            })}
          </div>
        </div>
        
        {/* Labels */}
        <div className="flex justify-between mt-3">
          {TIMELINE_STEPS.map((step, index) => {
            const isCompleted = index < currentIndex;
            const isCurrent = index === currentIndex;
            
            return (
              <div
                key={step.status}
                className={cn(
                  "text-xs text-center flex-1",
                  isCompleted || isCurrent ? "text-foreground" : "text-muted-foreground",
                  isCurrent && "font-semibold"
                )}
              >
                {step.label}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Version détaillée - verticale avec dates
  return (
    <div className={cn("relative", className)}>
      {/* Ligne verticale de fond */}
      <div className="absolute left-[15px] top-4 bottom-4 w-0.5 bg-border" />
      
      {/* Ligne de progression */}
      <div
        className={cn(
          "absolute left-[15px] top-4 w-0.5 transition-all duration-700",
          isRejected ? "bg-destructive" : isExpired ? "bg-warning" : "bg-primary"
        )}
        style={{
          height: `${Math.min(100, Math.max(0, (currentIndex / (TIMELINE_STEPS.length - 1)) * 100))}%`,
        }}
      />

      <div className="space-y-6">
        {TIMELINE_STEPS.map((step, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex && !isRejected && !isExpired;
          const estimatedDate = getEstimatedDate(index);
          const config = STATUS_CONFIG[step.status];

          return (
            <div key={step.status} className="flex items-start gap-4 relative">
              {/* Icône */}
              <div
                className={cn(
                  "relative z-10 flex items-center justify-center w-8 h-8 rounded-full border-2 transition-colors bg-background",
                  isCompleted
                    ? "bg-primary border-primary"
                    : isCurrent
                      ? "border-primary bg-primary/10"
                      : "border-muted-foreground/30"
                )}
              >
                {isCompleted ? (
                  <CheckCircle className="h-5 w-5 text-primary-foreground" />
                ) : isCurrent ? (
                  <Circle className="h-4 w-4 text-primary fill-primary" />
                ) : (
                  <Circle className="h-4 w-4 text-muted-foreground/50" />
                )}
              </div>

              {/* Contenu */}
              <div className="flex-1 pb-2">
                <div className="flex items-center justify-between">
                  <p
                    className={cn(
                      "font-medium",
                      isCompleted || isCurrent ? "text-foreground" : "text-muted-foreground"
                    )}
                  >
                    {step.label}
                  </p>
                  {estimatedDate && index > currentIndex && (
                    <span className="text-xs text-muted-foreground">
                      ~{estimatedDate}
                    </span>
                  )}
                </div>
                
                {isCurrent && (
                  <p className="text-sm text-primary mt-0.5">
                    En cours
                  </p>
                )}
                
                {isCompleted && index === 1 && submittedAt && (
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {new Date(submittedAt).toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                )}
              </div>
            </div>
          );
        })}
        
        {/* Statut spécial si rejeté/expiré */}
        {(isRejected || isExpired || isIncomplete) && (
          <div className="flex items-start gap-4 relative">
            <div
              className={cn(
                "relative z-10 flex items-center justify-center w-8 h-8 rounded-full border-2",
                isRejected 
                  ? "bg-destructive border-destructive" 
                  : "bg-warning border-warning"
              )}
            >
              {(() => {
                const Icon = STATUS_CONFIG[normalizedStatus].icon;
                return (
                  <Icon className={cn(
                    "h-5 w-5",
                    isRejected ? "text-destructive-foreground" : "text-warning-foreground"
                  )} />
                );
              })()}
            </div>
            <div className="flex-1">
              <p className={cn(
                "font-medium",
                isRejected ? "text-destructive" : "text-warning"
              )}>
                {STATUS_CONFIG[normalizedStatus].label}
              </p>
              <p className="text-sm text-muted-foreground mt-0.5">
                {STATUS_CONFIG[normalizedStatus].description}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default DashboardTimeline;
