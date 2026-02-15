import { useEffect } from "react";
import { useLocation } from "react-router-dom";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;

export function GoogleAnalytics() {
  const location = useLocation();

  useEffect(() => {
    if (!GA_MEASUREMENT_ID) return;

    // Load gtag script dynamically
    if (!document.querySelector(`script[src*="googletagmanager"]`)) {
      const script = document.createElement("script");
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
      document.head.appendChild(script);

      window.dataLayer = window.dataLayer || [];
      window.gtag = function () {
        window.dataLayer!.push(arguments);
      };
      window.gtag("js", new Date());
      window.gtag("config", GA_MEASUREMENT_ID, { send_page_view: false });
    }
  }, []);

  // Track page views on route change
  useEffect(() => {
    if (!GA_MEASUREMENT_ID || !window.gtag) return;
    window.gtag("event", "page_view", {
      page_path: location.pathname + location.search,
      page_title: document.title,
    });
  }, [location]);

  return null;
}
