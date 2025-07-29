# Version Management and Branch Auto-Deletion

This repository includes automated workflows for managing versions and cleaning up branches after PR approval.

## Auto Branch Deletion

When a Pull Request is merged, the source branch is automatically deleted to keep the repository clean. This applies to all branches except:
- `main`
- `develop`

## Automatic Version Management

### Version Bump Rules

The system follows semantic versioning with these rules:

- **Patch** (`0.0.0 → 0.0.1`): Bug fixes, minor fixes
- **Minor** (`0.0.0 → 0.1.0`): New features, enhancements
- **Major** (`0.0.0 → 1.0.0`): Breaking changes, new platform, huge changes

### How Version Bumping Works

Version bumping is triggered automatically when a PR is merged. The system determines the version bump type based on:

1. **PR Labels** (highest priority):
   - `major`, `breaking`, `platform` → Major version bump
   - `minor`, `feature`, `enhancement` → Minor version bump  
   - `patch`, `bugfix`, `fix` → Patch version bump

2. **Conventional Commits** (if no relevant labels):
   - `feat!:`, `fix!:`, or "BREAKING CHANGE" → Major version bump
   - `feat:` → Minor version bump
   - `fix:` → Patch version bump

3. **Default**: If no labels or conventional commits are detected, defaults to patch version bump

### Manual Version Management

You can also manage versions manually using npm scripts:

```bash
# Patch version (bug fixes)
npm run release:patch

# Minor version (new features)  
npm run release:minor

# Major version (breaking changes)
npm run release:major
```

Or use the version management script:

```bash
# Run the version script
./scripts/version.sh patch   # for bug fixes
./scripts/version.sh minor   # for new features
./scripts/version.sh major   # for breaking changes
```

### What Happens During Version Bump

1. **Tests and build verification**: Ensures code quality before version bump
2. **Version increment**: Updates `package.json` and `package-lock.json`
3. **Git commit**: Commits the version changes with a conventional commit message
4. **Git tag creation**: Creates a git tag with the new version
5. **GitHub Release**: Creates a GitHub release with release notes

### Adding Labels to PRs

To ensure proper version bumping, add appropriate labels to your PRs:

- For bug fixes: `fix`, `bugfix`, or `patch`
- For new features: `feature`, `enhancement`, or `minor`
- For breaking changes: `breaking`, `major`, or `platform`

### Example Workflow

1. Create a feature branch: `git checkout -b feature/new-component`
2. Make your changes and commit
3. Open a PR and add appropriate label (e.g., `feature`)
4. Get PR approved and merged
5. System automatically:
   - Bumps minor version (because of `feature` label)
   - Deletes the `feature/new-component` branch
   - Creates a git tag and GitHub release

## Repository Scripts

The following npm scripts are available for version management:

- `npm run version:patch` - Bump patch version only
- `npm run version:minor` - Bump minor version only  
- `npm run version:major` - Bump major version only
- `npm run release:prepare` - Run tests and build before release
- `npm run release:patch` - Full patch release process
- `npm run release:minor` - Full minor release process
- `npm run release:major` - Full major release process