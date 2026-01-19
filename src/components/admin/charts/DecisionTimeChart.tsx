import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { DecisionTimeTrend } from "@/hooks/useVotingStats";

interface DecisionTimeChartProps {
  data: DecisionTimeTrend[];
}

export default function DecisionTimeChart({ data }: DecisionTimeChartProps) {
  if (data.length === 0 || data.every(d => d.avgDays === 0)) {
    return (
      <div className="h-[250px] flex items-center justify-center text-muted-foreground">
        Aucune donnée disponible
      </div>
    );
  }

  return (
    <div className="h-[250px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <defs>
            <linearGradient id="colorAvgDays" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
              <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis 
            dataKey="month" 
            tick={{ fontSize: 12 }}
            className="text-muted-foreground"
          />
          <YAxis 
            tick={{ fontSize: 12 }}
            className="text-muted-foreground"
            unit=" j"
          />
          <Tooltip
            formatter={(value: number) => [`${value} jours`, "Temps moyen"]}
            contentStyle={{
              backgroundColor: "hsl(var(--background))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
            }}
          />
          <Area
            type="monotone"
            dataKey="avgDays"
            name="Temps moyen"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            fill="url(#colorAvgDays)"
            dot={{ fill: "hsl(var(--primary))", strokeWidth: 2 }}
            activeDot={{ r: 6 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
