# Deployment Guide

This document outlines the deployment procedures, environments, and best practices for the Angular Team Project.

## 📋 Table of Contents

- [Deployment Overview](#deployment-overview)
- [Environment Configuration](#environment-configuration)
- [Build Process](#build-process)
- [Deployment Environments](#deployment-environments)
- [CI/CD Pipeline](#cicd-pipeline)
- [Manual Deployment](#manual-deployment)
- [Monitoring and Rollback](#monitoring-and-rollback)
- [Security Considerations](#security-considerations)
- [Troubleshooting](#troubleshooting)

## 🏗️ Deployment Overview

### Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Development   │───▶│     Staging     │───▶│   Production    │
│   Environment    │    │   Environment   │    │   Environment   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  localhost:4200 │    │  staging.app.com│    │  app.example.com│
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Deployment Strategy

- **Blue-Green Deployment**: Zero-downtime deployments with instant rollback capability
- **Automated Pipeline**: GitHub Actions for continuous deployment
- **Environment Promotion**: Code flows through development → staging → production
- **Feature Flags**: Gradual feature rollouts and A/B testing

## ⚙️ Environment Configuration

### Environment Files

#### Development (`src/environments/environment.ts`)
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
  logLevel: 'debug',
  enableDevTools: true,
  version: require('../../package.json').version
};
```

#### Staging (`src/environments/environment.staging.ts`)
```typescript
export const environment = {
  production: false,
  apiUrl: 'https://staging-api.example.com/api',
  logLevel: 'info',
  enableDevTools: true,
  version: require('../../package.json').version
};
```

#### Production (`src/environments/environment.prod.ts`)
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://api.example.com/api',
  logLevel: 'error',
  enableDevTools: false,
  version: require('../../package.json').version
};
```

### Build Configurations

#### angular.json Configuration
```json
{
  "projects": {
    "angular-team-project": {
      "architect": {
        "build": {
          "configurations": {
            "production": {
              "budgets": [
                {
                  "type": "initial",
                  "maximumWarning": "500kb",
                  "maximumError": "1mb"
                }
              ],
              "outputHashing": "all",
              "sourceMap": false,
              "optimization": true,
              "aot": true,
              "extractLicenses": true,
              "namedChunks": false
            },
            "staging": {
              "budgets": [
                {
                  "type": "initial",
                  "maximumWarning": "2mb",
                  "maximumError": "5mb"
                }
              ],
              "outputHashing": "all",
              "sourceMap": true,
              "optimization": true,
              "aot": true
            }
          }
        }
      }
    }
  }
}
```

## 🔨 Build Process

### Local Build Commands

```bash
# Development build
ng build

# Staging build
ng build --configuration=staging

# Production build
ng build --configuration=production

# Analyze bundle size
ng build --stats-json
npx webpack-bundle-analyzer dist/angular-team-project/stats.json
```

### Build Optimization

#### Tree Shaking
```typescript
// Use standalone components for better tree shaking
@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonComponent],
  // ...
})
export class UserProfileComponent {}
```

#### Lazy Loading
```typescript
// app.routes.ts
export const routes: Routes = [
  {
    path: 'users',
    loadComponent: () => import('./features/users/user-list.component')
      .then(m => m.UserListComponent)
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./features/dashboard/dashboard.routes')
      .then(m => m.DASHBOARD_ROUTES)
  }
];
```

#### Service Workers (Future)
```typescript
// app.config.ts
import { isDevMode } from '@angular/core';
import { ServiceWorkerModule } from '@angular/service-worker';

export const appConfig: ApplicationConfig = {
  providers: [
    // ... other providers
    importProvidersFrom(
      ServiceWorkerModule.register('ngsw-worker.js', {
        enabled: !isDevMode(),
        registrationStrategy: 'registerWhenStable:30000'
      })
    )
  ]
};
```

## 🌍 Deployment Environments

### Development Environment

**Purpose**: Local development and testing
- **URL**: http://localhost:4200
- **Database**: Local/Mock data
- **Auth**: Mock authentication
- **Deployment**: `ng serve`

### Staging Environment

**Purpose**: Pre-production testing and QA
- **URL**: https://staging.example.com
- **Database**: Staging database (copy of production data)
- **Auth**: Staging authentication service
- **Deployment**: Automated via CI/CD on `develop` branch

#### Staging Deployment Process
```bash
# Trigger deployment to staging
git push origin develop

# Manual staging deployment
ng build --configuration=staging
# Deploy dist/ folder to staging server
```

### Production Environment

**Purpose**: Live application for end users
- **URL**: https://app.example.com
- **Database**: Production database
- **Auth**: Production authentication service
- **Deployment**: Automated via CI/CD on `main` branch with manual approval

#### Production Deployment Process
```bash
# Create production release
git checkout main
git merge develop
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin main --tags

# Automated production deployment triggers
```

## 🚀 CI/CD Pipeline

### GitHub Actions Workflow

#### Staging Deployment (`.github/workflows/deploy-staging.yml`)
```yaml
name: Deploy to Staging

on:
  push:
    branches: [ develop ]

jobs:
  deploy-staging:
    runs-on: ubuntu-latest
    environment: staging
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v4
      
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '20'
        cache: 'npm'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Run tests
      run: npm run test:ci
      
    - name: Build for staging
      run: ng build --configuration=staging
      
    - name: Deploy to staging server
      run: |
        # Deploy dist/ folder to staging server
        # This would typically use SSH, FTP, or cloud deployment tools
        echo "Deploying to staging server..."
        
    - name: Run smoke tests
      run: |
        # Run basic smoke tests against staging
        curl -f https://staging.example.com/health || exit 1
        
    - name: Notify team
      if: always()
      uses: 8398a7/action-slack@v3
      with:
        status: ${{ job.status }}
        text: "Staging deployment ${{ job.status }}"
```

#### Production Deployment (`.github/workflows/deploy-production.yml`)
```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]
    tags: [ 'v*' ]

jobs:
  deploy-production:
    runs-on: ubuntu-latest
    environment: production
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v4
      
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '20'
        cache: 'npm'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Run full test suite
      run: |
        npm run lint
        npm run test:ci
        npm run build
        
    - name: Build for production
      run: ng build --configuration=production
      
    - name: Security scan
      run: npm audit --audit-level=high
      
    - name: Deploy to production
      run: |
        # Blue-green deployment script
        ./scripts/deploy-production.sh
        
    - name: Run health checks
      run: |
        # Comprehensive health checks
        ./scripts/health-check.sh https://app.example.com
        
    - name: Create GitHub release
      if: startsWith(github.ref, 'refs/tags/')
      uses: actions/create-release@v1
      env:
        GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      with:
        tag_name: ${{ github.ref }}
        release_name: Release ${{ github.ref }}
        draft: false
        prerelease: false
```

### Deployment Scripts

#### Blue-Green Deployment Script (`scripts/deploy-production.sh`)
```bash
#!/bin/bash
set -e

echo "Starting blue-green deployment..."

# Configuration
BLUE_DIR="/var/www/app-blue"
GREEN_DIR="/var/www/app-green"
CURRENT_LINK="/var/www/app-current"
DIST_DIR="dist/angular-team-project"

# Determine current and target environments
if [ -L "$CURRENT_LINK" ]; then
    CURRENT=$(readlink $CURRENT_LINK)
    if [[ "$CURRENT" == *"blue"* ]]; then
        TARGET_DIR=$GREEN_DIR
        TARGET_COLOR="green"
    else
        TARGET_DIR=$BLUE_DIR
        TARGET_COLOR="blue"
    fi
else
    TARGET_DIR=$BLUE_DIR
    TARGET_COLOR="blue"
fi

echo "Deploying to $TARGET_COLOR environment..."

# Deploy new version
rm -rf $TARGET_DIR
mkdir -p $TARGET_DIR
cp -r $DIST_DIR/* $TARGET_DIR/

# Health check on new deployment
echo "Running health checks..."
if ! curl -f http://localhost:8080 --header "Host: app.example.com" --resolve app.example.com:8080:127.0.0.1; then
    echo "Health check failed!"
    exit 1
fi

# Switch traffic to new version
ln -sfn $TARGET_DIR $CURRENT_LINK

echo "Deployment to $TARGET_COLOR completed successfully!"

# Optional: Keep previous version for quick rollback
echo "Previous version available for rollback"
```

#### Health Check Script (`scripts/health-check.sh`)
```bash
#!/bin/bash
URL=$1
MAX_ATTEMPTS=30
ATTEMPT=1

echo "Running health checks for $URL..."

while [ $ATTEMPT -le $MAX_ATTEMPTS ]; do
    echo "Attempt $ATTEMPT/$MAX_ATTEMPTS"
    
    # Basic availability check
    if curl -f "$URL/health" > /dev/null 2>&1; then
        echo "✅ Health endpoint responding"
        
        # Check if app loads correctly
        if curl -f "$URL" | grep -q "Angular Team Project"; then
            echo "✅ Application loading correctly"
            
            # Check API connectivity
            if curl -f "$URL/api/health" > /dev/null 2>&1; then
                echo "✅ API connectivity confirmed"
                echo "All health checks passed!"
                exit 0
            fi
        fi
    fi
    
    echo "Health check failed, retrying..."
    sleep 10
    ATTEMPT=$((ATTEMPT + 1))
done

echo "❌ Health checks failed after $MAX_ATTEMPTS attempts"
exit 1
```

## 📋 Manual Deployment

### Emergency Deployment Process

When automated deployment is unavailable:

```bash
# 1. Prepare deployment
git checkout main
git pull origin main
npm ci

# 2. Run quality checks
npm run lint
npm run test:ci
npm run build --configuration=production

# 3. Create deployment package
cd dist/angular-team-project
tar -czf ../angular-team-project-$(date +%Y%m%d-%H%M%S).tar.gz .
cd ../..

# 4. Deploy to server
scp dist/angular-team-project-*.tar.gz user@server:/tmp/
ssh user@server
# On server: extract, test, and switch
```

### Rollback Procedures

#### Automated Rollback
```bash
# Rollback to previous version (blue-green)
./scripts/rollback.sh

# Rollback to specific version
./scripts/rollback.sh v1.2.0
```

#### Manual Rollback
```bash
# 1. Switch to previous deployment
ln -sfn /var/www/app-blue /var/www/app-current

# 2. Verify rollback
curl -f https://app.example.com/health

# 3. Notify team
echo "Rollback completed at $(date)" | slack-notify
```

## 📊 Monitoring and Rollback

### Health Monitoring

#### Application Health Endpoint
```typescript
// health.service.ts
@Injectable({
  providedIn: 'root'
})
export class HealthService {
  getHealth(): Observable<HealthStatus> {
    return this.http.get<HealthStatus>('/api/health').pipe(
      map(response => ({
        status: 'healthy',
        timestamp: new Date(),
        version: environment.version,
        uptime: performance.now()
      })),
      catchError(() => of({
        status: 'unhealthy',
        timestamp: new Date(),
        version: environment.version
      }))
    );
  }
}
```

#### Monitoring Dashboard
- **Uptime monitoring**: Pingdom, UptimeRobot
- **Performance monitoring**: Google Analytics, Core Web Vitals
- **Error tracking**: Sentry, LogRocket
- **Real User Monitoring**: New Relic, DataDog

### Deployment Metrics

Track these metrics for each deployment:
- **Deployment duration**: Time from start to completion
- **Success rate**: Percentage of successful deployments
- **Rollback frequency**: Number of rollbacks per month
- **Time to recovery**: Time to resolve failed deployments

## 🔒 Security Considerations

### Build Security

```bash
# Dependency scanning
npm audit --audit-level=high

# Container scanning (if using Docker)
docker scan angular-team-project:latest

# License compliance
npx license-checker
```

### Runtime Security

#### Content Security Policy
```typescript
// app.config.ts
export const appConfig: ApplicationConfig = {
  providers: [
    // CSP configuration
    {
      provide: 'CSP_NONCE',
      useValue: window.__CSP_NONCE__ || ''
    }
  ]
};
```

#### Security Headers
```nginx
# nginx.conf
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Strict-Transport-Security "max-age=31536000; includeSubdomains" always;
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'" always;
```

### Secrets Management

```bash
# Environment variables for sensitive data
export API_KEY=${{ secrets.API_KEY }}
export DATABASE_URL=${{ secrets.DATABASE_URL }}

# Never commit secrets to version control
echo "*.env" >> .gitignore
echo "secrets.json" >> .gitignore
```

## 🔧 Troubleshooting

### Common Deployment Issues

#### Build Failures
```bash
# Clear cache and rebuild
rm -rf node_modules dist .angular
npm install
ng build --configuration=production

# Check for memory issues
node --max-old-space-size=8192 ./node_modules/@angular/cli/bin/ng build --prod
```

#### Runtime Errors
```bash
# Check application logs
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log

# Monitor browser console errors
# Open browser developer tools > Console tab
```

#### Performance Issues
```bash
# Analyze bundle size
ng build --stats-json
npx webpack-bundle-analyzer dist/stats.json

# Check for memory leaks
# Use Chrome DevTools > Performance tab
```

### Deployment Checklist

Before each deployment:
- [ ] All tests pass
- [ ] Code review completed
- [ ] Security scan passed
- [ ] Performance regression tested
- [ ] Database migrations ready (if any)
- [ ] Rollback plan confirmed
- [ ] Team notified
- [ ] Monitoring alerts configured

After each deployment:
- [ ] Health checks pass
- [ ] Smoke tests completed
- [ ] Monitoring confirms stability
- [ ] User feedback monitored
- [ ] Performance metrics reviewed

## 📞 Support and Escalation

### Deployment Support Team
- **Primary**: DevOps Engineer (on-call)
- **Secondary**: Lead Developer
- **Escalation**: Engineering Manager

### Emergency Contacts
- **Slack**: #deployment-alerts
- **Email**: devops@company.com
- **Phone**: +1-555-0123 (emergency only)

### Post-Deployment Review

After major deployments:
1. **Retrospective meeting** within 24 hours
2. **Performance analysis** after 1 week
3. **User feedback review** after 2 weeks
4. **Process improvements** documented

---

This deployment guide should be updated as the infrastructure and deployment processes evolve.