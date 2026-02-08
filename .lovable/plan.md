

## Quick Login for Development Mode

Add a development-only panel on the login page (`/connexion`) that displays buttons to instantly log in as different user roles. This panel will only be visible in development mode (`import.meta.env.DEV`) and will never appear in production.

### Prerequisites

Before implementing the quick login, the test admin account (`admin-test@label-ia.ci`) needs to be promoted from `startup` to `admin` in the database -- it was created but the role update is still pending.

### What will be built

A collapsible "Dev Quick Login" panel below the login form with:
- Colored buttons for each available test role (Admin, Startup)
- Each button shows the role name and associated email
- Clicking a button auto-fills credentials and submits the login form
- A yellow/orange dev-mode visual indicator so it's clearly distinguishable from production UI
- The entire component is wrapped in an `import.meta.env.DEV` check so Vite tree-shakes it out of production builds

### Available test accounts

| Role    | Email                    | Password        |
|---------|--------------------------|-----------------|
| Admin   | admin-test@label-ia.ci   | AdminTest2026!  |
| Startup | edwardelrick99@gmail.com | (unknown)       |

Since only the admin test account has a known password, the quick login will initially only include that account. Additional test accounts for other roles (startup, structure, investor) can be added later.

---

### Technical details

**Database change**: Update `user_roles` to set role = `admin` for user `864825c6-0164-4b75-9eb1-488228666ffa`.

**New file**: `src/components/auth/DevQuickLogin.tsx`
- A self-contained component guarded by `import.meta.env.DEV`
- Accepts an `onQuickLogin(email, password)` callback prop
- Renders a styled panel with role-based login buttons
- Uses a `Bug` or `Zap` icon from lucide-react for the dev indicator
- Collapsible via a toggle to keep the UI clean

**Modified file**: `src/pages/Auth.tsx`
- Import and render `DevQuickLogin` below the login card (inside the `!showSignup` block)
- Pass the `signIn` function (or a wrapper) as the `onQuickLogin` callback
- Only imported and rendered when `import.meta.env.DEV` is true

**Cleanup**: Delete the temporary `create-test-admin` edge function and its config entry since the account has been created.

