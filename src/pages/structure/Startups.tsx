import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useStructureData } from "@/hooks/useStructureData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Rocket, Search, Users } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export default function StructureStartups() {
  const { startups, isLoading } = useStructureData();
  const { t } = useTranslation("dashboard");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = startups.filter((s) => {
    const matchesSearch =
      s.startup_name.toLowerCase().includes(search.toLowerCase()) ||
      (s.sector?.toLowerCase() || "").includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || s.application_status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">
        {t("structure.startups.title")}
      </h1>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("structure.startups.searchPlaceholder")}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder={t("structure.startups.filterStatus")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">
              {t("structure.startups.allStatuses")}
            </SelectItem>
            <SelectItem value="approved">Labellisée</SelectItem>
            <SelectItem value="pending">En attente</SelectItem>
            <SelectItem value="under_review">En examen</SelectItem>
            <SelectItem value="rejected">Rejetée</SelectItem>
            <SelectItem value="draft">Brouillon</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          {filtered.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground">
                {t("structure.startups.noResults")}
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("structure.startups.col.name")}</TableHead>
                  <TableHead>{t("structure.startups.col.sector")}</TableHead>
                  <TableHead>{t("structure.startups.col.program")}</TableHead>
                  <TableHead>{t("structure.startups.col.status")}</TableHead>
                  <TableHead>{t("structure.startups.col.startDate")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Rocket className="h-4 w-4 text-primary" />
                        {s.startup_name}
                      </div>
                    </TableCell>
                    <TableCell>{s.sector || "—"}</TableCell>
                    <TableCell>{s.program_name || "—"}</TableCell>
                    <TableCell>
                      <StatusBadge status={s.application_status} />
                    </TableCell>
                    <TableCell>
                      {s.started_at
                        ? format(new Date(s.started_at), "dd MMM yyyy", {
                            locale: fr,
                          })
                        : "—"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function StatusBadge({ status }: { status: string | null }) {
  const map: Record<string, { label: string; variant: "success" | "warning" | "destructive" | "secondary" }> = {
    approved: { label: "Labellisée", variant: "success" },
    pending: { label: "En attente", variant: "warning" },
    under_review: { label: "En examen", variant: "secondary" },
    rejected: { label: "Rejetée", variant: "destructive" },
    draft: { label: "Brouillon", variant: "secondary" },
  };
  const info = map[status || ""] || { label: "—", variant: "secondary" as const };
  return <Badge variant={info.variant}>{info.label}</Badge>;
}
