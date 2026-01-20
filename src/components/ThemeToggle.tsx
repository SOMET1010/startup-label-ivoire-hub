import { Moon, Sun, Monitor } from 'lucide-react';
import { useAppTheme, Theme } from '@/hooks/useAppTheme';
import { Label } from '@/components/ui/label';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme, mounted } = useAppTheme();

  if (!mounted) {
    return (
      <div className="rounded-lg border p-4 animate-pulse">
        <div className="space-y-3">
          <div className="h-5 w-24 bg-muted rounded" />
          <div className="h-4 w-56 bg-muted rounded" />
          <div className="h-10 w-full bg-muted rounded" />
        </div>
      </div>
    );
  }

  const themeOptions: { value: Theme; label: string; icon: React.ReactNode }[] = [
    { value: 'light', label: 'Clair', icon: <Sun className="h-4 w-4" /> },
    { value: 'dark', label: 'Sombre', icon: <Moon className="h-4 w-4" /> },
    { value: 'system', label: 'Système', icon: <Monitor className="h-4 w-4" /> },
  ];

  return (
    <div className="rounded-lg border p-4 space-y-4">
      <div className="space-y-1">
        <Label className="text-base">Apparence</Label>
        <p className="text-sm text-muted-foreground">
          Choisissez le thème de l'interface
        </p>
      </div>

      <ToggleGroup
        type="single"
        value={theme}
        onValueChange={(value) => value && setTheme(value as Theme)}
        className="grid grid-cols-3 gap-2"
      >
        {themeOptions.map(({ value, label, icon }) => (
          <ToggleGroupItem
            key={value}
            value={value}
            aria-label={`Thème ${label}`}
            className="flex flex-col items-center gap-1.5 py-3 px-2 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
          >
            {icon}
            <span className="text-xs font-medium">{label}</span>
          </ToggleGroupItem>
        ))}
      </ToggleGroup>

      {theme === 'system' && (
        <p className="text-xs text-muted-foreground flex items-center gap-1.5">
          <span className="inline-block h-2 w-2 rounded-full bg-primary" />
          Mode actuel : {resolvedTheme === 'dark' ? 'Sombre' : 'Clair'} (via système)
        </p>
      )}
    </div>
  );
}
