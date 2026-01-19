import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Clock, 
  TrendingUp, 
  TrendingDown, 
  FileCheck, 
  XCircle, 
  AlertTriangle,
  BarChart3,
  Target,
  Zap,
  RefreshCw,
  FileWarning,
} from 'lucide-react';
import { useAdminMetrics } from '@/hooks/useAdminMetrics';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { cn } from '@/lib/utils';

interface AdminKPIsProps {
  className?: string;
}

export function AdminKPIs({ className }: AdminKPIsProps) {
  const { metrics, loading, error } = useAdminMetrics();

  if (loading) {
    return (
      <div className={cn('grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4', className)}>
        {[...Array(5)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-4 bg-muted rounded w-24" />
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted rounded w-16" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error || !metrics) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center py-8 text-muted-foreground">
          <AlertTriangle className="h-5 w-5 mr-2" />
          Erreur lors du chargement des métriques
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Average Processing Time */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Temps moyen de traitement
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics.averageProcessingDays !== null 
                ? `${metrics.averageProcessingDays} jours` 
                : '-'
              }
            </div>
            {metrics.fastestProcessingDays !== null && (
              <p className="text-xs text-muted-foreground mt-1">
                Min: {metrics.fastestProcessingDays}j / Max: {metrics.slowestProcessingDays}j
              </p>
            )}
          </CardContent>
        </Card>

        {/* Approval Rate */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Taux d'approbation
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {metrics.approvalRate}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {metrics.approvedApplications} approuvées sur {metrics.approvedApplications + metrics.rejectedApplications} décisions
            </p>
          </CardContent>
        </Card>

        {/* Completion Rate */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Taux de complétion
            </CardTitle>
            <Target className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {metrics.completionRate}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {metrics.pendingApplications} candidatures en attente
            </p>
          </CardContent>
        </Card>

        {/* Pending Documents - NEW KPI */}
        <Card className={cn(
          metrics.pendingDocumentRequests > 0 && "border-orange-300 bg-orange-50/50"
        )}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Documents en attente
            </CardTitle>
            <FileWarning className={cn(
              "h-4 w-4",
              metrics.pendingDocumentRequests > 0 ? "text-orange-500" : "text-muted-foreground"
            )} />
          </CardHeader>
          <CardContent>
            <div className={cn(
              "text-2xl font-bold",
              metrics.pendingDocumentRequests > 0 ? "text-orange-600" : "text-muted-foreground"
            )}>
              {metrics.pendingDocumentRequests}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {metrics.applicationsWithPendingDocs} candidature{metrics.applicationsWithPendingDocs !== 1 ? 's' : ''} concernée{metrics.applicationsWithPendingDocs !== 1 ? 's' : ''}
            </p>
          </CardContent>
        </Card>

        {/* Document Round Trips */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Allers-retours moyens
            </CardTitle>
            <RefreshCw className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {metrics.averageRoundTrips}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              demandes par candidature
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Trends Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Évolution mensuelle
          </CardTitle>
          <CardDescription>
            Candidatures soumises et traitées par mois
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={metrics.monthlyStats}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  dataKey="month" 
                  className="text-xs"
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                />
                <YAxis 
                  className="text-xs"
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Bar 
                  dataKey="submitted" 
                  name="Soumises" 
                  fill="hsl(var(--primary))" 
                  radius={[4, 4, 0, 0]}
                />
                <Bar 
                  dataKey="approved" 
                  name="Approuvées" 
                  fill="hsl(142, 76%, 36%)" 
                  radius={[4, 4, 0, 0]}
                />
                <Bar 
                  dataKey="rejected" 
                  name="Rejetées" 
                  fill="hsl(0, 84%, 60%)" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-green-50/50 border-green-200">
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="p-3 rounded-full bg-green-100">
              <FileCheck className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-green-700">{metrics.approvedApplications}</p>
              <p className="text-sm text-green-600">Startups labellisées</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-red-50/50 border-red-200">
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="p-3 rounded-full bg-red-100">
              <XCircle className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-red-700">{metrics.rejectedApplications}</p>
              <p className="text-sm text-red-600">Candidatures rejetées</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-blue-50/50 border-blue-200">
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="p-3 rounded-full bg-blue-100">
              <Zap className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-700">{metrics.totalApplications}</p>
              <p className="text-sm text-blue-600">Total candidatures</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
