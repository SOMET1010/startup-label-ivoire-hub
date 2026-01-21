import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// French translations
import frCommon from './locales/fr/common.json';
import frHome from './locales/fr/home.json';
import frAuth from './locales/fr/auth.json';
import frDashboard from './locales/fr/dashboard.json';
import frSettings from './locales/fr/settings.json';

// English translations
import enCommon from './locales/en/common.json';
import enHome from './locales/en/home.json';
import enAuth from './locales/en/auth.json';
import enDashboard from './locales/en/dashboard.json';
import enSettings from './locales/en/settings.json';

export const supportedLanguages = ['fr', 'en'] as const;
export type SupportedLanguage = typeof supportedLanguages[number];

const resources = {
  fr: {
    common: frCommon,
    home: frHome,
    auth: frAuth,
    dashboard: frDashboard,
    settings: frSettings,
  },
  en: {
    common: enCommon,
    home: enHome,
    auth: enAuth,
    dashboard: enDashboard,
    settings: enSettings,
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'fr', // Default language
    fallbackLng: 'fr',
    defaultNS: 'common',
    ns: ['common', 'home', 'auth', 'dashboard', 'settings'],
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    react: {
      useSuspense: false, // Disable suspense for SSR compatibility
    },
  });

export default i18n;
