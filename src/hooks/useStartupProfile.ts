import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { useSecureDocument, isPreviewable } from '@/hooks/useSecureDocument';

const profileFormSchema = z.object({
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  description: z.string().min(20, 'La description doit contenir au moins 20 caractères').max(2000),
  sector: z.string().min(1, 'Veuillez sélectionner un secteur'),
  stage: z.string().min(1, 'Veuillez sélectionner un stade'),
  website: z.string().url('URL invalide').or(z.literal('')).optional(),
  team_size: z.coerce.number().min(1).max(10000),
  address: z.string().optional(),
  innovation: z.string().optional(),
  business_model: z.string().optional(),
  is_visible_in_directory: z.boolean(),
});

export type ProfileFormData = z.infer<typeof profileFormSchema>;

export interface StartupData {
  id: string;
  name: string;
  description: string | null;
  sector: string | null;
  stage: string | null;
  website: string | null;
  team_size: number | null;
  address: string | null;
  innovation: string | null;
  business_model: string | null;
  is_visible_in_directory: boolean;
  status: string | null;
  label_granted_at: string | null;
  label_expires_at: string | null;
  doc_rccm: string | null;
  doc_tax: string | null;
  doc_business_plan: string | null;
  doc_statutes: string | null;
  doc_cv: string | null;
  doc_pitch: string | null;
}

export const DOCUMENT_LABELS: Record<string, string> = {
  doc_rccm: 'RCCM',
  doc_tax: 'Attestation fiscale',
  doc_business_plan: 'Business Plan',
  doc_statutes: 'Statuts',
  doc_cv: 'CV Fondateurs',
  doc_pitch: 'Pitch Deck',
};

export { profileFormSchema };

export function useStartupProfile() {
  const { user } = useAuth();
  const [startup, setStartup] = useState<StartupData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [loadingDoc, setLoadingDoc] = useState<string | null>(null);
  
  const { getSignedUrl, downloadDocument } = useSecureDocument();

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: '',
      description: '',
      sector: '',
      stage: '',
      website: '',
      team_size: 1,
      address: '',
      innovation: '',
      business_model: '',
      is_visible_in_directory: true,
    },
  });

  const fetchStartup = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('startups')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      if (data) {
        setStartup(data);
        form.reset({
          name: data.name || '',
          description: data.description || '',
          sector: data.sector || '',
          stage: data.stage || '',
          website: data.website || '',
          team_size: data.team_size || 1,
          address: data.address || '',
          innovation: data.innovation || '',
          business_model: data.business_model || '',
          is_visible_in_directory: data.is_visible_in_directory ?? true,
        });
      }
    } catch (error) {
      console.error('Error fetching startup:', error);
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Impossible de charger les informations de la startup.',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStartup();
  }, [user]);

  const onSubmit = async (data: ProfileFormData) => {
    if (!startup) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('startups')
        .update({
          name: data.name,
          description: data.description,
          sector: data.sector,
          stage: data.stage,
          website: data.website || null,
          team_size: data.team_size,
          address: data.address || null,
          innovation: data.innovation || null,
          business_model: data.business_model || null,
          is_visible_in_directory: data.is_visible_in_directory,
        })
        .eq('id', startup.id);

      if (error) throw error;

      toast({
        title: 'Profil mis à jour',
        description: 'Les informations de votre startup ont été enregistrées.',
      });

      setIsEditing(false);
      fetchStartup();
    } catch (error: unknown) {
      console.error('Error updating startup:', error);
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: error instanceof Error ? error.message : 'Impossible de mettre à jour le profil.',
      });
    } finally {
      setSaving(false);
    }
  };

  const documents = startup ? [
    { key: 'doc_rccm', value: startup.doc_rccm },
    { key: 'doc_tax', value: startup.doc_tax },
    { key: 'doc_business_plan', value: startup.doc_business_plan },
    { key: 'doc_statutes', value: startup.doc_statutes },
    { key: 'doc_cv', value: startup.doc_cv },
    { key: 'doc_pitch', value: startup.doc_pitch },
  ] : [];

  const handleDocumentPreview = async (path: string, docKey: string) => {
    setLoadingDoc(docKey);
    try {
      const signedUrl = await getSignedUrl(path, 'preview');
      if (signedUrl) {
        window.open(signedUrl, '_blank');
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Impossible d\'ouvrir le document.',
      });
    } finally {
      setLoadingDoc(null);
    }
  };

  const handleDocumentDownload = async (path: string, docKey: string) => {
    setLoadingDoc(docKey);
    try {
      const fileName = path.split('/').pop() || 'document';
      await downloadDocument(path, fileName);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Impossible de télécharger le document.',
      });
    } finally {
      setLoadingDoc(null);
    }
  };

  return {
    user,
    startup,
    loading,
    saving,
    isEditing,
    setIsEditing,
    loadingDoc,
    form,
    documents,
    onSubmit,
    handleDocumentPreview,
    handleDocumentDownload,
    fetchStartup,
  };
}
