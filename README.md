# Inexss CRM

A comprehensive, visually stunning CRM system designed specifically for Inexx Specialised Solutions - a building specification company working with architects on construction projects.

## ⚠️ Important: RLS Fix for Signup/Login Issues

If you're experiencing "infinite recursion detected in policy for relation 'users'" errors:

**✅ Solution:** Run the migration script in `supabase/migration_fix_user_policies.sql`

📖 **Full Guide:** See [`RLS_FIX_GUIDE.md`](./RLS_FIX_GUIDE.md) for complete instructions and troubleshooting.

## 🌟 Features

### For All Users
- **Beautiful, Modern UI**: Vibrant gradients, smooth animations, and professional design
- **Role-Based Access**: Secure authentication with different permission levels
- **Dashboard Overview**: Real-time statistics and activity tracking
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

### For Admin & Staff
- **Client Management**: Track architects, developers, and contractors
- **Brand Management**: Manage 15+ brand/principal relationships
- **Meeting Tracking**: Record meetings with multiple brands discussed per session
- **Project Tracking**: Monitor building projects from lead to completion
- **Monthly Reporting**: Generate detailed reports with filtering and analytics
- **Team Management**: Coordinate teams across JHB, Cape Town, and Durban

### For Brand Representatives
- **Brand-Specific Dashboard**: View only meetings and projects for assigned brands
- **Performance Metrics**: See hit rates and brand requirement statistics
- **Activity Reports**: Filter data specific to their brand

### For Contractors
- **Read-Only Access**: View clients and projects they're involved with
- **Meeting History**: See their own meeting records
- **Project Tracking**: Monitor projects they're working on

### For Suppliers
- **Brand-Filtered View**: Access information for their supplied brands only
- **Project Visibility**: See projects using their products
- **Restricted Access**: Read-only access to maintain data integrity

## 🎨 Design Highlights

- **Vibrant Color Palette**: Eye-catching gradients and color schemes
- **Smooth Animations**: Framer Motion animations for enhanced user experience
- **Glass Morphism**: Modern UI effects with backdrop blur
- **Interactive Elements**: Hover effects, transitions, and micro-interactions
- **Custom Scrollbars**: Styled scrollbars matching the design theme
- **Gradient Text**: Beautiful text effects with color gradients

## 🛠️ Technology Stack

### Backend
- **Supabase** - PostgreSQL database with built-in auth
- **Vercel** - Serverless deployment
- **Row Level Security (RLS)** - Database-level authorization
- **bcryptjs** for password hashing
- **Express Validator** for input validation

### Frontend
- **React 18** with Hooks
- **React Router** for navigation
- **Framer Motion** for animations
- **Lucide React** for beautiful icons
- **Recharts** for data visualization
- **Supabase JS Client** for database and auth
- **date-fns** for date handling

## 📋 Prerequisites

- Node.js (v18 or higher)
- Supabase account (free tier available)
- Vercel account (free tier available)
- npm or yarn package manager

## 🚀 Quick Start (Cloud Deployment)

**This application is designed to run on Vercel + Supabase cloud infrastructure.**

### Option 1: Deploy to Cloud (Recommended) ⭐

**📖 Complete Step-by-Step Guide: [`VERCEL_SETUP.md`](./VERCEL_SETUP.md)**

This is the easiest and fastest way to get started:

1. **Set up Supabase** (5 minutes)
   - Create free Supabase project
   - Run the database schema
   - Create your first admin user

2. **Deploy to Vercel** (5 minutes)
   - Import repository to Vercel
   - Add environment variables
   - Deploy with one click!

**👉 Start here: [VERCEL_SETUP.md](./VERCEL_SETUP.md) - Complete deployment guide with screenshots and troubleshooting**

For advanced setup and migration details, see [`SUPABASE_MIGRATION.md`](./SUPABASE_MIGRATION.md).

### Option 2: Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/craigbfelt/Inexss-CRM.git
   cd Inexss-CRM
   ```

2. **Install frontend dependencies**
   ```bash
   cd client
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `client/.env` and add your Supabase credentials:
   - `REACT_APP_SUPABASE_URL`: Your Supabase project URL
   - `REACT_APP_SUPABASE_ANON_KEY`: Your Supabase anonymous key

4. **Set up Supabase**
   
   Follow the setup guide in [`supabase/README.md`](./supabase/README.md) to create your database.

## 🎯 Running the Application

### Development Mode (Local)

```bash
cd client
npm start
```

The application will open at `http://localhost:3000` and connect to your Supabase project.

### Production Mode

Deploy to Vercel - see [`SUPABASE_MIGRATION.md`](./SUPABASE_MIGRATION.md) for complete instructions.

## 👥 User Roles

### Admin
- Full access to all features
- Can create and manage all entities
- User management capabilities
- Access to all reports and analytics

### Staff
- Create and edit clients, meetings, projects
- Access to all brands
- Generate reports
- Coordinate across locations

### Brand Representative
- View meetings mentioning their assigned brand(s)
- See projects involving their brand(s)
- Generate brand-specific reports
- Limited editing capabilities

### Contractor
- View clients and projects they're involved with
- See their own meeting history
- Read-only access to most data
- Cannot create or delete records

### Supplier
- View information for their supplied brand(s) only
- See projects using their products
- Access brand-specific reports
- Read-only access to maintain data integrity

