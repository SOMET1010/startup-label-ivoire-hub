import { AlertTriangle, X } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { FieldErrors, FieldValues } from "react-hook-form";

interface FormErrorSummaryProps<T extends FieldValues> {
  errors: FieldErrors<T>;
  fieldLabels?: Record<string, string>;
  onDismiss?: () => void;
}

// Mapping des noms de champs vers des libellés lisibles
const DEFAULT_FIELD_LABELS: Record<string, string> = {
  name: "Nom de la startup",
  legal_status: "Statut juridique",
  rccm: "Numéro RCCM",
  tax_id: "NIF",
  sector: "Secteur d'activité",
  address: "Adresse",
  founded_date: "Date de création",
  website: "Site web",
  team_size: "Taille de l'équipe",
  description: "Description",
  innovation: "Innovation",
  business_model: "Modèle économique",
  growth_potential: "Potentiel de croissance",
  stage: "Stade de développement",
  founder_info: "Informations fondateurs",
  doc_rccm: "Extrait RCCM",
  doc_tax: "Attestation fiscale",
  doc_business_plan: "Business Plan",
  doc_statutes: "Statuts",
  doc_cv: "CV fondateurs",
  doc_pitch: "Pitch Deck",
  terms_accepted: "Conditions d'utilisation",
};

export function FormErrorSummary<T extends FieldValues>({
  errors,
  fieldLabels = DEFAULT_FIELD_LABELS,
  onDismiss,
}: FormErrorSummaryProps<T>) {
  const errorEntries = Object.entries(errors);
  
  if (errorEntries.length === 0) return null;

  return (
    <Alert variant="destructive" className="mb-6 animate-in fade-in slide-in-from-top-2">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle className="flex items-center justify-between">
        <span>
          {errorEntries.length} erreur{errorEntries.length > 1 ? "s" : ""} à corriger
        </span>
        {onDismiss && (
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 -mr-2"
            onClick={onDismiss}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </AlertTitle>
      <AlertDescription>
        <ul className="mt-2 space-y-1 text-sm">
          {errorEntries.slice(0, 5).map(([field, error]) => (
            <li key={field} className="flex items-start gap-2">
              <span className="font-medium">
                {fieldLabels[field] || field} :
              </span>
              <span>{(error as { message?: string })?.message || "Champ invalide"}</span>
            </li>
          ))}
          {errorEntries.length > 5 && (
            <li className="text-muted-foreground italic">
              ... et {errorEntries.length - 5} autre{errorEntries.length - 5 > 1 ? "s" : ""} erreur{errorEntries.length - 5 > 1 ? "s" : ""}
            </li>
          )}
        </ul>
      </AlertDescription>
    </Alert>
  );
}
