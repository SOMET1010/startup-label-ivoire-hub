import { Search, RefreshCw, Wifi, WifiOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
}

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
  lastUpdated
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
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
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

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Badge
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            className={`cursor-pointer transition-all hover:scale-105 ${
              selectedCategory === category
                ? "bg-ci-orange hover:bg-ci-orange/90"
                : "hover:bg-ci-orange/10 hover:text-ci-orange hover:border-ci-orange"
            }`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default NewsFiltersLive;
