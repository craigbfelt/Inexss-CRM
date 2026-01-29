# Quick Deployment Checklist ✅

Use this checklist to deploy your Inexss CRM to Vercel + Supabase in under 15 minutes!

## Part 1: Supabase Setup (5 minutes)

### 1.1 Create Project
- [ ] Go to [supabase.com](https://supabase.com)
- [ ] Click "New Project"
- [ ] Enter project name: `inexss-crm`
- [ ] Generate and **save** database password
- [ ] Select region (closest to users)
- [ ] Click "Create project" (wait 2-3 min)

### 1.2 Set Up Database
- [ ] In Supabase dashboard → SQL Editor
- [ ] Click "New query"
- [ ] Copy all content from `supabase/schema.sql`
- [ ] Paste and click "Run"
- [ ] Verify tables created in Table Editor

### 1.3 Get Credentials
- [ ] Go to Settings → API
- [ ] **Copy Project URL**: `https://xxxxx.supabase.co`
- [ ] **Copy anon public key**: (starts with `eyJ...`)
- [ ] Save both somewhere safe!

### 1.4 Create Admin User
- [ ] Go to Authentication → Users
- [ ] Click "Add user" → "Create new user"
- [ ] Enter email: `admin@inexss.co.za`
- [ ] Create password
- [ ] **Copy the UUID** shown
- [ ] Go to Table Editor → users table
- [ ] Click "Insert" → "Insert row"
- [ ] Fill in:
  - id: (paste UUID)
  - email: `admin@inexss.co.za`
  - name: Your Name
  - role: `admin`
  - location: `JHB`
  - is_active: `true`
- [ ] Click "Save"

## Part 2: Vercel Deployment (5 minutes)

### 2.1 Import to Vercel
- [ ] Go to [vercel.com/new](https://vercel.com/new)
- [ ] Click "Import Git Repository"
- [ ] Select `craigbfelt/Inexss-CRM`
- [ ] Verify settings (auto-detected from vercel.json):
  - Framework: Other
  - Root Directory: `./`
  - Build Command: `cd client && npm install && npm run build`
  - Output Directory: `client/build`

### 2.2 Add Environment Variables
- [ ] Click "Environment Variables" section
- [ ] Add Variable 1:
  - Name: `NEXT_PUBLIC_SUPABASE_URL`
  - Value: (paste your Supabase Project URL)
  - Environments: ✓ Production, ✓ Preview, ✓ Development
- [ ] Add Variable 2:
  - Name: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - Value: (paste your Supabase anon key)
  - Environments: ✓ Production, ✓ Preview, ✓ Development

### 2.3 Deploy
- [ ] Click "Deploy"
- [ ] Wait 3-5 minutes
- [ ] Copy your deployment URL: `https://your-app.vercel.app`

## Part 3: Final Configuration (2 minutes)

### 3.1 Update Supabase URLs
- [ ] Back in Supabase dashboard
- [ ] Go to Authentication → URL Configuration
- [ ] Set Site URL: `https://your-app.vercel.app`
- [ ] Add Redirect URLs:
  - `https://your-app.vercel.app/**`
  - `http://localhost:3000/**`
- [ ] Click "Save"

## Part 4: Verify (3 minutes)

### 4.1 Test Login
- [ ] Open your Vercel URL in browser
- [ ] You should see the login page
- [ ] Log in with admin credentials
- [ ] Should redirect to dashboard

### 4.2 Test Navigation
- [ ] Click on Brands, Clients, Projects, Meetings
- [ ] Verify no 404 errors
- [ ] Test creating a new brand
- [ ] Test logout and login again

### 4.3 Check Console
- [ ] Open browser DevTools (F12)
- [ ] Check Console tab - should have no errors
- [ ] If errors about Supabase, double-check environment variables

## Troubleshooting

### ❌ Still getting 404 errors?
1. Check Vercel deployment logs
2. Verify `vercel.json` is in repository root
3. Ensure build succeeded (check Deployments page)
4. Try redeploying: Deployments → ... → Redeploy

### ❌ Can't log in?
1. Verify user exists in BOTH:
   - `auth.users` table (in Supabase)
   - `public.users` table (in Table Editor)
2. Check UUID matches in both tables
3. Verify `is_active` is `true`

### ❌ Missing environment variables error?
1. Go to Vercel → Your Project → Settings → Environment Variables
2. Verify both variables are set
3. Check they're enabled for Production
4. Redeploy after adding variables

### ❌ Build failed?
1. Check build logs in Vercel dashboard
2. Verify `client/package.json` exists
3. Try building locally: `cd client && npm install && npm run build`

## Success! 🎉

Once everything works:
- [ ] Bookmark your Vercel URL
- [ ] Save Supabase credentials securely
- [ ] Add team members via Authentication → Users
- [ ] Start adding your brands and clients!

## Need Help?

📖 Detailed guide: [VERCEL_SETUP.md](./VERCEL_SETUP.md)
📖 Migration details: [SUPABASE_MIGRATION.md](./SUPABASE_MIGRATION.md)
🐛 Issues: [GitHub Issues](https://github.com/craigbfelt/Inexss-CRM/issues)

---

**Total Time: ~15 minutes** ⏱️
