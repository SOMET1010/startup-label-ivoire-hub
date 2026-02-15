import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Rocket,
  FolderKanban,
  User,
  Settings,
  Building2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DashboardSidebar, NavItem } from "@/components/shared/DashboardSidebar";
import { useSidebar } from "@/components/ui/sidebar";

const STRUCTURE_NAV_ITEMS: NavItem[] = [
  { icon: LayoutDashboard, labelKey: "structure.sidebar.dashboard", href: "/structure", exact: true },
  { icon: Rocket, labelKey: "structure.sidebar.startups", href: "/structure/startups" },
  { icon: FolderKanban, labelKey: "structure.sidebar.programs", href: "/structure/programmes" },
  { icon: User, labelKey: "structure.sidebar.profile", href: "/structure/profil" },
  { icon: Settings, labelKey: "structure.sidebar.settings", href: "/structure/settings" },
];

export function StructureSidebar() {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";
  const { t } = useTranslation("dashboard");

  const footer = !isCollapsed ? (
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
          <p className="text-sm font-medium truncate">{t("structure.sidebar.structureLabel")}</p>
          <Badge variant="success" className="mt-1 text-xs">{t("structure.sidebar.active")}</Badge>
        </div>
      </div>
    </motion.div>
  ) : (
    <div className="flex justify-center">
      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
        <Building2 className="w-5 h-5 text-primary" />
      </div>
    </div>
  );

  return (
    <DashboardSidebar
      navItems={STRUCTURE_NAV_ITEMS}
      headerIcon={Building2}
      subtitleKey="structure.sidebar.subtitle"
      backToHomeKey="structure.sidebar.backToHome"
      footer={footer}
    />
  );
}
