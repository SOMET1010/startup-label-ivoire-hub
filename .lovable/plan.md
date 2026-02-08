

# Tighten Newsletter Subscriber INSERT Policy

## Current State

The `newsletter_subscribers` table has an INSERT policy called **"Anyone can subscribe"** with `WITH CHECK (true)`, meaning any user (including anonymous) can insert any data without database-level validation. This was flagged by the linter as overly permissive.

By contrast, the `contact_messages` table already has a well-validated INSERT policy that checks:
- Fields are not null
- Trimmed length is greater than 0
- Maximum length constraints

## Proposed Change

Replace the current permissive `WITH CHECK (true)` INSERT policy with a validated one that enforces:

1. **Email is not null** and not empty after trimming
2. **Email length** does not exceed 255 characters
3. **Email format** contains an `@` symbol (basic sanity check at the DB level)
4. **Source field** length does not exceed 50 characters (if provided)

## Technical Details

A single SQL migration will:

1. **Drop** the existing "Anyone can subscribe" policy
2. **Create** a new "Anyone can subscribe with validation" policy with proper `WITH CHECK` constraints

```sql
DROP POLICY IF EXISTS "Anyone can subscribe" ON public.newsletter_subscribers;

CREATE POLICY "Anyone can subscribe with validation"
  ON public.newsletter_subscribers
  FOR INSERT
  WITH CHECK (
    email IS NOT NULL
    AND length(trim(email)) > 0
    AND length(email) <= 255
    AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
    AND (source IS NULL OR length(source) <= 50)
  );
```

This uses the same defensive pattern as `contact_messages` and adds a regex check (`~*`) for basic email format validation (must have `user@domain.tld` structure).

3. **Update the security finding**: Delete the `SUPA_rls_policy_always_true` finding since the policy will no longer use `true`.

## Impact

- **No code changes needed** -- the client-side `NewsletterBanner.tsx` already validates email format before submitting
- The database now acts as a second line of defense against malformed or empty email submissions
- The linter warning about `WITH CHECK (true)` will be resolved

