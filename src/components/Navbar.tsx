import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, ChevronDown, User, LogOut, LayoutDashboard, Moon, Sun, Monitor } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useBrand } from "@/hooks/useBrand";
import { useAppTheme } from "@/hooks/useAppTheme";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { NotificationBell } from "@/components/notifications/NotificationBell";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import GovTopBar from "@/components/gov/GovTopBar";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, profile, userRole, signOut, loading } = useAuth();
  const navigate = useNavigate();
  const { brand } = useBrand();
  const isInstitutional = brand === "ansut";
  const { theme, isDark, setTheme, mounted } = useAppTheme();
  const { t } = useTranslation('common');

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/");
    } catch (error) {
      // Error is handled by AuthContext
    }
  };

  const getInitials = () => {
    if (profile?.full_name) {
      return profile.full_name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
    }
    if (user?.email) {
      return user.email[0].toUpperCase();
    }
    return "U";
  };

  const getDashboardLink = () => {
    if (userRole === "admin" || userRole === "evaluator") {
      return "/admin";
    }
    return "/startup";
  };

  return (
    <>
      {isInstitutional && <GovTopBar />}
      <nav className="bg-background border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 py-2">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg"></div>
              <span className="text-xl font-heading font-bold">Ivoire Hub</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link 
              to="/" 
              className="text-muted-foreground hover:text-primary transition-colors font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-sm"
            >
              {t('nav.home')}
            </Link>
            <div className="relative group">
              <button 
                className="flex items-center text-muted-foreground hover:text-primary transition-colors font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-sm"
                aria-haspopup="true"
                aria-expanded="false"
              >
                {t('nav.labeling')} <ChevronDown className="ml-1 h-4 w-4" aria-hidden="true" />
              </button>
              <div 
                className="absolute left-0 mt-2 w-44 bg-card rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 border border-border"
                role="menu"
              >
                <Link 
                  to="/criteres" 
                  className="block px-4 py-2.5 text-sm text-foreground hover:bg-accent rounded-t-lg focus-visible:bg-accent focus-visible:outline-none"
                  role="menuitem"
                >
                  {t('nav.criteria')}
                </Link>
                <Link 
                  to="/postuler" 
                  className="block px-4 py-2.5 text-sm text-foreground hover:bg-accent rounded-b-lg focus-visible:bg-accent focus-visible:outline-none"
                  role="menuitem"
                >
                  {t('nav.apply')}
                </Link>
              </div>
            </div>
            <Link 
              to="/annuaire" 
              className="text-muted-foreground hover:text-primary transition-colors font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-sm"
            >
              {t('nav.directory')}
            </Link>
            <Link 
              to="/actualites" 
              className="text-muted-foreground hover:text-primary transition-colors font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-sm"
            >
              {t('nav.news')}
            </Link>
          </div>

          {/* Auth Buttons avec Theme Toggle */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Language & Theme Toggle - visible when not logged in */}
            {mounted && !user && (
              <>
                <LanguageSwitcher />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setTheme(isDark ? 'light' : 'dark')}
                  aria-label={t('theme.dark')}
                  className="h-9 w-9"
                >
                  {isDark ? (
                    <Sun className="h-5 w-5 text-amber-500" />
                  ) : (
                    <Moon className="h-5 w-5 text-muted-foreground" />
                  )}
                </Button>
              </>
            )}
            
            {loading ? (
              <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
            ) : user ? (
              <>
              <NotificationBell />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="bg-primary text-primary-foreground font-medium">
                        {getInitials()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex flex-col space-y-1 p-2">
                    <p className="text-sm font-medium leading-none">
                      {profile?.full_name || "Utilisateur"}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                    {userRole && (
                      <span className="text-xs text-primary capitalize mt-1">
                        {userRole}
                      </span>
                    )}
                  </div>
                  <DropdownMenuSeparator />
                  <div className="p-2">
                    <DropdownMenuLabel className="text-xs font-normal text-muted-foreground px-0 mb-2">
                      {t('theme.light')}
                    </DropdownMenuLabel>
                    <div className="flex gap-1">
                      <Button
                        variant={theme === 'light' ? 'default' : 'ghost'}
                        size="sm"
                        className="flex-1 h-8"
                        onClick={() => setTheme('light')}
                        aria-label={t('theme.light')}
                      >
                        <Sun className="h-4 w-4" />
                      </Button>
                      <Button
                        variant={theme === 'dark' ? 'default' : 'ghost'}
                        size="sm"
                        className="flex-1 h-8"
                        onClick={() => setTheme('dark')}
                        aria-label={t('theme.dark')}
                      >
                        <Moon className="h-4 w-4" />
                      </Button>
                      <Button
                        variant={theme === 'system' ? 'default' : 'ghost'}
                        size="sm"
                        className="flex-1 h-8"
                        onClick={() => setTheme('system')}
                        aria-label={t('theme.system')}
                      >
                        <Monitor className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to={getDashboardLink()} className="cursor-pointer">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      {t('nav.dashboard')}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/profil" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      {t('nav.profile')}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-destructive focus:text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    {t('nav.logout')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              </>
            ) : (
              <>
                <Link to="/auth">
                  <Button variant="ghost">{t('nav.login')}</Button>
                </Link>
                <Link to="/auth">
                  <Button>{t('nav.register')}</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm p-1"
            onClick={toggleMenu}
            aria-label={isMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 pb-4" role="navigation" aria-label="Menu mobile">
            <div className="flex flex-col space-y-3">
              <Link
                to="/"
                className="text-muted-foreground hover:text-primary transition-colors font-medium py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('nav.home')}
              </Link>
              <details className="group">
                <summary className="flex cursor-pointer list-none items-center justify-between text-muted-foreground hover:text-primary transition-colors font-medium py-2">
                  {t('nav.labeling')}
                  <ChevronDown className="h-4 w-4" aria-hidden="true" />
                </summary>
                <div className="mt-2 ml-4 flex flex-col space-y-2">
                  <Link 
                    to="/criteres" 
                    className="text-muted-foreground hover:text-primary transition-colors py-1"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t('nav.criteria')}
                  </Link>
                  <Link 
                    to="/postuler" 
                    className="text-muted-foreground hover:text-primary transition-colors py-1"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t('nav.apply')}
                  </Link>
                </div>
              </details>
              <Link
                to="/annuaire"
                className="text-muted-foreground hover:text-primary transition-colors font-medium py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('nav.directory')}
              </Link>
              <Link
                to="/actualites"
                className="text-muted-foreground hover:text-primary transition-colors font-medium py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('nav.news')}
              </Link>

              <div className="pt-3 border-t border-border">
                {user ? (
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center space-x-3 py-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                          {getInitials()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{profile?.full_name || "Utilisateur"}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                    {/* Theme selector mobile */}
                    <div className="py-2">
                      <p className="text-xs text-muted-foreground mb-2">{t('theme.light')}</p>
                      <div className="flex gap-1">
                        <Button
                          variant={theme === 'light' ? 'default' : 'outline'}
                          size="sm"
                          className="flex-1 h-8"
                          onClick={() => setTheme('light')}
                          aria-label={t('theme.light')}
                        >
                          <Sun className="h-4 w-4" />
                        </Button>
                        <Button
                          variant={theme === 'dark' ? 'default' : 'outline'}
                          size="sm"
                          className="flex-1 h-8"
                          onClick={() => setTheme('dark')}
                          aria-label={t('theme.dark')}
                        >
                          <Moon className="h-4 w-4" />
                        </Button>
                        <Button
                          variant={theme === 'system' ? 'default' : 'outline'}
                          size="sm"
                          className="flex-1 h-8"
                          onClick={() => setTheme('system')}
                          aria-label={t('theme.system')}
                        >
                          <Monitor className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <Link to={getDashboardLink()} onClick={() => setIsMenuOpen(false)}>
                      <Button variant="outline" className="w-full justify-start">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        {t('nav.dashboard')}
                      </Button>
                    </Link>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-destructive hover:text-destructive"
                      onClick={() => { handleSignOut(); setIsMenuOpen(false); }}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      {t('nav.logout')}
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col space-y-2">
                    {/* Language switcher for mobile visitors */}
                    <div className="flex items-center justify-between py-2">
                      <span className="text-sm text-muted-foreground">{t('language.label')}</span>
                      <LanguageSwitcher />
                    </div>
                    <Link to="/auth" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="outline" className="w-full">{t('nav.login')}</Button>
                    </Link>
                    <Link to="/auth" onClick={() => setIsMenuOpen(false)}>
                      <Button className="w-full">{t('nav.register')}</Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </nav>
        )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
