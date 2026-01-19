-- Table pour stocker les décisions de vote et leur historique
CREATE TABLE voting_decisions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
  
  -- Configuration du vote
  quorum_required INTEGER NOT NULL DEFAULT 3,
  quorum_reached BOOLEAN DEFAULT false,
  
  -- Résultats du vote
  approve_count INTEGER DEFAULT 0,
  reject_count INTEGER DEFAULT 0,
  pending_count INTEGER DEFAULT 0,
  total_votes INTEGER DEFAULT 0,
  
  -- Décision calculée
  calculated_decision TEXT CHECK (calculated_decision IN ('approve', 'reject', 'pending', 'tie')),
  decision_confidence NUMERIC(5,2),
  average_score NUMERIC(5,2),
  
  -- Décision finale
  final_decision TEXT CHECK (final_decision IN ('approved', 'rejected', 'pending')),
  decided_by UUID,
  decided_at TIMESTAMPTZ,
  decision_source TEXT CHECK (decision_source IN ('automatic', 'manual', 'override')),
  decision_notes TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  
  UNIQUE(application_id)
);

-- Index pour performance
CREATE INDEX idx_voting_decisions_app ON voting_decisions(application_id);
CREATE INDEX idx_voting_decisions_decision ON voting_decisions(final_decision);

-- Trigger pour mettre à jour updated_at
CREATE TRIGGER update_voting_decisions_updated_at
  BEFORE UPDATE ON voting_decisions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- RLS Policies
ALTER TABLE voting_decisions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage voting decisions"
  ON voting_decisions FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Evaluators can view voting decisions"
  ON voting_decisions FOR SELECT
  TO authenticated
  USING (has_role(auth.uid(), 'evaluator'::app_role));