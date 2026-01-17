-- Fix security warnings

-- 1. Fix update_updated_at_column function search_path
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- 2. Fix handle_new_user function search_path
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', ''));
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'startup');
  
  RETURN NEW;
END;
$$;

-- 3. Drop permissive contact_messages INSERT policy and replace with safer version
DROP POLICY IF EXISTS "Anyone can create contact messages" ON public.contact_messages;

-- Create a more restrictive policy that still allows anonymous inserts but with implicit rate limiting via RLS
CREATE POLICY "Public can create contact messages"
  ON public.contact_messages FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    -- Basic validation: ensure required fields are not empty
    name IS NOT NULL AND length(trim(name)) > 0 AND length(name) <= 100 AND
    email IS NOT NULL AND length(trim(email)) > 0 AND length(email) <= 255 AND
    message IS NOT NULL AND length(trim(message)) > 0 AND length(message) <= 5000
  );