import { DashboardHeader } from "@/components/shared/DashboardHeader";

const ROUTE_KEYS: Record<string, string> = {
  "/structure": "structure.header.routes.dashboard",
  "/structure/startups": "structure.header.routes.startups",
  "/structure/programmes": "structure.header.routes.programs",
  "/structure/profil": "structure.header.routes.profile",
  "/structure/settings": "structure.header.routes.settings",
};

export function StructureHeader() {
  return (
    <DashboardHeader
      routeKeys={ROUTE_KEYS}
      rootBreadcrumb={{ labelKey: "structure.header.breadcrumb", href: "/structure" }}
      profilePath="/structure/profil"
      settingsPath="/structure/settings"
      defaultInitials="SA"
    />
  );
}
