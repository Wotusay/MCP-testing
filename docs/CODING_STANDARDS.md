# Coding Standards

This document outlines the coding standards and best practices for the Angular Team Project.

## 📋 Table of Contents

- [General Principles](#general-principles)
- [TypeScript Standards](#typescript-standards)
- [Angular Standards](#angular-standards)
- [HTML/Template Standards](#htmltemplate-standards)
- [CSS/Styling Standards](#cssstyling-standards)
- [Testing Standards](#testing-standards)
- [Documentation Standards](#documentation-standards)
- [File Organization](#file-organization)

## 🎯 General Principles

### Code Quality
- **Readability** over cleverness
- **Consistency** across the codebase
- **Maintainability** for long-term development
- **Performance** considerations in critical paths
- **Accessibility** as a first-class concern

### Best Practices
- Follow **DRY** (Don't Repeat Yourself) principle
- Use **SOLID** principles for class design
- Prefer **composition** over inheritance
- Write **self-documenting** code
- Handle **errors** gracefully

## 🔧 TypeScript Standards

### Type Safety
```typescript
// ✅ Good - Explicit types
interface User {
  readonly id: number;
  name: string;
  email: string;
  createdAt: Date;
}

function createUser(userData: Omit<User, 'id' | 'createdAt'>): User {
  return {
    id: Date.now(),
    ...userData,
    createdAt: new Date()
  };
}

// ❌ Bad - Any types
function createUser(userData: any): any {
  return { id: Date.now(), ...userData };
}
```

### Variable Declarations
```typescript
// ✅ Good - const for immutable, let for mutable
const API_URL = 'https://api.example.com';
let currentUser: User | null = null;

// ❌ Bad - var usage
var userName = 'John';
```

### Function Declarations
```typescript
// ✅ Good - Arrow functions for simple operations
const users = userList.filter(user => user.isActive);
const formatName = (name: string): string => name.toUpperCase();

// ✅ Good - Regular functions for complex operations
function calculateUserStats(users: User[]): UserStats {
  // Complex calculation logic
  return {
    totalUsers: users.length,
    activeUsers: users.filter(u => u.isActive).length
  };
}
```

### Interfaces and Types
```typescript
// ✅ Good - Interface for object shapes
interface ApiResponse<T> {
  readonly data: T;
  readonly status: number;
  readonly message: string;
}

// ✅ Good - Type for unions and primitives
type Status = 'pending' | 'success' | 'error';
type UserId = string;

// ✅ Good - Generic constraints
interface Repository<T extends { id: string }> {
  findById(id: string): Promise<T | null>;
  save(entity: T): Promise<T>;
}
```

### Error Handling
```typescript
// ✅ Good - Proper error handling
async function fetchUser(id: string): Promise<User> {
  try {
    const response = await this.http.get<ApiResponse<User>>(`/users/${id}`);
    
    if (!response.data) {
      throw new Error(`User with id ${id} not found`);
    }
    
    return response.data;
  } catch (error) {
    this.logger.error('Failed to fetch user', { id, error });
    throw new UserFetchError(`Unable to fetch user: ${error.message}`);
  }
}
```

## 🅰️ Angular Standards

### Component Structure
```typescript
// ✅ Good - Component structure
@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonComponent],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserProfileComponent implements OnInit, OnDestroy {
  // 1. Public properties (inputs)
  @Input() user!: User;
  @Input() readonly = false;
  
  // 2. Output events
  @Output() userUpdated = new EventEmitter<User>();
  @Output() userDeleted = new EventEmitter<string>();
  
  // 3. ViewChild/ContentChild
  @ViewChild('userForm') userForm!: ElementRef;
  
  // 4. Public properties
  userForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]]
  });
  
  // 5. Private properties
  private readonly destroy$ = new Subject<void>();
  
  // 6. Constructor
  constructor(
    private readonly fb: FormBuilder,
    private readonly userService: UserService,
    private readonly cdr: ChangeDetectorRef
  ) {}
  
  // 7. Lifecycle hooks
  ngOnInit(): void {
    this.initializeForm();
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  // 8. Public methods
  onSubmit(): void {
    if (this.userForm.valid) {
      this.updateUser();
    }
  }
  
  // 9. Private methods
  private initializeForm(): void {
    // Implementation
  }
  
  private updateUser(): void {
    // Implementation
  }
}
```

### Service Structure
```typescript
// ✅ Good - Service structure
@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly apiUrl = environment.apiUrl;
  private readonly usersSubject = new BehaviorSubject<User[]>([]);
  
  readonly users$ = this.usersSubject.asObservable();
  
  constructor(
    private readonly http: HttpClient,
    private readonly logger: LoggerService
  ) {}
  
  getUsers(): Observable<User[]> {
    return this.http.get<ApiResponse<User[]>>(`${this.apiUrl}/users`).pipe(
      map(response => response.data),
      tap(users => this.usersSubject.next(users)),
      catchError(error => this.handleError('getUsers', error))
    );
  }
  
  private handleError(operation: string, error: any): Observable<never> {
    this.logger.error(`${operation} failed`, error);
    return throwError(() => new Error(`${operation} failed: ${error.message}`));
  }
}
```

### Reactive Programming
```typescript
// ✅ Good - RxJS patterns
@Component({
  // ...
})
export class UserListComponent implements OnInit {
  readonly users$ = this.userService.users$;
  readonly loading$ = new BehaviorSubject<boolean>(false);
  readonly error$ = new BehaviorSubject<string | null>(null);
  
  readonly vm$ = combineLatest([
    this.users$,
    this.loading$,
    this.error$
  ]).pipe(
    map(([users, loading, error]) => ({ users, loading, error }))
  );
  
  searchTerm$ = new BehaviorSubject<string>('');
  
  filteredUsers$ = combineLatest([
    this.users$,
    this.searchTerm$
  ]).pipe(
    map(([users, term]) => 
      users.filter(user => 
        user.name.toLowerCase().includes(term.toLowerCase())
      )
    )
  );
}
```

## 🏷️ HTML/Template Standards

### Component Templates
```html
<!-- ✅ Good - Clean template structure -->
<div class="user-profile">
  <header class="user-profile__header">
    <h1 class="user-profile__title">{{ user.name }}</h1>
    <app-status-badge 
      [text]="user.status" 
      [variant]="getStatusVariant(user.status)">
    </app-status-badge>
  </header>
  
  <form 
    [formGroup]="userForm" 
    (ngSubmit)="onSubmit()"
    class="user-profile__form">
    
    <div class="form-group">
      <label for="name" class="form-label">Name</label>
      <input
        id="name"
        type="text"
        formControlName="name"
        class="form-input"
        [class.form-input--error]="nameControl.invalid && nameControl.touched"
        aria-describedby="name-error">
      
      @if (nameControl.invalid && nameControl.touched) {
        <div id="name-error" class="form-error" role="alert">
          Name is required
        </div>
      }
    </div>
    
    <div class="form-actions">
      <app-button
        type="submit"
        text="Save Changes"
        variant="primary"
        [disabled]="userForm.invalid || loading"
        (buttonClick)="onSubmit()">
      </app-button>
    </div>
  </form>
</div>
```

### Accessibility
```html
<!-- ✅ Good - Accessible markup -->
<button
  type="button"
  class="btn btn--primary"
  [attr.aria-expanded]="isExpanded"
  [attr.aria-controls]="menuId"
  (click)="toggle()">
  Menu
</button>

<ul
  [id]="menuId"
  role="menu"
  [hidden]="!isExpanded"
  class="dropdown-menu">
  <li role="menuitem">
    <a href="/profile" class="dropdown-link">Profile</a>
  </li>
</ul>
```

## 🎨 CSS/Styling Standards

### Tailwind CSS Usage
```html
<!-- ✅ Good - Utility classes with logical grouping -->
<div class="
  flex flex-col gap-4 p-6
  bg-white rounded-lg shadow-md
  border border-gray-200
  hover:shadow-lg transition-shadow
">
  <h2 class="text-xl font-semibold text-gray-900">
    Card Title
  </h2>
  <p class="text-gray-600 leading-relaxed">
    Card content goes here
  </p>
</div>

<!-- ❌ Bad - Too many utility classes without organization -->
<div class="flex flex-col gap-4 p-6 bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-200 ease-in-out">
```

### Custom CSS (when needed)
```css
/* ✅ Good - BEM methodology */
.user-card {
  @apply bg-white rounded-lg shadow-md p-6;
}

.user-card__header {
  @apply flex items-center justify-between mb-4;
}

.user-card__title {
  @apply text-xl font-semibold text-gray-900;
}

.user-card--featured {
  @apply ring-2 ring-blue-500;
}

/* ❌ Bad - Nested selectors and unclear naming */
.card .header .title {
  font-size: 1.25rem;
  color: #111;
}
```

### Responsive Design
```html
<!-- ✅ Good - Mobile-first responsive design -->
<div class="
  grid grid-cols-1 gap-4
  md:grid-cols-2 md:gap-6
  lg:grid-cols-3 lg:gap-8
">
  <!-- Grid items -->
</div>

<!-- ✅ Good - Responsive typography -->
<h1 class="
  text-2xl font-bold
  md:text-3xl
  lg:text-4xl
">
  Responsive Heading
</h1>
```

## 🧪 Testing Standards

### Unit Test Structure
```typescript
// ✅ Good - Comprehensive test structure
describe('UserService', () => {
  let service: UserService;
  let httpMock: jasmine.SpyObj<HttpClient>;
  let loggerMock: jasmine.SpyObj<LoggerService>;

  beforeEach(() => {
    const httpSpy = jasmine.createSpyObj('HttpClient', ['get', 'post', 'put', 'delete']);
    const loggerSpy = jasmine.createSpyObj('LoggerService', ['error', 'info']);

    TestBed.configureTestingModule({
      providers: [
        UserService,
        { provide: HttpClient, useValue: httpSpy },
        { provide: LoggerService, useValue: loggerSpy }
      ]
    });

    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpClient) as jasmine.SpyObj<HttpClient>;
    loggerMock = TestBed.inject(LoggerService) as jasmine.SpyObj<LoggerService>;
  });

  describe('getUsers', () => {
    it('should fetch users successfully', () => {
      // Arrange
      const mockUsers: User[] = [
        { id: '1', name: 'John Doe', email: 'john@example.com' }
      ];
      const mockResponse: ApiResponse<User[]> = {
        data: mockUsers,
        status: 200,
        message: 'Success'
      };
      httpMock.get.and.returnValue(of(mockResponse));

      // Act
      const result$ = service.getUsers();

      // Assert
      result$.subscribe(users => {
        expect(users).toEqual(mockUsers);
        expect(httpMock.get).toHaveBeenCalledWith('http://api.example.com/users');
      });
    });

    it('should handle error when fetching users fails', () => {
      // Arrange
      const errorMessage = 'Network error';
      httpMock.get.and.returnValue(throwError(() => new Error(errorMessage)));

      // Act
      const result$ = service.getUsers();

      // Assert
      result$.subscribe({
        error: (error) => {
          expect(error.message).toContain('getUsers failed');
          expect(loggerMock.error).toHaveBeenCalled();
        }
      });
    });
  });
});
```

### Component Testing
```typescript
describe('UserProfileComponent', () => {
  let component: UserProfileComponent;
  let fixture: ComponentFixture<UserProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserProfileComponent, ReactiveFormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(UserProfileComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display user name', () => {
    // Arrange
    const user: User = { id: '1', name: 'John Doe', email: 'john@example.com' };
    component.user = user;

    // Act
    fixture.detectChanges();

    // Assert
    const nameElement = fixture.debugElement.query(By.css('.user-profile__title'));
    expect(nameElement.nativeElement.textContent).toContain('John Doe');
  });
});
```

## 📝 Documentation Standards

### Code Comments
```typescript
// ✅ Good - Meaningful comments for complex logic
/**
 * Calculates the user's subscription expiry date based on their plan and usage.
 * 
 * @param user - The user object containing subscription details
 * @param plan - The subscription plan with duration and features
 * @returns The calculated expiry date
 * 
 * @example
 * ```typescript
 * const user = { subscriptionStart: new Date('2024-01-01') };
 * const plan = { duration: 12, type: 'monthly' };
 * const expiryDate = calculateSubscriptionExpiry(user, plan);
 * ```
 */
function calculateSubscriptionExpiry(user: User, plan: SubscriptionPlan): Date {
  // Complex calculation logic that needs explanation
  const baseDate = user.subscriptionStart || new Date();
  const monthsToAdd = plan.duration * (plan.type === 'yearly' ? 12 : 1);
  
  return addMonths(baseDate, monthsToAdd);
}

// ❌ Bad - Obvious or redundant comments
// Set the user name
user.name = 'John';

// Increment counter by 1
counter++;
```

### Interface Documentation
```typescript
/**
 * Represents a user in the system with authentication and profile information.
 */
interface User {
  /** Unique identifier for the user */
  readonly id: string;
  
  /** User's display name */
  name: string;
  
  /** User's email address (must be unique) */
  email: string;
  
  /** Whether the user account is currently active */
  isActive: boolean;
  
  /** Date when the user account was created */
  readonly createdAt: Date;
  
  /** Optional user profile picture URL */
  avatarUrl?: string;
}
```

## 📁 File Organization

### Directory Structure
```
src/app/
├── core/                    # Singleton services, guards, interceptors
│   ├── auth/               # Authentication services
│   ├── guards/             # Route guards
│   ├── interceptors/       # HTTP interceptors
│   └── services/           # Core services
├── shared/                 # Shared components, pipes, directives
│   ├── components/         # Reusable UI components
│   ├── pipes/              # Custom pipes
│   ├── directives/         # Custom directives
│   └── models/             # Shared interfaces and types
├── features/               # Feature modules
│   ├── user-management/    # User-related features
│   ├── dashboard/          # Dashboard features
│   └── settings/           # Settings features
└── layout/                 # Layout components
    ├── header/             # Header component
    ├── sidebar/            # Sidebar component
    └── footer/             # Footer component
```

### File Naming
```
// ✅ Good - Descriptive, kebab-case names
user-profile.component.ts
user-profile.component.html
user-profile.component.css
user-profile.component.spec.ts

authentication.service.ts
authentication.service.spec.ts

email-validator.pipe.ts
email-validator.pipe.spec.ts

// ❌ Bad - Unclear or inconsistent naming
userComp.ts
auth_service.ts
validator.pipe.ts
```

## 🔍 Code Review Checklist

### Before Submitting
- [ ] Code follows TypeScript strict mode
- [ ] All functions have proper type annotations
- [ ] Error handling is implemented
- [ ] Tests are written and passing
- [ ] Code is formatted with Prettier
- [ ] ESLint checks pass
- [ ] Documentation is updated

### During Review
- [ ] Code is readable and maintainable
- [ ] Logic is sound and efficient
- [ ] Edge cases are handled
- [ ] Security considerations addressed
- [ ] Accessibility requirements met
- [ ] Performance implications considered

## 🛠️ Tools and Configuration

### VS Code Extensions
- Angular Language Service
- ESLint
- Prettier
- TypeScript Importer
- Auto Rename Tag
- Bracket Pair Colorizer

### ESLint Configuration
The project uses a comprehensive ESLint configuration with:
- Angular-specific rules
- TypeScript rules
- RxJS rules
- Accessibility rules
- Import/export rules

### Prettier Configuration
Consistent code formatting with:
- 2-space indentation
- Single quotes for strings
- Trailing commas
- Line length limit of 120 characters

---

These standards help maintain code quality, consistency, and team productivity. They should be regularly reviewed and updated as the project evolves.