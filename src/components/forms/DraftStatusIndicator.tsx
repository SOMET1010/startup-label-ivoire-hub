import { Cloud, CloudOff, Save, Check, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format, formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface DraftStatusIndicatorProps {
  isSaving: boolean;
  hasChanges: boolean;
  lastSaved?: Date;
  onManualSave: () => void;
}

const DraftStatusIndicator = ({
  isSaving,
  hasChanges,
  lastSaved,
  onManualSave,
}: DraftStatusIndicatorProps) => {
  const getStatusConfig = () => {
    if (isSaving) {
      return {
        icon: <Cloud className="h-4 w-4 animate-pulse" />,
        text: "Sauvegarde en cours...",
        subtext: undefined,
        bgClass: "bg-primary/10 border-primary/20",
        textClass: "text-primary",
      };
    }
    if (hasChanges) {
      return {
        icon: <AlertCircle className="h-4 w-4" />,
        text: "Modifications non sauvegardées",
        subtext: undefined,
        bgClass: "bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800",
        textClass: "text-amber-600 dark:text-amber-400",
      };
    }
    if (lastSaved) {
      return {
        icon: <Check className="h-4 w-4" />,
        text: `Sauvegardé à ${format(lastSaved, "HH:mm", { locale: fr })}`,
        subtext: formatDistanceToNow(lastSaved, { addSuffix: true, locale: fr }),
        bgClass: "bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800",
        textClass: "text-green-600 dark:text-green-400",
      };
    }
    return {
      icon: <CloudOff className="h-4 w-4" />,
      text: "Brouillon non sauvegardé",
      subtext: undefined,
      bgClass: "bg-muted/50 border-muted",
      textClass: "text-muted-foreground",
    };
  };

  const config = getStatusConfig();

  return (
    <div className={cn(
      "flex items-center justify-between gap-4 p-3 rounded-lg border transition-colors duration-300",
      config.bgClass
    )}>
      <div className="flex items-center gap-2">
        <span className={config.textClass}>{config.icon}</span>
        <div className="flex flex-col">
          <span className={cn("text-sm font-medium", config.textClass)}>
            {config.text}
          </span>
          {config.subtext && (
            <span className="text-xs text-muted-foreground">
              ({config.subtext})
            </span>
          )}
        </div>
      </div>
      <Button
        type="button"
        variant={hasChanges ? "default" : "outline"}
        size="sm"
        onClick={onManualSave}
        disabled={isSaving || !hasChanges}
        className="gap-2"
      >
        <Save className="h-4 w-4" />
        Sauvegarder
      </Button>
    </div>
  );
};

export default DraftStatusIndicator;
