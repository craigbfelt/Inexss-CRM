# Troubleshooting Guide

Common issues and their solutions for Inexss CRM.

## 🔍 Diagnosis First

Always start with:
```bash
npm run verify
```

This will tell you exactly what's wrong.

## Common Issues

### 1. "Cannot connect to Supabase"

**Symptoms:**
- Error when running `npm run dev`
- "Invalid API key" messages
- Connection timeout errors

**Solutions:**

✅ **Check credentials**
```bash
npm run setup  # Re-enter credentials
```

✅ **Verify you're using the anon public key**
- Go to Supabase Dashboard → Settings → API
- Copy the "anon public" key (NOT service_role)
- Should start with `eyJ`

✅ **Check your .env file**
```bash
cat .env
```
Should show:
```
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbG...
```

✅ **Restart dev server**
```bash
# Stop server (Ctrl+C), then:
npm run dev
```

### 2. "Tables do not exist"

**Symptoms:**
- Errors about missing tables
- "relation does not exist" messages
- `npm run verify` shows tables missing

**Solutions:**

✅ **Run the database schema**
1. Go to https://app.supabase.com
2. Select your project
3. Go to SQL Editor
4. Click "New Query"
5. Open `supabase/schema.sql` in your editor
6. Copy ALL contents (all 319 lines)
7. Paste into Supabase SQL Editor
8. Click "Run"
9. Wait for "Success" message

✅ **Verify tables were created**
- In Supabase Dashboard, go to Table Editor
- You should see: users, brands, clients, projects, meetings, etc.

### 3. "Cannot sign in" / "Invalid credentials"

**Symptoms:**
- Login fails with correct password
- "Invalid login credentials" error
- Can't access dashboard

**Solutions:**

✅ **Check email is confirmed**
1. Supabase Dashboard → Authentication → Users
2. Find `craig@zerobitone.co.za`
3. Look for green checkmark
4. If not confirmed, click user → "Confirm email"

✅ **Reset password**
1. Supabase Dashboard → Authentication → Users
2. Click on the user
3. Click "Reset password"
4. Or use "Send password recovery"

✅ **Check user role**
1. Supabase Dashboard → Table Editor → users table
2. Find email: `craig@zerobitone.co.za`
3. Check `role` column = `admin`
4. If not admin, run `supabase/setup_admin_user.sql`

✅ **Check user is active**
- In users table, `is_active` should be `true`

### 4. "Admin user not found"

**Symptoms:**
- `npm run verify` says admin user missing
- Can't find user in dashboard

**Solutions:**

✅ **Create the admin user**
1. Supabase Dashboard → Authentication → Users
2. Click "Add User"
3. Fill in:
   - Email: `craig@zerobitone.co.za`
   - Password: (choose secure password)
   - ✅ Auto Confirm User: ENABLE THIS!
4. Click "Create user"

✅ **Set admin role**
1. Go to SQL Editor
2. Open `supabase/setup_admin_user.sql`
3. Copy all contents
4. Paste and Run
5. Should see success messages

✅ **Verify**
```bash
npm run verify
```

### 5. "Row-level security policy violation"

**Symptoms:**
- Cannot create/update records
- Signup fails
- "new row violates row-level security policy"

**Solutions:**

✅ **Run RLS fix migrations**
1. Go to SQL Editor
2. Run `supabase/migration_fix_signup_rls.sql`
3. Run `supabase/migration_fix_user_policies.sql`

✅ **Verify RLS policies exist**
- Table Editor → users table → Settings → Policies
- Should see policies for INSERT, SELECT, UPDATE

### 6. "Infinite recursion detected in policy"

**Symptoms:**
- Signup fails
- Login causes errors
- Recursion errors in console

**Solutions:**

✅ **Apply fix migration**
1. SQL Editor
2. Run `supabase/migration_fix_user_policies.sql`
3. This removes problematic policies

### 7. Setup script fails or hangs

**Symptoms:**
- `npm run setup` crashes
- Prompts don't appear
- Script gets stuck

**Solutions:**

✅ **Update Node.js**
```bash
node --version  # Should be 20.x or later
```

✅ **Reinstall dependencies**
```bash
rm -rf node_modules package-lock.json
npm install
```

✅ **Manual setup**
1. Copy `.env.example` to `.env`
2. Edit `.env` with your credentials
3. Follow SETUP.md manually

### 8. "Module not found" errors

**Symptoms:**
- Cannot find module errors
- Import errors
- Missing dependencies

**Solutions:**

✅ **Install dependencies**
```bash
npm install
```

✅ **Clear cache and reinstall**
```bash
rm -rf node_modules package-lock.json
npm install
```

### 9. Port already in use

**Symptoms:**
- "Port 3000 already in use"
- Cannot start dev server

**Solutions:**

✅ **Kill existing process**
```bash
# Find process using port 3000
lsof -ti:3000 | xargs kill
# Or on Windows:
# netstat -ano | findstr :3000
# taskkill /PID <PID> /F
```

✅ **Use different port**
```bash
PORT=3001 npm run dev
```

### 10. Build fails

**Symptoms:**
- `npm run build` fails
- Errors during production build

**Solutions:**

✅ **Check for TypeScript/ESLint errors**
```bash
npm run lint
```

✅ **Ensure .env exists**
- Build needs environment variables
- Create `.env` with your credentials

✅ **Clear build cache**
```bash
rm -rf dist
npm run build
```

## 🆘 Still Stuck?

### 1. Run diagnostics
```bash
npm run verify
```

### 2. Check logs
- Browser console (F12 → Console)
- Terminal output
- Supabase Dashboard → Logs

### 3. Review configuration
```bash
# Check env file exists
ls -la .env

# Check Node version
node --version

# Check npm version
npm --version

# Check dependencies
npm list --depth=0
```

### 4. Fresh start
```bash
# 1. Backup your work
# 2. Remove local config
rm .env

# 3. Reinstall
rm -rf node_modules package-lock.json
npm install

# 4. Run setup again
npm run setup
```

## 📋 Checklist for Working Setup

- [ ] Node.js 20.x or later installed
- [ ] Supabase project created
- [ ] `.env` file exists with correct credentials
- [ ] `node_modules/` directory exists
- [ ] Database schema run in Supabase
- [ ] All tables visible in Table Editor
- [ ] Admin user created in Authentication
- [ ] Admin user confirmed (green checkmark)
- [ ] Admin user has role='admin' in users table
- [ ] `npm run verify` passes all checks
- [ ] Can access http://localhost:3000
- [ ] Can log in with admin credentials

## 🎯 Prevention Tips

1. **Always run setup script first**
   ```bash
   npm run setup
   ```

2. **Verify after any changes**
   ```bash
   npm run verify
   ```

3. **Keep credentials secure**
   - Never commit `.env`
   - Use strong passwords
   - Enable 2FA on Supabase

4. **Regular backups**
   - Backup your Supabase database regularly
   - Export important data

5. **Test in development first**
   - Test changes locally
   - Verify everything works
   - Then deploy to production

---

**Need more help?**

Check the detailed guides:
- [SETUP.md](SETUP.md) - Setup guide
- [QUICK_REFERENCE.md](QUICK_REFERENCE.md) - Quick commands
- [supabase/SETUP_GUIDE.md](supabase/SETUP_GUIDE.md) - Technical details
