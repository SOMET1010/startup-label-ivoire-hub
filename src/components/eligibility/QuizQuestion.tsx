import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface QuizQuestionProps {
  icon: ReactNode;
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}

export function QuizQuestion({ icon, title, description, children, className }: QuizQuestionProps) {
  return (
    <div className={cn("space-y-6 animate-fade-in", className)}>
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary">
          {icon}
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold text-foreground">{title}</h2>
          {description && (
            <p className="text-muted-foreground max-w-md mx-auto">{description}</p>
          )}
        </div>
      </div>
      
      <div className="mt-8">
        {children}
      </div>
    </div>
  );
}
