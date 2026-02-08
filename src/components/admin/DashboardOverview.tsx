import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { BarChart3, PieChart as PieIcon } from 'lucide-react';
import StatusFunnelChart from './charts/StatusFunnelChart';
import SectorBreakdownChart from './charts/SectorBreakdownChart';
import { motion } from 'framer-motion';

interface MonthlyStats {
  month: string;
  submitted: number;
  approved: number;
  rejected: number;
}

interface SectorData {
  sector: string;
  count: number;
}

interface DashboardOverviewProps {
  monthlyStats: MonthlyStats[];
  statusCounts: {
    draft: number;
    pending: number;
    under_review: number;
    approved: number;
    rejected: number;
    incomplete: number;
  };
  sectorBreakdown: SectorData[];
  animationKey: number;
}

const STATUS_PIE_COLORS: Record<string, string> = {
  'En attente': 'hsl(45, 93%, 47%)',
  'En examen': 'hsl(199, 89%, 48%)',
  'Approuvées': 'hsl(142, 76%, 36%)',
  'Rejetées': 'hsl(0, 84%, 60%)',
  'Brouillons': 'hsl(var(--muted-foreground))',
  'Incomplets': 'hsl(25, 95%, 53%)',
};

export default function DashboardOverview({
  monthlyStats,
  statusCounts,
  sectorBreakdown,
  animationKey,
}: DashboardOverviewProps) {
  // Funnel data
  const total = Object.values(statusCounts).reduce((a, b) => a + b, 0);
  const submitted = statusCounts.pending + statusCounts.under_review + statusCounts.approved + statusCounts.rejected + statusCounts.incomplete;
  const underReview = statusCounts.under_review + statusCounts.approved + statusCounts.rejected;
  const decided = statusCounts.approved + statusCounts.rejected;

  const funnelData = [
    { stage: 'Total', count: total, color: 'hsl(var(--primary))' },
    { stage: 'Soumises', count: submitted, color: 'hsl(199, 89%, 48%)' },
    { stage: 'Examinées', count: underReview, color: 'hsl(262, 83%, 58%)' },
    { stage: 'Décidées', count: decided, color: 'hsl(45, 93%, 47%)' },
    { stage: 'Approuvées', count: statusCounts.approved, color: 'hsl(142, 76%, 36%)' },
  ];

  // Donut data
  const donutData = [
    { name: 'En attente', value: statusCounts.pending },
    { name: 'En examen', value: statusCounts.under_review },
    { name: 'Approuvées', value: statusCounts.approved },
    { name: 'Rejetées', value: statusCounts.rejected },
    { name: 'Brouillons', value: statusCounts.draft },
    { name: 'Incomplets', value: statusCounts.incomplete },
  ].filter(d => d.value > 0);

  return (
    <motion.div
      key={animationKey}
      initial={{ opacity: 0.8 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <h2 className="text-lg font-semibold">Vue d'ensemble</h2>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Status Funnel */}
        <StatusFunnelChart funnelData={funnelData} />

        {/* Status Donut */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <PieIcon className="h-4 w-4 text-primary" />
              Répartition par statut
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={donutData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={85}
                    paddingAngle={2}
                    dataKey="value"
                    nameKey="name"
                  >
                    {donutData.map((entry) => (
                      <Cell
                        key={entry.name}
                        fill={STATUS_PIE_COLORS[entry.name] || 'hsl(var(--muted))'}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      fontSize: '12px',
                    }}
                  />
                  <Legend
                    iconType="circle"
                    iconSize={8}
                    wrapperStyle={{ fontSize: '11px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Monthly Trends */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-primary" />
              Évolution mensuelle
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyStats} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                  <XAxis
                    dataKey="month"
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
                  />
                  <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      fontSize: '12px',
                    }}
                  />
                  <Legend iconSize={8} wrapperStyle={{ fontSize: '11px' }} />
                  <Bar dataKey="submitted" name="Soumises" fill="hsl(var(--primary))" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="approved" name="Approuvées" fill="hsl(142, 76%, 36%)" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="rejected" name="Rejetées" fill="hsl(0, 84%, 60%)" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Sector Breakdown */}
        <SectorBreakdownChart data={sectorBreakdown} />
      </div>
    </motion.div>
  );
}
