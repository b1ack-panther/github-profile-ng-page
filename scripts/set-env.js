// scripts/set-env.js
// This script reads environment variables and injects them into Angular environment files
const fs = require('fs');
const path = require('path');

// Read the environment variable (Vercel uses process.env)
// Try multiple possible variable names
const githubToken = process.env.NG_APP_GITHUB_TOKEN || '';

if (!githubToken) {
  console.warn('⚠️  Warning: GITHUB_TOKEN environment variable not found. Using empty string.');
  console.warn('   Make sure you have set GITHUB_TOKEN in Vercel environment variables.');
}

// Read the production environment file
const envPath = path.join(__dirname, '../src/environments/environment.prod.ts');

// Create the environment file content
const envContent = `export const environment = {
  production: true,
  githubToken: '${githubToken}',
};
`;

// Write the file
fs.writeFileSync(envPath, envContent, 'utf8');

if (githubToken) {
  console.log('✅ Environment file updated with GitHub token');
} else {
  console.log('✅ Environment file updated (token is empty - set GITHUB_TOKEN in Vercel)');
}
