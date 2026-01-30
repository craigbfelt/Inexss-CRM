# Vercel Deployment Configuration

## ⚠️ IMPORTANT: Root Directory Setting

This Next.js application is located in the `client/` subdirectory, **NOT** at the repository root.

### Required Vercel Dashboard Settings

When deploying to Vercel, you **MUST** configure these settings:

1. **Framework Preset:** `Next.js`
2. **Root Directory:** `client` ← **CRITICAL: Must be set to "client"**

### How to Set Root Directory

#### Option A: During Import (New Project)
1. Import repository from GitHub
2. In the import dialog, expand **"Build and Output Settings"**
3. Set **Root Directory** to: `client`
4. Click **Deploy**

#### Option B: Existing Project
1. Go to Project **Settings** → **General**
2. Scroll to **Root Directory**
3. Click **Edit** 
4. Enter: `client`
5. Click **Save**
6. Go to **Deployments** and redeploy

## Why This Matters

This repository has a monorepo structure:

```
Inexss-CRM/
├── package.json          # Backend (Express server) - NO Next.js here
├── server/              # Backend code
└── client/              # ← Next.js frontend IS HERE
    ├── package.json     # ✓ Contains Next.js 16.1.6
    ├── vercel.json      # ✓ Next.js configuration
    ├── next.config.js   # ✓ Next.js config
    └── app/             # ✓ Next.js App Router
```

**Without setting Root Directory to `client`:**
- ❌ Vercel looks at root `package.json` (no Next.js)
- ❌ Error: "No Next.js version detected"
- ❌ Build fails

**With Root Directory set to `client`:**
- ✅ Vercel looks at `client/package.json` (has Next.js 16.1.6)
- ✅ Automatically detects Next.js configuration
- ✅ Build succeeds

## Vercel Configuration Files

### `/client/vercel.json` (Active when Root Directory = "client")
```json
{
  "framework": "nextjs",
  "build": {
    "env": {
      "NODE_VERSION": "20.x"
    }
  }
}
```

This is the **ONLY** vercel.json that matters when Root Directory is set correctly.

### No Root-Level vercel.json Needed
There is intentionally **NO** `vercel.json` at the repository root because:
- It would be ignored when Root Directory is set
- It could cause confusion
- All Next.js configuration belongs in the `client/` directory

## Environment Variables

After setting the Root Directory, add these environment variables in Vercel:

- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anon/public key

## Verification Steps

After deploying:

1. ✅ Build should succeed without "No Next.js version detected" error
2. ✅ Build logs should show: "Detected Next.js version: 16.1.6"
3. ✅ Output directory should be: `.next`
4. ✅ Site should be accessible at your Vercel URL

## Troubleshooting

### Still seeing "No Next.js version detected"?

Check these:
1. **Root Directory is set to `client`** (NOT `./` or blank)
2. In Vercel dashboard: Settings → General → Root Directory = `client`
3. Redeploy after changing Root Directory setting
4. Check build logs to confirm Vercel is looking in `client/` directory

### Build succeeds but site doesn't work?

Check these:
1. Environment variables are set correctly
2. `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are present
3. Supabase redirect URLs include your Vercel domain

## Additional Documentation

- **Complete Setup Guide:** [VERCEL_SETUP.md](./VERCEL_SETUP.md)
- **Dashboard Configuration:** [VERCEL_CONFIG.md](./VERCEL_CONFIG.md)
- **Root Directory Details:** [VERCEL_ROOT_DIRECTORY.md](./VERCEL_ROOT_DIRECTORY.md)
- **Deployment Guide:** [DEPLOYMENT.md](./DEPLOYMENT.md)

---

**Quick Reference:**
- Framework: `Next.js`
- Root Directory: `client`
- Node Version: `20.x`
- Build Command: `npm run build` (auto-detected)
- Output Directory: `.next` (auto-detected)
