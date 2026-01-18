import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface NetworkStartup {
  id: string;
  name: string;
  description: string | null;
  sector: string | null;
  website: string | null;
  logo_url: string | null;
  address: string | null;
  label_granted_at: string | null;
  founder_info: string | null;
}

export function useNetwork(sector?: string) {
  const [startups, setStartups] = useState<NetworkStartup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLabeledStartups() {
      if (!supabase) {
        setLoading(false);
        return;
      }

      try {
        // Get startups with approved applications that are visible in directory
        const { data: approvedApps, error: appsError } = await supabase
          .from('applications')
          .select('startup_id')
          .eq('status', 'approved');

        if (appsError) {
          setError(appsError.message);
          setLoading(false);
          return;
        }

        const approvedStartupIds = approvedApps?.map(a => a.startup_id) || [];

        if (approvedStartupIds.length === 0) {
          setStartups([]);
          setLoading(false);
          return;
        }

        let query = supabase
          .from('startups')
          .select('id, name, description, sector, website, logo_url, address, label_granted_at, founder_info')
          .in('id', approvedStartupIds)
          .eq('is_visible_in_directory', true)
          .order('name');

        if (sector && sector !== 'all') {
          query = query.eq('sector', sector);
        }

        const { data, error: fetchError } = await query;

        if (fetchError) {
          setError(fetchError.message);
        } else {
          setStartups(data as NetworkStartup[]);
        }
      } catch (err) {
        setError('Erreur lors du chargement du réseau');
      } finally {
        setLoading(false);
      }
    }

    fetchLabeledStartups();
  }, [sector]);

  return { startups, loading, error };
}
