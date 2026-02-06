
-- =============================================
-- Table: platform_settings (configuration dynamique)
-- =============================================
CREATE TABLE public.platform_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_by UUID REFERENCES auth.users(id)
);

ALTER TABLE public.platform_settings ENABLE ROW LEVEL SECURITY;

-- Lecture publique
CREATE POLICY "Anyone can read platform settings"
  ON public.platform_settings FOR SELECT
  USING (true);

-- Écriture admin uniquement
CREATE POLICY "Admins can manage platform settings"
  ON public.platform_settings FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Données initiales
INSERT INTO public.platform_settings (key, value) VALUES
  ('ministry_name', 'Ministère de la Transition Numérique et de l''Innovation Technologique'),
  ('ministry_acronym', 'MTNI'),
  ('minister_title', 'Ministre de la Transition Numérique et de l''Innovation Technologique'),
  ('ministry_address', 'Abidjan, Plateau, Côte d''Ivoire'),
  ('ministry_phone', '+225 27 22 XX XX XX'),
  ('ministry_email', 'contact@mtni.gouv.ci'),
  ('ministry_website', 'https://www.mtni.gouv.ci'),
  ('platform_name', 'Ivoire Hub'),
  ('platform_email', 'contact@ivoirehub.ci');

-- =============================================
-- Table: legal_documents (textes juridiques)
-- =============================================
CREATE TABLE public.legal_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  document_type TEXT NOT NULL CHECK (document_type IN ('law', 'decree', 'order', 'circular')),
  official_number TEXT,
  file_url TEXT,
  external_url TEXT,
  published_date DATE,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.legal_documents ENABLE ROW LEVEL SECURITY;

-- Lecture publique
CREATE POLICY "Anyone can read active legal documents"
  ON public.legal_documents FOR SELECT
  USING (is_active = true);

-- Écriture admin uniquement
CREATE POLICY "Admins can manage legal documents"
  ON public.legal_documents FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Trigger updated_at
CREATE TRIGGER update_legal_documents_updated_at
  BEFORE UPDATE ON public.legal_documents
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Données initiales : la loi
INSERT INTO public.legal_documents (title, description, document_type, official_number, published_date, display_order) VALUES
  ('Loi n°2023-901 du 23 novembre 2023 portant promotion et développement des startups en Côte d''Ivoire',
   'Cette loi définit le cadre juridique de la labellisation des startups numériques, les critères d''éligibilité, les avantages fiscaux et les obligations des startups labellisées.',
   'law', '2023-901', '2023-11-23', 1),
  ('Décret d''application relatif aux modalités de labellisation des startups',
   'Décret fixant les conditions et modalités pratiques de mise en œuvre de la labellisation prévue par la Loi n°2023-901.',
   'decree', NULL, NULL, 2);

-- =============================================
-- Table: committee_members (comité de labellisation)
-- =============================================
CREATE TABLE public.committee_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  title TEXT,
  organization TEXT,
  photo_url TEXT,
  role_in_committee TEXT NOT NULL DEFAULT 'member' CHECK (role_in_committee IN ('president', 'vice_president', 'member', 'secretary')),
  bio TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.committee_members ENABLE ROW LEVEL SECURITY;

-- Lecture publique
CREATE POLICY "Anyone can read active committee members"
  ON public.committee_members FOR SELECT
  USING (is_active = true);

-- Écriture admin uniquement
CREATE POLICY "Admins can manage committee members"
  ON public.committee_members FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Trigger updated_at
CREATE TRIGGER update_committee_members_updated_at
  BEFORE UPDATE ON public.committee_members
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =============================================
-- Storage buckets
-- =============================================
INSERT INTO storage.buckets (id, name, public) VALUES ('legal-documents', 'legal-documents', true)
  ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public) VALUES ('committee-photos', 'committee-photos', true)
  ON CONFLICT (id) DO NOTHING;

-- Storage policies: legal-documents (lecture publique)
CREATE POLICY "Legal documents are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'legal-documents');

CREATE POLICY "Admins can upload legal documents"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'legal-documents' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update legal documents"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'legal-documents' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete legal documents"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'legal-documents' AND has_role(auth.uid(), 'admin'::app_role));

-- Storage policies: committee-photos (lecture publique)
CREATE POLICY "Committee photos are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'committee-photos');

CREATE POLICY "Admins can upload committee photos"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'committee-photos' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update committee photos"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'committee-photos' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete committee photos"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'committee-photos' AND has_role(auth.uid(), 'admin'::app_role));
