import { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

type UserRole = 'admin' | 'startup' | 'evaluator' | 'public';

export type ThemePreference = 'light' | 'dark' | 'system';
export type LanguagePreference = 'fr' | 'en';
export type DateFormatPreference = 'dd/MM/yyyy' | 'MM/dd/yyyy' | 'yyyy-MM-dd';

export interface EmailNotificationsPreferences {
  status_updates: boolean;
  events: boolean;
  opportunities: boolean;
  newsletter: boolean;
}

export interface Profile {
  id: string;
  user_id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  preferred_theme: ThemePreference;
  preferred_language: LanguagePreference;
  email_notifications: EmailNotificationsPreferences;
  date_format: DateFormatPreference;
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  userRole: UserRole | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, data: any) => Promise<void>;
  signOut: () => Promise<void>;
  hasRole: (role: UserRole) => boolean;
  isAdmin: boolean;
  isStartup: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (!supabase) {
      // Backend not configured: disable auth features but allow app to render
      setLoading(false);
      return;
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        loadUserData(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        // Avoid calling other Supabase APIs inside the auth callback
        setTimeout(() => {
          loadUserData(session.user.id);
        }, 0);
      } else {
        setProfile(null);
        setUserRole(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadUserData = async (userId: string) => {
    if (!supabase) return;

    try {
      // Load profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      setProfile(profileData);

      // Load role
      const { data: roleData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .single();

      setUserRole(roleData?.role ?? 'public');
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    if (!supabase) {
      const error = new Error(
        'Les fonctionnalités de connexion ne sont pas encore configurées (Cloud désactivé).'
      );
      toast({
        title: 'Erreur de connexion',
        description: error.message,
        variant: 'destructive',
      });
      throw error;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast({
        title: 'Erreur de connexion',
        description: error.message,
        variant: 'destructive',
      });
      throw error;
    }

    toast({
      title: 'Connexion réussie',
      description: 'Bienvenue !',
    });
  };

  const signUp = async (email: string, password: string, data: any) => {
    if (!supabase) {
      const error = new Error(
        "Les fonctionnalités d'inscription ne sont pas encore configurées (Cloud désactivé)."
      );
      toast({
        title: "Erreur d'inscription",
        description: error.message,
        variant: 'destructive',
      });
      throw error;
    }

    const redirectUrl = `${window.location.origin}/`;

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          full_name: `${data.firstName || ''} ${data.lastName || ''}`.trim(),
          user_profile: data.userProfile || 'startup',
          organization_name: data.organizationName || '',
        },
      },
    });

    if (error) {
      toast({
        title: "Erreur d'inscription",
        description: error.message,
        variant: 'destructive',
      });
      throw error;
    }

    toast({
      title: 'Inscription réussie',
      description: 'Vérifiez votre email pour confirmer votre compte.',
    });
  };

  const signOut = async () => {
    if (!supabase) {
      const error = new Error(
        'Les fonctionnalités de déconnexion ne sont pas encore configurées (Cloud désactivé).'
      );
      toast({
        title: 'Erreur de déconnexion',
        description: error.message,
        variant: 'destructive',
      });
      throw error;
    }

    const { error } = await supabase.auth.signOut();

    if (error) {
      toast({
        title: 'Erreur de déconnexion',
        description: error.message,
        variant: 'destructive',
      });
      throw error;
    }

    toast({
      title: 'Déconnexion réussie',
      description: 'À bientôt !',
    });
  };

  const hasRole = (role: UserRole): boolean => {
    return userRole === role;
  };

  const isAdmin = userRole === 'admin';
  const isStartup = userRole === 'startup';

  const value = {
    user,
    profile,
    userRole,
    loading,
    signIn,
    signUp,
    signOut,
    hasRole,
    isAdmin,
    isStartup,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
