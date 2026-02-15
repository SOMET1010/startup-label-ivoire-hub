import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { ClipboardCheck } from "lucide-react";

interface ConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trackingId: string;
}

export default function ConfirmationDialog({ open, onOpenChange, trackingId }: ConfirmationDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <ClipboardCheck className="h-6 w-6 text-primary" />
          </div>
          <DialogTitle className="text-center">Candidature soumise !</DialogTitle>
          <DialogDescription className="text-center">
            Votre dossier a été transmis avec succès au Comité de Labellisation.
          </DialogDescription>
        </DialogHeader>

        <div className="bg-muted p-4 rounded-lg text-center">
          <p className="text-sm text-muted-foreground mb-1">Numéro de suivi</p>
          <p className="text-lg font-bold font-mono">{trackingId}</p>
        </div>

        <p className="text-sm text-muted-foreground text-center">
          Conservez ce numéro pour suivre l'avancement de votre candidature. Vous recevrez un email de confirmation.
        </p>

        <DialogFooter className="flex-col gap-2 sm:flex-row">
          <Button variant="outline" asChild className="w-full">
            <Link to="/suivi-candidature">Suivre ma candidature</Link>
          </Button>
          <Button asChild className="w-full">
            <Link to="/startup/dashboard">Accéder à mon espace</Link>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
