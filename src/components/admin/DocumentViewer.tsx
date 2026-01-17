import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { 
  FileText, 
  Download, 
  ExternalLink, 
  File, 
  Loader2,
  CheckCircle,
  XCircle,
  Eye
} from "lucide-react";
import PDFPreviewModal from "./PDFPreviewModal";

interface DocumentViewerProps {
  documents: {
    doc_rccm: string | null;
    doc_tax: string | null;
    doc_statutes: string | null;
    doc_business_plan: string | null;
    doc_cv: string | null;
    doc_pitch: string | null;
    doc_other: string[] | null;
  };
  startupName: string;
}

interface DocumentItem {
  key: string;
  label: string;
  path: string | null;
  required: boolean;
}

interface PreviewModalState {
  isOpen: boolean;
  url: string | null;
  documentName: string;
  documentPath: string;
  documentKey: string;
}

const DocumentViewer = ({ documents, startupName }: DocumentViewerProps) => {
  const [loadingDoc, setLoadingDoc] = useState<string | null>(null);
  const [previewModal, setPreviewModal] = useState<PreviewModalState>({
    isOpen: false,
    url: null,
    documentName: "",
    documentPath: "",
    documentKey: "",
  });

  const requiredDocs: DocumentItem[] = [
    { key: "doc_rccm", label: "Registre du Commerce (RCCM)", path: documents.doc_rccm, required: true },
    { key: "doc_tax", label: "Attestation fiscale (NIF)", path: documents.doc_tax, required: true },
    { key: "doc_business_plan", label: "Business Plan", path: documents.doc_business_plan, required: true },
  ];

  const optionalDocs: DocumentItem[] = [
    { key: "doc_statutes", label: "Statuts de l'entreprise", path: documents.doc_statutes, required: false },
    { key: "doc_cv", label: "CV des fondateurs", path: documents.doc_cv, required: false },
    { key: "doc_pitch", label: "Pitch Deck", path: documents.doc_pitch, required: false },
  ];

  const getFileName = (path: string): string => {
    const parts = path.split("/");
    return parts[parts.length - 1] || "document";
  };

  const getFileExtension = (path: string): string => {
    const parts = path.split(".");
    return parts[parts.length - 1]?.toLowerCase() || "";
  };

  const isPDF = (path: string): boolean => {
    return getFileExtension(path) === "pdf";
  };

  const getFileIcon = (path: string) => {
    const ext = getFileExtension(path);
    switch (ext) {
      case "pdf":
        return <FileText className="h-5 w-5 text-red-500" />;
      case "doc":
      case "docx":
        return <FileText className="h-5 w-5 text-blue-500" />;
      case "ppt":
      case "pptx":
        return <FileText className="h-5 w-5 text-orange-500" />;
      case "xls":
      case "xlsx":
        return <FileText className="h-5 w-5 text-green-500" />;
      default:
        return <File className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const handlePreview = async (path: string, docKey: string, label: string) => {
    if (!supabase) {
      toast.error("Connexion au stockage non disponible");
      return;
    }

    const ext = getFileExtension(path);

    // Only PDF files can be previewed in the modal
    if (ext !== "pdf") {
      // For other formats, open in a new tab
      handleOpenInNewTab(path, docKey);
      return;
    }

    setLoadingDoc(docKey);
    try {
      const { data, error } = await supabase.storage
        .from("application-documents")
        .createSignedUrl(path, 3600);

      if (error) throw error;

      setPreviewModal({
        isOpen: true,
        url: data?.signedUrl || null,
        documentName: `${label} - ${getFileName(path)}`,
        documentPath: path,
        documentKey: docKey,
      });
    } catch (error: any) {
      console.error("Error getting signed URL:", error);
      toast.error("Erreur lors du chargement de l'aperçu");
    } finally {
      setLoadingDoc(null);
    }
  };

  const handleOpenInNewTab = async (path: string, docKey: string) => {
    if (!supabase) {
      toast.error("Connexion au stockage non disponible");
      return;
    }

    setLoadingDoc(docKey);
    try {
      const { data, error } = await supabase.storage
        .from("application-documents")
        .createSignedUrl(path, 3600);

      if (error) throw error;

      if (data?.signedUrl) {
        window.open(data.signedUrl, "_blank");
      }
    } catch (error: any) {
      console.error("Error getting signed URL:", error);
      toast.error("Erreur lors de l'ouverture du document");
    } finally {
      setLoadingDoc(null);
    }
  };

  const handleDownload = async (path: string, docKey: string) => {
    if (!supabase) {
      toast.error("Connexion au stockage non disponible");
      return;
    }

    setLoadingDoc(docKey);
    try {
      const { data, error } = await supabase.storage
        .from("application-documents")
        .download(path);

      if (error) throw error;

      if (data) {
        const fileName = getFileName(path);
        const url = URL.createObjectURL(data);
        const a = document.createElement("a");
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast.success(`Document "${fileName}" téléchargé`);
      }
    } catch (error: any) {
      console.error("Error downloading document:", error);
      toast.error("Erreur lors du téléchargement du document");
    } finally {
      setLoadingDoc(null);
    }
  };

  const handleModalDownload = () => {
    if (previewModal.documentPath) {
      handleDownload(previewModal.documentPath, previewModal.documentKey);
    }
  };

  const closePreviewModal = () => {
    setPreviewModal({
      isOpen: false,
      url: null,
      documentName: "",
      documentPath: "",
      documentKey: "",
    });
  };

  const renderDocumentCard = (doc: DocumentItem) => {
    const isLoading = loadingDoc === doc.key;
    const hasDocument = !!doc.path;

    return (
      <Card key={doc.key} className={`${hasDocument ? "bg-card" : "bg-muted/30"}`}>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            {hasDocument ? (
              getFileIcon(doc.path!)
            ) : (
              <File className="h-5 w-5 text-muted-foreground/50" />
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-sm truncate">{doc.label}</span>
                {hasDocument ? (
                  <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                ) : (
                  <XCircle className="h-4 w-4 text-muted-foreground/50 flex-shrink-0" />
                )}
              </div>
              {hasDocument ? (
                <p className="text-xs text-muted-foreground truncate mb-2">
                  {getFileName(doc.path!)}
                </p>
              ) : (
                <p className="text-xs text-muted-foreground/50 italic mb-2">
                  Non fourni
                </p>
              )}
              {hasDocument && (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePreview(doc.path!, doc.key, doc.label)}
                    disabled={isLoading}
                    className="h-7 text-xs"
                  >
                    {isLoading ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : isPDF(doc.path!) ? (
                      <>
                        <Eye className="h-3 w-3 mr-1" />
                        Aperçu
                      </>
                    ) : (
                      <>
                        <ExternalLink className="h-3 w-3 mr-1" />
                        Ouvrir
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownload(doc.path!, doc.key)}
                    disabled={isLoading}
                    className="h-7 text-xs"
                  >
                    {isLoading ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <>
                        <Download className="h-3 w-3 mr-1" />
                        Télécharger
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderOtherDocuments = () => {
    if (!documents.doc_other || documents.doc_other.length === 0) {
      return null;
    }

    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <h4 className="font-medium text-sm">Autres documents</h4>
          <Badge variant="secondary">{documents.doc_other.length}</Badge>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {documents.doc_other.map((path, index) => {
            const docKey = `doc_other_${index}`;
            const isLoading = loadingDoc === docKey;

            return (
              <Card key={docKey} className="bg-card">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    {getFileIcon(path)}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate mb-1">
                        Document {index + 1}
                      </p>
                      <p className="text-xs text-muted-foreground truncate mb-2">
                        {getFileName(path)}
                      </p>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePreview(path, docKey, `Document ${index + 1}`)}
                          disabled={isLoading}
                          className="h-7 text-xs"
                        >
                          {isLoading ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : isPDF(path) ? (
                            <>
                              <Eye className="h-3 w-3 mr-1" />
                              Aperçu
                            </>
                          ) : (
                            <>
                              <ExternalLink className="h-3 w-3 mr-1" />
                              Ouvrir
                            </>
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownload(path, docKey)}
                          disabled={isLoading}
                          className="h-7 text-xs"
                        >
                          {isLoading ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <>
                              <Download className="h-3 w-3 mr-1" />
                              Télécharger
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    );
  };

  const requiredCount = requiredDocs.filter(d => d.path).length;
  const optionalCount = optionalDocs.filter(d => d.path).length;
  const otherCount = documents.doc_other?.length || 0;
  const totalCount = requiredCount + optionalCount + otherCount;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Documents de la candidature</h3>
        <Badge variant="outline">
          {totalCount} document{totalCount > 1 ? "s" : ""} fourni{totalCount > 1 ? "s" : ""}
        </Badge>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <h4 className="font-medium text-sm">Documents obligatoires</h4>
          <Badge variant={requiredCount === 3 ? "default" : "destructive"}>
            {requiredCount}/3
          </Badge>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {requiredDocs.map(renderDocumentCard)}
        </div>
      </div>

      <Separator />

      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <h4 className="font-medium text-sm">Documents optionnels</h4>
          <Badge variant="secondary">{optionalCount}/3</Badge>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {optionalDocs.map(renderDocumentCard)}
        </div>
      </div>

      {documents.doc_other && documents.doc_other.length > 0 && (
        <>
          <Separator />
          {renderOtherDocuments()}
        </>
      )}

      <PDFPreviewModal
        isOpen={previewModal.isOpen}
        onClose={closePreviewModal}
        pdfUrl={previewModal.url}
        documentName={previewModal.documentName}
        onDownload={handleModalDownload}
        isDownloading={loadingDoc === previewModal.documentKey}
      />
    </div>
  );
};

export default DocumentViewer;
