# Testing Plan for RLS Infinite Recursion Fix

## Overview
This document outlines how to test the RLS fix to ensure signup and login work correctly without infinite recursion errors.

## Prerequisites

Before testing:
- [ ] Migration script `supabase/migration_fix_user_policies.sql` has been run in Supabase
- [ ] Verification script `supabase/verify_rls_fix.sql` confirms correct policy setup
- [ ] Application is deployed or running locally

## Test Scenarios

### Test 1: New User Signup ✅

**Objective:** Verify that new users can create accounts without infinite recursion errors.

**Steps:**
1. Navigate to the signup page
2. Enter the following information:
   - Name: Test User
   - Email: testuser@example.com
   - Password: SecurePassword123!
   - Location: JHB
3. Click "Sign Up" button

**Expected Result:**
- ✅ No "infinite recursion" error
- ✅ Success message displayed
- ✅ Email verification prompt shown
- ✅ User record created in `auth.users` table
- ✅ User profile created in `public.users` table with role='staff'

**SQL Verification:**
```sql
-- Check user was created in auth
SELECT id, email, email_confirmed_at FROM auth.users 
WHERE email = 'testuser@example.com';

-- Check profile was created in public.users
SELECT id, email, name, role, is_active FROM public.users 
WHERE email = 'testuser@example.com';
```

---

### Test 2: Existing User Login ✅

**Objective:** Verify that existing users can log in without infinite recursion errors.

