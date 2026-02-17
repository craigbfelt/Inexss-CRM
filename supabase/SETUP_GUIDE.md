# Complete Setup Guide - Fixing Login and Registration Issues

## Problem Statement

Users are experiencing issues with:
1. Cannot log in to the application
2. Cannot register new accounts
3. Need to set up craig@zerobitone.co.za as an admin user

## Root Cause

The application requires a properly configured Supabase backend for authentication to work. Without the correct Supabase configuration, login and registration will not function.

## Solution Overview

To fix these issues, you need to:
1. Set up a Supabase project (if not already done)
2. Configure the database schema
3. Set up environment variables
4. Create the admin user
5. Deploy/run the application

---

## Step-by-Step Setup Instructions

### 1. Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Fill in:
   - **Name**: inexss-crm (or your preferred name)
   - **Database Password**: Generate and save a strong password
   - **Region**: Choose the closest to your users
4. Click "Create new project" and wait 1-2 minutes for provisioning

### 2. Set Up Database Schema

1. In your Supabase Dashboard, go to **SQL Editor**
2. Click "New query"
3. Copy the entire contents of `schema.sql` from this directory
4. Paste into the SQL editor
5. Click "Run" to execute
6. Verify success - you should see tables created in **Table Editor**

**Expected tables:**
- users
- brands
- user_brand_access
- clients
- projects
- project_brands
- meetings
- brand_discussions
- action_items

### 3. Apply Database Migrations (Important!)

The schema includes automatic user profile creation, but make sure to apply any additional migrations:

1. Run `migration_fix_signup_rls.sql` (if not already in schema)
2. Run `migration_fix_user_policies.sql` (if not already in schema)

These migrations ensure:
- Users can successfully sign up without RLS policy violations
- No infinite recursion errors during authentication
- Proper Row-Level Security configuration

### 4. Configure Environment Variables

#### For Local Development:

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Get your Supabase credentials:
   - In Supabase Dashboard: **Project Settings** > **API**
   - Copy **Project URL** and **anon public** key

3. Edit `.env` and add your credentials:
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

#### For Production (Vercel/Netlify):

Add these environment variables in your deployment platform:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

### 5. Create Admin User

You have two options:

#### Option A: Supabase Dashboard (Recommended)

1. Go to **Authentication** > **Users**
2. Click "Add user"
3. Fill in:
   - **Email**: craig@zerobitone.co.za
   - **Password**: (choose a strong password and save it securely!)
   - **Auto Confirm User**: ✓ **Enable this!** (Important)
4. Click "Create user"
5. Copy the User ID (UUID) that appears
6. Go to **SQL Editor** and run the `setup_admin_user.sql` script
   - It will detect the user and set them as admin
   
#### Option B: Via SQL

1. Go to **SQL Editor** in Supabase
2. Open and run `setup_admin_user.sql`
3. Follow the instructions in the script

### 6. Enable Email Confirmation (Optional but Recommended)

For production, configure email settings:

1. Go to **Authentication** > **Settings**
2. Scroll to **Email Auth**
3. Disable "Confirm email" for development (or configure SMTP for production)
4. For production:
   - Go to **Project Settings** > **Auth** > **SMTP Settings**
   - Configure your SMTP provider (SendGrid, AWS SES, Mailgun, etc.)

### 7. Test the Setup

#### Local Development:

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open http://localhost:3000 (or the port shown)

4. Test registration:
   - Go to `/signup`
   - Create a test account
   - Verify it works without errors

5. Test login:
   - Go to `/login`
   - Log in with craig@zerobitone.co.za
   - Verify you can access the dashboard

#### Production:

1. Deploy to Vercel:
   ```bash
   npm run build
   vercel --prod
   ```
   Or use Vercel's GitHub integration

2. Ensure environment variables are set in Vercel dashboard

3. Test the same flows as above

### 8. Troubleshooting

#### "new row violates row-level security policy"

**Solution**: Run `migration_fix_signup_rls.sql` in Supabase SQL Editor
- This creates a trigger that automatically handles user profile creation
- The trigger uses SECURITY DEFINER to bypass RLS during signup

#### "infinite recursion detected in policy"

**Solution**: Run `migration_fix_user_policies.sql` in Supabase SQL Editor
- This removes problematic policies that query the users table from within RLS
- Simplified policies prevent recursion

#### "Invalid API key" or "Supabase client error"

**Solution**: 
1. Verify `.env` file exists and has correct values
2. Check you're using the **anon public** key, not service_role key
3. Restart the development server after changing `.env`

#### Cannot log in with admin account

**Solution**:
1. Go to Supabase **Authentication** > **Users**
2. Find craig@zerobitone.co.za
3. Verify:
   - Email is confirmed (green checkmark)
   - User is not disabled
4. Reset password if needed
5. Check public.users table to confirm role is 'admin'

#### Email not confirmed

**Solution**:
1. In Supabase Dashboard: **Authentication** > **Users**
2. Click on the user
3. Click "Confirm email" manually
   
OR

1. Disable email confirmation for development:
   - **Authentication** > **Settings**
   - Uncheck "Enable email confirmations"

### 9. Verify Complete Setup

Run this checklist:

- [ ] Supabase project created
- [ ] Database schema applied (all tables exist)
- [ ] RLS migrations applied (no recursion/policy errors)
- [ ] Environment variables configured (.env for local, Vercel/Netlify for prod)
- [ ] Admin user created (craig@zerobitone.co.za)
- [ ] Admin user has role='admin' in public.users table
- [ ] Admin user email is confirmed
- [ ] Can access /login page
- [ ] Can access /signup page
- [ ] Can register new accounts
- [ ] Can log in with admin account
- [ ] Can access dashboard after login

---

## Quick Reference

### Important Files

- `schema.sql` - Complete database schema
- `setup_admin_user.sql` - Script to set up admin user
- `migration_fix_signup_rls.sql` - Fixes signup RLS issues
- `migration_fix_user_policies.sql` - Fixes infinite recursion
- `.env.example` - Template for environment variables

### Supabase Credentials Location

**Dashboard**: Project Settings > API
- Project URL: `https://xxxxx.supabase.co`
- anon public key: `eyJhbG...` (use this in .env)
- service_role key: `eyJhbG...` (keep secret, don't use in frontend)

### Admin Account

- **Email**: craig@zerobitone.co.za
- **Role**: admin
- **Location**: JHB (Johannesburg)

### Support Resources

- **Supabase Docs**: https://supabase.com/docs
- **Project README**: ../README.md
- **Issue Tracker**: GitHub Issues

---

## Security Notes

⚠️ **Important Security Reminders:**

1. Never commit `.env` file to git (already in .gitignore)
2. Never expose service_role key in frontend code
3. Use environment variables for all credentials
4. Enable Row-Level Security (RLS) on all tables
5. Use strong passwords for admin accounts
6. Enable 2FA on Supabase account for production
7. Regularly backup your database
8. Review RLS policies before going to production

---

**Last Updated**: February 2026
**Status**: ✓ Ready for deployment
