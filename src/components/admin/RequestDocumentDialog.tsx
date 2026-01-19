import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, FileQuestion, Send } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const DOCUMENT_TYPES = [
  { value: 'doc_rccm', label: 'RCCM' },
  { value: 'doc_tax', label: 'Attestation fiscale' },
  { value: 'doc_business_plan', label: 'Business Plan' },
  { value: 'doc_statutes', label: 'Statuts juridiques' },
  { value: 'doc_cv', label: 'CV Fondateurs' },
  { value: 'doc_pitch', label: 'Pitch Deck' },
  { value: 'other', label: 'Autre document' },
];

interface ApplicationData {
  id: string;
  user_id?: string;
  startup: {
    id: string;
    name: string;
  };
  user?: {
    email: string | null;
    full_name: string | null;
  };
}

interface RequestDocumentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  application: ApplicationData | null;
  onSuccess: () => void;
  adminUserId: string;
}

export default function RequestDocumentDialog({
  open,
  onOpenChange,
  application,
  onSuccess,
  adminUserId,
}: RequestDocumentDialogProps) {
  const [documentType, setDocumentType] = useState("");
  const [message, setMessage] = useState("");
  const [updateStatus, setUpdateStatus] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!application || !documentType || !supabase) return;

    setLoading(true);
    try {
      // 1. Insert document request
      const { error: requestError } = await supabase
        .from("document_requests")
        .insert({
          application_id: application.id,
          document_type: documentType,
          message: message || null,
          requested_by: adminUserId,
        });

      if (requestError) throw requestError;

      // 2. Update application status to 'incomplete' if checkbox is checked
      if (updateStatus) {
        const { error: statusError } = await supabase
          .from("applications")
          .update({ status: "incomplete" })
          .eq("id", application.id);

        if (statusError) throw statusError;
      }

      // 3. Get the user_id from the application to send notification
      const { data: appData } = await supabase
        .from("applications")
        .select("user_id")
        .eq("id", application.id)
        .single();

      if (appData?.user_id) {
        // 4. Create notification for the startup user
        await supabase.from("startup_notifications").insert({
          user_id: appData.user_id,
          type: "document_request",
          title: "Document requis",
          message: `Un document supplémentaire (${DOCUMENT_TYPES.find(d => d.value === documentType)?.label}) est requis pour votre candidature.`,
          link: "/suivi-candidature",
          metadata: {
            application_id: application.id,
            document_type: documentType,
          },
        });

        // 5. Send email notification
        const documentLabel = DOCUMENT_TYPES.find(d => d.value === documentType)?.label || documentType;
        try {
          const { error: emailError } = await supabase.functions.invoke('notify-document-request', {
            body: {
              application_id: application.id,
              document_type: documentType,
              document_label: documentLabel,
              message: message || null,
            }
          });
          
          if (emailError) {
            console.error("Error sending email notification:", emailError);
          } else {
            console.log("Email notification sent successfully");
          }
        } catch (emailError) {
          // Log error but don't block the flow
          console.error("Error invoking email function:", emailError);
        }
      }

      toast({
        title: "Demande envoyée",
        description: `La startup a été notifiée par email et dans l'application.`,
      });

      // Reset form
      setDocumentType("");
      setMessage("");
      setUpdateStatus(true);
      onSuccess();
    } catch (error: any) {
      console.error("Error requesting document:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'envoyer la demande de document.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setDocumentType("");
    setMessage("");
    setUpdateStatus(true);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileQuestion className="h-5 w-5 text-orange-500" />
            Demander un document
          </DialogTitle>
          <DialogDescription>
            Demander un document manquant à {application?.startup.name || "la startup"}.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="documentType">Type de document *</Label>
            <Select value={documentType} onValueChange={setDocumentType}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un type de document" />
              </SelectTrigger>
              <SelectContent>
                {DOCUMENT_TYPES.map((doc) => (
                  <SelectItem key={doc.value} value={doc.value}>
                    {doc.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Message (optionnel)</Label>
            <Textarea
              id="message"
              placeholder="Précisez les détails du document demandé..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="updateStatus"
              checked={updateStatus}
              onCheckedChange={(checked) => setUpdateStatus(checked === true)}
            />
            <Label
              htmlFor="updateStatus"
              className="text-sm font-normal cursor-pointer"
            >
              Changer le statut en "Documents manquants"
            </Label>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={loading}>
            Annuler
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading || !documentType}
            className="bg-orange-600 hover:bg-orange-700"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Send className="h-4 w-4 mr-2" />
            )}
            Envoyer la demande
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export { DOCUMENT_TYPES };
