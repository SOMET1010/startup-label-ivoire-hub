import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export interface Investor {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  type: string | null;
  investment_stages: string[] | null;
  ticket_min: number | null;
  ticket_max: number | null;
  target_sectors: string[] | null;
  location: string | null;
  website: string | null;
  logo_url: string | null;
  portfolio_count: number;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface InvestorInterest {
  id: string;
  investor_id: string;
  startup_id: string;
  status: string;
  notes: string | null;
  created_at: string;
  startup?: {
    id: string;
    name: string;
    sector: string | null;
    stage: string | null;
    description: string | null;
    logo_url: string | null;
    team_size: number | null;
    website: string | null;
  };
}

export interface LabeledStartup {
  id: string;
  name: string;
  sector: string | null;
  stage: string | null;
  description: string | null;
  logo_url: string | null;
  team_size: number | null;
  website: string | null;
  label_granted_at: string | null;
}

export function useInvestorData() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch investor profile
  const { data: investor, isLoading: investorLoading } = useQuery({
    queryKey: ["investor-profile", user?.id],
    queryFn: async () => {
      if (!supabase || !user) return null;
      const { data, error } = await supabase
        .from("investors")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();
      if (error) throw error;
      return data as Investor | null;
    },
    enabled: !!user,
  });

  // Fetch labeled startups (approved applications)
  const { data: labeledStartups = [], isLoading: startupsLoading } = useQuery({
    queryKey: ["labeled-startups"],
    queryFn: async () => {
      if (!supabase) return [];
      const { data, error } = await supabase
        .from("startups")
        .select("id, name, sector, stage, description, logo_url, team_size, website, label_granted_at")
        .eq("is_visible_in_directory", true)
        .not("label_granted_at", "is", null);
      if (error) throw error;
      return (data || []) as LabeledStartup[];
    },
    enabled: !!user,
  });

  // Fetch investor interests
  const { data: interests = [], isLoading: interestsLoading } = useQuery({
    queryKey: ["investor-interests", investor?.id],
    queryFn: async () => {
      if (!supabase || !investor) return [];
      const { data, error } = await supabase
        .from("investor_interests")
        .select("*, startup:startups(id, name, sector, stage, description, logo_url, team_size, website)")
        .eq("investor_id", investor.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data || []) as InvestorInterest[];
    },
    enabled: !!investor,
  });

  // Toggle interest for a startup
  const toggleInterest = useMutation({
    mutationFn: async (startupId: string) => {
      if (!supabase || !investor) throw new Error("Not authenticated");

      const existing = interests.find((i) => i.startup_id === startupId);
      if (existing) {
        const { error } = await supabase
          .from("investor_interests")
          .delete()
          .eq("id", existing.id);
        if (error) throw error;
        return { action: "removed" };
      } else {
        const { error } = await supabase
          .from("investor_interests")
          .insert({ investor_id: investor.id, startup_id: startupId });
        if (error) throw error;
        return { action: "added" };
      }
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ["investor-interests"] });
      toast({
        title: result.action === "added" ? "Intérêt marqué" : "Intérêt retiré",
        description: result.action === "added"
          ? "La startup a été ajoutée à vos intérêts."
          : "La startup a été retirée de vos intérêts.",
      });
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Impossible de modifier votre intérêt.",
        variant: "destructive",
      });
    },
  });

  // Update interest status/notes
  const updateInterest = useMutation({
    mutationFn: async ({ id, status, notes }: { id: string; status?: string; notes?: string }) => {
      if (!supabase) throw new Error("Not authenticated");
      const updates: Record<string, string | undefined> = {};
      if (status !== undefined) updates.status = status;
      if (notes !== undefined) updates.notes = notes;

      const { error } = await supabase
        .from("investor_interests")
        .update(updates)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["investor-interests"] });
      toast({ title: "Mis à jour", description: "L'intérêt a été mis à jour." });
    },
    onError: () => {
      toast({ title: "Erreur", description: "Mise à jour impossible.", variant: "destructive" });
    },
  });

  // Update investor profile
  const updateProfile = useMutation({
    mutationFn: async (updates: Partial<Investor>) => {
      if (!supabase || !investor) throw new Error("Not authenticated");
      const { error } = await supabase
        .from("investors")
        .update(updates)
        .eq("id", investor.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["investor-profile"] });
      toast({ title: "Profil mis à jour", description: "Vos informations ont été enregistrées." });
    },
    onError: () => {
      toast({ title: "Erreur", description: "Mise à jour impossible.", variant: "destructive" });
    },
  });

  const stats = {
    availableStartups: labeledStartups.length,
    markedInterests: interests.length,
    contacted: interests.filter((i) => i.status === "contacted").length,
    sectors: [...new Set(labeledStartups.map((s) => s.sector).filter(Boolean))].length,
  };

  return {
    investor,
    investorLoading,
    labeledStartups,
    startupsLoading,
    interests,
    interestsLoading,
    stats,
    toggleInterest,
    updateInterest,
    updateProfile,
  };
}
