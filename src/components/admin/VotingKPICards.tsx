import { Card, CardContent } from "@/components/ui/card";
import { FileCheck, Target, Clock, TrendingUp, TrendingDown, Users, Star, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import type { KPITrend } from "@/hooks/useVotingStats";

interface VotingKPICardsProps {
  totalEvaluations: number;
  submittedEvaluations: number;
  averageScore: number;
  approvalRate: number;
  averageDecisionDays: number;
  quorumReachRate: number;
  trends?: {
    submittedEvaluations: KPITrend;
    averageScore: KPITrend;
    approvalRate: KPITrend;
    averageDecisionDays: KPITrend;
    quorumReachRate: KPITrend;
    completionRate: KPITrend;
  };
}

function TrendBadge({ trend, invertColor = false }: { trend?: KPITrend; invertColor?: boolean }) {
  if (!trend || (trend.current === 0 && trend.previous === 0)) return null;

  const change = trend.previous === 0
    ? (trend.current > 0 ? 100 : 0)
    : Math.round(((trend.current - trend.previous) / trend.previous) * 100);

  if (change === 0) {
    return (
      <span className="inline-flex items-center gap-0.5 text-[10px] text-muted-foreground ml-1">
        <Minus className="h-2.5 w-2.5" /> 0%
      </span>
    );
  }

  const isPositive = change > 0;
  const isGood = invertColor ? !isPositive : isPositive;

  return (
    <span className={cn(
      'inline-flex items-center gap-0.5 text-[10px] font-semibold ml-1',
      isGood ? 'text-green-600' : 'text-red-600'
    )}>
      {isPositive ? <TrendingUp className="h-2.5 w-2.5" /> : <TrendingDown className="h-2.5 w-2.5" />}
      {isPositive ? '+' : ''}{change}%
    </span>
  );
}

export default function VotingKPICards({
  totalEvaluations,
  submittedEvaluations,
  averageScore,
  approvalRate,
  averageDecisionDays,
  quorumReachRate,
  trends,
}: VotingKPICardsProps) {
  const kpis = [
    {
      title: "Évaluations Soumises",
      value: submittedEvaluations.toString(),
      subtitle: `sur ${totalEvaluations} total`,
      icon: FileCheck,
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-950/30",
      trend: trends?.submittedEvaluations,
    },
    {
      title: "Score Moyen",
      value: averageScore.toFixed(1),
      subtitle: "sur 100 points",
      icon: Star,
      color: "text-amber-600",
      bgColor: "bg-amber-50 dark:bg-amber-950/30",
      trend: trends?.averageScore,
    },
    {
      title: "Taux d'Approbation",
      value: `${approvalRate}%`,
      subtitle: "des évaluations",
      icon: Target,
      color: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-950/30",
      trend: trends?.approvalRate,
    },
    {
      title: "Temps de Décision",
      value: `${averageDecisionDays}j`,
      subtitle: "en moyenne",
      icon: Clock,
      color: "text-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-950/30",
      trend: trends?.averageDecisionDays,
      invertTrend: true,
    },
    {
      title: "Quorum Atteint",
      value: `${quorumReachRate}%`,
      subtitle: "des candidatures",
      icon: Users,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50 dark:bg-indigo-950/30",
      trend: trends?.quorumReachRate,
    },
    {
      title: "Taux de Complétion",
      value: totalEvaluations > 0 ? `${Math.round((submittedEvaluations / totalEvaluations) * 100)}%` : "0%",
      subtitle: "évaluations finalisées",
      icon: TrendingUp,
      color: "text-teal-600",
      bgColor: "bg-teal-50 dark:bg-teal-950/30",
      trend: trends?.completionRate,
    },
  ];

  return (
    <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
      {kpis.map((kpi) => (
        <Card key={kpi.title}>
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-muted-foreground truncate">
                  {kpi.title}
                </p>
                <div className="flex items-center mt-1">
                  <p className="text-2xl font-bold">{kpi.value}</p>
                  <TrendBadge trend={kpi.trend} invertColor={kpi.invertTrend} />
                </div>
                <p className="text-xs text-muted-foreground mt-1 truncate">
                  {kpi.subtitle}
                </p>
              </div>
              <div className={`${kpi.bgColor} p-2 rounded-lg shrink-0`}>
                <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
