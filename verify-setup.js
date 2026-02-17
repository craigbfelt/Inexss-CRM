#!/usr/bin/env node

/* eslint-env node */

/**
 * Setup Verification Script for Inexss CRM
 * 
 * Verifies that the CRM is properly configured and ready to use.
 */

import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';
import chalk from 'chalk';
import ora from 'ora';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const success = (msg) => console.log(chalk.green('✓ ' + msg));
const error = (msg) => console.log(chalk.red('✗ ' + msg));
const warn = (msg) => console.log(chalk.yellow('⚠ ' + msg));
const info = (msg) => console.log(chalk.blue('ℹ ' + msg));

let hasErrors = false;
let hasWarnings = false;

async function verify() {
  console.log(chalk.bold.cyan('\n🔍 Verifying Inexss CRM Setup\n'));
  
  // Check 1: Environment file
  console.log(chalk.bold('1. Environment Configuration'));
  
  const envPath = join(__dirname, '.env');
  if (!existsSync(envPath)) {
    error('.env file not found');
    info('Run: npm run setup');
    hasErrors = true;
    return;
  }
  
  success('.env file exists');
  
  const envContent = readFileSync(envPath, 'utf8');
  const urlMatch = envContent.match(/VITE_SUPABASE_URL=(.+)/);
  const keyMatch = envContent.match(/VITE_SUPABASE_ANON_KEY=(.+)/);
  
  if (!urlMatch || urlMatch[1].includes('your-project-id')) {
    error('VITE_SUPABASE_URL not configured');
    hasErrors = true;
    return;
  }
  
  if (!keyMatch || keyMatch[1].includes('your-anon-key')) {
    error('VITE_SUPABASE_ANON_KEY not configured');
    hasErrors = true;
    return;
  }
  
  const supabaseUrl = urlMatch[1].trim();
  const supabaseKey = keyMatch[1].trim();
  
  success('Environment variables configured');
  
  // Check 2: Supabase connection
  console.log(chalk.bold('\n2. Supabase Connection'));
  
  const spinner = ora('Testing connection...').start();
  
  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Test connection
    const { error: connError } = await supabase.from('users').select('count', { count: 'exact', head: true });
    
    if (connError && !connError.message.includes('does not exist')) {
      throw connError;
    }
    
    spinner.succeed('Connected to Supabase');
    
    // Check 3: Database tables
    console.log(chalk.bold('\n3. Database Tables'));
    
    const requiredTables = ['users', 'brands', 'clients', 'projects', 'meetings', 'action_items'];
    let tablesExist = true;
    
    for (const table of requiredTables) {
      const { error: tableError } = await supabase.from(table).select('count', { count: 'exact', head: true });
      
      if (tableError && tableError.message.includes('does not exist')) {
        error(`Table '${table}' does not exist`);
        tablesExist = false;
        hasErrors = true;
      } else {
        success(`Table '${table}' exists`);
      }
    }
    
    if (!tablesExist) {
      info('Run the schema.sql in Supabase SQL Editor');
      return;
    }
    
    // Check 4: Admin user
    console.log(chalk.bold('\n4. Admin User'));
    
    const { data: adminUser, error: adminError } = await supabase
      .from('users')
      .select('*')
      .eq('email', 'craig@zerobitone.co.za')
      .maybeSingle();
    
    if (adminError) {
      error('Error checking admin user: ' + adminError.message);
      hasErrors = true;
    } else if (!adminUser) {
      warn('Admin user not found');
      info('Create user craig@zerobitone.co.za in Supabase Dashboard');
      info('Then run: supabase/setup_admin_user.sql');
      hasWarnings = true;
    } else {
      success('Admin user exists');
      info(`  Name: ${adminUser.name}`);
      info(`  Email: ${adminUser.email}`);
      info(`  Role: ${adminUser.role}`);
      
      if (adminUser.role !== 'admin') {
        warn('User role is not set to admin');
        info('Run: supabase/setup_admin_user.sql');
        hasWarnings = true;
      } else {
        success('Admin role configured correctly');
      }
    }
    
    // Check 5: Authentication status
    console.log(chalk.bold('\n5. Authentication Check'));
    
    const { data: authData, error: authError } = await supabase.auth.getSession();
    
    if (authError) {
      warn('Not currently authenticated (this is normal)');
    } else if (authData.session) {
      success('Currently authenticated as: ' + authData.session.user.email);
    } else {
      info('Not currently logged in');
    }
    
    // Summary
    console.log(chalk.bold('\n' + '='.repeat(60)));
    
    if (!hasErrors && !hasWarnings) {
      console.log(chalk.bold.green('\n✅ All checks passed! System is ready.\n'));
      console.log(chalk.cyan('You can now run:'));
      console.log(chalk.white('  npm run dev\n'));
    } else if (hasErrors) {
      console.log(chalk.bold.red('\n❌ Setup has errors that need to be fixed.\n'));
      console.log(chalk.yellow('Please address the errors above and run:'));
      console.log(chalk.white('  npm run verify\n'));
      process.exit(1);
    } else {
      console.log(chalk.bold.yellow('\n⚠️  Setup has warnings but should work.\n'));
      console.log(chalk.cyan('You can run:'));
      console.log(chalk.white('  npm run dev\n'));
      console.log(chalk.gray('Or fix warnings and verify again with:'));
      console.log(chalk.white('  npm run verify\n'));
    }
    
  } catch (err) {
    spinner.fail('Connection failed');
    error(err.message);
    hasErrors = true;
    process.exit(1);
  }
}

verify().catch(err => {
  console.error(chalk.red('\nVerification error:'), err);
  process.exit(1);
});
