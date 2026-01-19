import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, RefreshCw, TrendingUp, Clock, BarChart3, PieChart as PieIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useVotingStats } from "@/hooks/useVotingStats";
import { PeriodSelector, TimePeriod, TIME_PERIOD_OPTIONS } from "./PeriodSelector";
import VotingKPICards from "./VotingKPICards";
import VotesEvolutionChart from "./charts/VotesEvolutionChart";
import DecisionDistributionChart from "./charts/DecisionDistributionChart";
import DecisionTimeChart from "./charts/DecisionTimeChart";
import EvaluatorPerformanceChart from "./charts/EvaluatorPerformanceChart";

export default function VotingStatsDashboard() {
  const [period, setPeriod] = useState<TimePeriod>('90d');
  const stats = useVotingStats(period);

  const periodLabel = TIME_PERIOD_OPTIONS.find(o => o.value === period)?.label || '';

  if (stats.isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (stats.error) {
    return (
      <Card>
        <CardContent className="py-8">
          <p className="text-center text-destructive">{stats.error}</p>
          <div className="flex justify-center mt-4">
            <Button variant="outline" onClick={stats.refetch}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Réessayer
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with period filter and refresh */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Statistiques de Vote</h2>
          <p className="text-muted-foreground">
            Analyse des évaluations et décisions — <span className="font-medium text-foreground">{periodLabel}</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <PeriodSelector value={period} onChange={setPeriod} />
          <Button variant="outline" size="sm" onClick={stats.refetch}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualiser
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <VotingKPICards
        totalEvaluations={stats.totalEvaluations}
        submittedEvaluations={stats.submittedEvaluations}
        averageScore={stats.averageScore}
        approvalRate={stats.approvalRate}
        averageDecisionDays={stats.averageDecisionDays}
        quorumReachRate={stats.quorumReachRate}
      />

      {/* Charts Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Evolution des votes */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              Évolution des Votes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <VotesEvolutionChart data={stats.monthlyVotes} />
          </CardContent>
        </Card>

        {/* Répartition des décisions */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <PieIcon className="h-4 w-4 text-primary" />
              Répartition des Décisions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <DecisionDistributionChart data={stats.decisionDistribution} />
          </CardContent>
        </Card>

        {/* Temps de décision */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              Temps de Décision (jours)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <DecisionTimeChart data={stats.decisionTimeTrend} />
          </CardContent>
        </Card>

        {/* Performance des évaluateurs */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-primary" />
              Performance des Évaluateurs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <EvaluatorPerformanceChart data={stats.evaluatorPerformance} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
