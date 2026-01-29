# Fix for Infinite Recursion in Users Table RLS Policies

## Summary of the Issue

### Problem
The RLS (Row Level Security) policies for the `users` table were causing **infinite recursion** during both signup and login operations. This prevented:
- ✗ New users from signing up
- ✗ Existing users from logging in (including craig@zerobitone.co.za)
- ✗ Any user operations that required role checking

### Root Cause
The RLS policies were checking user roles by directly querying the `public.users` table:
```sql
-- This causes infinite recursion!
EXISTS (
  SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'
)
```

When a user tries to sign up or login:
1. The application tries to read from `public.users`
2. The SELECT policy checks if the user is an admin by querying `public.users`
3. This query triggers the SELECT policy again → **infinite recursion!**

### Solution
We created **SECURITY DEFINER functions** that bypass RLS when checking user roles:
```sql
CREATE OR REPLACE FUNCTION public.check_user_role(required_role text)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() AND role = required_role
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

The `SECURITY DEFINER` clause makes the function execute with the privileges of the function owner (who can bypass RLS), preventing the infinite recursion.

## Files Changed

### 1. `supabase/schema.sql`
- ✅ Added `check_user_role()` function
- ✅ Added `check_user_roles()` function for multiple roles
- ✅ Updated ALL RLS policies to use these functions instead of direct queries

### 2. `supabase/migration_fix_user_policies.sql`
- ✅ Added the SECURITY DEFINER functions
- ✅ Updated user-related policies
- ✅ Made the migration idempotent (can be run multiple times safely)

### 3. `MIGRATION_INSTRUCTIONS.md`
- ✅ Updated problem description to include infinite recursion
- ✅ Added troubleshooting for infinite recursion errors
- ✅ Added verification steps for the new functions

## How to Apply the Fix

### Step 1: Apply the Migration
1. Go to your Supabase Dashboard: https://app.supabase.com
2. Select your project
3. Navigate to: **SQL Editor**
4. Copy and paste the contents of `supabase/migration_fix_user_policies.sql`
5. Click **"Run"** to execute the migration

### Step 2: Verify the Functions Were Created
Run this query to confirm the functions exist:
```sql
SELECT proname, prosecdef 
FROM pg_proc 
WHERE proname IN ('check_user_role', 'check_user_roles');
```

Expected output:
```
proname              | prosecdef
---------------------|-----------
check_user_role      | t
check_user_roles     | t
```

### Step 3: Verify the Policies
Check that the policies are using the new functions:
```sql
SELECT schemaname, tablename, policyname, qual 
FROM pg_policies 
WHERE tablename = 'users'
ORDER BY policyname;
```

The policies should now reference `check_user_role` or `check_user_roles` instead of direct SELECT queries.

### Step 4: Test Login for Existing User
1. Try logging in with: **craig@zerobitone.co.za**
2. Login should now work successfully
3. The user profile should be visible in the app

### Step 5: Test New User Signup
1. Try creating a new user account
2. Signup should complete without "infinite recursion" errors
3. The new user should be able to login after email verification

## What This Fixes

### Before the Fix
- ❌ Signup: "infinite recursion detected in policy for relation users"
- ❌ Login: "infinite recursion detected in policy for relation users"
- ❌ All user operations failed

### After the Fix
- ✅ Signup: Works correctly, creates user profile
- ✅ Login: Works for all existing users (including manually created ones)
- ✅ Role-based permissions: Work correctly without recursion
- ✅ Admin operations: Can view and manage all users

## Technical Details

### Why SECURITY DEFINER Works
- Regular functions execute with the privileges of the **caller** (who is subject to RLS)
- `SECURITY DEFINER` functions execute with the privileges of the **function owner** (who can bypass RLS)
- This breaks the recursion cycle while maintaining security

### Security Considerations
The functions are safe because:
1. They only check the **current authenticated user's** role (`auth.uid()`)
2. They don't allow arbitrary user queries
3. They only return boolean values (true/false)
4. They're read-only (no INSERT/UPDATE/DELETE)

### Policies Updated
The fix updates policies across all tables:
- **Users table**: View, insert, update policies
- **Brands table**: Admin management policy
- **Clients table**: Staff/admin policies
- **Projects table**: Staff/admin policies
- **Meetings table**: Staff/admin/brand_representative policies
- **Related tables**: All role-based policies

## Troubleshooting

### Still Getting Infinite Recursion?
1. Ensure the migration was applied successfully
2. Check that the functions exist (Step 2 above)
3. Verify the policies are using the functions (Step 3 above)
4. Try running the migration again (it's idempotent)

### User Profile Not Created?
1. Check if the user exists in `auth.users`:
   ```sql
   SELECT id, email, email_confirmed_at FROM auth.users WHERE email = 'your-email@example.com';
   ```
2. Check if email is confirmed (`email_confirmed_at` should not be NULL)
3. Try the login again - the app should auto-create the profile

### Permission Denied Errors?
1. Ensure you're logged in as the database owner or superuser when running the migration
2. The functions need to be created in the `public` schema
3. Check that RLS is enabled on the tables

## Need Help?

If you continue to experience issues:
1. Check the Supabase logs for detailed error messages
2. Verify all migration steps were completed
3. Ensure email verification is complete for test users
4. Contact support with the specific error message

## Summary

This fix resolves the infinite recursion issue by:
1. ✅ Creating safe SECURITY DEFINER functions for role checking
2. ✅ Updating all RLS policies to use these functions
3. ✅ Maintaining security while allowing proper authentication
4. ✅ Enabling both signup and login to work correctly

The changes are minimal, focused, and don't alter the security model - they just fix the implementation to avoid the recursion bug.
