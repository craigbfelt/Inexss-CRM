# Inexss CRM - Simple Setup Guide

Welcome! This guide will help you set up the Inexss CRM in just a few minutes.

## 📋 Prerequisites

Before you begin, make sure you have:

- ✅ **Node.js 20.x or later** installed ([download here](https://nodejs.org/))
- ✅ **A Supabase account** (free tier works perfectly - [sign up here](https://supabase.com))

## 🚀 Quick Setup (3 Steps)

### Step 1: Install Dependencies

```bash
cd Inexss-CRM
npm install
```

### Step 2: Create Your Supabase Project

1. Go to [https://supabase.com](https://supabase.com) and sign in
2. Click **"New Project"**
3. Fill in the details:
   - **Name**: `inexss-crm` (or your preferred name)
   - **Database Password**: Generate a strong password (save it!)
   - **Region**: Choose the one closest to you
4. Click **"Create new project"** and wait 1-2 minutes

### Step 3: Run Automated Setup

```bash
npm run setup
```

This interactive script will:
- ✅ Collect your Supabase credentials
- ✅ Create the `.env` file automatically
- ✅ Validate your connection
- ✅ Guide you through database setup
- ✅ Help you create the admin user
- ✅ Verify everything works

**Follow the on-screen prompts** - the script will guide you through each step!

## 🎯 That's It!

After setup completes, start the development server:

```bash
npm run dev
```

Open http://localhost:3000 and login with:
- **Email**: `craig@zerobitone.co.za`
- **Password**: The password you set during admin user creation

## 📚 Useful Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run setup` | Run automated setup (re-run anytime) |
| `npm run verify` | Verify your setup is working |
| `npm run migrate` | View/help with database migrations |
| `npm run build` | Build for production |

## 🔍 Verifying Your Setup

To check if everything is configured correctly:

```bash
npm run verify
```

This will check:
- ✅ Environment variables are set
- ✅ Connection to Supabase works
- ✅ Database tables exist
- ✅ Admin user is created and configured

## 🆘 Troubleshooting

### "Cannot connect to Supabase"

**Solution**: 
1. Double-check your Supabase URL and anon key
2. Make sure you copied the **anon public** key (not service_role)
3. Re-run `npm run setup` to update credentials

### "Tables do not exist"

**Solution**:
1. Go to your Supabase Dashboard
2. Navigate to **SQL Editor**
3. Click **"New Query"**
4. Copy the entire contents of `supabase/schema.sql`
5. Paste and click **"Run"**
6. Run `npm run verify` to confirm

### "Admin user not found"

**Solution**:
1. Go to Supabase Dashboard → **Authentication** → **Users**
2. Click **"Add User"**
3. Email: `craig@zerobitone.co.za`
4. Password: (set a secure password)
5. ✅ Enable **"Auto Confirm User"**
6. Click **"Create User"**
7. Go to **SQL Editor** and run `supabase/setup_admin_user.sql`
8. Run `npm run verify` to confirm

### "Cannot sign in"

**Solutions to try**:
1. **Check email confirmation**:
   - Go to **Authentication** → **Users** in Supabase
   - Find your user and click **"Confirm email"** if needed
   
2. **Check RLS policies**:
   - Make sure you ran the complete `schema.sql` file
   - RLS policies should be automatically created
   
3. **Reset password**:
   - In Supabase Dashboard → **Authentication** → **Users**
   - Click on the user and select **"Reset password"**

### Still having issues?

Run the verification script for detailed diagnostics:

```bash
npm run verify
```

The script will tell you exactly what's missing or misconfigured.

## 🔐 Security Notes

- ✅ The `.env` file is automatically added to `.gitignore` (never commit it!)
- ✅ Use the **anon public** key in your `.env` (not the service_role key)
- ✅ The service_role key should NEVER be used in frontend code
- ✅ All database operations use Row-Level Security (RLS) for protection

## 📖 What's Next?

Once your setup is complete:

1. **Explore the Dashboard** - View KPIs, charts, and recent activity
2. **Manage Contacts** - Add, edit, and organize your contacts
3. **Try Signup** - Test creating a new user account
4. **Customize** - Modify the design and features to your needs

## 🎨 Understanding the Project

- **Frontend**: React + Vite + Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth)
- **Database**: All schemas in `supabase/schema.sql`
- **Auth**: Handled by `src/contexts/AuthContext.jsx`
- **Services**: API calls in `src/services/`

## 📁 Key Files

| File | Purpose |
|------|---------|
| `.env` | Your Supabase credentials (created by setup) |
| `supabase/schema.sql` | Complete database schema |
| `supabase/setup_admin_user.sql` | Creates admin user |
| `src/lib/supabaseClient.js` | Supabase connection config |
| `src/contexts/AuthContext.jsx` | Authentication state management |

## 🔄 Re-running Setup

You can re-run the setup anytime:

```bash
npm run setup
```

It will detect existing configuration and ask if you want to keep it or reconfigure.

## 💡 Tips

- Run `npm run verify` regularly to catch configuration issues early
- The setup scripts are safe to run multiple times
- All scripts provide helpful error messages and guidance
- Check the console for detailed logs if something goes wrong

---

**Need more help?** 

- Check the troubleshooting section above
- Run `npm run verify` for diagnostics
- Review the migration files in `supabase/` directory
- The scripts provide step-by-step guidance

**Happy CRM-ing!** 🚀
