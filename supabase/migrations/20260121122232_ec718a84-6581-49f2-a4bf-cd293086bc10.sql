-- Add user preferences columns to profiles table

-- Language preference (French as default for Côte d'Ivoire)
ALTER TABLE public.profiles 
ADD COLUMN preferred_language TEXT DEFAULT 'fr';

ALTER TABLE public.profiles 
ADD CONSTRAINT profiles_preferred_language_check 
CHECK (preferred_language IN ('fr', 'en'));

-- Email notifications preferences (JSON for flexibility)
ALTER TABLE public.profiles 
ADD COLUMN email_notifications JSONB DEFAULT '{"status_updates": true, "events": true, "opportunities": true, "newsletter": false}'::jsonb;

-- Date format preference
ALTER TABLE public.profiles 
ADD COLUMN date_format TEXT DEFAULT 'dd/MM/yyyy';

ALTER TABLE public.profiles 
ADD CONSTRAINT profiles_date_format_check 
CHECK (date_format IN ('dd/MM/yyyy', 'MM/dd/yyyy', 'yyyy-MM-dd'));