# Enable Leaked Password Protection (HIBP Check)

## Purpose

Enabling leaked password protection validates user passwords against the [Have I Been Pwned](https://haveibeenpwned.com/) (HIBP) database during signup and password changes. Compromised passwords found in known data breaches are automatically rejected, significantly reducing the risk of credential-stuffing attacks.

## Steps

1. Open **Lovable Cloud** (Cloud tab in the left sidebar)
2. Navigate to **Users** → **Auth settings** → **Email**
3. Enable the **Password HIBP Check** toggle
4. Click **Save**

## Expected Outcome

- Users attempting to set a password found in the HIBP database will receive an error and must choose a different password.
- The `SUPA_auth_leaked_password_protection` security warning will be cleared on the next security scan.

## Verification

1. Re-run the security scan from the Security view.
2. Confirm the `Leaked Password Protection Disabled` warning no longer appears.
3. (Optional) Test by attempting to sign up with a known compromised password (e.g., `Password1`) and verifying it is rejected.

## Sign-off

| Field | Value |
|-------|-------|
| Completed by | |
| Date | |
| Verified by | |
