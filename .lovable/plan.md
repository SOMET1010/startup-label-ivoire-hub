
# Enable Leaked Password Protection (HIBP Check)

## Context

The security scan has one remaining "warn" level finding: **Leaked Password Protection Disabled** (`SUPA_auth_leaked_password_protection`). This is a platform-level setting that cannot be toggled via code or database migrations.

## What needs to happen

### 1. Manual Platform Action (must be done by a team member)

Open the Lovable Cloud panel and follow these steps:

1. Click the **Cloud** tab in the left sidebar
2. Navigate to **Users** > **Auth settings** > **Email**
3. Enable the **Password HIBP Check** toggle
4. Save the settings

This enables validation of passwords against the Have I Been Pwned database, rejecting known compromised passwords at signup and password change.

### 2. Create Team Documentation

Create the file `public/documents/enable-leaked-password-protection.md` with:

- Purpose and security rationale
- Step-by-step instructions (as above)
- Expected outcome (compromised passwords rejected, security warning cleared)
- Verification steps (re-run security scan to confirm the warning disappears)
- A sign-off section for the team member who completes the action

### 3. Update Security Finding

After documenting, update the `SUPA_auth_leaked_password_protection` finding to note that documentation is in place and the action is pending manual execution by a team member.

## Files affected

| Action | File |
|--------|------|
| Create | `public/documents/enable-leaked-password-protection.md` |

## Important Note

No code changes resolve this issue. A team member must perform the one-time toggle in the Cloud panel. Once enabled, the next security scan will automatically clear the warning.
