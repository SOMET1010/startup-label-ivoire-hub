import { useState, useEffect, useMemo, useCallback } from "react";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { format, subDays, startOfYear, isAfter } from "date-fns";
import { fr } from "date-fns/locale";
import { SECTOR_LABELS, STAGE_LABELS } from "@/lib/constants/startup";
import { DOCUMENT_TYPES } from "@/components/admin/RequestDocumentDialog";

// ── Interfaces ──────────────────────────────────────────────

export interface StartupDocuments {
  doc_rccm: string | null;
  doc_tax: string | null;
  doc_statutes: string | null;
  doc_business_plan: string | null;
  doc_cv: string | null;
  doc_pitch: string | null;
  doc_other: string[] | null;
}

export interface ApplicationWithStartup {
  id: string;
  status: string;
  submitted_at: string | null;
  notes: string | null;
  created_at: string;
  averageScore: number | null;
  pendingDocsCount: number;
  votingData?: {
    totalVotes: number;
    quorumRequired: number;
    quorumReached: boolean;
    calculatedDecision: "approve" | "reject" | "pending" | "tie" | null;
    finalDecision: "approved" | "rejected" | "pending" | null;
  };
  startup: {
    id: string;
    name: string;
    sector: string | null;
    stage: string | null;
    description: string | null;
    website: string | null;
    team_size: number | null;
  } & StartupDocuments;
  user: {
    email: string | null;
    full_name: string | null;
  };
}

export interface UserWithRole {
  id: string;
  user_id: string;
  email: string | null;
  full_name: string | null;
  created_at: string;
  roles: string[];
}

export interface DocumentRequest {
  id: string;
  document_type: string;
  message: string | null;
  requested_at: string | null;
  fulfilled_at: string | null;
}

export interface Stats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  users: number;
}

export const STATUS_LABELS: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  pending: { label: "En attente", variant: "secondary" },
  under_review: { label: "En cours d'examen", variant: "outline" },
  incomplete: { label: "Documents manquants", variant: "outline" },
  approved: { label: "Approuvée", variant: "default" },
  rejected: { label: "Rejetée", variant: "destructive" },
};

export { SECTOR_LABELS, STAGE_LABELS };

// ── Hook ────────────────────────────────────────────────────

