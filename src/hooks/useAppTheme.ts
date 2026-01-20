import { useTheme } from 'next-themes';
import { useEffect, useState, useCallback, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export type Theme = 'light' | 'dark' | 'system';

export function useAppTheme() {
  const { theme, setTheme: setLocalTheme, systemTheme, resolvedTheme } = useTheme();
  const { user, profile } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const hasLoadedFromProfile = useRef(false);

  // Éviter le flash de contenu incorrect (hydration mismatch)
  useEffect(() => {
    setMounted(true);
  }, []);

  // Charger le thème depuis le profil utilisateur à la connexion
  useEffect(() => {
    if (profile?.preferred_theme && mounted && !hasLoadedFromProfile.current) {
      setLocalTheme(profile.preferred_theme);
      hasLoadedFromProfile.current = true;
    }
  }, [profile?.preferred_theme, mounted, setLocalTheme]);

  // Reset flag when user logs out
  useEffect(() => {
    if (!user) {
      hasLoadedFromProfile.current = false;
    }
  }, [user]);

  // Fonction setTheme qui synchronise avec la base de données
  const setTheme = useCallback(async (newTheme: Theme) => {
    // Changement local immédiat pour une UX réactive
    setLocalTheme(newTheme);

    // Sauvegarder en base si l'utilisateur est connecté
    if (user && supabase) {
      setIsSyncing(true);
      try {
        const { error } = await supabase
          .from('profiles')
          .update({ preferred_theme: newTheme })
          .eq('user_id', user.id);

        if (error) {
          console.error('Erreur de synchronisation du thème:', error);
        }
      } catch (err) {
        console.error('Erreur de synchronisation du thème:', err);
      } finally {
        setIsSyncing(false);
      }
    }
  }, [user, setLocalTheme]);

  return {
    theme: theme as Theme,
    setTheme,
    resolvedTheme: resolvedTheme as 'light' | 'dark',
    systemTheme,
    mounted,
    isDark: resolvedTheme === 'dark',
    isSyncing,
  };
}
