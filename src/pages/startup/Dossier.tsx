import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  FileText, 
  Upload, 
  CheckCircle2, 
  AlertCircle, 
  Clock,
  Building2,
  Users,
  Globe,
  Calendar,
  MapPin,
  Edit,
  Save,
  X,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface StartupData {
  id: string;
  name: string;
  description: string | null;
  sector: string | null;
  stage: string | null;
  founded_date: string | null;
  team_size: number | null;
  website: string | null;
  address: string | null;
  legal_status: string | null;
  rccm: string | null;
  tax_id: string | null;
  doc_rccm: string | null;
  doc_statutes: string | null;
  doc_business_plan: string | null;
  doc_pitch: string | null;
  doc_cv: string | null;
  doc_tax: string | null;
}

interface ApplicationData {
  id: string;
  status: string;
  submitted_at: string | null;
  reviewed_at: string | null;
}

const REQUIRED_DOCUMENTS = [
  { key: "doc_rccm", label: "RCCM (Registre de Commerce)", required: true },
  { key: "doc_statutes", label: "Statuts de l'entreprise", required: true },
  { key: "doc_business_plan", label: "Business Plan", required: true },
  { key: "doc_pitch", label: "Pitch Deck", required: false },
  { key: "doc_cv", label: "CV des fondateurs", required: true },
  { key: "doc_tax", label: "Attestation fiscale", required: false },
];

