# Testing Guidelines

This document provides comprehensive guidelines for testing in our Angular application.

## Table of Contents

- [Testing Strategy](#testing-strategy)
- [Unit Testing](#unit-testing)
- [Integration Testing](#integration-testing)
- [Test Coverage](#test-coverage)
- [Best Practices](#best-practices)
- [Testing Utilities](#testing-utilities)
- [Mock Data](#mock-data)
- [Running Tests](#running-tests)

## Testing Strategy

Our testing strategy follows the testing pyramid approach:

1. **Unit Tests (70%)** - Test individual components, services, and functions in isolation
2. **Integration Tests (20%)** - Test component interactions and service integrations
3. **E2E Tests (10%)** - Test complete user workflows and application behavior

## Unit Testing

### Testing Components

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { TestUtils } from '../shared/testing';
import { MyComponent } from './my-component';

describe('MyComponent', () => {
  let component: MyComponent;
  let fixture: ComponentFixture<MyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyComponent],
      providers: [provideZonelessChangeDetection()]
    }).compileComponents();

    fixture = TestBed.createComponent(MyComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render title', () => {
    component.title = 'Test Title';
    fixture.detectChanges();
    TestUtils.expectElementToHaveText(fixture, 'h1', 'Test Title');
  });

  it('should handle click events', () => {
    spyOn(component, 'onClick');
    const button = TestUtils.querySelector(fixture, 'button');
    TestUtils.click(button!);
    expect(component.onClick).toHaveBeenCalled();
  });
});
```

### Testing Services

```typescript
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MyService } from './my-service';
import { MockDataFactory } from '../shared/testing';

describe('MyService', () => {
  let service: MyService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [MyService]
    });
    service = TestBed.inject(MyService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should fetch users', () => {
    const mockUsers = MockDataFactory.createUsers(3);
    
    service.getUsers().subscribe(users => {
      expect(users).toEqual(mockUsers);
    });

    const req = httpMock.expectOne('/api/users');
    expect(req.request.method).toBe('GET');
    req.flush(mockUsers);
  });
});
```

### Testing Pipes

```typescript
import { MyPipe } from './my-pipe';

describe('MyPipe', () => {
  let pipe: MyPipe;

  beforeEach(() => {
    pipe = new MyPipe();
  });

  it('should transform value correctly', () => {
    expect(pipe.transform('hello')).toBe('HELLO');
  });

  it('should handle null values', () => {
    expect(pipe.transform(null)).toBe('');
  });
});
```

## Integration Testing

Integration tests verify that multiple components work together correctly:

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ParentComponent } from './parent.component';
import { ChildComponent } from './child.component';
import { MyService } from '../services/my-service';

describe('ParentComponent Integration', () => {
  let component: ParentComponent;
  let fixture: ComponentFixture<ParentComponent>;
  let service: MyService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ParentComponent,
        ChildComponent,
        HttpClientTestingModule,
        RouterTestingModule
      ],
      providers: [MyService]
    }).compileComponents();

    fixture = TestBed.createComponent(ParentComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(MyService);
  });

  it('should pass data to child component', () => {
    const testData = 'test data';
    component.dataToPass = testData;
    fixture.detectChanges();

    const childComponent = fixture.debugElement.query(By.directive(ChildComponent));
    expect(childComponent.componentInstance.data).toBe(testData);
  });
});
```

## Test Coverage

### Coverage Requirements

- **Statements**: 80% minimum
- **Branches**: 80% minimum  
- **Functions**: 80% minimum
- **Lines**: 80% minimum

### Running Coverage Reports

```bash
# Run tests with coverage
npm run test -- --code-coverage

# View coverage report
open coverage/angular-team-project/index.html
```

### Coverage Configuration

Coverage settings are configured in `karma.conf.js`:

```javascript
coverageReporter: {
  check: {
    global: {
      statements: 80,
      branches: 80,
      functions: 80,
      lines: 80
    }
  }
}
```

## Best Practices

### General Guidelines

1. **Test Behavior, Not Implementation** - Focus on what the component does, not how it does it
2. **Use Descriptive Test Names** - Test names should clearly describe what is being tested
3. **Arrange-Act-Assert Pattern** - Structure tests with clear setup, execution, and verification phases
4. **One Assertion Per Test** - Keep tests focused and easy to debug
5. **Use TestBed for Angular-specific Testing** - Leverage Angular's testing utilities

