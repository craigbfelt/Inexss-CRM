# Supabase Migration Instructions

## Problem
Users manually added to Supabase `auth.users` table cannot log in because there's no corresponding entry in the `public.users` table. Additionally, the RLS policies were causing **infinite recursion** during signup and login operations, preventing authentication from working correctly.

## Root Cause
The RLS policies for the `users` table were using SECURITY DEFINER functions that queried `public.users`, which triggered the same policies again, creating infinite recursion. This affected:
- New user signup (cannot create profile)
- Existing user login (cannot read own profile)  
- All user operations

## Solution ✅
This update fixes the authentication flow by:
1. **Removing all policies that cause recursion** by querying the users table from within its own policies
2. **Simplifying RLS policies** to use only `auth.uid()` checks without role lookups
3. **Moving role-based authorization** to the application layer instead of RLS
4. Allowing users to create their own profile in `public.users` when they sign up
5. Auto-creating missing profiles for users who exist in `auth.users` but not in `public.users`
6. Enabling both signup and login functionality to work correctly

**Key Change:** Instead of checking user roles in RLS policies (which caused recursion), we now:
- Let any authenticated user see their own record
- Handle role-based permissions in the application code
- Use Supabase Dashboard or service_role key for admin operations

## Migration Steps

### Step 1: Apply the Migration SQL
You need to apply the RLS policy changes to your Supabase database:

1. Go to your Supabase Dashboard: https://app.supabase.com
2. Select your project
3. Navigate to: SQL Editor
4. Copy and paste the contents of `supabase/migration_fix_user_policies.sql`
5. Click "Run" to execute the migration

### Step 2: For Existing User (craig@zerobitone.co.za)
Since the user already exists in `auth.users`, you have two options:

#### Option A: Let the app auto-create the profile (Recommended)
1. Try logging in with the email and password
2. The app will automatically create the missing profile in `public.users`
3. No infinite recursion errors should occur

#### Option B: Manually create the profile
If auto-creation doesn't work, manually insert the user into `public.users`:

```sql
-- First, get the UUID from auth.users
SELECT id, email FROM auth.users WHERE email = 'craig@zerobitone.co.za';

-- Then insert into public.users (replace USER_UUID_HERE with actual UUID)
INSERT INTO public.users (id, name, email, role, location, is_active)
VALUES (
  'USER_UUID_HERE',  -- UUID from the query above
  'Craig',
  'craig@zerobitone.co.za',
  'admin',  -- or 'staff' depending on the role
  'JHB',
  true
)
ON CONFLICT (id) DO NOTHING;  -- In case it already exists
```

### Step 3: Verify the Changes
1. Check that the NEW policies are in place:
```sql
SELECT tablename, policyname, cmd
FROM pg_policies 
WHERE schemaname = 'public' AND tablename = 'users'
ORDER BY policyname;
```

Expected policies (3 total):
- "Users can view their own data" (SELECT)
- "Users can create their own profile" (INSERT)
- "Users can update their own profile" (UPDATE)

**Important:** You should NOT see these policies anymore:
- ❌ "Admins can view all users" (REMOVED - caused recursion)
- ❌ "Admins can update users" (REMOVED - caused recursion)

2. Check that old functions are removed:
```sql
SELECT proname FROM pg_proc 
WHERE proname IN ('check_user_role', 'check_user_roles');
```
Expected: **No rows returned** (functions should be deleted)

3. Test login with the existing user
4. Test signup with a new user

## Admin Access to All Users

Since we removed the "Admins can view all users" policy, admins should use:

**Option 1: Supabase Dashboard**
- Navigate to Table Editor → users table
- View and manage all users with full admin privileges

**Option 2: Service Role Key (Backend Only)**
```javascript
// In backend/server code only (NEVER in frontend!)
const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY  // Bypasses RLS
)

const { data: allUsers } = await supabaseAdmin
  .from('users')
  .select('*')
```

## What Changed

