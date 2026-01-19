import { cn } from "@/lib/utils";

interface VoteProgressBarProps {
  approveCount: number;
  rejectCount: number;
  pendingCount: number;
  totalVotes: number;
  className?: string;
}

export default function VoteProgressBar({
  approveCount,
  rejectCount,
  pendingCount,
  totalVotes,
  className,
}: VoteProgressBarProps) {
  if (totalVotes === 0) {
    return (
      <div className={cn("space-y-2", className)}>
        <div className="h-3 bg-muted rounded-full overflow-hidden">
          <div className="h-full w-0" />
        </div>
        <p className="text-xs text-muted-foreground text-center">Aucun vote</p>
      </div>
    );
  }

  const approvePercent = (approveCount / totalVotes) * 100;
  const rejectPercent = (rejectCount / totalVotes) * 100;
  const pendingPercent = (pendingCount / totalVotes) * 100;

  return (
    <div className={cn("space-y-3", className)}>
      <div className="h-3 bg-muted rounded-full overflow-hidden flex">
        {approvePercent > 0 && (
          <div
            className="h-full bg-green-500 transition-all duration-300"
            style={{ width: `${approvePercent}%` }}
            title={`Approuver: ${approveCount} (${Math.round(approvePercent)}%)`}
          />
        )}
        {rejectPercent > 0 && (
          <div
            className="h-full bg-red-500 transition-all duration-300"
            style={{ width: `${rejectPercent}%` }}
            title={`Rejeter: ${rejectCount} (${Math.round(rejectPercent)}%)`}
          />
        )}
        {pendingPercent > 0 && (
          <div
            className="h-full bg-yellow-500 transition-all duration-300"
            style={{ width: `${pendingPercent}%` }}
            title={`En attente: ${pendingCount} (${Math.round(pendingPercent)}%)`}
          />
        )}
      </div>
      
      <div className="flex justify-between text-xs">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
          <span>Approuver {approveCount} ({Math.round(approvePercent)}%)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
          <span>Rejeter {rejectCount} ({Math.round(rejectPercent)}%)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
          <span>En attente {pendingCount} ({Math.round(pendingPercent)}%)</span>
        </div>
      </div>
    </div>
  );
}
