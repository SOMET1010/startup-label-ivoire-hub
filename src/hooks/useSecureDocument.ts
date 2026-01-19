import { useState, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

/**
 * Durées d'expiration par type d'accès (en secondes)
 * - preview: Aperçu dans modal ou iframe
 * - download: Téléchargement direct
 * - share: Partage temporaire (admin uniquement)
 */
export const EXPIRATION_TIMES = {
  preview: 300,      // 5 minutes pour aperçu
  download: 120,     // 2 minutes pour téléchargement
  share: 600,        // 10 minutes pour partage
  evaluation: 1800,  // 30 minutes pour session d'évaluation
} as const;

export type ExpirationMode = keyof typeof EXPIRATION_TIMES;

interface CachedUrl {
  url: string;
  expiresAt: number;
}

interface UseSecureDocumentReturn {
  getSignedUrl: (path: string, mode?: ExpirationMode) => Promise<string | null>;
  downloadDocument: (path: string, fileName?: string) => Promise<void>;
  previewDocument: (path: string) => Promise<string | null>;
  isLoading: boolean;
  error: string | null;
  clearError: () => void;
}

const BUCKET_NAME = 'application-documents';

// Cache local pour éviter les appels redondants
const urlCache = new Map<string, CachedUrl>();

// Buffer de 30 secondes avant expiration pour régénérer
const EXPIRATION_BUFFER_MS = 30 * 1000;

/**
 * Hook centralisé pour l'accès sécurisé aux documents sensibles
 * 
 * Fonctionnalités:
 * - URLs signées avec expiration courte (5 min par défaut)
 * - Cache local pour éviter les appels redondants
 * - Gestion d'erreurs unifiée
 * - Support aperçu, téléchargement et partage
 */
export function useSecureDocument(): UseSecureDocumentReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const loadingRef = useRef<Set<string>>(new Set());

  const clearError = useCallback(() => setError(null), []);

  /**
   * Génère une URL signée avec expiration configurée
   */
  const getSignedUrl = useCallback(async (
    path: string, 
    mode: ExpirationMode = 'preview'
  ): Promise<string | null> => {
    if (!path) {
      setError('Chemin du document non spécifié');
      return null;
    }

    // Vérifier le cache
    const cacheKey = `${path}:${mode}`;
    const cached = urlCache.get(cacheKey);
    if (cached && cached.expiresAt > Date.now() + EXPIRATION_BUFFER_MS) {
      return cached.url;
    }

    // Éviter les appels en doublon
    if (loadingRef.current.has(cacheKey)) {
      return null;
    }

    loadingRef.current.add(cacheKey);
    setIsLoading(true);
    setError(null);

    try {
      const expirationSeconds = EXPIRATION_TIMES[mode];
      
      const { data, error: signError } = await supabase.storage
        .from(BUCKET_NAME)
        .createSignedUrl(path, expirationSeconds);

      if (signError) {
        throw signError;
      }

      if (!data?.signedUrl) {
        throw new Error('URL signée non générée');
      }

      // Mettre en cache
      urlCache.set(cacheKey, {
        url: data.signedUrl,
        expiresAt: Date.now() + (expirationSeconds * 1000),
      });

      return data.signedUrl;
    } catch (err: any) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      console.error('Erreur génération URL signée:', err);
      return null;
    } finally {
      loadingRef.current.delete(cacheKey);
      setIsLoading(false);
    }
  }, []);

  /**
   * Télécharge un document de manière sécurisée
   */
  const downloadDocument = useCallback(async (
    path: string, 
    fileName?: string
  ): Promise<void> => {
    if (!path) {
      toast.error('Chemin du document non spécifié');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { data, error: downloadError } = await supabase.storage
        .from(BUCKET_NAME)
        .download(path);

      if (downloadError) {
        throw downloadError;
      }

      if (!data) {
        throw new Error('Fichier non trouvé');
      }

      // Créer le lien de téléchargement
      const resolvedFileName = fileName || extractFileName(path);
      const url = URL.createObjectURL(data);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = resolvedFileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Libérer l'URL après un court délai
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      
      toast.success(`Document "${resolvedFileName}" téléchargé`);
    } catch (err: any) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Erreur téléchargement document:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Génère une URL pour prévisualisation (5 min d'expiration)
   */
  const previewDocument = useCallback(async (path: string): Promise<string | null> => {
    return getSignedUrl(path, 'preview');
  }, [getSignedUrl]);

  return {
    getSignedUrl,
    downloadDocument,
    previewDocument,
    isLoading,
    error,
    clearError,
  };
}

// Helpers
function extractFileName(path: string): string {
  const parts = path.split('/');
  return parts[parts.length - 1] || 'document';
}

function getErrorMessage(error: any): string {
  if (error?.message?.includes('Object not found')) {
    return 'Document non trouvé';
  }
  if (error?.message?.includes('permission')) {
    return 'Accès non autorisé à ce document';
  }
  if (error?.message?.includes('expired')) {
    return 'Le lien a expiré, veuillez réessayer';
  }
  return error?.message || 'Erreur lors de l\'accès au document';
}

/**
 * Utilitaires pour les types de fichiers
 */
export function getFileExtension(path: string): string {
  const parts = path.split('.');
  return parts[parts.length - 1]?.toLowerCase() || '';
}

export function isPDF(path: string): boolean {
  return getFileExtension(path) === 'pdf';
}

export function isImage(path: string): boolean {
  const ext = getFileExtension(path);
  return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext);
}

export function isPreviewable(path: string): boolean {
  return isPDF(path) || isImage(path);
}

export type DocumentType = 'pdf' | 'image' | 'other';

export function getDocumentType(path: string): DocumentType {
  if (isPDF(path)) return 'pdf';
  if (isImage(path)) return 'image';
  return 'other';
}

/**
 * Vide le cache des URLs (utile lors de la déconnexion)
 */
export function clearUrlCache(): void {
  urlCache.clear();
}
