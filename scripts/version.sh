#!/bin/bash

# Version Management Script
# Usage: ./scripts/version.sh [patch|minor|major]

set -e

VERSION_TYPE=${1:-patch}

if [[ ! "$VERSION_TYPE" =~ ^(patch|minor|major)$ ]]; then
    echo "Error: Invalid version type. Use 'patch', 'minor', or 'major'"
    echo ""
    echo "Version bump rules:"
    echo "  patch (0.0.0 -> 0.0.1): Bug fixes, minor fixes"
    echo "  minor (0.0.0 -> 0.1.0): New features, enhancements"  
    echo "  major (0.0.0 -> 1.0.0): Breaking changes, new platform, huge changes"
    exit 1
fi

echo "🚀 Starting version bump process..."

# Get current version
CURRENT_VERSION=$(node -p "require('./package.json').version")
echo "📋 Current version: $CURRENT_VERSION"

# Run tests first
echo "🧪 Running tests..."
npm run test:ci

# Run linting
echo "🔍 Running linting..."
npm run lint

# Build the project
echo "🔨 Building project..."
npm run build

# Bump version
echo "📈 Bumping version ($VERSION_TYPE)..."
npm version $VERSION_TYPE --no-git-tag-version

# Get new version
NEW_VERSION=$(node -p "require('./package.json').version")
echo "✅ New version: $NEW_VERSION"

echo ""
echo "🎉 Version bump completed successfully!"
echo "📝 Don't forget to commit your changes and create a git tag:"
echo "   git add package.json package-lock.json"
echo "   git commit -m 'chore: bump version to $NEW_VERSION'"
echo "   git tag -a v$NEW_VERSION -m 'Release version $NEW_VERSION'"
echo "   git push && git push --tags"