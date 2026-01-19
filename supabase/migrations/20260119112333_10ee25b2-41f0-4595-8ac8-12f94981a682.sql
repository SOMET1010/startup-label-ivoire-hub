-- =============================================
-- MIGRATION: Corrections de sécurité RLS
-- Objectif: Changer role 'public' vers 'authenticated'
--           et ajouter policies restrictives pour 'anon'
-- =============================================

-- === APPLICATION_COMMENTS ===
DROP POLICY IF EXISTS "Users can view comments on their applications" ON application_comments;
CREATE POLICY "Users can view comments on their applications"
  ON application_comments FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM applications a 
    WHERE a.id = application_comments.application_id 
    AND a.user_id = auth.uid()
  ));

-- === APPLICATIONS ===
DROP POLICY IF EXISTS "Users can create applications for their startups" ON applications;
DROP POLICY IF EXISTS "Users can update their own applications" ON applications;
DROP POLICY IF EXISTS "Users can view their own applications" ON applications;

CREATE POLICY "Users can create applications for their startups"
  ON applications FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own applications"
  ON applications FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own applications"
  ON applications FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

-- === DOCUMENT_REQUESTS ===
DROP POLICY IF EXISTS "Users can update their document requests" ON document_requests;
DROP POLICY IF EXISTS "Users can view their document requests" ON document_requests;

CREATE POLICY "Users can update their document requests"
  ON document_requests FOR UPDATE TO authenticated
  USING (EXISTS (
    SELECT 1 FROM applications a
    WHERE a.id = document_requests.application_id AND a.user_id = auth.uid()
  ));

CREATE POLICY "Users can view their document requests"
  ON document_requests FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM applications a
    WHERE a.id = document_requests.application_id AND a.user_id = auth.uid()
  ));

-- === EVALUATIONS ===
DROP POLICY IF EXISTS "Evaluators can create evaluations" ON evaluations;
DROP POLICY IF EXISTS "Evaluators can update own draft evaluations" ON evaluations;
DROP POLICY IF EXISTS "Evaluators can view own evaluations" ON evaluations;

CREATE POLICY "Evaluators can create evaluations"
  ON evaluations FOR INSERT TO authenticated
  WITH CHECK ((auth.uid() = evaluator_id) AND (has_role(auth.uid(), 'evaluator'::app_role) OR has_role(auth.uid(), 'admin'::app_role)));

