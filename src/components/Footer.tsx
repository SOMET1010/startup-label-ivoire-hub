
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-ivoire-orange to-ivoire-green rounded-lg"></div>
              <span className="text-xl font-heading font-bold">Ivoire Hub</span>
            </div>
            <p className="text-gray-300 mt-2">
              Plateforme officielle de labellisation et d'accompagnement des startups numériques en Côte d'Ivoire.
            </p>
            <div className="flex mt-4 space-x-4">
              <a 
                href="https://facebook.com" 
                className="text-gray-300 hover:text-white transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                Facebook
              </a>
              <a 
                href="https://twitter.com" 
                className="text-gray-300 hover:text-white transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                Twitter
              </a>
              <a 
                href="https://linkedin.com" 
                className="text-gray-300 hover:text-white transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                LinkedIn
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Liens rapides</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white transition-colors">
                  Accueil
                </Link>
              </li>
              <li>
                <Link to="/postuler" className="text-gray-300 hover:text-white transition-colors">
                  Postuler au label
                </Link>
              </li>
              <li>
                <Link to="/annuaire" className="text-gray-300 hover:text-white transition-colors">
                  Annuaire des startups
                </Link>
              </li>
              <li>
                <Link to="/accompagnement" className="text-gray-300 hover:text-white transition-colors">
                  Structures d'accompagnement
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
            <h3 className="text-lg font-bold mb-4">Informations</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/faq" className="text-gray-300 hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/mentions-legales" className="text-gray-300 hover:text-white transition-colors">
                  Mentions légales
                </Link>
              </li>
              <li>
                <Link to="/confidentialite" className="text-gray-300 hover:text-white transition-colors">
                  Politique de confidentialité
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Contact</h3>
            <address className="not-italic text-gray-300">
              <p>Ministère de la Communication et de l'Économie Numérique</p>
              <p>Abidjan, Côte d'Ivoire</p>
              <p className="mt-2">
                <a href="tel:+22520216300" className="hover:text-white transition-colors">
                  +225 20 21 63 00
                </a>
              </p>
              <p>
                <a href="mailto:contact@ivoirehub.ci" className="hover:text-white transition-colors">
                  contact@ivoirehub.ci
                </a>
              </p>
            </address>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p>© {currentYear} Ivoire Hub. Tous droits réservés.</p>
          <p className="mt-4 md:mt-0">
            Développé par{" "}
            <a 
              href="https://etudesk.org" 
              className="text-ivoire-orange hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Etudesk
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
