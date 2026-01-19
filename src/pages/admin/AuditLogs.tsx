import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileText, RefreshCw } from 'lucide-react';
import { useAuditLogs, type AuditLogFilters } from '@/hooks/useAuditLogs';
import { AuditLogsFilters } from '@/components/admin/AuditLogsFilters';
import { AuditLogsTable } from '@/components/admin/AuditLogsTable';
import { AuditLogsStatsCards } from '@/components/admin/AuditLogsStats';
import { AuditLogsCharts } from '@/components/admin/AuditLogsCharts';
import { toast } from 'sonner';

export default function AuditLogs() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<AuditLogFilters>({});

  const {
    logs,
    totalCount,
    totalPages,
    currentPage,
    setPage,
    isLoading,
    refetch,
    stats,
    statsLoading,
    dailyActivity,
    topDocuments,
    exportToCsv,
  } = useAuditLogs(filters);

  const handleExport = async () => {
    try {
      await exportToCsv();
      toast.success('Export CSV téléchargé');
    } catch (error) {
      toast.error('Erreur lors de l\'export');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/admin')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <FileText className="h-6 w-6" />
                Audit des accès documents
              </h1>
              <p className="text-muted-foreground">
                Traçabilité des accès aux documents sensibles des startups
              </p>
            </div>
          </div>
          <Button variant="outline" onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualiser
          </Button>
        </div>

        {/* Stats Cards */}
        <AuditLogsStatsCards stats={stats} isLoading={statsLoading} />

        {/* Charts */}
        <AuditLogsCharts dailyActivity={dailyActivity} topDocuments={topDocuments} />

        {/* Filters */}
        <AuditLogsFilters
          filters={filters}
          onFiltersChange={setFilters}
          onExport={handleExport}
        />

        {/* Table */}
        <AuditLogsTable
          logs={logs}
          isLoading={isLoading}
          currentPage={currentPage}
          totalPages={totalPages}
          totalCount={totalCount}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
}
