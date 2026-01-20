import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export type Theme = 'light' | 'dark' | 'system';

export function useAppTheme() {
  const { theme, setTheme, systemTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Éviter le flash de contenu incorrect (hydration mismatch)
  useEffect(() => {
    setMounted(true);
  }, []);

  return {
    theme: theme as Theme,
    setTheme,
    resolvedTheme: resolvedTheme as 'light' | 'dark',
    systemTheme,
    mounted,
    isDark: resolvedTheme === 'dark',
  };
}
