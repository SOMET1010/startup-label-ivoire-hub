import { useState } from "react";
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
import { ClipboardCheck, Loader2 } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const startupFormSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères").max(100, "Le nom ne peut pas dépasser 100 caractères"),
  description: z.string().min(50, "La description doit contenir au moins 50 caractères").max(2000, "La description ne peut pas dépasser 2000 caractères"),
  sector: z.string().min(1, "Veuillez sélectionner un secteur"),
  website: z.string().url("URL invalide").or(z.literal("")).optional(),
  stage: z.string().min(1, "Veuillez sélectionner un stade"),
  team_size: z.coerce.number().min(1, "Minimum 1 employé").max(10000, "Maximum 10000 employés"),
  founded_date: z.string().optional(),
  terms_accepted: z.boolean().refine(val => val === true, "Vous devez accepter les conditions"),
});

type StartupFormData = z.infer<typeof startupFormSchema>;

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

const Postuler = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [trackingId, setTrackingId] = useState("");

  const form = useForm<StartupFormData>({
    resolver: zodResolver(startupFormSchema),
    defaultValues: {
      name: "",
      description: "",
      sector: "",
      website: "",
      stage: "",
      team_size: 1,
      founded_date: "",
      terms_accepted: false,
    },
  });

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

    if (!supabase) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Service non disponible. Veuillez réessayer plus tard.",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Create startup record
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
          status: "submitted",
        })
        .select()
        .single();

      if (startupError) throw startupError;

      // Create application record
      const { data: applicationData, error: applicationError } = await supabase
        .from("applications")
        .insert({
          user_id: user.id,
          startup_id: startupData.id,
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
    } catch (error: any) {
      console.error("Submission error:", error);
      toast({
        variant: "destructive",
        title: "Erreur de soumission",
        description: error.message || "Une erreur est survenue lors de la soumission.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = async () => {
    let fieldsToValidate: (keyof StartupFormData)[] = [];
    
    if (currentStep === 1) {
      fieldsToValidate = ["name", "sector", "website", "team_size", "founded_date"];
    } else if (currentStep === 2) {
      fieldsToValidate = ["description", "stage"];
    }

    const isValid = await form.trigger(fieldsToValidate);
    if (isValid) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
    window.scrollTo(0, 0);
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
      <Navbar />
      <main className="flex-grow py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-2">Demande de labellisation</h1>
              <p className="text-muted-foreground">
                Complétez ce formulaire pour soumettre votre candidature au Label Startup numérique
              </p>
            </div>

            {/* Progress bar */}
            <div className="mb-8">
              <div className="w-full bg-muted rounded-full h-2.5">
                <div
                  className="bg-gradient-to-r from-primary to-accent h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${(currentStep / 3) * 100}%` }}
                ></div>
              </div>
              <div className="flex justify-between mt-2 text-sm">
                <span className={currentStep >= 1 ? "text-primary font-medium" : "text-muted-foreground"}>
                  Informations générales
                </span>
                <span className={currentStep >= 2 ? "text-primary font-medium" : "text-muted-foreground"}>
                  Description & Stade
                </span>
                <span className={currentStep >= 3 ? "text-primary font-medium" : "text-muted-foreground"}>
                  Validation
                </span>
              </div>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)}>
                <div className="bg-card rounded-xl shadow-sm p-8">
                  {currentStep === 1 && (
                    <div>
                      <h2 className="text-xl font-bold mb-6">Informations générales de la startup</h2>

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
                            name="sector"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Secteur d'activité *</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
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

                          <FormField
                            control={form.control}
                            name="founded_date"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Date de création</FormLabel>
                                <FormControl>
                                  <Input type="date" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="website"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Site web</FormLabel>
                                <FormControl>
                                  <Input type="url" placeholder="https://example.com" {...field} />
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
                        </div>
                      </div>

                      <div className="mt-8 flex justify-end">
                        <Button type="button" onClick={nextStep}>
                          Étape suivante
                        </Button>
                      </div>
                    </div>
                  )}

                  {currentStep === 2 && (
                    <div>
                      <h2 className="text-xl font-bold mb-6">Description & Stade de développement</h2>

                      <div className="space-y-6">
                        <FormField
                          control={form.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Description du projet *</FormLabel>
                              <FormControl>
                                <Textarea
                                  rows={6}
                                  placeholder="Décrivez votre projet, votre proposition de valeur, votre marché cible et ce qui vous différencie de la concurrence..."
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                              <p className="text-xs text-muted-foreground">
                                {field.value.length}/2000 caractères (minimum 50)
                              </p>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="stage"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Stade de développement *</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
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

                  {currentStep === 3 && (
                    <div>
                      <h2 className="text-xl font-bold mb-6">Révision et soumission</h2>

                      <div className="space-y-6">
                        <div className="bg-muted/50 p-4 rounded-lg">
                          <h3 className="font-bold mb-2">Récapitulatif de votre candidature</h3>
                          <p className="text-muted-foreground mb-4">
                            Veuillez vérifier attentivement les informations renseignées avant de soumettre votre candidature.
                          </p>

                          <Tabs defaultValue="general">
                            <TabsList className="mb-4">
                              <TabsTrigger value="general">Informations générales</TabsTrigger>
                              <TabsTrigger value="description">Description</TabsTrigger>
                            </TabsList>

                            <TabsContent value="general">
                              <div className="text-sm space-y-2">
                                <div className="grid grid-cols-2 gap-2">
                                  <div className="font-medium">Nom de la startup :</div>
                                  <div>{formValues.name || "-"}</div>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                  <div className="font-medium">Secteur d'activité :</div>
                                  <div>{SECTORS.find(s => s.value === formValues.sector)?.label || "-"}</div>
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
                                  <div className="font-medium">Nombre d'employés :</div>
                                  <div>{formValues.team_size}</div>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                  <div className="font-medium">Stade de développement :</div>
                                  <div>{STAGES.find(s => s.value === formValues.stage)?.label || "-"}</div>
                                </div>
                              </div>
                            </TabsContent>

                            <TabsContent value="description">
                              <div className="text-sm">
                                <div className="font-medium mb-2">Description du projet :</div>
                                <div className="text-muted-foreground whitespace-pre-wrap">
                                  {formValues.description || "-"}
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
                              Soumission en cours...
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
