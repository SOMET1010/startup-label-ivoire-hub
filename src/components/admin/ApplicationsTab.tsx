import { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Eye, Clock, CheckCircle, XCircle, FileQuestion, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import ApplicationFilters from "@/components/admin/ApplicationFilters";
import { ApplicationCard } from "@/components/admin/ApplicationCard";
import VoteStatusBadge from "@/components/evaluation/VoteStatusBadge";
import { type ApplicationWithStartup, STATUS_LABELS, SECTOR_LABELS, STAGE_LABELS } from "@/hooks/useAdminDashboard";

interface ApplicationsTabProps {
  applications: ApplicationWithStartup[];
  filteredApplications: ApplicationWithStartup[];
  loading: boolean;
  searchQuery: string;
  onSearchChange: (v: string) => void;
  statusFilter: string;
  onStatusChange: (v: string) => void;
  sectorFilter: string;
  onSectorChange: (v: string) => void;
  dateFilter: string;
  onDateChange: (v: string) => void;
  minScoreFilter: string;
  onMinScoreChange: (v: string) => void;
  pendingDocsOnly: boolean;
  onPendingDocsChange: (v: boolean) => void;
  onReset: () => void;
  getScoreBadge: (score: number | null) => ReactNode;
  openDetailsDialog: (app: ApplicationWithStartup) => void;
  openActionDialog: (app: ApplicationWithStartup, type: "approve" | "reject" | "review") => void;
  openDocumentRequestDialog: (app: ApplicationWithStartup) => void;
}

export default function ApplicationsTab({
  applications, filteredApplications, loading,
  searchQuery, onSearchChange, statusFilter, onStatusChange,
  sectorFilter, onSectorChange, dateFilter, onDateChange,
  minScoreFilter, onMinScoreChange, pendingDocsOnly, onPendingDocsChange,
  onReset, getScoreBadge,
  openDetailsDialog, openActionDialog, openDocumentRequestDialog,
}: ApplicationsTabProps) {
  const canAct = (status: string) => status === "pending" || status === "under_review" || status === "incomplete";

  return (
    <Card>
      <CardHeader><CardTitle>Gestion des candidatures</CardTitle></CardHeader>
      <CardContent>
        <ApplicationFilters
          searchQuery={searchQuery} onSearchChange={onSearchChange}
          statusFilter={statusFilter} onStatusChange={onStatusChange}
          sectorFilter={sectorFilter} onSectorChange={onSectorChange}
          dateFilter={dateFilter} onDateChange={onDateChange}
          minScoreFilter={minScoreFilter} onMinScoreChange={onMinScoreChange}
          pendingDocsOnly={pendingDocsOnly} onPendingDocsChange={onPendingDocsChange}
          onReset={onReset}
          filteredCount={filteredApplications.length} totalCount={applications.length}
        />

        {loading ? (
          <div className="flex items-center justify-center py-8"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
        ) : filteredApplications.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            {applications.length === 0 ? "Aucune candidature pour le moment." : "Aucune candidature ne correspond aux filtres."}
          </p>
        ) : (
          <>
            {/* Mobile */}
            <div className="md:hidden space-y-4">
              {filteredApplications.map((app) => (
                <ApplicationCard
                  key={app.id} id={app.id}
                  startupName={app.startup.name} sector={app.startup.sector} stage={app.startup.stage}
                  candidateName={app.user.full_name} candidateEmail={app.user.email}
                  submittedAt={app.submitted_at} status={app.status}
                  averageScore={app.averageScore} pendingDocsCount={app.pendingDocsCount}
                  votingData={app.votingData} statusLabels={STATUS_LABELS} sectorLabels={SECTOR_LABELS} stageLabels={STAGE_LABELS}
                  onViewDetails={() => openDetailsDialog(app)}
                  onReview={app.status === "pending" ? () => openActionDialog(app, "review") : undefined}
                  onApprove={canAct(app.status) ? () => openActionDialog(app, "approve") : undefined}
                  onReject={canAct(app.status) ? () => openActionDialog(app, "reject") : undefined}
                  onRequestDocument={canAct(app.status) ? () => openDocumentRequestDialog(app) : undefined}
                  getScoreBadge={getScoreBadge}
                />
              ))}
            </div>

            {/* Desktop */}
            <div className="hidden md:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Startup</TableHead>
                    <TableHead>Secteur</TableHead>
                    <TableHead>Stade</TableHead>
                    <TableHead>Candidat</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Vote</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredApplications.map((app) => (
                    <TableRow key={app.id}>
                      <TableCell className="font-medium">{app.startup.name}</TableCell>
                      <TableCell>{SECTOR_LABELS[app.startup.sector || ""] || app.startup.sector || "-"}</TableCell>
                      <TableCell>{STAGE_LABELS[app.startup.stage || ""] || app.startup.stage || "-"}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{app.user.full_name || "-"}</div>
                          <div className="text-sm text-muted-foreground">{app.user.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>{app.submitted_at ? format(new Date(app.submitted_at), "dd MMM yyyy", { locale: fr }) : "-"}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Badge variant={STATUS_LABELS[app.status]?.variant || "secondary"}>{STATUS_LABELS[app.status]?.label || app.status}</Badge>
                          {app.pendingDocsCount > 0 && (
                            <Badge variant="outline" className="bg-orange-100 text-orange-700 border-orange-300 flex items-center gap-1" title={`${app.pendingDocsCount} document(s) en attente`}>
                              <FileQuestion className="h-3 w-3" />{app.pendingDocsCount}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{getScoreBadge(app.averageScore)}</TableCell>
                      <TableCell>
                        {app.votingData && <VoteStatusBadge totalVotes={app.votingData.totalVotes} quorumRequired={app.votingData.quorumRequired} quorumReached={app.votingData.quorumReached} calculatedDecision={app.votingData.calculatedDecision} finalDecision={app.votingData.finalDecision} />}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="sm" onClick={() => openDetailsDialog(app)}><Eye className="h-4 w-4" /></Button>
                          {canAct(app.status) && <Button variant="ghost" size="sm" className="text-orange-600 hover:text-orange-700" onClick={() => openDocumentRequestDialog(app)} title="Demander un document"><FileQuestion className="h-4 w-4" /></Button>}
                          {app.status === "pending" && <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700" onClick={() => openActionDialog(app, "review")} title="Mettre en cours d'examen"><Clock className="h-4 w-4" /></Button>}
                          {canAct(app.status) && (
                            <>
                              <Button variant="ghost" size="sm" className="text-green-600 hover:text-green-700" onClick={() => openActionDialog(app, "approve")} title="Approuver"><CheckCircle className="h-4 w-4" /></Button>
                              <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700" onClick={() => openActionDialog(app, "reject")} title="Rejeter"><XCircle className="h-4 w-4" /></Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
