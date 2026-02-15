import { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface Application {
  id: string;
  status: string;
  submitted_at: string | null;
  notes: string | null;
  reviewed_at: string | null;
  created_at: string;
}

export interface Startup {
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

export interface Comment {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
}

export interface ApplicationWithDetails {
  application: Application;
  startup: Startup;
  comments: Comment[];
}

export const STATUS_CONFIG: Record<string, { 
  label: string; 
  variant: "default" | "secondary" | "destructive" | "outline";
  step: number;
  icon: string;
}> = {
  pending: { label: "En attente", variant: "secondary", step: 1, icon: "clock" },
  under_review: { label: "En cours d'examen", variant: "outline", step: 2, icon: "file" },
  approved: { label: "Approuvée", variant: "default", step: 4, icon: "check" },
  rejected: { label: "Rejetée", variant: "destructive", step: 4, icon: "x" },
};

export const generateTrackingId = (appId: string, createdAt: string) => {
  const year = new Date(createdAt).getFullYear();
  const shortId = appId.slice(0, 8).toUpperCase();
  return `LSN-${year}-${shortId}`;
};

export function useApplicationTracking() {
  const { user, loading: authLoading } = useAuth();
  const [applications, setApplications] = useState<ApplicationWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<ApplicationWithDetails | null>(null);

  const fetchApplications = async () => {
    if (!user || !supabase) return;

    setLoading(true);
    try {
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

      const startupIds = appsData.map(a => a.startup_id).filter(Boolean);
      const { data: startupsData } = await supabase
        .from("startups")
        .select("*")
        .in("id", startupIds);

      const appIds = appsData.map(a => a.id);
      const { data: commentsData } = await supabase
        .from("application_comments")
        .select("*")
        .in("application_id", appIds)
        .order("created_at", { ascending: false });

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
      
      if (!selectedApp && applicationsWithDetails.length > 0) {
        setSelectedApp(applicationsWithDetails[0]);
      }
    } catch (error: unknown) {
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

  useEffect(() => {
    if (user) {
      fetchApplications();
    }
  }, [user]);

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
        () => {
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

  return {
    user,
    authLoading,
    applications,
    loading,
    selectedApp,
    setSelectedApp,
    fetchApplications,
  };
}
