import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface PerplexityNewsItem {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  sourceUrl?: string;
  isLive?: boolean;
}

interface UsePerplexityNewsOptions {
  searchQuery: string;
  category: string;
  enabled?: boolean;
  debounceMs?: number;
}

interface UsePerplexityNewsResult {
  news: PerplexityNewsItem[];
  isLoading: boolean;
  isLive: boolean;
  error: string | null;
  lastUpdated: string | null;
  refetch: () => Promise<void>;
}

export const usePerplexityNews = ({
  searchQuery,
  category,
  enabled = true,
  debounceMs = 500
}: UsePerplexityNewsOptions): UsePerplexityNewsResult => {
  const [news, setNews] = useState<PerplexityNewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLive, setIsLive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  const cacheRef = useRef<Map<string, { news: PerplexityNewsItem[]; timestamp: number }>>(new Map());
  const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  const fetchNews = useCallback(async (query: string) => {
    if (!supabase) {
      setError("Backend non disponible");
      setIsLive(false);
      return;
    }

    const cacheKey = `${query}-${category}`;
    const cached = cacheRef.current.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      setNews(cached.news);
      setIsLive(true);
      setLastUpdated(new Date(cached.timestamp).toLocaleTimeString('fr-FR'));
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const searchTerm = query.trim() 
        ? `${query} startups Côte d'Ivoire`
        : "startups technologiques Côte d'Ivoire actualités récentes";

      const { data, error: fnError } = await supabase.functions.invoke('startup-news', {
        body: { 
          query: searchTerm,
          category: category !== "Toutes" ? category : null,
          limit: 12
        }
      });

      if (fnError) throw fnError;

      const newsWithLiveFlag = (data?.news || []).map((item: PerplexityNewsItem) => ({
        ...item,
        isLive: true
      }));

      setNews(newsWithLiveFlag);
      setIsLive(true);
      setLastUpdated(new Date().toLocaleTimeString('fr-FR'));
      
      cacheRef.current.set(cacheKey, {
        news: newsWithLiveFlag,
        timestamp: Date.now()
      });

    } catch (err: any) {
      console.error("Error fetching Perplexity news:", err);
      
      if (err?.message?.includes("429") || err?.status === 429) {
        toast({
          title: "Limite atteinte",
          description: "Trop de requêtes. Affichage des archives.",
          variant: "destructive"
        });
      }
      
      setError(err?.message || "Erreur lors de la récupération des actualités");
      setIsLive(false);
    } finally {
      setIsLoading(false);
    }
  }, [category]);

  const refetch = useCallback(async () => {
    const cacheKey = `${searchQuery}-${category}`;
    cacheRef.current.delete(cacheKey);
    await fetchNews(searchQuery);
  }, [fetchNews, searchQuery, category]);

  useEffect(() => {
    if (!enabled) return;

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      fetchNews(searchQuery);
    }, searchQuery ? debounceMs : 0);

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [searchQuery, enabled, debounceMs, fetchNews]);

  return {
    news,
    isLoading,
    isLive,
    error,
    lastUpdated,
    refetch
  };
};
