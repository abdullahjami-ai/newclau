import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Get backend root directory (two levels up from src/config/)
const backendRoot = join(__dirname, '..', '..');

// Try multiple .env loading strategies
const envPath = join(backendRoot, '.env');

// Strategy 1: Try with explicit path
const result1 = dotenv.config({ path: envPath });

// Strategy 2: Try from current directory
if (result1.error) {
  dotenv.config();
}

// Strategy 3: Try from backend root
if (!process.env.NODE_ENV) {
  dotenv.config({ path: join(backendRoot, '.env') });
}

// Verify .env file exists
const envExists = existsSync(envPath);

// Set defaults for ALL environment variables
const config = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  MAX_FILE_SIZE: process.env.MAX_FILE_SIZE || 10485760,
  ALLOWED_FILE_TYPES: process.env.ALLOWED_FILE_TYPES || 'image/jpeg,image/png,image/jpg,image/webp',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000'
};

// Export config
export default config;

// Debug info
export const debugEnv = () => {
  console.log('\n📋 Environment Configuration Debug:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`📁 .env file exists: ${envExists ? '✅ YES' : '❌ NO'}`);
  console.log(`📂 .env file path: ${envPath}`);
  console.log(`📦 Current directory: ${process.cwd()}`);
  console.log(`🔧 Config values:`);
  console.log(`   PORT: ${config.PORT}`);
  console.log(`   NODE_ENV: ${config.NODE_ENV}`);
  console.log(`   MAX_FILE_SIZE: ${config.MAX_FILE_SIZE}`);
  console.log(`   ALLOWED_FILE_TYPES: ${config.ALLOWED_FILE_TYPES}`);
  console.log(`   FRONTEND_URL: ${config.FRONTEND_URL}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
};
