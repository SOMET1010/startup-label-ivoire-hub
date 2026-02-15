

# Enable Password HIBP Check and Document for Team

## Context

The `SUPA_auth_leaked_password_protection` security warning requires enabling a platform-level toggle. The documentation file `public/documents/enable-leaked-password-protection.md` already exists.

## What will be done

### 1. Enable HIBP Check (Manual platform action)

This setting is a platform-level authentication configuration that cannot be toggled via code or migrations. A team member must perform the following one-time action:

1. Open the **Cloud** tab in the left sidebar
2. Navigate to **Users** > **Auth settings** > **Email**
3. Enable the **Password HIBP Check** toggle
4. Click **Save**

### 2. Update security finding

Once the toggle is enabled, update the `SUPA_auth_leaked_password_protection` security finding to mark it as resolved (delete the finding).

### 3. Verify

Re-run the security scan to confirm the warning no longer appears.

## Important note

The documentation file already exists at `public/documents/enable-leaked-password-protection.md` with complete instructions, verification steps, and a sign-off section. No new files need to be created.

The only code-level action is deleting/updating the security finding after the platform toggle is confirmed enabled.

