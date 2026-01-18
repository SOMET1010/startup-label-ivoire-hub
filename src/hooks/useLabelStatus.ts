import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface LabelStatus {
  isLabeled: boolean;
  loading: boolean;
  startup: {
    id: string;
    name: string;
    sector: string | null;
    label_granted_at: string | null;
    label_expires_at: string | null;
  } | null;
  application: {
    id: string;
    status: string;
    label_valid_until: string | null;
    submitted_at: string | null;
  } | null;
  daysUntilExpiration: number | null;
}

export function useLabelStatus(): LabelStatus {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [isLabeled, setIsLabeled] = useState(false);
  const [startup, setStartup] = useState<LabelStatus['startup']>(null);
  const [application, setApplication] = useState<LabelStatus['application']>(null);
  const [daysUntilExpiration, setDaysUntilExpiration] = useState<number | null>(null);

  useEffect(() => {
    async function checkLabelStatus() {
      if (!user || !supabase) {
        setLoading(false);
        return;
      }

      try {
        // Get user's startup with approved application
        const { data: startupData, error: startupError } = await supabase
          .from('startups')
          .select('id, name, sector, label_granted_at, label_expires_at')
          .eq('user_id', user.id)
          .maybeSingle();

        if (startupError || !startupData) {
          setLoading(false);
          return;
        }

        // Check if there's an approved application
        const { data: appData, error: appError } = await supabase
          .from('applications')
          .select('id, status, label_valid_until, submitted_at')
          .eq('startup_id', startupData.id)
          .eq('status', 'approved')
          .maybeSingle();

        if (appError) {
          console.error('Error fetching application:', appError);
          setLoading(false);
          return;
        }

        if (appData) {
          setIsLabeled(true);
          setStartup(startupData);
          setApplication(appData);

          // Calculate days until expiration
          const expirationDate = startupData.label_expires_at || appData.label_valid_until;
          if (expirationDate) {
            const expDate = new Date(expirationDate);
            const today = new Date();
            const diffTime = expDate.getTime() - today.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            setDaysUntilExpiration(diffDays);
          }
        }
      } catch (error) {
        console.error('Error checking label status:', error);
      } finally {
        setLoading(false);
      }
    }

    checkLabelStatus();
  }, [user]);

  return { isLabeled, loading, startup, application, daysUntilExpiration };
}
