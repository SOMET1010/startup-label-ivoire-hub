import { useState, useEffect, useCallback, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { 
  Download, 
  X, 
  ExternalLink, 
  FileText,
  Loader2,
  AlertCircle,
  ImageIcon,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Maximize2,
  Minimize2
} from "lucide-react";

// Zoom constants
const ZOOM_MIN = 25;
const ZOOM_MAX = 300;
const ZOOM_STEP = 25;

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
  const [zoomLevel, setZoomLevel] = useState(100);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      setHasError(false);
      setZoomLevel(100);
    }
  }, [isOpen, documentUrl]);

  // Handle fullscreen state changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = useCallback(async () => {
    if (!document.fullscreenElement) {
      await contentRef.current?.requestFullscreen();
    } else {
      await document.exitFullscreen();
    }
  }, []);

  const handleClose = useCallback(() => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
    onClose();
  }, [onClose]);

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  const handleZoomIn = useCallback(() => {
    setZoomLevel((prev) => Math.min(prev + ZOOM_STEP, ZOOM_MAX));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoomLevel((prev) => Math.max(prev - ZOOM_STEP, ZOOM_MIN));
  }, []);

  const handleResetZoom = useCallback(() => {
    setZoomLevel(100);
  }, []);

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
        handleClose();
      } else if (e.key === "d" || e.key === "D") {
        if (!isDownloading) {
          onDownload();
        }
      } else if (e.key === "F11") {
        e.preventDefault();
        toggleFullscreen();
      }
      
      // Zoom shortcuts for images only
      if (documentType === "image") {
        if (e.key === "+" || e.key === "=") {
          e.preventDefault();
          handleZoomIn();
        } else if (e.key === "-") {
          e.preventDefault();
          handleZoomOut();
        } else if (e.key === "0") {
          e.preventDefault();
          handleResetZoom();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleClose, onDownload, isDownloading, documentType, handleZoomIn, handleZoomOut, handleResetZoom, toggleFullscreen]);

  // Handle mouse wheel zoom for images
  useEffect(() => {
    if (!isOpen || documentType !== "image") return;

    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        if (e.deltaY < 0) {
          handleZoomIn();
        } else {
          handleZoomOut();
        }
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [isOpen, documentType, handleZoomIn, handleZoomOut]);

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
        <div className="relative flex items-center justify-center h-full overflow-auto bg-muted/30">
          <div className="flex items-center justify-center min-h-full p-4">
            <img
              src={documentUrl}
              alt={documentName}
              className="object-contain rounded-lg shadow-lg transition-transform duration-200"
              style={{ 
                transform: `scale(${zoomLevel / 100})`,
                transformOrigin: 'center center'
              }}
              onLoad={handleLoad}
              onError={handleError}
            />
          </div>
          
          {/* Zoom controls */}
          {!isLoading && !hasError && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20">
              <div className="flex items-center gap-2 bg-background/90 backdrop-blur-sm border rounded-lg shadow-lg px-3 py-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleZoomOut}
                  disabled={zoomLevel <= ZOOM_MIN}
                  title="Zoom arrière (-)"
                >
                  <ZoomOut className="h-4 w-4" />
                </Button>
                
                <span className="text-sm font-medium w-12 text-center tabular-nums">
                  {zoomLevel}%
                </span>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleZoomIn}
                  disabled={zoomLevel >= ZOOM_MAX}
                  title="Zoom avant (+)"
                >
                  <ZoomIn className="h-4 w-4" />
                </Button>
                
                <Separator orientation="vertical" className="h-5" />
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleResetZoom}
                  disabled={zoomLevel === 100}
                  title="Réinitialiser le zoom (0)"
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      );
    }

    return null;
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent 
        ref={contentRef}
        className={cn(
          "p-0 gap-0",
          isFullscreen 
            ? "w-screen h-screen max-w-none max-h-none rounded-none" 
            : "max-w-[95vw] w-[95vw] h-[90vh] max-h-[90vh]"
        )}
      >
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
              onClick={toggleFullscreen}
              title={isFullscreen ? "Quitter le plein écran (F11)" : "Plein écran (F11)"}
            >
              {isFullscreen ? (
                <Minimize2 className="h-4 w-4 sm:mr-2" />
              ) : (
                <Maximize2 className="h-4 w-4 sm:mr-2" />
              )}
              <span className="hidden sm:inline">
                {isFullscreen ? "Réduire" : "Plein écran"}
              </span>
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
            <Button variant="ghost" size="sm" onClick={handleClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div 
          className="flex-1 relative bg-muted/30 overflow-hidden" 
          style={{ height: isFullscreen ? "calc(100vh - 60px)" : "calc(90vh - 60px)" }}
        >
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
