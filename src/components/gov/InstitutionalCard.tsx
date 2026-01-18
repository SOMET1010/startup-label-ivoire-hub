import { ReactNode } from "react";
import OfficialBadge from "./OfficialBadge";

interface InstitutionalCardProps {
  children: ReactNode;
  variant?: "primary" | "success";
  showBadge?: boolean;
  badgeVariant?: "officiel" | "certifie";
  className?: string;
}

const InstitutionalCard = ({
  children,
  variant = "primary",
  showBadge = false,
  badgeVariant = "officiel",
  className = "",
}: InstitutionalCardProps) => {
  const variantClasses = {
    primary: "institutional-card",
    success: "institutional-card institutional-card-success",
  };

  return (
    <div className={`${variantClasses[variant]} p-6 ${className}`}>
      {showBadge && (
        <div className="mb-4">
          <OfficialBadge variant={badgeVariant} />
        </div>
      )}
      {children}
    </div>
  );
};

export default InstitutionalCard;
