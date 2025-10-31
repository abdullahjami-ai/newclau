#!/usr/bin/env node

/**
 * Environment Configuration Diagnostic Tool
 * Run this to check if your .env file is loading correctly
 */

import { debugEnv } from './src/config/env.js';
import { existsSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('\n🔍 Image Compressor - Environment Diagnostic Tool\n');

// Check if .env file exists
const envPath = join(__dirname, '.env');
const envExists = existsSync(envPath);

console.log('1️⃣  Checking .env file...');
if (envExists) {
  console.log('   ✅ .env file found at:', envPath);
  console.log('\n   📄 File contents:');
  console.log('   ' + '━'.repeat(50));
  const envContent = readFileSync(envPath, 'utf-8');
  envContent.split('\n').forEach((line, i) => {
    if (line.trim() && !line.startsWith('#')) {
      console.log(`   ${i + 1}. ${line}`);
    }
  });
  console.log('   ' + '━'.repeat(50));
} else {
  console.log('   ❌ .env file NOT found at:', envPath);
  console.log('   ⚠️  Using default values (this is OK, but not recommended)');
}

console.log('\n2️⃣  Checking environment configuration...');
debugEnv();

console.log('3️⃣  Recommendations:');
if (!envExists) {
  console.log('   ⚠️  Create a .env file from the example:');
  console.log('      Windows CMD:  copy .env.example .env');
  console.log('      PowerShell:   cp .env.example .env');
  console.log('      Linux/Mac:    cp .env.example .env');
} else {
  console.log('   ✅ Your .env file is set up correctly!');
}

console.log('\n✅ Diagnostic complete!\n');
