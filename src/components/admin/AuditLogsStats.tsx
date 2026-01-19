import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Eye,
  Download,
  CheckCircle2,
  XCircle,
  Users,
  FileText,
  Activity,
  AlertTriangle,
} from 'lucide-react';
import type { AuditLogStats } from '@/hooks/useAuditLogs';

interface AuditLogsStatsProps {
  stats: AuditLogStats | undefined;
  isLoading: boolean;
}

export function AuditLogsStatsCards({ stats, isLoading }: AuditLogsStatsProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!stats) return null;

  const statCards = [
    {
      title: 'Total accès',
      value: stats.totalAccess,
      icon: <Activity className="h-4 w-4 text-muted-foreground" />,
      description: `${stats.uniqueUsers} utilisateurs uniques`,
    },
    {
      title: 'Succès',
      value: stats.successCount,
      icon: <CheckCircle2 className="h-4 w-4 text-green-500" />,
      description: `${stats.totalAccess > 0 ? Math.round((stats.successCount / stats.totalAccess) * 100) : 0}% du total`,
      className: 'text-green-600',
    },
    {
      title: 'Erreurs / Refusés',
      value: stats.errorCount + stats.deniedCount,
      icon: <AlertTriangle className="h-4 w-4 text-orange-500" />,
      description: `${stats.errorCount} erreurs, ${stats.deniedCount} refusés`,
      className: stats.errorCount + stats.deniedCount > 0 ? 'text-orange-600' : '',
    },
    {
      title: 'Documents consultés',
      value: stats.uniqueDocuments,
      icon: <FileText className="h-4 w-4 text-muted-foreground" />,
      description: `${stats.previewCount} aperçus, ${stats.downloadCount} téléchargements`,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statCards.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            {stat.icon}
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${stat.className || ''}`}>
              {stat.value.toLocaleString('fr-FR')}
            </div>
            <p className="text-xs text-muted-foreground">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
