import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface AuditLogEntry {
  id: string;
  user_id: string;
  user_role: string | null;
  document_path: string;
  document_type: string | null;
  access_type: 'preview' | 'download' | 'share' | 'evaluation';
  access_result: 'success' | 'error' | 'denied';
  startup_id: string | null;
  application_id: string | null;
  ip_address: string | null;
  user_agent: string | null;
  error_message: string | null;
  created_at: string;
  // Joined data
  profile?: {
    full_name: string | null;
    email: string | null;
  };
  startup?: {
    name: string;
  };
}

export interface AuditLogFilters {
  startDate?: Date;
  endDate?: Date;
  userId?: string;
  startupId?: string;
  accessType?: string;
  accessResult?: string;
  searchTerm?: string;
}

export interface AuditLogStats {
  totalAccess: number;
  successCount: number;
  errorCount: number;
  deniedCount: number;
  previewCount: number;
  downloadCount: number;
  uniqueUsers: number;
  uniqueDocuments: number;
}

const PAGE_SIZE = 20;

export function useAuditLogs(filters: AuditLogFilters = {}) {
  const [page, setPage] = useState(0);

  // Build query with filters
  const buildQuery = useCallback(() => {
    let query = supabase
      .from('document_access_logs')
      .select(`
        *,
        profile:profiles!document_access_logs_user_id_fkey(full_name, email),
        startup:startups!document_access_logs_startup_id_fkey(name)
      `, { count: 'exact' });

    if (filters.startDate) {
      query = query.gte('created_at', filters.startDate.toISOString());
    }
    if (filters.endDate) {
      query = query.lte('created_at', filters.endDate.toISOString());
    }
    if (filters.userId) {
      query = query.eq('user_id', filters.userId);
    }
    if (filters.startupId) {
      query = query.eq('startup_id', filters.startupId);
    }
    if (filters.accessType) {
      query = query.eq('access_type', filters.accessType);
    }
    if (filters.accessResult) {
      query = query.eq('access_result', filters.accessResult);
    }
    if (filters.searchTerm) {
      query = query.or(`document_path.ilike.%${filters.searchTerm}%,document_type.ilike.%${filters.searchTerm}%`);
    }

    return query;
  }, [filters]);

  // Main query for paginated logs
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['audit-logs', filters, page],
    queryFn: async () => {
      const query = buildQuery()
        .order('created_at', { ascending: false })
        .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);

      const { data, error, count } = await query;

      if (error) throw error;

      return {
        logs: (data || []) as unknown as AuditLogEntry[],
        totalCount: count || 0,
        totalPages: Math.ceil((count || 0) / PAGE_SIZE),
      };
    },
  });

  // Stats query
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['audit-logs-stats', filters],
    queryFn: async () => {
      const query = buildQuery();
      const { data, error } = await query;

      if (error) throw error;

      const logs = data || [];

      const stats: AuditLogStats = {
        totalAccess: logs.length,
        successCount: logs.filter((l: any) => l.access_result === 'success').length,
        errorCount: logs.filter((l: any) => l.access_result === 'error').length,
        deniedCount: logs.filter((l: any) => l.access_result === 'denied').length,
        previewCount: logs.filter((l: any) => l.access_type === 'preview').length,
        downloadCount: logs.filter((l: any) => l.access_type === 'download').length,
        uniqueUsers: new Set(logs.map((l: any) => l.user_id)).size,
        uniqueDocuments: new Set(logs.map((l: any) => l.document_path)).size,
      };

      return stats;
    },
  });

  // Daily activity for chart
  const { data: dailyActivity } = useQuery({
    queryKey: ['audit-logs-daily', filters],
    queryFn: async () => {
      const query = buildQuery();
      const { data, error } = await query;

      if (error) throw error;

      // Group by date
      const byDate: Record<string, { success: number; error: number; denied: number }> = {};
      
      (data || []).forEach((log: any) => {
        const date = new Date(log.created_at).toISOString().split('T')[0];
        if (!byDate[date]) {
          byDate[date] = { success: 0, error: 0, denied: 0 };
        }
        byDate[date][log.access_result as 'success' | 'error' | 'denied']++;
      });

      return Object.entries(byDate)
        .map(([date, counts]) => ({ date, ...counts }))
        .sort((a, b) => a.date.localeCompare(b.date));
    },
  });

  // Top documents
  const { data: topDocuments } = useQuery({
    queryKey: ['audit-logs-top-docs', filters],
    queryFn: async () => {
      const query = buildQuery();
      const { data, error } = await query;

      if (error) throw error;

      // Count by document type
      const byType: Record<string, number> = {};
      
      (data || []).forEach((log: any) => {
        const type = log.document_type || 'Inconnu';
        byType[type] = (byType[type] || 0) + 1;
      });

      return Object.entries(byType)
        .map(([type, count]) => ({ type, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);
    },
  });

  // Export to CSV
  const exportToCsv = useCallback(async () => {
    const query = buildQuery().order('created_at', { ascending: false });
    const { data, error } = await query;

    if (error) throw error;

    const logs = data || [];
    
    const headers = [
      'Date/Heure',
      'Utilisateur',
      'Rôle',
      'Document',
      'Type de document',
      'Type d\'accès',
      'Résultat',
      'Startup',
      'Adresse IP',
      'Message d\'erreur',
    ];

    const rows = logs.map((log: any) => [
      new Date(log.created_at).toLocaleString('fr-FR'),
      log.profile?.full_name || log.profile?.email || log.user_id,
      log.user_role || '',
      log.document_path,
      log.document_type || '',
      log.access_type,
      log.access_result,
      log.startup?.name || '',
      log.ip_address || '',
      log.error_message || '',
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `audit-logs-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }, [buildQuery]);

  return {
    logs: data?.logs || [],
    totalCount: data?.totalCount || 0,
    totalPages: data?.totalPages || 0,
    currentPage: page,
    setPage,
    isLoading,
    error,
    refetch,
    stats,
    statsLoading,
    dailyActivity: dailyActivity || [],
    topDocuments: topDocuments || [],
    exportToCsv,
  };
}
