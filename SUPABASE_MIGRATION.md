# Supabase Migration Guide

## Overview

This document outlines the migration of Inexss CRM from a traditional Express.js + MongoDB stack to a modern serverless architecture using Supabase (PostgreSQL) and Vercel.

## What Changed

### Architecture Changes

**Before (Express + MongoDB):**
- Express.js backend server with REST API endpoints
- MongoDB database with Mongoose ODM
- JWT-based authentication managed manually
- Separate backend and frontend deployments
- Node.js server runtime required

**After (Supabase + Vercel):**
- Supabase PostgreSQL database with built-in REST API
- Supabase Authentication (built-in JWT management)
- Row Level Security (RLS) for fine-grained access control
- Static React frontend deployed to Vercel
- Serverless, no backend server maintenance needed

### Database Changes

**MongoDB → PostgreSQL:**
- Collections → Tables with proper relational structure
- Document references → Foreign key relationships
- Embedded documents → Separate tables with join tables
- Schema-less → Strongly typed schema with constraints

**Key Schema Differences:**
1. **Users**: Now tied to Supabase Auth (`auth.users`) with extended profile in `public.users`
2. **Relationships**: Proper many-to-many relationships using join tables:
   - `user_brand_access` - Users ↔ Brands
   - `project_brands` - Projects ↔ Brands
   - `brand_discussions` - Meetings ↔ Brands
   - `action_items` - Meeting action items
3. **Data Types**: 
   - ObjectIds → UUIDs
   - Embedded arrays → Relational tables
   - ISO date strings → PostgreSQL timestamps with timezone

### Authentication Changes

**Before:**
- Custom JWT generation and validation
- Manual password hashing with bcrypt
- Session management in Express middleware
- Manual token refresh logic

**After:**
- Supabase Auth handles all authentication
- Built-in password hashing and security
- Automatic token refresh and session management
- OAuth providers available (Google, GitHub, etc.)

### Service Layer Changes

**Before:**
```javascript
// MongoDB with Mongoose
const brands = await Brand.find({ isActive: true });
```

**After:**
```javascript
// Supabase with PostgreSQL
const { data: brands } = await supabase
  .from('brands')
  .select('*')
  .eq('is_active', true);
```

### Security Improvements

1. **Row Level Security (RLS)**: Database-level access control
2. **Supabase Auth**: Industry-standard authentication
3. **API Key Management**: Automatic rate limiting and security
4. **HTTPS**: Enforced by default on Supabase and Vercel

## Project Structure

```
inexss-crm/
├── client/                          # React frontend (Vercel deployment)
│   ├── public/
│   ├── src/
│   │   ├── components/             # React components
│   │   ├── contexts/
│   │   │   └── AuthContext.js      # Updated for Supabase Auth
│   │   ├── lib/
│   │   │   └── supabase.js         # Supabase client configuration
│   │   ├── services/               # Service layer (replaces API calls)
│   │   │   ├── brandService.js     # Brand operations
│   │   │   ├── clientService.js    # Client operations
│   │   │   ├── projectService.js   # Project operations
│   │   │   └── meetingService.js   # Meeting operations
│   │   └── App.js
│   ├── .env.example                # Environment variables template
│   └── package.json
├── supabase/
│   └── schema.sql                  # Complete database schema
├── vercel.json                     # Vercel deployment config
└── SUPABASE_MIGRATION.md          # This file
```

## Setup Instructions

### Prerequisites

