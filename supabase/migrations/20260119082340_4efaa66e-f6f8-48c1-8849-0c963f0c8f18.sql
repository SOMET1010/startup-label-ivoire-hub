-- Créer le bucket pour les images de profils générées
INSERT INTO storage.buckets (id, name, public)
VALUES ('profile-images', 'profile-images', true)
ON CONFLICT (id) DO NOTHING;

-- Politique de lecture publique
CREATE POLICY "Public read access for profile images"
ON storage.objects FOR SELECT
USING (bucket_id = 'profile-images');

-- Politique d'insertion pour les utilisateurs authentifiés
CREATE POLICY "Authenticated users can upload profile images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'profile-images');