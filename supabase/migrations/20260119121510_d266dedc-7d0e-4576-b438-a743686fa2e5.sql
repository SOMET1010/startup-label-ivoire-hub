-- =====================================================
-- PHASE 3 : Corrections de Sécurité Finales
-- =====================================================

-- 1. Contact Messages - Seuls les admins peuvent lire (authenticated)
CREATE POLICY "Only admins can read contact messages"
  ON contact_messages AS RESTRICTIVE 
  FOR SELECT TO authenticated 
  USING (has_role(auth.uid(), 'admin'::app_role));

-- 2. Applications - Évaluateurs limités aux applications assignées
DROP POLICY IF EXISTS "Evaluators can update applications" ON applications;
CREATE POLICY "Evaluators can update assigned applications" ON applications 
  FOR UPDATE TO authenticated
  USING (
    has_role(auth.uid(), 'evaluator'::app_role)
    AND EXISTS (
      SELECT 1 FROM evaluations e 
      WHERE e.application_id = applications.id 
      AND e.evaluator_id = auth.uid()
    )
  );

-- 3. Document Requests - Trigger pour valider les modifications
CREATE OR REPLACE FUNCTION validate_document_request_update()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Si l'utilisateur n'est pas admin, il ne peut modifier que file_url
  IF NOT has_role(auth.uid(), 'admin'::app_role) THEN
    -- Vérifier que les champs protégés ne sont pas modifiés
    IF OLD.fulfilled IS DISTINCT FROM NEW.fulfilled 
       OR OLD.fulfilled_at IS DISTINCT FROM NEW.fulfilled_at 
       OR OLD.document_type IS DISTINCT FROM NEW.document_type
       OR OLD.message IS DISTINCT FROM NEW.message THEN
      RAISE EXCEPTION 'Seuls les administrateurs peuvent modifier ces champs';
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Supprimer le trigger s'il existe déjà
DROP TRIGGER IF EXISTS validate_document_request_update_trigger ON document_requests;

CREATE TRIGGER validate_document_request_update_trigger
  BEFORE UPDATE ON document_requests
  FOR EACH ROW
  EXECUTE FUNCTION validate_document_request_update();