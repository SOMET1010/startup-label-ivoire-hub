

## Create a test admin account

Since we cannot directly create users through the database (auth users must be created via the Auth API), the approach is to use a temporary backend function that creates the user with the service role key.

### Steps

1. **Create a temporary backend function** `create-test-admin` that:
   - Uses the Supabase Admin API (service role) to create a user with known credentials
   - Email: `admin-test@label-ia.ci`
   - Password: `AdminTest2026!`
   - The existing `handle_new_user` database trigger will auto-create the profile and assign the `startup` role

2. **Call the function** to create the user

3. **Promote the user to admin** via a database update:
   - Update the user's role in `user_roles` from `startup` to `admin`

4. **Auto-confirm the email** so the account is immediately usable (since this is a test account, no email verification needed)

5. **Delete the temporary function** after use (it should not remain deployed for security reasons)

### Test credentials

- **Email**: `admin-test@label-ia.ci`
- **Password**: `AdminTest2026!`
- **Role**: `admin`

After creation, you can log in at `/connexion` and navigate to `/admin` to test the dashboard.

---

### Technical details

**New file** (temporary): `supabase/functions/create-test-admin/index.ts`
- Uses `supabase.auth.admin.createUser()` with `email_confirm: true` to skip email verification
- Returns the created user ID

**Database change**: Update `user_roles` to set role = `admin` for the new user

**Cleanup**: Delete the `create-test-admin` edge function after successful account creation

