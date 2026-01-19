import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface PlatformStat {
  key: string;
  value: number;
  unit: string | null;
  label: string;
  description: string | null;
  icon: string;
}

const defaultStats: PlatformStat[] = [
  {
    key: "startups_actives",
    value: 500,
    unit: null,
    label: "Startups actives",
    description: "dans l'écosystème numérique",
    icon: "building2",
  },
  {
    key: "incubateurs",
    value: 25,
    unit: null,
    label: "Incubateurs",
    description: "partenaires du programme",
    icon: "users",
  },
  {
    key: "emplois_crees",
    value: 5000,
    unit: null,
    label: "Emplois créés",
    description: "dans le secteur tech",
    icon: "briefcase",
  },
  {
    key: "investissements",
    value: 10,
    unit: "Mds FCFA",
    label: "Investissements",
    description: "levés par les startups",
    icon: "trending-up",
  },
];

export function usePlatformStats() {
  const [stats, setStats] = useState<PlatformStat[]>(defaultStats);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        
        // Fetch configured stats from database
        const { data: configuredStats, error: fetchError } = await supabase
          .from("platform_stats")
          .select("key, value, unit, label, description, icon")
          .eq("is_visible", true)
          .order("display_order");

        if (fetchError) {
          throw fetchError;
        }

        if (configuredStats && configuredStats.length > 0) {
          // Check if we need to calculate dynamic stats
          const { count: labeledCount } = await supabase
            .from("applications")
            .select("*", { count: "exact", head: true })
            .eq("status", "approved");

          // Map and potentially override with calculated values
          const mappedStats: PlatformStat[] = configuredStats.map((stat) => {
            // If this is the startups count and we have labeled startups, use real count
            if (stat.key === "startups_actives" && labeledCount && labeledCount > 0) {
              return {
                ...stat,
                value: labeledCount,
              };
            }
            return {
              key: stat.key,
              value: Number(stat.value),
              unit: stat.unit,
              label: stat.label,
              description: stat.description,
              icon: stat.icon,
            };
          });

          setStats(mappedStats);
        }
      } catch (err) {
        console.error("Error fetching platform stats:", err);
        setError(err instanceof Error ? err : new Error("Failed to fetch stats"));
        // Keep default stats on error
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { stats, loading, error };
}

