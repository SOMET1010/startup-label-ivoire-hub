import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface DailyActivity {
  date: string;
  success: number;
  error: number;
  denied: number;
}

interface TopDocument {
  type: string;
  count: number;
}

interface AuditLogsChartsProps {
  dailyActivity: DailyActivity[];
  topDocuments: TopDocument[];
}

const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', 'hsl(var(--muted))', '#8884d8', '#82ca9d', '#ffc658', '#ff8042'];

export function AuditLogsCharts({ dailyActivity, topDocuments }: AuditLogsChartsProps) {
  const formattedDailyActivity = dailyActivity.map((item) => ({
    ...item,
    dateLabel: format(new Date(item.date), 'dd/MM', { locale: fr }),
  }));

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {/* Daily Activity Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Activité par jour</CardTitle>
        </CardHeader>
        <CardContent>
          {dailyActivity.length === 0 ? (
            <div className="h-[250px] flex items-center justify-center text-muted-foreground">
              Aucune donnée disponible
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={formattedDailyActivity}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="dateLabel"
                  tick={{ fontSize: 12 }}
                  className="text-muted-foreground"
                />
                <YAxis tick={{ fontSize: 12 }} className="text-muted-foreground" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                  labelFormatter={(label) => `Date: ${label}`}
                />
                <Bar dataKey="success" name="Succès" fill="hsl(142, 76%, 36%)" stackId="a" />
                <Bar dataKey="error" name="Erreurs" fill="hsl(0, 84%, 60%)" stackId="a" />
                <Bar dataKey="denied" name="Refusés" fill="hsl(45, 93%, 47%)" stackId="a" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Top Documents Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Documents les plus consultés</CardTitle>
        </CardHeader>
        <CardContent>
          {topDocuments.length === 0 ? (
            <div className="h-[250px] flex items-center justify-center text-muted-foreground">
              Aucune donnée disponible
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={topDocuments}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                  nameKey="type"
                  label={({ type, percent }) =>
                    `${type} (${(percent * 100).toFixed(0)}%)`
                  }
                >
                  {topDocuments.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                  formatter={(value: number) => [`${value} accès`, 'Nombre']}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
