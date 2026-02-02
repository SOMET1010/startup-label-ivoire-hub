import { useTranslation } from "react-i18next";
import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUserPreferences } from "@/hooks/useUserPreferences";
import { LanguagePreference } from "@/contexts/AuthContext";

const LANGUAGES: { code: LanguagePreference; flag: string; short: string }[] = [
  { code: "fr", flag: "🇫🇷", short: "FR" },
  { code: "en", flag: "🇬🇧", short: "EN" },
];

interface LanguageToggleProps {
  showLabel?: boolean;
}

export function LanguageToggle({ showLabel = true }: LanguageToggleProps) {
  const { t, i18n } = useTranslation('dashboard');
  const { setLanguage, isSyncing } = useUserPreferences();

  const handleLanguageChange = async (lang: LanguagePreference) => {
    await setLanguage(lang);
    i18n.changeLanguage(lang);
  };

  return (
    <div className="px-2 py-1.5">
      {showLabel && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <Globe className="h-4 w-4" />
          <span>{t('header.userMenu.language')}</span>
        </div>
      )}
      <div className="flex gap-1">
        {LANGUAGES.map((lang) => (
          <Button
            key={lang.code}
            variant={i18n.language === lang.code ? "secondary" : "ghost"}
            size="sm"
            className="flex-1 gap-1"
            onClick={() => handleLanguageChange(lang.code)}
            disabled={isSyncing}
          >
            <span>{lang.flag}</span>
            <span>{lang.short}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}
