import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FileCheck, Clock, CheckCircle, FileQuestion, Loader2, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { EvaluationChat } from "@/components/evaluation/EvaluationChat";
import VotingPanel from "@/components/evaluation/VotingPanel";
import DocumentViewer from "@/components/admin/DocumentViewer";
import { DOCUMENT_TYPES } from "@/components/admin/RequestDocumentDialog";
import { type ApplicationWithStartup, type DocumentRequest, STATUS_LABELS, SECTOR_LABELS, STAGE_LABELS } from "@/hooks/useAdminDashboard";

interface ApplicationDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedApplication: ApplicationWithStartup | null;
  documentRequests: DocumentRequest[];
  loadingDocRequests: boolean;
  markingFulfilledId: string | null;
  cancellingRequestId: string | null;
  onMarkAsFulfilled: (id: string) => void;
  onCancelRequest: (req: DocumentRequest) => void;
  onDecisionApplied: () => void;
}

export default function ApplicationDetailDialog({
  open, onOpenChange, selectedApplication,
  documentRequests, loadingDocRequests, markingFulfilledId, cancellingRequestId,
  onMarkAsFulfilled, onCancelRequest, onDecisionApplied,
}: ApplicationDetailDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] p-0 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-5 h-[85vh]">
          {/* Details Panel */}
          <div className="lg:col-span-3 overflow-y-auto">
            <DialogHeader className="p-6 pb-0"><DialogTitle>Détails de la candidature</DialogTitle></DialogHeader>
            <ScrollArea className="h-[calc(85vh-80px)] px-6 pb-6">
              {selectedApplication && (
                <div className="space-y-6 pr-4 pt-4">
                  {/* Startup Info */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Informations de la startup</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div><Label className="text-muted-foreground">Startup</Label><p className="font-medium">{selectedApplication.startup.name}</p></div>
                      <div><Label className="text-muted-foreground">Statut</Label><p><Badge variant={STATUS_LABELS[selectedApplication.status]?.variant || "secondary"}>{STATUS_LABELS[selectedApplication.status]?.label || selectedApplication.status}</Badge></p></div>
                      <div><Label className="text-muted-foreground">Score moyen</Label><p>{selectedApplication.averageScore !== null ? `${selectedApplication.averageScore}/100` : "-"}</p></div>
                      <div><Label className="text-muted-foreground">Secteur</Label><p>{SECTOR_LABELS[selectedApplication.startup.sector || ""] || "-"}</p></div>
                      <div><Label className="text-muted-foreground">Stade</Label><p>{STAGE_LABELS[selectedApplication.startup.stage || ""] || "-"}</p></div>
                      <div><Label className="text-muted-foreground">Équipe</Label><p>{selectedApplication.startup.team_size || "-"} employés</p></div>
                      <div className="col-span-2 md:col-span-3">
                        <Label className="text-muted-foreground">Site web</Label>
                        <p>{selectedApplication.startup.website ? <a href={selectedApplication.startup.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{selectedApplication.startup.website}</a> : "-"}</p>
                      </div>
                    </div>
                    <div><Label className="text-muted-foreground">Description</Label><p className="text-sm mt-1 whitespace-pre-wrap">{selectedApplication.startup.description || "Aucune description fournie."}</p></div>
                  </div>

                  <Separator />

                  {/* Candidate Info */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Informations du candidat</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div><Label className="text-muted-foreground">Candidat</Label><p>{selectedApplication.user.full_name || "-"}</p><p className="text-sm text-muted-foreground">{selectedApplication.user.email}</p></div>
                      <div><Label className="text-muted-foreground">Date de soumission</Label><p>{selectedApplication.submitted_at ? format(new Date(selectedApplication.submitted_at), "dd MMMM yyyy 'à' HH:mm", { locale: fr }) : "-"}</p></div>
                    </div>
                    {selectedApplication.notes && <div><Label className="text-muted-foreground">Notes de l'évaluateur</Label><p className="text-sm mt-1">{selectedApplication.notes}</p></div>}
                  </div>

                  <Separator />

                  {/* Document Requests */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2"><FileQuestion className="h-5 w-5" />Demandes de documents</h3>
                    {loadingDocRequests ? (
                      <div className="flex items-center justify-center py-4"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>
                    ) : documentRequests.length === 0 ? (
                      <p className="text-muted-foreground text-sm">Aucune demande de document pour cette candidature.</p>
                    ) : (
                      <div className="space-y-3">
                        {documentRequests.map((req) => {
                          const isFulfilled = !!req.fulfilled_at;
                          const docLabel = DOCUMENT_TYPES.find(d => d.value === req.document_type)?.label || req.document_type;
                          return (
                            <div key={req.id} className={`p-3 rounded-lg border ${isFulfilled ? "bg-green-50 border-green-200" : "bg-orange-50 border-orange-200"}`}>
                              <div className="flex items-center justify-between mb-1">
                                <div className="flex items-center gap-2">
                                  {isFulfilled ? <FileCheck className="h-4 w-4 text-green-600" /> : <Clock className="h-4 w-4 text-orange-600" />}
                                  <span className="font-medium">{docLabel}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Badge variant={isFulfilled ? "default" : "outline"}>{isFulfilled ? "Fourni" : "En attente"}</Badge>
                                  {!isFulfilled && (
                                    <div className="flex items-center gap-1">
                                      <Button size="sm" variant="outline" className="h-7 text-xs bg-green-50 hover:bg-green-100 text-green-700 border-green-300" onClick={() => onMarkAsFulfilled(req.id)} disabled={markingFulfilledId === req.id || cancellingRequestId === req.id}>
                                        {markingFulfilledId === req.id ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : <CheckCircle className="h-3 w-3 mr-1" />}Marquer fourni
                                      </Button>
                                      <Button size="sm" variant="outline" className="h-7 text-xs bg-red-50 hover:bg-red-100 text-red-700 border-red-300" onClick={() => onCancelRequest(req)} disabled={markingFulfilledId === req.id || cancellingRequestId === req.id}>
                                        {cancellingRequestId === req.id ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : <Trash2 className="h-3 w-3 mr-1" />}Annuler
                                      </Button>
                                    </div>
                                  )}
                                </div>
                              </div>
                              {req.message && <p className="text-sm text-muted-foreground mt-1 ml-6">{req.message}</p>}
                              <div className="text-xs text-muted-foreground mt-2 ml-6">
                                {req.requested_at && <>Demandé le {format(new Date(req.requested_at), "dd MMM yyyy", { locale: fr })}</>}
                                {isFulfilled && req.fulfilled_at && <> • Fourni le {format(new Date(req.fulfilled_at), "dd MMM yyyy", { locale: fr })}</>}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  <Separator />
                  <VotingPanel applicationId={selectedApplication.id} startupName={selectedApplication.startup.name} onDecisionApplied={onDecisionApplied} />
                  <Separator />
                  <DocumentViewer documents={{ doc_rccm: selectedApplication.startup.doc_rccm, doc_tax: selectedApplication.startup.doc_tax, doc_statutes: selectedApplication.startup.doc_statutes, doc_business_plan: selectedApplication.startup.doc_business_plan, doc_cv: selectedApplication.startup.doc_cv, doc_pitch: selectedApplication.startup.doc_pitch, doc_other: selectedApplication.startup.doc_other }} startupName={selectedApplication.startup.name} />
                </div>
              )}
            </ScrollArea>
            <div className="p-4 border-t flex justify-end">
              <Button variant="outline" onClick={() => onOpenChange(false)}>Fermer</Button>
            </div>
          </div>

          {/* Chat Panel */}
          {selectedApplication && (
            <div className="lg:col-span-2 hidden lg:flex flex-col h-full border-l">
              <EvaluationChat applicationId={selectedApplication.id} className="border-0 rounded-none h-full" />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
