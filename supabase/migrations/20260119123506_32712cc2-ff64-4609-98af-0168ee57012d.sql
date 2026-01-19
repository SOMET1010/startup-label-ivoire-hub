-- Table d'audit pour tracer les accès aux documents sensibles
CREATE TABLE public.document_access_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  user_role TEXT,
  document_path TEXT NOT NULL,
  document_type TEXT,
  access_type TEXT NOT NULL CHECK (access_type IN ('preview', 'download', 'share', 'evaluation')),
  access_result TEXT DEFAULT 'success' CHECK (access_result IN ('success', 'error', 'denied')),
  startup_id UUID REFERENCES public.startups(id) ON DELETE SET NULL,
  application_id UUID REFERENCES public.applications(id) ON DELETE SET NULL,
  ip_address TEXT,
  user_agent TEXT,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Index pour les recherches fréquentes
CREATE INDEX idx_document_access_logs_user ON public.document_access_logs(user_id);
CREATE INDEX idx_document_access_logs_startup ON public.document_access_logs(startup_id);
CREATE INDEX idx_document_access_logs_created ON public.document_access_logs(created_at DESC);
CREATE INDEX idx_document_access_logs_type ON public.document_access_logs(access_type);
CREATE INDEX idx_document_access_logs_result ON public.document_access_logs(access_result);

-- Enable RLS
ALTER TABLE public.document_access_logs ENABLE ROW LEVEL SECURITY;

-- Deny anonymous access
CREATE POLICY "Deny anon access to document_access_logs"
ON public.document_access_logs
AS RESTRICTIVE
FOR ALL
USING (false);

-- Admins can view all logs
CREATE POLICY "Admins can view all document access logs"
ON public.document_access_logs
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Startups can view logs for their own documents
CREATE POLICY "Startups can view their document access logs"
ON public.document_access_logs
FOR SELECT
USING (
  startup_id IN (
    SELECT id FROM public.startups WHERE user_id = auth.uid()
  )
);

-- Authenticated users can insert their own logs
CREATE POLICY "Users can insert their own access logs"
ON public.document_access_logs
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- No updates or deletes allowed (audit trail integrity)
-- Admins cannot delete logs - conservation obligatoire