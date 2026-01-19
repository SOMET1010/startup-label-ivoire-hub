import { useState } from "react";
import { Bell, CheckCircle, XCircle, Send, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { usePushNotifications } from "@/hooks/usePushNotifications";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function TestPush() {
  const { user } = useAuth();
  const { isSupported, permission, isSubscribed, loading, subscribe, unsubscribe } = usePushNotifications();
  const [sending, setSending] = useState(false);
  const [subscriptionDetails, setSubscriptionDetails] = useState<string | null>(null);

  const checkSubscription = async () => {
    if ("serviceWorker" in navigator) {
      try {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();
        if (subscription) {
          setSubscriptionDetails(JSON.stringify(subscription.toJSON(), null, 2));
        } else {
          setSubscriptionDetails("Aucune subscription active");
        }
      } catch (err) {
        setSubscriptionDetails(`Erreur: ${err}`);
      }
    }
  };

  const sendTestNotification = async () => {
    if (!user) {
      toast.error("Vous devez être connecté");
      return;
    }

    setSending(true);
    try {
      const { data, error } = await supabase.functions.invoke("send-push-notification", {
        body: {
          user_id: user.id,
          title: "🔔 Test Notification Push",
          body: "Ceci est un test de notification push depuis l'edge function!",
          url: "/startup/messages",
        },
      });

      if (error) throw error;

      console.log("Response:", data);
      toast.success("Notification envoyée!");
    } catch (err) {
      console.error("Error sending test notification:", err);
      toast.error(`Erreur: ${err}`);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="container max-w-2xl py-8">
      <h1 className="text-2xl font-bold mb-6">🧪 Test Push Notifications</h1>

      <div className="space-y-4">
        {/* Status Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              État du système
            </CardTitle>
            <CardDescription>Vérifiez la compatibilité et les permissions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <StatusRow
              label="Navigateur compatible"
              status={isSupported}
              details={isSupported ? "Push API supportée" : "Non supporté"}
            />
            <StatusRow
              label="Permission"
              status={permission === "granted"}
              details={
                permission === "granted"
                  ? "Accordée"
                  : permission === "denied"
                  ? "Refusée"
                  : permission === "default"
                  ? "Non demandée"
                  : "Non supportée"
              }
            />
            <StatusRow
              label="Abonnement actif"
              status={isSubscribed}
              details={isSubscribed ? "Abonné" : "Non abonné"}
            />
            <StatusRow
              label="Utilisateur connecté"
              status={!!user}
              details={user ? user.email || user.id : "Non connecté"}
            />
            <StatusRow
              label="VAPID Key configurée"
              status={!!import.meta.env.VITE_VAPID_PUBLIC_KEY}
              details={import.meta.env.VITE_VAPID_PUBLIC_KEY ? "✓ Présente" : "✗ Manquante"}
            />
          </CardContent>
        </Card>

        {/* Actions Card */}
        <Card>
          <CardHeader>
            <CardTitle>Actions</CardTitle>
            <CardDescription>Testez le flux complet</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {!isSubscribed ? (
              <Button
                onClick={subscribe}
                disabled={loading || !isSupported}
                className="w-full"
              >
                {loading ? "Activation..." : "1. Activer les notifications"}
              </Button>
            ) : (
              <Button
                onClick={unsubscribe}
                variant="outline"
                disabled={loading}
                className="w-full"
              >
                {loading ? "Désactivation..." : "Se désabonner"}
              </Button>
            )}

            <Button
              onClick={checkSubscription}
              variant="outline"
              className="w-full"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              2. Vérifier la subscription
            </Button>

            <Button
              onClick={sendTestNotification}
              disabled={sending || !isSubscribed || !user}
              className="w-full"
            >
              <Send className="h-4 w-4 mr-2" />
              {sending ? "Envoi..." : "3. Envoyer notification test"}
            </Button>
          </CardContent>
        </Card>

        {/* Subscription Details */}
        {subscriptionDetails && (
          <Card>
            <CardHeader>
              <CardTitle>Détails de la subscription</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted p-4 rounded-lg text-xs overflow-auto max-h-64">
                {subscriptionDetails}
              </pre>
            </CardContent>
          </Card>
        )}

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>📋 Instructions de test</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2">
            <p>1. <strong>Connectez-vous</strong> avec un compte startup</p>
            <p>2. Cliquez sur <strong>"Activer les notifications"</strong> et acceptez la permission</p>
            <p>3. Vérifiez que la subscription est enregistrée</p>
            <p>4. Cliquez sur <strong>"Envoyer notification test"</strong></p>
            <p>5. Vous devriez recevoir une notification push dans votre navigateur</p>
            <p className="text-amber-600 mt-4">
              ⚠️ Si vous ne recevez pas la notification, vérifiez que le navigateur
              n'est pas en mode "Ne pas déranger" et que l'onglet n'est pas au premier plan.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatusRow({ label, status, details }: { label: string; status: boolean; details: string }) {
  return (
    <div className="flex items-center justify-between py-2 border-b last:border-0">
      <span className="font-medium">{label}</span>
      <div className="flex items-center gap-2 text-sm">
        <span className="text-muted-foreground">{details}</span>
        {status ? (
          <CheckCircle className="h-5 w-5 text-green-500" />
        ) : (
          <XCircle className="h-5 w-5 text-red-500" />
        )}
      </div>
    </div>
  );
}
