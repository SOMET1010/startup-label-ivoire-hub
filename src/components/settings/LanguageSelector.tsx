import { Globe } from "lucide-react";
import { Label } from "@/components/ui/label";
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
  const { preferences, setLanguage, isSyncing } = useUserPreferences();

  return (
    <div className="space-y-3">
      <Label htmlFor="language" className="flex items-center gap-2">
        <Globe className="w-4 h-4 text-muted-foreground" />
        Langue de l'interface
      </Label>
      <Select
        value={preferences.preferred_language}
        onValueChange={(value: LanguagePreference) => setLanguage(value)}
        disabled={isSyncing}
      >
        <SelectTrigger id="language" className="w-full max-w-xs">
          <SelectValue placeholder="Sélectionner une langue" />
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
    </div>
  );
}
