import { Award, Shield, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface PremiumBadgeProps {
  variant?: "official" | "certified" | "compact";
  animated?: boolean;
  className?: string;
}

const PremiumBadge = ({ 
  variant = "official", 
  animated = true,
  className 
}: PremiumBadgeProps) => {
  if (variant === "compact") {
    return (
      <div className={cn(
        "inline-flex items-center gap-2 px-3 py-1.5 rounded-full",
        "bg-primary/10 text-primary font-medium text-sm",
        "border border-primary/20",
        animated && "animate-fade-in",
        className
      )}>
        <Shield className="w-4 h-4" />
        <span>Label Officiel</span>
      </div>
    );
  }

  if (variant === "certified") {
    return (
      <div className={cn(
        "inline-flex items-center gap-2 px-4 py-2 rounded-full",
        "bg-secondary/10 text-secondary font-semibold",
        "border border-secondary/30",
        animated && "animate-fade-in",
        className
      )}>
        <CheckCircle2 className="w-5 h-5" />
        <span>Startup Numérique Labellisée</span>
      </div>
    );
  }

  // Official variant (default)
  return (
    <div className={cn(
      "relative inline-flex items-center gap-3 px-6 py-3 rounded-2xl",
      "bg-gradient-to-r from-primary/10 via-primary/5 to-secondary/10",
      "border border-primary/20",
      "shadow-lg shadow-primary/5",
      animated && "animate-fade-in",
      className
    )}>
      {/* Decorative glow */}
      {animated && (
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/5 to-secondary/5 blur-xl -z-10" />
      )}
      
      {/* Badge icon */}
      <div className="relative">
        <div className="absolute inset-0 bg-primary/20 rounded-full blur-md" />
        <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
          <Award className="w-5 h-5 text-primary-foreground" />
        </div>
      </div>
      
      {/* Badge text */}
      <div className="flex flex-col">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          République de Côte d'Ivoire
        </span>
        <span className="text-sm font-bold text-primary">
          Startup Numérique Labellisée
        </span>
      </div>
      
      {/* Verified checkmark */}
      <CheckCircle2 className="w-5 h-5 text-secondary ml-1" />
    </div>
  );
};

export default PremiumBadge;
