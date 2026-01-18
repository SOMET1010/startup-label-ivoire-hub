import { useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface DraftData {
  startupId?: string;
  applicationId?: string;
  formData: Record<string, any>;
  currentStep: number;
  lastSaved?: Date;
  status: "draft" | "pending" | "saved";
}

interface UseDraftApplicationOptions {
  autoSaveInterval?: number; // en millisecondes
  onSaveSuccess?: () => void;
  onSaveError?: (error: Error) => void;
}

export function useDraftApplication(options: UseDraftApplicationOptions = {}) {
  const { autoSaveInterval = 30000, onSaveSuccess, onSaveError } = options;
  const { user } = useAuth();
  
  const [draft, setDraft] = useState<DraftData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  
  const formDataRef = useRef<Record<string, any>>({});
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Charger le brouillon existant
  const loadDraft = useCallback(async () => {
    if (!user || !supabase) {
      setIsLoading(false);
      return;
    }

    try {
      // Chercher une startup en brouillon ou une application draft
      const { data: startups, error: startupError } = await supabase
        .from("startups")
        .select(`
          id,
          name,
          description,
          sector,
          website,
          stage,
          team_size,
          founded_date,
          legal_status,
          rccm,
          tax_id,
          address,
          founder_info,
          innovation,
          business_model,
          growth_potential,
          status,
          doc_rccm,
          doc_tax,
          doc_business_plan,
          doc_statutes,
          doc_cv,
          doc_pitch
        `)
        .eq("user_id", user.id)
        .eq("status", "draft")
        .order("updated_at", { ascending: false })
        .limit(1);

      if (startupError) throw startupError;

      if (startups && startups.length > 0) {
        const startup = startups[0];
        
        // Déterminer l'étape actuelle basée sur les données remplies
        let currentStep = 1;
        if (startup.description && startup.innovation) {
          currentStep = 2;
          if (startup.doc_rccm || startup.doc_tax) {
            currentStep = 3;
          }
        }

        const formData = {
          name: startup.name || "",
          legal_status: startup.legal_status || "",
          rccm: startup.rccm || "",
          tax_id: startup.tax_id || "",
          sector: startup.sector || "",
          address: startup.address || "",
          founded_date: startup.founded_date || "",
          website: startup.website || "",
          team_size: startup.team_size || 1,
          description: startup.description || "",
          innovation: startup.innovation || "",
          business_model: startup.business_model || "",
          growth_potential: startup.growth_potential || "",
          stage: startup.stage || "",
          founder_info: startup.founder_info || "",
        };

        setDraft({
          startupId: startup.id,
          formData,
          currentStep,
          status: "draft",
        });
        
        formDataRef.current = formData;
      }
    } catch (error) {
      console.error("Error loading draft:", error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Sauvegarder le brouillon
  const saveDraft = useCallback(async (
    formData: Record<string, any>,
    currentStep: number,
    silent: boolean = false
  ) => {
    if (!user || !supabase) return null;

    setIsSaving(true);

    try {
      let startupId = draft?.startupId;

      const startupData = {
        user_id: user.id,
        name: formData.name?.trim() || "Brouillon",
        description: formData.description?.trim() || null,
        sector: formData.sector || null,
        website: formData.website?.trim() || null,
        stage: formData.stage || null,
        team_size: formData.team_size || null,
        founded_date: formData.founded_date || null,
        legal_status: formData.legal_status || null,
        rccm: formData.rccm?.trim() || null,
        tax_id: formData.tax_id?.trim() || null,
        address: formData.address?.trim() || null,
        founder_info: formData.founder_info?.trim() || null,
        innovation: formData.innovation?.trim() || null,
        business_model: formData.business_model?.trim() || null,
        growth_potential: formData.growth_potential?.trim() || null,
        status: "draft",
      };

      if (startupId) {
        // Mettre à jour le brouillon existant
        const { error } = await supabase
          .from("startups")
          .update(startupData)
          .eq("id", startupId);

        if (error) throw error;
      } else {
        // Créer un nouveau brouillon
        const { data, error } = await supabase
          .from("startups")
          .insert(startupData)
          .select("id")
          .single();

        if (error) throw error;
        startupId = data.id;
      }

      const newDraft: DraftData = {
        startupId,
        formData,
        currentStep,
        lastSaved: new Date(),
        status: "saved",
      };

      setDraft(newDraft);
      setHasChanges(false);
      formDataRef.current = formData;

      if (!silent) {
        toast({
          title: "Brouillon sauvegardé",
          description: "Votre progression a été enregistrée.",
        });
      }

      onSaveSuccess?.();
      return startupId;
    } catch (error: any) {
      console.error("Error saving draft:", error);
      
      if (!silent) {
        toast({
          variant: "destructive",
          title: "Erreur de sauvegarde",
          description: error.message || "Impossible de sauvegarder le brouillon.",
        });
      }

      onSaveError?.(error);
      return null;
    } finally {
      setIsSaving(false);
    }
  }, [user, draft?.startupId, onSaveSuccess, onSaveError]);

  // Mettre à jour les données du formulaire (déclenche auto-save)
  const updateFormData = useCallback((newData: Record<string, any>, currentStep: number) => {
    formDataRef.current = { ...formDataRef.current, ...newData };
    setHasChanges(true);

    // Reset le timer d'auto-save
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }

    autoSaveTimerRef.current = setTimeout(() => {
      saveDraft(formDataRef.current, currentStep, true);
    }, autoSaveInterval);
  }, [saveDraft, autoSaveInterval]);

  // Supprimer le brouillon
  const deleteDraft = useCallback(async () => {
    if (!draft?.startupId || !supabase) return;

    try {
      const { error } = await supabase
        .from("startups")
        .delete()
        .eq("id", draft.startupId);

      if (error) throw error;

      setDraft(null);
      formDataRef.current = {};
      setHasChanges(false);

      toast({
        title: "Brouillon supprimé",
        description: "Votre brouillon a été supprimé.",
      });
    } catch (error: any) {
      console.error("Error deleting draft:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer le brouillon.",
      });
    }
  }, [draft?.startupId]);

  // Charger le brouillon au montage
  useEffect(() => {
    loadDraft();
  }, [loadDraft]);

  // Nettoyer le timer au démontage
  useEffect(() => {
    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, []);

  return {
    draft,
    isLoading,
    isSaving,
    hasChanges,
    hasDraft: !!draft?.startupId,
    saveDraft,
    updateFormData,
    deleteDraft,
    loadDraft,
  };
}

export default useDraftApplication;
