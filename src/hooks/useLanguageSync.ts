import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Hook that synchronizes the i18n language with the user's preferred language.
 * - For authenticated users: uses profile.preferred_language from Supabase
 * - For visitors: uses localStorage to persist preference
 */
export function useLanguageSync() {
  const { i18n } = useTranslation();
  const { user, profile } = useAuth();

  useEffect(() => {
    if (user && profile?.preferred_language) {
      // Authenticated user: use profile preference
      if (i18n.language !== profile.preferred_language) {
        i18n.changeLanguage(profile.preferred_language);
      }
    } else if (!user) {
      // Visitor: read from localStorage
      const stored = localStorage.getItem('preferred_language');
      if (stored && ['fr', 'en'].includes(stored) && stored !== i18n.language) {
        i18n.changeLanguage(stored);
      }
    }
  }, [user, profile?.preferred_language, i18n]);

  const changeLanguage = async (lang: string) => {
    await i18n.changeLanguage(lang);
    // Persist to localStorage for visitors
    if (!user) {
      localStorage.setItem('preferred_language', lang);
    }
  };

  return { 
    currentLanguage: i18n.language,
    changeLanguage,
  };
}
