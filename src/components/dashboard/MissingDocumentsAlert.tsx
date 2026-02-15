import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Upload, CheckCircle, FileText, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface DocumentRequest {
  id: string;
  document_type: string;
  message: string | null;
  requested_at: string;
  fulfilled_at: string | null;
  application_id: string;
}

interface MissingDocumentsAlertProps {
  applicationId?: string;
  className?: string;
  onDocumentUploaded?: () => void;
}

const DOCUMENT_LABELS: Record<string, string> = {
  doc_rccm: 'RCCM',
  doc_tax: 'Attestation fiscale',
  doc_business_plan: 'Business Plan',
  doc_statutes: 'Statuts',
  doc_cv: 'CV Fondateurs',
  doc_pitch: 'Pitch Deck',
  other: 'Autre document',
};

export function MissingDocumentsAlert({ 
  applicationId, 
  className,
  onDocumentUploaded 
}: MissingDocumentsAlertProps) {
  const { user } = useAuth();
  const [requests, setRequests] = useState<DocumentRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState<string | null>(null);

  const fetchRequests = async () => {
    if (!user) return;

    try {
      let query = supabase
        .from('document_requests')
        .select('*')
        .is('fulfilled_at', null)
        .order('requested_at', { ascending: false });

      if (applicationId) {
        query = query.eq('application_id', applicationId);
      }

      const { data, error } = await query;

      if (error) throw error;
      setRequests((data || []) as DocumentRequest[]);
    } catch (error) {
      console.error('Error fetching document requests:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [user, applicationId]);

  const handleFileUpload = async (requestId: string, file: File) => {
    if (!user) return;

    setUploading(requestId);
    try {
      const request = requests.find(r => r.id === requestId);
      if (!request) return;

      // Upload file
      const extension = file.name.split('.').pop();
      const fileName = `${user.id}/${request.application_id}/${request.document_type}_${Date.now()}.${extension}`;
      
      const { error: uploadError } = await supabase.storage
        .from('application-documents')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Mark request as fulfilled
      const { error: updateError } = await supabase
        .from('document_requests')
        .update({ fulfilled_at: new Date().toISOString() })
        .eq('id', requestId);

      if (updateError) throw updateError;

      toast({
        title: 'Document téléversé',
        description: 'Votre document a été envoyé avec succès.',
      });

      fetchRequests();
      onDocumentUploaded?.();
    } catch (error: unknown) {
      console.error('Upload error:', error);
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: error instanceof Error ? error.message : 'Impossible de téléverser le document.',
      });
    } finally {
      setUploading(null);
    }
  };

  if (loading) {
    return null;
  }

  if (requests.length === 0) {
    return null;
  }

  return (
    <Card className={cn('border-orange-200 bg-orange-50/50', className)}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-orange-700 text-lg">
          <AlertTriangle className="h-5 w-5" />
          Documents à fournir
          <Badge variant="outline" className="ml-auto bg-orange-100 text-orange-700 border-orange-300">
            {requests.length} demande{requests.length > 1 ? 's' : ''}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {requests.map((request) => (
          <div 
            key={request.id}
            className="flex items-start gap-3 p-3 bg-white rounded-lg border border-orange-200"
          >
            <FileText className="h-5 w-5 text-orange-500 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm">
                {DOCUMENT_LABELS[request.document_type] || request.document_type}
              </p>
              {request.message && (
                <p className="text-sm text-muted-foreground mt-0.5">
                  {request.message}
                </p>
              )}
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Demandé {formatDistanceToNow(new Date(request.requested_at), { 
                  addSuffix: true, 
                  locale: fr 
                })}
              </p>
            </div>
            <div>
              <input
                type="file"
                id={`upload-${request.id}`}
                className="hidden"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(request.id, file);
                }}
                disabled={uploading === request.id}
              />
              <Button
                size="sm"
                variant="outline"
                className="border-orange-300 hover:bg-orange-100"
                disabled={uploading === request.id}
                onClick={() => document.getElementById(`upload-${request.id}`)?.click()}
              >
                {uploading === request.id ? (
                  <>
                    <div className="h-4 w-4 animate-spin border-2 border-orange-500 border-t-transparent rounded-full mr-2" />
                    Envoi...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Téléverser
                  </>
                )}
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
