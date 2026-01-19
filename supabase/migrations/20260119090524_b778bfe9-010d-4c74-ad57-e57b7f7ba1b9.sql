-- Ajouter colonnes pour thread et mentions
ALTER TABLE application_comments
ADD COLUMN IF NOT EXISTS parent_id UUID REFERENCES application_comments(id) ON DELETE CASCADE,
ADD COLUMN IF NOT EXISTS is_internal BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS mentions UUID[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS edited_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS attachments JSONB DEFAULT '[]';

-- Index pour performance
CREATE INDEX IF NOT EXISTS idx_comments_application ON application_comments(application_id);
CREATE INDEX IF NOT EXISTS idx_comments_parent ON application_comments(parent_id);
CREATE INDEX IF NOT EXISTS idx_comments_created ON application_comments(created_at DESC);

-- Trigger pour notifier les evaluateurs/admins
CREATE OR REPLACE FUNCTION notify_comment_participants()
RETURNS TRIGGER AS $$
DECLARE
  participant RECORD;
  author_name TEXT;
  startup_name TEXT;
BEGIN
  -- Get author name
  SELECT full_name INTO author_name FROM profiles WHERE user_id = NEW.user_id;
  
  -- Get startup name
  SELECT s.name INTO startup_name 
  FROM applications a 
  JOIN startups s ON a.startup_id = s.id 
  WHERE a.id = NEW.application_id;

  -- Notify all evaluators/admins who have commented on this application
  FOR participant IN
    SELECT DISTINCT ac.user_id 
    FROM application_comments ac
    WHERE ac.application_id = NEW.application_id
    AND ac.user_id != NEW.user_id
  LOOP
    INSERT INTO startup_notifications (user_id, type, title, message, link, metadata)
    VALUES (
      participant.user_id,
      'comment',
      'Nouveau commentaire',
      format('%s a commenté sur %s', COALESCE(author_name, 'Un évaluateur'), startup_name),
      format('/admin?app=%s', NEW.application_id),
      jsonb_build_object(
        'application_id', NEW.application_id,
        'comment_id', NEW.id,
        'author_id', NEW.user_id
      )
    );
  END LOOP;

  -- Also notify mentioned users
  IF array_length(NEW.mentions, 1) > 0 THEN
    FOR participant IN
      SELECT UNNEST(NEW.mentions) as user_id
    LOOP
      IF participant.user_id != NEW.user_id THEN
        INSERT INTO startup_notifications (user_id, type, title, message, link, metadata)
        VALUES (
          participant.user_id,
          'comment',
          'Vous avez été mentionné',
          format('%s vous a mentionné dans un commentaire', COALESCE(author_name, 'Un évaluateur')),
          format('/admin?app=%s', NEW.application_id),
          jsonb_build_object(
            'application_id', NEW.application_id,
            'comment_id', NEW.id,
            'author_id', NEW.user_id,
            'is_mention', true
          )
        )
        ON CONFLICT DO NOTHING;
      END IF;
    END LOOP;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Drop trigger if exists and recreate
DROP TRIGGER IF EXISTS on_comment_insert ON application_comments;
CREATE TRIGGER on_comment_insert
AFTER INSERT ON application_comments
FOR EACH ROW EXECUTE FUNCTION notify_comment_participants();

-- Permettre update pour edition de ses propres commentaires (dans les 15 min)
DROP POLICY IF EXISTS "Users can update own comments within 15 min" ON application_comments;
CREATE POLICY "Users can update own comments within 15 min"
  ON application_comments FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = user_id 
    AND created_at > NOW() - INTERVAL '15 minutes'
  )
  WITH CHECK (auth.uid() = user_id);