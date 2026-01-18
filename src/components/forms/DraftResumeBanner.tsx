import { AlertTriangle, RefreshCw, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface DraftResumeBannerProps {
  startupName: string;
  lastModified?: Date;
  onResume: () => void;
  onDelete: () => void;
  isDeleting?: boolean;
}

const DraftResumeBanner = ({
  startupName,
  lastModified,
  onResume,
  onDelete,
  isDeleting = false,
}: DraftResumeBannerProps) => {
  return (
    <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mb-6">
      <div className="flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h3 className="font-semibold text-amber-900 dark:text-amber-100">
            Vous avez un brouillon en cours
          </h3>
          <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
            <span className="font-medium">{startupName || "Candidature"}</span>
            {lastModified && (
              <span>
                {" "}
                — Dernière modification : {format(lastModified, "d MMMM yyyy 'à' HH:mm", { locale: fr })}
              </span>
            )}
          </p>
          <div className="flex gap-3 mt-3">
            <Button
              type="button"
              variant="default"
              size="sm"
              onClick={onResume}
              className="gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Reprendre
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="gap-2 text-destructive hover:text-destructive"
                  disabled={isDeleting}
                >
                  <Trash2 className="h-4 w-4" />
                  Supprimer et recommencer
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Supprimer le brouillon ?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Cette action est irréversible. Toutes les informations saisies seront perdues et vous devrez recommencer depuis le début.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Annuler</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={onDelete}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Supprimer le brouillon
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DraftResumeBanner;
