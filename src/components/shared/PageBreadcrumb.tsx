import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Home } from "lucide-react";

interface BreadcrumbEntry {
  label: string;
  href?: string;
}

interface PageBreadcrumbProps {
  /** Override the auto-detected page label */
  currentLabel?: string;
  /** Extra intermediate crumbs between Home and the current page */
  parents?: BreadcrumbEntry[];
  className?: string;
}

const ROUTE_LABELS: Record<string, string> = {
  "/faq": "breadcrumb.faq",
  "/criteres": "breadcrumb.criteres",
  "/avantages": "breadcrumb.avantages",
  "/accompagnement": "breadcrumb.accompagnement",
  "/investisseurs": "breadcrumb.investisseurs",
  "/actualites": "breadcrumb.actualites",
  "/entreprises-ia": "breadcrumb.entreprises",
  "/eligibilite": "breadcrumb.eligibilite",
  "/postuler": "breadcrumb.postuler",
  "/annuaire": "breadcrumb.annuaire",
};

export function PageBreadcrumb({ currentLabel, parents, className }: PageBreadcrumbProps) {
  const { t } = useTranslation("common");
  const location = useLocation();

  const resolvedLabel =
    currentLabel ??
    (ROUTE_LABELS[location.pathname]
      ? t(ROUTE_LABELS[location.pathname])
      : undefined);

  if (!resolvedLabel) return null;

  return (
    <div className={className}>
      <div className="container mx-auto px-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/" className="flex items-center gap-1">
                  <Home className="h-3.5 w-3.5" />
                  <span className="sr-only md:not-sr-only">{t("breadcrumb.home")}</span>
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>

            {parents?.map((parent, i) => (
              <span key={i} className="contents">
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  {parent.href ? (
                    <BreadcrumbLink asChild>
                      <Link to={parent.href}>{parent.label}</Link>
                    </BreadcrumbLink>
                  ) : (
                    <BreadcrumbPage>{parent.label}</BreadcrumbPage>
                  )}
                </BreadcrumbItem>
              </span>
            ))}

            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{resolvedLabel}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </div>
  );
}
