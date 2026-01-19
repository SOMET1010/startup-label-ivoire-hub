import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Search, X, Filter, FileQuestion } from "lucide-react";

interface ApplicationFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
  sectorFilter: string;
  onSectorChange: (value: string) => void;
  dateFilter: string;
  onDateChange: (value: string) => void;
  minScoreFilter: string;
  onMinScoreChange: (value: string) => void;
  pendingDocsOnly: boolean;
  onPendingDocsChange: (value: boolean) => void;
  onReset: () => void;
  filteredCount: number;
  totalCount: number;
}

const SECTOR_OPTIONS = [
  { value: "all", label: "Tous les secteurs" },
  { value: "fintech", label: "FinTech" },
  { value: "edtech", label: "EdTech" },
  { value: "healthtech", label: "HealthTech" },
  { value: "agritech", label: "AgriTech" },
  { value: "ecommerce", label: "E-commerce" },
  { value: "mobility", label: "Mobilité" },
  { value: "cleantech", label: "CleanTech" },
  { value: "proptech", label: "PropTech" },
  { value: "other", label: "Autre" },
];

const STATUS_OPTIONS = [
  { value: "all", label: "Tous les statuts" },
  { value: "pending", label: "En attente" },
  { value: "under_review", label: "En cours d'examen" },
  { value: "incomplete", label: "Documents manquants" },
  { value: "approved", label: "Approuvée" },
  { value: "rejected", label: "Rejetée" },
];

const DATE_OPTIONS = [
  { value: "all", label: "Toutes les dates" },
  { value: "7days", label: "7 derniers jours" },
  { value: "30days", label: "30 derniers jours" },
  { value: "90days", label: "3 derniers mois" },
  { value: "year", label: "Cette année" },
];

const SCORE_OPTIONS = [
  { value: "all", label: "Tous les scores" },
  { value: "60", label: "≥ 60 pts" },
  { value: "70", label: "≥ 70 pts" },
  { value: "80", label: "≥ 80 pts" },
  { value: "90", label: "≥ 90 pts" },
];

export default function ApplicationFilters({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  sectorFilter,
  onSectorChange,
  dateFilter,
  onDateChange,
  minScoreFilter,
  onMinScoreChange,
  pendingDocsOnly,
  onPendingDocsChange,
  onReset,
  filteredCount,
  totalCount,
}: ApplicationFiltersProps) {
  const hasActiveFilters =
    searchQuery ||
    statusFilter !== "all" ||
    sectorFilter !== "all" ||
    dateFilter !== "all" ||
    minScoreFilter !== "all" ||
    pendingDocsOnly;

  return (
    <div className="space-y-4 mb-6">
      {/* First Row: Search + Status + Sector */}
      <div className="flex flex-col lg:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher par nom, email..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={statusFilter} onValueChange={onStatusChange}>
          <SelectTrigger className="w-full lg:w-[180px]">
            <SelectValue placeholder="Statut" />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={sectorFilter} onValueChange={onSectorChange}>
          <SelectTrigger className="w-full lg:w-[180px]">
            <SelectValue placeholder="Secteur" />
          </SelectTrigger>
          <SelectContent>
            {SECTOR_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={dateFilter} onValueChange={onDateChange}>
          <SelectTrigger className="w-full lg:w-[180px]">
            <SelectValue placeholder="Période" />
          </SelectTrigger>
          <SelectContent>
            {DATE_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={minScoreFilter} onValueChange={onMinScoreChange}>
          <SelectTrigger className="w-full lg:w-[160px]">
            <SelectValue placeholder="Score min" />
          </SelectTrigger>
          <SelectContent>
            {SCORE_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex items-center gap-2 px-3 py-2 border rounded-md bg-background">
          <FileQuestion className="h-4 w-4 text-orange-500" />
          <Label htmlFor="pending-docs" className="text-sm cursor-pointer whitespace-nowrap">
            Docs en attente
          </Label>
          <Switch
            id="pending-docs"
            checked={pendingDocsOnly}
            onCheckedChange={onPendingDocsChange}
          />
        </div>
      </div>

      {/* Second Row: Results count + Reset button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Filter className="h-4 w-4" />
          <span>
            {filteredCount} candidature{filteredCount !== 1 ? "s" : ""}{" "}
            {filteredCount !== totalCount && (
              <span>sur {totalCount}</span>
            )}
          </span>
        </div>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4 mr-1" />
            Réinitialiser les filtres
          </Button>
        )}
      </div>
    </div>
  );
}
