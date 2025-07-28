# Branch Protection Documentation

## Main Branch Protection Rules

This repository implements branch protection for the `main` branch to ensure code quality and prevent accidental changes.

### Protection Rules Applied:

1. **Require pull request reviews before merging**
   - At least 1 approval required
   - Dismiss stale reviews when new commits are pushed
   - Require review from code owners (if CODEOWNERS file exists)

2. **Require status checks to pass before merging**
   - All CI/CD checks must pass
   - Branch must be up to date before merging

3. **Require branches to be up to date before merging**
   - Forces contributors to merge latest changes from main

4. **Restrict pushes that create files**
   - Prevents direct pushes to main branch
   - All changes must go through pull requests

5. **Allow force pushes: NO**
   - Prevents rewriting history on main branch

6. **Allow deletions: NO**
   - Prevents accidental deletion of main branch

### Manual Setup Required

To fully protect the main branch, a repository administrator must:

1. Go to repository Settings → Branches
2. Add a branch protection rule for `main`
3. Enable the following options:
   - ✅ Require a pull request before merging
   - ✅ Require approvals (minimum 1)
   - ✅ Dismiss stale pull request approvals when new commits are pushed
   - ✅ Require status checks to pass before merging
   - ✅ Require branches to be up to date before merging
   - ✅ Restrict pushes that create files
   - ❌ Allow force pushes
   - ❌ Allow deletions

### Workflow Enforcement

The `.github/workflows/branch-protection.yml` workflow provides additional enforcement:
- Prevents direct pushes to main
- Runs automated checks on pull requests
- Validates code quality before allowing merges