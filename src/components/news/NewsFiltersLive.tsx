import { Search, RefreshCw, Wifi, WifiOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";

interface NewsFiltersLiveProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  categories: string[];
  isLive: boolean;
  isLoading: boolean;
  useRealtime: boolean;
  setUseRealtime: (value: boolean) => void;
  onRefresh: () => void;
  lastUpdated: string | null;
  categoryCounts?: Record<string, number>;
}

const getCategoryPillColor = (category: string, isActive: boolean) => {
  const colorMap: Record<string, { active: string; inactive: string }> = {
    Toutes: {
      active: "bg-ci-orange text-white border-ci-orange",
      inactive: "border-ci-orange/30 text-ci-orange hover:bg-ci-orange/10",
    },
    Annonces: {
      active: "bg-blue-600 text-white border-blue-600",
      inactive: "border-blue-500/30 text-blue-600 hover:bg-blue-500/10",
    },
    Événements: {
      active: "bg-purple-600 text-white border-purple-600",
      inactive: "border-purple-500/30 text-purple-600 hover:bg-purple-500/10",
    },
    Succès: {
      active: "bg-green-600 text-white border-green-600",
      inactive: "border-green-500/30 text-green-600 hover:bg-green-500/10",
    },
    Partenariats: {
      active: "bg-amber-600 text-white border-amber-600",
      inactive: "border-amber-500/30 text-amber-600 hover:bg-amber-500/10",
    },
    Formations: {
      active: "bg-cyan-600 text-white border-cyan-600",
      inactive: "border-cyan-500/30 text-cyan-600 hover:bg-cyan-500/10",
    },
    Investissements: {
      active: "bg-emerald-600 text-white border-emerald-600",
      inactive: "border-emerald-500/30 text-emerald-600 hover:bg-emerald-500/10",
    },
  };
  const colors = colorMap[category] || colorMap["Toutes"];
  return isActive ? colors.active : colors.inactive;
};

const NewsFiltersLive = ({
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  categories,
  isLive,
  isLoading,
  useRealtime,
  setUseRealtime,
  onRefresh,
  lastUpdated,
  categoryCounts,
}: NewsFiltersLiveProps) => {
  return (
    <div className="container mx-auto px-4 py-6 space-y-4">
      {/* Search and Status Row */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Rechercher des actualités..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4"
          />
        </div>

        <div className="flex items-center gap-4">
          {/* Live Status Indicator */}
          <div className="flex items-center gap-2">
            {isLive ? (
              <motion.div
                className="flex items-center gap-1.5"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <motion.div
                  className="w-2 h-2 rounded-full bg-green-500"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                />
                <Wifi className="h-4 w-4 text-green-500" />
                <span className="text-xs text-green-600 font-medium">En direct</span>
              </motion.div>
            ) : (
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-muted-foreground" />
                <WifiOff className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Archives</span>
              </div>
            )}
          </div>

          {/* Realtime Toggle */}
          <div className="flex items-center gap-2">
            <Switch
              id="realtime-mode"
              checked={useRealtime}
              onCheckedChange={setUseRealtime}
            />
            <Label htmlFor="realtime-mode" className="text-sm cursor-pointer">
              Temps réel
            </Label>
          </div>

          {/* Refresh Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={isLoading || !useRealtime}
            className="gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            Actualiser
          </Button>
        </div>
      </div>

      {/* Last Updated */}
      {lastUpdated && useRealtime && (
        <p className="text-xs text-muted-foreground">
          Dernière mise à jour : {lastUpdated}
        </p>
      )}

      {/* Category Filters - pill-shaped with category-specific colors */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => {
          const isActive = selectedCategory === category;
          const count = categoryCounts?.[category];
          return (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border text-sm font-medium transition-all duration-200 hover:scale-105 ${getCategoryPillColor(
                category,
                isActive
              )}`}
            >
              {category}
              {count !== undefined && (
                <span
                  className={`text-xs ${
                    isActive ? "opacity-80" : "opacity-60"
                  }`}
                >
                  ({count})
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default NewsFiltersLive;