1. Node.js 16+ and npm installed
2. Supabase account (free tier available at [supabase.com](https://supabase.com))
3. Vercel account (free tier available at [vercel.com](https://vercel.com))
4. Git installed

### Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Fill in project details:
   - Name: `inexss-crm` (or your preferred name)
   - Database Password: Generate a strong password (save it!)
   - Region: Choose closest to your users
4. Wait for project to be provisioned (2-3 minutes)

### Step 2: Set Up Database Schema

1. In your Supabase project dashboard, go to **SQL Editor**
2. Click "New Query"
3. Copy the entire contents of `supabase/schema.sql` from this repository
4. Paste it into the SQL editor
5. Click "Run" to execute the schema
6. Verify tables were created in **Table Editor**

### Step 3: Configure Supabase Authentication

1. In Supabase dashboard, go to **Authentication** → **Providers**
2. Enable **Email** provider (enabled by default)
3. Configure email templates (optional):
   - Go to **Authentication** → **Email Templates**
   - Customize confirmation, reset password emails
4. Set up site URL:
   - Go to **Authentication** → **URL Configuration**
   - Add your production URL when ready

### Step 4: Get Supabase Credentials

1. In Supabase dashboard, go to **Settings** → **API**
2. Copy these values:
   - **Project URL** (looks like `https://xxxxx.supabase.co`)
   - **Anon public key** (starts with `eyJ...`)

### Step 5: Configure Frontend Environment

1. Navigate to the `client` directory
2. Copy the example environment file:
   ```bash
   cd client
   cp .env.example .env
   ```
3. Edit `.env` and add your Supabase credentials:
   ```env
   REACT_APP_SUPABASE_URL=https://your-project-id.supabase.co
   REACT_APP_SUPABASE_ANON_KEY=your-anon-key-here
   ```

### Step 6: Install Dependencies

```bash
# Install frontend dependencies
cd client
npm install
```

### Step 7: Run Locally

```bash
# From client directory
npm start
```

The app should open at `http://localhost:3000`

### Step 8: Create First Admin User

Since this is a fresh database, you'll need to create your first admin user:

**Option A: Via Supabase Dashboard**
1. Go to **Authentication** → **Users** in Supabase dashboard
2. Click "Add user" → "Create new user"
3. Enter email and password
4. After user is created, note the UUID
5. Go to **Table Editor** → **users** table
6. Click "Insert" → "Insert row"
7. Fill in:
   - `id`: The UUID from step 4
   - `email`: Same email from step 3
   - `name`: Your name
   - `role`: `admin`
   - `is_active`: `true`
8. Click "Save"

**Option B: Via SQL**
1. First create the auth user in Supabase dashboard (steps 1-4 above)
2. Run this SQL in **SQL Editor** (replace values):
   ```sql
   INSERT INTO public.users (id, email, name, role, is_active)
   VALUES (
     'the-uuid-from-auth-user',
     'admin@example.com',
     'Admin Name',
     'admin',
     true
   );
   ```

### Step 9: Deploy to Vercel

1. Push your code to GitHub (if not already done)
2. Go to [vercel.com](https://vercel.com) and sign in
3. Click "Add New Project"
4. Import your GitHub repository
5. Configure the project:
   - **Framework Preset**: Create React App
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
6. Add environment variables:
   - Click "Environment Variables"
   - Add `REACT_APP_SUPABASE_URL` with your Supabase URL
   - Add `REACT_APP_SUPABASE_ANON_KEY` with your anon key
7. Click "Deploy"
8. Wait for deployment to complete (2-3 minutes)

### Step 10: Update Supabase Site URL

1. After deployment, copy your Vercel URL (e.g., `https://your-app.vercel.app`)
2. In Supabase dashboard, go to **Authentication** → **URL Configuration**
3. Update **Site URL** to your Vercel URL
4. Add to **Redirect URLs**:
   - `https://your-app.vercel.app/**`
   - `http://localhost:3000/**` (for local development)

## Environment Variables

### Client Environment Variables

Create `client/.env` with:

```env
# Required
REACT_APP_SUPABASE_URL=https://your-project.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-key

# Optional for development
REACT_APP_ENV=development
```

### Vercel Environment Variables

Set these in Vercel dashboard under **Settings** → **Environment Variables**:

- `REACT_APP_SUPABASE_URL` → Your Supabase project URL
- `REACT_APP_SUPABASE_ANON_KEY` → Your Supabase anon key

**Important**: Mark these as available for **Production**, **Preview**, and **Development** environments.

## Data Migration (From MongoDB)

If you have existing data in MongoDB that needs to be migrated:

### Export from MongoDB

```bash
# Export each collection to JSON
mongoexport --db inexss-crm --collection users --out users.json --jsonArray
mongoexport --db inexss-crm --collection brands --out brands.json --jsonArray
mongoexport --db inexss-crm --collection clients --out clients.json --jsonArray
mongoexport --db inexss-crm --collection projects --out projects.json --jsonArray
mongoexport --db inexss-crm --collection meetings --out meetings.json --jsonArray
```

### Transform and Import to Supabase

You'll need to write transformation scripts to:
1. Convert ObjectIds to UUIDs
2. Flatten embedded documents
3. Create join table entries
4. Transform date formats

Example transformation for brands:

```javascript
// transform-brands.js
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const mongoData = JSON.parse(fs.readFileSync('brands.json'));
const supabaseData = mongoData.map(doc => ({
  id: uuidv4(), // Generate new UUID
  name: doc.name,
  description: doc.description,
  category: doc.category,
  contact_person: doc.contactPerson,
  contact_email: doc.contactEmail,
  contact_phone: doc.contactPhone,
  website: doc.website,
  is_active: doc.isActive,
  notes: doc.notes,
  created_by: null, // Set manually or lookup
  created_at: doc.createdAt,
  updated_at: doc.updatedAt
}));

fs.writeFileSync('brands-supabase.json', JSON.stringify(supabaseData, null, 2));
```

Then import via SQL:

```sql
-- In Supabase SQL Editor
COPY public.brands (id, name, description, category, contact_person, contact_email, contact_phone, website, is_active, notes, created_at, updated_at)
FROM '/path/to/brands-supabase.csv'
DELIMITER ','
CSV HEADER;
```

**Note**: For large datasets, consider using Supabase's `pg_dump` and `pg_restore` tools or the Supabase CLI.

## Testing

### Manual Testing

1. **Authentication**:
   - [ ] Sign up new user
   - [ ] Sign in with credentials
   - [ ] Sign out
   - [ ] Password reset (if configured)

2. **Brands**:
   - [ ] View brands list
   - [ ] Create new brand
   - [ ] Edit brand
   - [ ] Delete brand (admin only)

3. **Clients**:
   - [ ] View clients list
   - [ ] Create new client
   - [ ] Edit client
   - [ ] View client details

4. **Projects**:
   - [ ] View projects list
   - [ ] Create project with brands
   - [ ] Edit project and update brands
   - [ ] View project details with client and brands
   - [ ] Filter projects by client
   - [ ] Filter projects by brand

5. **Meetings**:
   - [ ] View meetings list
   - [ ] Create meeting with brand discussions
   - [ ] Add action items to meeting
   - [ ] Complete/uncomplete action items
   - [ ] View meeting details
   - [ ] Filter meetings by client/project

6. **Permissions** (test with different roles):
   - [ ] Admin can access everything
   - [ ] Staff can create/edit but not delete
   - [ ] Brand representatives have limited access

### Automated Testing

Consider adding:

```bash
# Example Jest test structure
client/src/services/__tests__/
├── brandService.test.js
├── clientService.test.js
├── projectService.test.js
└── meetingService.test.js
```

## Troubleshooting

### Common Issues

**1. "Missing Supabase environment variables" error**
- Ensure `.env` file exists in `client/` directory
- Check that variables start with `REACT_APP_`
- Restart development server after adding env vars

**2. Authentication not working**
- Verify Supabase project is active
- Check anon key is correct (not the service role key!)
- Ensure user exists in both `auth.users` and `public.users` tables

**3. Row Level Security blocking queries**
- Check RLS policies in Supabase dashboard
- Ensure user is authenticated (`auth.uid()` returns a value)
- Verify user role is set correctly in `public.users` table

**4. "relation does not exist" error**
- Schema not applied correctly
- Re-run the `supabase/schema.sql` file
- Check table names are lowercase

**5. CORS errors**
- Supabase handles CORS automatically
- If issues persist, check Supabase project URL is correct
- Ensure using `https://` not `http://`

**6. Deployment fails on Vercel**
- Check build logs for errors
- Ensure environment variables are set in Vercel
- Verify root directory is set to `client`
- Check build command is `npm run build`

### Getting Help

- **Supabase Docs**: [supabase.com/docs](https://supabase.com/docs)
- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
- **Supabase Discord**: [discord.supabase.com](https://discord.supabase.com)

## Performance Considerations

### Database Optimization

1. **Indexes**: Already created for common queries (see schema.sql)
2. **Connection Pooling**: Handled automatically by Supabase
3. **Query Optimization**: Use `.select()` to only fetch needed columns

Example:
```javascript
// Bad - fetches all data
const projects = await supabase.from('projects').select('*');

// Good - only fetch what you need
const projects = await supabase
  .from('projects')
  .select('id, name, status, client:clients(name)');
```

### Caching Strategies

1. **React Query** (recommended):
```bash
npm install @tanstack/react-query
```

2. **SWR** (alternative):
```bash
npm install swr
```

3. **Client-side caching**: Use React context or state management

### Real-time Features

Supabase supports real-time subscriptions:

```javascript
// Subscribe to changes in meetings table
const subscription = supabase
  .channel('meetings-changes')
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'meetings'
  }, (payload) => {
    console.log('Meeting changed:', payload);
    // Update UI
  })
  .subscribe();

// Cleanup
subscription.unsubscribe();
```

## Security Best Practices

### 1. Environment Variables
- Never commit `.env` files to Git
- Use different keys for development/production
- Rotate keys periodically

### 2. Row Level Security
- Always test RLS policies thoroughly
- Use least privilege principle
- Audit policies regularly

### 3. Input Validation
- Validate on frontend AND database level
- Use PostgreSQL constraints
- Sanitize user inputs

### 4. Authentication
- Enforce strong passwords
- Enable email verification
- Consider adding 2FA

### 5. Rate Limiting
- Supabase provides automatic rate limiting
- Monitor usage in Supabase dashboard
- Set up alerts for unusual activity

## Monitoring and Logging

### Supabase Dashboard

Monitor in real-time:
1. **API**: Request metrics and performance
2. **Auth**: User signups and logins
3. **Database**: Connection pool and query performance
4. **Logs**: Real-time logs for debugging

### Vercel Dashboard

Monitor deployments:
1. **Analytics**: Page views and performance
2. **Functions**: API route performance (if any)
3. **Logs**: Runtime logs
4. **Errors**: Error tracking and reporting

### Recommended Setup

1. **Error Tracking**: Add Sentry or similar
   ```bash
   npm install @sentry/react
   ```

2. **Analytics**: Add Google Analytics or Plausible
   ```bash
   npm install react-ga4
   ```

## Backup and Recovery

### Automated Backups

Supabase provides:
- **Daily backups** (Pro plan)
- **Point-in-time recovery** (Pro plan)
- **Manual backups** via dashboard

### Manual Backup

```bash
# Export database (requires Supabase CLI)
supabase db dump -f backup.sql

# Restore database
supabase db reset
psql -h db.your-project.supabase.co -U postgres -d postgres -f backup.sql
```

## Cost Optimization

### Supabase Free Tier

- 500 MB database space
- 2 GB file storage
- 50 MB file upload limit
- Unlimited API requests
- 50,000 monthly active users

### Vercel Free Tier

- 100 GB bandwidth
- Unlimited websites
- Automatic HTTPS
- Serverless functions

### When to Upgrade

Consider paid plans when:
- Database > 500 MB
- Need daily backups
- Require point-in-time recovery
- Need custom domain on Supabase
- Bandwidth > 100 GB/month

## Next Steps

### Recommended Enhancements

1. **Add File Uploads**:
   - Use Supabase Storage for documents
   - Store project files, meeting notes, etc.

2. **Implement Real-time Updates**:
   - Live updates when data changes
   - Collaborative editing features

3. **Add Email Notifications**:
   - Action item reminders
   - Meeting notifications
   - Use services like SendGrid or Resend

4. **Mobile App**:
   - React Native with same Supabase backend
   - Offline-first with local storage

5. **Advanced Analytics**:
   - Dashboard with charts
   - Revenue tracking
   - Project success metrics

6. **PDF Export**:
   - Generate meeting reports
   - Project summaries
   - Client proposals

## Conclusion

The migration from Express + MongoDB to Supabase + Vercel provides:

✅ **Reduced complexity** - No backend server to maintain  
✅ **Better security** - Built-in auth and RLS  
✅ **Improved performance** - PostgreSQL with automatic optimization  
✅ **Lower costs** - Generous free tiers  
✅ **Better DX** - Type-safe queries and real-time features  
✅ **Easier scaling** - Automatic scaling on both platforms  

The new architecture is production-ready, secure, and scalable for the Inexss CRM application.

## Support

For issues or questions related to this migration:
1. Check this documentation first
2. Review Supabase and Vercel documentation
3. Check existing GitHub issues
4. Create a new GitHub issue with:
   - Clear description of the problem
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable

---

**Last Updated**: 2024  
**Migration Version**: 1.0  
**Supabase Version**: Latest  
**Vercel Version**: Latest
