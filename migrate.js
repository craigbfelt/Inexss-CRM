#!/usr/bin/env node

/**
 * Database Migration Script for Inexss CRM
 * 
 * Automatically runs Supabase database migrations.
 * Note: This requires the Supabase service role key for admin operations.
 */

import { readFileSync, existsSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';
import prompts from 'prompts';
import chalk from 'chalk';
import ora from 'ora';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const success = (msg) => console.log(chalk.green('✓ ' + msg));
const error = (msg) => console.log(chalk.red('✗ ' + msg));
const info = (msg) => console.log(chalk.blue('ℹ ' + msg));
const warn = (msg) => console.log(chalk.yellow('⚠ ' + msg));

async function runMigrations() {
  console.log(chalk.bold.cyan('\n🔄 Database Migration Helper\n'));
  
  warn('This script helps you run migrations, but requires manual steps.');
  warn('Supabase requires SQL migrations to be run through the Dashboard or CLI.\n');
  
  console.log(chalk.bold('Available Migrations:\n'));
  
  const supabasePath = join(__dirname, 'supabase');
  
  if (!existsSync(supabasePath)) {
    error('supabase/ directory not found');
    process.exit(1);
  }
  
  const files = readdirSync(supabasePath).filter(f => f.endsWith('.sql'));
  const migrations = files.filter(f => 
    f === 'schema.sql' || 
    f.startsWith('migration_') ||
    f === 'setup_admin_user.sql'
  );
  
  // Order migrations
  const orderedMigrations = [
    'schema.sql',
    ...migrations.filter(f => f.startsWith('migration_')).sort(),
    'setup_admin_user.sql'
  ].filter(f => migrations.includes(f));
  
  orderedMigrations.forEach((file, index) => {
    const filePath = join(supabasePath, file);
    const content = readFileSync(filePath, 'utf8');
    const lines = content.split('\n').length;
    
    console.log(chalk.white(`${index + 1}. ${file}`));
    console.log(chalk.gray(`   Location: supabase/${file}`));
    console.log(chalk.gray(`   Size: ${lines} lines\n`));
  });
  
  console.log(chalk.bold.cyan('How to Run These Migrations:\n'));
  
  console.log(chalk.white('Option 1: Supabase Dashboard (Recommended)'));
  console.log(chalk.gray('  1. Open https://app.supabase.com'));
  console.log(chalk.gray('  2. Select your project'));
  console.log(chalk.gray('  3. Go to SQL Editor'));
  console.log(chalk.gray('  4. Click "New Query"'));
  console.log(chalk.gray('  5. Copy content from migration file'));
  console.log(chalk.gray('  6. Click "Run"\n'));
  
  console.log(chalk.white('Option 2: Supabase CLI (Advanced)'));
  console.log(chalk.gray('  1. Install: npm install -g supabase'));
  console.log(chalk.gray('  2. Login: supabase login'));
  console.log(chalk.gray('  3. Link: supabase link --project-ref your-project-ref'));
  console.log(chalk.gray('  4. Run: supabase db push\n'));
  
  const { showFile } = await prompts({
    type: 'select',
    name: 'showFile',
    message: 'Would you like to view a migration file?',
    choices: [
      { title: 'No, I\'ll run them manually', value: null },
      ...orderedMigrations.map(f => ({ title: f, value: f }))
    ]
  });
  
  if (showFile) {
    const filePath = join(supabasePath, showFile);
    const content = readFileSync(filePath, 'utf8');
    
    console.log(chalk.bold.cyan(`\n📄 Contents of ${showFile}:\n`));
    console.log(chalk.gray('─'.repeat(60)));
    console.log(content);
    console.log(chalk.gray('─'.repeat(60)));
    
    info('\nCopy the SQL above and run it in Supabase SQL Editor');
  }
  
  console.log(chalk.bold.green('\n✅ Migration Guide Complete\n'));
  console.log(chalk.cyan('After running migrations, verify with:'));
  console.log(chalk.white('  npm run verify\n'));
}

runMigrations().catch(err => {
  console.error(chalk.red('\nError:'), err);
  process.exit(1);
});
