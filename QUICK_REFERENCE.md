# Inexss CRM - Quick Reference Card

## 🚀 First Time Setup

```bash
npm install
npm run setup
```

## 📝 Essential Commands

| Command | What It Does |
|---------|--------------|
| `npm run dev` | Start development server |
| `npm run setup` | Run automated setup wizard |
| `npm run verify` | Check if setup is complete |
| `npm run migrate` | View migration instructions |
| `npm run build` | Build for production |

## 🔑 Admin Login

- **Email**: `craig@zerobitone.co.za`
- **Password**: (Set during admin user creation)
- **URL**: http://localhost:3000

## 📍 Where to Find Things

### Supabase Credentials
1. Go to https://app.supabase.com
2. Select your project
3. Settings → API
4. Copy URL and anon key

### Database Setup
1. Go to https://app.supabase.com
2. Select your project
3. SQL Editor → New Query
4. Copy from `supabase/schema.sql`
5. Click Run

### Create Admin User
1. Supabase Dashboard → Authentication → Users
2. Add User
3. Email: `craig@zerobitone.co.za`
4. ✅ Auto Confirm User
5. Run `supabase/setup_admin_user.sql`

## 🆘 Quick Fixes

### Can't connect?
```bash
npm run setup  # Reconfigure credentials
```

### Tables missing?
Run `supabase/schema.sql` in Supabase SQL Editor

### Can't sign in?
1. Confirm user email in Supabase Dashboard
2. Check role is 'admin' in users table
3. Reset password if needed

### Setup broken?
```bash
npm run verify  # See what's wrong
```

## 📂 Important Files

- `.env` - Your credentials (don't commit!)
- `SETUP.md` - Full setup guide
- `supabase/schema.sql` - Database schema
- `supabase/setup_admin_user.sql` - Admin user script

## 🔒 Security Reminders

- ✅ Use **anon public** key (not service_role)
- ✅ Never commit `.env` file
- ✅ Keep database password secure
- ✅ Enable 2FA on Supabase account

## 📚 Documentation

- **[SETUP.md](SETUP.md)** - Start here!
- [README.md](README.md) - Project overview
- [supabase/SETUP_GUIDE.md](supabase/SETUP_GUIDE.md) - Detailed docs

---

**Still stuck?** Run `npm run verify` for diagnostics!
