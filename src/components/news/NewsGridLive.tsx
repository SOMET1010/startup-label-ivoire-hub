import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { RefreshCw } from "lucide-react";
import NewsCardLive from "./NewsCardLive";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useState } from "react";
import { EmptyState } from "@/components/shared/EmptyState";

interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  sourceUrl?: string;
  isLive?: boolean;
  image?: string;
}

interface NewsGridLiveProps {
  news: NewsItem[];
  isLoading: boolean;
  onResetFilters: () => void;
}

const ITEMS_PER_PAGE = 6;

const NewsGridLive = ({ news, isLoading, onResetFilters }: NewsGridLiveProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  
  const totalPages = Math.ceil(news.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentNews = news.slice(startIndex, endIndex);

  // Loading Skeletons
  if (isLoading) {
    return (
      <section className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="h-48 w-full rounded-lg" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  // No Results
  if (news.length === 0) {
    return (
      <section className="container mx-auto px-4 py-16">
        <EmptyState
          illustration="search"
          title="Aucun résultat trouvé"
          description="Nous n'avons pas trouvé d'actualités correspondant à votre recherche. Essayez d'autres termes ou réinitialisez les filtres."
          action={{
            label: "Réinitialiser les filtres",
            icon: RefreshCw,
            onClick: onResetFilters
          }}
        />
      </section>
    );
  }

  return (
    <section className="container mx-auto px-4 py-8">
      {/* News Grid */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
          }
        }}
      >
        {currentNews.map((item, index) => (
          <NewsCardLive key={item.id} news={item} index={index} />
        ))}
      </motion.div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-10">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
              
              {[...Array(totalPages)].map((_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink
                    onClick={() => setCurrentPage(i + 1)}
                    isActive={currentPage === i + 1}
                    className="cursor-pointer"
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              
              <PaginationItem>
                <PaginationNext
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {/* Results Count */}
      <p className="text-center text-sm text-muted-foreground mt-4">
        Affichage de {startIndex + 1}-{Math.min(endIndex, news.length)} sur {news.length} actualités
      </p>
    </section>
  );
};

export default NewsGridLive;
