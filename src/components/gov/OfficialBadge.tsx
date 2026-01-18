import { CheckCircle, Shield } from "lucide-react";

interface OfficialBadgeProps {
  variant?: "officiel" | "certifie";
  size?: "sm" | "md";
  className?: string;
}

const OfficialBadge = ({ 
  variant = "officiel", 
  size = "md",
  className = "" 
}: OfficialBadgeProps) => {
  const Icon = variant === "officiel" ? CheckCircle : Shield;
  const label = variant === "officiel" ? "Officiel" : "Certifié";
  const badgeClass = variant === "officiel" ? "gov-badge-officiel" : "gov-badge-certifie";
  
  const sizeClasses = {
    sm: "text-[10px] px-2 py-0.5",
    md: "text-xs px-3 py-1",
  };

  return (
    <span className={`${badgeClass} ${sizeClasses[size]} ${className}`}>
      <Icon className={size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5"} />
      {label}
    </span>
  );
};

export default OfficialBadge;
