import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { TimePeriod, getStartDate, getMonthsToShow } from "@/components/admin/PeriodSelector";

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

export interface KPITrend {
  current: number;
  previous: number;
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
  
  // Trends (current vs previous period)
  trends: {
    submittedEvaluations: KPITrend;
    averageScore: KPITrend;
    approvalRate: KPITrend;
    averageDecisionDays: KPITrend;
    quorumReachRate: KPITrend;
    completionRate: KPITrend;
  };
  
  // Chart data
  monthlyVotes: MonthlyVoteData[];
  decisionDistribution: DecisionDistribution[];
  decisionTimeTrend: DecisionTimeTrend[];
  evaluatorPerformance: EvaluatorPerformance[];
  
  // Loading states
  isLoading: boolean;
  error: string | null;
}

// Helper to filter data by date
function filterByDate<T>(items: T[], dateField: keyof T, startDate: Date | null): T[] {
  if (!startDate) return items;
  return items.filter(item => {
    const dateValue = item[dateField];
    if (!dateValue) return false;
    const date = new Date(dateValue as string);
    return date >= startDate;
  });
}

export function useVotingStats(period: TimePeriod = '90d') {
  const defaultTrend: KPITrend = { current: 0, previous: 0 };
  const [stats, setStats] = useState<VotingStats>({
    totalEvaluations: 0,
    submittedEvaluations: 0,
    averageScore: 0,
    approvalRate: 0,
    rejectionRate: 0,
    averageDecisionDays: 0,
    quorumReachRate: 0,
    trends: {
      submittedEvaluations: defaultTrend,
      averageScore: defaultTrend,
      approvalRate: defaultTrend,
      averageDecisionDays: defaultTrend,
      quorumReachRate: defaultTrend,
      completionRate: defaultTrend,
    },
    monthlyVotes: [],
    decisionDistribution: [],
    decisionTimeTrend: [],
    evaluatorPerformance: [],
    isLoading: true,
    error: null,
  });

  const startDate = getStartDate(period);
  const monthsToShow = getMonthsToShow(period);

  // Calculate the previous period start date for trend comparison
  const getPreviousPeriodStartDate = (): Date | null => {
    if (!startDate) return null;
    const periodMs = Date.now() - startDate.getTime();
    return new Date(startDate.getTime() - periodMs);
  };
  const previousPeriodStartDate = getPreviousPeriodStartDate();

  useEffect(() => {
    fetchStats();
  }, [period]);

  const fetchStats = async () => {
    if (!supabase) {
      setStats(prev => ({ ...prev, isLoading: false, error: "Supabase non configuré" }));
      return;
    }

    try {
      // Fetch all evaluations
      const { data: allEvaluations, error: evalError } = await supabase
        .from("evaluations")
        .select("*");
      
      if (evalError) throw evalError;

      // Fetch voting decisions
      const { data: allVotingDecisions, error: vdError } = await supabase
        .from("voting_decisions")
        .select("*");
      
      if (vdError) throw vdError;

      // Fetch applications for decision time calculation
      const { data: allApplications, error: appsError } = await supabase
        .from("applications")
        .select("id, submitted_at, status");
      
      if (appsError) throw appsError;

      // Filter data by current period
      const evaluations = filterByDate(allEvaluations || [], 'created_at', startDate);
      const votingDecisions = filterByDate(allVotingDecisions || [], 'created_at', startDate);
      const applications = filterByDate(allApplications || [], 'submitted_at', startDate);

      // Filter data by previous period (for trends)
      const prevEvaluations = previousPeriodStartDate
        ? filterByDate(allEvaluations || [], 'created_at', previousPeriodStartDate).filter(e => {
            if (!startDate) return true;
            const d = new Date(e.created_at);
            return d < startDate;
          })
        : [];
      const prevVotingDecisions = previousPeriodStartDate
        ? filterByDate(allVotingDecisions || [], 'created_at', previousPeriodStartDate).filter(v => {
            if (!startDate) return true;
            const d = new Date(v.created_at);
            return d < startDate;
          })
        : [];

      // Fetch evaluator profiles
      const evaluatorIds = [...new Set(evaluations?.map(e => e.evaluator_id) || [])];
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, full_name")
        .in("user_id", evaluatorIds);

      // === Current period KPIs ===
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

      // Completion rate
      const completionRate = totalEvaluations > 0 ? (submittedEvaluations / totalEvaluations) * 100 : 0;

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

      // === Previous period KPIs (for trends) ===
      const prevSubmittedEvals = prevEvaluations.filter(e => e.is_submitted);
      const prevTotalEvaluations = prevEvaluations.length;
      const prevSubmittedEvaluations = prevSubmittedEvals.length;
      const prevAvgScore = prevSubmittedEvals.length > 0
        ? prevSubmittedEvals.reduce((sum, e) => sum + (e.total_score || 0), 0) / prevSubmittedEvals.length
        : 0;
      const prevApproveCount = prevSubmittedEvals.filter(e => e.recommendation === "approve").length;
      const prevApprovalRate = prevSubmittedEvals.length > 0 ? (prevApproveCount / prevSubmittedEvals.length) * 100 : 0;
      const prevQuorumReached = prevVotingDecisions.filter(v => v.quorum_reached).length;
      const prevTotalVD = prevVotingDecisions.length;
      const prevQuorumReachRate = prevTotalVD > 0 ? (prevQuorumReached / prevTotalVD) * 100 : 0;
      const prevCompletionRate = prevTotalEvaluations > 0 ? (prevSubmittedEvaluations / prevTotalEvaluations) * 100 : 0;
      
      // Previous average decision days
      const prevDecisionsWithTime = prevVotingDecisions.filter(v => v.decided_at && v.final_decision);
      let prevAvgDecisionDays = 0;
      if (prevDecisionsWithTime.length > 0) {
        const prevTimes = prevDecisionsWithTime.map(vd => {
          const app = (allApplications || []).find(a => a.id === vd.application_id);
          if (app?.submitted_at && vd.decided_at) {
            const submitted = new Date(app.submitted_at);
            const decided = new Date(vd.decided_at);
            return (decided.getTime() - submitted.getTime()) / (1000 * 60 * 60 * 24);
          }
          return null;
        }).filter(Boolean) as number[];
        if (prevTimes.length > 0) {
          prevAvgDecisionDays = prevTimes.reduce((a, b) => a + b, 0) / prevTimes.length;
        }
      }

      // Monthly votes data
      const monthlyVotes = calculateMonthlyVotes(submittedEvals, votingDecisions || [], monthsToShow);

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
      const decisionTimeTrend = calculateDecisionTimeTrend(votingDecisions || [], applications || [], monthsToShow);

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
        trends: {
          submittedEvaluations: { current: submittedEvaluations, previous: prevSubmittedEvaluations },
          averageScore: { current: Math.round(avgScore * 10) / 10, previous: Math.round(prevAvgScore * 10) / 10 },
          approvalRate: { current: Math.round(approvalRate * 10) / 10, previous: Math.round(prevApprovalRate * 10) / 10 },
          averageDecisionDays: { current: Math.round(avgDecisionDays * 10) / 10, previous: Math.round(prevAvgDecisionDays * 10) / 10 },
          quorumReachRate: { current: Math.round(quorumReachRate * 10) / 10, previous: Math.round(prevQuorumReachRate * 10) / 10 },
          completionRate: { current: Math.round(completionRate * 10) / 10, previous: Math.round(prevCompletionRate * 10) / 10 },
        },
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
  votingDecisions: any[],
  monthsToShow: number
): MonthlyVoteData[] {
  const months: Record<string, MonthlyVoteData> = {};
  const now = new Date();
  
  // Initialize months based on period
  for (let i = monthsToShow - 1; i >= 0; i--) {
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
  applications: any[],
  monthsToShow: number
): DecisionTimeTrend[] {
  const months: Record<string, { total: number; count: number }> = {};
  const now = new Date();
  
  // Initialize months based on period
  for (let i = monthsToShow - 1; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
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
