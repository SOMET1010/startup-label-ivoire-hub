

# Lazy-Load Role-Specific Dashboard Modules

## Problem

While individual dashboard pages use `React.lazy()`, the three layout shells and their route wrapper components are **statically imported** in `App.tsx`:

```
import { StartupLayout } from "./components/startup/StartupLayout";
import { StructureLayout } from "./components/structure/StructureLayout";
import { InvestorLayout } from "./components/investor/InvestorLayout";
```

This pulls in all sidebar configs, header configs, hooks (`useLabelStatus`, `useNotifications`, `useSidebar`), and their dependencies (framer-motion animations, i18n keys, etc.) into the **main bundle** -- even for anonymous users visiting the public homepage.

## Solution

Lazy-load the entire route wrapper components (`StartupRoutes`, `StructureRoutes`, `InvestorRoutes`) so each role's dashboard module is only fetched when a user actually navigates to that path.

## Changes

### `src/App.tsx`

1. **Remove** the 3 static layout imports (lines 18-20)
2. **Remove** the 3 inline route wrapper component definitions (`StartupRoutes`, `StructureRoutes`, `InvestorRoutes` -- lines 89-170)
3. **Extract** each route wrapper into its own file and lazy-load it:

```typescript
const StartupRoutes = lazy(() => import("./routes/StartupRoutes"));
const StructureRoutes = lazy(() => import("./routes/StructureRoutes"));
const InvestorRoutes = lazy(() => import("./routes/InvestorRoutes"));
```

4. The route declarations stay identical -- only the import mechanism changes

### New files

| File | Content |
|------|---------|
| `src/routes/StartupRoutes.tsx` | Moves the existing `StartupRoutes` component (lines 90-135) into a dedicated file with its own imports |
| `src/routes/StructureRoutes.tsx` | Moves the existing `StructureRoutes` component (lines 138-152) |
| `src/routes/InvestorRoutes.tsx` | Moves the existing `InvestorRoutes` component (lines 155-170) |

Each file is a default export containing exactly the same JSX currently defined inline in App.tsx, plus the necessary imports (`ProtectedRoute`, `RoleGate`, `LabelGate`, layout, and lazy page components for that role only).

### Example: `src/routes/StartupRoutes.tsx`

```typescript
import { lazy } from "react";
import { Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { RoleGate } from "@/components/auth/RoleGate";
import { LabelGate } from "@/components/auth/LabelGate";
import { StartupLayout } from "@/components/startup/StartupLayout";

const StartupDashboard = lazy(() => import("@/pages/startup/Dashboard"));
// ... other lazy page imports

export default function StartupRoutes() {
  return (
    <ProtectedRoute>
      <RoleGate allowedRoles={['startup']}>
        <StartupLayout>
          <Routes>
            {/* same routes as before */}
          </Routes>
        </StartupLayout>
      </RoleGate>
    </ProtectedRoute>
  );
}
```

## Impact

- **Public visitors**: No dashboard code loaded at all (sidebars, headers, role hooks are excluded from main bundle)
- **Startup users**: Only startup module fetched; investor and structure modules never loaded
- **Zero behavior change**: Routing, auth guards, and layouts work identically
- **3 new files created, 1 file simplified** (App.tsx shrinks by ~80 lines)

## Files Summary

| Action | File |
|--------|------|
| Create | `src/routes/StartupRoutes.tsx` |
| Create | `src/routes/StructureRoutes.tsx` |
| Create | `src/routes/InvestorRoutes.tsx` |
| Modify | `src/App.tsx` (remove static imports + inline definitions, add 3 lazy imports) |

