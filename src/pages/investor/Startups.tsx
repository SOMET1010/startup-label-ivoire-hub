import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Rocket, Heart, Search, Filter } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useInvestorData } from "@/hooks/useInvestorData";
import { SEOHead } from "@/components/shared/SEOHead";

export default function InvestorStartups() {
  const { t } = useTranslation("dashboard");
  const { labeledStartups, startupsLoading, interests, toggleInterest } = useInvestorData();
  const [search, setSearch] = useState("");
  const [sectorFilter, setSectorFilter] = useState("all");

  const sectors = useMemo(() => {
    const s = new Set(labeledStartups.map((st) => st.sector).filter(Boolean) as string[]);
    return Array.from(s).sort();
  }, [labeledStartups]);

  const filtered = useMemo(() => {
    return labeledStartups.filter((s) => {
      const matchesSearch = !search || s.name.toLowerCase().includes(search.toLowerCase()) ||
        (s.sector || "").toLowerCase().includes(search.toLowerCase());
      const matchesSector = sectorFilter === "all" || s.sector === sectorFilter;
      return matchesSearch && matchesSector;
    });
  }, [labeledStartups, search, sectorFilter]);

  const isInterested = (startupId: string) => interests.some((i) => i.startup_id === startupId);

  return (
    <>
      <SEOHead title={t("investor.startups.title")} description={t("investor.startups.subtitle")} />
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">{t("investor.startups.title")}</h1>
          <p className="text-muted-foreground">{t("investor.startups.subtitle")}</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder={t("investor.startups.searchPlaceholder")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={sectorFilter} onValueChange={setSectorFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder={t("investor.startups.filterSector")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("investor.startups.allSectors")}</SelectItem>
              {sectors.map((s) => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Grid */}
        {startupsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-48" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            {t("investor.startups.noResults")}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((startup, i) => (
              <motion.div key={startup.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <Card className="h-full hover:border-primary/50 transition-colors">
                  <CardContent className="pt-6 flex flex-col h-full">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                          <Rocket className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{startup.name}</h3>
                          {startup.sector && (
                            <Badge variant="secondary" className="text-xs mt-1">{startup.sector}</Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground line-clamp-3 flex-1 mb-4">
                      {startup.description || t("investor.startups.noDescription")}
                    </p>

                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                      {startup.stage && <span>{startup.stage}</span>}
                      {startup.team_size && <span>{startup.team_size} {t("investor.startups.members")}</span>}
                    </div>

                    <Button
                      variant={isInterested(startup.id) ? "default" : "outline"}
                      size="sm"
                      className="w-full"
                      onClick={() => toggleInterest.mutate(startup.id)}
                      disabled={toggleInterest.isPending}
                    >
                      <Heart className={`w-4 h-4 mr-2 ${isInterested(startup.id) ? "fill-current" : ""}`} />
                      {isInterested(startup.id)
                        ? t("investor.startups.interested")
                        : t("investor.startups.markInterest")}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
