
-- 1a. Ajouter le role 'structure' à l'enum app_role
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'structure';

-- 1b. Créer la table structures
CREATE TABLE public.structures (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  type TEXT,
  focus_sectors TEXT[],
  location TEXT,
  website TEXT,
  logo_url TEXT,
  programs JSONB DEFAULT '[]'::jsonb,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on structures
ALTER TABLE public.structures ENABLE ROW LEVEL SECURITY;

-- RLS policies for structures
CREATE POLICY "Deny anon access to structures"
  ON public.structures FOR ALL
  TO anon
  USING (false);

CREATE POLICY "Structures can view their own data"
  ON public.structures FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Structures can update their own data"
  ON public.structures FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Structures can insert their own data"
  ON public.structures FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage all structures"
  ON public.structures FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Labeled startups can view active structures"
  ON public.structures FOR SELECT
  TO authenticated
  USING (
    status = 'active' AND EXISTS (
      SELECT 1 FROM applications a
      JOIN startups s ON a.startup_id = s.id
      WHERE s.user_id = auth.uid() AND a.status = 'approved'
    )
  );

-- Trigger for updated_at
CREATE TRIGGER update_structures_updated_at
  BEFORE UPDATE ON public.structures
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- 1d. Créer la table structure_startups (liaison structure <-> startups)
CREATE TABLE public.structure_startups (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  structure_id UUID NOT NULL REFERENCES public.structures(id) ON DELETE CASCADE,
  startup_id UUID NOT NULL REFERENCES public.startups(id) ON DELETE CASCADE,
  program_name TEXT,
  status TEXT DEFAULT 'active',
  started_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  ended_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(structure_id, startup_id)
);

-- Enable RLS on structure_startups
ALTER TABLE public.structure_startups ENABLE ROW LEVEL SECURITY;

-- RLS policies for structure_startups
CREATE POLICY "Deny anon access to structure_startups"
  ON public.structure_startups FOR ALL
  TO anon
  USING (false);

CREATE POLICY "Structures can view their linked startups"
  ON public.structure_startups FOR SELECT
  TO authenticated
  USING (
    structure_id IN (
      SELECT id FROM structures WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Structures can manage their linked startups"
  ON public.structure_startups FOR ALL
  TO authenticated
  USING (
    structure_id IN (
      SELECT id FROM structures WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    structure_id IN (
      SELECT id FROM structures WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all structure_startups"
  ON public.structure_startups FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Trigger for updated_at on structure_startups
CREATE TRIGGER update_structure_startups_updated_at
  BEFORE UPDATE ON public.structure_startups
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- 1e. Mettre à jour le trigger handle_new_user pour assigner le bon rôle
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  user_profile TEXT;
  assigned_role app_role;
BEGIN
  -- Créer le profil utilisateur
  INSERT INTO public.profiles (user_id, email, full_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', ''));

  -- Déterminer le rôle en fonction du profil choisi à l'inscription
  user_profile := COALESCE(NEW.raw_user_meta_data->>'user_profile', 'startup');

  CASE user_profile
    WHEN 'structure' THEN
      assigned_role := 'structure';
      -- Créer automatiquement une entrée dans la table structures
      INSERT INTO public.structures (user_id, name)
      VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'organization_name', COALESCE(NEW.raw_user_meta_data->>'full_name', 'Ma structure'))
      );
    ELSE
      assigned_role := 'startup';
  END CASE;

  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, assigned_role);

  RETURN NEW;
END;
$function$;
