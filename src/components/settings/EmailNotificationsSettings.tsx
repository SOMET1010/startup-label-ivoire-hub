import { Bell } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useUserPreferences } from "@/hooks/useUserPreferences";
import { EmailNotificationsPreferences } from "@/contexts/AuthContext";

const NOTIFICATION_OPTIONS: {
  key: keyof EmailNotificationsPreferences;
  label: string;
  description: string;
}[] = [
  {
    key: "status_updates",
    label: "Mises à jour de statut",
    description: "Notifications sur l'état de votre candidature",
  },
  {
    key: "events",
    label: "Événements",
    description: "Invitations aux événements et webinaires",
  },
  {
    key: "opportunities",
    label: "Opportunités",
    description: "Nouvelles opportunités de financement et partenariats",
  },
  {
    key: "newsletter",
    label: "Newsletter",
    description: "Actualités et informations du programme",
  },
];

export function EmailNotificationsSettings() {
  const { preferences, setEmailNotification, isSyncing } = useUserPreferences();

  return (
    <div className="space-y-4">
      <Label className="flex items-center gap-2">
        <Bell className="w-4 h-4 text-muted-foreground" />
        Notifications par email
      </Label>
      <div className="space-y-4">
        {NOTIFICATION_OPTIONS.map((option) => (
          <div
            key={option.key}
            className="flex items-center justify-between py-2"
          >
            <div className="space-y-0.5">
              <Label htmlFor={`notif-${option.key}`} className="font-medium cursor-pointer">
                {option.label}
              </Label>
              <p className="text-sm text-muted-foreground">
                {option.description}
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
    </div>
  );
}
