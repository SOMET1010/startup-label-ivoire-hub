import { Link } from "react-router-dom";
import { ExternalLink, Facebook, Twitter, Linkedin } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useBrand } from "@/hooks/useBrand";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { brand } = useBrand();
  const isInstitutional = brand === "ansut";
  const { t } = useTranslation('common');

  return (
    <footer className={isInstitutional ? "footer-institutional text-white" : "bg-gray-900 text-white"}>
      {/* Institutional header band */}
      {isInstitutional && (
        <div className="bg-primary py-4">
          <div className="container mx-auto px-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img 
                src="/images/armoiries-ci.svg" 
                alt="Armoiries de la Côte d'Ivoire" 
                className="h-10 w-auto"
              />
              <div>
                <p className="font-semibold text-white">République de Côte d'Ivoire</p>
                <p className="text-sm text-white/80">Union - Discipline - Travail</p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-4">
              <a 
                href="https://www.gouv.ci" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm text-white/90 hover:text-white transition-colors"
              >
                Portail du Gouvernement
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
              <a 
                href="https://www.cicg.gouv.ci" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm text-white/90 hover:text-white transition-colors"
              >
                CICG
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              {isInstitutional ? (
                <>
                  <div className="w-8 h-8 bg-gradient-to-r from-primary to-accent rounded-lg"></div>
                  <span className="text-xl font-semibold">ANSUT</span>
                </>
              ) : (
                <>
                  <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg"></div>
                  <span className="text-xl font-heading font-bold">Ivoire Hub</span>
                </>
              )}
            </div>
            <p className="text-gray-300 mt-2">
              {isInstitutional 
                ? "Agence Nationale du Service Universel des Télécommunications. Service public de labellisation des startups numériques."
                : t('footer.description')
              }
            </p>
            <div className="flex mt-4 space-x-4">
              <a 
                href="https://facebook.com" 
                className="text-gray-300 hover:text-white transition-colors"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a 
                href="https://twitter.com" 
                className="text-gray-300 hover:text-white transition-colors"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a 
                href="https://linkedin.com" 
                className="text-gray-300 hover:text-white transition-colors"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">{t('footer.quickLinks')}</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white transition-colors">
                  {t('nav.home')}
                </Link>
              </li>
              <li>
                <Link to="/postuler" className="text-gray-300 hover:text-white transition-colors">
                  {t('nav.apply')}
                </Link>
              </li>
              <li>
                <Link to="/annuaire" className="text-gray-300 hover:text-white transition-colors">
                  {t('nav.directory')}
                </Link>
              </li>
              <li>
                <Link to="/accompagnement" className="text-gray-300 hover:text-white transition-colors">
                  {t('nav.support')}
                </Link>
              </li>
              <li>
                <Link to="/investisseurs" className="text-gray-300 hover:text-white transition-colors">
                  Investisseurs
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">{t('footer.information')}</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/faq" className="text-gray-300 hover:text-white transition-colors">
                  {t('footer.faq')}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-white transition-colors">
                  {t('footer.contact')}
                </Link>
              </li>
              <li>
                <Link to="/mentions-legales" className="text-gray-300 hover:text-white transition-colors">
                  {t('footer.legal')}
                </Link>
              </li>
              <li>
                <Link to="/confidentialite" className="text-gray-300 hover:text-white transition-colors">
                  {t('footer.privacy')}
                </Link>
              </li>
              {isInstitutional && (
                <li>
                  <Link to="/accessibilite" className="text-gray-300 hover:text-white transition-colors">
                    Accessibilité
                  </Link>
                </li>
              )}
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">{t('footer.contactUs')}</h3>
            <address className="not-italic text-gray-300">
              {isInstitutional ? (
                <>
                  <p>Agence Nationale du Service Universel des Télécommunications (ANSUT)</p>
                  <p>Abidjan - Plateau</p>
                  <p>Côte d'Ivoire</p>
                </>
              ) : (
                <>
                  <p>Ministère de la Communication et de l'Économie Numérique</p>
                  <p>{t('footer.address')}</p>
                </>
              )}
              <p className="mt-2">
                <a href="tel:+22520216300" className="hover:text-white transition-colors">
                  {t('footer.phone')}
                </a>
              </p>
              <p>
                <a href={`mailto:${isInstitutional ? 'contact@ansut.ci' : 'contact@ivoirehub.ci'}`} className="hover:text-white transition-colors">
                  {isInstitutional ? 'contact@ansut.ci' : t('footer.email')}
                </a>
              </p>
            </address>
          </div>
        </div>
        
        <div className={`${isInstitutional ? 'footer-institutional-divider' : 'border-t border-gray-800'} mt-8 pt-8 flex flex-col md:flex-row justify-between items-center`}>
          <p>© {currentYear} {isInstitutional ? 'ANSUT - République de Côte d\'Ivoire' : 'Ivoire Hub'}. {t('footer.rights')}.</p>
          <p className="mt-4 md:mt-0">
            {isInstitutional ? (
              <span className="text-gray-400 text-sm">
                Site officiel du Gouvernement de Côte d'Ivoire
              </span>
            ) : (
              <>
                Développé par{" "}
                <a 
                  href="https://etudesk.org" 
                  className="text-accent hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Etudesk
                </a>
              </>
            )}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
