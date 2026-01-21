import { useNavigate, useLocation, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { 
  Menu, 
  User, 
  LogOut, 
  Settings,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { NotificationBell } from "@/components/notifications/NotificationBell";
import { useAuth } from "@/contexts/AuthContext";

const ROUTE_KEYS: Record<string, string> = {
  "/startup": "header.routes.dashboard",
  "/startup/dossier": "header.routes.application",
  "/startup/messages": "header.routes.messages",
  "/startup/opportunites": "header.routes.opportunities",
  "/startup/reseau": "header.routes.network",
  "/startup/ressources": "header.routes.resources",
  "/startup/support": "header.routes.support",
  "/startup/profile": "header.routes.profile",
  "/startup/settings": "header.routes.settings",
  "/startup/events": "header.routes.events",
};

export function StartupHeader() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, profile, signOut } = useAuth();
  const { t } = useTranslation('dashboard');

  const getRouteLabel = (path: string): string => {
    const key = ROUTE_KEYS[path];
    return key ? t(key) : t('header.breadcrumb.startup');
  };

  const currentLabel = getRouteLabel(location.pathname);

  const getInitials = (name?: string | null) => {
    if (!name) return "ST";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const getBreadcrumbs = () => {
    const parts = location.pathname.split("/").filter(Boolean);
    const breadcrumbs = [{ label: t('header.breadcrumb.startup'), href: "/startup" }];
    
    if (parts.length > 1) {
      const currentPath = "/" + parts.join("/");
      const label = getRouteLabel(currentPath);
      if (label && currentPath !== "/startup") {
        breadcrumbs.push({ label, href: currentPath });
      }
    }
    
    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 lg:px-6"
    >
      <div className="flex items-center gap-4">
        <SidebarTrigger className="lg:hidden">
          <Menu className="h-5 w-5" />
        </SidebarTrigger>

        {/* Breadcrumbs */}
        <nav className="hidden md:flex items-center gap-2 text-sm">
          {breadcrumbs.map((crumb, index) => (
            <div key={crumb.href} className="flex items-center gap-2">
              {index > 0 && <ChevronRight className="w-4 h-4 text-muted-foreground" />}
              {index === breadcrumbs.length - 1 ? (
                <span className="font-medium text-foreground">{crumb.label}</span>
              ) : (
                <Link 
                  to={crumb.href} 
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {crumb.label}
                </Link>
              )}
            </div>
          ))}
        </nav>

        {/* Mobile title */}
        <h1 className="md:hidden font-semibold text-foreground">{currentLabel}</h1>
      </div>

      <div className="flex items-center gap-3">
        <NotificationBell />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <Avatar className="h-10 w-10 border-2 border-primary/20">
                <AvatarImage src={profile?.avatar_url || undefined} alt={profile?.full_name || "User"} />
                <AvatarFallback className="bg-primary/10 text-primary font-medium">
                  {getInitials(profile?.full_name)}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {profile?.full_name || t('header.userMenu.defaultUser')}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate("/startup/profile")}>
              <User className="mr-2 h-4 w-4" />
              <span>{t('header.userMenu.profile')}</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/startup/settings")}>
              <Settings className="mr-2 h-4 w-4" />
              <span>{t('header.userMenu.settings')}</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              <span>{t('header.userMenu.logout')}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </motion.header>
  );
}
