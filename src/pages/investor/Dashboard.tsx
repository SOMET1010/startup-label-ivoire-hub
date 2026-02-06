import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Rocket, Heart, MessageSquare, TrendingUp, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useInvestorData } from "@/hooks/useInvestorData";
import { useAuth } from "@/contexts/AuthContext";
import { SEOHead } from "@/components/shared/SEOHead";

export default function InvestorDashboard() {
  const { t } = useTranslation("dashboard");
  const { profile } = useAuth();
  const { investor, investorLoading, labeledStartups, startupsLoading, stats } = useInvestorData();

  if (investorLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-24 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-28" />)}
        </div>
      </div>
    );
  }

  const kpis = [
    { label: t("investor.dashboard.kpi.availableStartups"), value: stats.availableStartups, icon: Rocket, color: "text-primary" },
    { label: t("investor.dashboard.kpi.markedInterests"), value: stats.markedInterests, icon: Heart, color: "text-destructive" },
    { label: t("investor.dashboard.kpi.contacted"), value: stats.contacted, icon: MessageSquare, color: "text-accent-foreground" },
    { label: t("investor.dashboard.kpi.sectors"), value: stats.sectors, icon: TrendingUp, color: "text-primary" },
  ];

  const recentStartups = labeledStartups.slice(0, 5);

  return (
    <>
      <SEOHead
        title={t("investor.dashboard.title")}
        description={t("investor.dashboard.subtitle")}
      />
      <div className="space-y-6">
        {/* Welcome */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="py-6">
              <h1 className="text-2xl font-bold text-foreground">
                {t("investor.dashboard.welcome", { name: profile?.full_name || investor?.name || "" })}
              </h1>
              <p className="text-muted-foreground mt-1">{t("investor.dashboard.subtitle")}</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {kpis.map((kpi, i) => (
            <motion.div key={kpi.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-muted">
                      <kpi.icon className={`w-5 h-5 ${kpi.color}`} />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{kpi.value}</p>
                      <p className="text-xs text-muted-foreground">{kpi.label}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Recent Startups */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">{t("investor.dashboard.recentStartups")}</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/investor/startups" className="flex items-center gap-1">
                {t("investor.dashboard.viewAll")}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {startupsLoading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-16" />)}
              </div>
            ) : recentStartups.length === 0 ? (
              <p className="text-muted-foreground text-sm py-4 text-center">
                {t("investor.dashboard.noStartups")}
              </p>
            ) : (
              <div className="space-y-3">
                {recentStartups.map((startup) => (
                  <div key={startup.id} className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Rocket className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{startup.name}</p>
                        <p className="text-xs text-muted-foreground">{startup.sector || "—"}</p>
                      </div>
                    </div>
                    {startup.stage && (
                      <Badge variant="secondary" className="text-xs">{startup.stage}</Badge>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { title: t("investor.dashboard.action.startups"), desc: t("investor.dashboard.action.startupsDesc"), href: "/investor/startups", icon: Rocket },
            { title: t("investor.dashboard.action.interests"), desc: t("investor.dashboard.action.interestsDesc"), href: "/investor/interests", icon: Heart },
            { title: t("investor.dashboard.action.profile"), desc: t("investor.dashboard.action.profileDesc"), href: "/investor/profil", icon: MessageSquare },
          ].map((action) => (
            <Link key={action.href} to={action.href}>
              <Card className="hover:border-primary/50 transition-colors cursor-pointer h-full">
                <CardContent className="pt-6">
                  <action.icon className="w-8 h-8 text-primary mb-3" />
                  <h3 className="font-medium">{action.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{action.desc}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