export default function Dossier() {
  const { user } = useAuth();
  const [startup, setStartup] = useState<StartupData | null>(null);
  const [application, setApplication] = useState<ApplicationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState<Partial<StartupData>>({});

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    if (!user) return;

    try {
      const { data: startupData, error: startupError } = await supabase
        .from("startups")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (startupError) throw startupError;

      if (startupData) {
        setStartup(startupData);
        setEditedData(startupData);

        const { data: appData } = await supabase
          .from("applications")
          .select("id, status, submitted_at, reviewed_at")
          .eq("startup_id", startupData.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (appData) {
          setApplication(appData);
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Erreur lors du chargement des données");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!startup) return;

    try {
      const { error } = await supabase
        .from("startups")
        .update(editedData)
        .eq("id", startup.id);

      if (error) throw error;

      setStartup({ ...startup, ...editedData });
      setIsEditing(false);
      toast.success("Informations mises à jour avec succès");
    } catch (error) {
      console.error("Error saving data:", error);
      toast.error("Erreur lors de la sauvegarde");
    }
  };

  const getDocumentStatus = () => {
    if (!startup) return { completed: 0, total: REQUIRED_DOCUMENTS.length };

    const completed = REQUIRED_DOCUMENTS.filter(
      (doc) => startup[doc.key as keyof StartupData]
    ).length;

    return { completed, total: REQUIRED_DOCUMENTS.length };
  };

  const docStatus = getDocumentStatus();
  const completionPercentage = Math.round((docStatus.completed / docStatus.total) * 100);

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case "approved":
        return <Badge variant="success">Approuvé</Badge>;
      case "pending":
        return <Badge variant="warning">En attente</Badge>;
      case "rejected":
        return <Badge variant="destructive">Refusé</Badge>;
      case "draft":
        return <Badge variant="muted">Brouillon</Badge>;
      default:
        return <Badge variant="muted">Non soumis</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!startup) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <FileText className="w-16 h-16 text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold mb-2">Aucun dossier trouvé</h2>
        <p className="text-muted-foreground mb-4">
          Vous n'avez pas encore créé de dossier de candidature.
        </p>
        <Button asChild>
          <Link to="/postuler">Créer mon dossier</Link>
        </Button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Mon dossier</h1>
          <p className="text-muted-foreground">
            Gérez votre dossier de candidature au Label Startup Numérique
          </p>
        </div>
        <div className="flex items-center gap-2">
          {getStatusBadge(application?.status)}
          {!isEditing && application?.status === "draft" && (
            <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
              <Edit className="w-4 h-4 mr-2" />
              Modifier
            </Button>
          )}
          {isEditing && (
            <>
              <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>
                <X className="w-4 h-4 mr-2" />
                Annuler
              </Button>
              <Button size="sm" onClick={handleSave}>
                <Save className="w-4 h-4 mr-2" />
                Enregistrer
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Completion Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold">Complétude du dossier</h3>
              <p className="text-sm text-muted-foreground">
                {docStatus.completed} sur {docStatus.total} documents fournis
              </p>
            </div>
            <span className="text-2xl font-bold text-primary">{completionPercentage}%</span>
          </div>
          <Progress value={completionPercentage} className="h-2" />
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="informations" className="space-y-4">
        <TabsList className="grid grid-cols-2 lg:grid-cols-3 w-full lg:w-auto">
          <TabsTrigger value="informations">Informations</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="historique">Historique</TabsTrigger>
        </TabsList>

        {/* Informations Tab */}
        <TabsContent value="informations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                Informations générales
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Nom de la startup</Label>
                {isEditing ? (
                  <Input
                    value={editedData.name || ""}
                    onChange={(e) => setEditedData({ ...editedData, name: e.target.value })}
                  />
                ) : (
                  <p className="text-foreground font-medium">{startup.name}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Secteur d'activité</Label>
                {isEditing ? (
                  <Input
                    value={editedData.sector || ""}
                    onChange={(e) => setEditedData({ ...editedData, sector: e.target.value })}
                  />
                ) : (
                  <p className="text-foreground">{startup.sector || "Non renseigné"}</p>
                )}
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Description</Label>
                {isEditing ? (
                  <Textarea
                    value={editedData.description || ""}
                    onChange={(e) => setEditedData({ ...editedData, description: e.target.value })}
                    rows={4}
                  />
                ) : (
                  <p className="text-foreground">{startup.description || "Non renseigné"}</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Détails de l'entreprise
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Date de création
                </Label>
                <p className="text-foreground">{startup.founded_date || "Non renseigné"}</p>
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Taille de l'équipe
                </Label>
                <p className="text-foreground">
                  {startup.team_size ? `${startup.team_size} personnes` : "Non renseigné"}
                </p>
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  Site web
                </Label>
                {startup.website ? (
                  <a
                    href={startup.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    {startup.website}
                  </a>
                ) : (
                  <p className="text-foreground">Non renseigné</p>
                )}
              </div>
              <div className="space-y-2 md:col-span-2 lg:col-span-3">
                <Label className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Adresse
                </Label>
                <p className="text-foreground">{startup.address || "Non renseigné"}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Informations légales
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div className="space-y-2">
                <Label>Forme juridique</Label>
                <p className="text-foreground">{startup.legal_status || "Non renseigné"}</p>
              </div>
              <div className="space-y-2">
                <Label>Numéro RCCM</Label>
                <p className="text-foreground">{startup.rccm || "Non renseigné"}</p>
              </div>
              <div className="space-y-2">
                <Label>Numéro fiscal</Label>
                <p className="text-foreground">{startup.tax_id || "Non renseigné"}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Documents Tab */}
        <TabsContent value="documents" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Documents requis</CardTitle>
              <CardDescription>
                Téléchargez les documents nécessaires à votre candidature
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {REQUIRED_DOCUMENTS.map((doc) => {
                  const hasDocument = !!startup[doc.key as keyof StartupData];
                  return (
                    <div
                      key={doc.key}
                      className="flex items-center justify-between p-4 rounded-lg border border-border bg-muted/30"
                    >
                      <div className="flex items-center gap-3">
                        {hasDocument ? (
                          <CheckCircle2 className="w-5 h-5 text-green-500" />
                        ) : doc.required ? (
                          <AlertCircle className="w-5 h-5 text-orange-500" />
                        ) : (
                          <Clock className="w-5 h-5 text-muted-foreground" />
                        )}
                        <div>
                          <p className="font-medium">{doc.label}</p>
                          <p className="text-sm text-muted-foreground">
                            {doc.required ? "Obligatoire" : "Optionnel"}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant={hasDocument ? "outline" : "default"}
                        size="sm"
                        disabled={application?.status !== "draft"}
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        {hasDocument ? "Remplacer" : "Télécharger"}
                      </Button>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Historique Tab */}
        <TabsContent value="historique" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Historique du dossier</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {application?.submitted_at && (
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 mt-2 rounded-full bg-primary" />
                    <div>
                      <p className="font-medium">Dossier soumis</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(application.submitted_at).toLocaleDateString("fr-FR", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                )}
                {application?.reviewed_at && (
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 mt-2 rounded-full bg-green-500" />
                    <div>
                      <p className="font-medium">Dossier examiné</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(application.reviewed_at).toLocaleDateString("fr-FR", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                )}
                {!application?.submitted_at && (
                  <p className="text-muted-foreground">
                    Aucun historique disponible. Soumettez votre dossier pour commencer le suivi.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
