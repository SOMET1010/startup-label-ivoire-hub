import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  FileText, 
  Loader2, 
  RefreshCw,
  Building,
  Calendar,
  Users,
  Globe,
  MessageSquare,
  AlertCircle
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface Application {
  id: string;
  status: string;
  submitted_at: string | null;
  notes: string | null;
  reviewed_at: string | null;
  created_at: string;
}

interface Startup {
  id: string;
  name: string;
  description: string | null;
  sector: string | null;
  stage: string | null;
  website: string | null;
  team_size: number | null;
  founded_date: string | null;
  status: string | null;
}

interface Comment {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
}

interface ApplicationWithDetails {
  application: Application;
  startup: Startup;
  comments: Comment[];
}

const STATUS_CONFIG: Record<string, { 
  label: string; 
  variant: "default" | "secondary" | "destructive" | "outline";
  step: number;
  icon: React.ReactNode;
}> = {
  pending: { 
    label: "En attente", 
    variant: "secondary", 
    step: 1,
    icon: <Clock className="h-5 w-5 text-yellow-500" />
  },
  under_review: { 
    label: "En cours d'examen", 
    variant: "outline", 
    step: 2,
    icon: <FileText className="h-5 w-5 text-blue-500" />
  },
  approved: { 
    label: "Approuvée", 
    variant: "default", 
    step: 4,
    icon: <CheckCircle className="h-5 w-5 text-green-500" />
  },
  rejected: { 
    label: "Rejetée", 
    variant: "destructive", 
    step: 4,
    icon: <XCircle className="h-5 w-5 text-red-500" />
  },
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

const PROCESS_STEPS = [
  { id: 1, name: "Soumission", description: "Dossier soumis au comité" },
  { id: 2, name: "Examen", description: "Évaluation par les experts" },
  { id: 3, name: "Décision", description: "Délibération du comité" },
  { id: 4, name: "Résultat", description: "Notification de la décision" },
];

const SuiviCandidature = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [applications, setApplications] = useState<ApplicationWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<ApplicationWithDetails | null>(null);

  const fetchApplications = async () => {
    if (!user || !supabase) return;

    setLoading(true);
    try {
      // Fetch user's applications
      const { data: appsData, error: appsError } = await supabase
        .from("applications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (appsError) throw appsError;

      if (!appsData || appsData.length === 0) {
        setApplications([]);
        setLoading(false);
        return;
      }

      // Fetch startups
      const startupIds = appsData.map(a => a.startup_id).filter(Boolean);
      const { data: startupsData } = await supabase
        .from("startups")
        .select("*")
        .in("id", startupIds);

      // Fetch comments for these applications
      const appIds = appsData.map(a => a.id);
      const { data: commentsData } = await supabase
        .from("application_comments")
        .select("*")
        .in("application_id", appIds)
        .order("created_at", { ascending: false });

      // Combine data
      const applicationsWithDetails: ApplicationWithDetails[] = appsData.map(app => {
        const startup = startupsData?.find(s => s.id === app.startup_id);
        const comments = commentsData?.filter(c => c.application_id === app.id) || [];
        
        return {
          application: {
            id: app.id,
            status: app.status || "pending",
            submitted_at: app.submitted_at,
            notes: app.notes,
            reviewed_at: app.reviewed_at,
            created_at: app.created_at,
          },
          startup: startup || {
            id: "",
            name: "Startup inconnue",
            description: null,
            sector: null,
            stage: null,
            website: null,
            team_size: null,
            founded_date: null,
            status: null,
          },
          comments,
        };
      });

      setApplications(applicationsWithDetails);
      
      // Auto-select first application if none selected
      if (!selectedApp && applicationsWithDetails.length > 0) {
        setSelectedApp(applicationsWithDetails[0]);
      }
    } catch (error: any) {
      console.error("Error fetching applications:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger vos candidatures.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    if (user) {
      fetchApplications();
    }
  }, [user]);

  // Real-time subscription
  useEffect(() => {
    if (!user || !supabase) return;

    const channel = supabase
      .channel("application-updates")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "applications",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          console.log("Application update received:", payload);
          fetchApplications();
          
          if (payload.eventType === "UPDATE") {
            const newStatus = (payload.new as Application).status;
            const statusLabel = STATUS_CONFIG[newStatus]?.label || newStatus;
            toast({
              title: "Mise à jour de votre candidature",
              description: `Le statut est passé à : ${statusLabel}`,
            });
          }
        }
      )
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "application_comments",
        },
        (payload) => {
          console.log("New comment received:", payload);
          fetchApplications();
          toast({
            title: "Nouveau commentaire",
            description: "Un évaluateur a ajouté un commentaire à votre candidature.",
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const getProgressPercentage = (status: string) => {
    const step = STATUS_CONFIG[status]?.step || 1;
    return Math.round((step / 4) * 100);
  };

  const getStepStatus = (stepId: number, currentStep: number, isFinal: boolean, isApproved: boolean) => {
    if (stepId < currentStep) return "completed";
    if (stepId === currentStep && !isFinal) return "in-progress";
    if (isFinal && stepId === 4) {
      return isApproved ? "completed" : "rejected";
    }
    return "pending";
  };

  const generateTrackingId = (appId: string, createdAt: string) => {
    const year = new Date(createdAt).getFullYear();
    const shortId = appId.slice(0, 8).toUpperCase();
    return `LSN-${year}-${shortId}`;
  };

  // Show loading state while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow py-12 bg-muted/30 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    );
  }

  // Redirect to auth if not logged in
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-md mx-auto text-center bg-card rounded-xl shadow-sm p-8">
              <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h1 className="text-2xl font-bold mb-4">Connexion requise</h1>
              <p className="text-muted-foreground mb-6">
                Connectez-vous pour suivre vos candidatures au Label Startup Numérique.
              </p>
              <Button asChild>
                <Link to="/auth">Se connecter</Link>
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold mb-2">Suivi de vos candidatures</h1>
                <p className="text-muted-foreground">
                  Suivez l'état d'avancement de vos demandes de labellisation en temps réel
                </p>
              </div>
              <Button variant="outline" onClick={fetchApplications} disabled={loading}>
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                Actualiser
              </Button>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : applications.length === 0 ? (
              <Card>
                <CardContent className="py-16 text-center">
                  <Building className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h2 className="text-xl font-semibold mb-2">Aucune candidature</h2>
                  <p className="text-muted-foreground mb-6">
                    Vous n'avez pas encore soumis de candidature au Label Startup Numérique.
                  </p>
                  <Button asChild>
                    <Link to="/postuler">Soumettre une candidature</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Applications List */}
                <div className="lg:col-span-1 space-y-3">
                  <h2 className="text-lg font-semibold mb-3">Mes candidatures</h2>
                  {applications.map((app) => (
                    <Card
                      key={app.application.id}
                      className={`cursor-pointer transition-all hover:shadow-md ${
                        selectedApp?.application.id === app.application.id
                          ? "ring-2 ring-primary"
                          : ""
                      }`}
                      onClick={() => setSelectedApp(app)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-medium truncate">{app.startup.name}</h3>
                          <Badge variant={STATUS_CONFIG[app.application.status]?.variant || "secondary"}>
                            {STATUS_CONFIG[app.application.status]?.label || app.application.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {generateTrackingId(app.application.id, app.application.created_at)}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Soumis le{" "}
                          {app.application.submitted_at
                            ? format(new Date(app.application.submitted_at), "dd MMM yyyy", { locale: fr })
                            : format(new Date(app.application.created_at), "dd MMM yyyy", { locale: fr })}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Selected Application Details */}
                <div className="lg:col-span-2 space-y-6">
                  {selectedApp ? (
                    <>
                      {/* Header Card */}
                      <Card>
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div>
                              <CardTitle className="text-xl">{selectedApp.startup.name}</CardTitle>
                              <CardDescription>
                                Dossier N° {generateTrackingId(selectedApp.application.id, selectedApp.application.created_at)}
                              </CardDescription>
                            </div>
                            <div className="flex items-center gap-2">
                              {STATUS_CONFIG[selectedApp.application.status]?.icon}
                              <Badge variant={STATUS_CONFIG[selectedApp.application.status]?.variant || "secondary"}>
                                {STATUS_CONFIG[selectedApp.application.status]?.label || selectedApp.application.status}
                              </Badge>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          {/* Progress Bar */}
                          <div className="mb-6">
                            <div className="flex justify-between mb-2">
                              <span className="text-sm font-medium">Progression du dossier</span>
                              <span className="text-sm font-medium">
                                {getProgressPercentage(selectedApp.application.status)}%
                              </span>
                            </div>
                            <Progress 
                              value={getProgressPercentage(selectedApp.application.status)} 
                              className="h-2" 
                            />
                          </div>

                          {/* Process Steps */}
                          <div className="space-y-4">
                            <h3 className="font-medium">Étapes du processus</h3>
                            <div className="space-y-3">
                              {PROCESS_STEPS.map((step) => {
                                const currentStep = STATUS_CONFIG[selectedApp.application.status]?.step || 1;
                                const isFinal = selectedApp.application.status === "approved" || selectedApp.application.status === "rejected";
                                const isApproved = selectedApp.application.status === "approved";
                                const stepStatus = getStepStatus(step.id, currentStep, isFinal, isApproved);

                                return (
                                  <div key={step.id} className="flex gap-4">
                                    <div className="flex-shrink-0 mt-1">
                                      {stepStatus === "completed" ? (
                                        <CheckCircle className="h-5 w-5 text-green-500" />
                                      ) : stepStatus === "rejected" ? (
                                        <XCircle className="h-5 w-5 text-red-500" />
                                      ) : stepStatus === "in-progress" ? (
                                        <Clock className="h-5 w-5 text-blue-500" />
                                      ) : (
                                        <Clock className="h-5 w-5 text-muted-foreground/40" />
                                      )}
                                    </div>
                                    <div className="flex-grow">
                                      <p className={`font-medium ${stepStatus === "pending" ? "text-muted-foreground" : ""}`}>
                                        {step.name}
                                      </p>
                                      <p className="text-sm text-muted-foreground">{step.description}</p>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Tabs for Details */}
                      <Tabs defaultValue="details">
                        <TabsList className="grid w-full grid-cols-2">
                          <TabsTrigger value="details">Informations</TabsTrigger>
                          <TabsTrigger value="comments">
                            Commentaires ({selectedApp.comments.length})
                          </TabsTrigger>
                        </TabsList>

                        <TabsContent value="details" className="mt-4">
                          <Card>
                            <CardHeader>
                              <CardTitle className="text-lg">Informations de la startup</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div className="flex items-center gap-2">
                                  <Building className="h-4 w-4 text-muted-foreground" />
                                  <div>
                                    <p className="text-sm text-muted-foreground">Secteur</p>
                                    <p className="font-medium">
                                      {SECTOR_LABELS[selectedApp.startup.sector || ""] || selectedApp.startup.sector || "-"}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <FileText className="h-4 w-4 text-muted-foreground" />
                                  <div>
                                    <p className="text-sm text-muted-foreground">Stade</p>
                                    <p className="font-medium">
                                      {STAGE_LABELS[selectedApp.startup.stage || ""] || selectedApp.startup.stage || "-"}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Users className="h-4 w-4 text-muted-foreground" />
                                  <div>
                                    <p className="text-sm text-muted-foreground">Équipe</p>
                                    <p className="font-medium">
                                      {selectedApp.startup.team_size || "-"} employés
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Calendar className="h-4 w-4 text-muted-foreground" />
                                  <div>
                                    <p className="text-sm text-muted-foreground">Création</p>
                                    <p className="font-medium">
                                      {selectedApp.startup.founded_date
                                        ? format(new Date(selectedApp.startup.founded_date), "MMMM yyyy", { locale: fr })
                                        : "-"}
                                    </p>
                                  </div>
                                </div>
                              </div>

                              {selectedApp.startup.website && (
                                <div className="flex items-center gap-2">
                                  <Globe className="h-4 w-4 text-muted-foreground" />
                                  <div>
                                    <p className="text-sm text-muted-foreground">Site web</p>
                                    <a
                                      href={selectedApp.startup.website}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="font-medium text-primary hover:underline"
                                    >
                                      {selectedApp.startup.website}
                                    </a>
                                  </div>
                                </div>
                              )}

                              {selectedApp.startup.description && (
                                <div>
                                  <p className="text-sm text-muted-foreground mb-1">Description</p>
                                  <p className="text-sm whitespace-pre-wrap">{selectedApp.startup.description}</p>
                                </div>
                              )}

                              {selectedApp.application.notes && (
                                <div className="pt-4 border-t">
                                  <p className="text-sm text-muted-foreground mb-1">Notes de l'évaluateur</p>
                                  <p className="text-sm bg-muted p-3 rounded-lg">
                                    {selectedApp.application.notes}
                                  </p>
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        </TabsContent>

                        <TabsContent value="comments" className="mt-4">
                          <Card>
                            <CardHeader>
                              <CardTitle className="text-lg">Historique des commentaires</CardTitle>
                            </CardHeader>
                            <CardContent>
                              {selectedApp.comments.length === 0 ? (
                                <div className="text-center py-8">
                                  <MessageSquare className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                                  <p className="text-muted-foreground">Aucun commentaire pour le moment.</p>
                                </div>
                              ) : (
                                <div className="space-y-4">
                                  {selectedApp.comments.map((comment) => (
                                    <div key={comment.id} className="border-l-2 border-primary/30 pl-4 py-1">
                                      <div className="flex justify-between">
                                        <p className="font-medium">Évaluateur</p>
                                        <p className="text-sm text-muted-foreground">
                                          {format(new Date(comment.created_at), "dd MMM yyyy 'à' HH:mm", { locale: fr })}
                                        </p>
                                      </div>
                                      <p className="text-muted-foreground mt-1">{comment.content}</p>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        </TabsContent>
                      </Tabs>
                    </>
                  ) : (
                    <Card>
                      <CardContent className="py-16 text-center">
                        <p className="text-muted-foreground">
                          Sélectionnez une candidature pour voir les détails.
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SuiviCandidature;
