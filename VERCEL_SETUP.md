# Vercel + Supabase Deployment Guide

This guide will help you deploy the Inexss CRM application to Vercel with Supabase as the backend.

## 🚨 Quick Fix: Authentication/Password Reset Issues

**Are you experiencing these issues?**
- ✗ Can see the login page but can't sign in
- ✗ Password reset emails redirect to `localhost` instead of your Vercel URL

**Quick Fix:**
1. Go to your [Supabase Dashboard](https://supabase.com/dashboard) → **Authentication** → **URL Configuration**
2. Set **Site URL** to your Vercel URL: `https://your-app.vercel.app` (NOT localhost)
3. Add to **Redirect URLs**: `https://your-app.vercel.app/**`
4. Go to **Authentication** → **Email Templates** → **Reset Password**
5. Ensure the template uses `{{ .SiteURL }}` instead of hardcoded localhost URLs
6. Click **Save** and test again

For detailed instructions, see [Step 5](#step-5-update-supabase-redirect-urls-critical) and [Step 6](#step-6-configure-email-templates-for-password-reset) below.

**📖 Quick Reference:** See [AUTHENTICATION_SETUP.md](./AUTHENTICATION_SETUP.md) for a focused authentication configuration checklist.

---

## Prerequisites

1. A [Vercel account](https://vercel.com/signup) (free tier available)
2. A [Supabase account](https://supabase.com) (free tier available)
3. Your repository pushed to GitHub

## Part 1: Set Up Supabase

### Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click **"New Project"**
3. Fill in the project details:
   - **Organization**: Select or create one
   - **Name**: `inexss-crm` (or your preferred name)
   - **Database Password**: Generate a strong password (save this!)
   - **Region**: Choose the region closest to your users
4. Click **"Create new project"**
5. Wait 2-3 minutes for the project to be provisioned

### Step 2: Set Up Database Schema

1. In your Supabase dashboard, navigate to **SQL Editor** (in the left sidebar)
2. Click **"New query"**
3. Open the file `supabase/schema.sql` from this repository
4. Copy its entire contents and paste into the SQL editor
5. Click **"Run"** (or press Ctrl+Enter / Cmd+Enter)
6. Verify tables were created by going to **Table Editor** in the sidebar

### Step 3: Get Your Supabase Credentials

1. In your Supabase dashboard, go to **Settings** → **API** (in the left sidebar)
2. Copy these two values (you'll need them for Vercel):
   - **Project URL** (looks like `https://xxxxx.supabase.co`)
   - **anon public** key (under "Project API keys" - starts with `eyJ...`)

⚠️ **Important**: Use the **anon public** key, NOT the service_role key!

### Step 4: Create Your First Admin User

You need to create an admin user to log in:

**Option A: Via Supabase Dashboard (Recommended)**

1. Go to **Authentication** → **Users** in your Supabase dashboard
2. Click **"Add user"** → **"Create new user"**
3. Fill in:
   - **Email**: Your admin email (e.g., `admin@inexss.co.za`)
   - **Password**: Create a strong password
   - Leave "Auto Confirm User" checked
4. Click **"Create user"**
5. **Copy the UUID** that appears in the users list
6. Go to **Table Editor** → **users** table
7. Click **"Insert"** → **"Insert row"**
8. Fill in the form:
   - **id**: Paste the UUID you copied
   - **email**: Same email you used above
   - **name**: Your full name
   - **role**: `admin`
   - **location**: Choose from: `JHB`, `Cape Town`, `Durban`, or `Other`
   - **is_active**: `true`
9. Click **"Save"**

**Option B: Via SQL**

1. First create the auth user using Option A steps 1-4
2. Copy the user's UUID
3. Go to **SQL Editor** and run:
   ```sql
   INSERT INTO public.users (id, email, name, role, location, is_active)
   VALUES (
     'paste-uuid-here',
     'admin@inexss.co.za',
     'Your Name',
     'admin',
     'JHB',
     true
   );
   ```

## Part 2: Deploy to Vercel

> **⚠️ Important**: After deploying to Vercel, you MUST complete Steps 5 and 6 below to configure Supabase redirect URLs and email templates. Without these steps, authentication and password reset will not work correctly.

### Step 1: Import Project to Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click **"Import Git Repository"**
3. Select your GitHub repository (`craigbfelt/Inexss-CRM`)
4. If not listed, click **"Adjust GitHub App Permissions"** to grant access

### Step 2: Configure Build Settings

Vercel should auto-detect the settings from `vercel.json`, but verify:

- **Framework Preset**: Next.js
- **Root Directory**: `./` (leave as root)
- **Build Command**: `cd client && npm run build`
- **Output Directory**: `client/build`
- **Install Command**: `npm install --prefix client`

### Step 3: Add Environment Variables

Before deploying, add your Supabase credentials:

1. Click **"Environment Variables"** (in the import page, before deploying)
2. Add these two variables:

   **Variable 1:**
   - **Name**: `NEXT_PUBLIC_SUPABASE_URL`
   - **Value**: Your Supabase Project URL (from Part 1, Step 3)
   - **Environment**: Check all: Production, Preview, Development

   **Variable 2:**
   - **Name**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **Value**: Your Supabase anon public key (from Part 1, Step 3)
   - **Environment**: Check all: Production, Preview, Development

> **Note**: The app uses `NEXT_PUBLIC_*` prefixed environment variables (Vercel/Next.js convention).

### Step 4: Deploy

1. Click **"Deploy"**
2. Vercel will:
   - Clone your repository
   - Install dependencies (using Node.js 20.x as configured in vercel.json)
   - Build the React app
   - Deploy to their CDN
3. Wait 2-5 minutes for the deployment to complete
4. Once done, you'll see **"Congratulations!"** with your deployment URL

**Note:** The app uses Supabase packages that require Node.js 20.x or higher. This is automatically configured in `vercel.json`.

### Step 5: Update Supabase Redirect URLs ⚠️ CRITICAL

This step is **essential** for authentication and password reset to work correctly. If not configured, users won't be able to log in and password reset emails will redirect to localhost.

1. Copy your Vercel deployment URL (e.g., `https://your-app.vercel.app`)
2. Go back to your **Supabase dashboard**
3. Navigate to **Authentication** → **URL Configuration**
4. Update the following:
   
   **Site URL** (Required):
   - Set to your **production Vercel URL**: `https://your-app.vercel.app`
   - ⚠️ Do NOT use `localhost` - this must be your live Vercel URL
   - This URL is used for authentication redirects and email links
   
   **Redirect URLs** (Required):
   - Add your production URL pattern: `https://your-app.vercel.app/**`
   - Optionally add for local development: `http://localhost:3000/**`
   - The `**` wildcard allows redirects to any path on your domain

5. Click **"Save"**

### Step 6: Configure Email Templates for Password Reset

By default, Supabase email templates may use localhost URLs. You need to update them to use your production URL:

1. In your **Supabase dashboard**, go to **Authentication** → **Email Templates**
2. Click on the **"Reset Password"** template
3. Update the email template to use the `{{ .SiteURL }}` variable instead of hardcoded URLs
4. Verify the template contains something like:
   ```html
   <a href="{{ .SiteURL }}/reset-password?token={{ .Token }}">Reset Password</a>
   ```
   Or for the newer Supabase format:
   ```html
   <a href="{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=recovery">Reset Password</a>
   ```
5. Click **"Save"**
6. Repeat for other email templates (Confirm signup, Magic Link, etc.) if needed

**Important**: The `{{ .SiteURL }}` variable will automatically use the Site URL you configured in Step 5, ensuring emails always point to your production Vercel deployment.

## Part 3: Verify Deployment

### Step 7: Verify Configuration Checklist

Before testing your deployment, verify these critical configurations are correct:

**Supabase Configuration Checklist:**
- [ ] **Site URL** is set to your Vercel production URL (not localhost)
  - Location: Supabase → Authentication → URL Configuration
  - Should be: `https://your-app.vercel.app`
- [ ] **Redirect URLs** includes your Vercel domain pattern
  - Location: Supabase → Authentication → URL Configuration
  - Should include: `https://your-app.vercel.app/**`
- [ ] **Email Templates** use `{{ .SiteURL }}` variable (not localhost)
  - Location: Supabase → Authentication → Email Templates
  - Check: Reset Password, Confirm signup, Magic Link templates
- [ ] **Environment Variables** are set in Vercel
  - Location: Vercel → Project → Settings → Environment Variables
  - Required: `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] **Admin User** exists in both `auth.users` and `public.users` tables
  - Location: Supabase → Authentication → Users & Table Editor → users

### Step 8: Test Your Deployment

1. Open your Vercel URL in a browser
2. You should see the login page
3. Log in with the admin credentials you created in Part 1, Step 4
4. Verify you can:
   - Access the dashboard
   - Navigate between pages
   - View/create brands, clients, projects, etc.

**Test Password Reset (Important):**
1. Log out of your account
2. On the login page, you would typically click "Forgot Password" (if implemented)
3. Alternatively, test via Supabase dashboard:
   - Go to Supabase → Authentication → Users
   - Click on your user → **"Send password recovery email"**
4. Check your email inbox
5. Click the password reset link
6. **Verify**: The link should go to `https://your-app.vercel.app/...` (NOT localhost)
7. If it redirects to localhost, review [Step 6](#step-6-configure-email-templates-for-password-reset)

### Troubleshooting Common Issues

#### Issue: "404 Page Not Found" on Vercel

**Solutions:**
- Ensure `vercel.json` has the correct rewrites configuration
- Check that the build completed successfully in Vercel dashboard → Deployments
- Verify the output directory is `client/build`

#### Issue: "Missing Supabase environment variables"

**Solutions:**
- Go to Vercel dashboard → Your Project → Settings → Environment Variables
- Verify both `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set
- Make sure they're enabled for all environments (Production, Preview, Development)
- Redeploy the project: Deployments → Three dots → Redeploy

#### Issue: Can't log in / Authentication errors

**Solutions:**
- **Verify Site URL is set correctly**:
  - Go to Supabase → **Authentication** → **URL Configuration**
  - Ensure **Site URL** is your Vercel production URL (e.g., `https://your-app.vercel.app`)
  - It should NOT be `localhost` or empty
- **Verify Redirect URLs include your Vercel domain**:
  - Check that `https://your-app.vercel.app/**` is in the redirect URLs list
- **Check user exists in both tables**:
  - Verify user exists in **both** `auth.users` AND `public.users` tables in Supabase
  - Check the user's UUID matches in both tables
  - Ensure user's `is_active` is set to `true` in `public.users`
- **Check password**:
  - Supabase requires passwords to be at least 6 characters
  - Try resetting the password via Supabase dashboard
- **Clear browser cache and cookies**
- **Check browser console for specific error messages**

#### Issue: Password reset emails redirect to localhost

**Solutions:**
- **Update Site URL in Supabase**:
  - Go to Supabase → **Authentication** → **URL Configuration**
  - Set **Site URL** to your production Vercel URL (e.g., `https://your-app.vercel.app`)
  - DO NOT use `http://localhost:3000`
- **Update Email Templates**:
  - Go to Supabase → **Authentication** → **Email Templates**
  - Edit the "Reset Password" template
  - Ensure it uses `{{ .SiteURL }}` variable instead of hardcoded localhost URL
  - Should look like: `{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=recovery`
  - Click **"Save"**
- **Test password reset**:
  - Try sending a password reset email again
  - The link should now point to your Vercel URL
  - If still using localhost, clear browser cache and try again

#### Issue: Authentication works locally but not on Vercel

**Solutions:**
- **Double-check environment variables on Vercel**:
  - Go to Vercel → Your Project → Settings → Environment Variables
  - Verify `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are correct
  - Make sure they match your Supabase project credentials
- **Redeploy after changing environment variables**:
  - Go to Vercel → Deployments → Latest → Three dots → **"Redeploy"**
  - Environment variable changes require a redeploy to take effect
- **Check Supabase project is not paused**:
  - Free tier Supabase projects pause after inactivity
  - Go to your Supabase dashboard and verify project is active

#### Issue: "Failed to fetch" or CORS errors

**Solutions:**
- Verify Supabase URL is correct in Vercel environment variables
- Ensure you're using `https://` not `http://` for the Supabase URL
- Check that your Vercel domain is added to Supabase redirect URLs

#### Issue: Build fails on Vercel

**Solutions:**
- Check build logs in Vercel dashboard for specific errors
- Ensure `client/package.json` has all required dependencies
- Try running `cd client && npm install && npm run build` locally first
- Verify there are no ESLint errors (or add `CI=false` to build script)

## Local Development Setup

To run the app locally:

1. Clone the repository:
   ```bash
   git clone https://github.com/craigbfelt/Inexss-CRM.git
   cd Inexss-CRM
   ```

2. Create `client/.env` file:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```

   > **Note**: For local development, you can also use `REACT_APP_*` prefixed variables if preferred.

3. Install dependencies and start:
   ```bash
   cd client
   npm install
   npm start
   ```

4. Open `http://localhost:3000` in your browser

## Custom Domain (Optional)

To use your own domain instead of `*.vercel.app`:

1. Go to Vercel dashboard → Your Project → Settings → Domains
2. Click **"Add"**
3. Enter your domain (e.g., `crm.inexss.co.za`)
4. Follow Vercel's instructions to add DNS records
5. Once verified, update Supabase redirect URLs to include your custom domain

## Updating Your Deployment

When you push changes to GitHub:

1. Vercel automatically detects the push
2. Triggers a new build and deployment
3. Usually completes in 2-5 minutes
4. No manual intervention needed!

To manually trigger a redeploy:

1. Go to Vercel dashboard → Your Project → Deployments
2. Find the deployment you want to redeploy
3. Click the three dots → **"Redeploy"**

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | `https://xxxxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous/public key | `eyJhbGc...` (long string) |

> **Note**: The app uses `NEXT_PUBLIC_*` prefixed environment variables (Vercel/Next.js convention).

## Security Notes

✅ **Safe to commit:**
- `vercel.json` configuration
- `.env.example` template files

❌ **Never commit:**
- `.env` files with real credentials
- Supabase service_role key (use only anon public key in frontend)
- Database passwords

⚠️ **Production Security:**
- **Never use localhost URLs in production Supabase configuration**
  - Site URL must be your production Vercel domain
  - Localhost URLs will break authentication and create security issues
- **Keep redirect URLs specific**
  - Use `https://your-app.vercel.app/**` pattern
  - Don't use overly broad patterns that could allow unauthorized redirects
- **Regularly rotate your Supabase keys** if they may have been exposed
- **Enable Row Level Security (RLS)** policies on all Supabase tables in production

## Next Steps

After successful deployment:

1. **Add team members**: Create user accounts in Supabase
2. **Set up brands**: Add your 15 brands through the UI
3. **Create clients**: Start adding client information
4. **Set up monitoring**: Enable Vercel Analytics for usage insights
5. **Configure backups**: Review Supabase backup settings

## Support

If you encounter issues:

1. Check the [Troubleshooting section](#troubleshooting-common-issues) above
2. Review [Supabase documentation](https://supabase.com/docs)
3. Review [Vercel documentation](https://vercel.com/docs)
4. Check existing [GitHub issues](https://github.com/craigbfelt/Inexss-CRM/issues)
5. Create a new issue with:
   - Clear description of the problem
   - Steps to reproduce
   - Screenshots of errors
   - What you've already tried

## Additional Resources

- [AUTHENTICATION_SETUP.md](./AUTHENTICATION_SETUP.md) - Quick reference for authentication configuration
- [SUPABASE_MIGRATION.md](./SUPABASE_MIGRATION.md) - Detailed migration guide
- [DEPLOYMENT.md](./DEPLOYMENT.md) - General deployment documentation
- [README.md](./README.md) - Project overview
- [Supabase Docs](https://supabase.com/docs) - Official Supabase documentation
- [Vercel Docs](https://vercel.com/docs) - Official Vercel documentation

---

**Last Updated**: January 2026  
**Status**: Production Ready ✅
