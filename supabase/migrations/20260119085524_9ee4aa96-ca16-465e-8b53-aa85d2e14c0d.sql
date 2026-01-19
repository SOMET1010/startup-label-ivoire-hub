-- Table pour suivre les rappels envoyés et éviter les doublons
CREATE TABLE public.renewal_reminders_sent (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  startup_id UUID NOT NULL REFERENCES public.startups(id) ON DELETE CASCADE,
  reminder_type TEXT NOT NULL CHECK (reminder_type IN ('6_months', '3_months', '1_month')),
  sent_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expiration_date DATE NOT NULL,
  email_sent BOOLEAN DEFAULT false,
  notification_sent BOOLEAN DEFAULT false,
  UNIQUE(startup_id, reminder_type, expiration_date)
);

-- Index pour recherche rapide
CREATE INDEX idx_renewal_reminders_startup ON renewal_reminders_sent(startup_id);
CREATE INDEX idx_renewal_reminders_type ON renewal_reminders_sent(reminder_type);
CREATE INDEX idx_renewal_reminders_expiration ON renewal_reminders_sent(expiration_date);

-- Enable RLS
ALTER TABLE public.renewal_reminders_sent ENABLE ROW LEVEL SECURITY;

-- Admins peuvent tout gérer
CREATE POLICY "Admins can manage renewal reminders"
  ON public.renewal_reminders_sent FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Startups peuvent voir leurs propres rappels
CREATE POLICY "Startups can view own reminders"
  ON public.renewal_reminders_sent FOR SELECT
  USING (
    startup_id IN (
      SELECT id FROM public.startups WHERE user_id = auth.uid()
    )
  );

-- Activer les extensions pour CRON (si pas déjà fait)
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;