#!/usr/bin/env node

/* eslint-env node */

/**
 * Supabase Configuration Checker
 * 
 * This script verifies that your local environment is properly configured
 * to run the Inexss CRM application.
 */

import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m',
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function checkHeader(title) {
  log(`\n${'='.repeat(60)}`, colors.cyan);
  log(title, colors.bold + colors.cyan);
  log('='.repeat(60), colors.cyan);
}

function checkPass(message) {
  log(`✓ ${message}`, colors.green);
}

function checkFail(message) {
  log(`✗ ${message}`, colors.red);
}

function checkWarn(message) {
  log(`⚠ ${message}`, colors.yellow);
}

function checkInfo(message) {
  log(`ℹ ${message}`, colors.blue);
}

// Track overall status
let hasErrors = false;
let hasWarnings = false;

// Check 1: .env file exists
checkHeader('1. Environment File Check');
const envPath = join(__dirname, '.env');
const envExamplePath = join(__dirname, '.env.example');

if (existsSync(envPath)) {
  checkPass('.env file exists');
  
  try {
    const envContent = readFileSync(envPath, 'utf8');
    
    // Check for required variables
    const hasUrl = envContent.includes('VITE_SUPABASE_URL=') && !envContent.includes('VITE_SUPABASE_URL=https://your-project-id');
    const hasKey = envContent.includes('VITE_SUPABASE_ANON_KEY=') && !envContent.includes('VITE_SUPABASE_ANON_KEY=your-anon-key');
    
    if (hasUrl) {
      checkPass('VITE_SUPABASE_URL is configured');
      
      // Extract and validate URL format
      const urlMatch = envContent.match(/VITE_SUPABASE_URL=(.+)/);
      if (urlMatch) {
        const url = urlMatch[1].trim();
        if (url.startsWith('https://') && url.includes('.supabase.co')) {
          checkPass(`Supabase URL format looks correct: ${url.substring(0, 30)}...`);
        } else {
          checkWarn('Supabase URL format may be incorrect (should be https://xxxxx.supabase.co)');
          hasWarnings = true;
        }
      }
    } else {
      checkFail('VITE_SUPABASE_URL is not configured or using placeholder value');
      checkInfo('Edit .env and add your Supabase Project URL');
      hasErrors = true;
    }
    
    if (hasKey) {
      checkPass('VITE_SUPABASE_ANON_KEY is configured');
      
      // Check if key looks like a JWT
      const keyMatch = envContent.match(/VITE_SUPABASE_ANON_KEY=(.+)/);
      if (keyMatch) {
        const key = keyMatch[1].trim();
        if (key.startsWith('eyJ')) {
          checkPass('Anon key format looks correct (JWT token)');
        } else {
          checkWarn('Anon key format may be incorrect (should start with "eyJ")');
          hasWarnings = true;
        }
      }
    } else {
      checkFail('VITE_SUPABASE_ANON_KEY is not configured or using placeholder value');
      checkInfo('Edit .env and add your Supabase anon public key');
      hasErrors = true;
    }
    
  } catch (error) {
    checkFail(`Error reading .env file: ${error.message}`);
    hasErrors = true;
  }
} else {
  checkFail('.env file does not exist');
  
  if (existsSync(envExamplePath)) {
    checkInfo('Found .env.example - copy it to .env:');
    checkInfo('  cp .env.example .env');
  } else {
    checkFail('.env.example file also missing!');
  }
  
  hasErrors = true;
}

// Check 2: Node modules
checkHeader('2. Dependencies Check');
const nodeModulesPath = join(__dirname, 'node_modules');

if (existsSync(nodeModulesPath)) {
  checkPass('node_modules directory exists');
  
  // Check for key dependencies
  const requiredDeps = [
    '@supabase/supabase-js',
    'react',
    'react-dom',
    'vite'
  ];
  
  let allDepsInstalled = true;
  requiredDeps.forEach(dep => {
    const depPath = join(nodeModulesPath, dep);
    if (existsSync(depPath)) {
      checkPass(`${dep} is installed`);
    } else {
      checkFail(`${dep} is NOT installed`);
      allDepsInstalled = false;
    }
  });
  
  if (!allDepsInstalled) {
    checkInfo('Run: npm install');
    hasErrors = true;
  }
} else {
  checkFail('node_modules directory does not exist');
  checkInfo('Run: npm install');
  hasErrors = true;
}

// Check 3: Required files
checkHeader('3. Required Files Check');
const requiredFiles = [
  'package.json',
  'vite.config.js',
  'src/App.jsx',
  'src/lib/supabaseClient.js',
  'src/contexts/AuthContext.jsx',
  'supabase/schema.sql',
  'supabase/SETUP_GUIDE.md'
];

requiredFiles.forEach(file => {
  const filePath = join(__dirname, file);
  if (existsSync(filePath)) {
    checkPass(file);
  } else {
    checkFail(`${file} is missing`);
    hasErrors = true;
  }
});

// Check 4: Supabase setup files
checkHeader('4. Supabase Setup Files Check');
const supabaseFiles = [
  'supabase/schema.sql',
  'supabase/setup_admin_user.sql',
  'supabase/verify_complete_setup.sql',
  'supabase/SETUP_GUIDE.md'
];

supabaseFiles.forEach(file => {
  const filePath = join(__dirname, file);
  if (existsSync(filePath)) {
    checkPass(file);
  } else {
    checkWarn(`${file} is missing (optional but recommended)`);
    hasWarnings = true;
  }
});

// Summary
checkHeader('Summary');

if (!hasErrors && !hasWarnings) {
  log('🎉 All checks passed! Your environment is ready.', colors.green + colors.bold);
  log('\nNext steps:', colors.cyan);
  log('  1. Ensure Supabase database schema is set up (see supabase/SETUP_GUIDE.md)');
  log('  2. Create admin user (see supabase/setup_admin_user.sql)');
  log('  3. Run: npm run dev');
  log('  4. Open: http://localhost:3000');
} else if (hasErrors) {
  log('❌ Configuration has errors that must be fixed.', colors.red + colors.bold);
  log('\nPlease fix the errors above, then run this script again.', colors.yellow);
  log('\nFor detailed setup instructions, see:', colors.cyan);
  log('  - QUICK_START.md (quick setup)');
  log('  - supabase/SETUP_GUIDE.md (complete guide)');
  process.exit(1);
} else if (hasWarnings) {
  log('⚠️  Configuration has warnings but should work.', colors.yellow + colors.bold);
  log('\nNext steps:', colors.cyan);
  log('  1. Review warnings above');
  log('  2. Ensure Supabase database schema is set up (see supabase/SETUP_GUIDE.md)');
  log('  3. Create admin user (see supabase/setup_admin_user.sql)');
  log('  4. Run: npm run dev');
}

log(''); // Empty line at end
