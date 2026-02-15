import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Rocket,
  Heart,
  MessageSquare,
  User,
  Settings,
  Briefcase,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DashboardSidebar, NavItem } from "@/components/shared/DashboardSidebar";
import { useSidebar } from "@/components/ui/sidebar";

const INVESTOR_NAV_ITEMS: NavItem[] = [
  { icon: LayoutDashboard, labelKey: "investor.sidebar.dashboard", href: "/investor", exact: true },
  { icon: Rocket, labelKey: "investor.sidebar.startups", href: "/investor/startups" },
  { icon: Heart, labelKey: "investor.sidebar.interests", href: "/investor/interests" },
  { icon: MessageSquare, labelKey: "investor.sidebar.messages", href: "/investor/messages" },
  { icon: User, labelKey: "investor.sidebar.profile", href: "/investor/profil" },
  { icon: Settings, labelKey: "investor.sidebar.settings", href: "/investor/settings" },
];

export function InvestorSidebar() {
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
          <Briefcase className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{t("investor.sidebar.investorLabel")}</p>
          <Badge variant="success" className="mt-1 text-xs">{t("investor.sidebar.active")}</Badge>
        </div>
      </div>
    </motion.div>
  ) : (
    <div className="flex justify-center">
      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
        <Briefcase className="w-5 h-5 text-primary" />
      </div>
    </div>
  );

  return (
    <DashboardSidebar
      navItems={INVESTOR_NAV_ITEMS}
      headerIcon={Briefcase}
      subtitleKey="investor.sidebar.subtitle"
      backToHomeKey="investor.sidebar.backToHome"
      footer={footer}
    />
  );
}
