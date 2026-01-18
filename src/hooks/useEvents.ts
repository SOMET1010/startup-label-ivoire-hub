import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface LabelEvent {
  id: string;
  title: string;
  description: string | null;
  event_date: string;
  location: string | null;
  is_virtual: boolean;
  registration_url: string | null;
  max_participants: number | null;
  created_at: string;
}

export function useEvents(showPast = false) {
  const [events, setEvents] = useState<LabelEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchEvents() {
      if (!supabase) {
        setLoading(false);
        return;
      }

      try {
        let query = supabase
          .from('label_events')
          .select('*')
          .order('event_date', { ascending: true });

        if (!showPast) {
          query = query.gte('event_date', new Date().toISOString());
        }

        const { data, error: fetchError } = await query;

        if (fetchError) {
          setError(fetchError.message);
        } else {
          setEvents(data as LabelEvent[]);
        }
      } catch (err) {
        setError('Erreur lors du chargement des événements');
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, [showPast]);

  return { events, loading, error };
}
