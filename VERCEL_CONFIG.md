# Vercel Dashboard Configuration

This document describes exactly what settings need to be configured in your Vercel dashboard after importing the repository.

## Import Settings

When importing the repository to Vercel, use these settings:

### Framework Preset
```
Next.js
```
**IMPORTANT:** Select "Next.js" as the framework preset.

### Root Directory
```
client
```
**CRITICAL:** Set Root Directory to `client` (NOT `./`). This is required for Vercel to detect the Next.js version in the subdirectory and properly build the application.

### Build & Development Settings

These settings are automatically detected when Root Directory is set to `client`:

**Build Command:**
```bash
npm run build
```
(Automatically detected from client/package.json)

**Output Directory:**
```
.next
```
(Automatically detected for Next.js)

**Install Command:**
```bash
npm install
```
(Automatically detected)

**Development Command:** (optional)
```bash
npm run dev
```

## Environment Variables

Add these in: **Settings** → **Environment Variables**

### Variable 1: Supabase URL

- **Key:** `NEXT_PUBLIC_SUPABASE_URL`
- **Value:** Your Supabase Project URL
  - Example: `https://abcdefghijk.supabase.co`
  - Find it: Supabase Dashboard → Settings → API → Project URL
- **Environments:** 
  - ✅ Production
  - ✅ Preview
  - ✅ Development

### Variable 2: Supabase Anon Key

- **Key:** `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Value:** Your Supabase anon/public API key
  - Example: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (long string)
  - Find it: Supabase Dashboard → Settings → API → Project API keys → `anon` `public`
  - ⚠️ **Use "anon public" NOT "service_role"**
- **Environments:**
  - ✅ Production
  - ✅ Preview
  - ✅ Development

> **Note**: This Next.js app uses `NEXT_PUBLIC_*` prefixed environment variables, which are automatically exposed to the browser.

## Git Integration

### Automatic Deployments

By default, Vercel will auto-deploy when you push to:
- **main/master branch** → Production deployment
- **Other branches** → Preview deployment
- **Pull requests** → Preview deployment

### Manual Deployment

To manually trigger a deployment:
1. Go to **Deployments** tab
2. Click the **"..."** menu on any deployment
3. Select **"Redeploy"**

## Domain Settings

### Default Vercel Domain

After deployment, your app will be available at:
```
https://your-project-name.vercel.app
```

### Custom Domain (Optional)

To add your own domain:
1. Go to **Settings** → **Domains**
2. Click **"Add"**
3. Enter your domain (e.g., `crm.inexss.co.za`)
4. Follow DNS configuration instructions
5. Update Supabase redirect URLs to include your custom domain

## Redirects & Rewrites

The `vercel.json` configures:
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

This ensures all routes (like `/dashboard`, `/clients`, etc.) are handled by React Router and don't result in 404 errors.

## Build Settings Verification

After importing, verify these settings:

### In Vercel Dashboard

1. Go to **Settings** → **General**
2. Check:
   - **Framework Preset:** Next.js
   - **Root Directory:** client (CRITICAL - must be set to "client")
   - **Node.js Version:** 20.x (required for Supabase packages)

3. Go to **Settings** → **Environment Variables**
4. Verify both `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are present

### Test Build

1. Go to **Deployments**
2. Check latest deployment status
3. Click on the deployment
4. Review build logs for errors

## Common Configuration Issues

### Issue: "Missing environment variables"

**Solution:**
- Ensure both `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set
- Check they're enabled for the correct environment (Production, Preview, or Development)
- The app automatically maps these to `REACT_APP_*` for Create React App compatibility
- After adding variables, redeploy the project

### Issue: "Build failed"

**Solution:**
- Check build logs for specific errors
- Verify `client/package.json` exists and has required dependencies
- Ensure build command is: `cd client && npm install && npm run build`
- Try building locally first: same command should work

### Issue: "404 Not Found" on navigation

**Solution:**
- Verify `vercel.json` exists in repository root
- Check rewrites configuration in `vercel.json`
- Ensure output directory is set to `client/build`
- Clear Vercel cache: Settings → Clear Build Cache, then redeploy

### Issue: "Deployment succeeded but site shows old version"

**Solution:**
- Hard refresh browser: Ctrl+Shift+R (Windows/Linux) or Cmd+Shift+R (Mac)
- Clear browser cache
- Check deployment URL is the latest one
- Vercel may take 1-2 minutes to propagate changes globally

## Security Notes

### Environment Variables
- Never commit `.env` files with real credentials
- Use only the Supabase **anon public** key in frontend (not service_role)
- Rotate keys if accidentally exposed

### HTTPS
- Vercel enforces HTTPS automatically ✅
- All `*.vercel.app` domains have SSL certificates
- Custom domains get free SSL via Let's Encrypt

### Access Control
- Configure Vercel project access in Settings → Team
- Use deployment protection for preview deployments
- Enable Vercel Authentication if needed

## Performance Optimization

### Recommended Settings

1. **Enable Automatic Static Optimization**
   - Already configured via Create React App
   - Static assets cached with long TTL

2. **Enable Compression**
   - Vercel automatically compresses responses
   - Brotli compression enabled by default

3. **Analytics** (Optional)
   - Settings → Analytics → Enable Vercel Analytics
   - Track page views and performance metrics

## Monitoring

### Available in Vercel Dashboard

1. **Deployments**
   - View deployment history
   - Check build status and logs
   - Inspect bundle size

2. **Analytics** (if enabled)
   - Real-time visitor data
   - Page view metrics
   - Performance insights

3. **Logs** (Realtime)
   - Runtime logs
   - Error tracking
   - Request logs

## Support Resources

- **Vercel Docs:** [vercel.com/docs](https://vercel.com/docs)
- **Deployment Issues:** Check build logs first
- **Configuration Issues:** Verify `vercel.json` syntax
- **Environment Issues:** Ensure variables are set for correct environment

## Summary Checklist

After importing to Vercel, verify:

- [ ] Repository successfully imported
- [ ] Build command is correct
- [ ] Output directory is `client/build`
- [ ] Both environment variables are set
- [ ] First deployment succeeded
- [ ] Site is accessible at Vercel URL
- [ ] No 404 errors when navigating
- [ ] Login works with Supabase
- [ ] Supabase redirect URLs updated with Vercel domain

---

**Need detailed instructions?** See [VERCEL_SETUP.md](./VERCEL_SETUP.md)
