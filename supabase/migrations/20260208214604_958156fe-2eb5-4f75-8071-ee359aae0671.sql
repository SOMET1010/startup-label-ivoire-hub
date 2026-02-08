
DROP POLICY IF EXISTS "Anyone can subscribe" ON public.newsletter_subscribers;

CREATE POLICY "Anyone can subscribe with validation"
  ON public.newsletter_subscribers
  FOR INSERT
  WITH CHECK (
    email IS NOT NULL
    AND length(trim(email)) > 0
    AND length(email) <= 255
    AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
    AND (source IS NULL OR length(source) <= 50)
  );
