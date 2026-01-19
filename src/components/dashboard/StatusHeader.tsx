import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  normalizeStatus,
  STATUS_CONFIG,
  ApplicationStatus,
} from "@/components/shared/StatusBadge";

interface StatusHeaderProps {
  status: string | null | undefined;
  className?: string;
}

export function StatusHeader({ status, className }: StatusHeaderProps) {
  const normalizedStatus = normalizeStatus(status);
  const config = STATUS_CONFIG[normalizedStatus];
  const StatusIcon = config.icon;

  // Mapper le statut vers une variante de badge
  const getBadgeVariant = (): "default" | "secondary" | "destructive" | "success" | "warning" | "info" | "muted" => {
    switch (normalizedStatus) {
      case "approved":
        return "success";
      case "rejected":
        return "destructive";
      case "expired":
      case "incomplete":
        return "warning";
      case "pending":
      case "verification":
      case "under_review":
        return "info";
      case "draft":
      default:
        return "muted";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn("space-y-2", className)}
    >
      <div className="flex items-center gap-3 flex-wrap">
        <h2 className="text-lg font-semibold text-foreground">Statut :</h2>
        <Badge variant={getBadgeVariant()} size="md" className="gap-1.5">
          <StatusIcon className="h-3.5 w-3.5" />
          {config.label}
        </Badge>
      </div>
      <p className="text-sm text-muted-foreground">{config.description}</p>
    </motion.div>
  );
}

export default StatusHeader;
