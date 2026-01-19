import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface CompletionDonutProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
}

export function CompletionDonut({
  percentage,
  size = 120,
  strokeWidth = 10,
  className,
}: CompletionDonutProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  // Couleur basée sur le pourcentage
  const getColor = () => {
    if (percentage >= 100) return "hsl(var(--success))";
    if (percentage >= 60) return "hsl(var(--primary))";
    if (percentage >= 30) return "hsl(var(--warning))";
    return "hsl(var(--accent))";
  };

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg width={size} height={size} className="-rotate-90">
        {/* Cercle de fond */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="hsl(var(--muted))"
          strokeWidth={strokeWidth}
        />
        
        {/* Cercle de progression */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={getColor()}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </svg>

      {/* Pourcentage au centre */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className="text-2xl font-bold text-foreground"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.3 }}
        >
          {Math.round(percentage)}%
        </motion.span>
        <span className="text-xs text-muted-foreground">Complété</span>
      </div>
    </div>
  );
}

export default CompletionDonut;
