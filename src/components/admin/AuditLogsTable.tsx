import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  Download,
  Share2,
  FileCheck,
  CheckCircle2,
  XCircle,
  AlertCircle,
  User,
  Shield,
  UserCheck,
} from 'lucide-react';
import type { AuditLogEntry } from '@/hooks/useAuditLogs';

interface AuditLogsTableProps {
  logs: AuditLogEntry[];
  isLoading: boolean;
  currentPage: number;
  totalPages: number;
  totalCount: number;
  onPageChange: (page: number) => void;
}

const accessTypeIcons: Record<string, React.ReactNode> = {
  preview: <Eye className="h-4 w-4" />,
  download: <Download className="h-4 w-4" />,
  share: <Share2 className="h-4 w-4" />,
  evaluation: <FileCheck className="h-4 w-4" />,
};

const accessTypeLabels: Record<string, string> = {
  preview: 'Aperçu',
  download: 'Téléchargement',
  share: 'Partage',
  evaluation: 'Évaluation',
};

const resultConfig: Record<string, { icon: React.ReactNode; variant: 'default' | 'destructive' | 'secondary' | 'outline'; label: string }> = {
  success: {
    icon: <CheckCircle2 className="h-3 w-3" />,
    variant: 'default',
    label: 'Succès',
  },
  error: {
    icon: <XCircle className="h-3 w-3" />,
    variant: 'destructive',
    label: 'Erreur',
  },
  denied: {
    icon: <AlertCircle className="h-3 w-3" />,
    variant: 'secondary',
    label: 'Refusé',
  },
};

const roleIcons: Record<string, React.ReactNode> = {
  admin: <Shield className="h-3 w-3" />,
  evaluator: <UserCheck className="h-3 w-3" />,
  startup: <User className="h-3 w-3" />,
};

export function AuditLogsTable({
  logs,
  isLoading,
  currentPage,
  totalPages,
  totalCount,
  onPageChange,
}: AuditLogsTableProps) {
  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  if (logs.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <FileCheck className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>Aucun log d'accès trouvé</p>
        <p className="text-sm">Les accès aux documents apparaîtront ici</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[180px]">Date/Heure</TableHead>
              <TableHead>Utilisateur</TableHead>
              <TableHead>Document</TableHead>
              <TableHead className="w-[120px]">Type</TableHead>
              <TableHead className="w-[100px]">Résultat</TableHead>
              <TableHead className="hidden lg:table-cell">Startup</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.map((log) => (
              <TableRow key={log.id}>
                <TableCell className="font-mono text-sm">
                  {format(new Date(log.created_at), 'dd/MM/yyyy HH:mm', { locale: fr })}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="text-muted-foreground">
                          {roleIcons[log.user_role || 'startup'] || <User className="h-3 w-3" />}
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        {log.user_role || 'Utilisateur'}
                      </TooltipContent>
                    </Tooltip>
                    <span className="truncate max-w-[150px]">
                      {log.profile?.full_name || log.profile?.email || 'Utilisateur inconnu'}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="space-y-1">
                        <span className="font-medium text-sm">
                          {log.document_type || 'Document'}
                        </span>
                        <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                          {log.document_path.split('/').pop()}
                        </p>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-[300px] break-all">{log.document_path}</p>
                    </TooltipContent>
                  </Tooltip>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {accessTypeIcons[log.access_type]}
                    <span className="text-sm">{accessTypeLabels[log.access_type]}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={resultConfig[log.access_result]?.variant || 'outline'}>
                    <span className="flex items-center gap-1">
                      {resultConfig[log.access_result]?.icon}
                      {resultConfig[log.access_result]?.label || log.access_result}
                    </span>
                  </Badge>
                  {log.error_message && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <AlertCircle className="h-3 w-3 text-destructive ml-1 inline cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-[200px]">{log.error_message}</p>
                      </TooltipContent>
                    </Tooltip>
                  )}
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  <span className="truncate max-w-[150px] text-sm text-muted-foreground">
                    {log.startup?.name || '-'}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {totalCount} accès au total
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 0}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm">
            Page {currentPage + 1} sur {totalPages || 1}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages - 1}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
