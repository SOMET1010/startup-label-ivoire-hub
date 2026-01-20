import { Moon, Sun } from 'lucide-react';
import { useAppTheme } from '@/hooks/useAppTheme';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

export function ThemeToggle() {
  const { isDark, setTheme, mounted } = useAppTheme();

  if (!mounted) {
    return (
      <div className="flex items-center justify-between rounded-lg border p-4 animate-pulse">
        <div className="space-y-2">
          <div className="h-5 w-32 bg-muted rounded" />
          <div className="h-4 w-56 bg-muted rounded" />
        </div>
        <div className="h-6 w-11 bg-muted rounded-full" />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between rounded-lg border p-4">
      <div className="space-y-0.5">
        <Label className="text-base flex items-center gap-2">
          {isDark ? (
            <Moon className="h-4 w-4 text-blue-500" />
          ) : (
            <Sun className="h-4 w-4 text-amber-500" />
          )}
          Mode sombre
        </Label>
        <p className="text-sm text-muted-foreground">
          Activer le thème sombre pour réduire la fatigue visuelle
        </p>
      </div>
      <Switch
        checked={isDark}
        onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
        aria-label="Basculer le mode sombre"
      />
    </div>
  );
}
