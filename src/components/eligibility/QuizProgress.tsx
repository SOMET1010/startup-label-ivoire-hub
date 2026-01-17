import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuizProgressProps {
  currentStep: number;
  totalSteps: number;
}

const STEP_LABELS = [
  "RCCM",
  "Date création",
  "Secteur",
  "Capital",
  "Stade",
  "Innovation",
  "Scalabilité"
];

export function QuizProgress({ currentStep, totalSteps }: QuizProgressProps) {
  return (
    <div className="w-full mb-8">
      {/* Progress bar */}
      <div className="relative">
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary transition-all duration-500 ease-out"
            style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
          />
        </div>
        
        {/* Step indicators */}
        <div className="absolute top-1/2 -translate-y-1/2 w-full flex justify-between">
          {Array.from({ length: totalSteps }, (_, i) => {
            const stepNumber = i + 1;
            const isCompleted = stepNumber < currentStep;
            const isCurrent = stepNumber === currentStep;
            
            return (
              <div
                key={stepNumber}
                className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium transition-all duration-300",
                  isCompleted && "bg-primary text-primary-foreground",
                  isCurrent && "bg-primary text-primary-foreground ring-4 ring-primary/20",
                  !isCompleted && !isCurrent && "bg-muted border-2 border-muted-foreground/20 text-muted-foreground"
                )}
              >
                {isCompleted ? (
                  <Check className="w-3 h-3" />
                ) : (
                  stepNumber
                )}
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Current step label */}
      <div className="mt-6 text-center">
        <span className="text-sm text-muted-foreground">
          Étape {currentStep} sur {totalSteps}
        </span>
        <p className="text-lg font-medium text-foreground mt-1">
          {STEP_LABELS[currentStep - 1]}
        </p>
      </div>
    </div>
  );
}
