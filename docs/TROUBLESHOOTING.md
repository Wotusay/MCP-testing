# Troubleshooting Guide

This guide helps team members diagnose and resolve common issues encountered during development, testing, and deployment of the Angular Team Project.

## 📋 Table of Contents

- [Development Environment Issues](#development-environment-issues)
- [Build and Compilation Errors](#build-and-compilation-errors)
- [Runtime Errors](#runtime-errors)
- [Testing Issues](#testing-issues)
- [Performance Problems](#performance-problems)
- [Deployment Issues](#deployment-issues)
- [Browser-Specific Issues](#browser-specific-issues)
- [Third-Party Integration Issues](#third-party-integration-issues)
- [Getting Help](#getting-help)

## 🛠️ Development Environment Issues

### Node.js Version Problems

#### Problem: "node: command not found" or version mismatch
```bash
# Check current Node.js version
node --version
npm --version

# If Node.js is not installed or wrong version
# Install/switch to Node.js 20 using NVM
nvm install 20
nvm use 20
nvm alias default 20

# Verify installation
node --version  # Should show v20.x.x
```

#### Problem: npm permission errors on macOS/Linux
```bash
# Fix npm permissions
sudo chown -R $(whoami) ~/.npm
sudo chown -R $(whoami) /usr/local/lib/node_modules

# Or use NVM to avoid permission issues
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install 20
nvm use 20
```

### Dependency Installation Issues

#### Problem: "Module not found" errors after git pull
```bash
# Clear cache and reinstall dependencies
rm -rf node_modules package-lock.json
npm cache clean --force
npm install

# If using different package manager accidentally
rm -rf node_modules yarn.lock pnpm-lock.yaml
npm install
```

#### Problem: "ERESOLVE unable to resolve dependency tree"
```bash
# Force resolution (use with caution)
npm install --legacy-peer-deps

# Or clean install
rm -rf node_modules package-lock.json
npm install

# Check for conflicting dependencies
npm ls
```

#### Problem: "gyp ERR!" build errors on Windows
```bash
# Install Windows build tools
npm install --global windows-build-tools

# Or use specific Python version
npm config set python python2.7
npm install --global node-gyp
```

### Angular CLI Issues

#### Problem: "ng: command not found"
```bash
# Install Angular CLI globally
npm install -g @angular/cli@latest

# Verify installation
ng version

# If still not found, check PATH
echo $PATH
# Add npm global bin to PATH if needed
export PATH=$PATH:$(npm bin -g)
```

#### Problem: Angular CLI version conflicts
```bash
# Check local vs global CLI versions
ng version

# Update global CLI
npm uninstall -g @angular/cli
npm install -g @angular/cli@latest

# Update local CLI
npm install @angular/cli@latest
npx ng version
```

## 🔨 Build and Compilation Errors

### TypeScript Compilation Errors

#### Problem: "Property does not exist on type" errors
```typescript
// ❌ Common mistake - missing type definition
const user = {}; // Type is {}
user.name = 'John'; // Error: Property 'name' does not exist

// ✅ Solution - proper type definition
interface User {
  name: string;
}
const user: User = { name: 'John' };

// ✅ Alternative - type assertion (use carefully)
const user = {} as User;
user.name = 'John';
```

#### Problem: "Cannot find module" for custom modules
```typescript
// ❌ Wrong import path
import { UserService } from './user.service'; // File doesn't exist

// ✅ Check file location and fix import
import { UserService } from '../services/user.service';

// ✅ Or use barrel exports
// In services/index.ts
export { UserService } from './user.service';

// Then import
import { UserService } from '../services';
```

#### Problem: Strict mode errors
```typescript
// ❌ Property used before assignment
class UserComponent {
  user: User; // Error in strict mode
  
  ngOnInit() {
    console.log(this.user.name); // Error: used before assignment
  }
}

// ✅ Solutions
class UserComponent {
  user!: User; // Definite assignment assertion
  // OR
  user: User | undefined; // Optional type
  // OR
  user: User = {} as User; // Default value
}
```

### Angular-Specific Build Errors

#### Problem: "Can't bind to 'property' since it isn't a known property"
```typescript
// ❌ Missing import in standalone component
@Component({
  selector: 'app-user',
  standalone: true,
  // Missing imports for form directives
  template: `<input [(ngModel)]="name">` // Error
})

// ✅ Add required imports
@Component({
  selector: 'app-user',
  standalone: true,
  imports: [FormsModule], // Add this
  template: `<input [(ngModel)]="name">`
})
```

#### Problem: "No provider for service" error
```typescript
// ❌ Service not provided
@Component({
  // ...
})
export class UserComponent {
  constructor(private userService: UserService) {} // Error
}

// ✅ Provide service
@Injectable({
  providedIn: 'root' // Global provider
})
export class UserService {}

// OR provide in component
@Component({
  providers: [UserService] // Local provider
})
```

### Tailwind CSS Build Issues

#### Problem: Tailwind styles not working
```bash
# Check if Tailwind is properly configured
# Verify tailwind.config.js content paths
module.exports = {
  content: [
    "./src/**/*.{html,ts}", // Make sure this includes your files
  ],
  // ...
}

# Check if Tailwind directives are in styles.css
# @tailwind base;
# @tailwind components;
# @tailwind utilities;

# Rebuild with clearing cache
rm -rf .angular/cache
ng build
```

#### Problem: "Unknown at rule @tailwind" error
```bash
# Install PostCSS language support in VS Code
# Or add to .vscode/settings.json
{
  "files.associations": {
    "*.css": "postcss"
  }
}

# Check postcss.config.js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

## 🚨 Runtime Errors

### Common JavaScript Errors

#### Problem: "Cannot read property of undefined"
```typescript
// ❌ Accessing nested property without checking
user.profile.avatar.url // Error if user, profile, or avatar is undefined

// ✅ Solutions
// Optional chaining
user?.profile?.avatar?.url

// Guard clause
if (user && user.profile && user.profile.avatar) {
  return user.profile.avatar.url;
}

// Default values
const avatarUrl = user?.profile?.avatar?.url || '/default-avatar.png';
```

#### Problem: "Cannot read property of null"
```typescript
// ❌ DOM element not found
const element = document.getElementById('my-element');
element.innerHTML = 'Hello'; // Error if element is null

// ✅ Check for null
const element = document.getElementById('my-element');
if (element) {
  element.innerHTML = 'Hello';
}

// ✅ In Angular components, use ViewChild
@ViewChild('myElement') myElement!: ElementRef;

ngAfterViewInit() {
  if (this.myElement) {
    this.myElement.nativeElement.innerHTML = 'Hello';
  }
}
```

### Angular-Specific Runtime Errors

#### Problem: "ExpressionChangedAfterItHasBeenCheckedError"
```typescript
// ❌ Modifying data during change detection
ngAfterViewInit() {
  this.loading = false; // Triggers change detection error
}

// ✅ Solutions
ngAfterViewInit() {
  // Defer the change
  setTimeout(() => {
    this.loading = false;
  });
  
  // Or trigger change detection manually
  this.cdr.detectChanges();
}

// ✅ Or use OnPush strategy
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush
})
```

#### Problem: Memory leaks from unsubscribed Observables
```typescript
// ❌ Not unsubscribing
export class UserComponent implements OnInit {
  ngOnInit() {
    this.userService.users$.subscribe(users => {
      this.users = users; // Memory leak
    });
  }
}

// ✅ Solutions
export class UserComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  ngOnInit() {
    this.userService.users$
      .pipe(takeUntil(this.destroy$))
      .subscribe(users => {
        this.users = users;
      });
  }
  
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

// ✅ Or use async pipe
@Component({
  template: `<div *ngFor="let user of userService.users$ | async">`
})
```

### HTTP and API Errors

#### Problem: CORS errors in development
```typescript
// ✅ Add proxy configuration
// Create proxy.conf.json
{
  "/api/*": {
    "target": "http://localhost:3000",
    "secure": true,
    "changeOrigin": true,
    "logLevel": "debug"
  }
}

// Update angular.json
"serve": {
  "builder": "@angular-devkit/build-angular:dev-server",
  "options": {
    "proxyConfig": "proxy.conf.json"
  }
}

// Start with proxy
ng serve
```

#### Problem: HTTP interceptor not working
```typescript
// ❌ Interceptor not provided
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    // ...
  }
}

// ✅ Provide interceptor
export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withInterceptors([
        (req, next) => {
          // Functional interceptor
          return next(req);
        }
      ])
    )
  ]
};
```

## 🧪 Testing Issues

### Karma/Jasmine Test Failures

#### Problem: "Chrome not found" error
```bash
# Install Chrome/Chromium
# Ubuntu/Debian
sudo apt-get install chromium-browser

# macOS
brew install --cask google-chrome

# Or use ChromeHeadless in karma.conf.js
browsers: ['ChromeHeadless']

# For CI environments
export CHROME_BIN=/usr/bin/chromium-browser
```

#### Problem: "Cannot read property of undefined" in tests
```typescript
// ❌ Component dependencies not provided
describe('UserComponent', () => {
  let component: UserComponent;
  
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [UserComponent]
      // Missing service providers
    });
  });
});

