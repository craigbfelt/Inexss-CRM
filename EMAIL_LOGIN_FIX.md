# Email Login Configuration Fix

## Problem
Users are receiving an error message stating "email logins are disabled" when attempting to log into the application, despite email being the only available authentication method.

## Root Cause
The Email authentication provider is not enabled in your Supabase project settings. Supabase requires explicit configuration of authentication providers, and by default, the Email/Password provider may be disabled.

## Solution

### Step 1: Enable Email Authentication Provider

1. Go to your [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Navigate to **Authentication** → **Providers** (in the left sidebar)
4. Find **Email** in the list of providers
5. Click on **Email** to expand its settings
6. **Enable** the Email provider by toggling it ON
7. Configure the following settings:

   **Recommended Settings:**
   - ✅ **Enable Email provider** - Toggle this ON
   - **Confirm email**: 
     - For production: Enable this for security
     - For testing: You can temporarily disable this to simplify testing
   - **Secure email change**: Enable this (recommended)
   - **Email OTP**: Optional - for passwordless login (not required for this app)

8. Click **Save** to apply the changes

### Step 2: Verify Authentication Settings

While you're in the Authentication section, verify these additional settings:

#### URL Configuration (Authentication → URL Configuration)

Ensure you have properly configured:

1. **Site URL**: 
   ```
   https://your-app.vercel.app
   ```
   - This should be your **production Vercel URL only**
   - Do NOT use `http://localhost:3000` for the Site URL (even when testing)
   - The Site URL is used in authentication emails and redirects

2. **Redirect URLs**:
   ```
   https://your-app.vercel.app/**
   http://localhost:3000/**
   ```
   - Add **both** production and local development URLs to Redirect URLs
   - The `**` wildcard is required to allow all paths under each URL
   
   > **Important Distinction:**
   > - **Site URL** = Production URL only (used in emails)
   > - **Redirect URLs** = Production + Local URLs (where app can redirect after auth)

#### Email Templates (Authentication → Email Templates)

If you enabled "Confirm email", ensure your email templates are correctly configured:

1. **Confirm signup** template should use:
   ```html
   <a href="{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=signup">
     Confirm Email
   </a>
   ```

2. **Reset password** template should use:
   ```html
   <a href="{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=recovery">
     Reset Password
   </a>
   ```

### Step 3: Test Email Login

After enabling the Email provider:

1. Go to your application login page
2. Try logging in with an existing user's email and password
3. You should now be able to log in successfully

If you're still experiencing issues, see the [Troubleshooting](#troubleshooting) section below.

## Troubleshooting

### Issue: "Email logins are disabled" still appears

**Possible causes:**
1. Email provider was not saved properly
   - **Solution**: Go back to Supabase → Authentication → Providers → Email and verify it's enabled
   - Make sure you clicked "Save" after enabling it

2. Browser cache may be showing old error
   - **Solution**: Hard refresh your browser (Ctrl+Shift+R or Cmd+Shift+R)
   - Or try in an incognito/private window

3. Application is pointing to wrong Supabase project
   - **Solution**: Verify your environment variables in Vercel:
     ```
     NEXT_PUBLIC_SUPABASE_URL = https://xxxxx.supabase.co
     NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJhbGc...
     ```
   - These should match your Supabase project
   - After changing env vars, redeploy your Vercel app

### Issue: "Invalid login credentials"

This is different from "email logins are disabled" and means:
- The user doesn't exist in the system, OR
- The password is incorrect, OR
- The user account is not active

**Solutions:**
1. Verify the user exists in Supabase:
   - Go to Supabase Dashboard → Authentication → Users
   - Search for the user's email
   
2. If user doesn't exist, create them:
   - Click "Add user" → "Create new user"
   - Enter email and password
   - After creating in `auth.users`, also verify they exist in `public.users` table
   
3. If user exists but can't log in:
   - Go to Table Editor → users table
   - Find the user record
   - Verify `is_active` is set to `true`

### Issue: "User needs to verify email"

If you enabled "Confirm email" in the Email provider settings:
- New users must verify their email before logging in
- They'll receive a confirmation email after signup
- Check spam folder if email not received
- Or temporarily disable "Confirm email" for testing

## Configuration Checklist

Use this checklist to ensure everything is properly configured:

**Supabase - Email Provider:**
- [ ] Email provider is enabled in Authentication → Providers
- [ ] Settings saved successfully
- [ ] "Confirm email" setting matches your needs (enabled for production, optional for testing)

**Supabase - URL Configuration:**
- [ ] Site URL is set to your production Vercel URL
- [ ] Redirect URLs include your production URL with `/**` wildcard
- [ ] Redirect URLs include localhost if testing locally

**Supabase - Users:**
- [ ] Test user exists in `auth.users` table
- [ ] Same user exists in `public.users` table with matching UUID
- [ ] User's `is_active` is `true` in `public.users` table

**Vercel - Environment Variables:**
- [ ] `NEXT_PUBLIC_SUPABASE_URL` is set correctly
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` is set correctly
- [ ] Environment variables are enabled for all environments
- [ ] Redeployed after setting environment variables

**Testing:**
- [ ] Can access login page at production URL
- [ ] Can log in with existing user credentials
- [ ] No "email logins are disabled" error

## Creating Your First User

If you don't have any users yet and need to create an admin user:

### Option 1: Via Supabase Dashboard (Recommended)

1. Go to Supabase Dashboard → Authentication → Users
2. Click **Add user** → **Create new user**
3. Enter:
   - Email: your email address
   - Password: a secure password
   - Auto-confirm email: Check this box (for admin user)
4. Click **Create user**

5. **IMPORTANT**: Also create the user profile in the `public.users` table:
   - Go to Table Editor → `users` table
   - Click **Insert row**
   - Enter:
     - `id`: Copy the UUID from the auth.users table
     - `email`: Same email as above
     - `name`: Your full name
     - `role`: `admin`
     - `location`: Choose from: JHB, Cape Town, Durban, or Other
     - `is_active`: `true`
   - Click **Save**

### Option 2: Via SQL Editor (Advanced)

> **⚠️ Important:** This method only creates the public profile. You **must** create the auth user via the dashboard first (see Option 1).

**Steps:**

1. First, create the auth user via Supabase Dashboard (see Option 1 above)
2. Copy the user's UUID from the Authentication → Users page
3. Then run this SQL in Supabase → SQL Editor to create their public profile:

```sql
-- Creates the public profile for an existing auth user
-- PREREQUISITE: Auth user must already exist in auth.users table (created via dashboard)

INSERT INTO public.users (id, email, name, role, location, is_active)
VALUES (
  'UUID-from-auth-users-table',  -- Replace with actual UUID from auth.users
  'admin@example.com',            -- Replace with same email as auth user
  'Admin User',                   -- Replace with full name
  'admin',                        -- Role: admin, staff, brand_representative, contractor, or supplier
  'JHB',                          -- Location: JHB, Cape Town, Durban, or Other
  true                            -- is_active: true to allow login
);
```

> **Why not create auth users via SQL?** The `auth.users` table requires specific password hashing algorithms and security configurations that are handled automatically by Supabase's authentication API. Creating users via SQL would bypass these security measures.

## Additional Resources

- [AUTHENTICATION_SETUP.md](./AUTHENTICATION_SETUP.md) - Complete authentication setup guide
- [SUPABASE_MIGRATION.md](./SUPABASE_MIGRATION.md) - Detailed Supabase configuration
- [VERCEL_SETUP.md](./VERCEL_SETUP.md) - Vercel deployment guide
- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth) - Official Supabase docs

## Summary

The "email logins are disabled" error is a **configuration issue**, not a code issue. The application is correctly set up to use email/password authentication. You simply need to:

1. ✅ Enable the Email provider in Supabase (Authentication → Providers → Email)
2. ✅ Verify your Site URL and Redirect URLs are configured
3. ✅ Create at least one user (if you haven't already)
4. ✅ Test login

After following these steps, email login should work correctly.

---

**Need more help?**
- Check the [Troubleshooting](#troubleshooting) section above
- Review the configuration checklist
- Verify all environment variables in Vercel
- Check Supabase logs for any error messages (Dashboard → Logs)
