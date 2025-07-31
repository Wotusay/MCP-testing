# Environment Configuration

This project uses Supabase for database connectivity. To set up your environment:

## Local Development

1. Copy the example environment files:
   ```bash
   cp src/environments/environment.example.ts src/environments/environment.ts
   cp src/environments/environment.prod.example.ts src/environments/environment.prod.ts
   ```

2. Update the environment files with your Supabase credentials:
   - Replace `YOUR_SUPABASE_URL_HERE` with your Supabase project URL
   - Replace `YOUR_SUPABASE_ANON_KEY_HERE` with your Supabase anonymous key

## Production Deployment

For production deployments, set the following environment variables in your GitHub repository settings:

- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_ANON_KEY`: Your Supabase anonymous key

These will be automatically injected during the build process.

## Security Notice

⚠️ **Important**: Never commit actual Supabase credentials to version control. The environment files with real credentials are gitignored to prevent accidental commits.

## Getting Supabase Credentials

1. Go to your [Supabase Dashboard](https://app.supabase.com/)
2. Select your project
3. Go to Settings → API
4. Copy the Project URL and anon/public key