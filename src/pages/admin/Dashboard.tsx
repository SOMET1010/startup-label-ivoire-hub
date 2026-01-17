import { useState, useEffect } from "react";
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
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useAuth } from "@/contexts/AuthContext";
import EvaluationList from "@/components/evaluation/EvaluationList";

interface ApplicationWithStartup {
  id: string;
  status: string;
  submitted_at: string | null;
  notes: string | null;
  created_at: string;
  startup: {
    id: string;
    name: string;
    sector: string | null;
    stage: string | null;
    description: string | null;
    website: string | null;
    team_size: number | null;
  };
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
  const { user, profile } = useAuth();
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

      // Fetch startups
      const startupIds = appsData?.map(a => a.startup_id).filter(Boolean) || [];
      const { data: startupsData } = await supabase
        .from("startups")
        .select("id, name, sector, stage, description, website, team_size")
        .in("id", startupIds);

      // Fetch profiles
      const userIds = appsData?.map(a => a.user_id).filter(Boolean) || [];
      const { data: profilesData } = await supabase
        .from("profiles")
        .select("user_id, email, full_name")
        .in("user_id", userIds);

      // Combine data
      const applicationsWithDetails: ApplicationWithStartup[] = (appsData || []).map(app => {
        const startup = startupsData?.find(s => s.id === app.startup_id);
        const profile = profilesData?.find(p => p.user_id === app.user_id);
        return {
          id: app.id,
          status: app.status || "pending",
          submitted_at: app.submitted_at,
          notes: app.notes,
          created_at: app.created_at,
          startup: startup || { id: "", name: "Startup inconnue", sector: null, stage: null, description: null, website: null, team_size: null },
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

  const openDetailsDialog = (app: ApplicationWithStartup) => {
    setSelectedApplication(app);
    setShowDetailsDialog(true);
  };

  const openRoleDialog = (user: UserWithRole) => {
    setSelectedUser(user);
    setNewRole("");
    setShowRoleDialog(true);
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
            <TabsList>
              <TabsTrigger value="applications">Candidatures</TabsTrigger>
              <TabsTrigger value="evaluations" className="flex items-center gap-1">
                <Star className="h-4 w-4" />
                Évaluations
              </TabsTrigger>
              <TabsTrigger value="users">Utilisateurs & Rôles</TabsTrigger>
            </TabsList>

            {/* Applications Tab */}
            <TabsContent value="applications">
              <Card>
                <CardHeader>
                  <CardTitle>Gestion des candidatures</CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                  ) : applications.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">
                      Aucune candidature pour le moment.
                    </p>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Startup</TableHead>
                          <TableHead>Secteur</TableHead>
                          <TableHead>Stade</TableHead>
                          <TableHead>Candidat</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Statut</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {applications.map((app) => (
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
                              <Badge variant={STATUS_LABELS[app.status]?.variant || "secondary"}>
                                {STATUS_LABELS[app.status]?.label || app.status}
                              </Badge>
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
                                {(app.status === "pending" || app.status === "under_review") && (
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
          </Tabs>
        </div>
      </main>

      {/* Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Détails de la candidature</DialogTitle>
          </DialogHeader>
          {selectedApplication && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
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
                <div>
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
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDetailsDialog(false)}>
              Fermer
            </Button>
          </DialogFooter>
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

      <Footer />
    </div>
  );
}
