import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  LayoutDashboard,
  Rocket,
  Heart,
  MessageSquare,
  User,
  Settings,
  Home,
  Briefcase,
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

const INVESTOR_NAV_ITEMS = [
  {
    icon: LayoutDashboard,
    labelKey: "investor.sidebar.dashboard",
    href: "/investor",
    exact: true,
  },
  {
    icon: Rocket,
    labelKey: "investor.sidebar.startups",
    href: "/investor/startups",
  },
  {
    icon: Heart,
    labelKey: "investor.sidebar.interests",
    href: "/investor/interests",
  },
  {
    icon: MessageSquare,
    labelKey: "investor.sidebar.messages",
    href: "/investor/messages",
  },
  {
    icon: User,
    labelKey: "investor.sidebar.profile",
    href: "/investor/profil",
  },
  {
    icon: Settings,
    labelKey: "investor.sidebar.settings",
    href: "/investor/settings",
  },
];

export function InvestorSidebar() {
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
            <Briefcase className="w-6 h-6 text-primary-foreground" />
          </div>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex flex-col"
            >
              <span className="font-bold text-lg text-foreground">Ivoire Hub</span>
              <span className="text-xs text-muted-foreground">
                {t("investor.sidebar.subtitle")}
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
              {INVESTOR_NAV_ITEMS.map((item) => {
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
                  tooltip={isCollapsed ? t("investor.sidebar.backToHome") : undefined}
                >
                  <Link
                    to="/"
                    className="flex items-center gap-3 text-muted-foreground hover:text-foreground"
                  >
                    <Home className="w-5 h-5" />
                    {!isCollapsed && <span>{t("investor.sidebar.backToHome")}</span>}
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
                <Briefcase className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {t("investor.sidebar.investorLabel")}
                </p>
                <Badge variant="success" className="mt-1 text-xs">
                  {t("investor.sidebar.active")}
                </Badge>
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="flex justify-center">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-primary" />
            </div>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