### Code Changes
1. **client/src/contexts/AuthContext.js**
   - `fetchUserProfile()` now auto-creates missing profiles
   - `register()` now calls the actual signup function instead of blocking

2. **supabase/schema.sql**
   - **REMOVED** `check_user_role()` and `check_user_roles()` functions (caused recursion)
   - **ADDED** `get_my_role()` helper function for application use only
   - **SIMPLIFIED** all RLS policies to avoid querying users table
   - **REMOVED** "Admins can view all users" policy (caused recursion)
   - **REMOVED** role-based policies on other tables

3. **supabase/migration_fix_user_policies.sql**
   - Drops all old policies and functions
   - Creates new simplified policies that don't cause recursion
   - Idempotent (safe to run multiple times)

### Database Policies
The new RLS policies:
- ✅ Users can INSERT their own profile (when `auth.uid() = id`)
- ✅ Users can UPDATE their own profile (but not role or is_active)
- ✅ Users can SELECT their own record only
- ✅ All other tables allow any authenticated user (role checks in app layer)
- ❌ No recursive queries that cause infinite loops

**Role-based authorization** is now handled in the React application:
```javascript
const user = useAuth();
if (user.role === 'admin') {
  // Show admin features
}
```

## Testing

### Test 1: Existing User Login
```
1. Go to the app login page
2. Enter: craig@zerobitone.co.za
3. Enter the password
4. Should successfully log in
5. Profile should be auto-created if missing
```

### Test 2: New User Signup
```
1. Go to the app login page
2. Click "Sign Up"
3. Enter name, email, password, location
4. Should see success message
5. Check email for verification link
6. Verify email and log in
```

## Troubleshooting

### Issue: User still can't log in
**Check:** Is the user's email verified in Supabase?
```sql
SELECT email, email_confirmed_at FROM auth.users WHERE email = 'craig@zerobitone.co.za';
```

If `email_confirmed_at` is NULL:
1. Go to Supabase Dashboard → Authentication → Users
2. Find the user and click the three dots
3. Click "Confirm Email"

### Issue: "Failed to create user profile" error or "infinite recursion detected" error
**Solution:** The migration should fix this completely.

**Check 1:** Verify policies were updated correctly:
```sql
SELECT policyname FROM pg_policies WHERE tablename = 'users';
```
Should show ONLY these 3 policies:
- Users can view their own data
- Users can create their own profile  
- Users can update their own profile

**Check 2:** Verify old functions were removed:
```sql
SELECT proname FROM pg_proc WHERE proname IN ('check_user_role', 'check_user_roles');
```
Should return **NO rows**. If you see these functions, they need to be dropped:
```sql
DROP FUNCTION IF EXISTS public.check_user_role(text);
DROP FUNCTION IF EXISTS public.check_user_roles(text[]);
```

**Check 3:** Run the migration again (it's idempotent):
- Copy contents of `supabase/migration_fix_user_policies.sql`
- Paste in SQL Editor and run

### Issue: Signup email not received
**Check:** Email settings in Supabase
1. Go to Supabase Dashboard → Authentication → Email Templates
2. Verify "Confirm signup" template is configured
3. Check spam folder

## Additional Notes

- The default role for new users is 'staff'
- Users need to verify their email before logging in (unless email confirmation is disabled in Supabase)
- **Admin operations:** Admins should use the Supabase Dashboard or service_role key to view/manage all users
- **Role-based features:** Implement role checks in your React components, not in RLS policies
- To make a user an admin, update their role in the database:
  ```sql
  UPDATE public.users SET role = 'admin' WHERE email = 'craig@zerobitone.co.za';
  ```

## Why This Approach?

The previous approach using SECURITY DEFINER functions seemed correct but still caused recursion in Supabase because:
1. The functions were owned by roles subject to RLS
2. Querying the users table from within its own policies created a circular dependency
3. Even with SECURITY DEFINER, the query triggered RLS again

**New approach:**
- Simple policies that don't query other tables
- No circular dependencies = No recursion
- Role checks moved to application layer where they belong
- Cleaner, more maintainable, and follows Supabase best practices
