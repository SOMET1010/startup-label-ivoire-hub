import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { 
  Download, 
  X, 
  ExternalLink, 
  FileText,
  Loader2,
  AlertCircle,
  ImageIcon
} from "lucide-react";

export type DocumentType = "pdf" | "image" | "other";

interface DocumentPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentUrl: string | null;
  documentName: string;
  documentType: DocumentType;
  onDownload: () => void;
  isDownloading?: boolean;
}

const DocumentPreviewModal = ({
  isOpen,
  onClose,
  documentUrl,
  documentName,
  documentType,
  onDownload,
  isDownloading = false,
}: DocumentPreviewModalProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      setHasError(false);
    }
  }, [isOpen, documentUrl]);

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  const handleOpenInNewTab = () => {
    if (documentUrl) {
      window.open(documentUrl, "_blank");
    }
  };

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "d" || e.key === "D") {
        if (!isDownloading) {
          onDownload();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, onDownload, isDownloading]);

  const getHeaderIcon = () => {
    switch (documentType) {
      case "pdf":
        return <FileText className="h-5 w-5 text-red-500 flex-shrink-0" />;
      case "image":
        return <ImageIcon className="h-5 w-5 text-blue-500 flex-shrink-0" />;
      default:
        return <FileText className="h-5 w-5 text-muted-foreground flex-shrink-0" />;
    }
  };

  const renderContent = () => {
    if (hasError) {
      return (
        <div className="absolute inset-0 flex items-center justify-center bg-background z-10">
          <div className="flex flex-col items-center gap-4 text-center p-6">
            <AlertCircle className="h-12 w-12 text-destructive" />
            <div>
              <p className="font-medium mb-1">Impossible de charger l'aperçu</p>
              <p className="text-sm text-muted-foreground mb-4">
                Le document ne peut pas être affiché dans le navigateur.
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={handleOpenInNewTab}>
                <ExternalLink className="h-4 w-4 mr-2" />
                Ouvrir dans un nouvel onglet
              </Button>
              <Button onClick={onDownload} disabled={isDownloading}>
                {isDownloading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Download className="h-4 w-4 mr-2" />
                )}
                Télécharger
              </Button>
            </div>
          </div>
        </div>
      );
    }

    if (documentType === "pdf" && documentUrl) {
      return (
        <iframe
          src={documentUrl}
          className="w-full h-full border-0"
          title={documentName}
          onLoad={handleLoad}
          onError={handleError}
        />
      );
    }

    if (documentType === "image" && documentUrl) {
      return (
        <div className="flex items-center justify-center h-full p-4 overflow-auto bg-muted/30">
          <img
            src={documentUrl}
            alt={documentName}
            className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
            onLoad={handleLoad}
            onError={handleError}
          />
        </div>
      );
    }

    return null;
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-[95vw] w-[95vw] h-[90vh] max-h-[90vh] p-0 gap-0">
        <DialogHeader className="px-4 py-3 border-b flex-row items-center justify-between space-y-0">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            {getHeaderIcon()}
            <DialogTitle className="text-base font-medium truncate">
              {documentName}
            </DialogTitle>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={handleOpenInNewTab}
              className="hidden sm:flex"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Nouvel onglet
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onDownload}
              disabled={isDownloading}
            >
              {isDownloading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Download className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Télécharger</span>
                </>
              )}
            </Button>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="flex-1 relative bg-muted/30 overflow-hidden" style={{ height: "calc(90vh - 60px)" }}>
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">Chargement du document...</p>
              </div>
            </div>
          )}

          {renderContent()}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentPreviewModal;
