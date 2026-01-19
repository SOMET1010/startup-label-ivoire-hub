import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import {
  Bell,
  FileText,
  Gift,
  Users,
  RefreshCw,
  ExternalLink,
} from "lucide-react";
import { normalizeStatus } from "@/components/shared/StatusBadge";
import { StatusHeader } from "@/components/dashboard/StatusHeader";
import { HorizontalTimeline } from "@/components/dashboard/HorizontalTimeline";
import { CompletionCard } from "@/components/dashboard/CompletionCard";
import { InstitutionMessagesCard } from "@/components/dashboard/InstitutionMessagesCard";
import { NextActionsCard } from "@/components/dashboard/NextActionsCard";
import { StartupCTABanner } from "@/components/dashboard/StartupCTABanner";
import { TrackingIdWidget } from "@/components/dashboard/TrackingIdWidget";

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

            // Compter les commentaires non lus
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
  const documents = getDocuments();
  const hasIncompleteDocuments = documents.some((d) => d.required && !d.uploaded);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-16 w-full" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Skeleton className="h-64" />
            <Skeleton className="h-64" />
            <Skeleton className="h-64" />
          </div>
        </div>
      </div>
    );
  }

  // Si pas de startup, afficher le CTA
  if (!startup) {
    return (
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold mb-2">
            Bienvenue, {profile?.full_name || "Entrepreneur"} !
          </h1>
          <p className="text-muted-foreground">
            Commencez votre parcours vers le Label Startup Numérique.
          </p>
        </motion.div>

        <StartupCTABanner />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Section Statut */}
      <Card className="mb-8">
        <CardContent className="pt-6 space-y-6">
          {/* Header avec badge de statut */}
          <StatusHeader status={currentStatus} />

          {/* Timeline horizontale */}
          <HorizontalTimeline status={currentStatus} className="py-4" />
        </CardContent>
      </Card>

      {/* Widget Tracking ID - Visible si application soumise */}
      {application?.id && application.submitted_at && (
        <TrackingIdWidget applicationId={application.id} className="mb-8" />
      )}

      {/* Grille des 3 cartes principales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Complétude du dossier */}
        <CompletionCard documents={documents} />

        {/* Messages de l'institution */}
        <InstitutionMessagesCard unreadCount={unreadComments} />

        {/* Prochaines actions */}
        <NextActionsCard
          status={currentStatus}
          hasIncompleteDocuments={hasIncompleteDocuments}
          hasUnreadComments={unreadComments > 0}
        />
      </div>

      {/* Section Actions rapides */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.4 }}
      >
        <h3 className="text-lg font-semibold mb-4">Accès rapides</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <QuickActionCard
            icon={FileText}
            title="Ma candidature"
            description="Voir ou modifier votre dossier"
            href={startup ? "/postuler" : "/postuler"}
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
      </motion.div>
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
