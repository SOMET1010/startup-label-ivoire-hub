import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Lightbulb, 
  TrendingUp, 
  Users, 
  Target, 
  Save, 
  Send, 
  Loader2,
  AlertCircle,
  CheckCircle
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import EvaluationCriteria from "./EvaluationCriteria";
import { cn } from "@/lib/utils";

interface Startup {
  id: string;
  name: string;
  sector: string | null;
  stage: string | null;
}

interface EvaluationFormProps {
  applicationId: string;
  startup: Startup;
  evaluatorId: string;
  evaluatorName?: string;
  existingEvaluation?: Evaluation | null;
  onSaved?: () => void;
  onClose?: () => void;
}

interface Evaluation {
  id: string;
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
}

const getScoreColor = (score: number) => {
  if (score >= 80) return "text-green-600 bg-green-50";
  if (score >= 60) return "text-yellow-600 bg-yellow-50";
  if (score >= 40) return "text-orange-500 bg-orange-50";
  return "text-red-500 bg-red-50";
};

export default function EvaluationForm({
  applicationId,
  startup,
  evaluatorId,
  evaluatorName,
  existingEvaluation,
  onSaved,
  onClose,
}: EvaluationFormProps) {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Scores state
  const [innovationScore, setInnovationScore] = useState(existingEvaluation?.innovation_score ?? 10);
  const [innovationComment, setInnovationComment] = useState(existingEvaluation?.innovation_comment ?? "");
  const [businessModelScore, setBusinessModelScore] = useState(existingEvaluation?.business_model_score ?? 10);
  const [businessModelComment, setBusinessModelComment] = useState(existingEvaluation?.business_model_comment ?? "");
  const [teamScore, setTeamScore] = useState(existingEvaluation?.team_score ?? 10);
  const [teamComment, setTeamComment] = useState(existingEvaluation?.team_comment ?? "");
  const [impactScore, setImpactScore] = useState(existingEvaluation?.impact_score ?? 10);
  const [impactComment, setImpactComment] = useState(existingEvaluation?.impact_comment ?? "");
  
  const [recommendation, setRecommendation] = useState<string>(existingEvaluation?.recommendation ?? "pending");
  const [generalComment, setGeneralComment] = useState(existingEvaluation?.general_comment ?? "");

  const isSubmitted = existingEvaluation?.is_submitted ?? false;

  // Calculate total score (each criterion is 25%, so sum * 1.25 = score on 100)
  const totalScore = (innovationScore + businessModelScore + teamScore + impactScore) * 1.25;

  const handleSave = async (submit: boolean = false) => {
    setSaving(true);
    try {
      const evaluationData = {
        application_id: applicationId,
        evaluator_id: evaluatorId,
        innovation_score: innovationScore,
        innovation_comment: innovationComment || null,
        business_model_score: businessModelScore,
        business_model_comment: businessModelComment || null,
        team_score: teamScore,
        team_comment: teamComment || null,
        impact_score: impactScore,
        impact_comment: impactComment || null,
        recommendation,
        general_comment: generalComment || null,
        is_submitted: submit,
        submitted_at: submit ? new Date().toISOString() : null,
      };

      if (existingEvaluation?.id) {
        // Update existing evaluation
        const { error } = await supabase
          .from("evaluations")
          .update(evaluationData)
          .eq("id", existingEvaluation.id);

        if (error) throw error;
      } else {
        // Create new evaluation
        const { error } = await supabase
          .from("evaluations")
          .insert(evaluationData);

        if (error) throw error;
      }

      toast({
        title: submit ? "Évaluation soumise" : "Brouillon enregistré",
        description: submit 
          ? "Votre évaluation a été soumise avec succès." 
          : "Votre brouillon a été sauvegardé.",
      });

      onSaved?.();
    } catch (error: any) {
      console.error("Error saving evaluation:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de sauvegarder l'évaluation.",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold">Grille d'évaluation</h2>
          <p className="text-muted-foreground">
            Startup : <span className="font-medium text-foreground">{startup.name}</span>
          </p>
          {evaluatorName && (
            <p className="text-sm text-muted-foreground">
              Évaluateur : {evaluatorName}
            </p>
          )}
        </div>
        <div className={cn("px-4 py-2 rounded-lg", getScoreColor(totalScore))}>
          <div className="text-2xl font-bold">{totalScore.toFixed(1)}/100</div>
          <div className="text-xs">Score total</div>
        </div>
      </div>

      {isSubmitted && (
        <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700">
          <CheckCircle className="h-5 w-5" />
          <span>Cette évaluation a été soumise et ne peut plus être modifiée.</span>
        </div>
      )}

      {/* Criteria */}
      <div className="grid gap-4">
        <EvaluationCriteria
          label="Innovation"
          description="Originalité de la solution, différenciation technologique, propriété intellectuelle"
          weight="25%"
          score={innovationScore}
          comment={innovationComment}
          onScoreChange={setInnovationScore}
          onCommentChange={setInnovationComment}
          disabled={isSubmitted}
          icon={<Lightbulb className="h-5 w-5" />}
        />

        <EvaluationCriteria
          label="Modèle économique"
          description="Viabilité financière, scalabilité, sources de revenus, marché cible"
          weight="25%"
          score={businessModelScore}
          comment={businessModelComment}
          onScoreChange={setBusinessModelScore}
          onCommentChange={setBusinessModelComment}
          disabled={isSubmitted}
          icon={<TrendingUp className="h-5 w-5" />}
        />

        <EvaluationCriteria
          label="Équipe"
          description="Compétences, expérience, complémentarité, engagement"
          weight="25%"
          score={teamScore}
          comment={teamComment}
          onScoreChange={setTeamScore}
          onCommentChange={setTeamComment}
          disabled={isSubmitted}
          icon={<Users className="h-5 w-5" />}
        />

        <EvaluationCriteria
          label="Impact"
          description="Impact social/environnemental, création d'emplois, contribution à l'écosystème"
          weight="25%"
          score={impactScore}
          comment={impactComment}
          onScoreChange={setImpactScore}
          onCommentChange={setImpactComment}
          disabled={isSubmitted}
          icon={<Target className="h-5 w-5" />}
        />
      </div>

      <Separator />

      {/* Recommendation */}
      <div className="space-y-4">
        <Label className="text-base font-semibold">Recommandation</Label>
        <RadioGroup
          value={recommendation}
          onValueChange={setRecommendation}
          disabled={isSubmitted}
          className="flex flex-wrap gap-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="approve" id="approve" />
            <Label htmlFor="approve" className="flex items-center gap-1 cursor-pointer">
              <Badge className="bg-green-500">Approuver</Badge>
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="reject" id="reject" />
            <Label htmlFor="reject" className="flex items-center gap-1 cursor-pointer">
              <Badge variant="destructive">Rejeter</Badge>
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="pending" id="pending" />
            <Label htmlFor="pending" className="flex items-center gap-1 cursor-pointer">
              <Badge variant="secondary">En attente</Badge>
            </Label>
          </div>
        </RadioGroup>
      </div>

      {/* General Comment */}
      <div className="space-y-2">
        <Label htmlFor="general-comment" className="text-base font-semibold">
          Commentaire général
        </Label>
        <Textarea
          id="general-comment"
          placeholder="Résumez votre évaluation et vos recommandations..."
          value={generalComment}
          onChange={(e) => setGeneralComment(e.target.value)}
          disabled={isSubmitted}
          rows={4}
        />
      </div>

      {/* Score Summary */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Récapitulatif des scores</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-lg font-bold">{innovationScore}/20</div>
              <div className="text-xs text-muted-foreground">Innovation</div>
            </div>
            <div>
              <div className="text-lg font-bold">{businessModelScore}/20</div>
              <div className="text-xs text-muted-foreground">Modèle éco.</div>
            </div>
            <div>
              <div className="text-lg font-bold">{teamScore}/20</div>
              <div className="text-xs text-muted-foreground">Équipe</div>
            </div>
            <div>
              <div className="text-lg font-bold">{impactScore}/20</div>
              <div className="text-xs text-muted-foreground">Impact</div>
            </div>
          </div>
          <Separator className="my-4" />
          <div className="flex items-center justify-between">
            <span className="font-medium">Score total</span>
            <span className={cn("text-xl font-bold px-3 py-1 rounded", getScoreColor(totalScore))}>
              {totalScore.toFixed(1)}/100
            </span>
          </div>
          <div className="mt-2 text-xs text-muted-foreground text-center">
            Seuil de validation recommandé : ≥ 60/100
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      {!isSubmitted && (
        <div className="flex items-center justify-between pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              onClick={() => handleSave(false)}
              disabled={saving}
            >
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Sauvegarder brouillon
            </Button>
            <Button onClick={() => handleSave(true)} disabled={saving}>
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Send className="h-4 w-4 mr-2" />
              )}
              Soumettre l'évaluation
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
