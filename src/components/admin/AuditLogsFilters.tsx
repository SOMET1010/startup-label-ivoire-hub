import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { CalendarIcon, Search, X, Download } from 'lucide-react';
import { format, subDays, subMonths } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import type { AuditLogFilters } from '@/hooks/useAuditLogs';

interface AuditLogsFiltersProps {
  filters: AuditLogFilters;
  onFiltersChange: (filters: AuditLogFilters) => void;
  onExport: () => void;
}

export function AuditLogsFilters({ filters, onFiltersChange, onExport }: AuditLogsFiltersProps) {
  const [searchTerm, setSearchTerm] = useState(filters.searchTerm || '');

  const handleQuickFilter = (days: number) => {
    const endDate = new Date();
    const startDate = subDays(endDate, days);
    onFiltersChange({ ...filters, startDate, endDate });
  };

  const handleMonthFilter = (months: number) => {
    const endDate = new Date();
    const startDate = subMonths(endDate, months);
    onFiltersChange({ ...filters, startDate, endDate });
  };

  const handleSearch = () => {
    onFiltersChange({ ...filters, searchTerm });
  };

  const clearFilters = () => {
    setSearchTerm('');
    onFiltersChange({});
  };

  return (
    <div className="space-y-4 p-4 bg-muted/30 rounded-lg border">
      {/* Quick filters */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleQuickFilter(1)}
          className={cn(filters.startDate && format(filters.startDate, 'yyyy-MM-dd') === format(subDays(new Date(), 1), 'yyyy-MM-dd') && 'bg-primary text-primary-foreground')}
        >
          Aujourd'hui
        </Button>
        <Button variant="outline" size="sm" onClick={() => handleQuickFilter(7)}>
          7 jours
        </Button>
        <Button variant="outline" size="sm" onClick={() => handleQuickFilter(30)}>
          30 jours
        </Button>
        <Button variant="outline" size="sm" onClick={() => handleMonthFilter(3)}>
          3 mois
        </Button>
      </div>

      {/* Advanced filters */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Date range */}
        <div className="space-y-2">
          <Label>Date de début</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'w-full justify-start text-left font-normal',
                  !filters.startDate && 'text-muted-foreground'
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {filters.startDate ? format(filters.startDate, 'PP', { locale: fr }) : 'Sélectionner'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={filters.startDate}
                onSelect={(date) => onFiltersChange({ ...filters, startDate: date })}
                locale={fr}
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label>Date de fin</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'w-full justify-start text-left font-normal',
                  !filters.endDate && 'text-muted-foreground'
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {filters.endDate ? format(filters.endDate, 'PP', { locale: fr }) : 'Sélectionner'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={filters.endDate}
                onSelect={(date) => onFiltersChange({ ...filters, endDate: date })}
                locale={fr}
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Access type */}
        <div className="space-y-2">
          <Label>Type d'accès</Label>
          <Select
            value={filters.accessType || 'all'}
            onValueChange={(value) => onFiltersChange({ ...filters, accessType: value === 'all' ? undefined : value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Tous les types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les types</SelectItem>
              <SelectItem value="preview">Aperçu</SelectItem>
              <SelectItem value="download">Téléchargement</SelectItem>
              <SelectItem value="share">Partage</SelectItem>
              <SelectItem value="evaluation">Évaluation</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Access result */}
        <div className="space-y-2">
          <Label>Résultat</Label>
          <Select
            value={filters.accessResult || 'all'}
            onValueChange={(value) => onFiltersChange({ ...filters, accessResult: value === 'all' ? undefined : value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Tous les résultats" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les résultats</SelectItem>
              <SelectItem value="success">Succès</SelectItem>
              <SelectItem value="error">Erreur</SelectItem>
              <SelectItem value="denied">Refusé</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Search and actions */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="flex-1 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher par document..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="pl-9"
            />
          </div>
          <Button onClick={handleSearch}>
            <Search className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={clearFilters}>
            <X className="h-4 w-4 mr-1" />
            Effacer
          </Button>
          <Button variant="outline" onClick={onExport}>
            <Download className="h-4 w-4 mr-1" />
            Export CSV
          </Button>
        </div>
      </div>
    </div>
  );
}
