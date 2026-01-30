# Deploy This Next.js App to Vercel

## Quick Deployment Checklist

### ✅ Prerequisites
- [ ] GitHub repository is ready
- [ ] Supabase project is created and configured
- [ ] You have a Vercel account

### 🎯 Critical Vercel Settings

When deploying this Next.js application, you **MUST** configure:

#### 1. Root Directory (MOST IMPORTANT)
```
client
```
⚠️ **This is CRITICAL** - Without this, Vercel won't find Next.js

#### 2. Framework Preset
```
Next.js
```

#### 3. Environment Variables
Add these in Vercel dashboard:
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anon/public key

### 🚀 Deployment Steps

#### Option A: Import from GitHub (New Project)
1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. **IMPORTANT:** In "Configure Project" section:
   - Framework Preset: Select **Next.js**
   - Root Directory: Click **Edit** → Enter **`client`**
4. Add environment variables (see above)
5. Click **Deploy**

#### Option B: Update Existing Project
1. Go to your Vercel project settings
2. Navigate to **Settings** → **General**
3. Find **Root Directory** section
4. Click **Edit**
5. Enter: `client`
6. Click **Save**
7. Go to **Deployments** tab
8. Click **Redeploy** on the latest deployment

### ✅ Verify Deployment

After deploying, check:
- [ ] Build logs show: "Detected Next.js version: 16.1.6"
- [ ] No error: "No Next.js version detected"
- [ ] Build output directory: `.next`
- [ ] Site is accessible at Vercel URL
- [ ] Login page loads correctly

### 🔧 Troubleshooting

#### Error: "No Next.js version detected"
**Solution:** Root Directory is NOT set to `client`. Go to Settings → General → Root Directory → Edit → Enter `client` → Save → Redeploy

#### Build succeeds but site shows errors
**Solution:** Check environment variables are set correctly in Vercel dashboard

#### Login doesn't work
**Solution:** Update Supabase redirect URLs to include your Vercel domain

### 📚 Additional Resources

- **Parent Directory:** [../VERCEL.md](../VERCEL.md) - Detailed configuration guide
- **Complete Setup:** [../VERCEL_SETUP.md](../VERCEL_SETUP.md) - Step-by-step instructions
- **Supabase Configuration:** [../AUTHENTICATION_SETUP.md](../AUTHENTICATION_SETUP.md)

---

## Technical Details

This is a Next.js 16 application using:
- App Router architecture
- React 18 with Server Components
- Supabase for backend and authentication
- Designed for Vercel deployment

**Package.json location:** `/client/package.json` ← This is why Root Directory must be `client`
