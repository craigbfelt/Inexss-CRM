# Vercel Root Directory Configuration

## The Issue: "No Next.js version detected"

If you see this error when deploying to Vercel:
```
No Next.js version detected. Make sure your package.json has "next" in either "dependencies" or "devDependencies". 
Also check your Root Directory setting matches the directory of your package.json file.
```

This happens because the Next.js app is in the `client` subdirectory, not at the repository root.

## The Solution

### In Vercel Dashboard

When importing or configuring your project:

1. **Framework Preset:** Select **Next.js** (not "Other")
2. **Root Directory:** Set to **`client`** (not `./` or leave blank)
   - This tells Vercel where to find the Next.js app's package.json
   - Vercel will then properly detect Next.js version and build configuration

### Why This Matters

This repository has a monorepo structure:
```
Inexss-CRM/
├── package.json          # Backend (Express server)
├── server/              # Backend code
└── client/              # Next.js frontend
    ├── package.json     # Contains Next.js dependency
    ├── next.config.js
    ├── app/
    └── .next/           # Build output
```

- The **root `package.json`** contains the Express backend dependencies (no Next.js)
- The **`client/package.json`** contains Next.js and React dependencies
- Vercel needs to look in `client/` to find Next.js

## Vercel.json Files

This repo has two `vercel.json` files:

1. **Root `/vercel.json`**
   - Provides fallback configuration
   - Contains comments directing to set Root Directory to `client`

2. **`/client/vercel.json`**
   - Specific Next.js configuration for the client app
   - Sets Node.js version to 20.x (required for Supabase)

When Root Directory is set to `client`, Vercel uses `/client/vercel.json`.

## Step-by-Step Fix

If you're seeing the error:

### Option 1: Via Vercel Dashboard (Recommended)

1. Go to your project in Vercel
2. Click **Settings** → **General**
3. Find **"Root Directory"**
4. Change from `./` to `client`
5. Click **Save**
6. Go to **Deployments** and click **"Redeploy"**

### Option 2: When Importing New Project

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import the repository
3. In the import wizard:
   - **Framework Preset:** Next.js
   - **Root Directory:** `client`
   - Leave other settings as auto-detected
4. Add environment variables (see VERCEL_SETUP.md)
5. Click **Deploy**

## Verification

After setting Root Directory to `client`, verify:

1. In **Settings** → **General**, you should see:
   - Framework Preset: **Next.js**
   - Root Directory: **client**
   
2. Build logs should show:
   ```
   > Build Command: npm run build
   > Framework: Next.js
   > Detected Next.js version: 16.1.6
   ```

3. No more "No Next.js version detected" errors

## Additional Resources

- [VERCEL_SETUP.md](./VERCEL_SETUP.md) - Complete deployment guide
- [VERCEL_CONFIG.md](./VERCEL_CONFIG.md) - Detailed configuration reference
- [QUICK_DEPLOY.md](./QUICK_DEPLOY.md) - Quick deployment checklist
- [Vercel Monorepos Documentation](https://vercel.com/docs/monorepos)

## Common Questions

**Q: Can I keep Root Directory as `./` and configure it differently?**  
A: No. Vercel cannot detect Next.js in a subdirectory without setting Root Directory. You cannot configure the root directory in `vercel.json` - it must be set in the Vercel Dashboard.

**Q: Will this affect my backend server?**  
A: No. This is only for the Vercel frontend deployment. The backend (`server/`) is deployed separately if needed.

**Q: What about the root vercel.json file?**  
A: It's kept for reference and backwards compatibility, but when Root Directory is set to `client`, Vercel uses `/client/vercel.json` instead.

**Q: Do I need to change anything in my code?**  
A: No code changes needed. This is purely a deployment configuration change in Vercel Dashboard.
