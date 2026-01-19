import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface UsePushNotificationsResult {
  isSupported: boolean;
  permission: NotificationPermission | "unsupported";
  isSubscribed: boolean;
  loading: boolean;
  subscribe: () => Promise<boolean>;
  unsubscribe: () => Promise<void>;
}

// VAPID public key - to be set via environment
const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY || "";

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export function usePushNotifications(): UsePushNotificationsResult {
  const { user } = useAuth();
  const [isSupported, setIsSupported] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission | "unsupported">("unsupported");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  // Check support and current state
  useEffect(() => {
    const checkSupport = async () => {
      const supported = "Notification" in window && "serviceWorker" in navigator && "PushManager" in window;
      setIsSupported(supported);

      if (supported) {
        setPermission(Notification.permission);

        // Check if already subscribed
        if ("serviceWorker" in navigator) {
          try {
            const registration = await navigator.serviceWorker.ready;
            const subscription = await registration.pushManager.getSubscription();
            setIsSubscribed(!!subscription);
          } catch (err) {
            console.error("Error checking subscription:", err);
          }
        }
      }
    };

    checkSupport();
  }, []);

  // Register service worker
  const registerServiceWorker = async (): Promise<ServiceWorkerRegistration | null> => {
    if (!("serviceWorker" in navigator)) return null;

    try {
      const registration = await navigator.serviceWorker.register("/sw.js");
      await navigator.serviceWorker.ready;
      return registration;
    } catch (err) {
      console.error("Service worker registration failed:", err);
      return null;
    }
  };

  // Subscribe to push notifications
  const subscribe = useCallback(async (): Promise<boolean> => {
    if (!isSupported || !user || !supabase || !VAPID_PUBLIC_KEY) {
      console.warn("Push notifications not supported or VAPID key missing");
      return false;
    }

    setLoading(true);

    try {
      // Request permission
      const result = await Notification.requestPermission();
      setPermission(result);

      if (result !== "granted") {
        setLoading(false);
        return false;
      }

      // Register service worker
      const registration = await registerServiceWorker();
      if (!registration) {
        setLoading(false);
        return false;
      }

      // Subscribe to push
      const applicationServerKey = urlBase64ToUint8Array(VAPID_PUBLIC_KEY);
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: applicationServerKey.buffer as ArrayBuffer,
      });

      const subscriptionJSON = subscription.toJSON();

      // Save to database via edge function
      const { error } = await supabase.functions.invoke("register-push-subscription", {
        body: {
          action: "subscribe",
          subscription: {
            endpoint: subscriptionJSON.endpoint,
            keys: {
              p256dh: subscriptionJSON.keys?.p256dh,
              auth: subscriptionJSON.keys?.auth,
            },
          },
        },
      });

      if (error) throw error;

      setIsSubscribed(true);
      setLoading(false);
      return true;
    } catch (err) {
      console.error("Error subscribing to push:", err);
      setLoading(false);
      return false;
    }
  }, [isSupported, user]);

  // Unsubscribe from push notifications
  const unsubscribe = useCallback(async (): Promise<void> => {
    if (!isSupported || !user || !supabase) return;

    setLoading(true);

    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();

      if (subscription) {
        await subscription.unsubscribe();

        // Remove from database
        await supabase.functions.invoke("register-push-subscription", {
          body: {
            action: "unsubscribe",
            subscription: {
              endpoint: subscription.endpoint,
            },
          },
        });
      }

      setIsSubscribed(false);
    } catch (err) {
      console.error("Error unsubscribing from push:", err);
    } finally {
      setLoading(false);
    }
  }, [isSupported, user]);

  return {
    isSupported,
    permission,
    isSubscribed,
    loading,
    subscribe,
    unsubscribe,
  };
}
