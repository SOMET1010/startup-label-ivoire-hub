-- Ajout des colonnes documents à la table startups
ALTER TABLE public.startups ADD COLUMN IF NOT EXISTS doc_rccm TEXT;
ALTER TABLE public.startups ADD COLUMN IF NOT EXISTS doc_tax TEXT;
ALTER TABLE public.startups ADD COLUMN IF NOT EXISTS doc_statutes TEXT;
ALTER TABLE public.startups ADD COLUMN IF NOT EXISTS doc_business_plan TEXT;
ALTER TABLE public.startups ADD COLUMN IF NOT EXISTS doc_cv TEXT;
ALTER TABLE public.startups ADD COLUMN IF NOT EXISTS doc_pitch TEXT;
ALTER TABLE public.startups ADD COLUMN IF NOT EXISTS doc_other TEXT[];

-- Ajout des champs entreprise manquants
ALTER TABLE public.startups ADD COLUMN IF NOT EXISTS legal_status TEXT;
ALTER TABLE public.startups ADD COLUMN IF NOT EXISTS rccm TEXT;
ALTER TABLE public.startups ADD COLUMN IF NOT EXISTS tax_id TEXT;
ALTER TABLE public.startups ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE public.startups ADD COLUMN IF NOT EXISTS founder_info TEXT;
ALTER TABLE public.startups ADD COLUMN IF NOT EXISTS innovation TEXT;
ALTER TABLE public.startups ADD COLUMN IF NOT EXISTS business_model TEXT;
ALTER TABLE public.startups ADD COLUMN IF NOT EXISTS growth_potential TEXT;

-- Création du bucket de stockage pour les documents de candidature
INSERT INTO storage.buckets (id, name, public)
VALUES ('application-documents', 'application-documents', false)
ON CONFLICT (id) DO NOTHING;

-- Policies RLS pour le stockage des documents

-- Utilisateurs peuvent uploader leurs propres documents
CREATE POLICY "Users can upload their documents"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'application-documents' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Utilisateurs peuvent voir leurs propres documents
CREATE POLICY "Users can view their documents"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'application-documents' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Utilisateurs peuvent supprimer leurs propres documents
CREATE POLICY "Users can delete their documents"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'application-documents' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Admins peuvent voir tous les documents
CREATE POLICY "Admins can view all documents"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'application-documents' 
  AND public.has_role(auth.uid(), 'admin'::public.app_role)
);

-- Evaluators peuvent voir tous les documents
CREATE POLICY "Evaluators can view all documents"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'application-documents' 
  AND public.has_role(auth.uid(), 'evaluator'::public.app_role)
);