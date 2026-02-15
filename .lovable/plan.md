

# Role-Based Access Control Hardening

## Current State

The project already has a solid RBAC foundation:
- `ProtectedRoute` redirects unauthenticated users to `/connexion`
- `RoleGate` checks user roles on all dashboard routes (`/startup/*`, `/structure/*`, `/investor/*`, `/admin/*`)
- `LabelGate` restricts premium features to labeled startups
- Post-login redirect in `Auth.tsx` sends users to their role-specific dashboard
- Database-level RLS policies enforce data isolation

## Gaps to Address

### 1. RoleGate shows a dead-end 403 page
When a startup user manually navigates to `/admin` or `/investor`, they see a static 403 page with no navigation or way out. This should redirect them to their own dashboard instead.

### 2. No role-aware redirect hook
There's no reusable utility to compute the correct dashboard path from a role. The logic is duplicated in `Auth.tsx` and `Navbar.tsx`.

### 3. `/suivi-candidature` has no role restriction
Any authenticated user (investor, structure, admin) can access this page, which is only relevant to startup users. It should be restricted to the `startup` role (and `admin` for oversight).

---

## Implementation Plan

### Step 1: Create a shared redirect utility

Create `src/lib/utils/roleRedirect.ts` (~10 lines):
- Export a `getDashboardPath(role)` function returning the correct dashboard path for any role
- Replace the duplicated `redirectMap` in `Auth.tsx` and `getDashboardLink()` in `Navbar.tsx`

### Step 2: Improve RoleGate with smart redirect

Update `src/components/auth/RoleGate.tsx`:
- Instead of showing a static 403 page, add a `redirectTo` optional prop (defaults to auto-redirect based on role)
- When the user has a role but it's not in `allowedRoles`, redirect them to their correct dashboard using `getDashboardPath(userRole)`
- Add a "back to dashboard" link as fallback if redirect is not desired
- Keep the 403 display only for users with no role at all (`public`)

### Step 3: Protect `/suivi-candidature` route

Update `src/App.tsx`:
- Wrap the `/suivi-candidature` route with `ProtectedRoute` and `RoleGate allowedRoles={['startup', 'admin']}`
- Remove the manual auth check from `SuiviCandidature.tsx` since it will be handled by the wrappers

### Step 4: Update Auth.tsx and Navbar.tsx

- Replace inline redirect maps with the shared `getDashboardPath()` utility
- No behavior change, just deduplication

---

## Technical Details

### RoleGate updated behavior

```text
User visits /admin with role "startup":
  Before: Static 403 page (dead end)
  After:  Redirect to /startup (their dashboard)

User visits /investor with role "startup":
  Before: Static 403 page (dead end)
  After:  Redirect to /startup (their dashboard)

User visits /startup with no role (public):
  Before: Static 403 page
  After:  Same (403 page with link to home)
```

### Files to create
| File | Purpose |
|------|---------|
| `src/lib/utils/roleRedirect.ts` | Shared role-to-path mapping |

### Files to modify
| File | Change |
|------|--------|
| `src/components/auth/RoleGate.tsx` | Smart redirect instead of 403 |
| `src/App.tsx` | Protect `/suivi-candidature` |
| `src/pages/SuiviCandidature.tsx` | Remove manual auth check |
| `src/pages/Auth.tsx` | Use shared utility |
| `src/components/Navbar.tsx` | Use shared utility |

### No database or RLS changes needed
The existing RLS policies already enforce proper data isolation at the database level. These changes are purely frontend UX improvements to prevent users from seeing dead-end pages.
