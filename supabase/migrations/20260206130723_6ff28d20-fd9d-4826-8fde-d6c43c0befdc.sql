
-- 1. Add 'investor' to app_role enum
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'investor';

-- 2. Create investors table
CREATE TABLE public.investors (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL UNIQUE,
  name text NOT NULL,
  description text,
  type text,
  investment_stages text[],
  ticket_min bigint,
  ticket_max bigint,
  target_sectors text[],
  location text,
  website text,
  logo_url text,
  portfolio_count integer DEFAULT 0,
  status text DEFAULT 'active',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- 3. Enable RLS on investors
ALTER TABLE public.investors ENABLE ROW LEVEL SECURITY;

-- 4. RLS policies for investors
CREATE POLICY "Deny anon access to investors"
  ON public.investors FOR ALL
  USING (false);

CREATE POLICY "Investors can view their own data"
  ON public.investors FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Investors can update their own data"
  ON public.investors FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Investors can insert their own data"
  ON public.investors FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage all investors"
  ON public.investors FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Authenticated users can view active investors"
  ON public.investors FOR SELECT
  USING (status = 'active' AND auth.role() = 'authenticated');

-- 5. Update trigger for investors
CREATE TRIGGER update_investors_updated_at
  BEFORE UPDATE ON public.investors
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- 6. Create investor_interests table
CREATE TABLE public.investor_interests (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  investor_id uuid NOT NULL REFERENCES public.investors(id) ON DELETE CASCADE,
  startup_id uuid NOT NULL REFERENCES public.startups(id) ON DELETE CASCADE,
  status text DEFAULT 'interested',
  notes text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(investor_id, startup_id)
);

-- 7. Enable RLS on investor_interests
ALTER TABLE public.investor_interests ENABLE ROW LEVEL SECURITY;

-- 8. RLS policies for investor_interests
CREATE POLICY "Deny anon access to investor_interests"
  ON public.investor_interests FOR ALL
  USING (false);

CREATE POLICY "Investors can manage their own interests"
  ON public.investor_interests FOR ALL
  USING (investor_id IN (SELECT id FROM public.investors WHERE user_id = auth.uid()))
  WITH CHECK (investor_id IN (SELECT id FROM public.investors WHERE user_id = auth.uid()));

CREATE POLICY "Admins can manage all interests"
  ON public.investor_interests FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- 9. Update trigger for investor_interests
CREATE TRIGGER update_investor_interests_updated_at
  BEFORE UPDATE ON public.investor_interests
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- 10. Update handle_new_user trigger to handle investor profile
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
  -- Create user profile
  INSERT INTO public.profiles (user_id, email, full_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', ''));

  -- Determine role based on signup profile choice
  user_profile := COALESCE(NEW.raw_user_meta_data->>'user_profile', 'startup');

  CASE user_profile
    WHEN 'structure' THEN
      assigned_role := 'structure';
      INSERT INTO public.structures (user_id, name)
      VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'organization_name', COALESCE(NEW.raw_user_meta_data->>'full_name', 'Ma structure'))
      );
    WHEN 'investisseur' THEN
      assigned_role := 'investor';
      INSERT INTO public.investors (user_id, name)
      VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'organization_name', COALESCE(NEW.raw_user_meta_data->>'full_name', 'Mon fonds'))
      );
    ELSE
      assigned_role := 'startup';
  END CASE;

  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, assigned_role);

  RETURN NEW;
END;
$function$;
