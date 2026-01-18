-- Supprimer la politique trop permissive
DROP POLICY IF EXISTS "System can insert notifications" ON public.startup_notifications;

-- Créer une politique plus restrictive pour l'insertion
-- Seuls les admins et le système (via service role) peuvent insérer
CREATE POLICY "Admins can insert notifications"
  ON public.startup_notifications FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));