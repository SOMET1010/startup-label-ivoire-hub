-- =====================================================
-- Security Hardening Phase 2 - Fix Remaining RLS Issues
-- =====================================================

-- 1. Migrate pg_net extension to extensions schema
DROP EXTENSION IF EXISTS pg_net;
CREATE EXTENSION IF NOT EXISTS pg_net SCHEMA extensions;

-- 2. Fix policies still using 'public' role -> change to 'authenticated'

-- document_requests
DROP POLICY IF EXISTS "Admins can manage document requests" ON document_requests;
CREATE POLICY "Admins can manage document requests" ON document_requests 
  FOR ALL TO authenticated 
  USING (has_role(auth.uid(), 'admin'::app_role));

-- evaluations
DROP POLICY IF EXISTS "Admins can delete evaluations" ON evaluations;
CREATE POLICY "Admins can delete evaluations" ON evaluations 
  FOR DELETE TO authenticated 
  USING (has_role(auth.uid(), 'admin'::app_role));

-- label_events
DROP POLICY IF EXISTS "Admins can manage events" ON label_events;
CREATE POLICY "Admins can manage events" ON label_events 
  FOR ALL TO authenticated 
  USING (has_role(auth.uid(), 'admin'::app_role));

-- label_opportunities
DROP POLICY IF EXISTS "Admins can manage opportunities" ON label_opportunities;
CREATE POLICY "Admins can manage opportunities" ON label_opportunities 
  FOR ALL TO authenticated 
  USING (has_role(auth.uid(), 'admin'::app_role));

-- label_renewals
DROP POLICY IF EXISTS "Admins can manage all renewals" ON label_renewals;
CREATE POLICY "Admins can manage all renewals" ON label_renewals 
  FOR ALL TO authenticated 
  USING (has_role(auth.uid(), 'admin'::app_role));

-- label_resources
DROP POLICY IF EXISTS "Admins can manage resources" ON label_resources;
CREATE POLICY "Admins can manage resources" ON label_resources 
  FOR ALL TO authenticated 
  USING (has_role(auth.uid(), 'admin'::app_role));

-- platform_stats
DROP POLICY IF EXISTS "Admins can manage all stats" ON platform_stats;
CREATE POLICY "Admins can manage all stats" ON platform_stats 
  FOR ALL TO authenticated 
  USING (has_role(auth.uid(), 'admin'::app_role));

-- renewal_reminders_sent
DROP POLICY IF EXISTS "Admins can manage renewal reminders" ON renewal_reminders_sent;
CREATE POLICY "Admins can manage renewal reminders" ON renewal_reminders_sent 
  FOR ALL TO authenticated 
  USING (has_role(auth.uid(), 'admin'::app_role));

-- startup_notifications (2 policies)
DROP POLICY IF EXISTS "Admins can insert notifications" ON startup_notifications;
CREATE POLICY "Admins can insert notifications" ON startup_notifications 
  FOR INSERT TO authenticated 
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Admins can manage all notifications" ON startup_notifications;
CREATE POLICY "Admins can manage all notifications" ON startup_notifications 
  FOR ALL TO authenticated 
  USING (has_role(auth.uid(), 'admin'::app_role));

-- 3. Protect internal comments from startups
DROP POLICY IF EXISTS "Users can view comments on their applications" ON application_comments;
CREATE POLICY "Users can view non-internal comments on their applications" ON application_comments 
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM applications a 
      WHERE a.id = application_comments.application_id 
      AND a.user_id = auth.uid()
    )
    AND (is_internal = false OR is_internal IS NULL)
  );

-- 4. Restrict evaluators to only see startups they are assigned to evaluate
DROP POLICY IF EXISTS "Evaluators can view submitted startups" ON startups;
CREATE POLICY "Evaluators can view assigned startups" ON startups 
  FOR SELECT TO authenticated
  USING (
    has_role(auth.uid(), 'evaluator'::app_role) 
    AND EXISTS (
      SELECT 1 FROM applications a
      JOIN evaluations e ON e.application_id = a.id
      WHERE a.startup_id = startups.id
      AND e.evaluator_id = auth.uid()
    )
  );

-- 5. Hide voting results before quorum is reached
DROP POLICY IF EXISTS "Evaluators can view voting decisions" ON voting_decisions;
CREATE POLICY "Evaluators can view finalized voting decisions" ON voting_decisions 
  FOR SELECT TO authenticated
  USING (
    has_role(auth.uid(), 'admin'::app_role)
    OR (has_role(auth.uid(), 'evaluator'::app_role) AND quorum_reached = true)
  );

-- 6. Block anon SELECT on contact_messages (already has INSERT allowed for public contact form)
CREATE POLICY "Deny anon select on contact_messages"
  ON contact_messages AS RESTRICTIVE FOR SELECT TO anon USING (false);