import { DashboardHeader } from "@/components/shared/DashboardHeader";

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
  return (
    <DashboardHeader
      routeKeys={ROUTE_KEYS}
      rootBreadcrumb={{ labelKey: "header.breadcrumb.startup", href: "/startup" }}
      profilePath="/startup/profile"
      settingsPath="/startup/settings"
      defaultInitials="ST"
    />
  );
}
