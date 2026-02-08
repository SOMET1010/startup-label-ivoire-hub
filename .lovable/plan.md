

## Fix: 404 on login redirect

**Problem**: When an unauthenticated user tries to access a protected page, the `ProtectedRoute` component redirects to `/auth/connexion`, which is not a registered route. This causes the 404 page to appear instead of the login form.

**Root cause**: Mismatch between the redirect target in `ProtectedRoute.tsx` and the actual route definitions in `App.tsx`.

**Solution**: Update `ProtectedRoute.tsx` to redirect to `/connexion` instead of `/auth/connexion`, matching the existing route configuration.

---

### Technical details

**File to modify**: `src/components/auth/ProtectedRoute.tsx`

Change the `Navigate` target from `/auth/connexion` to `/connexion` (line 14).

This single-line fix aligns the redirect with the route definitions in `App.tsx`:
- `/auth` -- Auth page
- `/connexion` -- Auth page (alias)
- `/inscription` -- Auth page (alias)

No other files need to change.

