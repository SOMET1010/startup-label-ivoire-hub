import { useState } from "react";
import { Bell, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePushNotifications } from "@/hooks/usePushNotifications";
import { cn } from "@/lib/utils";

interface PushPermissionBannerProps {
  className?: string;
}

export function PushPermissionBanner({ className }: PushPermissionBannerProps) {
  const { isSupported, permission, isSubscribed, loading, subscribe } = usePushNotifications();
  const [dismissed, setDismissed] = useState(false);

  // Don't show if not supported, already subscribed, denied, or dismissed
  if (!isSupported || isSubscribed || permission === "denied" || dismissed) {
    return null;
  }

  const handleSubscribe = async () => {
    const success = await subscribe();
    if (success) {
      setDismissed(true);
    }
  };

  return (
    <div
      className={cn(
        "bg-primary/10 border border-primary/20 rounded-lg p-4 flex items-center justify-between gap-4",
        className
      )}
    >
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
          <Bell className="h-5 w-5 text-primary" />
        </div>
        <div>
          <p className="font-medium text-sm">Activer les notifications</p>
          <p className="text-sm text-muted-foreground">
            Soyez alerté dès que l'institution vous répond
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setDismissed(true)}
          className="text-muted-foreground"
        >
          <X className="h-4 w-4" />
        </Button>
        <Button size="sm" onClick={handleSubscribe} disabled={loading}>
          {loading ? "Activation..." : "Activer"}
        </Button>
      </div>
    </div>
  );
}
