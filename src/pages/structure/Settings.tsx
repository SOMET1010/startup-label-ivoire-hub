import { useTranslation } from "react-i18next";
import { AccountSettings } from "@/components/settings/AccountSettings";
import { EmailNotificationsSettings } from "@/components/settings/EmailNotificationsSettings";
import { LanguageSelector } from "@/components/settings/LanguageSelector";
import { DateFormatSelector } from "@/components/settings/DateFormatSelector";

export default function StructureSettings() {
  const { t } = useTranslation("settings");

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">{t("title")}</h1>
      <div className="space-y-6 max-w-2xl">
        <AccountSettings />
        <LanguageSelector />
        <DateFormatSelector />
        <EmailNotificationsSettings />
      </div>
    </div>
  );
}
