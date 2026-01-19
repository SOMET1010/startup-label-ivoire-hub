import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { CheckCircle, XCircle, Clock, AlertTriangle, Users } from "lucide-react";

interface VoteStatusBadgeProps {
  totalVotes: number;
  quorumRequired: number;
  quorumReached: boolean;
  calculatedDecision: "approve" | "reject" | "pending" | "tie" | null;
  finalDecision: "approved" | "rejected" | "pending" | null;
  className?: string;
}

export default function VoteStatusBadge({
  totalVotes,
  quorumRequired,
  quorumReached,
  calculatedDecision,
  finalDecision,
  className,
}: VoteStatusBadgeProps) {
  // Si une décision finale a été prise
  if (finalDecision) {
    if (finalDecision === "approved") {
      return (
        <Badge variant="final-approve" className={cn("flex items-center gap-1", className)}>
          <CheckCircle className="h-3 w-3" />
          Approuvé
        </Badge>
      );
    }
    if (finalDecision === "rejected") {
      return (
        <Badge variant="final-reject" className={cn("flex items-center gap-1", className)}>
          <XCircle className="h-3 w-3" />
          Rejeté
        </Badge>
      );
    }
  }

  // Si le quorum n'est pas atteint
  if (!quorumReached) {
    return (
      <Badge variant="outline" className={cn("text-muted-foreground flex items-center gap-1", className)}>
        <Users className="h-3 w-3" />
        {totalVotes}/{quorumRequired} votes
      </Badge>
    );
  }

  // Quorum atteint, montrer la tendance
  if (calculatedDecision === "approve") {
    return (
      <Badge variant="approve" className={cn("flex items-center gap-1", className)}>
        <CheckCircle className="h-3 w-3" />
        {totalVotes}/{quorumRequired} Approuver
      </Badge>
    );
  }

  if (calculatedDecision === "reject") {
    return (
      <Badge variant="reject" className={cn("flex items-center gap-1", className)}>
        <XCircle className="h-3 w-3" />
        {totalVotes}/{quorumRequired} Rejeter
      </Badge>
    );
  }

  if (calculatedDecision === "tie") {
    return (
      <Badge variant="tie" className={cn("flex items-center gap-1", className)}>
        <AlertTriangle className="h-3 w-3" />
        {totalVotes}/{quorumRequired} Égalité
      </Badge>
    );
  }

  // En attente
  return (
    <Badge variant="pending-vote" className={cn("flex items-center gap-1", className)}>
      <Clock className="h-3 w-3" />
      {totalVotes}/{quorumRequired} En attente
    </Badge>
  );
}
