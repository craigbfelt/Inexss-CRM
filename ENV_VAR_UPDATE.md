# Environment Variable Update: NEXT_PUBLIC_* Support

## Overview

This update adds support for using `NEXT_PUBLIC_*` prefixed environment variables (Vercel/Next.js convention) while maintaining full backward compatibility with `REACT_APP_*` prefixed variables (Create React App convention).

## What Changed?

### For Vercel Deployments (Recommended)

When deploying to Vercel, you should now use:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

Instead of:

```env
REACT_APP_SUPABASE_URL=https://your-project.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-key-here
```

### For Local Development

Both formats work for local development! You can use either:

**Option 1 (Recommended - matches Vercel):**
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

**Option 2 (Backward compatible):**
```env
REACT_APP_SUPABASE_URL=https://your-project.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-key-here
```

## How It Works

The app includes a build-time script (`/client/scripts/env-setup.js`) that automatically:

1. Loads your `.env` file (for local development)
2. Looks for `NEXT_PUBLIC_*` prefixed environment variables
3. Maps them to `REACT_APP_*` equivalents that Create React App requires
4. Runs the build with the correctly mapped variables

This happens automatically during `npm run build` - you don't need to do anything special!

## Migration Guide

### If You're Already Deployed on Vercel

1. Go to your Vercel project → Settings → Environment Variables
2. Add new variables:
   - `NEXT_PUBLIC_SUPABASE_URL` (copy value from `REACT_APP_SUPABASE_URL`)
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` (copy value from `REACT_APP_SUPABASE_ANON_KEY`)
3. (Optional) Remove the old `REACT_APP_*` variables
4. Redeploy your project

### If You're Developing Locally

1. Open your `client/.env` file
2. Rename your variables:
   - `REACT_APP_SUPABASE_URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `REACT_APP_SUPABASE_ANON_KEY` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Restart your development server

**Note:** You can also keep using `REACT_APP_*` variables - both formats are supported!

## Why This Change?

1. **Consistency with Vercel/Next.js**: `NEXT_PUBLIC_*` is the standard convention for environment variables in Vercel and Next.js projects
2. **Future-proofing**: If you ever migrate to Next.js, your environment variables will already be using the correct format
3. **Better DevOps practices**: Using platform-specific conventions makes it easier for teams familiar with Vercel
4. **Copilot recommendation**: This was suggested by GitHub Copilot as a best practice for Vercel deployments

## Backward Compatibility

**Don't worry!** Your existing `REACT_APP_*` variables will continue to work. The app supports both formats simultaneously:

- If you set `NEXT_PUBLIC_*` variables, they'll be used
- If you set `REACT_APP_*` variables, they'll be used
- If you set both, `REACT_APP_*` takes precedence (to avoid overwriting)

## Technical Details

### Supported Variable Mappings

| NEXT_PUBLIC_* | → | REACT_APP_* |
|---------------|---|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | → | `REACT_APP_SUPABASE_URL` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | → | `REACT_APP_SUPABASE_ANON_KEY` |
| `NEXT_PUBLIC_API_URL` | → | `REACT_APP_API_URL` |

### .env File Format Support

The env-setup script supports various .env file formats:

```env
# Simple values
NEXT_PUBLIC_SUPABASE_URL=https://example.supabase.co

# Quoted values
NEXT_PUBLIC_SUPABASE_ANON_KEY="key-with-special-chars"

# Values with whitespace (trimmed automatically)
  NEXT_PUBLIC_API_URL  =  http://localhost:3000  

# Comments (ignored)
# This is a comment

# Export statements (ignored)
export IGNORED_VAR=value
```

## Files Modified

1. **`/client/scripts/env-setup.js`** - New build-time script that handles variable mapping
2. **`/client/package.json`** - Updated build scripts to use env-setup wrapper
3. **`/client/.env.example`** - Updated to recommend `NEXT_PUBLIC_*` variables
4. **Documentation files:**
   - `VERCEL_SETUP.md`
   - `README.md`
   - `AUTHENTICATION_SETUP.md`
   - `QUICK_DEPLOY.md`
   - `VERCEL_CONFIG.md`
5. **`/client/src/contexts/AuthContext.js`** - Updated error message

## Troubleshooting

### Build fails with "Missing environment variables"

**Solution:** Make sure you've set either `NEXT_PUBLIC_*` or `REACT_APP_*` prefixed variables in your `.env` file or Vercel environment variables.

### Environment variables not updating

**Solution:** After changing environment variables in Vercel, you must redeploy for changes to take effect.

### Mix of both variable formats

**Solution:** This is fine! If you have both `NEXT_PUBLIC_*` and `REACT_APP_*` variables set, the `REACT_APP_*` version will be used to avoid overwriting.

## Questions?

- See [VERCEL_SETUP.md](./VERCEL_SETUP.md) for detailed Vercel deployment instructions
- See [AUTHENTICATION_SETUP.md](./AUTHENTICATION_SETUP.md) for authentication configuration
- Open an issue if you encounter any problems

---

**Last Updated:** January 2026  
**Status:** Production Ready ✅
