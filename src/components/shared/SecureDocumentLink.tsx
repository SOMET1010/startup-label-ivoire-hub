import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Eye, 
  Download, 
  ExternalLink, 
  Loader2, 
  Clock,
  FileText,
  ImageIcon,
  File,
  RefreshCw
} from 'lucide-react';
import { 
  useSecureDocument, 
  isPreviewable, 
  getFileExtension,
  getDocumentType,
  EXPIRATION_TIMES,
  type ExpirationMode 
} from '@/hooks/useSecureDocument';
import { cn } from '@/lib/utils';

interface SecureDocumentLinkProps {
  path: string;
  label: string;
  mode?: ExpirationMode;
  showPreview?: boolean;
  showDownload?: boolean;
  showExpiration?: boolean;
  variant?: 'button' | 'compact';
  className?: string;
  onPreview?: (url: string) => void;
}

/**
 * Composant réutilisable pour afficher des liens sécurisés vers des documents
 * 
 * Fonctionnalités:
 * - Génération d'URL à la demande (pas de pré-génération)
 * - Affichage optionnel du temps restant
 * - Support aperçu et téléchargement
 * - Régénération automatique si expiré
 */
export function SecureDocumentLink({
  path,
  label,
  mode = 'preview',
  showPreview = true,
  showDownload = true,
  showExpiration = false,
  variant = 'button',
  className,
  onPreview,
}: SecureDocumentLinkProps) {
  const { getSignedUrl, downloadDocument, isLoading } = useSecureDocument();
  const [loadingAction, setLoadingAction] = useState<'preview' | 'download' | null>(null);
  const [generatedUrl, setGeneratedUrl] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  // Compte à rebours pour l'expiration
  useEffect(() => {
    if (!showExpiration || !expiresAt) return;

    const updateTimeLeft = () => {
      const remaining = Math.max(0, Math.floor((expiresAt - Date.now()) / 1000));
      setTimeLeft(remaining);
      
      if (remaining <= 0) {
        setGeneratedUrl(null);
        setExpiresAt(null);
      }
    };

    updateTimeLeft();
    const interval = setInterval(updateTimeLeft, 1000);
    
    return () => clearInterval(interval);
  }, [expiresAt, showExpiration]);

  const handlePreview = useCallback(async () => {
    setLoadingAction('preview');
    try {
      const url = await getSignedUrl(path, mode);
      if (url) {
        setGeneratedUrl(url);
        setExpiresAt(Date.now() + (EXPIRATION_TIMES[mode] * 1000));
        
        if (onPreview) {
          onPreview(url);
        } else if (!isPreviewable(path)) {
          // Ouvrir dans un nouvel onglet si pas prévisualisable
          window.open(url, '_blank');
        }
      }
    } finally {
      setLoadingAction(null);
    }
  }, [getSignedUrl, path, mode, onPreview]);

  const handleDownload = useCallback(async () => {
    setLoadingAction('download');
    try {
      await downloadDocument(path, extractFileName(path));
    } finally {
      setLoadingAction(null);
    }
  }, [downloadDocument, path]);

  const handleRefresh = useCallback(async () => {
    setLoadingAction('preview');
    try {
      const url = await getSignedUrl(path, mode);
      if (url) {
        setGeneratedUrl(url);
        setExpiresAt(Date.now() + (EXPIRATION_TIMES[mode] * 1000));
      }
    } finally {
      setLoadingAction(null);
    }
  }, [getSignedUrl, path, mode]);

  const fileIcon = getFileIcon(path);
  const canPreview = isPreviewable(path);

  if (variant === 'compact') {
    return (
      <div className={cn('flex items-center gap-2', className)}>
        {showPreview && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handlePreview}
            disabled={isLoading || loadingAction === 'preview'}
            className="h-8 px-2"
          >
            {loadingAction === 'preview' ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : canPreview ? (
              <Eye className="h-4 w-4" />
            ) : (
              <ExternalLink className="h-4 w-4" />
            )}
          </Button>
        )}
        {showDownload && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDownload}
            disabled={isLoading || loadingAction === 'download'}
            className="h-8 px-2"
          >
            {loadingAction === 'download' ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <div className="flex items-center gap-3">
        {fileIcon}
        <span className="font-medium text-sm flex-1">{label}</span>
        
        {showExpiration && timeLeft !== null && timeLeft > 0 && (
          <Badge 
            variant="outline" 
            className={cn(
              'text-xs',
              timeLeft < 60 && 'border-orange-300 text-orange-600'
            )}
          >
            <Clock className="h-3 w-3 mr-1" />
            {formatTimeLeft(timeLeft)}
          </Badge>
        )}
      </div>

      <div className="flex gap-2">
        {showPreview && (
          <Button
            variant="outline"
            size="sm"
            onClick={handlePreview}
            disabled={isLoading || loadingAction === 'preview'}
            className="h-8 text-xs"
          >
            {loadingAction === 'preview' ? (
              <Loader2 className="h-3 w-3 animate-spin mr-1" />
            ) : canPreview ? (
              <Eye className="h-3 w-3 mr-1" />
            ) : (
              <ExternalLink className="h-3 w-3 mr-1" />
            )}
            {canPreview ? 'Aperçu' : 'Ouvrir'}
          </Button>
        )}
        
        {showDownload && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownload}
            disabled={isLoading || loadingAction === 'download'}
            className="h-8 text-xs"
          >
            {loadingAction === 'download' ? (
              <Loader2 className="h-3 w-3 animate-spin mr-1" />
            ) : (
              <Download className="h-3 w-3 mr-1" />
            )}
            Télécharger
          </Button>
        )}

        {showExpiration && generatedUrl && timeLeft !== null && timeLeft < 60 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            disabled={isLoading}
            className="h-8 text-xs"
          >
            <RefreshCw className="h-3 w-3 mr-1" />
            Renouveler
          </Button>
        )}
      </div>
    </div>
  );
}

// Helpers
function extractFileName(path: string): string {
  const parts = path.split('/');
  return parts[parts.length - 1] || 'document';
}

function formatTimeLeft(seconds: number): string {
  if (seconds < 60) {
    return `${seconds}s`;
  }
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

function getFileIcon(path: string) {
  const ext = getFileExtension(path);
  switch (ext) {
    case 'pdf':
      return <FileText className="h-5 w-5 text-red-500" />;
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
    case 'webp':
    case 'svg':
      return <ImageIcon className="h-5 w-5 text-blue-500" />;
    case 'doc':
    case 'docx':
      return <FileText className="h-5 w-5 text-blue-600" />;
    case 'ppt':
    case 'pptx':
      return <FileText className="h-5 w-5 text-orange-500" />;
    case 'xls':
    case 'xlsx':
      return <FileText className="h-5 w-5 text-green-500" />;
    default:
      return <File className="h-5 w-5 text-muted-foreground" />;
  }
}

export default SecureDocumentLink;
