
import { useParams } from "react-router-dom";
import { allNews } from "@/data/mockNews";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CalendarDays } from "lucide-react";
import { SEOHead } from "@/components/shared/SEOHead";
import { PageBreadcrumb } from "@/components/shared/PageBreadcrumb";
import { articleJsonLd } from "@/lib/seo/jsonld";

const ActualiteDetail = () => {
  const { id } = useParams();
  const news = allNews.find(item => item.id === id);

  if (!news) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold">Article non trouvé</h1>
        </main>
        <Footer />
      </div>
    );
  }

  const formattedDate = new Date(news.date).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const jsonLd = articleJsonLd({
    title: news.title,
    description: news.excerpt,
    image: news.imageUrl,
    datePublished: news.date,
    url: `https://startup-label-ivoire-hub.lovable.app/actualites/${news.id}`,
  });

  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead
        title={news.title}
        description={news.excerpt}
        path={`/actualites/${news.id}`}
        ogImage={news.imageUrl}
        ogType="article"
        jsonLd={jsonLd}
      />
      <Navbar />
      <main id="main-content" className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          <PageBreadcrumb
            currentLabel={news.title}
            parents={[{ label: "Actualités", href: "/actualites" }]}
          />
          <article className="max-w-3xl mx-auto">
            {news.imageUrl && (
              <div className="rounded-xl overflow-hidden mb-8 aspect-video">
                <img 
                  src={news.imageUrl} 
                  alt={news.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center text-sm text-gray-500">
                <CalendarDays className="h-4 w-4 mr-1" />
                <span>{formattedDate}</span>
                <span className="mx-2">•</span>
                <span className="text-ivoire-orange">{news.category}</span>
              </div>
              
              <h1 className="text-4xl font-bold">{news.title}</h1>
              <p className="text-xl text-gray-600 leading-relaxed">{news.excerpt}</p>
            </div>
          </article>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ActualiteDetail;
