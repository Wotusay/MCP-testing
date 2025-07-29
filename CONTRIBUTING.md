# Contributing Guide

Thank you for your interest in contributing to the Angular Team Project! This guide will help you get started with our development workflow and standards.

## 🚀 Getting Started

### Prerequisites
- Node.js 20.19.4+ (use NVM for version management)
- npm 10.8.2+
- Git
- VS Code (recommended) with recommended extensions

### Development Setup

1. **Fork and clone the repository:**
   ```bash
   git clone https://github.com/your-username/MCP-testing.git
   cd MCP-testing
   ```

2. **Set up Node.js version:**
   ```bash
   nvm use 20
   # If you don't have Node.js 20 installed:
   nvm install 20
   nvm use 20
   nvm alias default 20
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Start development server:**
   ```bash
   npm start
   ```

## 🔄 Development Workflow

### Branching Strategy

We use a feature branch workflow:

- **`main`** - Production-ready code
- **`develop`** - Integration branch for features
- **`feature/issue-number-description`** - Feature branches
- **`bugfix/issue-number-description`** - Bug fix branches
- **`hotfix/issue-number-description`** - Critical fixes

### Creating a Feature Branch

```bash
# Update main branch
git checkout main
git pull origin main

# Create feature branch
git checkout -b feature/123-add-user-authentication

# Work on your feature...

# Push branch to origin
git push -u origin feature/123-add-user-authentication
```

### Making Changes

1. **Follow coding standards** (see [CODING_STANDARDS.md](docs/CODING_STANDARDS.md))
2. **Write tests** for new functionality
3. **Update documentation** if needed
4. **Run quality checks** before committing

```bash
# Check your code
npm run lint          # ESLint checks
npm run format:check  # Prettier formatting
npm test              # Run tests
npm run build         # Verify build works
```

### Commit Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```bash
# Format: type(scope): description
feat(auth): add user login functionality
fix(ui): resolve button styling issue
docs(readme): update installation instructions
test(auth): add unit tests for login service
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, semicolons, etc.)
- `refactor`: Code refactoring without functional changes
- `test`: Adding or updating tests
- `chore`: Build process or auxiliary tool changes

### Pre-commit Hooks

We use Husky for automated pre-commit checks:

- **ESLint**: Automatically fixes linting issues
- **Prettier**: Formats code consistently
- **Tests**: Ensures all tests pass

If pre-commit hooks fail, fix the issues and commit again.

## 📝 Pull Request Process

### Before Creating a PR

1. **Rebase your branch** on the latest main:
   ```bash
   git checkout main
   git pull origin main
   git checkout feature/your-branch
   git rebase main
   ```

2. **Ensure all checks pass:**
   ```bash
   npm run lint
   npm run format:check
   npm test
   npm run build
   ```

3. **Update documentation** if your changes affect public APIs

### Creating a Pull Request

1. **Push your branch** to your fork
2. **Create a PR** against the `main` branch
3. **Fill out the PR template** completely
4. **Link related issues** using keywords (e.g., "Fixes #123")

### PR Template

```markdown
## Description
Brief description of changes made.

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed

## Checklist
- [ ] Code follows project coding standards
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] Tests added/updated
- [ ] No breaking changes (or properly documented)
```

### Review Process

All PRs require:
- ✅ **Code review** from at least one maintainer
- ✅ **All CI checks** passing
- ✅ **Up-to-date** with main branch
- ✅ **Linked issue** (for features/bugs)

## 🧪 Testing Guidelines

### Unit Tests
- Write tests for all new functionality
- Maintain >90% code coverage
- Use descriptive test names
- Follow AAA pattern (Arrange, Act, Assert)

```typescript
describe('UserService', () => {
  it('should create user when valid data provided', () => {
    // Arrange
    const userData = { name: 'John', email: 'john@example.com' };
    
    // Act
    const user = service.createUser(userData);
    
    // Assert
    expect(user).toBeDefined();
    expect(user.name).toBe('John');
  });
});
```

### Running Tests
```bash
npm test              # Run tests with watch mode
npm run test:ci       # Run tests once (CI mode)
npm run test:coverage # Generate coverage report
```

## 🎨 UI/UX Guidelines

### Component Development
- Use **shared components** when possible
- Follow **Tailwind CSS** utility patterns
- Create **responsive designs** (mobile-first)
- Add **accessibility attributes** (ARIA labels, etc.)
- Document component APIs

### Design System
- Follow established color palette
- Use consistent spacing (Tailwind spacing scale)
- Maintain typography hierarchy
- Ensure 4.5:1 color contrast ratio minimum

## 🐛 Reporting Bugs

### Before Reporting
1. **Search existing issues** to avoid duplicates
2. **Update to latest version** if possible
3. **Reproduce the issue** consistently

### Bug Report Template
```markdown
**Describe the bug**
A clear description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment:**
- OS: [e.g., macOS]
- Browser: [e.g., Chrome]
- Version: [e.g., 22]
- Node.js version: [e.g., 20.19.4]
```

## 💡 Suggesting Features

### Feature Request Template
```markdown
**Is your feature request related to a problem?**
A clear description of what the problem is.

**Describe the solution you'd like**
A clear description of what you want to happen.

**Describe alternatives you've considered**
Other solutions you've considered.

**Additional context**
Any other context or screenshots about the feature request.
```

## 📚 Documentation

### Documentation Standards
- **Clear and concise** writing
- **Code examples** for APIs
- **Screenshots** for UI features
- **Keep up-to-date** with code changes

### Documentation Types
- **README.md** - Project overview and quick start
- **API docs** - Function/service documentation
- **Component docs** - UI component usage
- **Architecture docs** - System design decisions

## 🏆 Recognition

Contributors are recognized in:
- **CONTRIBUTORS.md** file
- **Release notes** for significant contributions
- **GitHub contributors** section

## 📞 Getting Help

- **GitHub Issues** - Bug reports and feature requests
- **GitHub Discussions** - Questions and general discussion
- **Code Review** - Get feedback on your changes

## 📖 Additional Resources

- [Angular Style Guide](https://angular.io/guide/styleguide)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Jest Testing Framework](https://jestjs.io/docs/getting-started)
- [Conventional Commits](https://www.conventionalcommits.org/)

---

Thank you for contributing to making this project better! 🎉