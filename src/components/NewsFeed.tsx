import { CalendarDays, ArrowRight, RefreshCw, Wifi, WifiOff, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";
import { useStartupNews } from "@/hooks/useStartupNews";
import { allNews } from "@/data/mockNews";

function formatDate(dateStr: string) {
  try {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  } catch {
    return dateStr;
  }
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
} as const;

const NewsFeed = () => {
  const { news, isLoading, error, lastUpdated, refetch } = useStartupNews();
  
  // Fallback to mock data if API fails or returns empty
  const displayNews = news.length > 0 ? news.slice(0, 3) : allNews.slice(0, 3);
  const isLive = news.length > 0;

  return (
    <section className="py-16 bg-muted/50" id="actualites">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <h2 className="text-3xl md:text-4xl font-bold">Actualités</h2>
            {isLive ? (
              <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                <Wifi className="w-3 h-3" />
                En direct
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-muted text-muted-foreground text-xs font-medium">
                <WifiOff className="w-3 h-3" />
                Hors ligne
              </span>
            )}
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {isLive 
              ? "Actualités en temps réel sur l'écosystème startup ivoirien, propulsées par l'IA."
              : "Restez informé des dernières nouvelles concernant le Label Startup et l'écosystème numérique ivoirien."
            }
          </p>
          {lastUpdated && (
            <p className="text-sm text-muted-foreground mt-2">
              Dernière mise à jour : {formatDate(lastUpdated.split('T')[0])} à {new Date(lastUpdated).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
            </p>
          )}
        </motion.div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="overflow-hidden">
                <div className="aspect-video w-full">
                  <Skeleton className="w-full h-full" />
                </div>
                <CardHeader>
                  <Skeleton className="h-4 w-32 mb-2" />
                  <Skeleton className="h-6 w-full" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >
            {displayNews.map((newsItem, index) => (
              <motion.div 
                key={newsItem.id || index}
                variants={itemVariants}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
                  {/* Show placeholder gradient for live news */}
                  <div className="aspect-video w-full overflow-hidden bg-gradient-to-br from-primary/20 via-secondary/20 to-primary/10 flex items-center justify-center">
                    {'imageUrl' in newsItem && newsItem.imageUrl ? (
                      <img 
                        src={newsItem.imageUrl as string} 
                        alt={newsItem.title} 
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      />
                    ) : (
                      <div className="text-primary/40 text-5xl font-bold">
                        {newsItem.category?.charAt(0) || 'A'}
                      </div>
                    )}
                  </div>
                  <CardHeader>
                    <div className="flex items-center text-sm text-muted-foreground mb-2">
                      <CalendarDays className="h-4 w-4 mr-1" />
                      <span>{formatDate(newsItem.date)}</span>
                      <span className="mx-2">•</span>
                      <span className="text-primary font-medium">{newsItem.category}</span>
                    </div>
                    <CardTitle className="text-xl line-clamp-2">{newsItem.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-muted-foreground line-clamp-3">{newsItem.excerpt}</p>
                  </CardContent>
                  <CardFooter>
                    {'sourceUrl' in newsItem && newsItem.sourceUrl ? (
                      <a 
                        href={newsItem.sourceUrl as string} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary font-medium hover:text-primary/80 inline-flex items-center"
                      >
                        Lire la source <ExternalLink className="h-4 w-4 ml-1" />
                      </a>
                    ) : (
                      <Button variant="link" asChild className="p-0 text-primary font-medium hover:text-primary/80">
                        <Link to="/actualites">
                          Lire la suite <ArrowRight className="h-4 w-4 ml-1" />
                        </Link>
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}

        {error && !isLoading && (
          <motion.div 
            className="text-center mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="text-sm text-muted-foreground mb-2">
              Affichage des actualités en cache
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => refetch()}
              className="gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Réessayer
            </Button>
          </motion.div>
        )}

        <motion.div 
          className="mt-10 text-center flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Button asChild className="bg-primary hover:bg-primary/90">
            <Link to="/actualites">
              Voir toutes les actualités <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </Button>
          {isLive && (
            <Button 
              variant="outline" 
              onClick={() => refetch()} 
              disabled={isLoading}
              className="gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              Actualiser
            </Button>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default NewsFeed;
