import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthContext";
import { useStructureData } from "@/hooks/useStructureData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import {
  Rocket,
  Award,
  FolderKanban,
  TrendingUp,
  Users,
  ExternalLink,
  Plus,
} from "lucide-react";

export default function StructureDashboard() {
  const { profile } = useAuth();
  const { structure, startups, stats, isLoading } = useStructureData();
  const { t } = useTranslation("dashboard");

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-28" />
          ))}
        </div>
        <Skeleton className="h-64" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Welcome */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold mb-2">
          {t("structure.dashboard.welcome", {
            name: structure?.name || profile?.full_name || "Structure",
          })}
        </h1>
        <p className="text-muted-foreground">
          {t("structure.dashboard.subtitle")}
        </p>
      </motion.div>

      {/* KPIs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
      >
        <KPICard
          icon={Rocket}
          label={t("structure.dashboard.kpi.totalStartups")}
          value={stats.totalStartups}
        />
        <KPICard
          icon={Award}
          label={t("structure.dashboard.kpi.labeledStartups")}
          value={stats.labeledStartups}
          accent
        />
        <KPICard
          icon={FolderKanban}
          label={t("structure.dashboard.kpi.activePrograms")}
          value={stats.activePrograms}
        />
        <KPICard
          icon={TrendingUp}
          label={t("structure.dashboard.kpi.successRate")}
          value={`${stats.successRate}%`}
        />
      </motion.div>

      {/* Recent startups */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">
              {t("structure.dashboard.recentStartups")}
            </CardTitle>
            <Button variant="outline" size="sm" asChild>
              <Link to="/structure/startups">
                {t("structure.dashboard.viewAll")}
                <ExternalLink className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {startups.length === 0 ? (
              <div className="text-center py-12">
                <Users className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                <p className="text-muted-foreground mb-4">
                  {t("structure.dashboard.noStartups")}
                </p>
                <p className="text-sm text-muted-foreground">
                  {t("structure.dashboard.noStartupsHint")}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {startups.slice(0, 5).map((s) => (
                  <div
                    key={s.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border border-border/50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Rocket className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{s.startup_name}</p>
                        <p className="text-xs text-muted-foreground">
                          {s.sector || "—"} · {s.program_name || "—"}
                        </p>
                      </div>
                    </div>
                    <ApplicationStatusBadge status={s.application_status} />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-8"
      >
        <h3 className="text-lg font-semibold mb-4">
          {t("structure.dashboard.quickActions")}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <QuickAction
            icon={FolderKanban}
            title={t("structure.dashboard.action.programs")}
            description={t("structure.dashboard.action.programsDesc")}
            href="/structure/programmes"
          />
          <QuickAction
            icon={Users}
            title={t("structure.dashboard.action.profile")}
            description={t("structure.dashboard.action.profileDesc")}
            href="/structure/profil"
          />
          <QuickAction
            icon={Rocket}
            title={t("structure.dashboard.action.startups")}
            description={t("structure.dashboard.action.startupsDesc")}
            href="/structure/startups"
          />
        </div>
      </motion.div>
    </div>
  );
}

function KPICard({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: React.ElementType;
  label: string;
  value: number | string;
  accent?: boolean;
}) {
  return (
    <Card>
      <CardContent className="p-4 flex items-center gap-4">
        <div
          className={`p-3 rounded-xl ${
            accent ? "bg-accent/10 text-accent" : "bg-primary/10 text-primary"
          }`}
        >
          <Icon className="h-6 w-6" />
        </div>
        <div>
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-xs text-muted-foreground">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function ApplicationStatusBadge({
  status,
}: {
  status: string | null;
}) {
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

function QuickAction({
  icon: Icon,
  title,
  description,
  href,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  href: string;
}) {
  return (
    <Link to={href}>
      <Card className="h-full transition-all hover:shadow-md hover:-translate-y-0.5 cursor-pointer">
        <CardContent className="p-4 flex items-start gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Icon className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm">{title}</h3>
            <p className="text-xs text-muted-foreground">{description}</p>
          </div>
          <ExternalLink className="h-4 w-4 text-muted-foreground flex-shrink-0" />
        </CardContent>
      </Card>
    </Link>
  );
}
