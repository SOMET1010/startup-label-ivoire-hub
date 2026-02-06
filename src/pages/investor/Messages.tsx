import { useTranslation } from "react-i18next";
import { MessageSquare } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SEOHead } from "@/components/shared/SEOHead";

export default function InvestorMessages() {
  const { t } = useTranslation("dashboard");

  return (
    <>
      <SEOHead title={t("investor.messages.title")} description={t("investor.messages.subtitle")} />
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">{t("investor.messages.title")}</h1>
          <p className="text-muted-foreground">{t("investor.messages.subtitle")}</p>
        </div>

        <Card>
          <CardContent className="py-12 text-center">
            <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">{t("investor.messages.noMessages")}</p>
            <p className="text-sm text-muted-foreground mt-2">{t("investor.messages.hint")}</p>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
