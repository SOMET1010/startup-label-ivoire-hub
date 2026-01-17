-- Create evaluations table for scoring applications
CREATE TABLE public.evaluations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL,
  evaluator_id UUID NOT NULL,
  
  -- Critères de notation (0-20 chacun)
  innovation_score INTEGER CHECK (innovation_score >= 0 AND innovation_score <= 20),
  innovation_comment TEXT,
  
  business_model_score INTEGER CHECK (business_model_score >= 0 AND business_model_score <= 20),
  business_model_comment TEXT,
  
  team_score INTEGER CHECK (team_score >= 0 AND team_score <= 20),
  team_comment TEXT,
  
  impact_score INTEGER CHECK (impact_score >= 0 AND impact_score <= 20),
  impact_comment TEXT,
  
  -- Score total calculé (0-100)
  total_score DECIMAL(5,2) GENERATED ALWAYS AS (
    (COALESCE(innovation_score, 0) + 
     COALESCE(business_model_score, 0) + 
     COALESCE(team_score, 0) + 
     COALESCE(impact_score, 0)) * 1.25
  ) STORED,
  
  -- Recommandation
  recommendation TEXT CHECK (recommendation IN ('approve', 'reject', 'pending')),
  general_comment TEXT,
  
  -- Metadata
  is_submitted BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  submitted_at TIMESTAMPTZ,
  
  UNIQUE(application_id, evaluator_id)
);

-- Enable RLS
ALTER TABLE public.evaluations ENABLE ROW LEVEL SECURITY;

-- Evaluators can view their own evaluations
CREATE POLICY "Evaluators can view own evaluations"
ON public.evaluations FOR SELECT
USING (
  auth.uid() = evaluator_id OR
  has_role(auth.uid(), 'admin'::app_role)
);

-- Evaluators can create evaluations
CREATE POLICY "Evaluators can create evaluations"
ON public.evaluations FOR INSERT
WITH CHECK (
  auth.uid() = evaluator_id AND
  (has_role(auth.uid(), 'evaluator'::app_role) OR has_role(auth.uid(), 'admin'::app_role))
);

-- Evaluators can update their own draft evaluations
CREATE POLICY "Evaluators can update own draft evaluations"
ON public.evaluations FOR UPDATE
USING (
  (auth.uid() = evaluator_id AND is_submitted = false) OR
  has_role(auth.uid(), 'admin'::app_role)
);

-- Admins can delete evaluations
CREATE POLICY "Admins can delete evaluations"
ON public.evaluations FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Trigger for updated_at
CREATE TRIGGER update_evaluations_updated_at
BEFORE UPDATE ON public.evaluations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();