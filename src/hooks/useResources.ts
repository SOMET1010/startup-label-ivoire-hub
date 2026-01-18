import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface LabelResource {
  id: string;
  title: string;
  description: string | null;
  category: 'guide' | 'template' | 'formation' | 'legal' | 'finance';
  file_url: string | null;
  external_url: string | null;
  is_premium: boolean;
  created_at: string;
}

export function useResources(category?: string) {
  const [resources, setResources] = useState<LabelResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchResources() {
      if (!supabase) {
        setLoading(false);
        return;
      }

      try {
        let query = supabase
          .from('label_resources')
          .select('*')
          .order('created_at', { ascending: false });

        if (category && category !== 'all') {
          query = query.eq('category', category);
        }

        const { data, error: fetchError } = await query;

        if (fetchError) {
          setError(fetchError.message);
        } else {
          setResources(data as LabelResource[]);
        }
      } catch (err) {
        setError('Erreur lors du chargement des ressources');
      } finally {
        setLoading(false);
      }
    }

    fetchResources();
  }, [category]);

  return { resources, loading, error };
}