CREATE POLICY "Evaluators can update own draft evaluations"
  ON evaluations FOR UPDATE TO authenticated
  USING (((auth.uid() = evaluator_id) AND (is_submitted = false)) OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Evaluators can view own evaluations"
  ON evaluations FOR SELECT TO authenticated
  USING ((auth.uid() = evaluator_id) OR has_role(auth.uid(), 'admin'::app_role));

-- === LABEL_EVENTS ===
DROP POLICY IF EXISTS "Labeled startups can view events" ON label_events;

CREATE POLICY "Labeled startups can view events"
  ON label_events FOR SELECT TO authenticated
  USING ((EXISTS (
    SELECT 1 FROM applications a
    JOIN startups s ON a.startup_id = s.id
    WHERE s.user_id = auth.uid() AND a.status = 'approved'
  )) OR has_role(auth.uid(), 'admin'::app_role));

-- === LABEL_OPPORTUNITIES ===
DROP POLICY IF EXISTS "Labeled startups can view opportunities" ON label_opportunities;

CREATE POLICY "Labeled startups can view opportunities"
  ON label_opportunities FOR SELECT TO authenticated
  USING (((is_active = true) AND (EXISTS (
    SELECT 1 FROM applications a
    JOIN startups s ON a.startup_id = s.id
    WHERE s.user_id = auth.uid() AND a.status = 'approved'
  ))) OR has_role(auth.uid(), 'admin'::app_role));

-- === LABEL_RENEWALS ===
DROP POLICY IF EXISTS "Users can create renewals for their startups" ON label_renewals;
DROP POLICY IF EXISTS "Users can view their own renewals" ON label_renewals;

CREATE POLICY "Users can create renewals for their startups"
  ON label_renewals FOR INSERT TO authenticated
  WITH CHECK (startup_id IN (SELECT id FROM startups WHERE user_id = auth.uid()));

CREATE POLICY "Users can view their own renewals"
  ON label_renewals FOR SELECT TO authenticated
  USING ((startup_id IN (SELECT id FROM startups WHERE user_id = auth.uid())) OR has_role(auth.uid(), 'admin'::app_role));

-- === LABEL_RESOURCES ===
DROP POLICY IF EXISTS "Labeled startups can view resources" ON label_resources;

CREATE POLICY "Labeled startups can view resources"
  ON label_resources FOR SELECT TO authenticated
  USING ((EXISTS (
    SELECT 1 FROM applications a
    JOIN startups s ON a.startup_id = s.id
    WHERE s.user_id = auth.uid() AND a.status = 'approved'
  )) OR has_role(auth.uid(), 'admin'::app_role));

-- === PROFILES ===
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;

CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

-- === RENEWAL_REMINDERS_SENT ===
DROP POLICY IF EXISTS "Startups can view own reminders" ON renewal_reminders_sent;

CREATE POLICY "Startups can view own reminders"
  ON renewal_reminders_sent FOR SELECT TO authenticated
  USING (startup_id IN (SELECT id FROM startups WHERE user_id = auth.uid()));

-- === STARTUP_NOTIFICATIONS ===
DROP POLICY IF EXISTS "Users can update their notifications" ON startup_notifications;
DROP POLICY IF EXISTS "Users can view their notifications" ON startup_notifications;

CREATE POLICY "Users can update their notifications"
  ON startup_notifications FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view their notifications"
  ON startup_notifications FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

-- === STARTUPS ===
DROP POLICY IF EXISTS "Users can create their own startups" ON startups;
DROP POLICY IF EXISTS "Users can update their own startups" ON startups;
DROP POLICY IF EXISTS "Users can view their own startups" ON startups;

CREATE POLICY "Users can create their own startups"
  ON startups FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own startups"
  ON startups FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own startups"
  ON startups FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

-- === USER_ROLES ===
DROP POLICY IF EXISTS "Users can view their own roles" ON user_roles;

CREATE POLICY "Users can view their own roles"
  ON user_roles FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

-- =============================================
-- POLICIES RESTRICTIVES POUR BLOQUER ANON
-- =============================================

CREATE POLICY "Deny anon access to profiles"
  ON profiles AS RESTRICTIVE FOR ALL TO anon USING (false);

CREATE POLICY "Deny anon access to applications"
  ON applications AS RESTRICTIVE FOR ALL TO anon USING (false);

CREATE POLICY "Deny anon access to startups"
  ON startups AS RESTRICTIVE FOR ALL TO anon USING (false);

CREATE POLICY "Deny anon access to application_comments"
  ON application_comments AS RESTRICTIVE FOR ALL TO anon USING (false);

CREATE POLICY "Deny anon access to evaluations"
  ON evaluations AS RESTRICTIVE FOR ALL TO anon USING (false);

CREATE POLICY "Deny anon access to user_roles"
  ON user_roles AS RESTRICTIVE FOR ALL TO anon USING (false);

CREATE POLICY "Deny anon access to document_requests"
  ON document_requests AS RESTRICTIVE FOR ALL TO anon USING (false);

CREATE POLICY "Deny anon access to label_events"
  ON label_events AS RESTRICTIVE FOR ALL TO anon USING (false);

CREATE POLICY "Deny anon access to label_opportunities"
  ON label_opportunities AS RESTRICTIVE FOR ALL TO anon USING (false);

CREATE POLICY "Deny anon access to label_renewals"
  ON label_renewals AS RESTRICTIVE FOR ALL TO anon USING (false);

CREATE POLICY "Deny anon access to label_resources"
  ON label_resources AS RESTRICTIVE FOR ALL TO anon USING (false);

CREATE POLICY "Deny anon access to renewal_reminders_sent"
  ON renewal_reminders_sent AS RESTRICTIVE FOR ALL TO anon USING (false);

CREATE POLICY "Deny anon access to startup_notifications"
  ON startup_notifications AS RESTRICTIVE FOR ALL TO anon USING (false);

CREATE POLICY "Deny anon access to voting_decisions"
  ON voting_decisions AS RESTRICTIVE FOR ALL TO anon USING (false);