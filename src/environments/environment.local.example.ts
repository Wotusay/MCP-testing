// Example local environment file for development
// Copy this file to environment.local.ts and add your actual Supabase credentials
// This file is ignored by git for security

export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
  appName: 'Angular Team Project',
  version: '1.0.0',
  supabase: {
    url: 'YOUR_SUPABASE_URL_HERE',
    key: 'YOUR_SUPABASE_ANON_KEY_HERE',
  },
};
