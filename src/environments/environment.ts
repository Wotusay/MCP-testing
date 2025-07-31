// Environment configuration for development
// For local development with Supabase, create src/environments/environment.local.ts
// For production, use environment variables from GitHub secrets

interface LocalEnvironment {
  supabase: {
    url: string;
    key: string;
  };
}

let localEnv: LocalEnvironment | null = null;
try {
  // Try to import local environment file if it exists (for local development)
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  localEnv = require('./environment.local').environment;
} catch {
  // Local environment file doesn't exist (e.g., in CI/testing), use fallback values
  localEnv = null;
}

export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
  appName: 'Angular Team Project',
  version: '1.0.0',
  supabase: {
    // Use local environment if available, otherwise use placeholder values for testing
    url: localEnv?.supabase?.url || 'https://placeholder.supabase.co',
    key: localEnv?.supabase?.key || 'placeholder-anon-key',
  },
};
