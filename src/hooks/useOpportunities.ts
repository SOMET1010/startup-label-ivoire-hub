import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface LabelOpportunity {
  id: string;
  title: string;
  description: string;
  type: 'marche_public' | 'financement' | 'partenariat' | 'evenement' | 'formation';
  deadline: string | null;
  eligibility_criteria: string | null;
  contact_info: string | null;
  external_url: string | null;
  is_active: boolean;
  created_at: string;
}

export function useOpportunities(type?: string) {
  const [opportunities, setOpportunities] = useState<LabelOpportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchOpportunities() {
      if (!supabase) {
        setLoading(false);
        return;
      }

      try {
        let query = supabase
          .from('label_opportunities')
          .select('*')
          .eq('is_active', true)
          .order('deadline', { ascending: true, nullsFirst: false });

        if (type && type !== 'all') {
          query = query.eq('type', type);
        }

        const { data, error: fetchError } = await query;

        if (fetchError) {
          setError(fetchError.message);
        } else {
          setOpportunities(data as LabelOpportunity[]);
        }
      } catch (err) {
        setError('Erreur lors du chargement des opportunités');
      } finally {
        setLoading(false);
      }
    }

    fetchOpportunities();
  }, [type]);

  return { opportunities, loading, error };
}
