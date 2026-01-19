-- Create table for configurable platform statistics
CREATE TABLE public.platform_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value NUMERIC NOT NULL DEFAULT 0,
  unit TEXT,
  label TEXT NOT NULL,
  description TEXT,
  icon TEXT DEFAULT 'building2',
  display_order INTEGER DEFAULT 0,
  is_visible BOOLEAN DEFAULT true,
  is_calculated BOOLEAN DEFAULT false,
  updated_at TIMESTAMPTZ DEFAULT now(),
  updated_by UUID REFERENCES auth.users(id)
);

-- Insert default values
INSERT INTO public.platform_stats (key, value, unit, label, description, icon, display_order) VALUES
  ('startups_actives', 500, NULL, 'Startups actives', 'dans l''écosystème numérique', 'building2', 1),
  ('incubateurs', 25, NULL, 'Incubateurs', 'partenaires du programme', 'users', 2),
  ('emplois_crees', 5000, NULL, 'Emplois créés', 'dans le secteur tech', 'briefcase', 3),
  ('investissements', 10, 'Mds FCFA', 'Investissements', 'levés par les startups', 'trending-up', 4);

-- Enable RLS
ALTER TABLE public.platform_stats ENABLE ROW LEVEL SECURITY;

-- Public can view visible stats
CREATE POLICY "Public can view visible stats"
ON public.platform_stats
FOR SELECT
USING (is_visible = true);

-- Admins can manage all stats
CREATE POLICY "Admins can manage all stats"
ON public.platform_stats
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for updated_at
CREATE TRIGGER update_platform_stats_updated_at
BEFORE UPDATE ON public.platform_stats
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();