import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2, Star, Eye, Edit, Users, MessageCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import EvaluationForm from "./EvaluationForm";
import EvaluationSummary from "./EvaluationSummary";
import { EvaluationChat } from "./EvaluationChat";

interface ApplicationForEvaluation {
  id: string;
  status: string;
  startup: {
    id: string;
    name: string;
    sector: string | null;
    stage: string | null;
  };
  evaluations: EvaluationData[];
  evaluationCount: number;
  averageScore: number | null;
}

interface EvaluationData {
  id: string;
  evaluator_id: string;
  evaluator_name?: string;
  innovation_score: number | null;
  business_model_score: number | null;
  team_score: number | null;
  impact_score: number | null;
  total_score: number | null;
  recommendation: string | null;
  general_comment: string | null;
  is_submitted: boolean;
  submitted_at: string | null;
  innovation_comment: string | null;
  business_model_comment: string | null;
  team_comment: string | null;
  impact_comment: string | null;
}

interface EvaluationListProps {
  currentUserId: string;
  currentUserName?: string;
}

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

const getScoreColor = (score: number | null) => {
  if (score === null) return "text-muted-foreground";
  if (score >= 80) return "text-green-600";
  if (score >= 60) return "text-yellow-600";
  if (score >= 40) return "text-orange-500";
  return "text-red-500";
};

export default function EvaluationList({ currentUserId, currentUserName }: EvaluationListProps) {
  const [applications, setApplications] = useState<ApplicationForEvaluation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<ApplicationForEvaluation | null>(null);
  const [showEvaluationForm, setShowEvaluationForm] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [existingEvaluation, setExistingEvaluation] = useState<EvaluationData | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch applications that are under review or pending
      const { data: appsData, error: appsError } = await supabase
        .from("applications")
        .select("id, status, startup_id")
        .in("status", ["pending", "under_review"])
        .order("created_at", { ascending: false });

      if (appsError) throw appsError;

      // Fetch startups
      const startupIds = appsData?.map(a => a.startup_id).filter(Boolean) || [];
      const { data: startupsData } = await supabase
        .from("startups")
        .select("id, name, sector, stage")
        .in("id", startupIds);

      // Fetch all evaluations for these applications
      const applicationIds = appsData?.map(a => a.id) || [];
      const { data: evaluationsData } = await supabase
        .from("evaluations")
        .select("*")
        .in("application_id", applicationIds);

      // Fetch evaluator profiles
      const evaluatorIds = [...new Set(evaluationsData?.map(e => e.evaluator_id) || [])];
      const { data: profilesData } = await supabase
        .from("profiles")
        .select("user_id, full_name, email")
        .in("user_id", evaluatorIds);

      // Combine data
      const applicationsWithEvaluations: ApplicationForEvaluation[] = (appsData || []).map(app => {
        const startup = startupsData?.find(s => s.id === app.startup_id);
        const appEvaluations = (evaluationsData || [])
          .filter(e => e.application_id === app.id)
          .map(e => {
            const profile = profilesData?.find(p => p.user_id === e.evaluator_id);
            return {
              ...e,
              evaluator_name: profile?.full_name || profile?.email || "Évaluateur",
            };
          });
        
        const submittedEvaluations = appEvaluations.filter(e => e.is_submitted);
        const averageScore = submittedEvaluations.length > 0
          ? submittedEvaluations.reduce((sum, e) => sum + (e.total_score || 0), 0) / submittedEvaluations.length
          : null;

        return {
          id: app.id,
          status: app.status || "pending",
          startup: startup || { id: "", name: "Startup inconnue", sector: null, stage: null },
          evaluations: appEvaluations,
          evaluationCount: submittedEvaluations.length,
          averageScore,
        };
      });

      setApplications(applicationsWithEvaluations);
    } catch (error: unknown) {
      console.error("Error fetching data:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les candidatures.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openEvaluationForm = (app: ApplicationForEvaluation) => {
    const myEvaluation = app.evaluations.find(e => e.evaluator_id === currentUserId);
    setSelectedApp(app);
    setExistingEvaluation(myEvaluation || null);
    setShowEvaluationForm(true);
  };

  const openSummary = (app: ApplicationForEvaluation) => {
    setSelectedApp(app);
    setShowSummary(true);
  };

  const handleEvaluationSaved = () => {
    setShowEvaluationForm(false);
    setSelectedApp(null);
    setExistingEvaluation(null);
    fetchData();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            Évaluations des candidatures
          </CardTitle>
        </CardHeader>
        <CardContent>
          {applications.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Aucune candidature à évaluer pour le moment.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Startup</TableHead>
                  <TableHead>Secteur</TableHead>
                  <TableHead>Évaluateurs</TableHead>
                  <TableHead>Score moyen</TableHead>
                  <TableHead>Mon évaluation</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {applications.map((app) => {
                  const myEvaluation = app.evaluations.find(e => e.evaluator_id === currentUserId);
                  return (
                    <TableRow key={app.id}>
                      <TableCell className="font-medium">{app.startup.name}</TableCell>
                      <TableCell>
                        {SECTOR_LABELS[app.startup.sector || ""] || app.startup.sector || "-"}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span>{app.evaluationCount}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {app.averageScore !== null ? (
                          <span className={cn("font-bold", getScoreColor(app.averageScore))}>
                            {app.averageScore.toFixed(1)}/100
                          </span>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {myEvaluation ? (
                          myEvaluation.is_submitted ? (
                            <Badge className="bg-green-500">Soumise</Badge>
                          ) : (
                            <Badge variant="secondary">Brouillon</Badge>
                          )
                        ) : (
                          <Badge variant="outline">Non évaluée</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openSummary(app)}
                            title="Voir la synthèse"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEvaluationForm(app)}
                            title={myEvaluation?.is_submitted ? "Voir mon évaluation" : "Évaluer"}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEvaluationForm(app)}
                            title="Discussion"
                            className="text-blue-600 hover:text-blue-700"
                          >
                            <MessageCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Evaluation Form Dialog with Chat */}
      <Dialog open={showEvaluationForm} onOpenChange={setShowEvaluationForm}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden p-0">
          {selectedApp && (
            <div className="grid grid-cols-1 lg:grid-cols-5 h-[85vh]">
              {/* Evaluation Form - 3 columns */}
              <div className="lg:col-span-3 overflow-y-auto p-6 border-r">
                <EvaluationForm
                  applicationId={selectedApp.id}
                  startup={selectedApp.startup}
                  evaluatorId={currentUserId}
                  evaluatorName={currentUserName}
                  existingEvaluation={existingEvaluation}
                  onSaved={handleEvaluationSaved}
                  onClose={() => setShowEvaluationForm(false)}
                />
              </div>
              
              {/* Chat Panel - 2 columns */}
              <div className="lg:col-span-2 hidden lg:flex flex-col h-full">
                <EvaluationChat 
                  applicationId={selectedApp.id} 
                  className="border-0 rounded-none h-full"
                />
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Summary Dialog */}
      <Dialog open={showSummary} onOpenChange={setShowSummary}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Synthèse des évaluations</DialogTitle>
          </DialogHeader>
          {selectedApp && (
            <EvaluationSummary
              evaluations={selectedApp.evaluations}
              startupName={selectedApp.startup.name}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
