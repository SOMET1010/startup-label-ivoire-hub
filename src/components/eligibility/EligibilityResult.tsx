import { CheckCircle, XCircle, AlertTriangle, ArrowRight, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { EligibilityResult as EligibilityResultType } from "@/hooks/useEligibility";

interface EligibilityResultProps {
  result: EligibilityResultType;
  onReset: () => void;
}

export function EligibilityResult({ result, onReset }: EligibilityResultProps) {
  const { isEligible, score, passedCriteria, failedCriteria, warnings } = result;

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fade-in">
      {/* Result Header */}
      <div className="text-center space-y-4">
        <div className={cn(
          "inline-flex items-center justify-center w-20 h-20 rounded-full",
          isEligible ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
        )}>
          {isEligible ? (
            <CheckCircle className="w-10 h-10" />
          ) : (
            <XCircle className="w-10 h-10" />
          )}
        </div>
        
        <div className="space-y-2">
          <h1 className={cn(
            "text-3xl font-bold",
            isEligible ? "text-green-600" : "text-red-600"
          )}>
            {isEligible ? "Félicitations !" : "Non éligible"}
          </h1>
          <p className="text-lg text-muted-foreground">
            {isEligible 
              ? "Votre entreprise semble éligible au Label Startup Numérique"
              : "Votre entreprise ne remplit pas tous les critères d'éligibilité"
            }
          </p>
        </div>
      </div>

      {/* Score */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Score de préparation</span>
              <span className="text-2xl font-bold text-primary">{score}/100</span>
            </div>
            <Progress value={score} className="h-3" />
            <p className="text-xs text-muted-foreground">
              {score >= 80 ? "Excellent ! Votre dossier est bien préparé." :
               score >= 60 ? "Bon score. Quelques points à améliorer." :
               score >= 40 ? "Score moyen. Des améliorations sont nécessaires." :
               "Score faible. Préparez mieux votre dossier avant de postuler."}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Criteria Results */}
      <div className="space-y-4">
        {/* Passed Criteria */}
        {passedCriteria.length > 0 && (
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold text-green-600 mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Critères validés ({passedCriteria.length})
              </h3>
              <ul className="space-y-2">
                {passedCriteria.map((criteria, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>{criteria}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Failed Criteria */}
        {failedCriteria.length > 0 && (
          <Card className="border-red-200">
            <CardContent className="pt-6">
              <h3 className="font-semibold text-red-600 mb-4 flex items-center gap-2">
                <XCircle className="w-5 h-5" />
                Critères non remplis ({failedCriteria.length})
              </h3>
              <ul className="space-y-2">
                {failedCriteria.map((criteria, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                    <span>{criteria}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Warnings */}
        {warnings.length > 0 && (
          <Card className="border-orange-200">
            <CardContent className="pt-6">
              <h3 className="font-semibold text-orange-600 mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Points d'attention ({warnings.length})
              </h3>
              <ul className="space-y-2">
                {warnings.map((warning, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <AlertTriangle className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                    <span>{warning}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
        {isEligible ? (
          <>
            <Button asChild size="lg" className="gap-2">
              <Link to="/postuler">
                Continuer vers le formulaire
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" onClick={onReset} className="gap-2">
              <RotateCcw className="w-4 h-4" />
              Refaire le quiz
            </Button>
          </>
        ) : (
          <>
            <Button asChild variant="outline" size="lg">
              <Link to="/accompagnement">
                Voir les structures d'accompagnement
              </Link>
            </Button>
            <Button variant="ghost" size="lg" onClick={onReset} className="gap-2">
              <RotateCcw className="w-4 h-4" />
              Refaire le quiz
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