## 📊 Data Models

### User
- Name, email, password
- Role (admin, staff, brand_representative, contractor, supplier)
- Location (JHB, Cape Town, Durban, Other)
- Brand access (for restricted roles)

### Brand/Principal
- Name, description, category
- Contact information
- Website and notes

### Client
- Name, company, type (Architect, Developer, Contractor)
- Contact details
- Address information

### Meeting
- Client reference
- Meeting date and location
- Multiple brands discussed (with requirement status)
- Summary and action items
- Follow-up dates

### Project
- Name, project number
- Client reference
- Location and description
- Status (Lead, Quoted, In Progress, etc.)
- Brands involved
- Estimated value and dates

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token-based authentication
- Role-based authorization middleware
- Protected API routes
- Input validation and sanitization
- Secure session management

## 📡 Database & API

### Database Tables
- **users** - User profiles with role-based access
- **brands** - Brand/principal information
- **clients** - Architect, developer, and contractor records
- **projects** - Building projects with status tracking
- **meetings** - Meeting records with brand discussions
- **action_items** - Follow-up tasks from meetings

### Authentication
- Powered by **Supabase Auth**
- Email/password authentication
- Row Level Security (RLS) policies for authorization
- Session management with auto-refresh

### Data Access
All data access is handled through Supabase client services:
- `brandService.js` - Brand CRUD operations
- `clientService.js` - Client management
- `projectService.js` - Project tracking with brand relationships
- `meetingService.js` - Meeting records with discussions and action items

See [`SUPABASE_MIGRATION.md`](./SUPABASE_MIGRATION.md) for API details and database schema.

## 🎨 Customization

### Colors
Edit `/client/src/index.css` to change the color scheme:
```css
:root {
  --primary: #6366f1;
  --secondary: #ec4899;
  --accent: #f59e0b;
  /* ... more variables */
}
```

### Branding
Update the logo and company name in:
- `/client/src/pages/Login.js`
- `/client/src/pages/Dashboard.js`

## 🐛 Troubleshooting

### Supabase Connection Issues
- Verify environment variables are set correctly
- Check Supabase project is not paused (free tier auto-pauses)
- Verify API keys are from the correct project
- Check browser console for detailed error messages

### Authentication Issues
- Clear browser local storage and cookies
- Verify user exists in both `auth.users` and `public.users` tables
- Check RLS policies are enabled
- Ensure user role matches policy requirements

### Build Errors
- Clear node_modules and reinstall:
  ```bash
  rm -rf node_modules client/node_modules
  cd client && npm install
  ```

### Data Not Appearing
- Check RLS policies in Supabase dashboard
- Verify user is authenticated
- Check browser network tab for failed requests
- Ensure Supabase tables have data

For more troubleshooting help, see:
- 📖 [**VERCEL_SETUP.md**](./VERCEL_SETUP.md) - Complete deployment guide
- 📋 [**QUICK_DEPLOY.md**](./QUICK_DEPLOY.md) - Quick checklist for deployment
- ⚙️ [**VERCEL_CONFIG.md**](./VERCEL_CONFIG.md) - Vercel dashboard configuration
- 🔄 [**SUPABASE_MIGRATION.md**](./SUPABASE_MIGRATION.md) - Advanced migration details

## 📚 Documentation

This project includes comprehensive documentation:

### Deployment Guides
- **[VERCEL_SETUP.md](./VERCEL_SETUP.md)** ⭐ - Start here! Complete step-by-step guide for deploying to Vercel + Supabase
- **[AUTHENTICATION_SETUP.md](./AUTHENTICATION_SETUP.md)** 🔐 - Quick reference for authentication configuration and troubleshooting
- **[QUICK_DEPLOY.md](./QUICK_DEPLOY.md)** - Quick reference checklist for deployment (15 minutes)
- **[VERCEL_CONFIG.md](./VERCEL_CONFIG.md)** - Detailed Vercel dashboard configuration reference
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Legacy deployment options (Heroku, DigitalOcean, AWS)

### Technical Documentation
- **[SUPABASE_MIGRATION.md](./SUPABASE_MIGRATION.md)** - Database schema, migration from MongoDB, advanced setup
- **[supabase/README.md](./supabase/README.md)** - Database schema documentation
- **[supabase/schema.sql](./supabase/schema.sql)** - Complete database schema with RLS policies

### Other Documentation
- **[USER_GUIDE.md](./USER_GUIDE.md)** - End-user guide for using the CRM
- **[PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)** - Project overview and features
- **[SECURITY.md](./SECURITY.md)** - Security considerations and best practices
- **[404_FIX.md](./404_FIX.md)** - Details on the custom 404 page implementation
- **[VERCEL_FIX.md](./VERCEL_FIX.md)** - Historical context on Vercel deployment fixes

## 🚀 Deployment

This application is designed to run on:
- **Frontend**: Vercel (free tier available)
- **Database**: Supabase (free tier available)
- **Authentication**: Supabase Auth

See [`VERCEL_SETUP.md`](./VERCEL_SETUP.md) for complete deployment guide.

## 🙏 Acknowledgments

Built for Janine Course and the Inexx Specialised Solutions team to streamline their business operations and client relationship management.

---

**Note**: This is a custom-built CRM solution tailored specifically for the building specification industry and multi-brand representation business model, now running entirely on cloud infrastructure with Vercel + Supabase.

