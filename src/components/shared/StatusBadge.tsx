import { cn } from "@/lib/utils";
import {
  FileEdit,
  Clock,
  Search,
  AlertCircle,
  Users,
  CheckCircle,
  XCircle,
  CalendarX,
  LucideIcon,
} from "lucide-react";

// Système de statuts complet aligné avec le backlog produit
export type ApplicationStatus =
  | "draft"      // S0 - Brouillon
  | "pending"    // S1 - Soumis
  | "verification" // S2 - En vérification
  | "incomplete" // S3 - À compléter
  | "under_review" // S4 - En évaluation
  | "approved"   // S5 - Validé
  | "rejected"   // S6 - Rejeté
  | "expired";   // S7 - Expiré

interface StatusConfig {
  label: string;
  description: string;
  icon: LucideIcon;
  colorClass: string;
  bgClass: string;
  borderClass: string;
  actionLabel?: string;
  actionPath?: string;
}

export const STATUS_CONFIG: Record<ApplicationStatus, StatusConfig> = {
  draft: {
    label: "Brouillon",
    description: "Dossier en cours de rédaction",
    icon: FileEdit,
    colorClass: "text-muted-foreground",
    bgClass: "bg-muted/50",
    borderClass: "border-border",
    actionLabel: "Continuer le dossier",
    actionPath: "/postuler",
  },
  pending: {
    label: "Soumis",
    description: "Dossier transmis pour examen",
    icon: Clock,
    colorClass: "text-info",
    bgClass: "bg-info/10",
    borderClass: "border-info/30",
    actionLabel: "Voir le suivi",
    actionPath: "/startup/suivi",
  },
  verification: {
    label: "En vérification",
    description: "Contrôle administratif en cours",
    icon: Search,
    colorClass: "text-info",
    bgClass: "bg-info/10",
    borderClass: "border-info/30",
    actionLabel: "Voir le suivi",
    actionPath: "/startup/suivi",
  },
  incomplete: {
    label: "À compléter",
    description: "Documents ou informations manquants",
    icon: AlertCircle,
    colorClass: "text-warning",
    bgClass: "bg-warning/10",
    borderClass: "border-warning/30",
    actionLabel: "Compléter le dossier",
    actionPath: "/startup/candidature",
  },
  under_review: {
    label: "En évaluation",
    description: "Examen par le comité de labellisation",
    icon: Users,
    colorClass: "text-primary",
    bgClass: "bg-primary/10",
    borderClass: "border-primary/30",
    actionLabel: "Voir le suivi",
    actionPath: "/startup/suivi",
  },
  approved: {
    label: "Validé",
    description: "Label attribué",
    icon: CheckCircle,
    colorClass: "text-success",
    bgClass: "bg-success/10",
    borderClass: "border-success/30",
    actionLabel: "Accéder à l'espace labellisé",
    actionPath: "/startup/espace-label",
  },
  rejected: {
    label: "Rejeté",
    description: "Candidature non retenue",
    icon: XCircle,
    colorClass: "text-destructive",
    bgClass: "bg-destructive/10",
    borderClass: "border-destructive/30",
    actionLabel: "Voir les motifs",
    actionPath: "/startup/suivi",
  },
  expired: {
    label: "Expiré",
    description: "Label arrivé à terme",
    icon: CalendarX,
    colorClass: "text-warning",
    bgClass: "bg-warning/10",
    borderClass: "border-warning/30",
    actionLabel: "Renouveler le label",
    actionPath: "/startup/renouvellement",
  },
};

// Fonction pour normaliser les statuts legacy
export function normalizeStatus(status: string | null | undefined): ApplicationStatus {
  if (!status) return "draft";
  
  const statusMap: Record<string, ApplicationStatus> = {
    // Statuts actuels
    draft: "draft",
    pending: "pending",
    verification: "verification",
    incomplete: "incomplete",
    under_review: "under_review",
    approved: "approved",
    rejected: "rejected",
    expired: "expired",
    // Statuts legacy
    submitted: "pending",
    in_review: "under_review",
    labeled: "approved",
  };
  
  return statusMap[status.toLowerCase()] || "draft";
}

interface StatusBadgeProps {
  status: string | null | undefined;
  size?: "sm" | "md" | "lg";
  showIcon?: boolean;
  showDescription?: boolean;
  className?: string;
}

export function StatusBadge({
  status,
  size = "md",
  showIcon = true,
  showDescription = false,
  className,
}: StatusBadgeProps) {
  const normalizedStatus = normalizeStatus(status);
  const config = STATUS_CONFIG[normalizedStatus];
  const Icon = config.icon;

  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs gap-1",
    md: "px-3 py-1 text-sm gap-1.5",
    lg: "px-4 py-2 text-base gap-2",
  };

  const iconSizes = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  };

  return (
    <div className={cn("flex flex-col", className)}>
      <span
        className={cn(
          "inline-flex items-center rounded-full font-medium border",
          sizeClasses[size],
          config.bgClass,
          config.colorClass,
          config.borderClass
        )}
      >
        {showIcon && <Icon className={iconSizes[size]} />}
        {config.label}
      </span>
      {showDescription && (
        <span className="text-xs text-muted-foreground mt-1">
          {config.description}
        </span>
      )}
    </div>
  );
}

// Composant pour afficher l'action suivante
interface NextActionProps {
  status: string | null | undefined;
  className?: string;
}

export function NextAction({ status, className }: NextActionProps) {
  const normalizedStatus = normalizeStatus(status);
  const config = STATUS_CONFIG[normalizedStatus];

  if (!config.actionLabel || !config.actionPath) return null;

  return (
    <div className={cn("flex flex-col", className)}>
      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
        Prochaine action
      </span>
      <span className={cn("font-semibold", config.colorClass)}>
        {config.actionLabel}
      </span>
    </div>
  );
}

export default StatusBadge;
