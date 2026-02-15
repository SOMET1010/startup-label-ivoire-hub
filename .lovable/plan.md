

# Phase 4 -- Unification des Layouts et Headers

## 4A. Layout generique `DashboardLayout`

Les 3 fichiers `StartupLayout`, `StructureLayout`, `InvestorLayout` sont strictement identiques (AuthProvider > SidebarProvider > div > Sidebar + SidebarInset > Header + main). Ils seront remplaces par un unique composant generique.

**Creer `src/components/shared/DashboardLayout.tsx`** (~30 lignes)

```typescript
interface DashboardLayoutProps {
  sidebar: React.ReactNode;
  header: React.ReactNode;
  children: React.ReactNode;
}
```

- Recoit le sidebar et le header en props (pas de role-switching interne)
- Contient le shell : AuthProvider, SidebarProvider, div flex, SidebarInset, Suspense

**Modifier les 3 Layouts existants** pour devenir des wrappers d'une ligne :

```typescript
// StartupLayout.tsx (~8 lignes)
export function StartupLayout({ children }) {
  return (
    <DashboardLayout sidebar={<StartupSidebar />} header={<StartupHeader />}>
      {children}
    </DashboardLayout>
  );
}
```

Idem pour `StructureLayout` et `InvestorLayout`. Les fichiers existants restent en place (pas de changement d'imports dans App.tsx), mais la duplication du shell est eliminee.

---

## 4B. Header generique `DashboardHeader`

Les 3 headers (`StartupHeader`, `StructureHeader`, `InvestorHeader`) sont identiques sauf :
- `ROUTE_KEYS` (map path -> i18n key)
- `breadcrumbRoot` (label + href du premier breadcrumb)
- `profilePath` et `settingsPath` (liens dans le dropdown)
- `defaultInitials` ("ST", "SA", "IN")

**Creer `src/components/shared/DashboardHeader.tsx`** (~100 lignes)

```typescript
interface DashboardHeaderProps {
  routeKeys: Record<string, string>;
  rootBreadcrumb: { label: string; href: string };
  profilePath: string;
  settingsPath: string;
  defaultInitials?: string;
}
```

- Contient toute la logique breadcrumbs, avatar, dropdown, NotificationBell, LanguageToggle, signOut
- Les 3 headers existants deviennent des wrappers de configuration (~15 lignes chacun)

---

## 4C. Sidebar generique `DashboardSidebar`

Les 3 sidebars partagent la meme structure mais different par :
- Les items de navigation (icones, labels, hrefs, `labelOnly`)
- L'icone du header (Award, Building2, Briefcase)
- Le sous-titre i18n
- Le contenu du footer (nom startup vs label statique)

**Creer `src/components/shared/DashboardSidebar.tsx`** (~130 lignes)

```typescript
interface NavItem {
  icon: LucideIcon;
  labelKey: string;
  href: string;
  exact?: boolean;
  labelOnly?: boolean;
  hasBadge?: boolean;
}

interface DashboardSidebarProps {
  navItems: NavItem[];
  headerIcon: LucideIcon;
  subtitleKey: string;
  backToHomeKey: string;
  footer: React.ReactNode;
}
```

- Le rendu des items (active state, disabled state, badge unread, chevron) est mutualise
- Le footer reste un `ReactNode` libre car il differe significativement (startup montre le nom + status du label, les autres montrent un label statique)
- Les 3 sidebars existants deviennent des wrappers de configuration (~40-60 lignes)

---

## 4D. Fusion `investors/` dans `investor/`

- Deplacer `src/components/investors/InvestorContactDialog.tsx` vers `src/components/investor/InvestorContactDialog.tsx`
- Deplacer `src/components/investors/InvestorSuccessStories.tsx` vers `src/components/investor/InvestorSuccessStories.tsx`
- Mettre a jour les imports dans `src/pages/Investisseurs.tsx` (seul fichier consommateur)
- Supprimer le dossier `src/components/investors/`

---

## Ordre d'implementation

1. Creer `DashboardLayout` + simplifier les 3 layouts
2. Creer `DashboardHeader` + simplifier les 3 headers
3. Creer `DashboardSidebar` + simplifier les 3 sidebars
4. Fusionner `investors/` dans `investor/`
5. Mettre a jour `.lovable/plan.md`

## Resultats attendus

| Metrique | Avant | Apres |
|----------|-------|-------|
| Lignes Layout (3 fichiers) | 3 x 30 = 90 | 30 (shared) + 3 x 8 = 54 |
| Lignes Header (3 fichiers) | 3 x 165 = 495 | 100 (shared) + 3 x 15 = 145 |
| Lignes Sidebar (3 fichiers) | 246 + 187 + 193 = 626 | 130 (shared) + 60 + 40 + 40 = 270 |
| Dossiers `investor*` | 2 | 1 |
| **Total** | ~1211 lignes | ~469 lignes |

## Risques

| Risque | Mitigation |
|--------|------------|
| Startup sidebar a des features uniques (labelOnly, badges) | Le composant generique supporte ces props via l'interface NavItem |
| Import paths changent pour investors | Un seul fichier a mettre a jour (Investisseurs.tsx) |
| Les layouts restent en place | Aucun changement d'imports dans App.tsx, zero risque de regression sur le routing |
