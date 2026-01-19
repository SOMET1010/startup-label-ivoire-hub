import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Calendar } from "lucide-react";

export type TimePeriod = '30d' | '90d' | '1y' | 'all';

export const TIME_PERIOD_OPTIONS = [
  { value: '30d' as TimePeriod, label: '30 jours', shortLabel: '30j' },
  { value: '90d' as TimePeriod, label: '90 jours', shortLabel: '90j' },
  { value: '1y' as TimePeriod, label: '1 an', shortLabel: '1 an' },
  { value: 'all' as TimePeriod, label: 'Tout', shortLabel: 'Tout' },
] as const;

interface PeriodSelectorProps {
  value: TimePeriod;
  onChange: (period: TimePeriod) => void;
}

export function PeriodSelector({ value, onChange }: PeriodSelectorProps) {
  return (
    <div className="flex items-center gap-2">
      <Calendar className="h-4 w-4 text-muted-foreground" />
      <ToggleGroup 
        type="single" 
        value={value} 
        onValueChange={(val) => val && onChange(val as TimePeriod)}
        className="bg-muted/50 rounded-lg p-1"
      >
        {TIME_PERIOD_OPTIONS.map((option) => (
          <ToggleGroupItem 
            key={option.value}
            value={option.value}
            size="sm"
            className="data-[state=on]:bg-background data-[state=on]:shadow-sm px-3"
          >
            {option.shortLabel}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  );
}

export function getStartDate(period: TimePeriod): Date | null {
  const now = new Date();
  switch (period) {
    case '30d':
      return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    case '90d':
      return new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
    case '1y':
      return new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
    case 'all':
      return null;
  }
}

export function getMonthsToShow(period: TimePeriod): number {
  switch (period) {
    case '30d': return 1;
    case '90d': return 3;
    case '1y': return 12;
    case 'all': return 12;
  }
}
