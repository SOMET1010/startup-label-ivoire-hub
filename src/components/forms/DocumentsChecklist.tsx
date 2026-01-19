import { FileText, CheckCircle2, Circle, AlertCircle } from "lucide-react";

interface DocumentsChecklistProps {
  className?: string;
}

const REQUIRED_DOCUMENTS = [
  { key: "doc_rccm", label: "Extrait RCCM", required: true },
  { key: "doc_tax", label: "Attestation fiscale en cours de validité", required: true },
  { key: "doc_business_plan", label: "Business Plan détaillé", required: true },
];

const OPTIONAL_DOCUMENTS = [
  { key: "doc_statutes", label: "Statuts de l'entreprise" },
  { key: "doc_cv", label: "CV des fondateurs" },
  { key: "doc_pitch", label: "Pitch Deck" },
];

export function DocumentsChecklist({ className }: DocumentsChecklistProps) {
  return (
    <div className={`bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-4 ${className}`}>
      <div className="flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <h4 className="font-semibold text-amber-800 dark:text-amber-200 mb-2">
            Documents à préparer
          </h4>
          <p className="text-sm text-amber-700 dark:text-amber-300 mb-3">
            Pour finaliser votre candidature, vous aurez besoin de :
          </p>
          
          {/* Documents obligatoires */}
          <ul className="text-sm space-y-1.5 mb-3">
            {REQUIRED_DOCUMENTS.map((doc) => (
              <li key={doc.key} className="flex items-center gap-2 text-amber-700 dark:text-amber-300">
                <CheckCircle2 className="h-4 w-4 text-amber-600 flex-shrink-0" />
                <span><strong>{doc.label}</strong> (obligatoire)</span>
              </li>
            ))}
          </ul>
          
          {/* Documents optionnels */}
          <ul className="text-sm space-y-1.5">
            {OPTIONAL_DOCUMENTS.map((doc) => (
              <li key={doc.key} className="flex items-center gap-2 text-muted-foreground">
                <Circle className="h-4 w-4 flex-shrink-0" />
                <span>{doc.label} (optionnel)</span>
              </li>
            ))}
          </ul>
          
          <p className="text-xs text-amber-600 dark:text-amber-400 mt-3 pt-3 border-t border-amber-200 dark:border-amber-700">
            📎 Formats acceptés : PDF, DOC, DOCX, PPT, PPTX • Taille max : 10 Mo par fichier
          </p>
        </div>
      </div>
    </div>
  );
}
