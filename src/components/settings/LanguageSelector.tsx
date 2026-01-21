import { useTranslation } from "react-i18next";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUserPreferences } from "@/hooks/useUserPreferences";
import { LanguagePreference } from "@/contexts/AuthContext";

const LANGUAGE_OPTIONS: { value: LanguagePreference; label: string; flag: string }[] = [
  { value: "fr", label: "Français", flag: "🇫🇷" },
  { value: "en", label: "English", flag: "🇬🇧" },
];

export function LanguageSelector() {
  const { t, i18n } = useTranslation('settings');
  const { preferences, setLanguage, isSyncing } = useUserPreferences();

  const handleLanguageChange = async (value: LanguagePreference) => {
    await setLanguage(value);
    i18n.changeLanguage(value);
  };

  return (
    <Select
      value={preferences.preferred_language}
      onValueChange={handleLanguageChange}
      disabled={isSyncing}
    >
      <SelectTrigger className="w-full max-w-xs">
        <SelectValue placeholder={t('language.selectPlaceholder')} />
      </SelectTrigger>
      <SelectContent>
        {LANGUAGE_OPTIONS.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            <span className="flex items-center gap-2">
              <span>{option.flag}</span>
              <span>{option.label}</span>
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
