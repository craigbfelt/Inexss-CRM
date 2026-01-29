# Authentication Setup Quick Reference

This guide provides a quick checklist for setting up authentication correctly with Vercel and Supabase.

## 🚨 Common Issues

### Issue 1: Can't log in to production app
**Cause:** Site URL or Redirect URLs not configured in Supabase  
**Fix:** See [Configure Supabase URLs](#configure-supabase-urls) below

### Issue 2: Password reset emails redirect to localhost
**Cause:** Email templates using hardcoded localhost URLs  
**Fix:** See [Configure Email Templates](#configure-email-templates) below

---

## Quick Setup Checklist

### 1. Configure Supabase URLs

**Location:** Supabase Dashboard → Authentication → URL Configuration

#### Site URL ⚠️ CRITICAL
```
https://your-app.vercel.app
```
- ❌ Do NOT use: `http://localhost:3000`
- ✅ Use your actual Vercel deployment URL
- This URL is used in all authentication emails and redirects

#### Redirect URLs
```
https://your-app.vercel.app/**
http://localhost:3000/**  (optional - for local development)
```
- The `**` wildcard is required
- Add both production and local URLs if you develop locally

### 2. Configure Email Templates

**Location:** Supabase Dashboard → Authentication → Email Templates

#### Templates to Update:
1. **Reset Password** (most important)
2. Confirm signup
3. Magic Link
4. Invite user

#### How to Update:
1. Open each template
2. Find any hardcoded URLs (e.g., `http://localhost:3000`)
3. Replace with: `{{ .SiteURL }}`

**Example Reset Password Template:**
```html
<h2>Reset Your Password</h2>
<p>Click the link below to reset your password:</p>
<a href="{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=recovery">
  Reset Password
</a>
```

**Key Points:**
- `{{ .SiteURL }}` automatically uses the Site URL you configured
- `{{ .TokenHash }}` is the secure token for this request
- `type=recovery` tells the app this is a password reset

### 3. Verify Environment Variables in Vercel

**Location:** Vercel Dashboard → Your Project → Settings → Environment Variables

Required variables:
```
REACT_APP_SUPABASE_URL = https://xxxxx.supabase.co
REACT_APP_SUPABASE_ANON_KEY = eyJhbGc...
```

**Important:**
- These must be set for all environments (Production, Preview, Development)
- After adding/changing variables, you MUST redeploy
- To redeploy: Deployments → Latest → Three dots → "Redeploy"

---

## Testing Your Configuration

### Test 1: Login
1. Go to your Vercel URL: `https://your-app.vercel.app`
2. Try logging in with your credentials
3. ✅ Should successfully log in and see the dashboard

### Test 2: Password Reset
1. Go to Supabase Dashboard → Authentication → Users
2. Click your user → "Send password recovery email"
3. Check your email inbox
4. Click the reset link in the email
5. ✅ Should redirect to `https://your-app.vercel.app/...` (NOT localhost)
6. ✅ Should be able to reset your password

---

## Troubleshooting

### Login fails with no error message
- Check browser console (F12) for errors
- Verify user exists in BOTH `auth.users` and `public.users` tables
- Ensure `is_active` is `true` in `public.users` table

### Login works locally but not on Vercel
- Verify environment variables are set in Vercel (see step 3 above)
- Redeploy after setting environment variables
- Check that Vercel build succeeded (check build logs)

### Password reset link goes to localhost
- Check Site URL in Supabase is set to your Vercel URL (not localhost)
- Check email templates use `{{ .SiteURL }}` (not hardcoded localhost)
- Clear browser cache and request a new reset email

### "Invalid redirect URL" error
- Ensure your Vercel URL is in the Redirect URLs list
- Make sure to include the `/**` wildcard pattern
- Format should be: `https://your-app.vercel.app/**`

---

## Configuration Checklist

Use this checklist to verify everything is configured correctly:

**Supabase - URL Configuration:**
- [ ] Site URL is set to Vercel production URL (e.g., `https://your-app.vercel.app`)
- [ ] Site URL does NOT contain `localhost`
- [ ] Redirect URLs includes `https://your-app.vercel.app/**`
- [ ] Redirect URLs optionally includes `http://localhost:3000/**` for local dev

**Supabase - Email Templates:**
- [ ] "Reset Password" template uses `{{ .SiteURL }}`
- [ ] "Confirm signup" template uses `{{ .SiteURL }}`
- [ ] "Magic Link" template uses `{{ .SiteURL }}` (if used)
- [ ] No email templates contain hardcoded localhost URLs

**Vercel - Environment Variables:**
- [ ] `REACT_APP_SUPABASE_URL` is set
- [ ] `REACT_APP_SUPABASE_ANON_KEY` is set
- [ ] Both variables are enabled for all environments
- [ ] Redeployed after setting variables

**Supabase - User Setup:**
- [ ] User exists in `auth.users` table
- [ ] User exists in `public.users` table with same UUID
- [ ] User's `is_active` is `true` in `public.users`

**Testing:**
- [ ] Can log in at production URL
- [ ] Password reset email redirects to production URL (not localhost)
- [ ] Can successfully reset password

---

## Quick Commands

### View current Supabase configuration
1. Go to: https://app.supabase.com
2. Select your project
3. Navigate to: Authentication → URL Configuration

### View email templates
1. Go to: https://app.supabase.com
2. Select your project
3. Navigate to: Authentication → Email Templates

### Redeploy Vercel after config changes
```bash
# Option 1: Via Vercel Dashboard
Vercel Dashboard → Your Project → Deployments → Latest → "Redeploy"

# Option 2: Via CLI (if installed)
vercel --prod
```

---

## Related Documentation

- [VERCEL_SETUP.md](./VERCEL_SETUP.md) - Complete deployment guide
- [SUPABASE_MIGRATION.md](./SUPABASE_MIGRATION.md) - Detailed Supabase setup
- [Supabase Auth Docs](https://supabase.com/docs/guides/auth) - Official Supabase documentation
- [Vercel Environment Variables](https://vercel.com/docs/environment-variables) - Official Vercel docs

---

**Need Help?**
If you're still experiencing issues after following this guide:
1. Double-check each item in the Configuration Checklist above
2. Review the troubleshooting section
3. Check the [VERCEL_SETUP.md](./VERCEL_SETUP.md) for more detailed instructions
4. Create a GitHub issue with:
   - Clear description of the issue
   - Screenshots of error messages
   - Which steps you've already tried
