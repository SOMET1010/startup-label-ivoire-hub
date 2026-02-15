import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import useDraftApplication from "@/hooks/useDraftApplication";
import { startupFormSchema, type StartupFormData } from "@/components/forms/applicationFormSchema";

function extractFormData(values: Partial<StartupFormData>) {
  return {
    name: values.name || "",
    legal_status: values.legal_status || "",
    rccm: values.rccm || "",
    tax_id: values.tax_id || "",
    sector: values.sector || "",
    address: values.address || "",
    founded_date: values.founded_date || "",
    website: values.website || "",
    team_size: values.team_size || 1,
    description: values.description || "",
    innovation: values.innovation || "",
    business_model: values.business_model || "",
    growth_potential: values.growth_potential || "",
    stage: values.stage || "",
    founder_info: values.founder_info || "",
  };
}

export function useApplicationForm() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [trackingId, setTrackingId] = useState("");
  const [showDraftBanner, setShowDraftBanner] = useState(false);
  const [draftLoaded, setDraftLoaded] = useState(false);
  const hasInitializedDraft = useRef(false);

  const {
    draft,
    isLoading: isDraftLoading,
    isSaving,
    hasChanges,
    hasDraft,
    saveDraft,
    updateFormData,
    deleteDraft,
  } = useDraftApplication({
    autoSaveInterval: 30000,
    onSaveSuccess: () => {},
    onSaveError: (error) => {
      console.error("Draft save error:", error);
    },
  });

  const form = useForm<StartupFormData>({
    resolver: zodResolver(startupFormSchema),
    defaultValues: {
      name: "", legal_status: "", rccm: "", tax_id: "", sector: "",
      address: "", founded_date: "", website: "", team_size: 1,
      description: "", innovation: "", business_model: "", growth_potential: "",
      stage: "", founder_info: "",
      doc_rccm: null, doc_tax: null, doc_business_plan: null,
      doc_statutes: null, doc_cv: null, doc_pitch: null,
      terms_accepted: false,
    },
  });

  // Check for existing draft on load
  useEffect(() => {
    if (!isDraftLoading && hasDraft && draft && !hasInitializedDraft.current) {
      hasInitializedDraft.current = true;
      setShowDraftBanner(true);
    }
  }, [isDraftLoading, hasDraft, draft]);

  const handleResumeDraft = useCallback(() => {
    if (draft?.formData) {
      form.reset({ ...form.getValues(), ...extractFormData(draft.formData) });
      if (draft.currentStep) setCurrentStep(draft.currentStep);
      setDraftLoaded(true);
      setShowDraftBanner(false);
      toast({ title: "Brouillon chargé", description: "Votre brouillon a été restauré." });
    }
  }, [draft, form]);

  const handleDeleteDraft = useCallback(async () => {
    await deleteDraft();
    setShowDraftBanner(false);
    hasInitializedDraft.current = false;
    form.reset();
    setCurrentStep(1);
  }, [deleteDraft, form]);

  // Watch form changes for auto-save
  useEffect(() => {
    if (!draftLoaded && !showDraftBanner) return;
    const subscription = form.watch((values) => {
      if (values.name || values.description) {
        updateFormData(extractFormData(values), currentStep);
      }
    });
    return () => subscription.unsubscribe();
  }, [form, currentStep, updateFormData, draftLoaded, showDraftBanner]);

  const handleManualSave = useCallback(async () => {
    const formData = extractFormData(form.getValues());
    await saveDraft(formData, currentStep, false);
    setDraftLoaded(true);
  }, [form, currentStep, saveDraft]);

  const uploadFile = async (file: File, userId: string, startupId: string, docType: string): Promise<string | null> => {
    const extension = file.name.split(".").pop();
    const fileName = `${userId}/${startupId}/${docType}_${Date.now()}.${extension}`;
    const { error } = await supabase!.storage
      .from("application-documents")
      .upload(fileName, file, { cacheControl: "3600", upsert: false });
    if (error) throw new Error(`Erreur lors du téléversement de ${docType}`);
    return fileName;
  };

  const handleSubmit = async (data: StartupFormData) => {
    if (!user) {
      toast({ variant: "destructive", title: "Connexion requise", description: "Vous devez être connecté pour soumettre une candidature." });
      navigate("/auth");
      return;
    }

    setIsLoading(true);
    setIsUploading(true);

    try {
      let startupId = draft?.startupId;
      const startupPayload = {
        name: data.name.trim(), description: data.description.trim(), sector: data.sector,
        website: data.website?.trim() || null, stage: data.stage, team_size: data.team_size,
        founded_date: data.founded_date || null, legal_status: data.legal_status,
        rccm: data.rccm.trim(), tax_id: data.tax_id.trim(), address: data.address.trim(),
        founder_info: data.founder_info.trim(), innovation: data.innovation.trim(),
        business_model: data.business_model.trim(), growth_potential: data.growth_potential.trim(),
        status: "submitted",
      };

      if (startupId) {
        const { error } = await supabase!.from("startups").update(startupPayload).eq("id", startupId);
        if (error) throw error;
      } else {
        const { data: startupData, error } = await supabase!.from("startups").insert({ ...startupPayload, user_id: user.id }).select().single();
        if (error) throw error;
        startupId = startupData.id;
      }

      // Upload documents
      const documentUrls: Record<string, string | null> = { doc_rccm: null, doc_tax: null, doc_business_plan: null, doc_statutes: null, doc_cv: null, doc_pitch: null };
      const docFields = ["doc_rccm", "doc_tax", "doc_business_plan", "doc_statutes", "doc_cv", "doc_pitch"] as const;
      const docTypeMap = { doc_rccm: "rccm", doc_tax: "tax", doc_business_plan: "business_plan", doc_statutes: "statutes", doc_cv: "cv", doc_pitch: "pitch" };

      await Promise.all(
        docFields
          .filter((key) => data[key])
          .map((key) =>
            uploadFile(data[key]!, user.id, startupId!, docTypeMap[key]).then((url) => { documentUrls[key] = url; })
          )
      );
      setIsUploading(false);

      await supabase!.from("startups").update(documentUrls).eq("id", startupId);

      const { data: applicationData, error: applicationError } = await supabase!
        .from("applications")
        .insert({ user_id: user.id, startup_id: startupId!, status: "pending", submitted_at: new Date().toISOString() })
        .select().single();
      if (applicationError) throw applicationError;

      const shortId = applicationData.id.slice(0, 8).toUpperCase();
      setTrackingId(`LSN-${new Date().getFullYear()}-${shortId}`);
      setShowConfirmation(true);
      toast({ title: "Candidature soumise avec succès", description: "Votre dossier a été transmis au Comité de Labellisation pour examen." });
    } catch (error: unknown) {
      console.error("Submission error:", error);
      toast({ variant: "destructive", title: "Erreur de soumission", description: error instanceof Error ? error.message : "Une erreur est survenue lors de la soumission." });
    } finally {
      setIsLoading(false);
      setIsUploading(false);
    }
  };

  const nextStep = async () => {
    const stepFields: Record<number, (keyof StartupFormData)[]> = {
      1: ["name", "legal_status", "rccm", "tax_id", "sector", "address", "founded_date", "website", "team_size"],
      2: ["description", "innovation", "business_model", "growth_potential", "stage", "founder_info"],
      3: ["doc_rccm", "doc_tax", "doc_business_plan"],
    };
    const fieldsToValidate = stepFields[currentStep] || [];
    const isValid = await form.trigger(fieldsToValidate);
    if (isValid) {
      if (draftLoaded || hasChanges) {
        await saveDraft(extractFormData(form.getValues()), currentStep + 1, true);
      }
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
    window.scrollTo(0, 0);
  };

  return {
    form, currentStep, isLoading, isUploading,
    showConfirmation, setShowConfirmation, trackingId,
    showDraftBanner, draftLoaded, isDraftLoading, isSaving,
    hasChanges, hasDraft, draft, authLoading, user,
    handleResumeDraft, handleDeleteDraft, handleManualSave,
    handleSubmit, nextStep, prevStep,
  };
}
