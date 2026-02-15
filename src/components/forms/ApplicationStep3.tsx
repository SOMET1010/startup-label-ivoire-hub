import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { FormField, FormItem } from "@/components/ui/form";
import { Upload } from "lucide-react";
import FileUploadField from "@/components/forms/FileUploadField";
import { type StartupFormData } from "./applicationFormSchema";

interface ApplicationStep3Props {
  form: UseFormReturn<StartupFormData>;
  onNext: () => void;
  onPrev: () => void;
}

const REQUIRED_DOCS = [
  { name: "doc_rccm" as const, label: "Extrait RCCM", description: "Registre du Commerce et du Crédit Mobilier" },
  { name: "doc_tax" as const, label: "Attestation fiscale", description: "Attestation de situation fiscale en cours de validité" },
  { name: "doc_business_plan" as const, label: "Business Plan", description: "Plan d'affaires détaillé avec projections financières" },
];

const OPTIONAL_DOCS = [
  { name: "doc_statutes" as const, label: "Statuts de l'entreprise", description: "Copie des statuts enregistrés" },
  { name: "doc_cv" as const, label: "CV des fondateurs", description: "Curriculum vitae des principaux dirigeants" },
  { name: "doc_pitch" as const, label: "Pitch Deck", description: "Présentation de votre projet (PowerPoint ou PDF)" },
];

export default function ApplicationStep3({ form, onNext, onPrev }: ApplicationStep3Props) {
  return (
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
            {REQUIRED_DOCS.map((doc) => (
              <FormField key={doc.name} control={form.control} name={doc.name} render={({ field }) => (
                <FormItem>
                  <FileUploadField
                    name={doc.name}
                    label={doc.label}
                    description={doc.description}
                    required
                    value={field.value}
                    onChange={field.onChange}
                    error={form.formState.errors[doc.name]?.message}
                  />
                </FormItem>
              )} />
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-4 text-muted-foreground">Documents optionnels</h3>
          <div className="grid gap-6">
            {OPTIONAL_DOCS.map((doc) => (
              <FormField key={doc.name} control={form.control} name={doc.name} render={({ field }) => (
                <FormItem>
                  <FileUploadField
                    name={doc.name}
                    label={doc.label}
                    description={doc.description}
                    value={field.value}
                    onChange={field.onChange}
                    error={form.formState.errors[doc.name]?.message}
                  />
                </FormItem>
              )} />
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-between">
        <Button type="button" variant="outline" onClick={onPrev}>Étape précédente</Button>
        <Button type="button" onClick={onNext}>Étape suivante</Button>
      </div>
    </div>
  );
}
