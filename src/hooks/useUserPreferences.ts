import { useCallback, useState } from 'react';
import { useAuth, ThemePreference, LanguagePreference, DateFormatPreference, EmailNotificationsPreferences } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface UserPreferences {
  preferred_theme: ThemePreference;
  preferred_language: LanguagePreference;
  date_format: DateFormatPreference;
  email_notifications: EmailNotificationsPreferences;
}

const defaultPreferences: UserPreferences = {
  preferred_theme: 'system',
  preferred_language: 'fr',
  date_format: 'dd/MM/yyyy',
  email_notifications: {
    status_updates: true,
    events: true,
    opportunities: true,
    newsletter: false,
  },
};

export function useUserPreferences() {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [isSyncing, setIsSyncing] = useState(false);

  // Get current preferences from profile or defaults
  const preferences: UserPreferences = {
    preferred_theme: profile?.preferred_theme ?? defaultPreferences.preferred_theme,
    preferred_language: profile?.preferred_language ?? defaultPreferences.preferred_language,
    date_format: profile?.date_format ?? defaultPreferences.date_format,
    email_notifications: profile?.email_notifications ?? defaultPreferences.email_notifications,
  };

  // Update a single preference
  const updatePreference = useCallback(async <K extends keyof UserPreferences>(
    key: K,
    value: UserPreferences[K]
  ): Promise<boolean> => {
    if (!user || !supabase) {
      return false;
    }

    setIsSyncing(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ [key]: value })
        .eq('user_id', user.id);

      if (error) {
        console.error(`Erreur de mise à jour de ${key}:`, error);
        toast({
          title: 'Erreur de synchronisation',
          description: 'Impossible de sauvegarder vos préférences.',
          variant: 'destructive',
        });
        return false;
      }

      return true;
    } catch (err) {
      console.error(`Erreur de mise à jour de ${key}:`, err);
      return false;
    } finally {
      setIsSyncing(false);
    }
  }, [user, toast]);

  // Update multiple preferences at once
  const updatePreferences = useCallback(async (
    updates: Partial<UserPreferences>
  ): Promise<boolean> => {
    if (!user || !supabase) {
      return false;
    }

    setIsSyncing(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('user_id', user.id);

      if (error) {
        console.error('Erreur de mise à jour des préférences:', error);
        toast({
          title: 'Erreur de synchronisation',
          description: 'Impossible de sauvegarder vos préférences.',
          variant: 'destructive',
        });
        return false;
      }

      toast({
        title: 'Préférences sauvegardées',
        description: 'Vos préférences ont été mises à jour.',
      });
      return true;
    } catch (err) {
      console.error('Erreur de mise à jour des préférences:', err);
      return false;
    } finally {
      setIsSyncing(false);
    }
  }, [user, toast]);

  // Specific updaters for convenience
  const setLanguage = useCallback((lang: LanguagePreference) => 
    updatePreference('preferred_language', lang), [updatePreference]);

  const setDateFormat = useCallback((format: DateFormatPreference) => 
    updatePreference('date_format', format), [updatePreference]);

  const setEmailNotification = useCallback(async (
    key: keyof EmailNotificationsPreferences,
    value: boolean
  ) => {
    const newNotifications = {
      ...preferences.email_notifications,
      [key]: value,
    };
    return updatePreference('email_notifications', newNotifications);
  }, [preferences.email_notifications, updatePreference]);

  const setAllEmailNotifications = useCallback((
    notifications: EmailNotificationsPreferences
  ) => updatePreference('email_notifications', notifications), [updatePreference]);

  return {
    preferences,
    isSyncing,
    updatePreference,
    updatePreferences,
    setLanguage,
    setDateFormat,
    setEmailNotification,
    setAllEmailNotifications,
  };
}
