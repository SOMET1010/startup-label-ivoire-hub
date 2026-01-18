import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Bell,
  Calendar,
  Gift,
  Users,
  FileText,
  ArrowRight,
  ExternalLink,
  RefreshCw,
} from "lucide-react";
import { NextActionCard } from "@/components/dashboard/NextActionCard";
import { ApplicationStatusWidget } from "@/components/dashboard/ApplicationStatusWidget";
import { DocumentsStatusWidget } from "@/components/dashboard/DocumentsStatusWidget";
import { DashboardTimeline } from "@/components/dashboard/DashboardTimeline";
import { normalizeStatus } from "@/components/shared/StatusBadge";

interface StartupData {
  id: string;
  name: string;
  status: string | null;
  doc_rccm: string | null;
  doc_tax: string | null;
  doc_business_plan: string | null;
  doc_statutes: string | null;
  doc_cv: string | null;
  doc_pitch: string | null;
}

interface ApplicationData {
  id: string;
  status: string | null;
  submitted_at: string | null;
  notes: string | null;
}

export default function StartupDashboard() {
  const { profile, user } = useAuth();
  const [startup, setStartup] = useState<StartupData | null>(null);
  const [application, setApplication] = useState<ApplicationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [unreadComments, setUnreadComments] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      if (!user || !supabase) {
        setIsLoading(false);
        return;
      }

      try {
        // Récupérer la startup de l'utilisateur
        const { data: startups, error: startupError } = await supabase
          .from("startups")
          .select("id, name, status, doc_rccm, doc_tax, doc_business_plan, doc_statutes, doc_cv, doc_pitch")
          .eq("user_id", user.id)
          .order("updated_at", { ascending: false })
          .limit(1);

        if (startupError) throw startupError;

        if (startups && startups.length > 0) {
          setStartup(startups[0]);

          // Récupérer l'application liée
          const { data: applications, error: appError } = await supabase
            .from("applications")
            .select("id, status, submitted_at, notes")
            .eq("startup_id", startups[0].id)
            .order("created_at", { ascending: false })
            .limit(1);

          if (appError) throw appError;

          if (applications && applications.length > 0) {
            setApplication(applications[0]);

            // Compter les commentaires non lus (simplification)
            const { count } = await supabase
              .from("application_comments")
              .select("id", { count: "exact", head: true })
              .eq("application_id", applications[0].id);

            setUnreadComments(count || 0);
          }
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user]);

  // Préparer les documents pour le widget
  const getDocuments = () => {
    if (!startup) return [];
    
    return [
      { key: "doc_rccm", label: "Extrait RCCM", required: true, uploaded: !!startup.doc_rccm },
      { key: "doc_tax", label: "Attestation fiscale", required: true, uploaded: !!startup.doc_tax },
      { key: "doc_business_plan", label: "Business Plan", required: true, uploaded: !!startup.doc_business_plan },
      { key: "doc_statutes", label: "Statuts", required: false, uploaded: !!startup.doc_statutes },
      { key: "doc_cv", label: "CV Fondateurs", required: false, uploaded: !!startup.doc_cv },
      { key: "doc_pitch", label: "Pitch Deck", required: false, uploaded: !!startup.doc_pitch },
    ];
  };

  const currentStatus = application?.status || startup?.status;

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-48 w-full" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Skeleton className="h-64" />
            <Skeleton className="h-64" />
            <Skeleton className="h-64" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          Bienvenue, {profile?.full_name || "Entrepreneur"} !
        </h1>
        <p className="text-muted-foreground">
          Gérez votre candidature au Label Startup Numérique et suivez votre progression.
        </p>
      </div>

      {/* Carte Action Principale */}
      <NextActionCard
        status={currentStatus}
        startupName={startup?.name}
        hasUnreadComments={unreadComments > 0}
        missingDocumentsCount={normalizeStatus(currentStatus) === "incomplete" ? 1 : 0}
        className="mb-8"
      />

      {/* Grille des widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Widget Statut */}
        <ApplicationStatusWidget
          status={currentStatus}
          submittedAt={application?.submitted_at}
        />

        {/* Widget Documents */}
        <DocumentsStatusWidget
          documents={getDocuments()}
          applicationStatus={currentStatus || undefined}
        />

        {/* Widget Timeline compact */}
        <Card className="h-full">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-primary/10">
                <Calendar className="h-4 w-4 text-primary" />
              </div>
              Progression
            </CardTitle>
          </CardHeader>
          <CardContent>
            <DashboardTimeline
              status={currentStatus}
              submittedAt={application?.submitted_at}
              compact={false}
            />
          </CardContent>
        </Card>
      </div>

      {/* Section Actions rapides */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <QuickActionCard
          icon={FileText}
          title="Ma candidature"
          description="Voir ou modifier votre dossier"
          href={startup ? "/startup/candidature" : "/postuler"}
        />
        <QuickActionCard
          icon={Users}
          title="Réseau"
          description="Connectez-vous avec d'autres startups"
          href="/startup/reseau"
          disabled={normalizeStatus(currentStatus) !== "approved"}
        />
        <QuickActionCard
          icon={Gift}
          title="Opportunités"
          description="Appels à projets et financements"
          href="/startup/opportunites"
          disabled={normalizeStatus(currentStatus) !== "approved"}
        />
        <QuickActionCard
          icon={RefreshCw}
          title="Renouvellement"
          description="Renouveler votre label"
          href="/startup/renouvellement"
          disabled={normalizeStatus(currentStatus) !== "expired"}
        />
      </div>

      {/* Notifications récentes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications récentes
            {unreadComments > 0 && (
              <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-accent text-accent-foreground rounded-full">
                {unreadComments} nouveau{unreadComments > 1 ? "x" : ""}
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {unreadComments > 0 ? (
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-accent/10 border border-accent/20">
                <div className="p-2 rounded-full bg-accent/20">
                  <Bell className="h-4 w-4 text-accent" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">
                    Vous avez {unreadComments} commentaire{unreadComments > 1 ? "s" : ""} du comité
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Consultez le suivi de votre candidature
                  </p>
                </div>
                <Button asChild variant="ghost" size="sm">
                  <Link to="/startup/suivi">
                    Voir
                    <ArrowRight className="h-3 w-3 ml-1" />
                  </Link>
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">
              Aucune notification pour le moment.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Composant Quick Action Card
interface QuickActionCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  href: string;
  disabled?: boolean;
}

function QuickActionCard({ icon: Icon, title, description, href, disabled }: QuickActionCardProps) {
  const content = (
    <Card className={`h-full transition-all ${disabled ? "opacity-50" : "hover:shadow-md hover:-translate-y-0.5 cursor-pointer"}`}>
      <CardContent className="p-4 flex items-start gap-3">
        <div className="p-2 rounded-lg bg-primary/10">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm">{title}</h3>
          <p className="text-xs text-muted-foreground truncate">{description}</p>
        </div>
        {!disabled && <ExternalLink className="h-4 w-4 text-muted-foreground flex-shrink-0" />}
      </CardContent>
    </Card>
  );

  if (disabled) {
    return content;
  }

  return <Link to={href}>{content}</Link>;
}
