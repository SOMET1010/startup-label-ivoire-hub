-- Add label tracking columns to startups table
ALTER TABLE public.startups 
  ADD COLUMN IF NOT EXISTS label_granted_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS label_expires_at DATE,
  ADD COLUMN IF NOT EXISTS is_visible_in_directory BOOLEAN DEFAULT true;

-- Add label validity to applications
ALTER TABLE public.applications
  ADD COLUMN IF NOT EXISTS label_valid_until DATE;

-- Create label_resources table (exclusive resources for labeled startups)
CREATE TABLE public.label_resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL CHECK (category IN ('guide', 'template', 'formation', 'legal', 'finance')),
  file_url TEXT,
  external_url TEXT,
  is_premium BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create label_opportunities table
CREATE TABLE public.label_opportunities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('marche_public', 'financement', 'partenariat', 'evenement', 'formation')),
  deadline DATE,
  eligibility_criteria TEXT,
  contact_info TEXT,
  external_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create label_events table
CREATE TABLE public.label_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  event_date TIMESTAMPTZ NOT NULL,
  location TEXT,
  is_virtual BOOLEAN DEFAULT false,
  registration_url TEXT,
  max_participants INTEGER,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create label_renewals table
CREATE TABLE public.label_renewals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  startup_id UUID NOT NULL REFERENCES public.startups(id) ON DELETE CASCADE,
  application_id UUID REFERENCES public.applications(id),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'under_review', 'approved', 'rejected')),
  requested_at TIMESTAMPTZ DEFAULT now(),
  expires_at DATE,
  notes TEXT,
  reviewed_at TIMESTAMPTZ,
  reviewed_by UUID
);

-- Enable RLS on all new tables
ALTER TABLE public.label_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.label_opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.label_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.label_renewals ENABLE ROW LEVEL SECURITY;

-- RLS Policies for label_resources
CREATE POLICY "Labeled startups can view resources"
ON public.label_resources FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM applications a
    JOIN startups s ON a.startup_id = s.id
    WHERE s.user_id = auth.uid()
      AND a.status = 'approved'
  )
  OR has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Admins can manage resources"
ON public.label_resources FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for label_opportunities
CREATE POLICY "Labeled startups can view opportunities"
ON public.label_opportunities FOR SELECT
USING (
  (is_active = true AND EXISTS (
    SELECT 1 FROM applications a
    JOIN startups s ON a.startup_id = s.id
    WHERE s.user_id = auth.uid()
      AND a.status = 'approved'
  ))
  OR has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Admins can manage opportunities"
ON public.label_opportunities FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for label_events
CREATE POLICY "Labeled startups can view events"
ON public.label_events FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM applications a
    JOIN startups s ON a.startup_id = s.id
    WHERE s.user_id = auth.uid()
      AND a.status = 'approved'
  )
  OR has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Admins can manage events"
ON public.label_events FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for label_renewals
CREATE POLICY "Users can view their own renewals"
ON public.label_renewals FOR SELECT
USING (
  startup_id IN (SELECT id FROM startups WHERE user_id = auth.uid())
  OR has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Users can create renewals for their startups"
ON public.label_renewals FOR INSERT
WITH CHECK (
  startup_id IN (SELECT id FROM startups WHERE user_id = auth.uid())
);

CREATE POLICY "Admins can manage all renewals"
ON public.label_renewals FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add triggers for updated_at
CREATE TRIGGER update_label_resources_updated_at
BEFORE UPDATE ON public.label_resources
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_label_opportunities_updated_at
BEFORE UPDATE ON public.label_opportunities
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert demo data for resources
INSERT INTO public.label_resources (title, description, category, external_url) VALUES
('Guide des avantages fiscaux', 'Documentation complète sur les exonérations fiscales disponibles pour les startups labellisées', 'guide', NULL),
('Template de business plan', 'Modèle de business plan adapté aux startups numériques ivoiriennes', 'template', NULL),
('Formation Pitch Deck', 'Cours en ligne pour créer un pitch deck percutant', 'formation', 'https://example.com/formation'),
('Modèle de contrat de travail', 'Template de contrat adapté au droit ivoirien pour les startups', 'legal', NULL),
('Guide de levée de fonds', 'Méthodologie complète pour réussir sa levée de fonds en Afrique', 'finance', NULL);

-- Insert demo data for opportunities
INSERT INTO public.label_opportunities (title, description, type, deadline, eligibility_criteria, is_active) VALUES
('Marché ARTCI - Digitalisation', 'Appel d''offres pour la digitalisation des services de l''ARTCI', 'marche_public', '2026-03-15', 'Startup labellisée depuis au moins 6 mois', true),
('Programme Boost Startup', 'Financement de 50M FCFA pour les startups innovantes', 'financement', '2026-02-28', 'Chiffre d''affaires minimum de 10M FCFA', true),
('Partenariat Orange CI', 'Programme de co-développement avec Orange Côte d''Ivoire', 'partenariat', NULL, 'Startup dans le secteur FinTech ou AgriTech', true);

-- Insert demo data for events
INSERT INTO public.label_events (title, description, event_date, location, is_virtual, max_participants) VALUES
('Networking Startups Labellisées', 'Rencontre mensuelle des startups du réseau', '2026-02-15 14:00:00+00', 'Abidjan, Cocody', false, 50),
('Webinaire: Fiscalité 2026', 'Présentation des nouvelles mesures fiscales pour les startups', '2026-01-25 10:00:00+00', NULL, true, 200);