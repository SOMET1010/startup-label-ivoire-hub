import { Cloud, CloudOff, Save, Check, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

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
  const getStatusIcon = () => {
    if (isSaving) {
      return <Cloud className="h-4 w-4 animate-pulse text-primary" />;
    }
    if (hasChanges) {
      return <AlertCircle className="h-4 w-4 text-amber-500" />;
    }
    if (lastSaved) {
      return <Check className="h-4 w-4 text-green-500" />;
    }
    return <CloudOff className="h-4 w-4 text-muted-foreground" />;
  };

  const getStatusText = () => {
    if (isSaving) {
      return "Sauvegarde en cours...";
    }
    if (hasChanges) {
      return "Modifications non sauvegardées";
    }
    if (lastSaved) {
      return `Sauvegardé ${formatDistanceToNow(lastSaved, { addSuffix: true, locale: fr })}`;
    }
    return "Brouillon non sauvegardé";
  };

  return (
    <div className="flex items-center justify-between gap-4 p-3 bg-muted/50 rounded-lg border">
      <div className="flex items-center gap-2">
        {getStatusIcon()}
        <span className="text-sm text-muted-foreground">{getStatusText()}</span>
      </div>
      <Button
        type="button"
        variant="outline"
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
