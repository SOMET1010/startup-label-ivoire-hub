-- Enable pg_net extension for HTTP calls if not already enabled
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

-- Function to check if quorum is reached and notify admins
CREATE OR REPLACE FUNCTION public.check_quorum_reached()
RETURNS TRIGGER AS $$
DECLARE
  quorum_threshold INTEGER := 3;
  vote_count INTEGER;
  already_notified BOOLEAN;
  supabase_url TEXT;
  anon_key TEXT;
BEGIN
  -- Only proceed if the evaluation was just submitted
  IF NEW.is_submitted = true THEN
    -- Count submitted evaluations for this application
    SELECT COUNT(*) INTO vote_count
    FROM public.evaluations
    WHERE application_id = NEW.application_id
    AND is_submitted = true;
    
    -- Check if quorum is exactly reached (not already passed)
    IF vote_count = quorum_threshold THEN
      -- Check if a quorum_reached notification was already sent
      SELECT EXISTS(
        SELECT 1 FROM public.startup_notifications
        WHERE metadata->>'application_id' = NEW.application_id::text
        AND type = 'quorum_reached'
      ) INTO already_notified;
      
      IF NOT already_notified THEN
        -- Get the Supabase URL and anon key from vault or use hardcoded values
        supabase_url := 'https://wftzeeggrwuwzutaiwjp.supabase.co';
        anon_key := 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndmdHplZWdncnd1d3p1dGFpd2pwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2NTU4MzMsImV4cCI6MjA4NDIzMTgzM30.fiJDjxNjhRjZPhaulDRKJ_jfMt8uYTQPCtdJBWwSu04';
        
        -- Call the edge function via pg_net
        PERFORM net.http_post(
          url := supabase_url || '/functions/v1/notify-voting-decision',
          headers := jsonb_build_object(
            'Content-Type', 'application/json',
            'Authorization', 'Bearer ' || anon_key
          ),
          body := jsonb_build_object(
            'event_type', 'quorum_reached',
            'application_id', NEW.application_id
          )
        );
      END IF;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for quorum detection
DROP TRIGGER IF EXISTS on_evaluation_submitted ON public.evaluations;
CREATE TRIGGER on_evaluation_submitted
AFTER INSERT OR UPDATE ON public.evaluations
FOR EACH ROW
WHEN (NEW.is_submitted = true)
EXECUTE FUNCTION public.check_quorum_reached();