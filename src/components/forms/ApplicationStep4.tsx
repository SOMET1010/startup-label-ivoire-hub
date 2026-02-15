import { Link } from "react-router-dom";
import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ClipboardCheck, Loader2, FileText } from "lucide-react";
import { LEGAL_STATUS, SECTORS, STAGES, type StartupFormData } from "./applicationFormSchema";

interface ApplicationStep4Props {
  form: UseFormReturn<StartupFormData>;
  formValues: StartupFormData;
  onPrev: () => void;
  isLoading: boolean;
  isUploading: boolean;
}

export default function ApplicationStep4({ form, formValues, onPrev, isLoading, isUploading }: ApplicationStep4Props) {
  return (
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
                {[
                  ["Nom", formValues.name],
                  ["Statut juridique", LEGAL_STATUS.find(s => s.value === formValues.legal_status)?.label],
                  ["RCCM", formValues.rccm],
                  ["NIF", formValues.tax_id],
                  ["Secteur", SECTORS.find(s => s.value === formValues.sector)?.label],
                  ["Adresse", formValues.address],
                  ["Date de création", formValues.founded_date],
                  ["Site web", formValues.website],
                  ["Employés", formValues.team_size],
                ].map(([label, value]) => (
                  <div key={String(label)} className="grid grid-cols-2 gap-2">
                    <div className="font-medium">{label} :</div>
                    <div>{value || "-"}</div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="projet">
              <div className="text-sm space-y-3">
                {[
                  ["Description", formValues.description],
                  ["Innovation", formValues.innovation],
                  ["Modèle économique", formValues.business_model],
                  ["Potentiel de croissance", formValues.growth_potential],
                ].map(([label, value]) => (
                  <div key={String(label)}>
                    <div className="font-medium mb-1">{label} :</div>
                    <div className="text-muted-foreground whitespace-pre-wrap text-xs">{value || "-"}</div>
                  </div>
                ))}
                <div className="grid grid-cols-2 gap-2">
                  <div className="font-medium">Stade :</div>
                  <div>{STAGES.find(s => s.value === formValues.stage)?.label || "-"}</div>
                </div>
                <div>
                  <div className="font-medium mb-1">Fondateurs :</div>
                  <div className="text-muted-foreground whitespace-pre-wrap text-xs">{formValues.founder_info || "-"}</div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="documents">
              <div className="text-sm space-y-2">
                {[
                  { label: "RCCM", file: formValues.doc_rccm, required: true },
                  { label: "Attestation fiscale", file: formValues.doc_tax, required: true },
                  { label: "Business Plan", file: formValues.doc_business_plan, required: true },
                  { label: "Statuts", file: formValues.doc_statutes, required: false },
                  { label: "CV fondateurs", file: formValues.doc_cv, required: false },
                  { label: "Pitch Deck", file: formValues.doc_pitch, required: false },
                ].map((doc) => (
                  <div key={doc.label} className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    <span className="font-medium">{doc.label} :</span>
                    <span className={doc.file ? "text-green-600" : doc.required ? "text-destructive" : "text-muted-foreground"}>
                      {doc.file?.name || (doc.required ? "Non fourni" : "Non fourni (optionnel)")}
                    </span>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <FormField control={form.control} name="terms_accepted" render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
            <FormControl>
              <Checkbox checked={field.value} onCheckedChange={field.onChange} />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>
                J'atteste que les informations fournies sont exactes et j'accepte les{" "}
                <Link to="/criteres" className="text-primary hover:underline">critères d'éligibilité</Link>{" "}
                du Label Startup Numérique. *
              </FormLabel>
              <FormMessage />
            </div>
          </FormItem>
        )} />
      </div>

      <div className="mt-8 flex justify-between">
        <Button type="button" variant="outline" onClick={onPrev}>Étape précédente</Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" />{isUploading ? "Téléversement..." : "Soumission..."}</>
          ) : (
            "Soumettre ma candidature"
          )}
        </Button>
      </div>
    </div>
  );
}
