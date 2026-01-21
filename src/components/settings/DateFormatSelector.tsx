import { useTranslation } from "react-i18next";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useUserPreferences } from "@/hooks/useUserPreferences";
import { useDateFormatter } from "@/hooks/useDateFormatter";
import { DateFormatPreference } from "@/contexts/AuthContext";

const DATE_FORMAT_OPTIONS: { value: DateFormatPreference; labelKey: string }[] = [
  { value: "dd/MM/yyyy", labelKey: "dateFormat.formats.ddMMyyyy" },
  { value: "MM/dd/yyyy", labelKey: "dateFormat.formats.MMddyyyy" },
  { value: "yyyy-MM-dd", labelKey: "dateFormat.formats.yyyyMMdd" },
];

export function DateFormatSelector() {
  const { t } = useTranslation('settings');
  const { preferences, setDateFormat, isSyncing } = useUserPreferences();
  const { formatDate } = useDateFormatter();

  const today = new Date();

  return (
    <div className="space-y-4">
      <RadioGroup
        value={preferences.date_format}
        onValueChange={(value: DateFormatPreference) => setDateFormat(value)}
        disabled={isSyncing}
        className="space-y-3"
      >
        {DATE_FORMAT_OPTIONS.map((option) => (
          <div key={option.value} className="flex items-center space-x-3">
            <RadioGroupItem value={option.value} id={`date-${option.value}`} />
            <Label
              htmlFor={`date-${option.value}`}
              className="flex items-center gap-3 cursor-pointer font-normal"
            >
              <span>{t(option.labelKey)}</span>
              <span className="text-muted-foreground text-sm">
                ({formatDate(today, "short")})
              </span>
            </Label>
          </div>
        ))}
      </RadioGroup>
      <p className="text-sm text-muted-foreground">
        {t('dateFormat.preview')} {formatDate(today, "long")}
      </p>
    </div>
  );
}
