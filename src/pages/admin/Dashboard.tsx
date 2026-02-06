import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  FileCheck,
  Users,
  Building,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Loader2,
  RefreshCw,
  Shield,
  Star,
  FileQuestion,
  Trash2,
  BarChart3,
  Settings,
  FileText,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { format, subDays, startOfYear, isAfter } from "date-fns";
import { fr } from "date-fns/locale";
import { useAuth } from "@/contexts/AuthContext";
import EvaluationList from "@/components/evaluation/EvaluationList";
import { EvaluationChat } from "@/components/evaluation/EvaluationChat";
import VotingPanel from "@/components/evaluation/VotingPanel";
import VoteStatusBadge from "@/components/evaluation/VoteStatusBadge";
import ApplicationFilters from "@/components/admin/ApplicationFilters";
import DocumentViewer from "@/components/admin/DocumentViewer";
import RequestDocumentDialog, { DOCUMENT_TYPES } from "@/components/admin/RequestDocumentDialog";
import VotingStatsDashboard from "@/components/admin/VotingStatsDashboard";
import { ApplicationCard } from "@/components/admin/ApplicationCard";
import AdminPlatformSettings from "@/components/admin/AdminPlatformSettings";
import AdminLegalDocuments from "@/components/admin/AdminLegalDocuments";
import AdminCommitteeMembers from "@/components/admin/AdminCommitteeMembers";

interface StartupDocuments {
  doc_rccm: string | null;
  doc_tax: string | null;
  doc_statutes: string | null;
  doc_business_plan: string | null;
  doc_cv: string | null;
  doc_pitch: string | null;
  doc_other: string[] | null;
}

interface ApplicationWithStartup {
  id: string;
  status: string;
  submitted_at: string | null;
  notes: string | null;
  created_at: string;
  averageScore: number | null;
  pendingDocsCount: number;
  // Voting data
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

interface UserWithRole {
  id: string;
  user_id: string;
  email: string | null;
  full_name: string | null;
  created_at: string;
  roles: string[];
}

interface DocumentRequest {
  id: string;
  document_type: string;
  message: string | null;
  requested_at: string | null;
  fulfilled_at: string | null;
}

interface Stats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  users: number;
}

const STATUS_LABELS: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  pending: { label: "En attente", variant: "secondary" },
  under_review: { label: "En cours d'examen", variant: "outline" },
  incomplete: { label: "Documents manquants", variant: "outline" },
  approved: { label: "Approuvée", variant: "default" },
  rejected: { label: "Rejetée", variant: "destructive" },
};

const SECTOR_LABELS: Record<string, string> = {
  fintech: "FinTech",
  edtech: "EdTech",
  healthtech: "HealthTech",
  agritech: "AgriTech",
  ecommerce: "E-commerce",
  mobility: "Mobilité",
  cleantech: "CleanTech",
  proptech: "PropTech",
  other: "Autre",
};

const STAGE_LABELS: Record<string, string> = {
  idea: "Idéation",
  mvp: "MVP",
  early: "Early Stage",
  growth: "Growth",
  scale: "Scale-up",
};

