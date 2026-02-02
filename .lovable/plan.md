
## Plan : Sélecteur de langue dans le dropdown utilisateur

### Objectif
Ajouter un sélecteur de langue compact directement dans le menu dropdown de l'utilisateur connecté, permettant un changement de langue rapide sans naviguer vers les paramètres.

---

### Design proposé

```
┌─────────────────────────────────────┐
│  Jean Dupont                        │
│  jean@startup.ci                    │
├─────────────────────────────────────┤
│  👤 Mon profil                      │
│  ⚙️ Paramètres                       │
├─────────────────────────────────────┤
│  🌐 Langue                          │
│     ┌─────────────────────────────┐ │
│     │ 🇫🇷 FR  │  🇬🇧 EN            │ │
│     └─────────────────────────────┘ │
├─────────────────────────────────────┤
│  🚪 Déconnexion                     │
└─────────────────────────────────────┘
```

---

### Phase 1 : Ajouter les traductions

#### `src/i18n/locales/fr/dashboard.json`
```json
{
  "header": {
    "userMenu": {
      "language": "Langue"
    }
  }
}
```

#### `src/i18n/locales/en/dashboard.json`
```json
{
  "header": {
    "userMenu": {
      "language": "Language"
    }
  }
}
```

---

### Phase 2 : Créer un composant compact `LanguageToggle`

#### Fichier : `src/components/settings/LanguageToggle.tsx`

```typescript
import { useTranslation } from "react-i18next";
import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUserPreferences } from "@/hooks/useUserPreferences";
import { LanguagePreference } from "@/contexts/AuthContext";

const LANGUAGES: { code: LanguagePreference; flag: string; short: string }[] = [
  { code: "fr", flag: "🇫🇷", short: "FR" },
  { code: "en", flag: "🇬🇧", short: "EN" },
];

interface LanguageToggleProps {
  showLabel?: boolean;
}

export function LanguageToggle({ showLabel = true }: LanguageToggleProps) {
  const { t, i18n } = useTranslation('dashboard');
  const { setLanguage, isSyncing } = useUserPreferences();

  const handleLanguageChange = async (lang: LanguagePreference) => {
    await setLanguage(lang);
    i18n.changeLanguage(lang);
  };

  return (
    <div className="px-2 py-1.5">
      {showLabel && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <Globe className="h-4 w-4" />
          <span>{t('header.userMenu.language')}</span>
        </div>
      )}
      <div className="flex gap-1">
        {LANGUAGES.map((lang) => (
          <Button
            key={lang.code}
            variant={i18n.language === lang.code ? "secondary" : "ghost"}
            size="sm"
            className="flex-1 gap-1"
            onClick={() => handleLanguageChange(lang.code)}
            disabled={isSyncing}
          >
            <span>{lang.flag}</span>
            <span>{lang.short}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}
```

**Caractéristiques :**
- Design compact avec boutons toggle (FR | EN)
- Utilise `useUserPreferences` pour sauvegarder en base de données
- Synchronise i18n immédiatement
- État désactivé pendant la synchronisation
- Label optionnel avec icône Globe

---

### Phase 3 : Intégrer dans StartupHeader.tsx

```typescript
import { Globe } from "lucide-react";
import { LanguageToggle } from "@/components/settings/LanguageToggle";

// Dans le DropdownMenuContent, après les items Profil/Paramètres :
<DropdownMenuSeparator />

{/* Sélecteur de langue */}
<LanguageToggle />

<DropdownMenuSeparator />
<DropdownMenuItem onClick={handleSignOut} className="text-destructive">
  <LogOut className="mr-2 h-4 w-4" />
  <span>{t('header.userMenu.logout')}</span>
</DropdownMenuItem>
```

---

### Fichiers à modifier

| Fichier | Action |
|---------|--------|
| `src/components/settings/LanguageToggle.tsx` | **Créer** le composant compact |
| `src/components/startup/StartupHeader.tsx` | Intégrer le `LanguageToggle` |
| `src/i18n/locales/fr/dashboard.json` | Ajouter clé `header.userMenu.language` |
| `src/i18n/locales/en/dashboard.json` | Ajouter clé `header.userMenu.language` |

---

### Comportement

| Action | Résultat |
|--------|----------|
| Clic sur FR/EN | Changement immédiat de la langue |
| Sauvegarde | Mise à jour du profil dans Lovable Cloud |
| Rechargement | Langue restaurée depuis le profil utilisateur |
| Pendant sync | Boutons désactivés avec état de chargement |

---

### Avantages de cette approche

1. **Accès rapide** : Changement de langue en 2 clics (avatar → langue)
2. **Persistance** : Synchronisé avec le profil utilisateur en base de données
3. **UX cohérente** : Design toggle compact adapté au dropdown
4. **Réutilisable** : Composant `LanguageToggle` utilisable ailleurs si besoin
5. **Non intrusif** : Ne surcharge pas le menu principal
