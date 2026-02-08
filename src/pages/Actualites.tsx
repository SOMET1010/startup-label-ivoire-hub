import { useState, useMemo } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { PageBreadcrumb } from "@/components/shared/PageBreadcrumb";
import { SEOHead } from "@/components/shared/SEOHead";
import NewsHeroCarousel from "@/components/news/NewsHeroCarousel";
import NewsFiltersLive from "@/components/news/NewsFiltersLive";
import NewsGridLive from "@/components/news/NewsGridLive";
import NewsletterBanner from "@/components/news/NewsletterBanner";
import { allNews, categories } from "@/data/mockNews";
import { usePerplexityNews } from "@/hooks/usePerplexityNews";
import { useIsMobile } from "@/hooks/use-mobile";

const Actualites = () => {
  const isMobile = useIsMobile();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Toutes");
  const [useRealtime, setUseRealtime] = useState(true);

  const {
    news: liveNews,
    isLoading,
    isLive,
    lastUpdated,
    refetch,
  } = usePerplexityNews({
    searchQuery: searchTerm,
    category: selectedCategory,
    enabled: useRealtime,
  });

  // Merge live news with mock data for fallback
  const displayNews = useMemo(() => {
    if (!useRealtime) {
      return allNews
        .filter((item) => {
          const matchesCategory =
            selectedCategory === "Toutes" || item.category === selectedCategory;
          const matchesSearch =
            !searchTerm ||
            item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
          return matchesCategory && matchesSearch;
        })
        .map((item) => ({ ...item, isLive: false }));
    }

    if (liveNews.length > 0) {
      const filteredLive =
        selectedCategory === "Toutes"
          ? liveNews
          : liveNews.filter((item) => item.category === selectedCategory);
      return filteredLive;
    }

    return allNews
      .filter((item) => {
        const matchesCategory =
          selectedCategory === "Toutes" || item.category === selectedCategory;
        const matchesSearch =
          !searchTerm ||
          item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
      })
      .map((item) => ({ ...item, isLive: false }));
  }, [useRealtime, liveNews, allNews, selectedCategory, searchTerm]);

  // Category counts for pill badges
  const categoryCounts = useMemo(() => {
    const sourceData = useRealtime && liveNews.length > 0 ? liveNews : allNews;
    const counts: Record<string, number> = { Toutes: sourceData.length };
    sourceData.forEach((item) => {
      counts[item.category] = (counts[item.category] || 0) + 1;
    });
    return counts;
  }, [useRealtime, liveNews, allNews]);

  // Hero items: first 3 from source data (unfiltered)
  const heroItems = useMemo(() => {
    const source = useRealtime && liveNews.length > 0 ? liveNews : allNews;
    return source.slice(0, 3);
  }, [useRealtime, liveNews, allNews]);

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedCategory("Toutes");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead
        title="Actualités"
        description="Toutes les actualités de l'écosystème startup et innovation numérique en Côte d'Ivoire."
        path="/actualites"
      />
      <Navbar />
      <PageBreadcrumb className="py-3 bg-muted/30 border-b border-border" />
      <main id="main-content" className="flex-grow">
        <NewsHeroCarousel news={heroItems} />
        <div
          className={`transition-all duration-300 ${
            isMobile ? "sticky top-16 z-10 bg-background shadow-md" : ""
          }`}
        >
          <NewsFiltersLive
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            categories={categories}
            isLive={isLive && useRealtime}
            isLoading={isLoading}
            useRealtime={useRealtime}
            setUseRealtime={setUseRealtime}
            onRefresh={refetch}
            lastUpdated={lastUpdated}
            categoryCounts={categoryCounts}
          />
        </div>
        <NewsGridLive
          news={displayNews}
          isLoading={isLoading && useRealtime}
          onResetFilters={resetFilters}
        />
        <NewsletterBanner />
      </main>
      <Footer />
    </div>
  );
};

export default Actualites;
