# Quick Start - Admin Setup

## 🎯 Goal
Set up craig@zerobitone.co.za as an admin user so you can log in to the CRM.

## ✅ Quick Steps (5 minutes)

### 1. Create Supabase Project
- Go to https://supabase.com
- Create new project: "inexss-crm"
- Save the database password!

### 2. Run Database Schema
- In Supabase: **SQL Editor** > **New query**
- Copy/paste entire `schema.sql` file
- Click **Run**

### 3. Create Admin User
- In Supabase: **Authentication** > **Users** > **Add user**
- Email: `craig@zerobitone.co.za`
- Password: (choose a strong one)
- ✓ **Enable "Auto Confirm User"** ← Important!
- Click **Create user**

### 4. Set Admin Role
- Copy the User ID from the created user
- In Supabase: **SQL Editor** > **New query**
- Run this (replace YOUR-USER-ID):
```sql
INSERT INTO public.users (id, email, name, role, location, is_active)
VALUES (
  'YOUR-USER-ID-HERE',
  'craig@zerobitone.co.za',
  'Craig Felt',
  'admin',
  'JHB',
  true
)
ON CONFLICT (id) DO UPDATE SET role = 'admin';
```

### 5. Configure App
- In project root, copy `.env.example` to `.env`
- In Supabase: **Project Settings** > **API**
- Copy **Project URL** and **anon public** key to `.env`

### 6. Verify Setup (Optional)
```bash
npm install
npm run check-setup
```
This will verify your configuration is correct.

### 7. Run App
```bash
npm run dev
```

### 8. Test Login
- Open http://localhost:3000/login
- Login with: craig@zerobitone.co.za
- Use the password you set in step 3

## 🎉 Done!
You should now be logged in as admin.

## ❌ Problems?

### Can't log in?
1. Check email is confirmed in Supabase Dashboard
2. Verify role is 'admin' in public.users table
3. Try resetting password in Supabase Dashboard

### Signup errors?
- Run `migration_fix_signup_rls.sql` in SQL Editor
- See [SETUP_GUIDE.md](SETUP_GUIDE.md) for details

### Need more help?
See [SETUP_GUIDE.md](SETUP_GUIDE.md) for complete troubleshooting.
