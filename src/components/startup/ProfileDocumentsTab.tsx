import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Eye, ExternalLink, Download, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { isPreviewable } from '@/hooks/useSecureDocument';
import { DOCUMENT_LABELS } from '@/hooks/useStartupProfile';

interface ProfileDocumentsTabProps {
  documents: { key: string; value: string | null }[];
  loadingDoc: string | null;
  onPreview: (path: string, docKey: string) => void;
  onDownload: (path: string, docKey: string) => void;
}

export default function ProfileDocumentsTab({ documents, loadingDoc, onPreview, onDownload }: ProfileDocumentsTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Documents</CardTitle>
        <CardDescription>
          Documents téléversés lors de votre candidature. Les liens sécurisés expirent après 5 minutes.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {documents.map(({ key, value }) => (
            <div 
              key={key}
              className="flex items-center justify-between p-3 border rounded-lg"
            >
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-muted-foreground" />
                <span className="font-medium">
                  {DOCUMENT_LABELS[key] || key}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {value ? (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onPreview(value, key)}
                      disabled={loadingDoc === key}
                      className="h-8"
                    >
                      {loadingDoc === key ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : isPreviewable(value) ? (
                        <>
                          <Eye className="h-4 w-4 mr-1" />
                          Voir
                        </>
                      ) : (
                        <>
                          <ExternalLink className="h-4 w-4 mr-1" />
                          Ouvrir
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onDownload(value, key)}
                      disabled={loadingDoc === key}
                      className="h-8"
                    >
                      {loadingDoc === key ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          <Download className="h-4 w-4 mr-1" />
                          Télécharger
                        </>
                      )}
                    </Button>
                    <Badge variant="outline" className="text-green-600 border-green-300">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Fourni
                    </Badge>
                  </>
                ) : (
                  <Badge variant="outline" className="text-muted-foreground">
                    <XCircle className="h-3 w-3 mr-1" />
                    Non fourni
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
