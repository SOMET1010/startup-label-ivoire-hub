import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  LayoutDashboard,
  Rocket,
  FolderKanban,
  User,
  Settings,
  Home,
  Building2,
  ChevronRight,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const STRUCTURE_NAV_ITEMS = [
  {
    icon: LayoutDashboard,
    labelKey: "structure.sidebar.dashboard",
    href: "/structure",
    exact: true,
  },
  {
    icon: Rocket,
    labelKey: "structure.sidebar.startups",
    href: "/structure/startups",
  },
  {
    icon: FolderKanban,
    labelKey: "structure.sidebar.programs",
    href: "/structure/programmes",
  },
  {
    icon: User,
    labelKey: "structure.sidebar.profile",
    href: "/structure/profil",
  },
  {
    icon: Settings,
    labelKey: "structure.sidebar.settings",
    href: "/structure/settings",
  },
];

export function StructureSidebar() {
  const location = useLocation();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";
  const { t } = useTranslation('dashboard');

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return location.pathname === href;
    return location.pathname.startsWith(href);
  };

  return (
    <Sidebar collapsible="icon" className="border-r border-border/50">
      <SidebarHeader className="p-4">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg">
            <Building2 className="w-6 h-6 text-primary-foreground" />
          </div>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex flex-col"
            >
              <span className="font-bold text-lg text-foreground">Ivoire Hub</span>
              <span className="text-xs text-muted-foreground">
                {t('structure.sidebar.subtitle')}
              </span>
            </motion.div>
          )}
        </Link>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent className="px-2">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {STRUCTURE_NAV_ITEMS.map((item) => {
                const active = isActive(item.href, item.exact);
                const label = t(item.labelKey);

                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={active}
                      tooltip={isCollapsed ? label : undefined}
                      className={cn(
                        "relative transition-all duration-200",
                        active && "bg-primary/10 text-primary font-medium"
                      )}
                    >
                      <Link to={item.href} className="flex items-center gap-3">
                        <item.icon className="w-5 h-5" />
                        {!isCollapsed && (
                          <>
                            <span>{label}</span>
                            {active && (
                              <ChevronRight className="ml-auto w-4 h-4 text-primary" />
                            )}
                          </>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator className="my-4" />

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  tooltip={isCollapsed ? t('structure.sidebar.backToHome') : undefined}
                >
                  <Link
                    to="/"
                    className="flex items-center gap-3 text-muted-foreground hover:text-foreground"
                  >
                    <Home className="w-5 h-5" />
                    {!isCollapsed && <span>{t('structure.sidebar.backToHome')}</span>}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        {!isCollapsed ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 rounded-xl bg-muted/50 border border-border/50"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Building2 className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {t('structure.sidebar.structureLabel')}
                </p>
                <Badge variant="success" className="mt-1 text-xs">
                  {t('structure.sidebar.active')}
                </Badge>
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="flex justify-center">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Building2 className="w-5 h-5 text-primary" />
            </div>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
