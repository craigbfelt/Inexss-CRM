#!/usr/bin/env node

/**
 * Environment Variable Setup Script
 * 
 * This script allows the use of NEXT_PUBLIC_* prefixed environment variables
 * (Vercel/Next.js convention) while maintaining compatibility with Create React App
 * which requires REACT_APP_* prefixes.
 * 
 * The script maps NEXT_PUBLIC_* variables to REACT_APP_* variables during the build process.
 */

const fs = require('fs');
const path = require('path');

// Load .env file if it exists (for local development)
const envPath = path.join(__dirname, '..', '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  envContent.split('\n').forEach(line => {
    line = line.trim();
    if (line && !line.startsWith('#')) {
      const [key, ...valueParts] = line.split('=');
      const value = valueParts.join('=');
      if (key && value && !process.env[key]) {
        process.env[key] = value;
      }
    }
  });
}

// Map NEXT_PUBLIC_* environment variables to REACT_APP_* equivalents
const envMappings = {
  'NEXT_PUBLIC_SUPABASE_URL': 'REACT_APP_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY': 'REACT_APP_SUPABASE_ANON_KEY',
  'NEXT_PUBLIC_API_URL': 'REACT_APP_API_URL'
};

let mappedCount = 0;

Object.entries(envMappings).forEach(([nextPublicVar, reactAppVar]) => {
  // If NEXT_PUBLIC_* var exists and REACT_APP_* var doesn't, map it
  if (process.env[nextPublicVar] && !process.env[reactAppVar]) {
    process.env[reactAppVar] = process.env[nextPublicVar];
    console.log(`✓ Mapped ${nextPublicVar} → ${reactAppVar}`);
    mappedCount++;
  }
});

if (mappedCount > 0) {
  console.log(`\n✓ Successfully mapped ${mappedCount} environment variable(s)\n`);
} else {
  console.log('ℹ No NEXT_PUBLIC_* variables found to map (using REACT_APP_* directly)\n');
}

// If called directly (not required as a module), run the build command
if (require.main === module) {
  const { spawn } = require('child_process');
  const buildCommand = process.argv[2] || 'react-scripts build';
  const [cmd, ...args] = buildCommand.split(' ');
  
  const child = spawn(cmd, args, {
    stdio: 'inherit',
    shell: true,
    env: process.env
  });
  
  child.on('exit', (code) => {
    process.exit(code || 0);
  });
}

