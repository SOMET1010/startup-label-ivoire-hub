import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Eye, CheckCircle, XCircle, Clock, FileQuestion } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import VoteStatusBadge from "@/components/evaluation/VoteStatusBadge";

interface VotingData {
  totalVotes: number;
  quorumRequired: number;
  quorumReached: boolean;
  calculatedDecision: "approve" | "reject" | "pending" | "tie" | null;
  finalDecision: "approved" | "rejected" | "pending" | null;
}

interface ApplicationCardProps {
  id: string;
  startupName: string;
  sector: string | null;
  stage: string | null;
  candidateName: string | null;
  candidateEmail: string | null;
  submittedAt: string | null;
  status: string;
  averageScore: number | null;
  pendingDocsCount: number;
  votingData?: VotingData;
  statusLabels: Record<string, { label: string; variant: string }>;
  sectorLabels: Record<string, string>;
  stageLabels: Record<string, string>;
  onViewDetails: () => void;
  onReview?: () => void;
  onApprove?: () => void;
  onReject?: () => void;
  onRequestDocument?: () => void;
  getScoreBadge: (score: number | null) => React.ReactNode;
}

export function ApplicationCard({
  startupName,
  sector,
  stage,
  candidateName,
  candidateEmail,
  submittedAt,
  status,
  averageScore,
  pendingDocsCount,
  votingData,
  statusLabels,
  sectorLabels,
  stageLabels,
  onViewDetails,
  onReview,
  onApprove,
  onReject,
  onRequestDocument,
  getScoreBadge,
}: ApplicationCardProps) {
  const canTakeAction = status === "pending" || status === "under_review" || status === "incomplete";
  
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        {/* Header avec nom et statut */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-base truncate">{startupName}</h3>
            <p className="text-sm text-muted-foreground truncate">
              {candidateName || candidateEmail || "—"}
            </p>
          </div>
          <div className="flex flex-col items-end gap-1">
            <Badge variant={statusLabels[status]?.variant as "default" | "secondary" | "destructive" | "outline" || "secondary"}>
              {statusLabels[status]?.label || status}
            </Badge>
            {pendingDocsCount > 0 && (
              <Badge 
                variant="outline"
                className="bg-orange-100 text-orange-700 border-orange-300 flex items-center gap-1 text-xs"
              >
                <FileQuestion className="h-3 w-3" />
                {pendingDocsCount} doc{pendingDocsCount > 1 ? "s" : ""}
              </Badge>
            )}
          </div>
        </div>

        {/* Infos en grille */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm mb-3">
          <div>
            <span className="text-muted-foreground">Secteur : </span>
            <span className="font-medium">{sectorLabels[sector || ""] || sector || "—"}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Stade : </span>
            <span className="font-medium">{stageLabels[stage || ""] || stage || "—"}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Date : </span>
            <span className="font-medium">
              {submittedAt
                ? format(new Date(submittedAt), "dd/MM/yy", { locale: fr })
                : "—"}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-muted-foreground">Score : </span>
            {getScoreBadge(averageScore)}
          </div>
        </div>

        {/* Vote status */}
        {votingData && (
          <div className="mb-3">
            <VoteStatusBadge
              totalVotes={votingData.totalVotes}
              quorumRequired={votingData.quorumRequired}
              quorumReached={votingData.quorumReached}
              calculatedDecision={votingData.calculatedDecision}
              finalDecision={votingData.finalDecision}
            />
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-wrap gap-2 pt-3 border-t">
          <Button size="sm" variant="outline" onClick={onViewDetails} className="flex-1">
            <Eye className="h-4 w-4 mr-1" /> Détails
          </Button>
          
          {status === "pending" && onReview && (
            <Button 
              size="sm" 
              variant="outline" 
              onClick={onReview}
              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
            >
              <Clock className="h-4 w-4" />
            </Button>
          )}
          
          {canTakeAction && onRequestDocument && (
            <Button 
              size="sm" 
              variant="outline" 
              onClick={onRequestDocument}
              className="text-orange-600 hover:text-orange-700 hover:bg-orange-50"
            >
              <FileQuestion className="h-4 w-4" />
            </Button>
          )}
          
          {canTakeAction && onApprove && (
            <Button 
              size="sm" 
              variant="outline" 
              onClick={onApprove}
              className="text-green-600 hover:text-green-700 hover:bg-green-50"
            >
              <CheckCircle className="h-4 w-4" />
            </Button>
          )}
          
          {canTakeAction && onReject && (
            <Button 
              size="sm" 
              variant="outline" 
              onClick={onReject}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <XCircle className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
