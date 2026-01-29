# Vercel + Supabase Deployment Guide

This guide will help you deploy the Inexss CRM application to Vercel with Supabase as the backend.

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

### Step 1: Import Project to Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click **"Import Git Repository"**
3. Select your GitHub repository (`craigbfelt/Inexss-CRM`)
4. If not listed, click **"Adjust GitHub App Permissions"** to grant access

### Step 2: Configure Build Settings

Vercel should auto-detect the settings from `vercel.json`, but verify:

- **Framework Preset**: Other (or Create React App)
- **Root Directory**: `./` (leave as root)
- **Build Command**: `cd client && npm run build`
- **Output Directory**: `client/build`
- **Install Command**: `npm install --prefix client`

### Step 3: Add Environment Variables

Before deploying, add your Supabase credentials:

1. Click **"Environment Variables"** (in the import page, before deploying)
2. Add these two variables:

   **Variable 1:**
   - **Name**: `REACT_APP_SUPABASE_URL`
   - **Value**: Your Supabase Project URL (from Part 1, Step 3)
   - **Environment**: Check all: Production, Preview, Development

   **Variable 2:**
   - **Name**: `REACT_APP_SUPABASE_ANON_KEY`
   - **Value**: Your Supabase anon public key (from Part 1, Step 3)
   - **Environment**: Check all: Production, Preview, Development

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

### Step 5: Update Supabase Redirect URLs

1. Copy your Vercel deployment URL (e.g., `https://your-app.vercel.app`)
2. Go back to your **Supabase dashboard**
3. Navigate to **Authentication** → **URL Configuration**
4. Update the following:
   - **Site URL**: Set to your Vercel URL (`https://your-app.vercel.app`)
   - **Redirect URLs**: Add these patterns:
     - `https://your-app.vercel.app/**`
     - `http://localhost:3000/**` (for local development)
5. Click **"Save"**

## Part 3: Verify Deployment

### Test Your Deployment

1. Open your Vercel URL in a browser
2. You should see the login page
3. Log in with the admin credentials you created in Part 1, Step 4
4. Verify you can:
   - Access the dashboard
   - Navigate between pages
   - View/create brands, clients, projects, etc.

### Troubleshooting Common Issues

#### Issue: "404 Page Not Found" on Vercel

**Solutions:**
- Ensure `vercel.json` has the correct rewrites configuration
- Check that the build completed successfully in Vercel dashboard → Deployments
- Verify the output directory is `client/build`

#### Issue: "Missing Supabase environment variables"

**Solutions:**
- Go to Vercel dashboard → Your Project → Settings → Environment Variables
- Verify both `REACT_APP_SUPABASE_URL` and `REACT_APP_SUPABASE_ANON_KEY` are set
- Make sure they're enabled for all environments (Production, Preview, Development)
- Redeploy the project: Deployments → Three dots → Redeploy

#### Issue: Can't log in / Authentication errors

**Solutions:**
- Verify user exists in **both** `auth.users` AND `public.users` tables in Supabase
- Check the user's UUID matches in both tables
- Ensure user's `is_active` is set to `true` in `public.users`
- Clear browser cache and cookies
- Check browser console for specific error messages

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
   REACT_APP_SUPABASE_URL=https://your-project.supabase.co
   REACT_APP_SUPABASE_ANON_KEY=your-anon-key-here
   ```

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
| `REACT_APP_SUPABASE_URL` | Your Supabase project URL | `https://xxxxx.supabase.co` |
| `REACT_APP_SUPABASE_ANON_KEY` | Supabase anonymous/public key | `eyJhbGc...` (long string) |

## Security Notes

✅ **Safe to commit:**
- `vercel.json` configuration
- `.env.example` template files

❌ **Never commit:**
- `.env` files with real credentials
- Supabase service_role key (use only anon public key in frontend)
- Database passwords

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

- [SUPABASE_MIGRATION.md](./SUPABASE_MIGRATION.md) - Detailed migration guide
- [DEPLOYMENT.md](./DEPLOYMENT.md) - General deployment documentation
- [README.md](./README.md) - Project overview
- [Supabase Docs](https://supabase.com/docs) - Official Supabase documentation
- [Vercel Docs](https://vercel.com/docs) - Official Vercel documentation

---

**Last Updated**: January 2026  
**Status**: Production Ready ✅
