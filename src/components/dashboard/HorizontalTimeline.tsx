import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  FileEdit,
  Send,
  Search,
  Scale,
  Award,
  Check,
  LucideIcon,
} from "lucide-react";
import { normalizeStatus, ApplicationStatus } from "@/components/shared/StatusBadge";

interface TimelineStep {
  status: ApplicationStatus;
  label: string;
  icon: LucideIcon;
}

const TIMELINE_STEPS: TimelineStep[] = [
  { status: "draft", label: "Brouillon", icon: FileEdit },
  { status: "pending", label: "Soumis", icon: Send },
  { status: "under_review", label: "Évaluation", icon: Search },
  { status: "verification", label: "Décision", icon: Scale },
  { status: "approved", label: "Décision finale", icon: Award },
];

// Mapping des statuts vers l'index de la timeline
const STATUS_TO_INDEX: Record<ApplicationStatus, number> = {
  draft: 0,
  incomplete: 0,
  pending: 1,
  verification: 2,
  under_review: 2,
  approved: 4,
  rejected: 4,
  expired: 4,
};

interface HorizontalTimelineProps {
  status: string | null | undefined;
  className?: string;
}

export function HorizontalTimeline({ status, className }: HorizontalTimelineProps) {
  const normalizedStatus = normalizeStatus(status);
  const currentIndex = STATUS_TO_INDEX[normalizedStatus] ?? 0;
  const isRejected = normalizedStatus === "rejected";
  const isApproved = normalizedStatus === "approved";

  return (
    <div className={cn("w-full", className)}>
      <div className="relative flex items-center justify-between">
        {/* Ligne de connexion de fond */}
        <div className="absolute top-5 left-[24px] right-[24px] h-0.5 bg-border" />
        
        {/* Ligne de progression */}
        <motion.div
          className={cn(
            "absolute top-5 left-[24px] h-0.5",
            isRejected ? "bg-destructive" : "bg-primary"
          )}
          initial={{ width: 0 }}
          animate={{ 
            width: `calc(${(currentIndex / (TIMELINE_STEPS.length - 1)) * 100}% - 48px)` 
          }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />

        {TIMELINE_STEPS.map((step, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;
          const isFuture = index > currentIndex;
          const StepIcon = step.icon;

          return (
            <motion.div
              key={step.status}
              className="flex flex-col items-center z-10"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
            >
              {/* Cercle avec icône */}
              <div
                className={cn(
                  "relative flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300",
                  isCompleted
                    ? "bg-primary border-primary"
                    : isCurrent
                      ? isRejected
                        ? "bg-destructive/10 border-destructive"
                        : isApproved
                          ? "bg-success/10 border-success"
                          : "bg-primary/10 border-primary"
                      : "bg-background border-muted-foreground/30"
                )}
              >
                {isCompleted ? (
                  <Check className="h-5 w-5 text-primary-foreground" />
                ) : (
                  <StepIcon
                    className={cn(
                      "h-5 w-5 transition-colors",
                      isCurrent
                        ? isRejected
                          ? "text-destructive"
                          : isApproved
                            ? "text-success"
                            : "text-primary"
                        : "text-muted-foreground/50"
                    )}
                  />
                )}
              </div>

              {/* Label */}
              <span
                className={cn(
                  "mt-2 text-xs font-medium text-center whitespace-nowrap transition-colors",
                  isCompleted
                    ? "text-primary"
                    : isCurrent
                      ? isRejected
                        ? "text-destructive"
                        : isApproved
                          ? "text-success"
                          : "text-primary font-semibold"
                      : "text-muted-foreground"
                )}
              >
                {step.label}
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

export default HorizontalTimeline;
