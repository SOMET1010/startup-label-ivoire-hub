import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Vote,
  Users,
  TrendingUp,
  Loader2,
  Gavel,
} from "lucide-react";
import { cn } from "@/lib/utils";
import VoteProgressBar from "./VoteProgressBar";
import { useVotingDecision } from "@/hooks/useVotingDecision";

interface VotingPanelProps {
  applicationId: string;
  startupName: string;
  onDecisionApplied?: () => void;
  className?: string;
}

export default function VotingPanel({
  applicationId,
  startupName,
  onDecisionApplied,
  className,
}: VotingPanelProps) {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showOverrideDialog, setShowOverrideDialog] = useState(false);
  const [pendingAction, setPendingAction] = useState<"approve" | "reject" | null>(null);
  const [overrideNotes, setOverrideNotes] = useState("");
  const [applying, setApplying] = useState(false);

  const {
    approveCount,
    rejectCount,
    pendingCount,
    totalVotes,
    quorumRequired,
    quorumReached,
    votesRemaining,
    calculatedDecision,
    decisionConfidence,
    averageScore,
    scorePassesThreshold,
    suggestedAction,
    suggestionReason,
    finalDecision,
    decidedAt,
    decisionSource,
    decisionNotes,
    loading,
    applyDecision,
    overrideDecision,
  } = useVotingDecision(applicationId);

  const handleApplySuggestion = () => {
    if (suggestedAction === "approve" || suggestedAction === "reject") {
      setPendingAction(suggestedAction);
      setShowConfirmDialog(true);
    }
  };

  const handleConfirmAction = async () => {
    if (!pendingAction) return;

    setApplying(true);
    const decision = pendingAction === "approve" ? "approved" : "rejected";
    const success = await applyDecision(decision, "automatic");
    setApplying(false);
    setShowConfirmDialog(false);
    setPendingAction(null);

    if (success && onDecisionApplied) {
      onDecisionApplied();
    }
  };

  const handleOverride = async () => {
    if (!pendingAction || !overrideNotes.trim()) return;

    setApplying(true);
    const decision = pendingAction === "approve" ? "approved" : "rejected";
    const success = await overrideDecision(decision, overrideNotes);
    setApplying(false);
    setShowOverrideDialog(false);
    setPendingAction(null);
    setOverrideNotes("");

    if (success && onDecisionApplied) {
      onDecisionApplied();
    }
  };

  const openOverrideDialog = (action: "approve" | "reject") => {
    setPendingAction(action);
    setOverrideNotes("");
    setShowOverrideDialog(true);
  };

  if (loading) {
    return (
      <Card className={cn("", className)}>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  const getSuggestionIcon = () => {
    switch (suggestedAction) {
      case "approve":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "reject":
        return <XCircle className="h-5 w-5 text-red-600" />;
      case "wait_for_quorum":
        return <Clock className="h-5 w-5 text-yellow-600" />;
      case "needs_review":
        return <AlertTriangle className="h-5 w-5 text-orange-600" />;
    }
  };

  const getSuggestionBgColor = () => {
    switch (suggestedAction) {
      case "approve":
        return "bg-green-50 border-green-200";
      case "reject":
        return "bg-red-50 border-red-200";
      case "wait_for_quorum":
        return "bg-yellow-50 border-yellow-200";
      case "needs_review":
        return "bg-orange-50 border-orange-200";
    }
  };

  const getSuggestionLabel = () => {
    switch (suggestedAction) {
      case "approve":
        return "APPROUVER";
      case "reject":
        return "REJETER";
      case "wait_for_quorum":
        return "ATTENDRE LE QUORUM";
      case "needs_review":
        return "RÉVISION MANUELLE REQUISE";
    }
  };

  return (
    <>
      <Card className={cn("", className)}>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Vote className="h-4 w-4" />
            Décision du Comité
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Décision finale si déjà prise */}
          {finalDecision && (
            <div
              className={cn(
                "p-4 rounded-lg border-2",
                finalDecision === "approved"
                  ? "bg-green-50 border-green-300"
                  : "bg-red-50 border-red-300"
              )}
            >
              <div className="flex items-center gap-2 mb-2">
                {finalDecision === "approved" ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-600" />
                )}
                <span className="font-semibold">
                  {finalDecision === "approved" ? "CANDIDATURE APPROUVÉE" : "CANDIDATURE REJETÉE"}
                </span>
              </div>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>
                  Décision {decisionSource === "automatic" ? "automatique" : decisionSource === "override" ? "manuelle (override)" : "manuelle"}
                </p>
                {decidedAt && (
                  <p>
                    Le {new Date(decidedAt).toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                )}
                {decisionNotes && <p className="italic mt-2">"{decisionNotes}"</p>}
              </div>
            </div>
          )}

          {!finalDecision && (
            <>
              {/* Quorum et Score */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Users className="h-4 w-4" />
                      Quorum
                    </span>
                    <span className="font-medium">
                      {totalVotes}/{quorumRequired}
                    </span>
                  </div>
                  <Progress
                    value={(totalVotes / quorumRequired) * 100}
                    className="h-2"
                  />
                  {!quorumReached && (
                    <p className="text-xs text-muted-foreground">
                      {votesRemaining} vote(s) restant(s)
                    </p>
                  )}
                  {quorumReached && (
                    <Badge variant="outline" className="text-green-600 border-green-300">
                      Quorum atteint
                    </Badge>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <TrendingUp className="h-4 w-4" />
                      Score moyen
                    </span>
                    <span className="font-medium">
                      {averageScore !== null ? `${averageScore}/100` : "-"}
                    </span>
                  </div>
                  {averageScore !== null && (
                    <>
                      <Progress
                        value={averageScore}
                        className={cn(
                          "h-2",
                          scorePassesThreshold ? "[&>div]:bg-green-500" : "[&>div]:bg-red-500"
                        )}
                      />
                      <Badge
                        variant="outline"
                        className={cn(
                          scorePassesThreshold
                            ? "text-green-600 border-green-300"
                            : "text-red-600 border-red-300"
                        )}
                      >
                        {scorePassesThreshold ? "Seuil atteint" : "Seuil non atteint"}
                      </Badge>
                    </>
                  )}
                </div>
              </div>

              <Separator />

              {/* Répartition des votes */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Répartition des votes</h4>
                <VoteProgressBar
                  approveCount={approveCount}
                  rejectCount={rejectCount}
                  pendingCount={pendingCount}
                  totalVotes={totalVotes}
                />
              </div>

              <Separator />

              {/* Recommandation automatique */}
              <div className={cn("p-4 rounded-lg border", getSuggestionBgColor())}>
                <div className="flex items-center gap-2 mb-2">
                  {getSuggestionIcon()}
                  <span className="font-semibold text-sm">
                    RECOMMANDATION : {getSuggestionLabel()}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{suggestionReason}</p>
              </div>

              {/* Actions */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Actions</h4>
                <div className="flex flex-wrap gap-2">
                  {(suggestedAction === "approve" || suggestedAction === "reject") && (
                    <Button
                      onClick={handleApplySuggestion}
                      className={cn(
                        suggestedAction === "approve"
                          ? "bg-green-600 hover:bg-green-700"
                          : "bg-red-600 hover:bg-red-700"
                      )}
                    >
                      <Gavel className="h-4 w-4 mr-2" />
                      Appliquer la suggestion
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    onClick={() => openOverrideDialog("approve")}
                    className="text-green-600 border-green-300 hover:bg-green-50"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approuver manuellement
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => openOverrideDialog("reject")}
                    className="text-red-600 border-red-300 hover:bg-red-50"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Rejeter manuellement
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Dialog de confirmation pour appliquer la suggestion */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Confirmer la décision
            </AlertDialogTitle>
            <AlertDialogDescription>
              Vous êtes sur le point de{" "}
              <strong>
                {pendingAction === "approve" ? "APPROUVER" : "REJETER"}
              </strong>{" "}
              la candidature de <strong>{startupName}</strong> sur la base de la
              recommandation automatique.
              <br />
              <br />
              Cette action mettra à jour le statut de la candidature et notifiera
              la startup.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={applying}>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmAction}
              disabled={applying}
              className={cn(
                pendingAction === "approve"
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-red-600 hover:bg-red-700"
              )}
            >
              {applying && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Confirmer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Dialog pour override manuel */}
      <AlertDialog open={showOverrideDialog} onOpenChange={setShowOverrideDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Décision manuelle
            </AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div>
                <p className="mb-4">
                  Vous êtes sur le point de{" "}
                  <strong>
                    {pendingAction === "approve" ? "APPROUVER" : "REJETER"}
                  </strong>{" "}
                  manuellement la candidature de <strong>{startupName}</strong>.
                </p>
                <div className="space-y-2">
                  <Label htmlFor="override-notes">
                    Justification (obligatoire)
                  </Label>
                  <Textarea
                    id="override-notes"
                    placeholder="Expliquez pourquoi vous prenez cette décision manuellement..."
                    value={overrideNotes}
                    onChange={(e) => setOverrideNotes(e.target.value)}
                    rows={3}
                  />
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={applying}>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleOverride}
              disabled={applying || !overrideNotes.trim()}
              className={cn(
                pendingAction === "approve"
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-red-600 hover:bg-red-700"
              )}
            >
              {applying && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Confirmer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
