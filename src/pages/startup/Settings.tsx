import { Settings as SettingsIcon, Palette, Globe, Calendar, Bell, User } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageSelector } from "@/components/settings/LanguageSelector";
import { DateFormatSelector } from "@/components/settings/DateFormatSelector";
import { EmailNotificationsSettings } from "@/components/settings/EmailNotificationsSettings";
import { AccountSettings } from "@/components/settings/AccountSettings";
import { AuthProvider } from "@/contexts/AuthContext";

function SettingsContent() {
  const { t } = useTranslation('settings');

  return (
    <div className="space-y-8 p-6 max-w-4xl">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <SettingsIcon className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{t('title')}</h1>
            <p className="text-muted-foreground">
              {t('subtitle')}
            </p>
          </div>
        </div>
      </div>

      {/* Apparence */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Palette className="w-5 h-5 text-primary" />
            {t('appearance.title')}
          </CardTitle>
          <CardDescription>
            {t('appearance.subtitle')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ThemeToggle />
        </CardContent>
      </Card>

      {/* Langue */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Globe className="w-5 h-5 text-primary" />
            {t('language.title')}
          </CardTitle>
          <CardDescription>
            {t('language.subtitle')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LanguageSelector />
        </CardContent>
      </Card>

      {/* Format de date */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Calendar className="w-5 h-5 text-primary" />
            {t('dateFormat.title')}
          </CardTitle>
          <CardDescription>
            {t('dateFormat.subtitle')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DateFormatSelector />
        </CardContent>
      </Card>

      {/* Notifications email */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Bell className="w-5 h-5 text-primary" />
            {t('notifications.title')}
          </CardTitle>
          <CardDescription>
            {t('notifications.subtitle')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EmailNotificationsSettings />
        </CardContent>
      </Card>

      {/* Compte */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <User className="w-5 h-5 text-primary" />
            {t('account.title')}
          </CardTitle>
          <CardDescription>
            {t('account.subtitle')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AccountSettings />
        </CardContent>
      </Card>
    </div>
  );
}

export default function Settings() {
  return (
    <AuthProvider>
      <SettingsContent />
    </AuthProvider>
  );
}
