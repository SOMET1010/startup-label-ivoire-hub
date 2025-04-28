
import { Button } from "@/components/ui/button";
import { type NewsItem } from "@/types/news";
import NewsCard from "./NewsCard";

interface NewsGridProps {
  news: NewsItem[];
  onResetFilters: () => void;
}

const NewsGrid = ({ news, onResetFilters }: NewsGridProps) => {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        {news.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {news.map((item) => (
              <NewsCard key={item.id} news={item} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <h3 className="text-xl font-medium text-gray-600">Aucune actualité trouvée</h3>
            <p className="mt-2 text-gray-500">Essayez de modifier vos critères de recherche</p>
            <Button 
              className="mt-4 bg-ivoire-orange hover:bg-ivoire-orange/90"
              onClick={onResetFilters}
            >
              Réinitialiser les filtres
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default NewsGrid;
