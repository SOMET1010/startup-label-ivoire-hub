import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  FileText,
  CheckCircle,
  AlertCircle,
  Upload,
  ExternalLink,
} from "lucide-react";

interface Document {
  key: string;
  label: string;
  required: boolean;
  uploaded: boolean;
  missing?: boolean; // Marqué comme manquant par l'admin
}

interface DocumentsStatusWidgetProps {
  documents: Document[];
  applicationStatus?: string;
  className?: string;
}

export function DocumentsStatusWidget({
  documents,
  applicationStatus,
  className,
}: DocumentsStatusWidgetProps) {
  const uploadedCount = documents.filter((d) => d.uploaded).length;
  const requiredCount = documents.filter((d) => d.required).length;
  const missingCount = documents.filter((d) => d.missing).length;
  
  const progress = requiredCount > 0 
    ? Math.round((documents.filter((d) => d.required && d.uploaded).length / requiredCount) * 100)
    : 0;

  const hasMissingDocuments = missingCount > 0;
  const allRequiredUploaded = documents.filter((d) => d.required).every((d) => d.uploaded);

  return (
    <Card className={cn("h-full", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <div className={cn(
            "p-1.5 rounded-lg",
            hasMissingDocuments ? "bg-warning/10" : "bg-primary/10"
          )}>
            <FileText className={cn(
              "h-4 w-4",
              hasMissingDocuments ? "text-warning" : "text-primary"
            )} />
          </div>
          Documents
          {hasMissingDocuments && (
            <span className="ml-auto text-xs font-medium text-warning bg-warning/10 px-2 py-0.5 rounded-full">
              {missingCount} manquant{missingCount > 1 ? "s" : ""}
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Barre de progression */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-muted-foreground">
              {uploadedCount}/{documents.length} documents
            </span>
            <span className={cn(
              "font-medium",
              allRequiredUploaded ? "text-success" : "text-muted-foreground"
            )}>
              {progress}% requis
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className={cn(
                "h-2 rounded-full transition-all duration-500",
                hasMissingDocuments 
                  ? "bg-warning" 
                  : allRequiredUploaded 
                    ? "bg-success" 
                    : "bg-primary"
              )}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Liste des documents */}
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {documents.map((doc) => (
            <div
              key={doc.key}
              className={cn(
                "flex items-center justify-between p-2 rounded-lg text-sm",
                doc.missing 
                  ? "bg-warning/10 border border-warning/20" 
                  : doc.uploaded 
                    ? "bg-success/5" 
                    : "bg-muted/50"
              )}
            >
              <div className="flex items-center gap-2">
                {doc.missing ? (
                  <AlertCircle className="h-4 w-4 text-warning" />
                ) : doc.uploaded ? (
                  <CheckCircle className="h-4 w-4 text-success" />
                ) : (
                  <div className="h-4 w-4 rounded-full border-2 border-muted-foreground/30" />
                )}
                <span className={cn(
                  doc.uploaded && !doc.missing ? "text-foreground" : "text-muted-foreground"
                )}>
                  {doc.label}
                </span>
                {doc.required && (
                  <span className="text-xs text-destructive">*</span>
                )}
              </div>
              {doc.missing && (
                <span className="text-xs text-warning font-medium">
                  À fournir
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Actions */}
        {hasMissingDocuments && applicationStatus === "incomplete" && (
          <div className="mt-4 pt-3 border-t border-border">
            <Button asChild variant="outline" size="sm" className="w-full gap-2">
              <Link to="/startup/candidature">
                <Upload className="h-4 w-4" />
                Compléter les documents
                <ExternalLink className="h-3 w-3 ml-auto" />
              </Link>
            </Button>
          </div>
        )}

        {!hasMissingDocuments && !allRequiredUploaded && (
          <div className="mt-4 pt-3 border-t border-border">
            <p className="text-xs text-muted-foreground text-center">
              Uploadez les documents requis (*) pour soumettre votre dossier
            </p>
          </div>
        )}

        {allRequiredUploaded && !hasMissingDocuments && (
          <div className="mt-4 pt-3 border-t border-border">
            <div className="flex items-center gap-2 text-success text-sm">
              <CheckCircle className="h-4 w-4" />
              <span>Tous les documents requis sont fournis</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default DocumentsStatusWidget;
