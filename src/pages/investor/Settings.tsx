import { useTranslation } from "react-i18next";
import { AccountSettings } from "@/components/settings/AccountSettings";
import { SEOHead } from "@/components/shared/SEOHead";

export default function InvestorSettings() {
  const { t } = useTranslation("dashboard");

  return (
    <>
      <SEOHead title={t("investor.settings.title")} description={t("investor.settings.subtitle")} />
      <div className="space-y-6 max-w-2xl">
        <div>
          <h1 className="text-2xl font-bold">{t("investor.settings.title")}</h1>
          <p className="text-muted-foreground">{t("investor.settings.subtitle")}</p>
        </div>
        <AccountSettings />
      </div>
    </>
  );
}
