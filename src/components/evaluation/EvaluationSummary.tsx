import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CheckCircle, Clock, XCircle, User } from "lucide-react";

interface Evaluation {
  id: string;
  evaluator_id: string;
  evaluator_name?: string;
  innovation_score: number | null;
  business_model_score: number | null;
  team_score: number | null;
  impact_score: number | null;
  total_score: number | null;
  recommendation: string | null;
  general_comment: string | null;
  is_submitted: boolean;
  submitted_at: string | null;
}

interface EvaluationSummaryProps {
  evaluations: Evaluation[];
  startupName: string;
}

const getScoreColor = (score: number) => {
  if (score >= 80) return "text-green-600";
  if (score >= 60) return "text-yellow-600";
  if (score >= 40) return "text-orange-500";
  return "text-red-500";
};

const getScoreBgColor = (score: number) => {
  if (score >= 80) return "bg-green-500";
  if (score >= 60) return "bg-yellow-500";
  if (score >= 40) return "bg-orange-500";
  return "bg-red-500";
};

const getRecommendationBadge = (recommendation: string | null) => {
  switch (recommendation) {
    case "approve":
      return <Badge className="bg-green-500"><CheckCircle className="h-3 w-3 mr-1" />Approuver</Badge>;
    case "reject":
      return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Rejeter</Badge>;
    default:
      return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />En attente</Badge>;
  }
};

export default function EvaluationSummary({ evaluations, startupName }: EvaluationSummaryProps) {
  const submittedEvaluations = evaluations.filter(e => e.is_submitted);
  
  if (submittedEvaluations.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          Aucune évaluation soumise pour cette candidature.
        </CardContent>
      </Card>
    );
  }

  // Calculate averages
  const avgInnovation = submittedEvaluations.reduce((sum, e) => sum + (e.innovation_score || 0), 0) / submittedEvaluations.length;
  const avgBusinessModel = submittedEvaluations.reduce((sum, e) => sum + (e.business_model_score || 0), 0) / submittedEvaluations.length;
  const avgTeam = submittedEvaluations.reduce((sum, e) => sum + (e.team_score || 0), 0) / submittedEvaluations.length;
  const avgImpact = submittedEvaluations.reduce((sum, e) => sum + (e.impact_score || 0), 0) / submittedEvaluations.length;
  const avgTotal = submittedEvaluations.reduce((sum, e) => sum + (e.total_score || 0), 0) / submittedEvaluations.length;

  // Count recommendations
  const approveCount = submittedEvaluations.filter(e => e.recommendation === "approve").length;
  const rejectCount = submittedEvaluations.filter(e => e.recommendation === "reject").length;
  const pendingCount = submittedEvaluations.filter(e => e.recommendation === "pending" || !e.recommendation).length;

  return (
    <div className="space-y-6">
      {/* Summary Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Synthèse des évaluations - {startupName}</span>
            <span className={cn("text-2xl", getScoreColor(avgTotal))}>
              {avgTotal.toFixed(1)}/100
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Average Scores by Criteria */}
          <div className="grid gap-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Innovation (25%)</span>
                <span className="font-medium">{avgInnovation.toFixed(1)}/20</span>
              </div>
              <Progress value={(avgInnovation / 20) * 100} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Modèle économique (25%)</span>
                <span className="font-medium">{avgBusinessModel.toFixed(1)}/20</span>
              </div>
              <Progress value={(avgBusinessModel / 20) * 100} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Équipe (25%)</span>
                <span className="font-medium">{avgTeam.toFixed(1)}/20</span>
              </div>
              <Progress value={(avgTeam / 20) * 100} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Impact (25%)</span>
                <span className="font-medium">{avgImpact.toFixed(1)}/20</span>
              </div>
              <Progress value={(avgImpact / 20) * 100} className="h-2" />
            </div>
          </div>

          <Separator />

          {/* Recommendations Summary */}
          <div>
            <h4 className="font-medium mb-3">Recommandations ({submittedEvaluations.length} évaluateur{submittedEvaluations.length > 1 ? 's' : ''})</h4>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center font-bold">
                  {approveCount}
                </div>
                <span className="text-sm">Approuver</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold">
                  {rejectCount}
                </div>
                <span className="text-sm">Rejeter</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center font-bold">
                  {pendingCount}
                </div>
                <span className="text-sm">En attente</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Individual Evaluations */}
      <div className="space-y-4">
        <h4 className="font-semibold">Détail par évaluateur</h4>
        {submittedEvaluations.map((evaluation) => (
          <Card key={evaluation.id}>
            <CardContent className="py-4">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                    <User className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium">{evaluation.evaluator_name || "Évaluateur"}</p>
                    {evaluation.submitted_at && (
                      <p className="text-xs text-muted-foreground">
                        Soumis le {format(new Date(evaluation.submitted_at), "dd MMM yyyy 'à' HH:mm", { locale: fr })}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {getRecommendationBadge(evaluation.recommendation)}
                  <span className={cn("text-lg font-bold", getScoreColor(evaluation.total_score || 0))}>
                    {evaluation.total_score?.toFixed(1)}/100
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4 text-center text-sm mb-4">
                <div>
                  <div className="font-medium">{evaluation.innovation_score}/20</div>
                  <div className="text-xs text-muted-foreground">Innovation</div>
                </div>
                <div>
                  <div className="font-medium">{evaluation.business_model_score}/20</div>
                  <div className="text-xs text-muted-foreground">Modèle éco.</div>
                </div>
                <div>
                  <div className="font-medium">{evaluation.team_score}/20</div>
                  <div className="text-xs text-muted-foreground">Équipe</div>
                </div>
                <div>
                  <div className="font-medium">{evaluation.impact_score}/20</div>
                  <div className="text-xs text-muted-foreground">Impact</div>
                </div>
              </div>

              {evaluation.general_comment && (
                <div className="bg-muted/50 p-3 rounded-lg">
                  <p className="text-sm text-muted-foreground italic">"{evaluation.general_comment}"</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
