# Supabase Setup Guide

This directory contains the database schema and setup instructions for deploying Inexss CRM to Supabase.

## 🚨 Login/Registration Issues?

**If you're experiencing login or registration problems**, see **[SETUP_GUIDE.md](SETUP_GUIDE.md)** for:
- Complete troubleshooting steps
- How to set up the admin user (craig@zerobitone.co.za)
- Fixing RLS policy errors
- Resolving signup issues

## Quick Links

- **[SETUP_GUIDE.md](SETUP_GUIDE.md)** - Complete setup and troubleshooting guide (START HERE)
- **[setup_admin_user.sql](setup_admin_user.sql)** - Script to create admin user
- **[verify_complete_setup.sql](verify_complete_setup.sql)** - Verify your setup is correct

## Prerequisites

1. **Supabase Account**: Sign up at [https://supabase.com](https://supabase.com)
2. **Vercel Account**: Sign up at [https://vercel.com](https://vercel.com)

## Step 1: Create Supabase Project

1. Log in to [Supabase Dashboard](https://app.supabase.com)
2. Click "New Project"
3. Fill in project details:
   - **Name**: inexss-crm
   - **Database Password**: Generate a strong password (save this!)
   - **Region**: Choose closest to your users
4. Click "Create new project"
5. Wait for project to be provisioned (1-2 minutes)

## Step 2: Run Database Schema

1. In Supabase Dashboard, go to **SQL Editor**
2. Click "New query"
3. Copy the entire contents of `schema.sql` from this directory
4. Paste into the SQL editor
5. Click "Run" to execute the schema
6. Verify all tables were created successfully in the **Table Editor**

You should see these tables:
- users
- brands
- user_brand_access
- clients
- projects
- project_brands
- meetings
- brand_discussions
- action_items

## Step 3: Configure Authentication

1. In Supabase Dashboard, go to **Authentication** > **Providers**
2. Enable **Email** provider (enabled by default)
3. Configure email templates (optional but recommended):
   - Go to **Authentication** > **Email Templates**
   - Customize "Confirm signup", "Magic Link", etc.

### Email Settings (Production)
For production, configure a custom SMTP provider:
1. Go to **Project Settings** > **Auth**
2. Scroll to "SMTP Settings"
3. Enter your SMTP credentials (e.g., SendGrid, AWS SES, Mailgun)

## Step 4: Get API Credentials

1. In Supabase Dashboard, go to **Project Settings** > **API**
2. Copy these values (you'll need them for Vercel):
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: `eyJhbG...` (long string)
   - **service_role key**: `eyJhbG...` (keep this secret!)

## Step 5: Create Admin User

After deployment, you'll need to create the first admin user:

### Option A: Using Supabase Dashboard

1. Go to **Authentication** > **Users**
2. Click "Add user"
3. Enter:
   - Email: `admin@inexss.co.za`
   - Password: Choose a strong password
   - Auto Confirm User: **Yes**
4. Click "Create user"
5. Copy the User ID (UUID)
6. Go to **Table Editor** > **users** table
7. Click "Insert row"
8. Fill in:
   - id: (paste the User ID)
   - name: `Admin User`
   - email: `admin@inexss.co.za`
   - role: `admin`
   - location: `JHB`
   - is_active: `true`
9. Click "Save"

### Option B: Using SQL

1. Go to **SQL Editor**
2. Run this query (replace values):

```sql
-- First, get the user ID from auth.users after creating through dashboard
-- Or create both at once:

INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_user_meta_data)
VALUES (
  gen_random_uuid(),
  'admin@inexss.co.za',
  crypt('YourSecurePassword', gen_salt('bf')),
  NOW(),
  '{}'::jsonb
);

-- Then add to public.users (replace UUID with the one from above)
INSERT INTO public.users (id, name, email, role, location, is_active)
VALUES (
  'UUID-FROM-ABOVE',
  'Admin User',
  'admin@inexss.co.za',
  'admin',
  'JHB',
  true
);
```

## Step 6: Configure Row Level Security (RLS)

The schema already includes RLS policies, but verify they're enabled:

1. Go to **Table Editor**
2. Click on each table name
3. Look for "RLS enabled" badge
4. If not enabled, click table settings and enable RLS

## Step 7: Set Up Storage (Optional)

If you need file uploads (future feature):

1. Go to **Storage**
2. Click "Create bucket"
3. Name it `attachments`
4. Set policies as needed

## Step 8: Test Database Connection

You can test the database directly from Node.js:

```javascript
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://xxxxx.supabase.co',
  'your-anon-key'
);

// Test query
const { data, error } = await supabase
  .from('brands')
  .select('*');

console.log(data, error);
```

## Environment Variables for Vercel

When deploying to Vercel, set these environment variables:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...
SUPABASE_SERVICE_ROLE_KEY=eyJhbG... # Keep secret!
```

## Database Backups

Supabase provides automatic backups:

- **Free Plan**: Daily backups (7 days retention)
- **Pro Plan**: Point-in-time recovery (30 days)

To create manual backup:
1. Go to **Database** > **Backups**
2. Click "Create backup"

## Monitoring

Monitor your database:

1. **Database** > **Performance**: View query performance
2. **Database** > **Replication**: Check replication lag
3. **Reports**: View usage statistics

## Troubleshooting

### Connection Issues
- Verify API keys are correct
- Check if database is paused (free tier auto-pauses after inactivity)
- Verify network connectivity

### RLS Policy Errors
- Ensure user is authenticated
- Check user role matches policy requirements
- Verify policies are enabled on tables

### Migration Issues
- Check SQL errors in the SQL Editor output
- Verify UUID extension is installed
- Ensure all foreign key references are valid

## Security Best Practices

1. ✅ Never expose `service_role` key in client-side code
2. ✅ Use environment variables for all credentials
3. ✅ Enable RLS on all tables
4. ✅ Regularly review and update RLS policies
5. ✅ Use HTTPS only (enforced by Supabase)
6. ✅ Enable 2FA on Supabase account
7. ✅ Regularly backup database
8. ✅ Monitor authentication logs

## Next Steps

After Supabase is set up:
1. Deploy frontend to Vercel (see main README.md)
2. Configure environment variables in Vercel
3. Test authentication flow
4. Create initial brands data
5. Add team members

## Support

- **Supabase Docs**: [https://supabase.com/docs](https://supabase.com/docs)
- **Community**: [https://github.com/supabase/supabase/discussions](https://github.com/supabase/supabase/discussions)
- **Status**: [https://status.supabase.com](https://status.supabase.com)

---

**Last Updated**: January 2026
