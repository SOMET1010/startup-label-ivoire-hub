# Phase 1: Backend Infrastructure - Setup Guide

## Database Schema Setup

**IMPORTANT:** Go to your Cloud tab → Database → SQL Editor and run the following SQL script to set up the database:

\`\`\`sql
-- Create enum for user roles
CREATE TYPE app_role AS ENUM ('admin', 'startup', 'evaluator', 'public');

-- Table des profils utilisateurs
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  company_name TEXT,
  user_type TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Table des rôles utilisateurs
CREATE TABLE IF NOT EXISTS user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, role)
);

-- Table des startups (pour l'observatoire)
CREATE TABLE IF NOT EXISTS startups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES auth.users(id),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  logo_url TEXT,
  description TEXT,
  sector TEXT,
  specialization TEXT,
  founded INTEGER,
  location TEXT,
  coordinates JSONB,
  employees TEXT,
  website TEXT,
  is_labeled BOOLEAN DEFAULT false,
  label_date DATE,
  services TEXT[],
  certifications TEXT[],
  partners TEXT[],
  contact JSONB,
  key_stats JSONB,
  status TEXT DEFAULT 'draft',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Table des candidatures au label
CREATE TABLE IF NOT EXISTS applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tracking_id TEXT UNIQUE NOT NULL,
  startup_id UUID REFERENCES startups(id),
  applicant_id UUID REFERENCES auth.users(id) NOT NULL,
  
  company_name TEXT NOT NULL,
  legal_status TEXT NOT NULL,
  creation_date DATE NOT NULL,
  rccm TEXT NOT NULL,
  tax_id TEXT NOT NULL,
  sector TEXT NOT NULL,
  address TEXT NOT NULL,
  website TEXT,
  employees INTEGER NOT NULL,
  
  founder_info TEXT NOT NULL,
  project_description TEXT NOT NULL,
  innovation TEXT NOT NULL,
  business_model TEXT NOT NULL,
  growth_potential TEXT NOT NULL,
  
  doc_rccm TEXT,
  doc_tax TEXT,
  doc_statutes TEXT,
  doc_business_plan TEXT,
  doc_cv TEXT,
  doc_pitch TEXT,
  doc_other TEXT[],
  
  status TEXT DEFAULT 'submitted',
  current_step INTEGER DEFAULT 1,
  
  submission_date TIMESTAMP DEFAULT NOW(),
  last_update TIMESTAMP DEFAULT NOW(),
  decision_date TIMESTAMP,
  
  assigned_evaluator_id UUID REFERENCES auth.users(id),
  evaluation_score INTEGER,
  evaluation_comments TEXT,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Table des commentaires sur les candidatures
CREATE TABLE IF NOT EXISTS application_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
  author_id UUID REFERENCES auth.users(id),
  author_name TEXT NOT NULL,
  content TEXT NOT NULL,
  is_visible_to_applicant BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Table des actualités
CREATE TABLE IF NOT EXISTS news (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT,
  category TEXT NOT NULL,
  tags TEXT[],
  author_id UUID REFERENCES auth.users(id),
  author_name TEXT NOT NULL,
  published_at TIMESTAMP,
  status TEXT DEFAULT 'draft',
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Table des messages de contact
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  startup_id UUID REFERENCES startups(id),
  sender_name TEXT NOT NULL,
  sender_email TEXT NOT NULL,
  sender_phone TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Function de sécurité pour les rôles
CREATE OR REPLACE FUNCTION has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- RLS Policies

-- Profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  USING (has_role(auth.uid(), 'admin'));

-- Applications
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own applications" ON applications;
CREATE POLICY "Users can view their own applications"
  ON applications FOR SELECT
  USING (auth.uid() = applicant_id);

DROP POLICY IF EXISTS "Users can create applications" ON applications;
CREATE POLICY "Users can create applications"
  ON applications FOR INSERT
  WITH CHECK (auth.uid() = applicant_id);

DROP POLICY IF EXISTS "Admins and evaluators can view all applications" ON applications;
CREATE POLICY "Admins and evaluators can view all applications"
  ON applications FOR SELECT
  USING (
    has_role(auth.uid(), 'admin') OR 
    has_role(auth.uid(), 'evaluator')
  );

DROP POLICY IF EXISTS "Admins can update applications" ON applications;
CREATE POLICY "Admins can update applications"
  ON applications FOR UPDATE
  USING (has_role(auth.uid(), 'admin'));

-- Startups
ALTER TABLE startups ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view published startups" ON startups;
CREATE POLICY "Anyone can view published startups"
  ON startups FOR SELECT
  USING (status = 'published' OR auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Owners can view their own startups" ON startups;
CREATE POLICY "Owners can view their own startups"
  ON startups FOR SELECT
  USING (auth.uid() = owner_id);

DROP POLICY IF EXISTS "Admins can manage all startups" ON startups;
CREATE POLICY "Admins can manage all startups"
  ON startups FOR ALL
  USING (has_role(auth.uid(), 'admin'));

-- News
ALTER TABLE news ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view published news" ON news;
CREATE POLICY "Anyone can view published news"
  ON news FOR SELECT
  USING (status = 'published');

DROP POLICY IF EXISTS "Admins can manage news" ON news;
CREATE POLICY "Admins can manage news"
  ON news FOR ALL
  USING (has_role(auth.uid(), 'admin'));

-- Contact messages
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can create contact messages" ON contact_messages;
CREATE POLICY "Anyone can create contact messages"
  ON contact_messages FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can view contact messages" ON contact_messages;
CREATE POLICY "Admins can view contact messages"
  ON contact_messages FOR SELECT
  USING (has_role(auth.uid(), 'admin'));

-- Application comments
ALTER TABLE application_comments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their application comments" ON application_comments;
CREATE POLICY "Users can view their application comments"
  ON application_comments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM applications
      WHERE applications.id = application_comments.application_id
      AND applications.applicant_id = auth.uid()
      AND application_comments.is_visible_to_applicant = true
    )
  );

DROP POLICY IF EXISTS "Admins can manage comments" ON application_comments;
CREATE POLICY "Admins can manage comments"
  ON application_comments FOR ALL
  USING (has_role(auth.uid(), 'admin'));

-- Trigger pour auto-création de profil
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO profiles (id, email, first_name, last_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name'
  );
  
  INSERT INTO user_roles (user_id, role)
  VALUES (NEW.id, 'startup');
  
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();
\`\`\`

## What Was Implemented

✅ **Phase 1: Backend Infrastructure (Foundation)**
- Database schema with 8 tables
- User roles system (admin, startup, evaluator, public)
- Row Level Security (RLS) policies
- Edge function: `check-user-role`
- Auto-creation of user profile on signup

✅ **Authentication System**
- `AuthContext` with full auth management
- `ProtectedRoute` component for authenticated routes
- `RoleGate` component for role-based access

✅ **Basic Pages Created**
- `/startup` - Startup dashboard (protected, startup role)
- `/admin` - Admin dashboard (protected, admin/evaluator roles)

## Next Steps

To continue implementation, you can ask for:
1. **Phase 2:** Create startup application form (multi-step form for labeling application)
2. **Phase 3:** Build admin candidature management interface
3. **Phase 4:** Enhance the Observatory (directory, statistics, map)
4. **Phase 5:** Add layouts and navigation (sidebars, better UX)

## How to Use

1. **Enable Cloud** if not already done (Cloud tab in Lovable)
2. **Run the SQL script** above in Cloud → Database → SQL Editor
3. **Sign up** as a user to test the system
4. **Create admin user:** You'll need to manually set a user role to 'admin' in the database

To make yourself admin, after signing up, run this in SQL Editor:
\`\`\`sql
UPDATE user_roles 
SET role = 'admin' 
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'your-email@example.com');
\`\`\`
