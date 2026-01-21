import { Calendar } from "lucide-react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useUserPreferences } from "@/hooks/useUserPreferences";
import { useDateFormatter } from "@/hooks/useDateFormatter";
import { DateFormatPreference } from "@/contexts/AuthContext";

const DATE_FORMAT_OPTIONS: { value: DateFormatPreference; label: string }[] = [
  { value: "dd/MM/yyyy", label: "JJ/MM/AAAA" },
  { value: "MM/dd/yyyy", label: "MM/JJ/AAAA" },
  { value: "yyyy-MM-dd", label: "AAAA-MM-JJ" },
];

export function DateFormatSelector() {
  const { preferences, setDateFormat, isSyncing } = useUserPreferences();
  const { formatDate } = useDateFormatter();

  const today = new Date();

  return (
    <div className="space-y-4">
      <Label className="flex items-center gap-2">
        <Calendar className="w-4 h-4 text-muted-foreground" />
        Format d'affichage des dates
      </Label>
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
              <span>{option.label}</span>
              <span className="text-muted-foreground text-sm">
                ({formatDate(today, "short")})
              </span>
            </Label>
          </div>
        ))}
      </RadioGroup>
      <p className="text-sm text-muted-foreground">
        Aperçu : {formatDate(today, "long")}
      </p>
    </div>
  );
}
