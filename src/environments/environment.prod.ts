export const environment = {
  production: true,
  apiUrl: 'https://api.productiondomain.com/api',
  appName: 'Angular Team Project',
  version: '1.0.0',
  supabase: {
    // In production, these come from GitHub environment variables
    url: process.env['SUPABASE_URL'] || 'YOUR_SUPABASE_URL_HERE',
    key: process.env['SUPABASE_ANON_KEY'] || 'YOUR_SUPABASE_ANON_KEY_HERE'
  }
};
