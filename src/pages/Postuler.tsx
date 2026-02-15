import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Form } from "@/components/ui/form";
import { SEOHead } from "@/components/shared/SEOHead";
import { PageBreadcrumb } from "@/components/shared/PageBreadcrumb";
import { FormErrorSummary } from "@/components/forms/FormErrorSummary";
import DraftStatusIndicator from "@/components/forms/DraftStatusIndicator";
import DraftResumeBanner from "@/components/forms/DraftResumeBanner";
import { STEPS } from "@/components/forms/applicationFormSchema";
import { useApplicationForm } from "@/hooks/useApplicationForm";
import ApplicationStep1 from "@/components/forms/ApplicationStep1";
import ApplicationStep2 from "@/components/forms/ApplicationStep2";
import ApplicationStep3 from "@/components/forms/ApplicationStep3";
import ApplicationStep4 from "@/components/forms/ApplicationStep4";
import ConfirmationDialog from "@/components/forms/ConfirmationDialog";

const Postuler = () => {
  const {
    form, currentStep, isLoading, isUploading,
    showConfirmation, setShowConfirmation, trackingId,
    showDraftBanner, draftLoaded, isDraftLoading, isSaving,
    hasChanges, hasDraft, draft, authLoading, user,
    handleResumeDraft, handleDeleteDraft, handleManualSave,
    handleSubmit, nextStep, prevStep,
  } = useApplicationForm();

  // Loading state
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

  // Auth guard
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
              <Button asChild><Link to="/auth">Se connecter</Link></Button>
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
        description="Soumettez votre candidature pour obtenir le Label Startup Numérique en Côte d'Ivoire."
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

            {showDraftBanner && draft && (
              <DraftResumeBanner
                startupName={draft.formData?.name || "Candidature"}
                lastModified={draft.lastSaved}
                onResume={handleResumeDraft}
                onDelete={handleDeleteDraft}
              />
            )}

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

            {Object.keys(form.formState.errors).length > 0 && form.formState.isSubmitted && (
              <FormErrorSummary errors={form.formState.errors} />
            )}

            {/* Progress bar */}
            <div className="mb-8">
              <div className="w-full bg-muted rounded-full h-2.5">
                <div
                  className="bg-gradient-to-r from-primary to-accent h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${(currentStep / 4) * 100}%` }}
                />
              </div>
              <div className="flex justify-between mt-3">
                {STEPS.map((step) => {
                  const Icon = step.icon;
                  return (
                    <div key={step.id} className={`flex flex-col items-center gap-1 ${currentStep >= step.id ? "text-primary" : "text-muted-foreground"}`}>
                      <Icon className="h-5 w-5" />
                      <span className="text-xs font-medium">{step.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)}>
                <div className="bg-card rounded-xl shadow-sm p-8">
                  {currentStep === 1 && <ApplicationStep1 form={form} onNext={nextStep} onSave={handleManualSave} isSaving={isSaving} />}
                  {currentStep === 2 && <ApplicationStep2 form={form} onNext={nextStep} onPrev={prevStep} onSave={handleManualSave} isSaving={isSaving} />}
                  {currentStep === 3 && <ApplicationStep3 form={form} onNext={nextStep} onPrev={prevStep} />}
                  {currentStep === 4 && <ApplicationStep4 form={form} formValues={formValues} onPrev={prevStep} isLoading={isLoading} isUploading={isUploading} />}
                </div>
              </form>
            </Form>

            <div className="mt-8 p-4 bg-accent/10 border border-accent/20 rounded-lg">
              <h3 className="font-bold mb-2">Besoin d'aide ?</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Notre équipe est disponible pour vous accompagner dans votre démarche de labellisation.
              </p>
              <Link to="/contact" className="text-sm text-primary hover:underline">Contactez-nous →</Link>
            </div>
          </div>
        </div>
      </main>

      <ConfirmationDialog open={showConfirmation} onOpenChange={setShowConfirmation} trackingId={trackingId} />
      <Footer />
    </div>
  );
};

export default Postuler;
