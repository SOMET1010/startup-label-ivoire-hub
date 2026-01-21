import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Hook that synchronizes the i18n language with the user's preferred language
 * stored in their profile. This ensures the UI language matches user preferences
 * across sessions and devices.
 */
export function useLanguageSync() {
  const { i18n } = useTranslation();
  const { profile } = useAuth();

  useEffect(() => {
    const preferredLanguage = profile?.preferred_language || 'fr';
    
    // Only change language if it differs from current
    if (i18n.language !== preferredLanguage) {
      i18n.changeLanguage(preferredLanguage);
    }
  }, [profile?.preferred_language, i18n]);

  const changeLanguage = async (lang: string) => {
    await i18n.changeLanguage(lang);
  };

  return { 
    currentLanguage: i18n.language,
    changeLanguage,
  };
}
