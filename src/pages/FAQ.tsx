import { useState, useMemo } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { PageBreadcrumb } from "@/components/shared/PageBreadcrumb";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTranslation } from "react-i18next";

const FAQ = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const isMobile = useIsMobile();
  const { t } = useTranslation('pages');

  // Category keys for iteration
  const categoryKeys = ['label', 'eligibility', 'process', 'benefits', 'support'] as const;
  
  // Question keys per category
  const questionKeysMap: Record<string, string[]> = {
    label: ['what', 'duration', 'verify'],
    eligibility: ['criteria', 'foreigners', 'sectors'],
    process: ['apply', 'timeline', 'rejection'],
    benefits: ['fiscal', 'markets', 'funding'],
    support: ['mentoring', 'community', 'renewal'],
  };

  // Build FAQ categories from translations
  const faqCategories = useMemo(() => {
    return categoryKeys.map(catKey => ({
      key: catKey,
      category: t(`faq.categories.${catKey}.name`),
      questions: questionKeysMap[catKey].map(qKey => ({
        question: t(`faq.categories.${catKey}.questions.${qKey}.question`),
        answer: t(`faq.categories.${catKey}.questions.${qKey}.answer`),
      })),
    }));
  }, [t]);

  // Filter FAQs based on search term
  const filteredFaqs = useMemo(() => {
    if (!searchTerm.trim()) return faqCategories;
    
    const searchLower = searchTerm.toLowerCase();
    return faqCategories.map(category => ({
      ...category,
      questions: category.questions.filter(
        q => q.question.toLowerCase().includes(searchLower) || 
             q.answer.toLowerCase().includes(searchLower)
      )
    })).filter(category => category.questions.length > 0);
  }, [faqCategories, searchTerm]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <PageBreadcrumb className="py-3 bg-muted/30 border-b border-border" />
      <main id="main-content" className="flex-grow">
        <div className="bg-gradient-to-r from-ivoire-orange to-ivoire-green py-16 text-white">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{t('faq.hero.title')}</h1>
            <p className="text-xl opacity-90 max-w-3xl mx-auto">
              {t('faq.hero.subtitle')}
            </p>
            <div className="relative max-w-xl mx-auto mt-8">
              <Input
                type="text"
                placeholder={t('faq.hero.searchPlaceholder')}
                className="pl-10 py-6 bg-white/10 border-white/20 text-white placeholder:text-white/70"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-3 text-white/70" />
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          {filteredFaqs.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium text-foreground">{t('faq.noResults.title')}</h3>
              <p className="text-muted-foreground mt-2">{t('faq.noResults.subtitle')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1">
                <Card className={`sticky ${isMobile ? "" : "top-10"} p-4 bg-muted/50`}>
                  <h2 className="text-xl font-bold mb-4">{t('faq.sidebar.title')}</h2>
                  <nav>
                    <ul className="space-y-2">
                      {filteredFaqs.map((category, i) => (
                        <li key={i}>
                          <a 
                            href={`#${category.key}`}
                            className="block p-2 hover:bg-accent rounded-md transition-colors text-ivoire-green"
                          >
                            {category.category} ({category.questions.length})
                          </a>
                        </li>
                      ))}
                    </ul>
                  </nav>
                </Card>
              </div>
              
              <div className="lg:col-span-2">
                {filteredFaqs.map((category, i) => (
                  <div key={i} className="mb-12" id={category.key}>
                    <h2 className="text-2xl font-bold mb-6 pb-2 border-b">{category.category}</h2>
                    <Accordion type="single" collapsible className="space-y-4">
                      {category.questions.map((item, j) => (
                        <AccordionItem key={j} value={`item-${i}-${j}`} className="bg-card rounded-lg shadow-sm">
                          <AccordionTrigger className="px-4 py-4 hover:bg-accent font-medium">
                            {item.question}
                          </AccordionTrigger>
                          <AccordionContent className="px-4 py-2 text-muted-foreground">
                            {item.answer}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default FAQ;
