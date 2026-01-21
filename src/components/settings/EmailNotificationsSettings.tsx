import { useTranslation } from "react-i18next";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useUserPreferences } from "@/hooks/useUserPreferences";
import { EmailNotificationsPreferences } from "@/contexts/AuthContext";

const NOTIFICATION_OPTIONS: {
  key: keyof EmailNotificationsPreferences;
  titleKey: string;
  descKey: string;
}[] = [
  {
    key: "status_updates",
    titleKey: "notifications.statusUpdates.title",
    descKey: "notifications.statusUpdates.description",
  },
  {
    key: "events",
    titleKey: "notifications.events.title",
    descKey: "notifications.events.description",
  },
  {
    key: "opportunities",
    titleKey: "notifications.opportunities.title",
    descKey: "notifications.opportunities.description",
  },
  {
    key: "newsletter",
    titleKey: "notifications.newsletter.title",
    descKey: "notifications.newsletter.description",
  },
];

export function EmailNotificationsSettings() {
  const { t } = useTranslation('settings');
  const { preferences, setEmailNotification, isSyncing } = useUserPreferences();

  return (
    <div className="space-y-4">
      {NOTIFICATION_OPTIONS.map((option) => (
        <div
          key={option.key}
          className="flex items-center justify-between py-2"
        >
          <div className="space-y-0.5">
            <Label htmlFor={`notif-${option.key}`} className="font-medium cursor-pointer">
              {t(option.titleKey)}
            </Label>
            <p className="text-sm text-muted-foreground">
              {t(option.descKey)}
            </p>
          </div>
          <Switch
            id={`notif-${option.key}`}
            checked={preferences.email_notifications[option.key]}
            onCheckedChange={(checked) =>
              setEmailNotification(option.key, checked)
            }
            disabled={isSyncing}
          />
        </div>
      ))}
    </div>
  );
}
