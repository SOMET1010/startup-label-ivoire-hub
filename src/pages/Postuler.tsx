import { useState, useEffect, useCallback, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { ClipboardCheck, Loader2, FileText, Building2, Users, Upload, Save } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import FileUploadField from "@/components/forms/FileUploadField";
import DraftStatusIndicator from "@/components/forms/DraftStatusIndicator";
import DraftResumeBanner from "@/components/forms/DraftResumeBanner";
import useDraftApplication from "@/hooks/useDraftApplication";
import { FormErrorSummary } from "@/components/forms/FormErrorSummary";
import { DocumentsChecklist } from "@/components/forms/DocumentsChecklist";
import { SEOHead } from "@/components/shared/SEOHead";
import { PageBreadcrumb } from "@/components/shared/PageBreadcrumb";

// File validation helper - returns undefined if valid file or no file for optional, or File
const fileSchema = (required: boolean = false) => {
  return z.custom<File | null>((val) => {
    if (required && !val) return false;
    if (!val) return true;
    if (!(val instanceof File)) return false;
    const maxSize = 10 * 1024 * 1024; // 10MB
    return val.size <= maxSize;
  }, {
    message: required ? "Ce document est requis" : "Fichier invalide ou trop volumineux (max 10 Mo)"
  }).nullable();
};

const startupFormSchema = z.object({
  // Étape 1: Informations entreprise
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères").max(100, "Le nom ne peut pas dépasser 100 caractères"),
  legal_status: z.string().min(1, "Veuillez sélectionner un statut juridique"),
  rccm: z.string().min(1, "Le numéro RCCM est requis").max(50, "Numéro RCCM trop long"),
  tax_id: z.string().min(1, "Le NIF est requis").max(50, "NIF trop long"),
  sector: z.string().min(1, "Veuillez sélectionner un secteur"),
  address: z.string().min(5, "L'adresse doit contenir au moins 5 caractères").max(200, "Adresse trop longue"),
  founded_date: z.string().min(1, "La date de création est requise"),
  website: z.string().url("URL invalide").or(z.literal("")).optional(),
  team_size: z.coerce.number().min(1, "Minimum 1 employé").max(10000, "Maximum 10000 employés"),

  // Étape 2: Projet et équipe
  description: z.string().min(50, "La description doit contenir au moins 50 caractères").max(2000, "La description ne peut pas dépasser 2000 caractères"),
  innovation: z.string().min(20, "Décrivez votre innovation (min 20 caractères)").max(1000, "Maximum 1000 caractères"),
  business_model: z.string().min(20, "Décrivez votre modèle économique (min 20 caractères)").max(1000, "Maximum 1000 caractères"),
  growth_potential: z.string().min(20, "Décrivez votre potentiel de croissance (min 20 caractères)").max(1000, "Maximum 1000 caractères"),
  stage: z.string().min(1, "Veuillez sélectionner un stade"),
  founder_info: z.string().min(10, "Présentez brièvement les fondateurs (min 10 caractères)").max(500, "Maximum 500 caractères"),

  // Étape 3: Documents (validés séparément)
  doc_rccm: fileSchema(true),
  doc_tax: fileSchema(true),
  doc_business_plan: fileSchema(true),
  doc_statutes: fileSchema(false),
  doc_cv: fileSchema(false),
  doc_pitch: fileSchema(false),

  // Étape 4: Validation
  terms_accepted: z.boolean().refine(val => val === true, "Vous devez accepter les conditions"),
});

type StartupFormData = z.infer<typeof startupFormSchema>;

const LEGAL_STATUS = [
  { value: "sarl", label: "SARL" },
  { value: "sa", label: "SA" },
  { value: "sas", label: "SAS" },
  { value: "sasu", label: "SASU" },
  { value: "ei", label: "Entreprise Individuelle" },
  { value: "association", label: "Association" },
  { value: "cooperative", label: "Coopérative" },
  { value: "other", label: "Autre" },
];

const SECTORS = [
  { value: "fintech", label: "FinTech" },
  { value: "edtech", label: "EdTech" },
  { value: "healthtech", label: "HealthTech" },
  { value: "agritech", label: "AgriTech" },
  { value: "ecommerce", label: "E-commerce" },
  { value: "mobility", label: "Mobilité" },
  { value: "cleantech", label: "CleanTech" },
  { value: "proptech", label: "PropTech" },
  { value: "other", label: "Autre" },
];

const STAGES = [
  { value: "idea", label: "Idéation" },
  { value: "mvp", label: "MVP" },
  { value: "early", label: "Early Stage" },
  { value: "growth", label: "Growth" },
  { value: "scale", label: "Scale-up" },
];

const STEPS = [
  { id: 1, label: "Entreprise", icon: Building2 },
  { id: 2, label: "Projet", icon: Users },
  { id: 3, label: "Documents", icon: Upload },
  { id: 4, label: "Validation", icon: ClipboardCheck },
];

const Postuler = () => {
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

  // Draft management hook
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
    autoSaveInterval: 30000, // 30 seconds
    onSaveSuccess: () => {},
    onSaveError: (error) => {
      console.error("Draft save error:", error);
    },
  });

  const form = useForm<StartupFormData>({
    resolver: zodResolver(startupFormSchema),
    defaultValues: {
      name: "",
      legal_status: "",
      rccm: "",
      tax_id: "",
      sector: "",
      address: "",
      founded_date: "",
      website: "",
      team_size: 1,
      description: "",
      innovation: "",
      business_model: "",
      growth_potential: "",
      stage: "",
      founder_info: "",
      doc_rccm: null,
      doc_tax: null,
      doc_business_plan: null,
      doc_statutes: null,
      doc_cv: null,
      doc_pitch: null,
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

  // Handle resuming draft
  const handleResumeDraft = useCallback(() => {
    if (draft?.formData) {
      // Reset form with draft data
      form.reset({
        ...form.getValues(),
        name: draft.formData.name || "",
        legal_status: draft.formData.legal_status || "",
        rccm: draft.formData.rccm || "",
        tax_id: draft.formData.tax_id || "",
        sector: draft.formData.sector || "",
        address: draft.formData.address || "",
        founded_date: draft.formData.founded_date || "",
        website: draft.formData.website || "",
        team_size: draft.formData.team_size || 1,
        description: draft.formData.description || "",
        innovation: draft.formData.innovation || "",
        business_model: draft.formData.business_model || "",
        growth_potential: draft.formData.growth_potential || "",
        stage: draft.formData.stage || "",
        founder_info: draft.formData.founder_info || "",
      });
      
      // Go to saved step
      if (draft.currentStep) {
        setCurrentStep(draft.currentStep);
      }
      
      setDraftLoaded(true);
      setShowDraftBanner(false);
      
      toast({
        title: "Brouillon chargé",
        description: "Votre brouillon a été restauré. Vous pouvez continuer votre candidature.",
      });
    }
  }, [draft, form]);

  // Handle deleting draft
  const handleDeleteDraft = useCallback(async () => {
    await deleteDraft();
    setShowDraftBanner(false);
    hasInitializedDraft.current = false;
    
    // Reset form to defaults
    form.reset();
    setCurrentStep(1);
  }, [deleteDraft, form]);

  // Watch form changes for auto-save
  useEffect(() => {
    if (!draftLoaded && !showDraftBanner) return;
    
    const subscription = form.watch((values) => {
      // Only update if we have some data
      if (values.name || values.description) {
        const formData = {
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
        updateFormData(formData, currentStep);
      }
    });
    
    return () => subscription.unsubscribe();
  }, [form, currentStep, updateFormData, draftLoaded, showDraftBanner]);

  // Manual save handler
  const handleManualSave = useCallback(async () => {
    const values = form.getValues();
    const formData = {
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
    await saveDraft(formData, currentStep, false);
    setDraftLoaded(true);
  }, [form, currentStep, saveDraft]);

  const uploadFile = async (file: File, userId: string, startupId: string, docType: string): Promise<string | null> => {
    const extension = file.name.split(".").pop();
    const fileName = `${userId}/${startupId}/${docType}_${Date.now()}.${extension}`;
    
    const { error } = await supabase.storage
      .from("application-documents")
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.error(`Upload error for ${docType}:`, error);
      throw new Error(`Erreur lors du téléversement de ${docType}`);
    }

    return fileName;
  };

  const handleSubmit = async (data: StartupFormData) => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Connexion requise",
        description: "Vous devez être connecté pour soumettre une candidature.",
      });
      navigate("/auth");
      return;
    }

    setIsLoading(true);
    setIsUploading(true);

    try {
      let startupId = draft?.startupId;
      
      // If we have a draft, update the existing startup
      if (startupId) {
        const { error: updateError } = await supabase
          .from("startups")
          .update({
            name: data.name.trim(),
            description: data.description.trim(),
            sector: data.sector,
            website: data.website?.trim() || null,
            stage: data.stage,
            team_size: data.team_size,
            founded_date: data.founded_date || null,
            legal_status: data.legal_status,
            rccm: data.rccm.trim(),
            tax_id: data.tax_id.trim(),
            address: data.address.trim(),
            founder_info: data.founder_info.trim(),
            innovation: data.innovation.trim(),
            business_model: data.business_model.trim(),
            growth_potential: data.growth_potential.trim(),
            status: "submitted",
          })
          .eq("id", startupId);

        if (updateError) throw updateError;
      } else {
        // Create new startup record
        const { data: startupData, error: startupError } = await supabase
          .from("startups")
          .insert({
            user_id: user.id,
            name: data.name.trim(),
            description: data.description.trim(),
            sector: data.sector,
            website: data.website?.trim() || null,
            stage: data.stage,
            team_size: data.team_size,
            founded_date: data.founded_date || null,
            legal_status: data.legal_status,
            rccm: data.rccm.trim(),
            tax_id: data.tax_id.trim(),
            address: data.address.trim(),
            founder_info: data.founder_info.trim(),
            innovation: data.innovation.trim(),
            business_model: data.business_model.trim(),
            growth_potential: data.growth_potential.trim(),
            status: "submitted",
          })
          .select()
          .single();

        if (startupError) throw startupError;
        startupId = startupData.id;
      }

      // Upload documents
      const documentUrls: Record<string, string | null> = {
        doc_rccm: null,
        doc_tax: null,
        doc_business_plan: null,
        doc_statutes: null,
        doc_cv: null,
        doc_pitch: null,
      };

      const uploadPromises: Promise<void>[] = [];

      if (data.doc_rccm) {
        uploadPromises.push(
          uploadFile(data.doc_rccm, user.id, startupId!, "rccm").then(url => {
            documentUrls.doc_rccm = url;
          })
        );
      }
      if (data.doc_tax) {
        uploadPromises.push(
          uploadFile(data.doc_tax, user.id, startupId!, "tax").then(url => {
            documentUrls.doc_tax = url;
          })
        );
      }
      if (data.doc_business_plan) {
        uploadPromises.push(
          uploadFile(data.doc_business_plan, user.id, startupId!, "business_plan").then(url => {
            documentUrls.doc_business_plan = url;
          })
        );
      }
      if (data.doc_statutes) {
        uploadPromises.push(
          uploadFile(data.doc_statutes, user.id, startupId!, "statutes").then(url => {
            documentUrls.doc_statutes = url;
          })
        );
      }
      if (data.doc_cv) {
        uploadPromises.push(
          uploadFile(data.doc_cv, user.id, startupId!, "cv").then(url => {
            documentUrls.doc_cv = url;
          })
        );
      }
      if (data.doc_pitch) {
        uploadPromises.push(
          uploadFile(data.doc_pitch, user.id, startupId!, "pitch").then(url => {
            documentUrls.doc_pitch = url;
          })
        );
      }

      await Promise.all(uploadPromises);
      setIsUploading(false);

      // Update startup with document URLs
      const { error: docUpdateError } = await supabase
        .from("startups")
        .update(documentUrls)
        .eq("id", startupId);

      if (docUpdateError) throw docUpdateError;

      // Create application record
      const { data: applicationData, error: applicationError } = await supabase
        .from("applications")
        .insert({
          user_id: user.id,
          startup_id: startupId!,
          status: "pending",
          submitted_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (applicationError) throw applicationError;

      // Generate tracking ID from application ID
      const shortId = applicationData.id.slice(0, 8).toUpperCase();
      setTrackingId(`LSN-${new Date().getFullYear()}-${shortId}`);
      setShowConfirmation(true);

      toast({
        title: "Candidature soumise avec succès",
        description: "Votre dossier a été transmis au Comité de Labellisation pour examen.",
      });
    } catch (error: unknown) {
      console.error("Submission error:", error);
      toast({
        variant: "destructive",
        title: "Erreur de soumission",
        description: error instanceof Error ? error.message : "Une erreur est survenue lors de la soumission.",
      });
    } finally {
      setIsLoading(false);
      setIsUploading(false);
    }
  };

  const nextStep = async () => {
    let fieldsToValidate: (keyof StartupFormData)[] = [];
    
    if (currentStep === 1) {
      fieldsToValidate = ["name", "legal_status", "rccm", "tax_id", "sector", "address", "founded_date", "website", "team_size"];
    } else if (currentStep === 2) {
      fieldsToValidate = ["description", "innovation", "business_model", "growth_potential", "stage", "founder_info"];
    } else if (currentStep === 3) {
      fieldsToValidate = ["doc_rccm", "doc_tax", "doc_business_plan"];
    }

    const isValid = await form.trigger(fieldsToValidate);
    if (isValid) {
      // Save draft when changing step
      if (draftLoaded || hasChanges) {
        const values = form.getValues();
        const formData = {
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
        await saveDraft(formData, currentStep + 1, true);
      }
      
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
    window.scrollTo(0, 0);
  };

  // Show loading state while checking auth or draft
  if (authLoading || isDraftLoading) {
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
              <h1 className="text-2xl font-bold mb-4">Connexion requise</h1>
              <p className="text-muted-foreground mb-6">
                Vous devez être connecté pour soumettre une candidature au Label Startup Numérique.
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

  const formValues = form.watch();

  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead
        title="Postuler au Label Startup Numérique"
        description="Soumettez votre candidature pour obtenir le Label Startup Numérique en Côte d'Ivoire. Formulaire officiel de demande de labellisation."
        path="/postuler"
        noindex
      />
      <Navbar />
      <main id="main-content" className="flex-grow py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <PageBreadcrumb />
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-2">Demande de labellisation</h1>
              <p className="text-muted-foreground">
                Complétez ce formulaire pour soumettre votre candidature au Label Startup numérique
              </p>
            </div>

            {/* Draft Resume Banner */}
            {showDraftBanner && draft && (
              <DraftResumeBanner
                startupName={draft.formData?.name || "Candidature"}
                lastModified={draft.lastSaved}
                onResume={handleResumeDraft}
                onDelete={handleDeleteDraft}
              />
            )}

            {/* Draft Status Indicator */}
            {(draftLoaded || hasDraft) && !showDraftBanner && (
              <div className="mb-6">
                <DraftStatusIndicator
                  isSaving={isSaving}
                  hasChanges={hasChanges}
                  lastSaved={draft?.lastSaved}
                  onManualSave={handleManualSave}
                />
              </div>
            )}

            {/* Résumé des erreurs en haut du formulaire */}
            {Object.keys(form.formState.errors).length > 0 && form.formState.isSubmitted && (
              <FormErrorSummary errors={form.formState.errors} />
            )}

            {/* Progress bar */}
            <div className="mb-8">
              <div className="w-full bg-muted rounded-full h-2.5">
                <div
                  className="bg-gradient-to-r from-primary to-accent h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${(currentStep / 4) * 100}%` }}
                ></div>
              </div>
              <div className="flex justify-between mt-3">
                {STEPS.map((step) => {
                  const Icon = step.icon;
                  return (
                    <div
                      key={step.id}
                      className={`flex flex-col items-center gap-1 ${
                        currentStep >= step.id ? "text-primary" : "text-muted-foreground"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span className={`text-xs font-medium ${currentStep >= step.id ? "" : ""}`}>
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)}>
                <div className="bg-card rounded-xl shadow-sm p-8">
                  {/* Étape 1: Informations entreprise */}
                  {currentStep === 1 && (
                    <div>
                      <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <Building2 className="h-5 w-5" />
                        Informations de l'entreprise
                      </h2>

                      {/* Checklist documents - visible dès l'étape 1 */}
                      <DocumentsChecklist className="mb-6" />

                      <div className="space-y-4">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nom de la startup *</FormLabel>
                              <FormControl>
                                <Input placeholder="Ex: TechInnovate CI" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="legal_status"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Statut juridique *</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Sélectionner" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {LEGAL_STATUS.map((status) => (
                                      <SelectItem key={status.value} value={status.value}>
                                        {status.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="sector"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Secteur d'activité *</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Sélectionner" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {SECTORS.map((sector) => (
                                      <SelectItem key={sector.value} value={sector.value}>
                                        {sector.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="rccm"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Numéro RCCM *</FormLabel>
                                <FormControl>
                                  <Input placeholder="Ex: CI-ABJ-2023-B-12345" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="tax_id"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Numéro d'Identification Fiscale (NIF) *</FormLabel>
                                <FormControl>
                                  <Input placeholder="Ex: 1234567890" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={form.control}
                          name="address"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Adresse du siège social *</FormLabel>
                              <FormControl>
                                <Input placeholder="Ex: Cocody, Rue des Jardins, Abidjan" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <FormField
                            control={form.control}
                            name="founded_date"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Date de création *</FormLabel>
                                <FormControl>
                                  <Input type="date" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="team_size"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Nombre d'employés *</FormLabel>
                                <FormControl>
                                  <Input type="number" min="1" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="website"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Site web</FormLabel>
                                <FormControl>
                                  <Input type="url" placeholder="https://..." {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      <div className="mt-8 flex justify-between">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleManualSave}
                          disabled={isSaving}
                          className="gap-2"
                        >
                          <Save className="h-4 w-4" />
                          Sauvegarder
                        </Button>
                        <Button type="button" onClick={nextStep}>
                          Étape suivante
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Étape 2: Projet et équipe */}
                  {currentStep === 2 && (
                    <div>
                      <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        Projet et Équipe
                      </h2>

                      <div className="space-y-6">
                        <FormField
                          control={form.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Description du projet *</FormLabel>
                              <FormControl>
                                <Textarea
                                  rows={4}
                                  placeholder="Décrivez votre projet, votre proposition de valeur et votre marché cible..."
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription>
                                {field.value.length}/2000 caractères (minimum 50)
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="innovation"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Innovation et différenciation *</FormLabel>
                              <FormControl>
                                <Textarea
                                  rows={3}
                                  placeholder="Qu'est-ce qui rend votre solution innovante ? Quels sont vos avantages concurrentiels ?"
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription>
                                {field.value.length}/1000 caractères
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="business_model"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Modèle économique *</FormLabel>
                              <FormControl>
                                <Textarea
                                  rows={3}
                                  placeholder="Comment générez-vous des revenus ? Décrivez votre stratégie de monétisation..."
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription>
                                {field.value.length}/1000 caractères
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="growth_potential"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Potentiel de croissance *</FormLabel>
                              <FormControl>
                                <Textarea
                                  rows={3}
                                  placeholder="Quel est le potentiel de marché ? Quels sont vos objectifs à 3-5 ans ?"
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription>
                                {field.value.length}/1000 caractères
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="stage"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Stade de développement *</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Sélectionner le stade" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {STAGES.map((stage) => (
                                      <SelectItem key={stage.value} value={stage.value}>
                                        {stage.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={form.control}
                          name="founder_info"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Présentation des fondateurs *</FormLabel>
                              <FormControl>
                                <Textarea
                                  rows={3}
                                  placeholder="Présentez brièvement les fondateurs et leurs parcours..."
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription>
                                {field.value.length}/500 caractères
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="mt-8 flex justify-between">
                        <div className="flex gap-2">
                          <Button type="button" variant="outline" onClick={prevStep}>
                            Étape précédente
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            onClick={handleManualSave}
                            disabled={isSaving}
                            className="gap-2"
                          >
                            <Save className="h-4 w-4" />
                            Sauvegarder
                          </Button>
                        </div>
                        <Button type="button" onClick={nextStep}>
                          Étape suivante
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Étape 3: Documents */}
                  {currentStep === 3 && (
                    <div>
                      <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <Upload className="h-5 w-5" />
                        Documents justificatifs
                      </h2>

                      <div className="bg-muted/50 p-4 rounded-lg mb-6">
                        <p className="text-sm text-muted-foreground">
                          Téléversez les documents requis pour compléter votre dossier de candidature.
                          Les formats acceptés sont : PDF, DOC, DOCX, PPT, PPTX (max. 10 Mo par fichier).
                        </p>
                      </div>

                      <div className="space-y-6">
                        <div className="border-b pb-4">
                          <h3 className="font-semibold mb-4 text-primary">Documents obligatoires</h3>
                          <div className="grid gap-6">
                            <FormField
                              control={form.control}
                              name="doc_rccm"
                              render={({ field }) => (
                                <FormItem>
                                  <FileUploadField
                                    name="doc_rccm"
                                    label="Extrait RCCM"
                                    description="Registre du Commerce et du Crédit Mobilier"
                                    required
                                    value={field.value}
                                    onChange={field.onChange}
                                    error={form.formState.errors.doc_rccm?.message}
                                  />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="doc_tax"
                              render={({ field }) => (
                                <FormItem>
                                  <FileUploadField
                                    name="doc_tax"
                                    label="Attestation fiscale"
                                    description="Attestation de situation fiscale en cours de validité"
                                    required
                                    value={field.value}
                                    onChange={field.onChange}
                                    error={form.formState.errors.doc_tax?.message}
                                  />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="doc_business_plan"
                              render={({ field }) => (
                                <FormItem>
                                  <FileUploadField
                                    name="doc_business_plan"
                                    label="Business Plan"
                                    description="Plan d'affaires détaillé avec projections financières"
                                    required
                                    value={field.value}
                                    onChange={field.onChange}
                                    error={form.formState.errors.doc_business_plan?.message}
                                  />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>

                        <div>
                          <h3 className="font-semibold mb-4 text-muted-foreground">Documents optionnels</h3>
                          <div className="grid gap-6">
                            <FormField
                              control={form.control}
                              name="doc_statutes"
                              render={({ field }) => (
                                <FormItem>
                                  <FileUploadField
                                    name="doc_statutes"
                                    label="Statuts de l'entreprise"
                                    description="Copie des statuts enregistrés"
                                    value={field.value}
                                    onChange={field.onChange}
                                    error={form.formState.errors.doc_statutes?.message}
                                  />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="doc_cv"
                              render={({ field }) => (
                                <FormItem>
                                  <FileUploadField
                                    name="doc_cv"
                                    label="CV des fondateurs"
                                    description="Curriculum vitae des principaux dirigeants"
                                    value={field.value}
                                    onChange={field.onChange}
                                    error={form.formState.errors.doc_cv?.message}
                                  />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="doc_pitch"
                              render={({ field }) => (
                                <FormItem>
                                  <FileUploadField
                                    name="doc_pitch"
                                    label="Pitch Deck"
                                    description="Présentation de votre projet (PowerPoint ou PDF)"
                                    value={field.value}
                                    onChange={field.onChange}
                                    error={form.formState.errors.doc_pitch?.message}
                                  />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="mt-8 flex justify-between">
                        <Button type="button" variant="outline" onClick={prevStep}>
                          Étape précédente
                        </Button>
                        <Button type="button" onClick={nextStep}>
                          Étape suivante
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Étape 4: Validation */}
                  {currentStep === 4 && (
                    <div>
                      <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <ClipboardCheck className="h-5 w-5" />
                        Révision et soumission
                      </h2>

                      <div className="space-y-6">
                        <div className="bg-muted/50 p-4 rounded-lg">
                          <h3 className="font-bold mb-2">Récapitulatif de votre candidature</h3>
                          <p className="text-muted-foreground mb-4">
                            Veuillez vérifier attentivement les informations renseignées avant de soumettre votre candidature.
                          </p>

                          <Tabs defaultValue="entreprise">
                            <TabsList className="mb-4 flex-wrap h-auto">
                              <TabsTrigger value="entreprise">Entreprise</TabsTrigger>
                              <TabsTrigger value="projet">Projet</TabsTrigger>
                              <TabsTrigger value="documents">Documents</TabsTrigger>
                            </TabsList>

                            <TabsContent value="entreprise">
                              <div className="text-sm space-y-2">
                                <div className="grid grid-cols-2 gap-2">
                                  <div className="font-medium">Nom :</div>
                                  <div>{formValues.name || "-"}</div>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                  <div className="font-medium">Statut juridique :</div>
                                  <div>{LEGAL_STATUS.find(s => s.value === formValues.legal_status)?.label || "-"}</div>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                  <div className="font-medium">RCCM :</div>
                                  <div>{formValues.rccm || "-"}</div>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                  <div className="font-medium">NIF :</div>
                                  <div>{formValues.tax_id || "-"}</div>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                  <div className="font-medium">Secteur :</div>
                                  <div>{SECTORS.find(s => s.value === formValues.sector)?.label || "-"}</div>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                  <div className="font-medium">Adresse :</div>
                                  <div>{formValues.address || "-"}</div>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                  <div className="font-medium">Date de création :</div>
                                  <div>{formValues.founded_date || "-"}</div>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                  <div className="font-medium">Site web :</div>
                                  <div>{formValues.website || "-"}</div>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                  <div className="font-medium">Employés :</div>
                                  <div>{formValues.team_size}</div>
                                </div>
                              </div>
                            </TabsContent>

                            <TabsContent value="projet">
                              <div className="text-sm space-y-3">
                                <div>
                                  <div className="font-medium mb-1">Description :</div>
                                  <div className="text-muted-foreground whitespace-pre-wrap text-xs">
                                    {formValues.description || "-"}
                                  </div>
                                </div>
                                <div>
                                  <div className="font-medium mb-1">Innovation :</div>
                                  <div className="text-muted-foreground whitespace-pre-wrap text-xs">
                                    {formValues.innovation || "-"}
                                  </div>
                                </div>
                                <div>
                                  <div className="font-medium mb-1">Modèle économique :</div>
                                  <div className="text-muted-foreground whitespace-pre-wrap text-xs">
                                    {formValues.business_model || "-"}
                                  </div>
                                </div>
                                <div>
                                  <div className="font-medium mb-1">Potentiel de croissance :</div>
                                  <div className="text-muted-foreground whitespace-pre-wrap text-xs">
                                    {formValues.growth_potential || "-"}
                                  </div>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                  <div className="font-medium">Stade :</div>
                                  <div>{STAGES.find(s => s.value === formValues.stage)?.label || "-"}</div>
                                </div>
                                <div>
                                  <div className="font-medium mb-1">Fondateurs :</div>
                                  <div className="text-muted-foreground whitespace-pre-wrap text-xs">
                                    {formValues.founder_info || "-"}
                                  </div>
                                </div>
                              </div>
                            </TabsContent>

                            <TabsContent value="documents">
                              <div className="text-sm space-y-2">
                                <div className="flex items-center gap-2">
                                  <FileText className="h-4 w-4" />
                                  <span className="font-medium">RCCM :</span>
                                  <span className={formValues.doc_rccm ? "text-green-600" : "text-destructive"}>
                                    {formValues.doc_rccm?.name || "Non fourni"}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <FileText className="h-4 w-4" />
                                  <span className="font-medium">Attestation fiscale :</span>
                                  <span className={formValues.doc_tax ? "text-green-600" : "text-destructive"}>
                                    {formValues.doc_tax?.name || "Non fourni"}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <FileText className="h-4 w-4" />
                                  <span className="font-medium">Business Plan :</span>
                                  <span className={formValues.doc_business_plan ? "text-green-600" : "text-destructive"}>
                                    {formValues.doc_business_plan?.name || "Non fourni"}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <FileText className="h-4 w-4" />
                                  <span className="font-medium">Statuts :</span>
                                  <span className={formValues.doc_statutes ? "text-green-600" : "text-muted-foreground"}>
                                    {formValues.doc_statutes?.name || "Non fourni (optionnel)"}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <FileText className="h-4 w-4" />
                                  <span className="font-medium">CV fondateurs :</span>
                                  <span className={formValues.doc_cv ? "text-green-600" : "text-muted-foreground"}>
                                    {formValues.doc_cv?.name || "Non fourni (optionnel)"}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <FileText className="h-4 w-4" />
                                  <span className="font-medium">Pitch Deck :</span>
                                  <span className={formValues.doc_pitch ? "text-green-600" : "text-muted-foreground"}>
                                    {formValues.doc_pitch?.name || "Non fourni (optionnel)"}
                                  </span>
                                </div>
                              </div>
                            </TabsContent>
                          </Tabs>
                        </div>

                        <FormField
                          control={form.control}
                          name="terms_accepted"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel>
                                  J'atteste que les informations fournies sont exactes et j'accepte les{" "}
                                  <Link to="/criteres" className="text-primary hover:underline">
                                    critères d'éligibilité
                                  </Link>{" "}
                                  du Label Startup Numérique. *
                                </FormLabel>
                                <FormMessage />
                              </div>
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="mt-8 flex justify-between">
                        <Button type="button" variant="outline" onClick={prevStep}>
                          Étape précédente
                        </Button>

                        <Button type="submit" disabled={isLoading}>
                          {isLoading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              {isUploading ? "Téléversement..." : "Soumission..."}
                            </>
                          ) : (
                            "Soumettre ma candidature"
                          )}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </form>
            </Form>

            <div className="mt-8 p-4 bg-accent/10 border border-accent/20 rounded-lg">
              <h3 className="font-bold mb-2">Besoin d'aide ?</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Notre équipe est disponible pour vous accompagner dans votre démarche de labellisation.
              </p>
              <Link to="/contact" className="text-sm text-primary hover:underline">
                Contactez-nous →
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <ClipboardCheck className="h-6 w-6 text-primary" />
            </div>
            <DialogTitle className="text-center">Candidature soumise !</DialogTitle>
            <DialogDescription className="text-center">
              Votre dossier a été transmis avec succès au Comité de Labellisation.
            </DialogDescription>
          </DialogHeader>

          <div className="bg-muted p-4 rounded-lg text-center">
            <p className="text-sm text-muted-foreground mb-1">Numéro de suivi</p>
            <p className="text-lg font-bold font-mono">{trackingId}</p>
          </div>

          <p className="text-sm text-muted-foreground text-center">
            Conservez ce numéro pour suivre l'avancement de votre candidature. Vous recevrez un email de confirmation.
          </p>

          <DialogFooter className="flex-col gap-2 sm:flex-row">
            <Button variant="outline" asChild className="w-full">
              <Link to="/suivi-candidature">Suivre ma candidature</Link>
            </Button>
            <Button asChild className="w-full">
              <Link to="/startup/dashboard">Accéder à mon espace</Link>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default Postuler;
