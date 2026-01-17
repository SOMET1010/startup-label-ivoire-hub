import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface EvaluationCriteriaProps {
  label: string;
  description: string;
  weight: string;
  score: number;
  comment: string;
  onScoreChange: (value: number) => void;
  onCommentChange: (value: string) => void;
  disabled?: boolean;
  icon: React.ReactNode;
}

const getScoreColor = (score: number) => {
  if (score >= 16) return "text-green-600";
  if (score >= 12) return "text-yellow-600";
  if (score >= 8) return "text-orange-500";
  return "text-red-500";
};

const getScoreLabel = (score: number) => {
  if (score >= 16) return "Excellent";
  if (score >= 12) return "Satisfaisant";
  if (score >= 8) return "À améliorer";
  return "Insuffisant";
};

export default function EvaluationCriteria({
  label,
  description,
  weight,
  score,
  comment,
  onScoreChange,
  onCommentChange,
  disabled = false,
  icon,
}: EvaluationCriteriaProps) {
  return (
    <div className="space-y-4 p-4 border rounded-lg bg-card">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            {icon}
          </div>
          <div>
            <h4 className="font-semibold flex items-center gap-2">
              {label}
              <span className="text-xs font-normal text-muted-foreground bg-muted px-2 py-0.5 rounded">
                {weight}
              </span>
            </h4>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
        <div className="text-right">
          <div className={cn("text-2xl font-bold", getScoreColor(score))}>
            {score}/20
          </div>
          <div className={cn("text-xs", getScoreColor(score))}>
            {getScoreLabel(score)}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Score</span>
          <span className="font-medium">{score} points</span>
        </div>
        <Slider
          value={[score]}
          onValueChange={(values) => onScoreChange(values[0])}
          max={20}
          min={0}
          step={1}
          disabled={disabled}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>0</span>
          <span>5</span>
          <span>10</span>
          <span>15</span>
          <span>20</span>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor={`comment-${label}`} className="text-sm">
          Commentaire (optionnel)
        </Label>
        <Textarea
          id={`comment-${label}`}
          placeholder={`Commentaire sur ${label.toLowerCase()}...`}
          value={comment}
          onChange={(e) => onCommentChange(e.target.value)}
          disabled={disabled}
          rows={2}
          className="resize-none"
        />
      </div>
    </div>
  );
}
