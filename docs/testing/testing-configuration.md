# Testing Configuration

This document describes the testing configuration and setup for the Angular Team Project.

## Test Framework Stack

- **Unit Testing**: Jasmine + Karma
- **Testing Utilities**: Angular Testing Library + Custom Test Utils
- **Coverage**: Istanbul (via Karma)
- **CI/CD**: GitHub Actions with automated test runs

## Configuration Files

### `karma.conf.js`
Main Karma configuration with:
- Coverage reporting with 80% thresholds
- Chrome headless for CI
- Multiple coverage reporters (HTML, LCOV, Cobertura)

### `angular.json`
Angular CLI test configuration:
- Code coverage enabled by default
- Proper asset and style configuration
- Coverage exclusions for test files

### `tsconfig.spec.json`
TypeScript configuration for tests:
- Jasmine types included
- Proper compilation settings

## Test Structure

```
src/
├── app/
│   ├── app.spec.ts                    # Main app component tests
│   └── shared/
│       ├── services/
│       │   ├── user.service.ts        # Example service
│       │   └── user.service.spec.ts   # Service unit tests
│       └── testing/
│           ├── index.ts               # Testing utilities exports
│           ├── test-utils.ts          # Component testing helpers
│           ├── mock-data.ts           # Mock data factories
│           └── mock-services.ts       # Mock service utilities
e2e/
├── src/
│   ├── app.e2e-spec.ts              # E2E test examples
│   ├── pages/
│   │   └── app.po.ts                 # Page Object Models
│   └── utils/
│       └── test-helpers.ts           # E2E testing utilities
└── README.md                         # E2E testing documentation
```

## Coverage Configuration

### Current Thresholds
- **Statements**: 80%
- **Branches**: 80%
- **Functions**: 80%
- **Lines**: 80%

### Coverage Reports
- HTML report: `coverage/angular-team-project/index.html`
- LCOV report: `coverage/angular-team-project/lcov.info`
- Text summary in console

## NPM Scripts

```json
{
  "test": "ng test",
  "test:coverage": "ng test --code-coverage --watch=false --browsers=ChromeHeadless",
  "test:ci": "ng test --watch=false --browsers=ChromeHeadless --code-coverage"
}
```

## CI/CD Integration

The GitHub Actions workflow (`./github/workflows/ci.yml`) includes:

1. **Code Quality Checks**
   - ESLint
   - Prettier format check

2. **Test Execution**
   - Unit tests with coverage
   - Coverage report upload
   - Coverage threshold enforcement

3. **Build Verification**
   - Production build
   - Artifact storage

## Testing Utilities

### TestUtils
Helper functions for component testing:
- Element queries (`querySelector`, `querySelectorAll`)
- User interactions (`click`, `setInputValue`)
- Assertions (`expectElementToExist`, `expectElementToHaveText`)

### Mock Data Factories
Consistent test data generation:
- `MockDataFactory.createUser()`
- `MockDataFactory.createProduct()`
- `MockDataFactory.createApiResponse()`

### Mock Services
Testing utilities for service mocking:
- `MockHttpService` for HTTP interactions
- `MockLocalStorage` for storage testing
- `TestEnvironment` for test setup/teardown

## Best Practices Implemented

1. **Test Organization**: Clear separation of unit, integration, and E2E tests
2. **Mock Data**: Centralized mock data with factories
3. **Test Utilities**: Reusable testing helpers
4. **Coverage Enforcement**: Automated coverage thresholds
5. **CI Integration**: Automated test runs on PR/push
6. **Documentation**: Comprehensive testing guidelines

## Future Enhancements

- **E2E Testing**: Add Cypress when network access allows installation
- **Visual Regression**: Consider adding screenshot testing
- **Performance Testing**: Add performance benchmarks
- **API Testing**: Add contract testing for APIs

## Troubleshooting

### Common Issues
1. **Zoneless Angular**: Tests configured for zoneless change detection
2. **Async Testing**: Proper handling of observables and promises
3. **Coverage Exclusions**: Test files excluded from coverage

### Debug Commands
```bash
# Run tests in watch mode
npm test

# Run single test file
npm test -- --include="**/user.service.spec.ts"

# Run tests with debugging
npm test -- --browsers=Chrome
```