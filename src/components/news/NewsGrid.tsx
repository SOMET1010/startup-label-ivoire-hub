
import { Button } from "@/components/ui/button";
import { type NewsItem } from "@/types/news";
import NewsCard from "./NewsCard";
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";
import { useState } from "react";

interface NewsGridProps {
  news: NewsItem[];
  onResetFilters: () => void;
}

const ITEMS_PER_PAGE = 6;

const NewsGrid = ({ news, onResetFilters }: NewsGridProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(news.length / ITEMS_PER_PAGE);
  
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentNews = news.slice(startIndex, endIndex);

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        {news.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in">
              {currentNews.map((item) => (
                <div key={item.id} className="animate-slide-in">
                  <NewsCard news={item} />
                </div>
              ))}
            </div>
            
            {totalPages > 1 && (
              <div className="mt-8">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                    
                    {Array.from({ length: totalPages }).map((_, index) => (
                      <PaginationItem key={index}>
                        <PaginationLink
                          isActive={currentPage === index + 1}
                          onClick={() => setCurrentPage(index + 1)}
                        >
                          {index + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    
                    <PaginationItem>
                      <PaginationNext 
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
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
