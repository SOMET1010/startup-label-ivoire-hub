import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface PlatformSettings {
  ministry_name: string;
  ministry_acronym: string;
  minister_title: string;
  ministry_address: string;
  ministry_phone: string;
  ministry_email: string;
  ministry_website: string;
  platform_name: string;
  platform_email: string;
  [key: string]: string;
}

const DEFAULTS: PlatformSettings = {
  ministry_name: "Ministère de la Transition Numérique et de l'Innovation Technologique",
  ministry_acronym: "MTNI",
  minister_title: "Ministre de la Transition Numérique et de l'Innovation Technologique",
  ministry_address: "Abidjan, Plateau, Côte d'Ivoire",
  ministry_phone: "+225 27 22 XX XX XX",
  ministry_email: "contact@mtni.gouv.ci",
  ministry_website: "https://www.mtni.gouv.ci",
  platform_name: "Ivoire Hub",
  platform_email: "contact@ivoirehub.ci",
};

async function fetchSettings(): Promise<PlatformSettings> {
  const { data, error } = await supabase
    .from("platform_settings")
    .select("key, value");

  if (error) {
    console.error("Failed to load platform settings:", error);
    return DEFAULTS;
  }

  const settings = { ...DEFAULTS };
  data?.forEach((row: { key: string; value: string }) => {
    settings[row.key] = row.value;
  });
  return settings;
}

export function usePlatformSettings() {
  const { data: settings = DEFAULTS, isLoading } = useQuery({
    queryKey: ["platform-settings"],
    queryFn: fetchSettings,
    staleTime: 1000 * 60 * 30, // 30 min cache
    gcTime: 1000 * 60 * 60, // 1h garbage collection
  });

  return { settings, isLoading };
}