export function useAdminDashboard() {
  const [applications, setApplications] = useState<ApplicationWithStartup[]>([]);
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [stats, setStats] = useState<Stats>({ total: 0, pending: 0, approved: 0, rejected: 0, users: 0 });
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Dialog states
  const [selectedApplication, setSelectedApplication] = useState<ApplicationWithStartup | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showActionDialog, setShowActionDialog] = useState(false);
  const [actionType, setActionType] = useState<"approve" | "reject" | "review" | null>(null);
  const [actionNotes, setActionNotes] = useState("");

  // Role management
  const [selectedUser, setSelectedUser] = useState<UserWithRole | null>(null);
  const [showRoleDialog, setShowRoleDialog] = useState(false);
  const [newRole, setNewRole] = useState("");

  // Document request
  const [showDocumentRequestDialog, setShowDocumentRequestDialog] = useState(false);
  const [documentRequests, setDocumentRequests] = useState<DocumentRequest[]>([]);
  const [loadingDocRequests, setLoadingDocRequests] = useState(false);
  const [markingFulfilledId, setMarkingFulfilledId] = useState<string | null>(null);

  // Cancel document request
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [requestToCancel, setRequestToCancel] = useState<DocumentRequest | null>(null);
  const [cancellingRequestId, setCancellingRequestId] = useState<string | null>(null);

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sectorFilter, setSectorFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [minScoreFilter, setMinScoreFilter] = useState("all");
  const [pendingDocsOnly, setPendingDocsOnly] = useState(false);

  const fetchData = useCallback(async () => {
    if (!supabase) return;
    setLoading(true);
    try {
      const { data: appsData, error: appsError } = await supabase
        .from("applications")
        .select("id, status, submitted_at, notes, created_at, startup_id, user_id")
        .order("created_at", { ascending: false });
      if (appsError) throw appsError;

      const startupIds = appsData?.map(a => a.startup_id).filter(Boolean) || [];
      const userIds = appsData?.map(a => a.user_id).filter(Boolean) || [];
      const appIds = appsData?.map(a => a.id) || [];

      const [startupsRes, profilesRes, evaluationsRes, pendingDocsRes, votingRes] = await Promise.all([
        supabase.from("startups").select("id, name, sector, stage, description, website, team_size, doc_rccm, doc_tax, doc_statutes, doc_business_plan, doc_cv, doc_pitch, doc_other").in("id", startupIds),
        supabase.from("profiles").select("user_id, email, full_name").in("user_id", userIds),
        supabase.from("evaluations").select("application_id, total_score, is_submitted, recommendation").in("application_id", appIds).eq("is_submitted", true),
        supabase.from("document_requests").select("application_id").in("application_id", appIds).is("fulfilled_at", null),
        supabase.from("voting_decisions").select("application_id, total_votes, quorum_required, quorum_reached, calculated_decision, final_decision").in("application_id", appIds),
      ]);

      // Compute score averages
      const scoresByApp: Record<string, number[]> = {};
      evaluationsRes.data?.forEach((ev) => {
        if (ev.total_score != null) {
          (scoresByApp[ev.application_id] ??= []).push(Number(ev.total_score));
        }
      });

      // Pending doc counts
      const pendingDocsByApp: Record<string, number> = {};
      pendingDocsRes.data?.forEach((req) => {
        pendingDocsByApp[req.application_id] = (pendingDocsByApp[req.application_id] || 0) + 1;
      });

      // Voting decisions map
      const votingByApp: Record<string, NonNullable<typeof votingRes.data>[0]> = {};
      votingRes.data?.forEach((vd) => { votingByApp[vd.application_id] = vd; });

      // Vote counts from evaluations
      const voteCountsByApp: Record<string, { approve: number; reject: number; pending: number }> = {};
      evaluationsRes.data?.forEach((ev) => {
        const vc = (voteCountsByApp[ev.application_id] ??= { approve: 0, reject: 0, pending: 0 });
        if (ev.recommendation === "approve") vc.approve++;
        else if (ev.recommendation === "reject") vc.reject++;
        else vc.pending++;
      });

      const emptyStartup = { id: "", name: "Startup inconnue", sector: null, stage: null, description: null, website: null, team_size: null, doc_rccm: null, doc_tax: null, doc_statutes: null, doc_business_plan: null, doc_cv: null, doc_pitch: null, doc_other: null };

      const applicationsWithDetails: ApplicationWithStartup[] = (appsData || []).map(app => {
        const startup = startupsRes.data?.find(s => s.id === app.startup_id) || emptyStartup;
        const profile = profilesRes.data?.find(p => p.user_id === app.user_id);
        const scores = scoresByApp[app.id] || [];
        const averageScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : null;

        const vd = votingByApp[app.id];
        const vc = voteCountsByApp[app.id] || { approve: 0, reject: 0, pending: 0 };
        const totalVotes = vc.approve + vc.reject + vc.pending;
        const quorumRequired = vd?.quorum_required ?? 3;
        const quorumReached = vd?.quorum_reached ?? (totalVotes >= quorumRequired);

        let calculatedDecision: "approve" | "reject" | "pending" | "tie" | null = null;
        if (quorumReached && totalVotes > 0) {
          if (vc.approve > vc.reject && vc.approve > vc.pending) calculatedDecision = "approve";
          else if (vc.reject > vc.approve && vc.reject > vc.pending) calculatedDecision = "reject";
          else if (vc.approve === vc.reject && vc.approve > 0) calculatedDecision = "tie";
          else calculatedDecision = "pending";
        }

        return {
          id: app.id, status: app.status || "pending", submitted_at: app.submitted_at,
          notes: app.notes, created_at: app.created_at, averageScore,
          pendingDocsCount: pendingDocsByApp[app.id] || 0,
          votingData: {
            totalVotes, quorumRequired, quorumReached,
            calculatedDecision: (vd?.calculated_decision as typeof calculatedDecision) ?? calculatedDecision,
            finalDecision: (vd?.final_decision as "approved" | "rejected" | "pending" | null) ?? null,
          },
          startup, user: { email: profile?.email || null, full_name: profile?.full_name || null },
        };
      });

      setApplications(applicationsWithDetails);

      // Users with roles
      const [allProfilesRes, rolesRes] = await Promise.all([
        supabase.from("profiles").select("id, user_id, email, full_name, created_at").order("created_at", { ascending: false }),
        supabase.from("user_roles").select("user_id, role"),
      ]);

      const usersWithRoles: UserWithRole[] = (allProfilesRes.data || []).map(p => ({
        id: p.id, user_id: p.user_id, email: p.email, full_name: p.full_name, created_at: p.created_at,
        roles: rolesRes.data?.filter(r => r.user_id === p.user_id).map(r => r.role) || [],
      }));
      setUsers(usersWithRoles);

      const total = applicationsWithDetails.length;
      setStats({
        total,
        pending: applicationsWithDetails.filter(a => a.status === "pending" || a.status === "under_review").length,
        approved: applicationsWithDetails.filter(a => a.status === "approved").length,
        rejected: applicationsWithDetails.filter(a => a.status === "rejected").length,
        users: usersWithRoles.length,
      });
    } catch (error: unknown) {
      console.error("Error fetching data:", error);
      toast({ variant: "destructive", title: "Erreur", description: "Impossible de charger les données." });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  // Filtered applications
  const filteredApplications = useMemo(() => {
    return applications.filter((app) => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        if (!app.startup.name.toLowerCase().includes(q) && !app.user.email?.toLowerCase().includes(q) && !app.user.full_name?.toLowerCase().includes(q)) return false;
      }
      if (statusFilter !== "all" && app.status !== statusFilter) return false;
      if (sectorFilter !== "all" && app.startup.sector !== sectorFilter) return false;
      if (dateFilter !== "all" && app.submitted_at) {
        const submittedDate = new Date(app.submitted_at);
        const now = new Date();
        const cutoffs: Record<string, Date> = { "7days": subDays(now, 7), "30days": subDays(now, 30), "90days": subDays(now, 90), "year": startOfYear(now) };
        if (cutoffs[dateFilter] && !isAfter(submittedDate, cutoffs[dateFilter])) return false;
      }
      if (minScoreFilter !== "all") {
        const minScore = parseInt(minScoreFilter);
        if (app.averageScore === null || app.averageScore < minScore) return false;
      }
      if (pendingDocsOnly && app.pendingDocsCount === 0) return false;
      return true;
    });
  }, [applications, searchQuery, statusFilter, sectorFilter, dateFilter, minScoreFilter, pendingDocsOnly]);

  const resetFilters = () => {
    setSearchQuery(""); setStatusFilter("all"); setSectorFilter("all");
    setDateFilter("all"); setMinScoreFilter("all"); setPendingDocsOnly(false);
  };

  const getScoreBadge = (score: number | null) => {
    if (score === null) return <Badge variant="outline" className="text-muted-foreground">-</Badge>;
    if (score >= 80) return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">{score}</Badge>;
    if (score >= 60) return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">{score}</Badge>;
    return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">{score}</Badge>;
  };

  // ── Handlers ────────────────────────────────────────────

  const handleStatusChange = async () => {
    if (!selectedApplication || !actionType || !supabase) return;
    setActionLoading(true);
    try {
      const oldStatus = selectedApplication.status;
      const newStatus = actionType === "approve" ? "approved" : actionType === "reject" ? "rejected" : "under_review";
      const { error } = await supabase.from("applications").update({ status: newStatus, notes: actionNotes || null, reviewed_at: new Date().toISOString() }).eq("id", selectedApplication.id);
      if (error) throw error;
      if (actionType === "approve") await supabase.from("startups").update({ status: "labeled" }).eq("id", selectedApplication.startup.id);

      const actionLabels = { approve: { past: "approuvée", action: "Candidature approuvée" }, reject: { past: "rejetée", action: "Candidature rejetée" }, review: { past: "mise en cours d'examen", action: "Candidature en examen" } };

      try {
        const { error: notifyError } = await supabase.functions.invoke("notify-application-status", { body: { application_id: selectedApplication.id, new_status: newStatus, old_status: oldStatus, notes: actionNotes || null } });
        toast({ title: actionLabels[actionType].action, description: `La candidature de ${selectedApplication.startup.name} a été ${actionLabels[actionType].past}.${notifyError ? "" : " Un email a été envoyé."}` });
      } catch { toast({ title: actionLabels[actionType].action, description: `La candidature de ${selectedApplication.startup.name} a été ${actionLabels[actionType].past}.` }); }

      setShowActionDialog(false); setSelectedApplication(null); setActionType(null); setActionNotes("");
      fetchData();
    } catch (error: unknown) {
      console.error("Error updating status:", error);
      toast({ variant: "destructive", title: "Erreur", description: "Impossible de mettre à jour le statut." });
    } finally { setActionLoading(false); }
  };

  const handleRoleChange = async () => {
    if (!selectedUser || !newRole || !supabase) return;
    setActionLoading(true);
    try {
      const hasRole = selectedUser.roles.includes(newRole);
      if (hasRole) {
        const { error } = await supabase.from("user_roles").delete().eq("user_id", selectedUser.user_id).eq("role", newRole);
        if (error) throw error;
        toast({ title: "Rôle retiré", description: `Le rôle "${newRole}" a été retiré de ${selectedUser.full_name || selectedUser.email}.` });
      } else {
        const { error } = await supabase.from("user_roles").insert({ user_id: selectedUser.user_id, role: newRole });
        if (error) throw error;
        toast({ title: "Rôle attribué", description: `Le rôle "${newRole}" a été attribué à ${selectedUser.full_name || selectedUser.email}.` });
      }
      setShowRoleDialog(false); setSelectedUser(null); setNewRole("");
      fetchData();
    } catch (error: unknown) {
      console.error("Error updating role:", error);
      toast({ variant: "destructive", title: "Erreur", description: "Impossible de modifier le rôle." });
    } finally { setActionLoading(false); }
  };

  const fetchDocumentRequests = async (applicationId: string) => {
    setLoadingDocRequests(true);
    try {
      const { data, error } = await supabase!.from("document_requests").select("id, document_type, message, requested_at, fulfilled_at").eq("application_id", applicationId).order("requested_at", { ascending: false });
      if (error) throw error;
      setDocumentRequests(data || []);
    } catch { setDocumentRequests([]); } finally { setLoadingDocRequests(false); }
  };

  const handleMarkAsFulfilled = async (requestId: string) => {
    if (!supabase || !selectedApplication) return;
    setMarkingFulfilledId(requestId);
    try {
      const { error } = await supabase.from("document_requests").update({ fulfilled_at: new Date().toISOString() }).eq("id", requestId);
      if (error) throw error;
      setDocumentRequests(prev => prev.map(req => req.id === requestId ? { ...req, fulfilled_at: new Date().toISOString() } : req));
      toast({ title: "Document marqué comme fourni" });
      fetchData();
    } catch { toast({ variant: "destructive", title: "Erreur", description: "Impossible de marquer le document comme fourni." }); }
    finally { setMarkingFulfilledId(null); }
  };

  const handleCancelDocumentRequest = async () => {
    if (!supabase || !requestToCancel || !selectedApplication) return;
    setCancellingRequestId(requestToCancel.id);
    try {
      const { error } = await supabase.from("document_requests").delete().eq("id", requestToCancel.id);
      if (error) throw error;
      const { data: appData } = await supabase.from("applications").select("user_id").eq("id", selectedApplication.id).single();
      if (appData?.user_id) {
        const docLabel = DOCUMENT_TYPES.find(d => d.value === requestToCancel.document_type)?.label || requestToCancel.document_type;
        await supabase.from("startup_notifications").insert({ user_id: appData.user_id, type: "document_request_cancelled", title: "Demande de document annulée", message: `La demande de "${docLabel}" pour votre candidature a été annulée.`, link: "/suivi-candidature", metadata: { application_id: selectedApplication.id, document_type: requestToCancel.document_type } });
      }
      setDocumentRequests(prev => prev.filter(req => req.id !== requestToCancel.id));
      toast({ title: "Demande annulée" });
      fetchData();
    } catch { toast({ variant: "destructive", title: "Erreur", description: "Impossible d'annuler la demande." }); }
    finally { setCancellingRequestId(null); setShowCancelDialog(false); setRequestToCancel(null); }
  };

  const openDetailsDialog = (app: ApplicationWithStartup) => { setSelectedApplication(app); setShowDetailsDialog(true); fetchDocumentRequests(app.id); };
  const openActionDialog = (app: ApplicationWithStartup, type: "approve" | "reject" | "review") => { setSelectedApplication(app); setActionType(type); setActionNotes(""); setShowActionDialog(true); };
  const openRoleDialog = (u: UserWithRole) => { setSelectedUser(u); setNewRole(""); setShowRoleDialog(true); };
  const openDocumentRequestDialog = (app: ApplicationWithStartup) => { setSelectedApplication(app); setShowDocumentRequestDialog(true); };

  return {
    applications, users, stats, loading, actionLoading, filteredApplications,
    // Dialog states
    selectedApplication, showDetailsDialog, setShowDetailsDialog,
    showActionDialog, setShowActionDialog, actionType, actionNotes, setActionNotes,
    selectedUser, showRoleDialog, setShowRoleDialog, newRole, setNewRole,
    showDocumentRequestDialog, setShowDocumentRequestDialog,
    documentRequests, loadingDocRequests, markingFulfilledId, cancellingRequestId,
    showCancelDialog, setShowCancelDialog, requestToCancel, setRequestToCancel,
    // Filters
    searchQuery, setSearchQuery, statusFilter, setStatusFilter,
    sectorFilter, setSectorFilter, dateFilter, setDateFilter,
    minScoreFilter, setMinScoreFilter, pendingDocsOnly, setPendingDocsOnly,
    // Handlers
    fetchData, resetFilters, getScoreBadge,
    handleStatusChange, handleRoleChange, handleMarkAsFulfilled, handleCancelDocumentRequest,
    openDetailsDialog, openActionDialog, openRoleDialog, openDocumentRequestDialog,
    setSelectedApplication,
  };
}
