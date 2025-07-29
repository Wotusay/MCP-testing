# CI/CD Pipeline Documentation

## Overview
This project uses GitHub Actions for automated CI/CD pipeline to ensure code quality and reliability.

## Pipeline Jobs

### 1. Code Quality Checks (`lint-and-format`)
- **ESLint**: Validates TypeScript and HTML code with zero warnings policy
- **Prettier**: Ensures consistent code formatting across the project
- **Command**: `npm run lint && npm run format:check`

### 2. Testing (`test`)
- **Framework**: Karma + Jasmine with ChromeHeadless
- **Coverage**: Generates HTML coverage reports
- **Coverage Threshold**: 91%+ statement coverage currently achieved
- **Command**: `npm test -- --watch=false --browsers=ChromeHeadless --code-coverage`

### 3. Build Validation (`build`)
- **Build Type**: Production Angular build
- **Dependencies**: Requires lint-and-format and test jobs to pass
- **Output**: Optimized build artifacts stored for 7 days
- **Command**: `npm run build`

### 4. Security Scanning (`security-scan`)
- **Tool**: npm audit
- **Level**: High-severity vulnerabilities only
- **Behavior**: Non-blocking (continues on error)
- **Command**: `npm audit --audit-level=high`

## Pipeline Triggers

The CI/CD pipeline runs on:
- **Pull Requests** to `main` or `develop` branches
- **Direct pushes** to `main` or `develop` branches

## Local Development

Before creating a PR, ensure your code passes all checks:

```bash
# Install dependencies
npm ci

# Run linting
npm run lint

# Check formatting
npm run format:check

# Fix formatting if needed
npm run format

# Run tests with coverage
npm test -- --watch=false --browsers=ChromeHeadless --code-coverage

# Build the application
npm run build
```

## Pre-commit Hooks

The project uses Husky for pre-commit hooks that automatically:
- Fix linting issues
- Format code with Prettier
- Stage the fixed files

## Artifacts

The pipeline generates and stores:
- **Build artifacts**: Production-ready application files (7 days retention)
- **Coverage reports**: HTML coverage reports for analysis (7 days retention)

## Quality Gates

All jobs must pass for a PR to be merged:
- ✅ Zero linting warnings/errors
- ✅ Proper code formatting
- ✅ All tests passing
- ✅ Successful production build
- ✅ No high-severity security vulnerabilities

## Coverage Reports

Coverage reports are generated in HTML format and include:
- Statement coverage: 91.89%
- Branch coverage: 16.66%
- Function coverage: 70%
- Line coverage: 91.66%

Reports are available as downloadable artifacts after each pipeline run.