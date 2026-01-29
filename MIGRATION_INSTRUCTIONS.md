# Supabase Migration Instructions

## Problem
Users manually added to Supabase `auth.users` table cannot log in because there's no corresponding entry in the `public.users` table. Additionally, the RLS policies were preventing users from creating their own profiles.

## Solution
This update fixes the authentication flow by:
1. Allowing users to create their own profile in `public.users` when they sign up
2. Auto-creating missing profiles for users who exist in `auth.users` but not in `public.users`
3. Enabling the signup functionality to work correctly

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

#### Option B: Manually create the profile
If auto-creation doesn't work, manually insert the user into `public.users`:

```sql
-- Replace 'USER_UUID_HERE' with the actual UUID from auth.users
-- Replace 'Craig' with the actual user's name
INSERT INTO public.users (id, name, email, role, location, is_active)
VALUES (
  'USER_UUID_HERE',  -- Get this from auth.users table
  'Craig',
  'craig@zerobitone.co.za',
  'admin',  -- or 'staff' depending on the role
  'JHB',
  true
);
```

To get the UUID:
```sql
SELECT id, email FROM auth.users WHERE email = 'craig@zerobitone.co.za';
```

### Step 3: Verify the Changes
1. Check that the RLS policies are in place:
```sql
SELECT schemaname, tablename, policyname 
FROM pg_policies 
WHERE tablename = 'users';
```

Expected policies:
- "Users can view their own data"
- "Admins can view all users"
- "Users can create their own profile" (NEW)
- "Users can update their own profile" (NEW)
- "Admins can update users"

2. Test login with the existing user
3. Test signup with a new user

## What Changed

### Code Changes
1. **client/src/contexts/AuthContext.js**
   - `fetchUserProfile()` now auto-creates missing profiles
   - `register()` now calls the actual signup function instead of blocking

2. **supabase/schema.sql**
   - Added "Users can create their own profile" policy
   - Added "Users can update their own data" policy

### Database Policies
The new RLS policies allow:
- Users to INSERT their own profile (when `auth.uid() = id`)
- Users to UPDATE their own profile (but not their role or is_active status)
- Admins to still manage all users

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

### Issue: "Failed to create user profile" error
**Check:** Are the RLS policies applied correctly?
- Run the migration SQL again
- Verify policies with the query in Step 3 above

### Issue: Signup email not received
**Check:** Email settings in Supabase
1. Go to Supabase Dashboard → Authentication → Email Templates
2. Verify "Confirm signup" template is configured
3. Check spam folder

## Additional Notes

- The default role for new users is 'staff'
- Users need to verify their email before logging in (unless email confirmation is disabled in Supabase)
- Admins can be created by manually updating the role in the database:
  ```sql
  UPDATE public.users SET role = 'admin' WHERE email = 'craig@zerobitone.co.za';
  ```
