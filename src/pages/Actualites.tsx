import { useState, useMemo } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { PageBreadcrumb } from "@/components/shared/PageBreadcrumb";
import NewsHero from "@/components/news/NewsHero";
import NewsFiltersLive from "@/components/news/NewsFiltersLive";
import NewsGridLive from "@/components/news/NewsGridLive";
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
    refetch
  } = usePerplexityNews({
    searchQuery: searchTerm,
    category: selectedCategory,
    enabled: useRealtime
  });

  // Merge live news with mock data for fallback
  const displayNews = useMemo(() => {
    if (!useRealtime) {
      // Filter mock news by category and search
      return allNews.filter(item => {
        const matchesCategory = selectedCategory === "Toutes" || item.category === selectedCategory;
        const matchesSearch = !searchTerm || 
          item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
      }).map(item => ({ ...item, isLive: false }));
    }

    if (liveNews.length > 0) {
      // Filter live news by category (search is already done via API)
      const filteredLive = selectedCategory === "Toutes" 
        ? liveNews 
        : liveNews.filter(item => item.category === selectedCategory);
      
      return filteredLive;
    }

    // Fallback to mock data if no live news
    return allNews
      .filter(item => {
        const matchesCategory = selectedCategory === "Toutes" || item.category === selectedCategory;
        const matchesSearch = !searchTerm || 
          item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
      })
      .map(item => ({ ...item, isLive: false }));
  }, [useRealtime, liveNews, allNews, selectedCategory, searchTerm]);

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedCategory("Toutes");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <PageBreadcrumb className="py-3 bg-muted/30 border-b border-border" />
      <main id="main-content" className="flex-grow">
        <NewsHero />
        <div className={`transition-all duration-300 ${isMobile ? 'sticky top-16 z-10 bg-background shadow-md' : ''}`}>
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
          />
        </div>
        <NewsGridLive 
          news={displayNews} 
          isLoading={isLoading && useRealtime}
          onResetFilters={resetFilters} 
        />
      </main>
      <Footer />
    </div>
  );
};

export default Actualites;
