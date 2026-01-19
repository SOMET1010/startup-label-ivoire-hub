import { useState, useEffect, ReactNode } from "react";
import { LucideIcon, Info, AlertTriangle, XCircle, CheckCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

type AlertVariant = 'info' | 'warning' | 'error' | 'success';

const VARIANT_STYLES: Record<AlertVariant, { 
  bg: string; 
  border: string; 
  text: string; 
  icon: LucideIcon; 
  iconColor: string;
}> = {
  info: { 
    bg: "bg-blue-50 dark:bg-blue-950/30", 
    border: "border-blue-200 dark:border-blue-800", 
    text: "text-blue-800 dark:text-blue-200",
    icon: Info,
    iconColor: "text-blue-600 dark:text-blue-400"
  },
  warning: { 
    bg: "bg-amber-50 dark:bg-amber-950/30", 
    border: "border-amber-200 dark:border-amber-800", 
    text: "text-amber-800 dark:text-amber-200",
    icon: AlertTriangle,
    iconColor: "text-amber-600 dark:text-amber-400"
  },
  error: { 
    bg: "bg-destructive/10", 
    border: "border-destructive/30", 
    text: "text-destructive",
    icon: XCircle,
    iconColor: "text-destructive"
  },
  success: { 
    bg: "bg-green-50 dark:bg-green-950/30", 
    border: "border-green-200 dark:border-green-800", 
    text: "text-green-800 dark:text-green-200",
    icon: CheckCircle,
    iconColor: "text-green-600 dark:text-green-400"
  },
};

interface AlertBannerAction {
  label: string;
  onClick: () => void;
  icon?: LucideIcon;
}

interface AlertBannerProps {
  variant: AlertVariant;
  title: string;
  description?: string | ReactNode;
  icon?: LucideIcon;
  dismissible?: boolean;
  onDismiss?: () => void;
  persistKey?: string;
  persistDuration?: number; // in milliseconds, default 24h
  action?: AlertBannerAction;
  position?: 'inline' | 'sticky-top' | 'sticky-bottom';
  className?: string;
}

export function AlertBanner({
  variant,
  title,
  description,
  icon,
  dismissible = false,
  onDismiss,
  persistKey,
  persistDuration = 24 * 60 * 60 * 1000, // 24 hours default
  action,
  position = 'inline',
  className,
}: AlertBannerProps) {
  const [isDismissed, setIsDismissed] = useState(false);
  const styles = VARIANT_STYLES[variant];
  const Icon = icon || styles.icon;

  useEffect(() => {
    if (persistKey) {
      const dismissedData = localStorage.getItem(`alert-banner-${persistKey}`);
      if (dismissedData) {
        const dismissedTime = parseInt(dismissedData, 10);
        if (Date.now() - dismissedTime < persistDuration) {
          setIsDismissed(true);
        } else {
          // Expired, remove from storage
          localStorage.removeItem(`alert-banner-${persistKey}`);
        }
      }
    }
  }, [persistKey, persistDuration]);

  const handleDismiss = () => {
    if (persistKey) {
      localStorage.setItem(`alert-banner-${persistKey}`, Date.now().toString());
    }
    setIsDismissed(true);
    onDismiss?.();
  };

  if (isDismissed) return null;

  const positionClasses = {
    'inline': '',
    'sticky-top': 'sticky top-0 z-40 rounded-none border-x-0 border-t-0',
    'sticky-bottom': 'sticky bottom-0 z-40 rounded-none border-x-0 border-b-0',
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: position === 'sticky-bottom' ? 20 : -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: position === 'sticky-bottom' ? 20 : -20 }}
        transition={{ duration: 0.3 }}
        role="alert"
        className={cn(
          "w-full border rounded-lg p-4",
          styles.bg,
          styles.border,
          positionClasses[position],
          className
        )}
      >
        <div className="flex items-start gap-3">
          <Icon className={cn("h-5 w-5 flex-shrink-0 mt-0.5", styles.iconColor)} />
          
          <div className="flex-1 min-w-0">
            <h4 className={cn("font-semibold text-sm", styles.text)}>
              {title}
            </h4>
            {description && (
              <div className={cn("mt-1 text-sm opacity-90", styles.text)}>
                {description}
              </div>
            )}
            {action && (
              <Button 
                size="sm" 
                variant="outline" 
                onClick={action.onClick}
                className="mt-3 gap-2"
              >
                {action.icon && <action.icon className="h-4 w-4" />}
                {action.label}
              </Button>
            )}
          </div>
          
          {dismissible && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDismiss}
              className={cn(
                "h-6 w-6 flex-shrink-0 hover:bg-black/5 dark:hover:bg-white/10",
                styles.text
              )}
              aria-label="Fermer"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
