import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CTA from "@/components/CTA";
import { PageBreadcrumb } from "@/components/shared/PageBreadcrumb";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ClipboardCheck, ArrowRight } from "lucide-react";
import { useBrand } from "@/hooks/useBrand";
import { InstitutionalHero, InstitutionalCard, OfficialBadge } from "@/components/gov";
import { useTranslation } from "react-i18next";

const Criteres = () => {
  const { brand } = useBrand();
  const isInstitutional = brand === 'ansut';
  const { t } = useTranslation('pages');

  // Criteria keys for iteration
  const criteriaKeys = ['legal', 'age', 'innovative', 'scalable', 'ownership', 'jobs'] as const;
  
  const criteria = criteriaKeys.map((key, index) => ({
    title: t(`criteria.items.${key}.title`),
    description: t(`criteria.items.${key}.description`),
    variant: (index % 2 === 0 ? 'primary' : 'success') as 'primary' | 'success',
  }));

  // Get documents array from translations
  const documents = t('criteria.documents.items', { returnObjects: true }) as string[];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <PageBreadcrumb className="py-3 bg-muted/30 border-b border-border" />
      <main id="main-content" className="flex-grow">
        {/* Hero section */}
        {isInstitutional ? (
          <InstitutionalHero>
            <div className="max-w-3xl mx-auto text-center">
              <OfficialBadge variant="officiel" className="mb-4 inline-flex" />
              <h1 className="text-4xl font-bold mb-4">{t('criteria.hero.title')}</h1>
              <p className="text-xl text-white/80">
                {t('criteria.hero.subtitle')}
              </p>
            </div>
          </InstitutionalHero>
        ) : (
          <section className="bg-muted/50 py-12">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto text-center">
                <h1 className="text-4xl font-bold mb-4">{t('criteria.hero.title')}</h1>
                <p className="text-xl text-muted-foreground">
                  {t('criteria.hero.subtitle')}
                </p>
              </div>
            </div>
          </section>
        )}

        {/* Quiz CTA */}
        <section className={`py-8 border-y ${isInstitutional ? 'bg-gov-blue/5 border-gov-blue/10' : 'bg-primary/5 border-primary/10'}`}>
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isInstitutional ? 'bg-gov-blue/10' : 'bg-primary/10'}`}>
                  <ClipboardCheck className={`w-6 h-6 ${isInstitutional ? 'text-gov-blue' : 'text-primary'}`} />
                </div>
                <div>
                  <h2 className="font-semibold text-lg">{t('criteria.quiz.title')}</h2>
                  <p className="text-muted-foreground text-sm">
                    {t('criteria.quiz.subtitle')}
                  </p>
                </div>
              </div>
              <Link to="/eligibilite">
                <Button size="lg" className="gap-2 whitespace-nowrap">
                  {t('criteria.quiz.button')}
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Main content */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              {isInstitutional ? (
                <InstitutionalCard variant="primary" className="mb-8">
                  <h2 className="text-2xl font-bold mb-6 text-gov-blue">
                    {t('criteria.sectionTitle')}
                  </h2>
                  <div className="space-y-4">
                    {criteria.map((criterion, index) => (
                      <InstitutionalCard key={index} variant={criterion.variant} className="py-4">
                        <h3 className="font-bold text-lg mb-2">{criterion.title}</h3>
                        <p className="text-muted-foreground">{criterion.description}</p>
                      </InstitutionalCard>
                    ))}
                  </div>
                </InstitutionalCard>
              ) : (
                <div className="bg-card rounded-xl shadow-sm p-8">
                  <h2 className="text-2xl font-bold mb-6 text-ivoire-orange">{t('criteria.sectionTitle')}</h2>
                  <div className="space-y-6">
                    {criteria.map((criterion, index) => (
                      <div 
                        key={index} 
                        className={`border-l-4 pl-4 py-2 ${criterion.variant === 'primary' ? 'border-ivoire-orange' : 'border-ivoire-green'}`}
                      >
                        <h3 className="font-bold text-lg mb-2">{criterion.title}</h3>
                        <p className="text-muted-foreground">{criterion.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Documents requis */}
              {isInstitutional ? (
                <InstitutionalCard variant="success" showBadge badgeVariant="certifie" className="mt-8">
                  <h3 className="font-bold text-lg mb-4">{t('criteria.documents.title')}</h3>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    {documents.map((doc, index) => (
                      <li key={index}>{doc}</li>
                    ))}
                  </ul>
                </InstitutionalCard>
              ) : (
                <div className="mt-8 p-4 bg-muted/50 rounded-lg">
                  <h3 className="font-bold text-lg mb-2">{t('criteria.documents.title')}</h3>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    {documents.map((doc, index) => (
                      <li key={index}>{doc}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/eligibilite">
                  <Button variant="outline" size="lg" className="gap-2 w-full sm:w-auto">
                    <ClipboardCheck className="w-4 h-4" />
                    {t('criteria.buttons.checkEligibility')}
                  </Button>
                </Link>
                <Link to="/postuler">
                  <Button size="lg" className="w-full sm:w-auto">
                    {t('criteria.buttons.apply')}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
        
        <CTA />
      </main>
      <Footer />
    </div>
  );
};

export default Criteres;
