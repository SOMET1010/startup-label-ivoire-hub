import { LucideIcon, SearchX, AlertCircle, CheckCircle2, FolderOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

type IllustrationType = 'search' | 'empty' | 'error' | 'success';

const ILLUSTRATIONS: Record<IllustrationType, { icon: LucideIcon; bgClass: string; iconClass: string }> = {
  search: { 
    icon: SearchX, 
    bgClass: "bg-muted/50", 
    iconClass: "text-muted-foreground" 
  },
  empty: { 
    icon: FolderOpen, 
    bgClass: "bg-muted/50", 
    iconClass: "text-muted-foreground" 
  },
  error: { 
    icon: AlertCircle, 
    bgClass: "bg-destructive/10", 
    iconClass: "text-destructive" 
  },
  success: { 
    icon: CheckCircle2, 
    bgClass: "bg-green-50 dark:bg-green-950/30", 
    iconClass: "text-green-600 dark:text-green-400" 
  },
};

interface EmptyStateAction {
  label: string;
  onClick: () => void;
  icon?: LucideIcon;
}

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: EmptyStateAction;
  secondaryAction?: { label: string; onClick: () => void };
  variant?: 'default' | 'card' | 'compact';
  illustration?: IllustrationType;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  secondaryAction,
  variant = 'default',
  illustration = 'empty',
  className,
}: EmptyStateProps) {
  const illustrationConfig = ILLUSTRATIONS[illustration];
  const Icon = icon || illustrationConfig.icon;
  
  const content = (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "flex flex-col items-center justify-center text-center",
        variant === 'compact' ? "py-6 px-4" : "py-12 px-6",
        className
      )}
    >
      <div className={cn(
        "rounded-full mb-4",
        variant === 'compact' ? "p-3" : "p-4",
        illustrationConfig.bgClass
      )}>
        <Icon className={cn(
          variant === 'compact' ? "h-8 w-8" : "h-12 w-12",
          illustrationConfig.iconClass
        )} />
      </div>
      
      <h3 className={cn(
        "font-semibold mb-2",
        variant === 'compact' ? "text-base" : "text-lg"
      )}>
        {title}
      </h3>
      
      {description && (
        <p className={cn(
          "text-muted-foreground max-w-md",
          variant === 'compact' ? "text-sm" : "text-base"
        )}>
          {description}
        </p>
      )}
      
      {(action || secondaryAction) && (
        <div className="flex items-center gap-3 mt-6">
          {action && (
            <Button onClick={action.onClick} className="gap-2">
              {action.icon && <action.icon className="h-4 w-4" />}
              {action.label}
            </Button>
          )}
          {secondaryAction && (
            <Button variant="outline" onClick={secondaryAction.onClick}>
              {secondaryAction.label}
            </Button>
          )}
        </div>
      )}
    </motion.div>
  );

  if (variant === 'card') {
    return (
      <Card className={className}>
        <CardContent className="pt-6">
          {content}
        </CardContent>
      </Card>
    );
  }

  return content;
}
