import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { EvaluatorPerformance } from "@/hooks/useVotingStats";

interface EvaluatorPerformanceChartProps {
  data: EvaluatorPerformance[];
}

export default function EvaluatorPerformanceChart({ data }: EvaluatorPerformanceChartProps) {
  if (data.length === 0) {
    return (
      <div className="h-[250px] flex items-center justify-center text-muted-foreground">
        Aucune donnée disponible
      </div>
    );
  }

  // Truncate names for display
  const chartData = data.map(d => ({
    ...d,
    shortName: d.evaluatorName.length > 15 
      ? d.evaluatorName.substring(0, 12) + "..." 
      : d.evaluatorName,
  }));

  return (
    <div className="h-[250px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart 
          data={chartData} 
          layout="vertical"
          margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis 
            type="number" 
            tick={{ fontSize: 12 }}
            className="text-muted-foreground"
          />
          <YAxis 
            type="category" 
            dataKey="shortName" 
            tick={{ fontSize: 11 }}
            className="text-muted-foreground"
            width={75}
          />
          <Tooltip
            formatter={(value: number, name: string, props: { payload: typeof chartData[number] }) => {
              const entry = props.payload;
              if (name === "Évaluations") {
                return [
                  `${value} évaluations (score moy: ${entry.avgScore}, taux approbation: ${entry.approveRate}%)`,
                  entry.evaluatorName
                ];
              }
              return [value, name];
            }}
            contentStyle={{
              backgroundColor: "hsl(var(--background))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
            }}
          />
          <Bar 
            dataKey="evaluationsCount" 
            name="Évaluations"
            radius={[0, 4, 4, 0]}
          >
            {chartData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`}
                fill={`hsl(var(--primary))`}
                fillOpacity={0.6 + (index * 0.08)}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
