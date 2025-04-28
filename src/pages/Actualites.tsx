
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NewsHero from "@/components/news/NewsHero";
import NewsFilters from "@/components/news/NewsFilters";
import NewsGrid from "@/components/news/NewsGrid";
import { allNews, categories } from "@/data/mockNews";
import { useNewsFilter } from "@/hooks/useNewsFilter";

const Actualites = () => {
  const {
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    filteredNews,
    resetFilters
  } = useNewsFilter(allNews);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <NewsHero />
        <NewsFilters 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          categories={categories}
        />
        <NewsGrid news={filteredNews} onResetFilters={resetFilters} />
      </main>
      <Footer />
    </div>
  );
};

export default Actualites;
