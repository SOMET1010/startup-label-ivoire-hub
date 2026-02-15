import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Loader2, CheckCircle, XCircle, Clock } from "lucide-react";
import RequestDocumentDialog, { DOCUMENT_TYPES } from "@/components/admin/RequestDocumentDialog";
import { type ApplicationWithStartup, type UserWithRole, type DocumentRequest } from "@/hooks/useAdminDashboard";

interface AdminDialogsProps {
  // Action dialog
  showActionDialog: boolean;
  setShowActionDialog: (v: boolean) => void;
  actionType: "approve" | "reject" | "review" | null;
  actionNotes: string;
  setActionNotes: (v: string) => void;
  actionLoading: boolean;
  selectedApplication: ApplicationWithStartup | null;
  handleStatusChange: () => void;
  // Role dialog
  showRoleDialog: boolean;
  setShowRoleDialog: (v: boolean) => void;
  selectedUser: UserWithRole | null;
  newRole: string;
  setNewRole: (v: string) => void;
  handleRoleChange: () => void;
  // Document request dialog
  showDocumentRequestDialog: boolean;
  setShowDocumentRequestDialog: (v: boolean) => void;
  adminUserId: string;
  fetchData: () => void;
  setSelectedApplication: (v: ApplicationWithStartup | null) => void;
  // Cancel document request dialog
  showCancelDialog: boolean;
  setShowCancelDialog: (v: boolean) => void;
  requestToCancel: DocumentRequest | null;
  cancellingRequestId: string | null;
  handleCancelDocumentRequest: () => void;
}

export default function AdminDialogs({
  showActionDialog, setShowActionDialog, actionType, actionNotes, setActionNotes, actionLoading, selectedApplication, handleStatusChange,
  showRoleDialog, setShowRoleDialog, selectedUser, newRole, setNewRole, handleRoleChange,
  showDocumentRequestDialog, setShowDocumentRequestDialog, adminUserId, fetchData, setSelectedApplication,
  showCancelDialog, setShowCancelDialog, requestToCancel, cancellingRequestId, handleCancelDocumentRequest,
}: AdminDialogsProps) {
  return (
    <>
      {/* Action Dialog */}
      <Dialog open={showActionDialog} onOpenChange={setShowActionDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === "approve" ? "Approuver la candidature" : actionType === "reject" ? "Rejeter la candidature" : "Mettre en cours d'examen"}
            </DialogTitle>
            <DialogDescription>
              {actionType === "approve"
                ? `Vous êtes sur le point d'approuver la candidature de ${selectedApplication?.startup.name}.`
                : actionType === "reject"
                  ? `Vous êtes sur le point de rejeter la candidature de ${selectedApplication?.startup.name}.`
                  : `Vous êtes sur le point de mettre la candidature de ${selectedApplication?.startup.name} en cours d'examen.`}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="notes">Notes (optionnel)</Label>
              <Textarea id="notes" placeholder="Ajoutez des notes ou commentaires..." value={actionNotes} onChange={(e) => setActionNotes(e.target.value)} rows={3} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowActionDialog(false)} disabled={actionLoading}>Annuler</Button>
            <Button variant={actionType === "approve" ? "default" : actionType === "reject" ? "destructive" : "secondary"} onClick={handleStatusChange} disabled={actionLoading}>
              {actionLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : actionType === "approve" ? <CheckCircle className="h-4 w-4 mr-2" /> : actionType === "reject" ? <XCircle className="h-4 w-4 mr-2" /> : <Clock className="h-4 w-4 mr-2" />}
              {actionType === "approve" ? "Approuver" : actionType === "reject" ? "Rejeter" : "Mettre en examen"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Role Dialog */}
      <Dialog open={showRoleDialog} onOpenChange={setShowRoleDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Gérer les rôles</DialogTitle>
            <DialogDescription>Attribuez ou retirez des rôles pour {selectedUser?.full_name || selectedUser?.email}.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Rôles actuels</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedUser?.roles.length ? selectedUser.roles.map((role) => <Badge key={role} variant="secondary">{role}</Badge>) : <span className="text-muted-foreground text-sm">Aucun rôle attribué</span>}
              </div>
            </div>
            <div>
              <Label htmlFor="role">Ajouter/Retirer un rôle</Label>
              <Select value={newRole} onValueChange={setNewRole}>
                <SelectTrigger><SelectValue placeholder="Sélectionner un rôle" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="evaluator">Évaluateur</SelectItem>
                  <SelectItem value="startup">Startup</SelectItem>
                </SelectContent>
              </Select>
              {selectedUser?.roles.includes(newRole) && newRole && <p className="text-sm text-muted-foreground mt-1">Ce rôle sera retiré de l'utilisateur.</p>}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRoleDialog(false)} disabled={actionLoading}>Annuler</Button>
            <Button onClick={handleRoleChange} disabled={actionLoading || !newRole}>
              {actionLoading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              {selectedUser?.roles.includes(newRole) ? "Retirer le rôle" : "Attribuer le rôle"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Document Request Dialog */}
      <RequestDocumentDialog
        open={showDocumentRequestDialog}
        onOpenChange={setShowDocumentRequestDialog}
        application={selectedApplication}
        onSuccess={() => { fetchData(); setShowDocumentRequestDialog(false); setSelectedApplication(null); }}
        adminUserId={adminUserId}
      />

      {/* Cancel Document Request Alert Dialog */}
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Annuler cette demande de document ?</AlertDialogTitle>
            <AlertDialogDescription>
              La demande de "{DOCUMENT_TYPES.find(d => d.value === requestToCancel?.document_type)?.label || requestToCancel?.document_type}" sera supprimée et la startup sera notifiée de l'annulation.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={!!cancellingRequestId}>Non, garder</AlertDialogCancel>
            <AlertDialogAction onClick={handleCancelDocumentRequest} disabled={!!cancellingRequestId} className="bg-red-600 hover:bg-red-700">
              {cancellingRequestId ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}Oui, annuler
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
