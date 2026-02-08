import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAdminMetrics } from './useAdminMetrics';

export function useRealtimeAdminStats() {
  const { metrics, loading, error, refetch } = useAdminMetrics();
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [animationKey, setAnimationKey] = useState(0);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleRealtimeChange = useCallback(() => {
    // Debounce rapid changes to avoid excessive refetches
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      refetch();
      setLastUpdate(new Date());
      setAnimationKey(prev => prev + 1);
    }, 1000);
  }, [refetch]);

  useEffect(() => {
    if (!supabase) return;

    const channel = supabase
      .channel('admin-dashboard-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'applications' },
        handleRealtimeChange
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'evaluations' },
        handleRealtimeChange
      )
      .subscribe();

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      supabase.removeChannel(channel);
    };
  }, [handleRealtimeChange]);

  return {
    metrics,
    loading,
    error,
    refetch,
    lastUpdate,
    animationKey,
  };
}
