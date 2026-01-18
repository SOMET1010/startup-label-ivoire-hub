import { CheckCircle, Clock, XCircle, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProcessStep {
  id: number;
  name: string;
  description: string;
  estimatedDays?: number;
}

const PROCESS_STEPS: ProcessStep[] = [
  { id: 1, name: "Soumission", description: "Dossier reçu", estimatedDays: 0 },
  { id: 2, name: "Vérification", description: "Complétude vérifiée", estimatedDays: 3 },
  { id: 3, name: "Évaluation", description: "Analyse par les experts", estimatedDays: 10 },
  { id: 4, name: "Comité", description: "Délibération finale", estimatedDays: 5 },
  { id: 5, name: "Décision", description: "Résultat notifié", estimatedDays: 2 },
];

const STATUS_TO_STEP: Record<string, number> = {
  draft: 0,
  pending: 1,
  under_review: 2,
  documents_required: 2,
  info_requested: 2,
  committee_review: 4,
  approved: 5,
  rejected: 5,
};

interface ProcessTimelineProps {
  currentStatus: string;
  submittedAt?: string | null;
  className?: string;
}

export function ProcessTimeline({ currentStatus, submittedAt, className }: ProcessTimelineProps) {
  const currentStep = STATUS_TO_STEP[currentStatus] || 1;
  const isRejected = currentStatus === 'rejected';
  const isApproved = currentStatus === 'approved';

  const getStepStatus = (stepId: number) => {
    if (stepId < currentStep) return 'completed';
    if (stepId === currentStep) {
      if (isRejected || isApproved) return isApproved ? 'completed' : 'rejected';
      return 'current';
    }
    return 'pending';
  };

  const getEstimatedDate = (stepId: number): string | null => {
    if (!submittedAt) return null;
    
    const startDate = new Date(submittedAt);
    const daysToAdd = PROCESS_STEPS
      .filter(s => s.id <= stepId)
      .reduce((acc, s) => acc + (s.estimatedDays || 0), 0);
    
    const estimatedDate = new Date(startDate);
    estimatedDate.setDate(estimatedDate.getDate() + daysToAdd);
    
    return estimatedDate.toLocaleDateString('fr-FR', { 
      day: 'numeric', 
      month: 'short' 
    });
  };

  return (
    <div className={cn("space-y-0", className)}>
      {PROCESS_STEPS.map((step, index) => {
        const status = getStepStatus(step.id);
        const isLast = index === PROCESS_STEPS.length - 1;
        
        return (
          <div key={step.id} className="relative">
            <div className="flex items-start gap-4">
              {/* Icon and Line */}
              <div className="flex flex-col items-center">
                <StepIcon status={status} />
                {!isLast && (
                  <div 
                    className={cn(
                      "w-0.5 h-8 mt-1",
                      status === 'completed' ? 'bg-success' : 'bg-border'
                    )} 
                  />
                )}
              </div>

              {/* Content */}
              <div className="flex-grow pb-4">
                <div className="flex items-center justify-between">
                  <h4 className={cn(
                    "font-medium",
                    status === 'pending' && 'text-muted-foreground',
                    status === 'rejected' && 'text-destructive'
                  )}>
                    {step.name}
                  </h4>
                  {status !== 'pending' && submittedAt && (
                    <span className="text-xs text-muted-foreground">
                      {status === 'completed' ? '✓' : status === 'current' ? 'En cours' : ''}
                      {' '}
                      {getEstimatedDate(step.id)}
                    </span>
                  )}
                </div>
                <p className={cn(
                  "text-sm",
                  status === 'pending' ? 'text-muted-foreground/60' : 'text-muted-foreground'
                )}>
                  {step.description}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function StepIcon({ status }: { status: 'completed' | 'current' | 'pending' | 'rejected' }) {
  const baseClasses = "h-6 w-6 flex-shrink-0";
  
  switch (status) {
    case 'completed':
      return <CheckCircle className={cn(baseClasses, "text-success")} />;
    case 'current':
      return (
        <div className="relative">
          <Clock className={cn(baseClasses, "text-info")} />
          <span className="absolute -right-0.5 -top-0.5 h-2 w-2 bg-info rounded-full animate-pulse" />
        </div>
      );
    case 'rejected':
      return <XCircle className={cn(baseClasses, "text-destructive")} />;
    default:
      return <Circle className={cn(baseClasses, "text-muted-foreground/30")} />;
  }
}

// Compact version for sidebar
export function ProcessTimelineCompact({ currentStatus }: { currentStatus: string }) {
  const currentStep = STATUS_TO_STEP[currentStatus] || 1;
  const totalSteps = PROCESS_STEPS.length;
  const progressPercent = Math.round((currentStep / totalSteps) * 100);

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="font-medium">Progression</span>
        <span className="text-muted-foreground">{progressPercent}%</span>
      </div>
      <div className="flex gap-1">
        {PROCESS_STEPS.map((step) => {
          const status = step.id <= currentStep ? 'completed' : 'pending';
          return (
            <div
              key={step.id}
              className={cn(
                "flex-1 h-2 rounded-full transition-colors",
                status === 'completed' 
                  ? currentStatus === 'rejected' && step.id === currentStep 
                    ? 'bg-destructive' 
                    : 'bg-success'
                  : 'bg-muted'
              )}
              title={step.name}
            />
          );
        })}
      </div>
      <p className="text-xs text-muted-foreground">
        Étape {currentStep}/{totalSteps}: {PROCESS_STEPS[currentStep - 1]?.name || 'En cours'}
      </p>
    </div>
  );
}
