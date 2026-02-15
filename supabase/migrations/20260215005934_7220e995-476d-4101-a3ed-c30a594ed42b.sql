
-- Table pour les demandes d'accompagnement (Point 4)
CREATE TABLE public.accompaniment_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  startup_name TEXT NOT NULL,
  email TEXT NOT NULL,
  structure_name TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.accompaniment_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert own requests"
  ON public.accompaniment_requests FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own requests"
  ON public.accompaniment_requests FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all requests"
  ON public.accompaniment_requests FOR SELECT
  TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Table pour les success stories dynamiques (Point 5)
CREATE TABLE public.success_stories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  startup_name TEXT NOT NULL,
  structure_name TEXT NOT NULL,
  program_name TEXT NOT NULL,
  sector TEXT NOT NULL,
  description TEXT NOT NULL,
  result TEXT NOT NULL,
  founder_quote TEXT NOT NULL,
  founder_name TEXT NOT NULL,
  founder_role TEXT NOT NULL,
  is_published BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.success_stories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read published stories"
  ON public.success_stories FOR SELECT
  TO anon, authenticated USING (is_published = true);

CREATE POLICY "Admins manage stories"
  ON public.success_stories FOR ALL
  TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Seed data avec les 3 stories existantes
INSERT INTO public.success_stories (startup_name, structure_name, program_name, sector, description, result, founder_quote, founder_name, founder_role, is_published, sort_order)
VALUES
  ('Koulé Éducation', 'Orange Digital Center', 'Orange Fab', 'EdTech', 'Koulé Éducation a intégré le programme Orange Fab et a pu structurer son offre de formation en ligne pour les étudiants ivoiriens. En 9 mois, la startup a multiplié par 5 son nombre d''utilisateurs actifs.', '50 000 étudiants actifs', 'L''accompagnement d''Orange Digital Center nous a permis de passer d''une idée à un produit utilisé dans tout le pays.', 'Mariam Bamba', 'Co-fondatrice', true, 1),
  ('Gnamakoudji Energy', 'Incub''Ivoire', 'Green Start', 'CleanTech', 'Accompagnée par Incub''Ivoire, Gnamakoudji Energy a développé une solution de micro-réseaux solaires pour les communautés rurales. Le programme Green Start l''a aidée à obtenir le label et un premier financement.', '3 villages électrifiés', 'Le mentoring technique et business a été déterminant. Nous avons appris à structurer notre modèle économique.', 'Ibrahim Sanogo', 'Fondateur & CEO', true, 2),
  ('Wôrô Logistics', 'Seedstars Abidjan', 'Seedstars Growth', 'Logistics', 'Wôrô Logistics a bénéficié de l''accélération Seedstars pour optimiser sa plateforme de livraison du dernier kilomètre à Abidjan. Le programme lui a ouvert les portes de partenariats clés avec des e-commerçants.', '+200 livreurs actifs', 'Le réseau international de Seedstars nous a connectés avec des mentors et des clients que nous n''aurions jamais atteints seuls.', 'Yves Konan', 'CEO', true, 3);
