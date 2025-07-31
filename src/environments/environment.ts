// For demo purposes, importing local environment with actual credentials
// In production, use environment variables from GitHub secrets
import { environment as localEnv } from './environment.local';

export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
  appName: 'Angular Team Project',
  version: '1.0.0',
  supabase: {
    // Using local environment for demo, in production use:
    // url: process.env['SUPABASE_URL'] || 'YOUR_SUPABASE_URL_HERE',
    // key: process.env['SUPABASE_ANON_KEY'] || 'YOUR_SUPABASE_ANON_KEY_HERE'
    url: localEnv.supabase.url,
    key: localEnv.supabase.key
  }
};