### Component Testing Best Practices

1. **Test User Interactions** - Verify click handlers, form submissions, etc.
2. **Test Component Inputs and Outputs** - Verify @Input and @Output behavior
3. **Test Conditional Rendering** - Verify elements appear/disappear based on conditions
4. **Mock Dependencies** - Use spies and mocks for external dependencies

### Service Testing Best Practices

1. **Test HTTP Interactions** - Use HttpClientTestingModule for HTTP testing
2. **Test Error Handling** - Verify error scenarios are handled correctly
3. **Test State Management** - Verify service state changes correctly
4. **Mock External APIs** - Don't make real HTTP calls in unit tests

### Naming Conventions

- Test files: `*.spec.ts`
- Test descriptions: Use "should" statements
- Test groups: Use `describe` blocks for logical grouping

## Testing Utilities

Our testing utilities provide helpful functions for common testing scenarios:

### TestUtils

```typescript
import { TestUtils } from '../shared/testing';

// Element queries
const element = TestUtils.querySelector(fixture, '.my-class');
const elements = TestUtils.querySelectorAll(fixture, '.my-class');

// Interactions
TestUtils.click(element);
TestUtils.setInputValue(fixture, 'input[name="email"]', 'test@example.com');

// Assertions
TestUtils.expectElementToExist(fixture, '.success-message');
TestUtils.expectElementToHaveText(fixture, 'h1', 'Expected Title');
```

### Mock Services

```typescript
import { MockHttpService, TestEnvironment } from '../shared/testing';

// Setup mock environment
beforeEach(() => {
  TestEnvironment.setupMockStorage();
});

afterEach(() => {
  TestEnvironment.restoreStorage();
});

// Use mock HTTP service
const mockHttp = new MockHttpService();
mockHttp.get(testData).subscribe(result => {
  // Test HTTP interactions
});
```

## Mock Data

Use our mock data factories for consistent test data:

```typescript
import { MockDataFactory, mockUsers } from '../shared/testing';

// Use predefined mock data
const users = mockUsers;

// Create custom mock data
const user = MockDataFactory.createUser({ name: 'John Doe' });
const users = MockDataFactory.createUsers(5);

// Create API responses
const response = MockDataFactory.createApiResponse(users);
const errorResponse = MockDataFactory.createErrorResponse('User not found');
```

## Running Tests

### Development

```bash
# Run tests in watch mode
npm run test

# Run tests once
npm run test -- --watch=false

# Run tests with coverage
npm run test -- --code-coverage
```

### CI/CD

```bash
# Run tests in headless mode for CI
npm run test -- --watch=false --browsers=ChromeHeadless
```

### Debugging Tests

1. **Use `fit` and `fdescribe`** - Focus on specific tests during development
2. **Use `xit` and `xdescribe`** - Skip tests temporarily
3. **Add `debugger` statements** - Debug tests in browser dev tools
4. **Check console output** - Look for error messages and warnings

## Common Testing Patterns

### Testing Async Operations

```typescript
it('should handle async operations', async () => {
  component.loadData();
  await TestUtils.waitForAsync(fixture);
  
  expect(component.data).toBeDefined();
});
```

### Testing Form Validation

```typescript
it('should validate email format', () => {
  TestUtils.setInputValue(fixture, 'input[name="email"]', 'invalid-email');
  fixture.detectChanges();
  
  TestUtils.expectElementToExist(fixture, '.error-message');
});
```

### Testing Router Navigation

```typescript
it('should navigate to user profile', () => {
  const router = TestBed.inject(Router);
  spyOn(router, 'navigate');
  
  component.navigateToProfile(123);
  
  expect(router.navigate).toHaveBeenCalledWith(['/user', 123]);
});
```

## Troubleshooting

### Common Issues

1. **Tests failing due to missing imports** - Ensure all required modules are imported in TestBed
2. **Async test failures** - Use proper async/await or fakeAsync/tick patterns
3. **Mock issues** - Verify mocks are properly configured and reset between tests
4. **Coverage gaps** - Check for untested code paths and edge cases

### Getting Help

- Check Angular Testing Guide: https://angular.dev/guide/testing
- Review Jasmine documentation: https://jasmine.github.io/
- Ask team members for code review and testing advice