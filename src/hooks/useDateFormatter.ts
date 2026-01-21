import { useCallback, useMemo } from 'react';
import { format, parseISO } from 'date-fns';
import { fr, enUS } from 'date-fns/locale';
import { useAuth, DateFormatPreference, LanguagePreference } from '@/contexts/AuthContext';

// Mapping des formats de date
const dateFormatMap: Record<DateFormatPreference, string> = {
  'dd/MM/yyyy': 'dd/MM/yyyy',
  'MM/dd/yyyy': 'MM/dd/yyyy',
  'yyyy-MM-dd': 'yyyy-MM-dd',
};

const dateTimeFormatMap: Record<DateFormatPreference, string> = {
  'dd/MM/yyyy': 'dd/MM/yyyy HH:mm',
  'MM/dd/yyyy': 'MM/dd/yyyy h:mm a',
  'yyyy-MM-dd': 'yyyy-MM-dd HH:mm',
};

const relativeFormatMap: Record<DateFormatPreference, string> = {
  'dd/MM/yyyy': 'd MMMM yyyy',
  'MM/dd/yyyy': 'MMMM d, yyyy',
  'yyyy-MM-dd': 'yyyy MMMM d',
};

export function useDateFormatter() {
  const { profile } = useAuth();

  const dateFormat = profile?.date_format ?? 'dd/MM/yyyy';
  const language = profile?.preferred_language ?? 'fr';

  const locale = useMemo(() => {
    return language === 'fr' ? fr : enUS;
  }, [language]);

  // Format a date string or Date object
  const formatDate = useCallback((
    date: string | Date | null | undefined,
    style: 'short' | 'long' | 'datetime' = 'short'
  ): string => {
    if (!date) return '-';

    try {
      const dateObj = typeof date === 'string' ? parseISO(date) : date;

      let formatString: string;
      switch (style) {
        case 'long':
          formatString = relativeFormatMap[dateFormat];
          break;
        case 'datetime':
          formatString = dateTimeFormatMap[dateFormat];
          break;
        default:
          formatString = dateFormatMap[dateFormat];
      }

      return format(dateObj, formatString, { locale });
    } catch (error) {
      console.error('Error formatting date:', error);
      return String(date);
    }
  }, [dateFormat, locale]);

  // Format relative time (e.g., "il y a 2 heures")
  const formatRelative = useCallback((date: string | Date | null | undefined): string => {
    if (!date) return '-';

    try {
      const dateObj = typeof date === 'string' ? parseISO(date) : date;
      const now = new Date();
      const diffMs = now.getTime() - dateObj.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      if (language === 'fr') {
        if (diffMins < 1) return "À l'instant";
        if (diffMins < 60) return `Il y a ${diffMins} min`;
        if (diffHours < 24) return `Il y a ${diffHours}h`;
        if (diffDays < 7) return `Il y a ${diffDays} jour${diffDays > 1 ? 's' : ''}`;
        return formatDate(dateObj, 'long');
      } else {
        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins} min ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
        return formatDate(dateObj, 'long');
      }
    } catch (error) {
      return String(date);
    }
  }, [language, formatDate]);

  return {
    formatDate,
    formatRelative,
    dateFormat,
    language,
    locale,
  };
}
