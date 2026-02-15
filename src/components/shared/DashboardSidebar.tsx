import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Home, ChevronRight, LucideIcon } from "lucide-react";
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

export interface NavItem {
  icon: LucideIcon;
  labelKey: string;
  href: string;
  exact?: boolean;
  labelOnly?: boolean;
  hasBadge?: boolean;
}

interface DashboardSidebarProps {
  navItems: NavItem[];
  headerIcon: LucideIcon;
  subtitleKey: string;
  backToHomeKey: string;
  footer: ReactNode;
  /** Whether an item with labelOnly should be disabled */
  isLabeled?: boolean;
  /** Unread count for items with hasBadge */
  unreadCount?: number;
}

export function DashboardSidebar({
  navItems,
  headerIcon: HeaderIcon,
  subtitleKey,
  backToHomeKey,
  footer,
  isLabeled = true,
  unreadCount = 0,
}: DashboardSidebarProps) {
  const location = useLocation();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";
  const { t } = useTranslation("dashboard");

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return location.pathname === href;
    return location.pathname.startsWith(href);
  };

  return (
    <Sidebar collapsible="icon" className="border-r border-border/50">
      <SidebarHeader className="p-4">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg">
            <HeaderIcon className="w-6 h-6 text-primary-foreground" />
          </div>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex flex-col"
            >
              <span className="font-bold text-lg text-foreground">Ivoire Hub</span>
              <span className="text-xs text-muted-foreground">{t(subtitleKey)}</span>
            </motion.div>
          )}
        </Link>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent className="px-2">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const active = isActive(item.href, item.exact);
                const isDisabled = item.labelOnly && !isLabeled;
                const label = t(item.labelKey);

                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={active}
                      disabled={isDisabled}
                      tooltip={isCollapsed ? label : undefined}
                      className={cn(
                        "relative transition-all duration-200",
                        active && "bg-primary/10 text-primary font-medium",
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
                                {t("sidebar.labelRequired")}
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
                              {active && (
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
                <SidebarMenuButton
                  asChild
                  tooltip={isCollapsed ? t(backToHomeKey) : undefined}
                >
                  <Link
                    to="/"
                    className="flex items-center gap-3 text-muted-foreground hover:text-foreground"
                  >
                    <Home className="w-5 h-5" />
                    {!isCollapsed && <span>{t(backToHomeKey)}</span>}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">{footer}</SidebarFooter>
    </Sidebar>
  );
}
