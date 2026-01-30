#!/bin/bash

# Vercel Deployment Pre-Check Script
# This script verifies that the Next.js app is properly configured for Vercel deployment

echo "🔍 Vercel Deployment Pre-Check"
echo "================================"
echo ""

# Check if we're in the right directory
if [ ! -f "README.md" ] || [ ! -d "client" ]; then
    echo "❌ Error: Please run this script from the repository root directory"
    exit 1
fi

echo "✅ Running from repository root"
echo ""

# Check client directory structure
echo "📁 Checking client directory structure..."
if [ ! -d "client" ]; then
    echo "❌ Error: client/ directory not found"
    exit 1
fi
echo "✅ client/ directory exists"

# Check for package.json
if [ ! -f "client/package.json" ]; then
    echo "❌ Error: client/package.json not found"
    exit 1
fi
echo "✅ client/package.json exists"

# Check for Next.js in package.json
if grep -q '"next"' client/package.json; then
    NEXT_VERSION=$(grep '"next"' client/package.json | sed 's/.*"next": "\([^"]*\)".*/\1/')
    echo "✅ Next.js found in dependencies: $NEXT_VERSION"
else
    echo "❌ Error: Next.js not found in client/package.json dependencies"
    exit 1
fi

# Check for next.config.js
if [ ! -f "client/next.config.js" ]; then
    echo "⚠️  Warning: client/next.config.js not found"
else
    echo "✅ client/next.config.js exists"
fi

# Check for vercel.json in client
if [ ! -f "client/vercel.json" ]; then
    echo "⚠️  Warning: client/vercel.json not found (optional but recommended)"
else
    echo "✅ client/vercel.json exists"
fi

# Check if root vercel.json exists (should NOT exist)
if [ -f "vercel.json" ]; then
    echo "⚠️  Warning: Root vercel.json exists (may cause confusion - should be removed)"
else
    echo "✅ No root vercel.json (correct - configuration is in client/)"
fi

# Check for .env.example
if [ ! -f "client/.env.example" ]; then
    echo "ℹ️  Info: client/.env.example not found (not critical)"
else
    echo "✅ client/.env.example exists"
fi

echo ""
echo "================================"
echo "📋 Summary"
echo "================================"
echo ""
echo "Your Next.js app appears to be properly configured for Vercel!"
echo ""
echo "🎯 CRITICAL REMINDER: When deploying to Vercel:"
echo ""
echo "   1. Framework Preset: Next.js"
echo "   2. Root Directory: client  ← MUST BE SET TO 'client'"
echo "   3. Add environment variables:"
echo "      - NEXT_PUBLIC_SUPABASE_URL"
echo "      - NEXT_PUBLIC_SUPABASE_ANON_KEY"
echo ""
echo "📖 For detailed instructions, see:"
echo "   - ./VERCEL.md"
echo "   - ./client/DEPLOY_TO_VERCEL.md"
echo "   - ./VERCEL_SETUP.md"
echo ""
echo "✅ Pre-check complete!"