**Steps:**
1. Navigate to the login page
2. Enter credentials for an existing user:
   - Email: craig@zerobitone.co.za (or other existing user)
   - Password: [user's password]
3. Click "Login" button

**Expected Result:**
- ✅ No "infinite recursion" error
- ✅ User successfully logged in
- ✅ Redirected to dashboard
- ✅ User profile loaded correctly
- ✅ User name and role displayed in UI
- ✅ `last_login` timestamp updated in database

**SQL Verification:**
```sql
-- Check last login was updated
SELECT email, last_login FROM public.users 
WHERE email = 'craig@zerobitone.co.za';
```

---

### Test 3: User Profile Access ✅

**Objective:** Verify that logged-in users can access their own profile data.

**Steps:**
1. Log in as a user
2. Navigate to the dashboard
3. Observe the user info section showing name and role

**Expected Result:**
- ✅ User's name displayed correctly
- ✅ User's role displayed with proper badge
- ✅ No permission errors
- ✅ No infinite recursion errors

---

### Test 4: Auto-Profile Creation ✅

**Objective:** Verify that users with auth.users records but no public.users profile get auto-created profiles.

**Setup:**
```sql
-- Create a user in auth.users only (simulate manual creation)
-- Use Supabase Dashboard: Authentication > Users > Invite User
-- Or manually insert into auth.users (if you have access)
```

**Steps:**
1. User attempts to log in with credentials
2. App detects missing profile in `public.users`
3. App auto-creates profile

**Expected Result:**
- ✅ Login succeeds
- ✅ Profile auto-created in `public.users`
- ✅ Default values applied: role='staff', is_active=true
- ✅ No errors or recursion

**SQL Verification:**
```sql
-- Profile should exist after login
SELECT * FROM public.users WHERE email = '[user-email]';
```

---

### Test 5: Role-Based UI Elements ✅

**Objective:** Verify that role-based features work correctly in the application.

**Steps:**
1. Log in as a user with role='staff'
2. Observe menu items in dashboard
3. Log out
4. Log in as a user with role='admin'
5. Observe menu items in dashboard

**Expected Result:**
- ✅ Menu items filtered based on user role
- ✅ Staff sees appropriate menu items
- ✅ Admin sees all menu items
- ✅ Role badge displayed correctly
- ✅ Role checks happen in React, not RLS

---

### Test 6: User Profile Updates ✅

**Objective:** Verify that users can update their own profile but not escalate privileges.

**Steps:**
1. Log in as a regular user
2. Attempt to update own profile (name, location)
3. Attempt to update own role (should fail)

**Expected Result:**
- ✅ User can update name and location
- ✅ User CANNOT update role field
- ✅ User CANNOT update is_active field
- ✅ RLS policy enforces these restrictions

**SQL Test:**
```sql
-- This should succeed
UPDATE public.users 
SET name = 'Updated Name' 
WHERE id = auth.uid();

-- This should fail (role unchanged)
UPDATE public.users 
SET role = 'admin' 
WHERE id = auth.uid();
```

---

### Test 7: Admin Operations ✅

**Objective:** Verify that admins can manage users through Supabase Dashboard.

**Steps:**
1. Log into Supabase Dashboard
2. Navigate to Table Editor > users
3. View all user records
4. Update a user's role
5. Update a user's is_active status

**Expected Result:**
- ✅ Admin can see all users in dashboard
- ✅ Admin can update any field
- ✅ Changes persist correctly
- ✅ No RLS restrictions in dashboard (uses service_role)

---

### Test 8: RLS Policy Verification ✅

**Objective:** Verify that RLS policies are correctly configured.

**Steps:**
1. Run `supabase/verify_rls_fix.sql` in SQL Editor

**Expected Result:**
- ✅ Exactly 3 policies on `users` table
- ✅ No "Admins can view all users" policy
- ✅ No "Admins can update users" policy
- ✅ Old functions removed (check_user_role, check_user_roles)
- ✅ New function exists (get_my_role)
- ✅ All tables have RLS enabled

---

## Error Scenarios to Test

### Test 9: Prevent Privilege Escalation ❌

**Objective:** Verify that security measures prevent privilege escalation.

**Steps:**
1. Log in as regular user
2. Open browser console
3. Try to execute:
```javascript
// Attempt to escalate privileges
await supabase.from('users')
  .update({ role: 'admin' })
  .eq('id', user.id);
```

**Expected Result:**
- ❌ Update fails
- ✅ Error message shown
- ✅ Role remains unchanged in database
- ✅ RLS policy blocks the update

---

### Test 10: Prevent Viewing Other Users ❌

**Objective:** Verify that users cannot view other users' records.

**Steps:**
1. Log in as regular user
2. Try to query all users:
```javascript
const { data, error } = await supabase
  .from('users')
  .select('*');
```

**Expected Result:**
- ❌ Only returns current user's record
- ✅ Does not return all users
- ✅ RLS policy restricts to `auth.uid() = id`

---

## Performance Testing

### Test 11: Load Time ✅

**Objective:** Verify that simplified RLS policies improve performance.

**Steps:**
1. Log in and time the authentication process
2. Navigate between pages
3. Observe load times

**Expected Result:**
- ✅ Login completes in < 2 seconds
- ✅ No noticeable delays
- ✅ Better performance than before (no complex function calls)

---

## Rollback Plan

If any test fails:

1. **Check migration was applied:**
   ```sql
   -- Run verify_rls_fix.sql
   ```

2. **Re-run migration:**
   ```sql
   -- Run migration_fix_user_policies.sql again (it's idempotent)
   ```

3. **Check application logs:**
   - Browser console errors
   - Supabase logs in dashboard

4. **Consult documentation:**
   - `RLS_FIX_GUIDE.md` for troubleshooting
   - `MIGRATION_INSTRUCTIONS.md` for setup steps

---

## Test Checklist Summary

- [ ] Test 1: New User Signup
- [ ] Test 2: Existing User Login
- [ ] Test 3: User Profile Access
- [ ] Test 4: Auto-Profile Creation
- [ ] Test 5: Role-Based UI Elements
- [ ] Test 6: User Profile Updates
- [ ] Test 7: Admin Operations
- [ ] Test 8: RLS Policy Verification
- [ ] Test 9: Prevent Privilege Escalation
- [ ] Test 10: Prevent Viewing Other Users
- [ ] Test 11: Load Time

---

## Success Criteria

All tests must pass for the fix to be considered successful:

✅ **Authentication Works**
- Users can sign up
- Users can log in
- No infinite recursion errors

✅ **Security Maintained**
- Users can only see their own records
- Users cannot escalate privileges
- Role-based features work correctly

✅ **Performance Improved**
- Faster authentication
- No complex RLS queries

---

## Reporting Issues

If you encounter any issues during testing:

1. Note which test failed
2. Copy exact error message
3. Check browser console for details
4. Run verification script to check RLS setup
5. Consult troubleshooting section in `RLS_FIX_GUIDE.md`

---

**Last Updated:** January 29, 2026
**Status:** Ready for Testing
