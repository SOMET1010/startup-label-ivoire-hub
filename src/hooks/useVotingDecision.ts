import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

export interface VotingConfig {
  quorumRequired: number;
  majorityThreshold: number; // 0.5 = 50%
  minScoreForApproval: number; // default: 60
}

export interface VotingResult {
  // Comptage des votes
  approveCount: number;
  rejectCount: number;
  pendingCount: number;
  totalVotes: number;

  // Statut du quorum
  quorumRequired: number;
  quorumReached: boolean;
  votesRemaining: number;

  // Décision calculée
  calculatedDecision: "approve" | "reject" | "pending" | "tie" | null;
  decisionConfidence: number; // 0-100%

  // Score moyen
  averageScore: number | null;
  scorePassesThreshold: boolean;

  // Suggestion finale
  suggestedAction: "approve" | "reject" | "wait_for_quorum" | "needs_review";
  suggestionReason: string;

  // Décision finale appliquée
  finalDecision: "approved" | "rejected" | "pending" | null;
  decidedBy: string | null;
  decidedAt: string | null;
  decisionSource: "automatic" | "manual" | "override" | null;
  decisionNotes: string | null;

  // États
  loading: boolean;
  error: string | null;
}

const DEFAULT_CONFIG: VotingConfig = {
  quorumRequired: 3,
  majorityThreshold: 0.5,
  minScoreForApproval: 60,
};