// ✅ Provide all dependencies
describe('UserComponent', () => {
  let component: UserComponent;
  let userService: jasmine.SpyObj<UserService>;
  
  beforeEach(() => {
    const spy = jasmine.createSpyObj('UserService', ['getUsers']);
    
    TestBed.configureTestingModule({
      imports: [UserComponent],
      providers: [
        { provide: UserService, useValue: spy }
      ]
    });
    
    userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
  });
});
```

#### Problem: Async test failures
```typescript
// ❌ Not handling async operations properly
it('should load users', () => {
  component.loadUsers();
  expect(component.users.length).toBe(3); // Fails if async
});

// ✅ Solutions
it('should load users', async () => {
  userService.getUsers.and.returnValue(of(mockUsers));
  component.loadUsers();
  
  // Wait for async operations
  await fixture.whenStable();
  fixture.detectChanges();
  
  expect(component.users.length).toBe(3);
});

// ✅ Or use fakeAsync
it('should load users', fakeAsync(() => {
  userService.getUsers.and.returnValue(of(mockUsers));
  component.loadUsers();
  
  tick(); // Simulate passage of time
  fixture.detectChanges();
  
  expect(component.users.length).toBe(3);
}));
```

### Test Performance Issues

#### Problem: Tests running slowly
```bash
# Run tests with more detailed output
ng test --code-coverage --source-map=false

