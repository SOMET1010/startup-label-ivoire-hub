import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  FileText,
  MessageSquare,
  Target,
  Users,
  BookOpen,
  HelpCircle,
  Award,
  Settings,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DashboardSidebar, NavItem } from "@/components/shared/DashboardSidebar";
import { useSidebar } from "@/components/ui/sidebar";
import { useLabelStatus } from "@/hooks/useLabelStatus";
import { useNotifications } from "@/hooks/useNotifications";

const STARTUP_NAV_ITEMS: NavItem[] = [
  { icon: LayoutDashboard, labelKey: "sidebar.dashboard", href: "/startup", exact: true },
  { icon: FileText, labelKey: "sidebar.application", href: "/startup/dossier" },
  { icon: MessageSquare, labelKey: "sidebar.messages", href: "/startup/messages", hasBadge: true },
  { icon: Target, labelKey: "sidebar.opportunities", href: "/startup/opportunites", labelOnly: true },
  { icon: Users, labelKey: "sidebar.network", href: "/startup/reseau", labelOnly: true },
  { icon: BookOpen, labelKey: "sidebar.resources", href: "/startup/ressources", labelOnly: true },
  { icon: HelpCircle, labelKey: "sidebar.support", href: "/startup/support" },
  { icon: Settings, labelKey: "sidebar.settings", href: "/startup/settings" },
];

export function StartupSidebar() {
  const { isLabeled, startup } = useLabelStatus();
  const { unreadCount } = useNotifications();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";
  const { t } = useTranslation("dashboard");

  const status = isLabeled
    ? { label: t("sidebar.status.labeled"), variant: "success" as const }
    : { label: t("sidebar.status.inProgress"), variant: "warning" as const };

  const footer = !isCollapsed ? (
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
            {startup?.name || t("sidebar.defaultStartupName")}
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
  );

  return (
    <DashboardSidebar
      navItems={STARTUP_NAV_ITEMS}
      headerIcon={Award}
      subtitleKey="header.breadcrumb.startup"
      backToHomeKey="sidebar.backToHome"
      footer={footer}
      isLabeled={isLabeled}
      unreadCount={unreadCount}
    />
  );
}
