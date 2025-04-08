
import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-2">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-ivoire-orange to-ivoire-green rounded-lg"></div>
              <span className="text-xl font-heading font-bold">Ivoire Hub</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-primary transition-colors font-medium">
              Accueil
            </Link>
            <div className="relative group">
              <button className="flex items-center text-gray-700 hover:text-primary transition-colors font-medium">
                Labellisation <ChevronDown className="ml-1 h-4 w-4" />
              </button>
              <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                <Link to="/criteres" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Critères d'éligibilité
                </Link>
                <Link to="/avantages" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Avantages
                </Link>
                <Link to="/postuler" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Postuler
                </Link>
              </div>
            </div>
            <Link to="/annuaire" className="text-gray-700 hover:text-primary transition-colors font-medium">
              Annuaire
            </Link>
            <Link to="/accompagnement" className="text-gray-700 hover:text-primary transition-colors font-medium">
              Structures d'accompagnement
            </Link>
            <Link to="/investisseurs" className="text-gray-700 hover:text-primary transition-colors font-medium">
              Investisseurs
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-2">
            <Link to="/connexion">
              <Button variant="outline">Connexion</Button>
            </Link>
            <Link to="/inscription">
              <Button>Inscription</Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-700 focus:outline-none"
            onClick={toggleMenu}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4">
            <div className="flex flex-col space-y-4">
              <Link
                to="/"
                className="text-gray-700 hover:text-primary transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Accueil
              </Link>
              <details className="group">
                <summary className="flex cursor-pointer list-none items-center justify-between text-gray-700 hover:text-primary transition-colors font-medium">
                  Labellisation
                  <ChevronDown className="h-4 w-4" />
                </summary>
                <div className="mt-2 ml-4 flex flex-col space-y-2">
                  <Link 
                    to="/criteres" 
                    className="text-gray-700 hover:text-primary transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Critères d'éligibilité
                  </Link>
                  <Link 
                    to="/avantages" 
                    className="text-gray-700 hover:text-primary transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Avantages
                  </Link>
                  <Link 
                    to="/postuler" 
                    className="text-gray-700 hover:text-primary transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Postuler
                  </Link>
                </div>
              </details>
              <Link
                to="/annuaire"
                className="text-gray-700 hover:text-primary transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Annuaire
              </Link>
              <Link
                to="/accompagnement"
                className="text-gray-700 hover:text-primary transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Structures d'accompagnement
              </Link>
              <Link
                to="/investisseurs"
                className="text-gray-700 hover:text-primary transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Investisseurs
              </Link>

              <div className="pt-2 flex flex-col space-y-2">
                <Link to="/connexion" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="outline" className="w-full">Connexion</Button>
                </Link>
                <Link to="/inscription" onClick={() => setIsMenuOpen(false)}>
                  <Button className="w-full">Inscription</Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
