import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// French translations
import frCommon from './locales/fr/common.json';
import frHome from './locales/fr/home.json';
import frAuth from './locales/fr/auth.json';
import frDashboard from './locales/fr/dashboard.json';
import frSettings from './locales/fr/settings.json';
import frPages from './locales/fr/pages.json';

// English translations
import enCommon from './locales/en/common.json';
import enHome from './locales/en/home.json';
import enAuth from './locales/en/auth.json';
import enDashboard from './locales/en/dashboard.json';
import enSettings from './locales/en/settings.json';
import enPages from './locales/en/pages.json';

export const supportedLanguages = ['fr', 'en'] as const;
export type SupportedLanguage = typeof supportedLanguages[number];

const resources = {
  fr: {
    common: frCommon,
    home: frHome,
    auth: frAuth,
    dashboard: frDashboard,
    settings: frSettings,
    pages: frPages,
  },
  en: {
    common: enCommon,
    home: enHome,
    auth: enAuth,
    dashboard: enDashboard,
    settings: enSettings,
    pages: enPages,
  },
};

// Get initial language from localStorage, browser, or default to French
const getInitialLanguage = (): string => {
  if (typeof window !== 'undefined') {
    // Check localStorage first
    const stored = localStorage.getItem('preferred_language');
    if (stored && supportedLanguages.includes(stored as SupportedLanguage)) {
      return stored;
    }
    // Detect browser language
    const browserLang = navigator.language.split('-')[0];
    if (supportedLanguages.includes(browserLang as SupportedLanguage)) {
      return browserLang;
    }
  }
  // Default to French
  return 'fr';
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: getInitialLanguage(),
    fallbackLng: 'fr',
    defaultNS: 'common',
    ns: ['common', 'home', 'auth', 'dashboard', 'settings', 'pages'],
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });

export default i18n;
