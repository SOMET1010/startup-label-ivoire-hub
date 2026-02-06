import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CTA from "@/components/CTA";
import { PageBreadcrumb } from "@/components/shared/PageBreadcrumb";
import { Link } from "react-router-dom";
import { useBrand } from "@/hooks/useBrand";
import { InstitutionalHero, InstitutionalCard, OfficialBadge } from "@/components/gov";
import { useTranslation } from "react-i18next";

const Avantages = () => {
  const { brand } = useBrand();
  const isInstitutional = brand === 'ansut';
  const { t } = useTranslation('pages');

  // Section configuration
  const sections = [
    { 
      key: 'fiscal', 
      itemKeys: ['taxExemption', 'patentExemption', 'salaryTax'],
      color: 'ivoire-orange',
      govColor: 'gov-blue',
      variant: 'primary' as const,
      badgeVariant: 'certifie' as const,
    },
    { 
      key: 'publicMarkets', 
      itemKeys: ['reserved', 'preference', 'guarantees'],
      color: 'ivoire-green',
      govColor: 'gov-green',
      variant: 'success' as const,
      badgeVariant: 'officiel' as const,
    },
    { 
      key: 'funding', 
      itemKeys: ['priority', 'investors', 'mentoring'],
      color: 'startup-DEFAULT',
      govColor: 'gov-blue',
      variant: 'primary' as const,
    },
    { 
      key: 'visibility', 
      itemKeys: ['directory', 'events', 'community'],
      color: 'investor-DEFAULT',
      govColor: 'gov-green',
      variant: 'success' as const,
    },
  ];

  const renderBenefitList = (
    items: { title: string; description: string }[],
    color: string,
    isInstitutional: boolean
  ) => (
    <ul className="space-y-4">
      {items.map((item, index) => (
        <li key={index} className="flex items-start">
          <div className={`flex-shrink-0 h-6 w-6 rounded-full flex items-center justify-center mr-3 mt-1 ${
            isInstitutional ? 'bg-gov-blue' : `bg-${color}`
          }`}>
            <span className="text-white font-bold text-xs">{index + 1}</span>
          </div>
          <div>
            <h3 className="font-bold">{item.title}</h3>
            <p className="text-muted-foreground">{item.description}</p>
          </div>
        </li>
      ))}
    </ul>
  );

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
              <h1 className="text-4xl font-bold mb-4">{t('benefits.hero.title')}</h1>
              <p className="text-xl text-white/80">
                {t('benefits.hero.subtitle')}
              </p>
            </div>
          </InstitutionalHero>
        ) : (
          <section className="bg-muted/50 py-12">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto text-center">
                <h1 className="text-4xl font-bold mb-4">{t('benefits.hero.title')}</h1>
                <p className="text-xl text-muted-foreground">
                  {t('benefits.hero.subtitle')}
                </p>
              </div>
            </div>
          </section>
        )}

        {/* Main content */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto space-y-12">
              {sections.map((section) => {
                const items = section.itemKeys.map(itemKey => ({
                  title: t(`benefits.sections.${section.key}.items.${itemKey}.title`),
                  description: t(`benefits.sections.${section.key}.items.${itemKey}.description`),
                }));

                const titleColorClass = isInstitutional 
                  ? `text-${section.govColor}` 
                  : `text-${section.color}`;

                return (
                  <div key={section.key}>
                    <h2 className={`text-2xl font-bold mb-6 ${titleColorClass}`}>
                      {t(`benefits.sections.${section.key}.title`)}
                    </h2>
                    {isInstitutional ? (
                      <InstitutionalCard 
                        variant={section.variant} 
                        showBadge={!!section.badgeVariant} 
                        badgeVariant={section.badgeVariant}
                      >
                        {renderBenefitList(items, section.color, isInstitutional)}
                      </InstitutionalCard>
                    ) : (
                      <div className="bg-card rounded-xl shadow-sm p-8">
                        {renderBenefitList(items, section.color, isInstitutional)}
                      </div>
                    )}
                  </div>
                );
              })}

              <div className="text-center mt-12">
                <p className="text-xl mb-4">{t('benefits.cta.title')}</p>
                <Link to="/postuler" className={`inline-block px-6 py-3 text-white font-bold rounded-lg hover:opacity-90 transition-opacity ${
                  isInstitutional ? 'bg-gov-blue' : 'bg-ivoire-orange'
                }`}>
                  {t('benefits.cta.button')}
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

export default Avantages;
