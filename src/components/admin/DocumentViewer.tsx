import { useState } from "react";
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
  Eye,
  ImageIcon
} from "lucide-react";
import DocumentPreviewModal, { type DocumentType } from "./DocumentPreviewModal";
import { 
  useSecureDocument, 
  isPreviewable, 
  isPDF, 
  isImage, 
  getFileExtension,
  getDocumentType,
  EXPIRATION_TIMES 
} from "@/hooks/useSecureDocument";

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
  documentType: DocumentType;
}

const DocumentViewer = ({ documents, startupName }: DocumentViewerProps) => {
  const [loadingDoc, setLoadingDoc] = useState<string | null>(null);
  const [previewModal, setPreviewModal] = useState<PreviewModalState>({
    isOpen: false,
    url: null,
    documentName: "",
    documentPath: "",
    documentKey: "",
    documentType: "other",
  });

  // Utiliser le hook centralisé pour les URLs signées sécurisées
  const { getSignedUrl, downloadDocument, isLoading } = useSecureDocument();

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

  const getFileIcon = (path: string) => {
    const ext = getFileExtension(path);
    switch (ext) {
      case "pdf":
        return <FileText className="h-5 w-5 text-red-500" />;
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
      case "webp":
      case "svg":
        return <ImageIcon className="h-5 w-5 text-blue-500" />;
      case "doc":
      case "docx":
        return <FileText className="h-5 w-5 text-blue-600" />;
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
    const docType = getDocumentType(path);

    // Only PDF and images can be previewed in the modal
    if (docType === "other") {
      // For other formats, open in a new tab
      handleOpenInNewTab(path, docKey);
      return;
    }

    setLoadingDoc(docKey);
    try {
      // Utiliser le hook avec expiration courte (5 min au lieu de 1h)
      const signedUrl = await getSignedUrl(path, 'preview');

      if (!signedUrl) {
        throw new Error("Impossible de générer l'URL");
      }

      setPreviewModal({
        isOpen: true,
        url: signedUrl,
        documentName: `${label} - ${getFileName(path)}`,
        documentPath: path,
        documentKey: docKey,
        documentType: docType,
      });
    } catch (error: any) {
      console.error("Error getting signed URL:", error);
      toast.error("Erreur lors du chargement de l'aperçu");
    } finally {
      setLoadingDoc(null);
    }
  };

  const handleOpenInNewTab = async (path: string, docKey: string) => {
    setLoadingDoc(docKey);
    try {
      // Utiliser expiration courte pour ouverture dans nouvel onglet
      const signedUrl = await getSignedUrl(path, 'preview');

      if (signedUrl) {
        window.open(signedUrl, "_blank");
      }
    } catch (error: any) {
      console.error("Error getting signed URL:", error);
      toast.error("Erreur lors de l'ouverture du document");
    } finally {
      setLoadingDoc(null);
    }
  };

  const handleDownload = async (path: string, docKey: string) => {
    setLoadingDoc(docKey);
    try {
      await downloadDocument(path, getFileName(path));
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
      documentType: "other",
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
                    ) : isPreviewable(doc.path!) ? (
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
                          ) : isPreviewable(path) ? (
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

      <DocumentPreviewModal
        isOpen={previewModal.isOpen}
        onClose={closePreviewModal}
        documentUrl={previewModal.url}
        documentName={previewModal.documentName}
        documentType={previewModal.documentType}
        onDownload={handleModalDownload}
        isDownloading={loadingDoc === previewModal.documentKey}
      />
    </div>
  );
};

export default DocumentViewer;