export default function AdminDashboard() {
  const { user, profile, isAdmin } = useAuth();
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

  const fetchData = async () => {
    if (!supabase) return;
    
    setLoading(true);
    try {
      // Fetch applications with startup and user data
      const { data: appsData, error: appsError } = await supabase
        .from("applications")
        .select(`
          id,
          status,
          submitted_at,
          notes,
          created_at,
          startup_id,
          user_id
        `)
        .order("created_at", { ascending: false });

      if (appsError) throw appsError;

      // Fetch startups with documents
      const startupIds = appsData?.map(a => a.startup_id).filter(Boolean) || [];
      const { data: startupsData } = await supabase
        .from("startups")
        .select("id, name, sector, stage, description, website, team_size, doc_rccm, doc_tax, doc_statutes, doc_business_plan, doc_cv, doc_pitch, doc_other")
        .in("id", startupIds);

      // Fetch profiles
      const userIds = appsData?.map(a => a.user_id).filter(Boolean) || [];
      const { data: profilesData } = await supabase
        .from("profiles")
        .select("user_id, email, full_name")
        .in("user_id", userIds);

      // Fetch evaluations for average scores
      const appIds = appsData?.map(a => a.id) || [];
      const { data: evaluationsData } = await supabase
        .from("evaluations")
        .select("application_id, total_score, is_submitted, recommendation")
        .in("application_id", appIds)
        .eq("is_submitted", true);

      // Calculate average scores per application
      const scoresByApp: Record<string, number[]> = {};
      evaluationsData?.forEach((ev) => {
        if (ev.total_score != null) {
          if (!scoresByApp[ev.application_id]) {
            scoresByApp[ev.application_id] = [];
          }
          scoresByApp[ev.application_id].push(Number(ev.total_score));
        }
      });

      // Fetch pending document requests per application
      const { data: pendingDocRequestsData } = await supabase
        .from('document_requests')
        .select('application_id')
        .in('application_id', appIds)
        .is('fulfilled_at', null);

      // Count pending requests per application
      const pendingDocsByApp: Record<string, number> = {};
      pendingDocRequestsData?.forEach((req) => {
        pendingDocsByApp[req.application_id] = (pendingDocsByApp[req.application_id] || 0) + 1;
      });

      // Fetch voting decisions
      const { data: votingDecisionsData } = await supabase
        .from('voting_decisions')
        .select('application_id, total_votes, quorum_required, quorum_reached, calculated_decision, final_decision')
        .in('application_id', appIds);

      // Map voting decisions by application
      const votingByApp: Record<string, typeof votingDecisionsData[0]> = {};
      votingDecisionsData?.forEach((vd) => {
        votingByApp[vd.application_id] = vd;
      });

      // Calculate voting data from evaluations for apps without voting_decisions
      const voteCountsByApp: Record<string, { approve: number; reject: number; pending: number }> = {};
      evaluationsData?.forEach((ev) => {
        if (!voteCountsByApp[ev.application_id]) {
          voteCountsByApp[ev.application_id] = { approve: 0, reject: 0, pending: 0 };
        }
        if (ev.recommendation === 'approve') {
          voteCountsByApp[ev.application_id].approve++;
        } else if (ev.recommendation === 'reject') {
          voteCountsByApp[ev.application_id].reject++;
        } else {
          voteCountsByApp[ev.application_id].pending++;
        }
      });

      // Combine data
      const applicationsWithDetails: ApplicationWithStartup[] = (appsData || []).map(app => {
        const startup = startupsData?.find(s => s.id === app.startup_id);
        const profile = profilesData?.find(p => p.user_id === app.user_id);
        const scores = scoresByApp[app.id] || [];
        const averageScore = scores.length > 0 
          ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) 
          : null;
        
        // Build voting data
        const vd = votingByApp[app.id];
        const vc = voteCountsByApp[app.id] || { approve: 0, reject: 0, pending: 0 };
        const totalVotes = vc.approve + vc.reject + vc.pending;
        const quorumRequired = vd?.quorum_required ?? 3;
        const quorumReached = vd?.quorum_reached ?? (totalVotes >= quorumRequired);
        
        let calculatedDecision: "approve" | "reject" | "pending" | "tie" | null = null;
        if (quorumReached && totalVotes > 0) {
          if (vc.approve > vc.reject && vc.approve > vc.pending) {
            calculatedDecision = "approve";
          } else if (vc.reject > vc.approve && vc.reject > vc.pending) {
            calculatedDecision = "reject";
          } else if (vc.approve === vc.reject && vc.approve > 0) {
            calculatedDecision = "tie";
          } else {
            calculatedDecision = "pending";
          }
        }
        
        return {
          id: app.id,
          status: app.status || "pending",
          submitted_at: app.submitted_at,
          notes: app.notes,
          created_at: app.created_at,
          averageScore,
          pendingDocsCount: pendingDocsByApp[app.id] || 0,
          votingData: {
            totalVotes,
            quorumRequired,
            quorumReached,
            calculatedDecision: vd?.calculated_decision as typeof calculatedDecision ?? calculatedDecision,
            finalDecision: vd?.final_decision as "approved" | "rejected" | "pending" | null ?? null,
          },
          startup: startup || {
            id: "", 
            name: "Startup inconnue", 
            sector: null, 
            stage: null, 
            description: null, 
            website: null, 
            team_size: null,
            doc_rccm: null,
            doc_tax: null,
            doc_statutes: null,
            doc_business_plan: null,
            doc_cv: null,
            doc_pitch: null,
            doc_other: null,
          },
          user: { email: profile?.email || null, full_name: profile?.full_name || null },
        };
      });

      setApplications(applicationsWithDetails);

      // Fetch users with roles
      const { data: allProfiles } = await supabase
        .from("profiles")
        .select("id, user_id, email, full_name, created_at")
        .order("created_at", { ascending: false });

      const { data: rolesData } = await supabase
        .from("user_roles")
        .select("user_id, role");

      const usersWithRoles: UserWithRole[] = (allProfiles || []).map(profile => {
        const userRoles = rolesData?.filter(r => r.user_id === profile.user_id).map(r => r.role) || [];
        return {
          id: profile.id,
          user_id: profile.user_id,
          email: profile.email,
          full_name: profile.full_name,
          created_at: profile.created_at,
          roles: userRoles,
        };
      });

      setUsers(usersWithRoles);

      // Calculate stats
      const total = applicationsWithDetails.length;
      const pending = applicationsWithDetails.filter(a => a.status === "pending" || a.status === "under_review").length;
      const approved = applicationsWithDetails.filter(a => a.status === "approved").length;
      const rejected = applicationsWithDetails.filter(a => a.status === "rejected").length;

      setStats({
        total,
        pending,
        approved,
        rejected,
        users: usersWithRoles.length,
      });
    } catch (error: any) {
      console.error("Error fetching data:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les données.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filtered applications logic
  const filteredApplications = useMemo(() => {
    return applications.filter((app) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesName = app.startup.name.toLowerCase().includes(query);
        const matchesEmail = app.user.email?.toLowerCase().includes(query);
        const matchesFullName = app.user.full_name?.toLowerCase().includes(query);
        if (!matchesName && !matchesEmail && !matchesFullName) return false;
      }

      // Status filter
      if (statusFilter !== "all" && app.status !== statusFilter) return false;

      // Sector filter
      if (sectorFilter !== "all" && app.startup.sector !== sectorFilter) return false;

      // Date filter
      if (dateFilter !== "all" && app.submitted_at) {
        const submittedDate = new Date(app.submitted_at);
        const now = new Date();
        let cutoffDate: Date;

        switch (dateFilter) {
          case "7days":
            cutoffDate = subDays(now, 7);
            break;
          case "30days":
            cutoffDate = subDays(now, 30);
            break;
          case "90days":
            cutoffDate = subDays(now, 90);
            break;
          case "year":
            cutoffDate = startOfYear(now);
            break;
          default:
            cutoffDate = new Date(0);
        }

        if (!isAfter(submittedDate, cutoffDate)) return false;
      }

      // Score filter
      if (minScoreFilter !== "all") {
        const minScore = parseInt(minScoreFilter);
        if (app.averageScore === null || app.averageScore < minScore) return false;
      }

      // Pending docs filter
      if (pendingDocsOnly && app.pendingDocsCount === 0) return false;

      return true;
    });
  }, [applications, searchQuery, statusFilter, sectorFilter, dateFilter, minScoreFilter, pendingDocsOnly]);

  const resetFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setSectorFilter("all");
    setDateFilter("all");
    setMinScoreFilter("all");
    setPendingDocsOnly(false);
  };

  const getScoreBadge = (score: number | null) => {
    if (score === null) {
      return <Badge variant="outline" className="text-muted-foreground">-</Badge>;
    }
    if (score >= 80) {
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">{score}</Badge>;
    }
    if (score >= 60) {
      return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">{score}</Badge>;
    }
    return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">{score}</Badge>;
  };

  const handleStatusChange = async () => {
    if (!selectedApplication || !actionType || !supabase) return;

    setActionLoading(true);
    try {
      const oldStatus = selectedApplication.status;
      const newStatus = actionType === "approve" ? "approved" : actionType === "reject" ? "rejected" : "under_review";
      
      const { error } = await supabase
        .from("applications")
        .update({
          status: newStatus,
          notes: actionNotes || null,
          reviewed_at: new Date().toISOString(),
        })
        .eq("id", selectedApplication.id);

      if (error) throw error;

      // Update startup status if approved
      if (actionType === "approve") {
        await supabase
          .from("startups")
          .update({ status: "labeled" })
          .eq("id", selectedApplication.startup.id);
      }

      const actionLabels = {
        approve: { past: "approuvée", action: "Candidature approuvée" },
        reject: { past: "rejetée", action: "Candidature rejetée" },
        review: { past: "mise en cours d'examen", action: "Candidature en examen" },
      };

      // Send email notification via edge function
      try {
        const { error: notifyError } = await supabase.functions.invoke("notify-application-status", {
          body: {
            application_id: selectedApplication.id,
            new_status: newStatus,
            old_status: oldStatus,
            notes: actionNotes || null,
          },
        });

        if (notifyError) {
          console.error("Error sending notification:", notifyError);
          // Don't fail the whole operation if notification fails
          toast({
            variant: "default",
            title: "Statut mis à jour",
            description: "La notification email n'a pas pu être envoyée.",
          });
        } else {
          toast({
            title: actionLabels[actionType].action,
            description: `La candidature de ${selectedApplication.startup.name} a été ${actionLabels[actionType].past}. Un email a été envoyé.`,
          });
        }
      } catch (notifyErr) {
        console.error("Error invoking notification function:", notifyErr);
        toast({
          title: actionLabels[actionType].action,
          description: `La candidature de ${selectedApplication.startup.name} a été ${actionLabels[actionType].past}.`,
        });
      }

      setShowActionDialog(false);
      setSelectedApplication(null);
      setActionType(null);
      setActionNotes("");
      fetchData();
    } catch (error: any) {
      console.error("Error updating status:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour le statut.",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleRoleChange = async () => {
    if (!selectedUser || !newRole || !supabase) return;

    setActionLoading(true);
    try {
      // Check if user already has this role
      const hasRole = selectedUser.roles.includes(newRole);
      
      if (hasRole) {
        // Remove role
        const { error } = await supabase
          .from("user_roles")
          .delete()
          .eq("user_id", selectedUser.user_id)
          .eq("role", newRole);

        if (error) throw error;

        toast({
          title: "Rôle retiré",
          description: `Le rôle "${newRole}" a été retiré de ${selectedUser.full_name || selectedUser.email}.`,
        });
      } else {
        // Add role
        const { error } = await supabase
          .from("user_roles")
          .insert({
            user_id: selectedUser.user_id,
            role: newRole,
          });

        if (error) throw error;

        toast({
          title: "Rôle attribué",
          description: `Le rôle "${newRole}" a été attribué à ${selectedUser.full_name || selectedUser.email}.`,
        });
      }

      setShowRoleDialog(false);
      setSelectedUser(null);
      setNewRole("");
      fetchData();
    } catch (error: any) {
      console.error("Error updating role:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de modifier le rôle.",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const openActionDialog = (app: ApplicationWithStartup, type: "approve" | "reject" | "review") => {
    setSelectedApplication(app);
    setActionType(type);
    setActionNotes("");
    setShowActionDialog(true);
  };

  const fetchDocumentRequests = async (applicationId: string) => {
    setLoadingDocRequests(true);
    try {
      const { data, error } = await supabase
        .from('document_requests')
        .select('id, document_type, message, requested_at, fulfilled_at')
        .eq('application_id', applicationId)
        .order('requested_at', { ascending: false });
      
      if (error) throw error;
      setDocumentRequests(data || []);
    } catch (error) {
      console.error('Error fetching document requests:', error);
      setDocumentRequests([]);
    } finally {
      setLoadingDocRequests(false);
    }
  };

  const handleMarkAsFulfilled = async (requestId: string) => {
    if (!supabase || !selectedApplication) return;
    
    setMarkingFulfilledId(requestId);
    try {
      const { error } = await supabase
        .from('document_requests')
        .update({ fulfilled_at: new Date().toISOString() })
        .eq('id', requestId);

      if (error) throw error;

      // Update local state
      setDocumentRequests(prev => 
        prev.map(req => 
          req.id === requestId 
            ? { ...req, fulfilled_at: new Date().toISOString() } 
            : req
        )
      );

      toast({
        title: "Document marqué comme fourni",
        description: "La demande de document a été mise à jour.",
      });

      // Refresh main data to update pending count
      fetchData();
    } catch (error) {
      console.error('Error marking document as fulfilled:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de marquer le document comme fourni.",
      });
    } finally {
      setMarkingFulfilledId(null);
    }
  };

  const handleCancelDocumentRequest = async () => {
    if (!supabase || !requestToCancel || !selectedApplication) return;

    setCancellingRequestId(requestToCancel.id);
    try {
      // 1. Delete the document request
      const { error } = await supabase
        .from('document_requests')
        .delete()
        .eq('id', requestToCancel.id);

      if (error) throw error;

      // 2. Get the user_id from the application
      const { data: appData } = await supabase
        .from("applications")
        .select("user_id")
        .eq("id", selectedApplication.id)
        .single();

      // 3. Create a notification for the startup
      if (appData?.user_id) {
        const docLabel = DOCUMENT_TYPES.find(d => d.value === requestToCancel.document_type)?.label || requestToCancel.document_type;

        await supabase.from("startup_notifications").insert({
          user_id: appData.user_id,
          type: "document_request_cancelled",
          title: "Demande de document annulée",
          message: `La demande de "${docLabel}" pour votre candidature a été annulée par l'équipe d'évaluation.`,
          link: "/suivi-candidature",
          metadata: {
            application_id: selectedApplication.id,
            document_type: requestToCancel.document_type,
          },
        });
      }

      // 4. Update local state
      setDocumentRequests(prev => prev.filter(req => req.id !== requestToCancel.id));

      toast({
        title: "Demande annulée",
        description: "La demande de document a été supprimée et la startup notifiée.",
      });

      // 5. Refresh main data to update pending count
      fetchData();
    } catch (error) {
      console.error('Error cancelling document request:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'annuler la demande de document.",
      });
    } finally {
      setCancellingRequestId(null);
      setShowCancelDialog(false);
      setRequestToCancel(null);
    }
  };

  const openDetailsDialog = (app: ApplicationWithStartup) => {
    setSelectedApplication(app);
    setShowDetailsDialog(true);
    fetchDocumentRequests(app.id);
  };

  const openRoleDialog = (user: UserWithRole) => {
    setSelectedUser(user);
    setNewRole("");
    setShowRoleDialog(true);
  };

  const openDocumentRequestDialog = (app: ApplicationWithStartup) => {
    setSelectedApplication(app);
    setShowDocumentRequestDialog(true);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow bg-muted/30">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Tableau de bord Admin</h1>
              <p className="text-muted-foreground">
                Vue d'ensemble de la plateforme de labellisation.
              </p>
            </div>
            <Button variant="outline" onClick={fetchData} disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
              Actualiser
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Candidatures totales</CardTitle>
                <FileCheck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.total}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">En attente</CardTitle>
                <Clock className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.pending}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Approuvées</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.approved}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Rejetées</CardTitle>
                <XCircle className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.rejected}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Utilisateurs</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.users}</div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="applications" className="space-y-4">
            <TabsList className="flex-wrap">
              <TabsTrigger value="applications">Candidatures</TabsTrigger>
              <TabsTrigger value="evaluations" className="flex items-center gap-1">
                <Star className="h-4 w-4" />
                Évaluations
              </TabsTrigger>
              <TabsTrigger value="statistiques" className="flex items-center gap-1">
                <BarChart3 className="h-4 w-4" />
                Statistiques
              </TabsTrigger>
              <TabsTrigger value="users">Utilisateurs & Rôles</TabsTrigger>
              {isAdmin && (
                <>
                  <TabsTrigger value="settings" className="flex items-center gap-1">
                    <Settings className="h-4 w-4" />
                    Paramètres
                  </TabsTrigger>
                  <TabsTrigger value="documents" className="flex items-center gap-1">
                    <FileText className="h-4 w-4" />
                    Documents
                  </TabsTrigger>
                  <TabsTrigger value="comite" className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    Comité
                  </TabsTrigger>
                </>
              )}</TabsList>

            {/* Applications Tab */}
            <TabsContent value="applications">
              <Card>
                <CardHeader>
                  <CardTitle>Gestion des candidatures</CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Filters */}
                  <ApplicationFilters
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    statusFilter={statusFilter}
                    onStatusChange={setStatusFilter}
                    sectorFilter={sectorFilter}
                    onSectorChange={setSectorFilter}
                    dateFilter={dateFilter}
                    onDateChange={setDateFilter}
                    minScoreFilter={minScoreFilter}
                    onMinScoreChange={setMinScoreFilter}
                    pendingDocsOnly={pendingDocsOnly}
                    onPendingDocsChange={setPendingDocsOnly}
                    onReset={resetFilters}
                    filteredCount={filteredApplications.length}
                    totalCount={applications.length}
                  />

                  {loading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                  ) : filteredApplications.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">
                      {applications.length === 0 
                        ? "Aucune candidature pour le moment."
                        : "Aucune candidature ne correspond aux filtres."}
                    </p>
                  ) : (
                    <>
                      {/* Vue Mobile : Cards */}
                      <div className="md:hidden space-y-4">
                        {filteredApplications.map((app) => (
                          <ApplicationCard
                            key={app.id}
                            id={app.id}
                            startupName={app.startup.name}
                            sector={app.startup.sector}
                            stage={app.startup.stage}
                            candidateName={app.user.full_name}
                            candidateEmail={app.user.email}
                            submittedAt={app.submitted_at}
                            status={app.status}
                            averageScore={app.averageScore}
                            pendingDocsCount={app.pendingDocsCount}
                            votingData={app.votingData}
                            statusLabels={STATUS_LABELS}
                            sectorLabels={SECTOR_LABELS}
                            stageLabels={STAGE_LABELS}
                            onViewDetails={() => openDetailsDialog(app)}
                            onReview={app.status === "pending" ? () => openActionDialog(app, "review") : undefined}
                            onApprove={(app.status === "pending" || app.status === "under_review" || app.status === "incomplete") ? () => openActionDialog(app, "approve") : undefined}
                            onReject={(app.status === "pending" || app.status === "under_review" || app.status === "incomplete") ? () => openActionDialog(app, "reject") : undefined}
                            onRequestDocument={(app.status === "pending" || app.status === "under_review" || app.status === "incomplete") ? () => openDocumentRequestDialog(app) : undefined}
                            getScoreBadge={getScoreBadge}
                          />
                        ))}
                      </div>

                      {/* Vue Desktop : Tableau */}
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
                              <TableCell>
                                {app.submitted_at
                                  ? format(new Date(app.submitted_at), "dd MMM yyyy", { locale: fr })
                                  : "-"}
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Badge variant={STATUS_LABELS[app.status]?.variant || "secondary"}>
                                    {STATUS_LABELS[app.status]?.label || app.status}
                                  </Badge>
                                  {app.pendingDocsCount > 0 && (
                                    <Badge 
                                      variant="outline"
                                      className="bg-orange-100 text-orange-700 border-orange-300 flex items-center gap-1"
                                      title={`${app.pendingDocsCount} document(s) en attente`}
                                    >
                                      <FileQuestion className="h-3 w-3" />
                                      {app.pendingDocsCount}
                                    </Badge>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell>
                                {getScoreBadge(app.averageScore)}
                              </TableCell>
                              <TableCell>
                                {app.votingData && (
                                  <VoteStatusBadge
                                    totalVotes={app.votingData.totalVotes}
                                    quorumRequired={app.votingData.quorumRequired}
                                    quorumReached={app.votingData.quorumReached}
                                    calculatedDecision={app.votingData.calculatedDecision}
                                    finalDecision={app.votingData.finalDecision}
                                  />
                                )}
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => openDetailsDialog(app)}
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                  {(app.status === "pending" || app.status === "under_review" || app.status === "incomplete") && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="text-orange-600 hover:text-orange-700"
                                      onClick={() => openDocumentRequestDialog(app)}
                                      title="Demander un document"
                                    >
                                      <FileQuestion className="h-4 w-4" />
                                    </Button>
                                  )}
                                  {app.status === "pending" && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="text-blue-600 hover:text-blue-700"
                                      onClick={() => openActionDialog(app, "review")}
                                      title="Mettre en cours d'examen"
                                    >
                                      <Clock className="h-4 w-4" />
                                    </Button>
                                  )}
                                  {(app.status === "pending" || app.status === "under_review" || app.status === "incomplete") && (
                                    <>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-green-600 hover:text-green-700"
                                        onClick={() => openActionDialog(app, "approve")}
                                        title="Approuver"
                                      >
                                        <CheckCircle className="h-4 w-4" />
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-red-600 hover:text-red-700"
                                        onClick={() => openActionDialog(app, "reject")}
                                        title="Rejeter"
                                      >
                                        <XCircle className="h-4 w-4" />
                                      </Button>
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
            </TabsContent>

            {/* Evaluations Tab */}
            <TabsContent value="evaluations">
              {user && (
                <EvaluationList 
                  currentUserId={user.id} 
                  currentUserName={profile?.full_name || profile?.email || undefined}
                />
              )}
            </TabsContent>

            {/* Statistiques Tab */}
            <TabsContent value="statistiques">
              <VotingStatsDashboard />
            </TabsContent>

            {/* Users Tab */}
            <TabsContent value="users">
              <Card>
                <CardHeader>
                  <CardTitle>Gestion des utilisateurs et rôles</CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                  ) : users.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">
                      Aucun utilisateur pour le moment.
                    </p>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nom</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Rôles</TableHead>
                          <TableHead>Inscription</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {users.map((user) => (
                          <TableRow key={user.id}>
                            <TableCell className="font-medium">{user.full_name || "-"}</TableCell>
                            <TableCell>{user.email || "-"}</TableCell>
                            <TableCell>
                              <div className="flex flex-wrap gap-1">
                                {user.roles.length > 0 ? (
                                  user.roles.map((role) => (
                                    <Badge key={role} variant="outline">
                                      {role}
                                    </Badge>
                                  ))
                                ) : (
                                  <span className="text-muted-foreground text-sm">Aucun rôle</span>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              {format(new Date(user.created_at), "dd MMM yyyy", { locale: fr })}
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => openRoleDialog(user)}
                              >
                                <Shield className="h-4 w-4 mr-1" />
                                Gérer rôles
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Admin-only tabs */}
            {isAdmin && (
              <>
                <TabsContent value="settings">
                  <AdminPlatformSettings />
                </TabsContent>
                <TabsContent value="documents">
                  <AdminLegalDocuments />
                </TabsContent>
                <TabsContent value="comite">
                  <AdminCommitteeMembers />
                </TabsContent>
              </>
            )}
          </Tabs>
        </div>
      </main>

      {/* Details Dialog with Chat */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-6xl max-h-[90vh] p-0 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-5 h-[85vh]">
            {/* Details Panel - 3 columns */}
            <div className="lg:col-span-3 overflow-y-auto">
              <DialogHeader className="p-6 pb-0">
                <DialogTitle>Détails de la candidature</DialogTitle>
              </DialogHeader>
              <ScrollArea className="h-[calc(85vh-80px)] px-6 pb-6">
            {selectedApplication && (
              <div className="space-y-6 pr-4 pt-4">
                {/* Startup Info Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Informations de la startup</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                      <Label className="text-muted-foreground">Startup</Label>
                      <p className="font-medium">{selectedApplication.startup.name}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Statut</Label>
                      <p>
                        <Badge variant={STATUS_LABELS[selectedApplication.status]?.variant || "secondary"}>
                          {STATUS_LABELS[selectedApplication.status]?.label || selectedApplication.status}
                        </Badge>
                      </p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Score moyen</Label>
                      <p>{selectedApplication.averageScore !== null ? `${selectedApplication.averageScore}/100` : "-"}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Secteur</Label>
                      <p>{SECTOR_LABELS[selectedApplication.startup.sector || ""] || selectedApplication.startup.sector || "-"}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Stade</Label>
                      <p>{STAGE_LABELS[selectedApplication.startup.stage || ""] || selectedApplication.startup.stage || "-"}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Équipe</Label>
                      <p>{selectedApplication.startup.team_size || "-"} employés</p>
                    </div>
                    <div className="col-span-2 md:col-span-3">
                      <Label className="text-muted-foreground">Site web</Label>
                      <p>
                        {selectedApplication.startup.website ? (
                          <a
                            href={selectedApplication.startup.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                          >
                            {selectedApplication.startup.website}
                          </a>
                        ) : (
                          "-"
                        )}
                      </p>
                    </div>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Description</Label>
                    <p className="text-sm mt-1 whitespace-pre-wrap">
                      {selectedApplication.startup.description || "Aucune description fournie."}
                    </p>
                  </div>
                </div>

                <Separator />

                {/* Candidate Info Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Informations du candidat</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-muted-foreground">Candidat</Label>
                      <p>{selectedApplication.user.full_name || "-"}</p>
                      <p className="text-sm text-muted-foreground">{selectedApplication.user.email}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Date de soumission</Label>
                      <p>
                        {selectedApplication.submitted_at
                          ? format(new Date(selectedApplication.submitted_at), "dd MMMM yyyy 'à' HH:mm", { locale: fr })
                          : "-"}
                      </p>
                    </div>
                  </div>
                  {selectedApplication.notes && (
                    <div>
                      <Label className="text-muted-foreground">Notes de l'évaluateur</Label>
                      <p className="text-sm mt-1">{selectedApplication.notes}</p>
                    </div>
                  )}
                </div>

                <Separator />

                {/* Document Requests Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <FileQuestion className="h-5 w-5" />
                    Demandes de documents
                  </h3>
                  
                  {loadingDocRequests ? (
                    <div className="flex items-center justify-center py-4">
                      <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                    </div>
                  ) : documentRequests.length === 0 ? (
                    <p className="text-muted-foreground text-sm">
                      Aucune demande de document pour cette candidature.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {documentRequests.map((req) => {
                        const isFulfilled = !!req.fulfilled_at;
                        const docLabel = DOCUMENT_TYPES.find(d => d.value === req.document_type)?.label || req.document_type;
                        
                        return (
                          <div 
                            key={req.id} 
                            className={`p-3 rounded-lg border ${
                              isFulfilled 
                                ? "bg-green-50 border-green-200" 
                                : "bg-orange-50 border-orange-200"
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <div className="flex items-center gap-2">
                                {isFulfilled ? (
                                  <FileCheck className="h-4 w-4 text-green-600" />
                                ) : (
                                  <Clock className="h-4 w-4 text-orange-600" />
                                )}
                                <span className="font-medium">{docLabel}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge variant={isFulfilled ? "default" : "outline"}>
                                  {isFulfilled ? "Fourni" : "En attente"}
                                </Badge>
                                {!isFulfilled && (
                                  <div className="flex items-center gap-1">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="h-7 text-xs bg-green-50 hover:bg-green-100 text-green-700 border-green-300"
                                      onClick={() => handleMarkAsFulfilled(req.id)}
                                      disabled={markingFulfilledId === req.id || cancellingRequestId === req.id}
                                    >
                                      {markingFulfilledId === req.id ? (
                                        <Loader2 className="h-3 w-3 animate-spin mr-1" />
                                      ) : (
                                        <CheckCircle className="h-3 w-3 mr-1" />
                                      )}
                                      Marquer fourni
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="h-7 text-xs bg-red-50 hover:bg-red-100 text-red-700 border-red-300"
                                      onClick={() => {
                                        setRequestToCancel(req);
                                        setShowCancelDialog(true);
                                      }}
                                      disabled={markingFulfilledId === req.id || cancellingRequestId === req.id}
                                    >
                                      {cancellingRequestId === req.id ? (
                                        <Loader2 className="h-3 w-3 animate-spin mr-1" />
                                      ) : (
                                        <Trash2 className="h-3 w-3 mr-1" />
                                      )}
                                      Annuler
                                    </Button>
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            {req.message && (
                              <p className="text-sm text-muted-foreground mt-1 ml-6">
                                {req.message}
                              </p>
                            )}
                            
                            <div className="text-xs text-muted-foreground mt-2 ml-6">
                              {req.requested_at && (
                                <>Demandé le {format(new Date(req.requested_at), "dd MMM yyyy", { locale: fr })}</>
                              )}
                              {isFulfilled && req.fulfilled_at && (
                                <> • Fourni le {format(new Date(req.fulfilled_at), "dd MMM yyyy", { locale: fr })}</>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                <Separator />

                {/* Voting Panel */}
                <VotingPanel
                  applicationId={selectedApplication.id}
                  startupName={selectedApplication.startup.name}
                  onDecisionApplied={() => {
                    fetchData();
                    setShowDetailsDialog(false);
                  }}
                />

                <Separator />

                {/* Documents Section */}
                <DocumentViewer
                  documents={{
                    doc_rccm: selectedApplication.startup.doc_rccm,
                    doc_tax: selectedApplication.startup.doc_tax,
                    doc_statutes: selectedApplication.startup.doc_statutes,
                    doc_business_plan: selectedApplication.startup.doc_business_plan,
                    doc_cv: selectedApplication.startup.doc_cv,
                    doc_pitch: selectedApplication.startup.doc_pitch,
                    doc_other: selectedApplication.startup.doc_other,
                  }}
                  startupName={selectedApplication.startup.name}
                />
              </div>
            )}
              </ScrollArea>
              <div className="p-4 border-t flex justify-end">
                <Button variant="outline" onClick={() => setShowDetailsDialog(false)}>
                  Fermer
                </Button>
              </div>
            </div>
            
            {/* Chat Panel - 2 columns */}
            {selectedApplication && (
              <div className="lg:col-span-2 hidden lg:flex flex-col h-full border-l">
                <EvaluationChat 
                  applicationId={selectedApplication.id} 
                  className="border-0 rounded-none h-full"
                />
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Action Dialog */}
      <Dialog open={showActionDialog} onOpenChange={setShowActionDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === "approve" 
                ? "Approuver la candidature" 
                : actionType === "reject" 
                  ? "Rejeter la candidature"
                  : "Mettre en cours d'examen"}
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
              <Textarea
                id="notes"
                placeholder="Ajoutez des notes ou commentaires..."
                value={actionNotes}
                onChange={(e) => setActionNotes(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowActionDialog(false)}
              disabled={actionLoading}
            >
              Annuler
            </Button>
            <Button
              variant={actionType === "approve" ? "default" : actionType === "reject" ? "destructive" : "secondary"}
              onClick={handleStatusChange}
              disabled={actionLoading}
            >
              {actionLoading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : actionType === "approve" ? (
                <CheckCircle className="h-4 w-4 mr-2" />
              ) : actionType === "reject" ? (
                <XCircle className="h-4 w-4 mr-2" />
              ) : (
                <Clock className="h-4 w-4 mr-2" />
              )}
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
            <DialogDescription>
              Attribuez ou retirez des rôles pour {selectedUser?.full_name || selectedUser?.email}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Rôles actuels</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedUser?.roles.length ? (
                  selectedUser.roles.map((role) => (
                    <Badge key={role} variant="secondary">
                      {role}
                    </Badge>
                  ))
                ) : (
                  <span className="text-muted-foreground text-sm">Aucun rôle attribué</span>
                )}
              </div>
            </div>
            <div>
              <Label htmlFor="role">Ajouter/Retirer un rôle</Label>
              <Select value={newRole} onValueChange={setNewRole}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un rôle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="evaluator">Évaluateur</SelectItem>
                  <SelectItem value="startup">Startup</SelectItem>
                </SelectContent>
              </Select>
              {selectedUser?.roles.includes(newRole) && newRole && (
                <p className="text-sm text-muted-foreground mt-1">
                  Ce rôle sera retiré de l'utilisateur.
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowRoleDialog(false)}
              disabled={actionLoading}
            >
              Annuler
            </Button>
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
        onSuccess={() => {
          fetchData();
          setShowDocumentRequestDialog(false);
          setSelectedApplication(null);
        }}
        adminUserId={user?.id || ""}
      />

      {/* Cancel Document Request Alert Dialog */}
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Annuler cette demande de document ?</AlertDialogTitle>
            <AlertDialogDescription>
              La demande de "{DOCUMENT_TYPES.find(d => d.value === requestToCancel?.document_type)?.label || requestToCancel?.document_type}" 
              sera supprimée et la startup sera notifiée de l'annulation.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={!!cancellingRequestId}>
              Non, garder
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancelDocumentRequest}
              disabled={!!cancellingRequestId}
              className="bg-red-600 hover:bg-red-700"
            >
              {cancellingRequestId ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              Oui, annuler
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Footer />
    </div>
  );
}
