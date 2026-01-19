-- Fonction trigger pour notifier les changements de statut de candidature
CREATE OR REPLACE FUNCTION public.notify_application_status_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  supabase_url TEXT;
  anon_key TEXT;
  status_label TEXT;
BEGIN
  -- Vérifier que le statut a réellement changé
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    
    -- Mapper les statuts vers des libellés lisibles
    CASE NEW.status
      WHEN 'pending' THEN status_label := 'En attente';
      WHEN 'under_review' THEN status_label := 'En cours d''examen';
      WHEN 'approved' THEN status_label := 'Approuvée 🎉';
      WHEN 'rejected' THEN status_label := 'Rejetée';
      WHEN 'draft' THEN status_label := 'Brouillon';
      ELSE status_label := NEW.status;
    END CASE;
    
    -- Configuration Supabase
    supabase_url := 'https://wftzeeggrwuwzutaiwjp.supabase.co';
    anon_key := 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndmdHplZWdncnd1d3p1dGFpd2pwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2NTU4MzMsImV4cCI6MjA4NDIzMTgzM30.fiJDjxNjhRjZPhaulDRKJ_jfMt8uYTQPCtdJBWwSu04';
    
    -- Appeler l'edge function send-push-notification
    PERFORM net.http_post(
      url := supabase_url || '/functions/v1/send-push-notification',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || anon_key
      ),
      body := jsonb_build_object(
        'user_id', NEW.user_id,
        'title', 'Mise à jour de votre candidature',
        'body', 'Statut : ' || status_label
      )
    );
  END IF;
  
  RETURN NEW;
END;
$$;

-- Créer le trigger sur la table applications
DROP TRIGGER IF EXISTS on_application_status_change ON public.applications;

CREATE TRIGGER on_application_status_change
  AFTER UPDATE ON public.applications
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_application_status_change();