# Run specific test file
ng test --include='**/*user*.spec.ts'

# Run in headless mode
ng test --browsers=ChromeHeadless --watch=false

# Increase memory for large test suites
node --max-old-space-size=8192 ./node_modules/@angular/cli/bin/ng test
```

## ⚡ Performance Problems

### Bundle Size Issues

#### Problem: Large bundle sizes
```bash
# Analyze bundle size
ng build --stats-json
npx webpack-bundle-analyzer dist/angular-team-project/stats.json

# Check for large dependencies
npm ls --depth=0 --long

# Remove unused dependencies
npm uninstall unused-package
```

#### Problem: Slow initial load times
```typescript
// ✅ Implement lazy loading
const routes: Routes = [
  {
    path: 'feature',
    loadChildren: () => import('./feature/feature.module').then(m => m.FeatureModule)
  }
];

// ✅ Use OnPush change detection
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush
})

// ✅ Implement virtual scrolling for large lists
<cdk-virtual-scroll-viewport itemSize="50" class="example-viewport">
  <div *cdkVirtualFor="let item of items">{{item}}</div>
</cdk-virtual-scroll-viewport>
```

### Runtime Performance Issues

#### Problem: Slow change detection
```typescript
// ❌ Heavy computation in templates
{{ expensiveFunction() }}

// ✅ Use pure pipes
@Pipe({ name: 'expensiveTransform', pure: true })
export class ExpensiveTransformPipe implements PipeTransform {
  transform(value: any): any {
    // Expensive computation
    return result;
  }
}

// ✅ Or memoize results
private cache = new Map();

get expensiveValue() {
  if (!this.cache.has(this.inputValue)) {
    this.cache.set(this.inputValue, this.expensiveFunction(this.inputValue));
  }
  return this.cache.get(this.inputValue);
}
```

## 🚀 Deployment Issues

### Build Deployment Failures

#### Problem: Build succeeds locally but fails in CI
```bash
# Check Node.js versions match
# In package.json
{
  "engines": {
    "node": ">=20.0.0",
    "npm": ">=10.0.0"
  }
}

# In GitHub Actions
- uses: actions/setup-node@v4
  with:
    node-version: '20'
    
# Clear CI cache
# GitHub Actions: delete .github/workflows cache
# Or in workflow:
- name: Clear npm cache
  run: npm cache clean --force
```

#### Problem: Environment-specific build failures
```bash
# Check environment configuration
ng build --configuration=production --verbose

# Verify environment files exist
ls src/environments/

# Check for environment-specific imports
grep -r "environment" src/
```

### Runtime Deployment Issues

#### Problem: "Module not found" errors in production
```typescript
// ❌ Case-sensitive import issues
import { UserService } from './UserService'; // Wrong case

// ✅ Use correct casing
import { UserService } from './user.service';

// ✅ Configure case-sensitive imports in tsconfig.json
{
  "compilerOptions": {
    "forceConsistentCasingInFileNames": true
  }
}
```

#### Problem: Assets not loading in production
```typescript
// ❌ Hardcoded asset paths
const imagePath = '/assets/images/logo.png'; // May not work with base href

// ✅ Use Angular asset handling
constructor(private document: Document) {
  const imagePath = `${this.document.location.origin}/assets/images/logo.png`;
}

// ✅ Or configure base href in index.html
<base href="/my-app/">
```

## 🌐 Browser-Specific Issues

### Internet Explorer/Edge Legacy Issues

#### Problem: ES6+ features not working
```typescript
// ❌ Using modern JavaScript features
const users = [...this.allUsers]; // Spread operator
const user = this.users.find(u => u.id === id); // Arrow functions

