import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  LayoutDashboard,
  FileText,
  MessageSquare,
  Target,
  Users,
  BookOpen,
  HelpCircle,
  Home,
  Award,
  ChevronRight,
  Settings,
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
import { useLabelStatus } from "@/hooks/useLabelStatus";
import { useNotifications } from "@/hooks/useNotifications";
import { cn } from "@/lib/utils";

export function StartupSidebar() {
  const location = useLocation();
  const { state } = useSidebar();
  const { isLabeled, startup } = useLabelStatus();
  const { unreadCount } = useNotifications();
  const isCollapsed = state === "collapsed";
  const { t } = useTranslation('dashboard');

  const STARTUP_NAV_ITEMS = [
    { 
      icon: LayoutDashboard, 
      labelKey: "sidebar.dashboard",
      href: "/startup", 
      exact: true,
      labelOnly: false,
    },
    { 
      icon: FileText, 
      labelKey: "sidebar.application",
      href: "/startup/dossier",
      labelOnly: false,
    },
    { 
      icon: MessageSquare, 
      labelKey: "sidebar.messages",
      href: "/startup/messages",
      hasBadge: true,
      labelOnly: false,
    },
    { 
      icon: Target, 
      labelKey: "sidebar.opportunities",
      href: "/startup/opportunites",
      labelOnly: true,
    },
    { 
      icon: Users, 
      labelKey: "sidebar.network",
      href: "/startup/reseau",
      labelOnly: true,
    },
    { 
      icon: BookOpen, 
      labelKey: "sidebar.resources",
      href: "/startup/ressources",
      labelOnly: true,
    },
    { 
      icon: HelpCircle, 
      labelKey: "sidebar.support",
      href: "/startup/support",
      labelOnly: false,
    },
    { 
      icon: Settings, 
      labelKey: "sidebar.settings",
      href: "/startup/settings",
      labelOnly: false,
    },
  ];

  const isActive = (href: string, exact?: boolean) => {
    if (exact) {
      return location.pathname === href;
    }
    return location.pathname.startsWith(href);
  };

  const getStatusBadge = () => {
    if (isLabeled) {
      return { label: t('sidebar.status.labeled'), variant: "success" as const };
    }
    return { label: t('sidebar.status.inProgress'), variant: "warning" as const };
  };

  const status = getStatusBadge();

  return (
    <Sidebar collapsible="icon" className="border-r border-border/50">
      <SidebarHeader className="p-4">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg">
            <Award className="w-6 h-6 text-primary-foreground" />
          </div>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex flex-col"
            >
              <span className="font-bold text-lg text-foreground">Ivoire Hub</span>
              <span className="text-xs text-muted-foreground">{t('header.breadcrumb.startup')}</span>
            </motion.div>
          )}
        </Link>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent className="px-2">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {STARTUP_NAV_ITEMS.map((item) => {
                const isItemActive = isActive(item.href, item.exact);
                const isDisabled = item.labelOnly && !isLabeled;
                const label = t(item.labelKey);

                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={isItemActive}
                      disabled={isDisabled}
                      tooltip={isCollapsed ? label : undefined}
                      className={cn(
                        "relative transition-all duration-200",
                        isItemActive && "bg-primary/10 text-primary font-medium",
                        isDisabled && "opacity-50 cursor-not-allowed"
                      )}
                    >
                    {isDisabled ? (
                        <div className="flex items-center gap-3 px-3 py-2">
                          <item.icon className="w-5 h-5" />
                          {!isCollapsed && (
                            <>
                              <span>{label}</span>
                              <Badge variant="muted" className="ml-auto text-xs">
                                {t('sidebar.labelRequired')}
                              </Badge>
                            </>
                          )}
                        </div>
                      ) : (
                        <Link to={item.href} className="flex items-center gap-3">
                          <item.icon className="w-5 h-5" />
                          {!isCollapsed && (
                            <>
                              <span>{label}</span>
                              {item.hasBadge && unreadCount > 0 && (
                                <Badge 
                                  variant="destructive" 
                                  className="ml-auto h-5 w-5 p-0 flex items-center justify-center text-xs"
                                >
                                  {unreadCount > 9 ? "9+" : unreadCount}
                                </Badge>
                              )}
                              {isItemActive && (
                                <ChevronRight className="ml-auto w-4 h-4 text-primary" />
                              )}
                            </>
                          )}
                        </Link>
                      )}
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
                <SidebarMenuButton asChild tooltip={isCollapsed ? t('sidebar.backToHome') : undefined}>
                  <Link to="/" className="flex items-center gap-3 text-muted-foreground hover:text-foreground">
                    <Home className="w-5 h-5" />
                    {!isCollapsed && <span>{t('sidebar.backToHome')}</span>}
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
                <Award className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {startup?.name || t('sidebar.defaultStartupName')}
                </p>
                <Badge variant={status.variant} className="mt-1 text-xs">
                  {status.label}
                </Badge>
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="flex justify-center">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Award className="w-5 h-5 text-primary" />
            </div>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
