import { DashboardHeader } from "@/components/shared/DashboardHeader";

const ROUTE_KEYS: Record<string, string> = {
  "/investor": "investor.header.routes.dashboard",
  "/investor/startups": "investor.header.routes.startups",
  "/investor/interests": "investor.header.routes.interests",
  "/investor/messages": "investor.header.routes.messages",
  "/investor/profil": "investor.header.routes.profile",
  "/investor/settings": "investor.header.routes.settings",
};

export function InvestorHeader() {
  return (
    <DashboardHeader
      routeKeys={ROUTE_KEYS}
      rootBreadcrumb={{ labelKey: "investor.header.breadcrumb", href: "/investor" }}
      profilePath="/investor/profil"
      settingsPath="/investor/settings"
      defaultInitials="IN"
    />
  );
}
