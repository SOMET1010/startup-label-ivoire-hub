import { Card, CardContent } from "@/components/ui/card";
import { FileCheck, Target, Clock, TrendingUp, Users, Star } from "lucide-react";

interface VotingKPICardsProps {
  totalEvaluations: number;
  submittedEvaluations: number;
  averageScore: number;
  approvalRate: number;
  averageDecisionDays: number;
  quorumReachRate: number;
}

export default function VotingKPICards({
  totalEvaluations,
  submittedEvaluations,
  averageScore,
  approvalRate,
  averageDecisionDays,
  quorumReachRate,
}: VotingKPICardsProps) {
  const kpis = [
    {
      title: "Évaluations Soumises",
      value: submittedEvaluations.toString(),
      subtitle: `sur ${totalEvaluations} total`,
      icon: FileCheck,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Score Moyen",
      value: averageScore.toFixed(1),
      subtitle: "sur 100 points",
      icon: Star,
      color: "text-amber-600",
      bgColor: "bg-amber-50",
    },
    {
      title: "Taux d'Approbation",
      value: `${approvalRate}%`,
      subtitle: "des évaluations",
      icon: Target,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Temps de Décision",
      value: `${averageDecisionDays}j`,
      subtitle: "en moyenne",
      icon: Clock,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Quorum Atteint",
      value: `${quorumReachRate}%`,
      subtitle: "des candidatures",
      icon: Users,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
    },
    {
      title: "Taux de Complétion",
      value: totalEvaluations > 0 ? `${Math.round((submittedEvaluations / totalEvaluations) * 100)}%` : "0%",
      subtitle: "évaluations finalisées",
      icon: TrendingUp,
      color: "text-teal-600",
      bgColor: "bg-teal-50",
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
                <p className="text-2xl font-bold mt-1">{kpi.value}</p>
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
