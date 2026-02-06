import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface StructureData {
  id: string;
  name: string;
  description: string | null;
  type: string | null;
  focus_sectors: string[] | null;
  location: string | null;
  website: string | null;
  logo_url: string | null;
  programs: any;
  status: string | null;
}

interface AccompaniedStartup {
  id: string;
  startup_id: string;
  startup_name: string;
  sector: string | null;
  program_name: string | null;
  status: string;
  started_at: string | null;
  application_status: string | null;
}

interface StructureStats {
  totalStartups: number;
  labeledStartups: number;
  activePrograms: number;
  successRate: number;
}

export function useStructureData() {
  const { user } = useAuth();
  const [structure, setStructure] = useState<StructureData | null>(null);
  const [startups, setStartups] = useState<AccompaniedStartup[]>([]);
  const [stats, setStats] = useState<StructureStats>({
    totalStartups: 0,
    labeledStartups: 0,
    activePrograms: 0,
    successRate: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user || !supabase) {
        setIsLoading(false);
        return;
      }

      try {
        // Fetch structure data
        const { data: structureData, error: structureError } = await supabase
          .from("structures")
          .select("*")
          .eq("user_id", user.id)
          .maybeSingle();

        if (structureError) throw structureError;
        if (!structureData) {
          setIsLoading(false);
          return;
        }

        setStructure(structureData as StructureData);

        // Fetch accompanied startups
        const { data: linkedStartups, error: linkedError } = await supabase
          .from("structure_startups")
          .select("id, startup_id, program_name, status, started_at")
          .eq("structure_id", structureData.id);

        if (linkedError) throw linkedError;

        if (linkedStartups && linkedStartups.length > 0) {
          const startupIds = linkedStartups.map((ls) => ls.startup_id);

          // Fetch startup details
          const { data: startupDetails } = await supabase
            .from("startups")
            .select("id, name, sector")
            .in("id", startupIds);

          // Fetch applications for these startups
          const { data: applications } = await supabase
            .from("applications")
            .select("startup_id, status")
            .in("startup_id", startupIds);

          const enriched: AccompaniedStartup[] = linkedStartups.map((ls) => {
            const detail = startupDetails?.find((s) => s.id === ls.startup_id);
            const app = applications?.find((a) => a.startup_id === ls.startup_id);
            return {
              id: ls.id,
              startup_id: ls.startup_id,
              startup_name: detail?.name || "Startup",
              sector: detail?.sector || null,
              program_name: ls.program_name,
              status: ls.status || "active",
              started_at: ls.started_at,
              application_status: app?.status || null,
            };
          });

          setStartups(enriched);

          // Calculate stats
          const labeled = enriched.filter(
            (s) => s.application_status === "approved"
          ).length;
          const programs = structureData.programs;
          const activePrograms = Array.isArray(programs)
            ? programs.filter((p: any) => p.status === "active").length
            : 0;

          setStats({
            totalStartups: enriched.length,
            labeledStartups: labeled,
            activePrograms,
            successRate:
              enriched.length > 0
                ? Math.round((labeled / enriched.length) * 100)
                : 0,
          });
        } else {
          // Count active programs even if no startups
          const programs = structureData.programs;
          const activePrograms = Array.isArray(programs)
            ? programs.filter((p: any) => p.status === "active").length
            : 0;
          setStats({
            totalStartups: 0,
            labeledStartups: 0,
            activePrograms,
            successRate: 0,
          });
        }
      } catch (error) {
        console.error("Error fetching structure data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const updateStructure = async (data: Partial<StructureData>) => {
    if (!structure || !supabase) return;
    const { error } = await supabase
      .from("structures")
      .update(data as any)
      .eq("id", structure.id);
    if (!error) {
      setStructure((prev) => (prev ? { ...prev, ...data } : null));
    }
    return { error };
  };

  return { structure, startups, stats, isLoading, updateStructure };
}
