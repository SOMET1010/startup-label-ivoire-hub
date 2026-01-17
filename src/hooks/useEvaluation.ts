import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Evaluation {
  id: string;
  application_id: string;
  evaluator_id: string;
  innovation_score: number | null;
  innovation_comment: string | null;
  business_model_score: number | null;
  business_model_comment: string | null;
  team_score: number | null;
  team_comment: string | null;
  impact_score: number | null;
  impact_comment: string | null;
  total_score: number | null;
  recommendation: string | null;
  general_comment: string | null;
  is_submitted: boolean;
  submitted_at: string | null;
  created_at: string;
  updated_at: string;
}

interface UseEvaluationResult {
  evaluation: Evaluation | null;
  loading: boolean;
  error: string | null;
  saveEvaluation: (data: Partial<Evaluation>, submit?: boolean) => Promise<boolean>;
  refetch: () => Promise<void>;
}

export function useEvaluation(applicationId: string, evaluatorId: string): UseEvaluationResult {
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvaluation = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from("evaluations")
        .select("*")
        .eq("application_id", applicationId)
        .eq("evaluator_id", evaluatorId)
        .maybeSingle();

      if (fetchError) throw fetchError;
      setEvaluation(data);
    } catch (err: any) {
      console.error("Error fetching evaluation:", err);
      setError(err.message || "Erreur lors du chargement de l'évaluation");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (applicationId && evaluatorId) {
      fetchEvaluation();
    }
  }, [applicationId, evaluatorId]);

  const saveEvaluation = async (data: Partial<Evaluation>, submit: boolean = false): Promise<boolean> => {
    try {
      const evaluationData = {
        ...data,
        application_id: applicationId,
        evaluator_id: evaluatorId,
        is_submitted: submit,
        submitted_at: submit ? new Date().toISOString() : null,
      };

      if (evaluation?.id) {
        // Update existing
        const { error: updateError } = await supabase
          .from("evaluations")
          .update(evaluationData)
          .eq("id", evaluation.id);

        if (updateError) throw updateError;
      } else {
        // Create new
        const { error: insertError } = await supabase
          .from("evaluations")
          .insert(evaluationData);

        if (insertError) throw insertError;
      }

      await fetchEvaluation();
      return true;
    } catch (err: any) {
      console.error("Error saving evaluation:", err);
      setError(err.message || "Erreur lors de la sauvegarde");
      return false;
    }
  };

  return {
    evaluation,
    loading,
    error,
    saveEvaluation,
    refetch: fetchEvaluation,
  };
}

export function useEvaluationStats(applicationId: string) {
  const [stats, setStats] = useState<{
    count: number;
    averageScore: number | null;
    recommendations: { approve: number; reject: number; pending: number };
  }>({
    count: 0,
    averageScore: null,
    recommendations: { approve: 0, reject: 0, pending: 0 },
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("evaluations")
          .select("total_score, recommendation, is_submitted")
          .eq("application_id", applicationId)
          .eq("is_submitted", true);

        if (error) throw error;

        const count = data?.length || 0;
        const averageScore = count > 0
          ? data.reduce((sum, e) => sum + (e.total_score || 0), 0) / count
          : null;

        const recommendations = {
          approve: data?.filter(e => e.recommendation === "approve").length || 0,
          reject: data?.filter(e => e.recommendation === "reject").length || 0,
          pending: data?.filter(e => e.recommendation === "pending" || !e.recommendation).length || 0,
        };

        setStats({ count, averageScore, recommendations });
      } catch (err) {
        console.error("Error fetching evaluation stats:", err);
      } finally {
        setLoading(false);
      }
    };

    if (applicationId) {
      fetchStats();
    }
  }, [applicationId]);

  return { stats, loading };
}
