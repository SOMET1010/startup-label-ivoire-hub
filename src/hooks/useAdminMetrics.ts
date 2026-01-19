import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { differenceInDays, parseISO, subMonths, format, startOfMonth, endOfMonth } from 'date-fns';

interface ApplicationMetrics {
  id: string;
  status: string;
  submitted_at: string | null;
  reviewed_at: string | null;
  created_at: string;
}

interface MonthlyStats {
  month: string;
  submitted: number;
  approved: number;
  rejected: number;
}

interface AdminMetrics {
  // Global stats
  totalApplications: number;
  pendingApplications: number;
  approvedApplications: number;
  rejectedApplications: number;
  
  // Time metrics
  averageProcessingDays: number | null;
  fastestProcessingDays: number | null;
  slowestProcessingDays: number | null;
  
  // Rates
  approvalRate: number;
  rejectionRate: number;
  completionRate: number;
  
  // Monthly trends
  monthlyStats: MonthlyStats[];
  
  // Document requests
  pendingDocumentRequests: number;
  applicationsWithPendingDocs: number;
  averageRoundTrips: number;
}

export function useAdminMetrics() {
  const [metrics, setMetrics] = useState<AdminMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMetrics = async () => {
    try {
      // Fetch all applications
      const { data: applications, error: appsError } = await supabase
        .from('applications')
        .select('id, status, submitted_at, reviewed_at, created_at');

      if (appsError) throw appsError;

      const apps = (applications || []) as ApplicationMetrics[];

      // Calculate basic stats
      const totalApplications = apps.length;
      const pendingApplications = apps.filter(a => 
        a.status === 'pending' || a.status === 'under_review' || a.status === 'verification' || a.status === 'incomplete'
      ).length;
      const approvedApplications = apps.filter(a => a.status === 'approved').length;
      const rejectedApplications = apps.filter(a => a.status === 'rejected').length;

      // Calculate processing times for completed applications
      const completedApps = apps.filter(a => 
        (a.status === 'approved' || a.status === 'rejected') && 
        a.submitted_at && 
        a.reviewed_at
      );

      const processingTimes = completedApps.map(a => 
        differenceInDays(parseISO(a.reviewed_at!), parseISO(a.submitted_at!))
      ).filter(d => d >= 0);

      const averageProcessingDays = processingTimes.length > 0 
        ? Math.round(processingTimes.reduce((a, b) => a + b, 0) / processingTimes.length)
        : null;
      
      const fastestProcessingDays = processingTimes.length > 0 
        ? Math.min(...processingTimes)
        : null;
      
      const slowestProcessingDays = processingTimes.length > 0 
        ? Math.max(...processingTimes)
        : null;

      // Calculate rates
      const decidedApps = approvedApplications + rejectedApplications;
      const approvalRate = decidedApps > 0 ? Math.round((approvedApplications / decidedApps) * 100) : 0;
      const rejectionRate = decidedApps > 0 ? Math.round((rejectedApplications / decidedApps) * 100) : 0;
      const completionRate = totalApplications > 0 ? Math.round((decidedApps / totalApplications) * 100) : 0;

      // Calculate monthly stats for the last 6 months
      const monthlyStats: MonthlyStats[] = [];
      for (let i = 5; i >= 0; i--) {
        const date = subMonths(new Date(), i);
        const monthStart = startOfMonth(date);
        const monthEnd = endOfMonth(date);
        
        const monthApps = apps.filter(a => {
          if (!a.submitted_at) return false;
          const submittedDate = parseISO(a.submitted_at);
          return submittedDate >= monthStart && submittedDate <= monthEnd;
        });

        monthlyStats.push({
          month: format(date, 'MMM yyyy'),
          submitted: monthApps.length,
          approved: monthApps.filter(a => a.status === 'approved').length,
          rejected: monthApps.filter(a => a.status === 'rejected').length,
        });
      }

      // Fetch document requests
      const { data: docRequests, error: docError } = await supabase
        .from('document_requests')
        .select('id, application_id, fulfilled_at')
        .is('fulfilled_at', null);

      const pendingDocumentRequests = docRequests?.length || 0;
      const applicationsWithPendingDocs = docRequests 
        ? new Set(docRequests.map((r: { application_id: string }) => r.application_id)).size
        : 0;

      // Calculate average round trips (number of document requests per application)
      const { data: allDocRequests } = await supabase
        .from('document_requests')
        .select('application_id');

      const requestsByApp: Record<string, number> = {};
      (allDocRequests || []).forEach((r: { application_id: string }) => {
        requestsByApp[r.application_id] = (requestsByApp[r.application_id] || 0) + 1;
      });
      
      const appRequestCounts = Object.values(requestsByApp);
      const averageRoundTrips = appRequestCounts.length > 0 
        ? Math.round((appRequestCounts.reduce((a, b) => a + b, 0) / appRequestCounts.length) * 10) / 10
        : 0;

      setMetrics({
        totalApplications,
        pendingApplications,
        approvedApplications,
        rejectedApplications,
        averageProcessingDays,
        fastestProcessingDays,
        slowestProcessingDays,
        approvalRate,
        rejectionRate,
        completionRate,
        monthlyStats,
        pendingDocumentRequests,
        applicationsWithPendingDocs,
        averageRoundTrips,
      });
    } catch (err: any) {
      console.error('Error fetching metrics:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  return { metrics, loading, error, refetch: fetchMetrics };
}