export function useVotingDecision(applicationId: string, config: Partial<VotingConfig> = {}) {
  const { user } = useAuth();
  const [result, setResult] = useState<VotingResult>({
    approveCount: 0,
    rejectCount: 0,
    pendingCount: 0,
    totalVotes: 0,
    quorumRequired: config.quorumRequired ?? DEFAULT_CONFIG.quorumRequired,
    quorumReached: false,
    votesRemaining: config.quorumRequired ?? DEFAULT_CONFIG.quorumRequired,
    calculatedDecision: null,
    decisionConfidence: 0,
    averageScore: null,
    scorePassesThreshold: false,
    suggestedAction: "wait_for_quorum",
    suggestionReason: "En attente de plus d'évaluations",
    finalDecision: null,
    decidedBy: null,
    decidedAt: null,
    decisionSource: null,
    decisionNotes: null,
    loading: true,
    error: null,
  });

  const mergedConfig: VotingConfig = { ...DEFAULT_CONFIG, ...config };

  const calculateVotingResult = useCallback(
    (
      evaluations: Array<{
        recommendation: string | null;
        total_score: number | null;
        is_submitted: boolean | null;
      }>,
      existingDecision: {
        final_decision: string | null;
        decided_by: string | null;
        decided_at: string | null;
        decision_source: string | null;
        decision_notes: string | null;
      } | null
    ): Omit<VotingResult, "loading" | "error"> => {
      // Filtrer les évaluations soumises
      const submittedEvaluations = evaluations.filter((e) => e.is_submitted);

      // Compter les votes
      const approveCount = submittedEvaluations.filter(
        (e) => e.recommendation === "approve"
      ).length;
      const rejectCount = submittedEvaluations.filter(
        (e) => e.recommendation === "reject"
      ).length;
      const pendingCount = submittedEvaluations.filter(
        (e) => e.recommendation === "pending" || !e.recommendation
      ).length;
      const totalVotes = submittedEvaluations.length;

      // Calculer le score moyen
      const scores = submittedEvaluations
        .map((e) => e.total_score)
        .filter((s): s is number => s !== null);
      const averageScore =
        scores.length > 0
          ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
          : null;

      // Vérifier le quorum
      const quorumReached = totalVotes >= mergedConfig.quorumRequired;
      const votesRemaining = Math.max(0, mergedConfig.quorumRequired - totalVotes);

      // Calculer la décision
      let calculatedDecision: "approve" | "reject" | "pending" | "tie" | null = null;
      let decisionConfidence = 0;

      if (quorumReached && totalVotes > 0) {
        const approvePercent = (approveCount / totalVotes) * 100;
        const rejectPercent = (rejectCount / totalVotes) * 100;

        if (approveCount > rejectCount && approveCount > pendingCount) {
          calculatedDecision = "approve";
          decisionConfidence = approvePercent;
        } else if (rejectCount > approveCount && rejectCount > pendingCount) {
          calculatedDecision = "reject";
          decisionConfidence = rejectPercent;
        } else if (approveCount === rejectCount && approveCount > 0) {
          calculatedDecision = "tie";
          decisionConfidence = 50;
        } else {
          calculatedDecision = "pending";
          decisionConfidence = (pendingCount / totalVotes) * 100;
        }
      }

      // Vérifier si le score passe le seuil
      const scorePassesThreshold =
        averageScore !== null && averageScore >= mergedConfig.minScoreForApproval;

      // Générer la suggestion
      let suggestedAction: "approve" | "reject" | "wait_for_quorum" | "needs_review";
      let suggestionReason: string;

      if (!quorumReached) {
        suggestedAction = "wait_for_quorum";
        suggestionReason = `En attente de ${votesRemaining} évaluation(s) supplémentaire(s) pour atteindre le quorum`;
      } else if (calculatedDecision === "approve" && scorePassesThreshold) {
        suggestedAction = "approve";
        suggestionReason = `Majorité favorable (${Math.round(decisionConfidence)}%) avec un score moyen de ${averageScore}/100 (seuil: ${mergedConfig.minScoreForApproval})`;
      } else if (calculatedDecision === "reject") {
        suggestedAction = "reject";
        suggestionReason = `Majorité défavorable (${Math.round(decisionConfidence)}%)${
          averageScore !== null ? ` avec un score moyen de ${averageScore}/100` : ""
        }`;
      } else if (calculatedDecision === "approve" && !scorePassesThreshold) {
        suggestedAction = "needs_review";
        suggestionReason = `Majorité favorable mais score moyen insuffisant (${averageScore}/100 < ${mergedConfig.minScoreForApproval})`;
      } else if (calculatedDecision === "tie") {
        suggestedAction = "needs_review";
        suggestionReason = "Égalité entre les votes favorables et défavorables - décision manuelle requise";
      } else {
        suggestedAction = "needs_review";
        suggestionReason = "Votes majoritairement en attente - décision manuelle requise";
      }

      return {
        approveCount,
        rejectCount,
        pendingCount,
        totalVotes,
        quorumRequired: mergedConfig.quorumRequired,
        quorumReached,
        votesRemaining,
        calculatedDecision,
        decisionConfidence,
        averageScore,
        scorePassesThreshold,
        suggestedAction,
        suggestionReason,
        finalDecision: (existingDecision?.final_decision as "approved" | "rejected" | "pending") || null,
        decidedBy: existingDecision?.decided_by || null,
        decidedAt: existingDecision?.decided_at || null,
        decisionSource: (existingDecision?.decision_source as "automatic" | "manual" | "override") || null,
        decisionNotes: existingDecision?.decision_notes || null,
      };
    },
    [mergedConfig]
  );

  const fetchVotingData = useCallback(async () => {
    if (!applicationId) return;

    setResult((prev) => ({ ...prev, loading: true, error: null }));

    try {
      // Récupérer les évaluations
      const { data: evaluations, error: evalError } = await supabase
        .from("evaluations")
        .select("recommendation, total_score, is_submitted")
        .eq("application_id", applicationId);

      if (evalError) throw evalError;

      // Récupérer la décision existante
      const { data: existingDecision, error: decisionError } = await supabase
        .from("voting_decisions")
        .select("final_decision, decided_by, decided_at, decision_source, decision_notes")
        .eq("application_id", applicationId)
        .maybeSingle();

      if (decisionError) throw decisionError;

      const votingResult = calculateVotingResult(evaluations || [], existingDecision);

      setResult((prev) => ({
        ...prev,
        ...votingResult,
        loading: false,
      }));
    } catch (error: any) {
      console.error("Error fetching voting data:", error);
      setResult((prev) => ({
        ...prev,
        loading: false,
        error: error.message || "Erreur lors du chargement des données de vote",
      }));
    }
  }, [applicationId, calculateVotingResult]);

  useEffect(() => {
    fetchVotingData();
  }, [fetchVotingData]);

  const applyDecision = async (
    decision: "approved" | "rejected",
    source: "automatic" | "manual" | "override",
    notes?: string
  ): Promise<boolean> => {
    if (!user?.id || !applicationId) return false;

    try {
      // Upsert voting decision
      const { error: voteError } = await supabase.from("voting_decisions").upsert(
        {
          application_id: applicationId,
          quorum_required: mergedConfig.quorumRequired,
          quorum_reached: result.quorumReached,
          approve_count: result.approveCount,
          reject_count: result.rejectCount,
          pending_count: result.pendingCount,
          total_votes: result.totalVotes,
          calculated_decision: result.calculatedDecision,
          decision_confidence: result.decisionConfidence,
          average_score: result.averageScore,
          final_decision: decision,
          decided_by: user.id,
          decided_at: new Date().toISOString(),
          decision_source: source,
          decision_notes: notes || null,
        },
        {
          onConflict: "application_id",
        }
      );

      if (voteError) throw voteError;

      // Mettre à jour le statut de la candidature
      const { error: appError } = await supabase
        .from("applications")
        .update({
          status: decision,
          reviewed_at: new Date().toISOString(),
          reviewer_id: user.id,
          notes: notes || null,
        })
        .eq("id", applicationId);

      if (appError) throw appError;

      // Si approuvé, mettre à jour le statut de la startup
      if (decision === "approved") {
        const { data: appData } = await supabase
          .from("applications")
          .select("startup_id")
          .eq("id", applicationId)
          .single();

        if (appData?.startup_id) {
          await supabase
            .from("startups")
            .update({ status: "labeled" })
            .eq("id", appData.startup_id);
        }
      }

      // Envoyer les notifications
      try {
        await supabase.functions.invoke('notify-voting-decision', {
          body: {
            event_type: 'decision_applied',
            application_id: applicationId,
            decision,
            decision_source: source,
            notes,
          },
        });
      } catch (notifError) {
        console.error("Error sending decision notification:", notifError);
        // Ne pas bloquer en cas d'erreur de notification
      }

      toast({
        title: decision === "approved" ? "Candidature approuvée" : "Candidature rejetée",
        description: `La décision a été appliquée ${source === "automatic" ? "automatiquement" : "manuellement"}.`,
      });

      // Rafraîchir les données
      await fetchVotingData();

      return true;
    } catch (error: any) {
      console.error("Error applying decision:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'appliquer la décision.",
      });
      return false;
    }
  };

  const overrideDecision = async (
    decision: "approved" | "rejected",
    notes: string
  ): Promise<boolean> => {
    return applyDecision(decision, "override", notes);
  };

  return {
    ...result,
    refetch: fetchVotingData,
    applyDecision,
    overrideDecision,
  };
}
