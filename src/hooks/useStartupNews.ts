import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  sourceUrl?: string;
}

interface UseStartupNewsResult {
  news: NewsItem[];
  isLoading: boolean;
  error: string | null;
  lastUpdated: string | null;
  refetch: () => Promise<void>;
}

export const useStartupNews = (query?: string): UseStartupNewsResult => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  const fetchNews = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke("startup-news", {
        body: { query: query || "startups numériques Côte d'Ivoire Label Startup actualités récentes" }
      });

      if (fnError) {
        throw fnError;
      }

      if (data.error) {
        throw new Error(data.error);
      }

      setNews(data.news || []);
      setLastUpdated(data.lastUpdated);
    } catch (err) {
      console.error("Error fetching startup news:", err);
      const errorMessage = err instanceof Error ? err.message : "Erreur lors du chargement des actualités";
      setError(errorMessage);
      
      if (errorMessage.includes("429") || errorMessage.includes("Limite")) {
        toast.error("Limite de requêtes atteinte. Réessayez dans quelques instants.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [query]);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  return { news, isLoading, error, lastUpdated, refetch: fetchNews };
};
