import { useEffect, useRef, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import {
  FileCheck,
  Clock,
  CheckCircle,
  XCircle,
  Users,
  FileWarning,
  TrendingUp,
  TrendingDown,
  Minus,
  Target,
  RefreshCw,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Area,
  AreaChart,
  ResponsiveContainer,
} from 'recharts';

interface AdminMetrics {
  totalApplications: number;
  pendingApplications: number;
  approvedApplications: number;
  rejectedApplications: number;
  averageProcessingDays: number | null;
  approvalRate: number;
  completionRate: number;
  pendingDocumentRequests: number;
  applicationsWithPendingDocs: number;
  averageRoundTrips: number;
  monthlyStats: { month: string; submitted: number; approved: number; rejected: number }[];
}

interface EnhancedKPICardsProps {
  metrics: AdminMetrics;
  usersCount: number;
  animationKey: number;
}

function AnimatedNumber({ value, suffix = '', prefix = '' }: { value: number; suffix?: string; prefix?: string }) {
  const [display, setDisplay] = useState(0);
  const prevRef = useRef(0);

  useEffect(() => {
    const from = prevRef.current;
    const controls = animate(from, value, {
      duration: 0.8,
      ease: 'easeOut',
      onUpdate: (v) => setDisplay(Math.round(v * 10) / 10),
      onComplete: () => { prevRef.current = value; },
    });
    return () => controls.stop();
  }, [value]);

  return <span>{prefix}{Number.isInteger(value) ? Math.round(display) : display}{suffix}</span>;
}

function MiniSparkline({ data, color }: { data: number[]; color: string }) {
  const chartData = data.map((v, i) => ({ v, i }));
  return (
    <div className="h-8 w-20">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 2, right: 0, left: 0, bottom: 2 }}>
          <defs>
            <linearGradient id={`sparkGrad-${color}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.3} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="v"
            stroke={color}
            strokeWidth={1.5}
            fill={`url(#sparkGrad-${color})`}
            dot={false}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

function TrendBadge({ current, previous, invertColor = false }: { current: number; previous: number; invertColor?: boolean }) {
  if (previous === 0 && current === 0) return null;

  const change = previous === 0 ? (current > 0 ? 100 : 0) : Math.round(((current - previous) / previous) * 100);

  if (change === 0) {
    return (
      <span className="inline-flex items-center gap-0.5 text-xs text-muted-foreground">
        <Minus className="h-3 w-3" /> 0%
      </span>
    );
  }

  const isPositive = change > 0;
  const isGood = invertColor ? !isPositive : isPositive;

  return (
    <span className={cn(
      'inline-flex items-center gap-0.5 text-xs font-medium',
      isGood ? 'text-green-600' : 'text-red-600'
    )}>
      {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
      {isPositive ? '+' : ''}{change}%
    </span>
  );
}

export default function EnhancedKPICards({ metrics, usersCount, animationKey }: EnhancedKPICardsProps) {
  // Generate sparkline data from monthly stats
  const submittedSpark = metrics.monthlyStats.map(m => m.submitted);
  const approvedSpark = metrics.monthlyStats.map(m => m.approved);
  const rejectedSpark = metrics.monthlyStats.map(m => m.rejected);

  // Calculate trends (current month vs previous month)
  const currentMonth = metrics.monthlyStats[metrics.monthlyStats.length - 1];
  const previousMonth = metrics.monthlyStats[metrics.monthlyStats.length - 2];

  const kpis = [
    {
      title: 'Candidatures totales',
      value: metrics.totalApplications,
      suffix: '',
      icon: FileCheck,
      iconColor: 'text-primary',
      iconBg: 'bg-primary/10',
      sparkData: submittedSpark,
      sparkColor: 'hsl(var(--primary))',
      trend: { current: currentMonth?.submitted ?? 0, previous: previousMonth?.submitted ?? 0 },
    },
    {
      title: 'En attente',
      value: metrics.pendingApplications,
      suffix: '',
      icon: Clock,
      iconColor: 'text-amber-600',
      iconBg: 'bg-amber-50 dark:bg-amber-950/30',
      sparkData: null,
      sparkColor: '',
      trend: null,
    },
    {
      title: 'Approuvées',
      value: metrics.approvedApplications,
      suffix: '',
      icon: CheckCircle,
      iconColor: 'text-green-600',
      iconBg: 'bg-green-50 dark:bg-green-950/30',
      sparkData: approvedSpark,
      sparkColor: '#16a34a',
      trend: { current: currentMonth?.approved ?? 0, previous: previousMonth?.approved ?? 0 },
    },
    {
      title: 'Rejetées',
      value: metrics.rejectedApplications,
      suffix: '',
      icon: XCircle,
      iconColor: 'text-red-600',
      iconBg: 'bg-red-50 dark:bg-red-950/30',
      sparkData: rejectedSpark,
      sparkColor: '#dc2626',
      trend: null,
    },
    {
      title: 'Temps moyen',
      value: metrics.averageProcessingDays ?? 0,
      suffix: 'j',
      icon: Target,
      iconColor: 'text-purple-600',
      iconBg: 'bg-purple-50 dark:bg-purple-950/30',
      sparkData: null,
      sparkColor: '',
      trend: null,
      invertTrend: true,
    },
    {
      title: "Taux d'approbation",
      value: metrics.approvalRate,
      suffix: '%',
      icon: TrendingUp,
      iconColor: 'text-green-600',
      iconBg: 'bg-green-50 dark:bg-green-950/30',
      sparkData: null,
      sparkColor: '',
      trend: null,
    },
    {
      title: 'Documents en attente',
      value: metrics.pendingDocumentRequests,
      suffix: '',
      icon: FileWarning,
      iconColor: metrics.pendingDocumentRequests > 0 ? 'text-orange-600' : 'text-muted-foreground',
      iconBg: metrics.pendingDocumentRequests > 0 ? 'bg-orange-50 dark:bg-orange-950/30' : 'bg-muted/50',
      sparkData: null,
      sparkColor: '',
      trend: null,
      alert: metrics.pendingDocumentRequests > 0,
      subtitle: `${metrics.applicationsWithPendingDocs} candidature${metrics.applicationsWithPendingDocs !== 1 ? 's' : ''}`,
    },
    {
      title: 'Utilisateurs',
      value: usersCount,
      suffix: '',
      icon: Users,
      iconColor: 'text-muted-foreground',
      iconBg: 'bg-muted/50',
      sparkData: null,
      sparkColor: '',
      trend: null,
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
      {kpis.map((kpi, idx) => (
        <motion.div
          key={kpi.title}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.05, duration: 0.3 }}
        >
          <Card className={cn(
            'h-full transition-shadow hover:shadow-md',
            kpi.alert && 'border-orange-300 dark:border-orange-700'
          )}>
            <CardContent className="p-3">
              <div className="flex items-start justify-between mb-2">
                <p className="text-[11px] font-medium text-muted-foreground leading-tight truncate pr-1">
                  {kpi.title}
                </p>
                <div className={cn('p-1.5 rounded-md shrink-0', kpi.iconBg)}>
                  <kpi.icon className={cn('h-3.5 w-3.5', kpi.iconColor)} />
                </div>
              </div>

              <motion.div
                key={`${kpi.title}-${animationKey}`}
                initial={{ scale: 1.05 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <p className="text-xl font-bold leading-none">
                  <AnimatedNumber value={kpi.value} suffix={kpi.suffix} />
                </p>
              </motion.div>

              <div className="flex items-center justify-between mt-1.5 min-h-[20px]">
                {kpi.trend && (
                  <TrendBadge
                    current={kpi.trend.current}
                    previous={kpi.trend.previous}
                    invertColor={kpi.invertTrend}
                  />
                )}
                {kpi.subtitle && (
                  <span className="text-[10px] text-muted-foreground">{kpi.subtitle}</span>
                )}
                {kpi.sparkData && kpi.sparkData.length > 0 && (
                  <MiniSparkline data={kpi.sparkData} color={kpi.sparkColor} />
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
