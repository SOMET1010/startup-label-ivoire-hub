-- Table pour les notifications des startups
CREATE TABLE public.startup_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('status_change', 'document_request', 'new_event', 'new_opportunity', 'new_resource', 'comment', 'renewal_reminder')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  link TEXT,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  metadata JSONB DEFAULT '{}'::jsonb
);

-- RLS pour startup_notifications
ALTER TABLE public.startup_notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their notifications"
  ON public.startup_notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their notifications"
  ON public.startup_notifications FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all notifications"
  ON public.startup_notifications FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "System can insert notifications"
  ON public.startup_notifications FOR INSERT
  WITH CHECK (true);

-- Activer Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.startup_notifications;

-- Table pour les demandes de documents manquants
CREATE TABLE public.document_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL REFERENCES public.applications(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL,
  message TEXT,
  requested_at TIMESTAMPTZ DEFAULT now(),
  fulfilled_at TIMESTAMPTZ,
  requested_by UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS pour document_requests
ALTER TABLE public.document_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage document requests"
  ON public.document_requests FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can view their document requests"
  ON public.document_requests FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.applications a
    WHERE a.id = document_requests.application_id
    AND a.user_id = auth.uid()
  ));

CREATE POLICY "Users can update their document requests"
  ON public.document_requests FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM public.applications a
    WHERE a.id = document_requests.application_id
    AND a.user_id = auth.uid()
  ));