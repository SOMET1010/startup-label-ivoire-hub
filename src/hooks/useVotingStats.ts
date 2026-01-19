import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface MonthlyVoteData {
  month: string;
  submitted: number;
  quorumReached: number;
  approved: number;
  rejected: number;
}

export interface DecisionDistribution {
  name: string;
  value: number;
  color: string;
}

export interface DecisionTimeTrend {
  month: string;
  avgDays: number;
}

export interface EvaluatorPerformance {
  evaluatorId: string;
  evaluatorName: string;
  evaluationsCount: number;
  avgScore: number;
  approveRate: number;
}

export interface VotingStats {
  // KPIs
  totalEvaluations: number;
  submittedEvaluations: number;
  averageScore: number;
  approvalRate: number;
  rejectionRate: number;
  averageDecisionDays: number;
  quorumReachRate: number;
  
  // Chart data
  monthlyVotes: MonthlyVoteData[];
  decisionDistribution: DecisionDistribution[];
  decisionTimeTrend: DecisionTimeTrend[];
  evaluatorPerformance: EvaluatorPerformance[];
  
  // Loading states
  isLoading: boolean;
  error: string | null;
}

export function useVotingStats() {
  const [stats, setStats] = useState<VotingStats>({
    totalEvaluations: 0,
    submittedEvaluations: 0,
    averageScore: 0,
    approvalRate: 0,
    rejectionRate: 0,
    averageDecisionDays: 0,
    quorumReachRate: 0,
    monthlyVotes: [],
    decisionDistribution: [],
    decisionTimeTrend: [],
    evaluatorPerformance: [],
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    if (!supabase) {
      setStats(prev => ({ ...prev, isLoading: false, error: "Supabase non configuré" }));
      return;
    }

    try {
      // Fetch all evaluations
      const { data: evaluations, error: evalError } = await supabase
        .from("evaluations")
        .select("*");
      
      if (evalError) throw evalError;

      // Fetch voting decisions
      const { data: votingDecisions, error: vdError } = await supabase
        .from("voting_decisions")
        .select("*");
      
      if (vdError) throw vdError;

      // Fetch applications for decision time calculation
      const { data: applications, error: appsError } = await supabase
        .from("applications")
        .select("id, submitted_at, status");
      
      if (appsError) throw appsError;

      // Fetch evaluator profiles
      const evaluatorIds = [...new Set(evaluations?.map(e => e.evaluator_id) || [])];
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, full_name")
        .in("user_id", evaluatorIds);

      // Calculate KPIs
      const submittedEvals = evaluations?.filter(e => e.is_submitted) || [];
      const totalEvaluations = evaluations?.length || 0;
      const submittedEvaluations = submittedEvals.length;
      
      const avgScore = submittedEvals.length > 0
        ? submittedEvals.reduce((sum, e) => sum + (e.total_score || 0), 0) / submittedEvals.length
        : 0;
      
      const approveCount = submittedEvals.filter(e => e.recommendation === "approve").length;
      const rejectCount = submittedEvals.filter(e => e.recommendation === "reject").length;
      const approvalRate = submittedEvals.length > 0 ? (approveCount / submittedEvals.length) * 100 : 0;
      const rejectionRate = submittedEvals.length > 0 ? (rejectCount / submittedEvals.length) * 100 : 0;

      // Quorum reach rate
      const quorumReached = votingDecisions?.filter(v => v.quorum_reached).length || 0;
      const totalVotingDecisions = votingDecisions?.length || 0;
      const quorumReachRate = totalVotingDecisions > 0 ? (quorumReached / totalVotingDecisions) * 100 : 0;

      // Average decision time (in days)
      const decisionsWithTime = votingDecisions?.filter(v => v.decided_at && v.final_decision) || [];
      let avgDecisionDays = 0;
      if (decisionsWithTime.length > 0) {
        const times = decisionsWithTime.map(vd => {
          const app = applications?.find(a => a.id === vd.application_id);
          if (app?.submitted_at && vd.decided_at) {
            const submitted = new Date(app.submitted_at);
            const decided = new Date(vd.decided_at);
            return (decided.getTime() - submitted.getTime()) / (1000 * 60 * 60 * 24);
          }
          return null;
        }).filter(Boolean) as number[];
        
        if (times.length > 0) {
          avgDecisionDays = times.reduce((a, b) => a + b, 0) / times.length;
        }
      }

      // Monthly votes data (last 12 months)
      const monthlyVotes = calculateMonthlyVotes(submittedEvals, votingDecisions || []);

      // Decision distribution
      const approvedApps = applications?.filter(a => a.status === "approved").length || 0;
      const rejectedApps = applications?.filter(a => a.status === "rejected").length || 0;
      const pendingApps = applications?.filter(a => a.status !== "approved" && a.status !== "rejected").length || 0;
      
      const decisionDistribution: DecisionDistribution[] = [
        { name: "Approuvées", value: approvedApps, color: "hsl(var(--chart-2))" },
        { name: "Rejetées", value: rejectedApps, color: "hsl(var(--chart-1))" },
        { name: "En attente", value: pendingApps, color: "hsl(var(--chart-4))" },
      ].filter(d => d.value > 0);

      // Decision time trend (monthly)
      const decisionTimeTrend = calculateDecisionTimeTrend(votingDecisions || [], applications || []);

      // Evaluator performance
      const evaluatorPerformance = calculateEvaluatorPerformance(submittedEvals, profiles || []);

      setStats({
        totalEvaluations,
        submittedEvaluations,
        averageScore: Math.round(avgScore * 10) / 10,
        approvalRate: Math.round(approvalRate * 10) / 10,
        rejectionRate: Math.round(rejectionRate * 10) / 10,
        averageDecisionDays: Math.round(avgDecisionDays * 10) / 10,
        quorumReachRate: Math.round(quorumReachRate * 10) / 10,
        monthlyVotes,
        decisionDistribution,
        decisionTimeTrend,
        evaluatorPerformance,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      console.error("Error fetching voting stats:", error);
      setStats(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: error instanceof Error ? error.message : "Erreur lors du chargement des statistiques" 
      }));
    }
  };

  return { ...stats, refetch: fetchStats };
}

function calculateMonthlyVotes(
  evaluations: any[], 
  votingDecisions: any[]
): MonthlyVoteData[] {
  const months: Record<string, MonthlyVoteData> = {};
  const now = new Date();
  
  // Initialize last 6 months
  for (let i = 5; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    const monthName = date.toLocaleDateString('fr-FR', { month: 'short' });
    months[key] = {
      month: monthName,
      submitted: 0,
      quorumReached: 0,
      approved: 0,
      rejected: 0,
    };
  }

  // Count submitted evaluations per month
  evaluations.forEach(e => {
    if (e.submitted_at) {
      const date = new Date(e.submitted_at);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      if (months[key]) {
        months[key].submitted++;
        if (e.recommendation === "approve") months[key].approved++;
        if (e.recommendation === "reject") months[key].rejected++;
      }
    }
  });

  // Count quorum reached per month
  votingDecisions.forEach(vd => {
    if (vd.quorum_reached && vd.updated_at) {
      const date = new Date(vd.updated_at);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      if (months[key]) {
        months[key].quorumReached++;
      }
    }
  });

  return Object.values(months);
}

function calculateDecisionTimeTrend(
  votingDecisions: any[],
  applications: any[]
): DecisionTimeTrend[] {
  const months: Record<string, { total: number; count: number }> = {};
  const now = new Date();
  
  // Initialize last 6 months
  for (let i = 5; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    const monthName = date.toLocaleDateString('fr-FR', { month: 'short' });
    months[key] = { total: 0, count: 0 };
  }

  votingDecisions.forEach(vd => {
    if (vd.decided_at && vd.final_decision) {
      const app = applications.find(a => a.id === vd.application_id);
      if (app?.submitted_at) {
        const submitted = new Date(app.submitted_at);
        const decided = new Date(vd.decided_at);
        const days = (decided.getTime() - submitted.getTime()) / (1000 * 60 * 60 * 24);
        
        const key = `${decided.getFullYear()}-${String(decided.getMonth() + 1).padStart(2, '0')}`;
        if (months[key]) {
          months[key].total += days;
          months[key].count++;
        }
      }
    }
  });

  const now2 = new Date();
  return Object.entries(months).map(([key, data]) => {
    const [year, month] = key.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1, 1);
    return {
      month: date.toLocaleDateString('fr-FR', { month: 'short' }),
      avgDays: data.count > 0 ? Math.round((data.total / data.count) * 10) / 10 : 0,
    };
  });
}

function calculateEvaluatorPerformance(
  evaluations: any[],
  profiles: any[]
): EvaluatorPerformance[] {
  const performanceMap: Record<string, {
    count: number;
    totalScore: number;
    approves: number;
  }> = {};

  evaluations.forEach(e => {
    if (!performanceMap[e.evaluator_id]) {
      performanceMap[e.evaluator_id] = { count: 0, totalScore: 0, approves: 0 };
    }
    performanceMap[e.evaluator_id].count++;
    performanceMap[e.evaluator_id].totalScore += e.total_score || 0;
    if (e.recommendation === "approve") {
      performanceMap[e.evaluator_id].approves++;
    }
  });

  return Object.entries(performanceMap)
    .map(([evaluatorId, data]) => {
      const profile = profiles.find(p => p.user_id === evaluatorId);
      return {
        evaluatorId,
        evaluatorName: profile?.full_name || "Évaluateur inconnu",
        evaluationsCount: data.count,
        avgScore: Math.round((data.totalScore / data.count) * 10) / 10,
        approveRate: Math.round((data.approves / data.count) * 100),
      };
    })
    .sort((a, b) => b.evaluationsCount - a.evaluationsCount)
    .slice(0, 5);
}