// ✅ Enable polyfills in polyfills.ts
import 'core-js/es6/symbol';
import 'core-js/es6/object';
import 'core-js/es6/function';
import 'core-js/es6/parse-int';
import 'core-js/es6/parse-float';
import 'core-js/es6/number';
import 'core-js/es6/math';
import 'core-js/es6/string';
import 'core-js/es6/date';
import 'core-js/es6/array';
import 'core-js/es6/regexp';
import 'core-js/es6/map';
import 'core-js/es6/weak-map';
import 'core-js/es6/set';
```

### Safari-Specific Issues

#### Problem: Date parsing issues
```typescript
// ❌ Safari doesn't parse ISO dates the same way
const date = new Date('2024-01-01 10:00:00'); // May fail in Safari

// ✅ Use ISO format or parse manually
const date = new Date('2024-01-01T10:00:00.000Z');
// Or
const date = new Date(2024, 0, 1, 10, 0, 0); // Year, month-1, day, hour, minute, second
```

### Mobile Browser Issues

#### Problem: Touch events not working
```typescript
// ✅ Add touch event listeners
@HostListener('touchstart', ['$event'])
onTouchStart(event: TouchEvent) {
  // Handle touch start
}

// ✅ Or use Angular CDK
import { CdkDrag } from '@angular/cdk/drag-drop';
```

## 🔌 Third-Party Integration Issues

### HTTP Client Issues

#### Problem: HTTP requests failing silently
```typescript
// ❌ Not handling errors
this.http.get('/api/users').subscribe(users => {
  this.users = users;
});

// ✅ Proper error handling
this.http.get('/api/users').subscribe({
  next: users => this.users = users,
  error: error => {
    console.error('Failed to load users:', error);
    this.handleError(error);
  }
});

// ✅ Or use RxJS operators
this.http.get('/api/users').pipe(
  catchError(error => {
    console.error('Failed to load users:', error);
    return of([]); // Return fallback data
  })
).subscribe(users => this.users = users);
```

### External Library Integration

#### Problem: Library types not found
```bash
# Install type definitions
npm install --save-dev @types/library-name

# If types don't exist, create declaration file
# Create typings.d.ts in src/
declare module 'library-name' {
  export function functionName(): any;
}
```

## 📞 Getting Help

### Debugging Tools

#### Browser Developer Tools
```bash
# Console debugging
console.log('Debug info:', data);
console.error('Error:', error);
console.table(arrayData);

# Network tab for HTTP requests
# Performance tab for performance issues
# Angular DevTools extension for Angular-specific debugging
```

#### Angular Debugging
```typescript
// Enable debug mode
import { isDevMode } from '@angular/core';

if (isDevMode()) {
  console.log('Debug mode enabled');
}

// Angular DevTools browser extension
// ng.getComponent($0) in console to inspect selected element
// ng.getContext($0) to get component context
```

### Logging and Monitoring

#### Application Logging
```typescript
@Injectable({
  providedIn: 'root'
})
export class LoggerService {
  debug(message: string, ...args: any[]): void {
    if (!environment.production) {
      console.log(`[DEBUG] ${message}`, ...args);
    }
  }
  
  error(message: string, error?: any): void {
    console.error(`[ERROR] ${message}`, error);
    // Send to monitoring service in production
  }
}
```

### Team Support Channels

#### Internal Support
- **Slack**: #angular-team-help
- **Email**: dev-team@company.com
- **Weekly Office Hours**: Fridays 3-4 PM

#### External Resources
- **Angular Documentation**: https://angular.io/docs
- **Stack Overflow**: Tag questions with `angular` and `typescript`
- **Angular GitHub Issues**: https://github.com/angular/angular/issues
- **Angular Discord**: https://discord.gg/angular

### Escalation Process

1. **Self-help**: Check this guide and documentation
2. **Pair programming**: Work with a teammate
3. **Team discussion**: Post in team Slack channel
4. **Tech lead review**: Escalate to technical lead
5. **External help**: Stack Overflow or Angular community

### Creating Bug Reports

When reporting issues:

```markdown
**Environment:**
- Angular version: 20.1.0
- Node.js version: 20.19.4
- OS: macOS 14.0
- Browser: Chrome 120.0

**Steps to Reproduce:**
1. Navigate to user profile page
2. Click edit button
3. Submit form with invalid data

**Expected Behavior:**
Form should show validation errors

**Actual Behavior:**
Form submits with invalid data

**Error Messages:**
[Include console errors, build errors, etc.]

**Code Samples:**
[Include relevant code snippets]
```

---

This troubleshooting guide should be regularly updated as new issues are discovered and resolved. Team members are encouraged to contribute solutions for problems they encounter.