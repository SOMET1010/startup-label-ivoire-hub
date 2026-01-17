-- Enable realtime for applications table
ALTER PUBLICATION supabase_realtime ADD TABLE public.applications;

-- Enable realtime for application_comments table  
ALTER PUBLICATION supabase_realtime ADD TABLE public.application_comments;