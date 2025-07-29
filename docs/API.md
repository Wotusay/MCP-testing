# API Documentation

This document outlines the API structure, endpoints, and integration patterns for the Angular Team Project.

## 📋 Table of Contents

- [API Overview](#api-overview)
- [Authentication](#authentication)
- [Endpoints](#endpoints)
- [Data Models](#data-models)
- [Error Handling](#error-handling)
- [Rate Limiting](#rate-limiting)
- [Versioning](#versioning)
- [Testing APIs](#testing-apis)
- [SDK Usage](#sdk-usage)

## 🏗️ API Overview

### Base URL
- **Development**: `http://localhost:3000/api`
- **Staging**: `https://staging-api.example.com/api`
- **Production**: `https://api.example.com/api`

### API Architecture
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Angular App   │───▶│   HTTP Client   │───▶│   Backend API   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  Service Layer  │    │  Interceptors   │    │   Database      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Technologies
- **Protocol**: REST over HTTPS
- **Data Format**: JSON
- **Authentication**: JWT Bearer tokens
- **Documentation**: OpenAPI 3.0 (Swagger)

## 🔐 Authentication

### JWT Token Flow

```typescript
// Authentication service
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenSubject = new BehaviorSubject<string | null>(null);
  
  login(credentials: LoginCredentials): Observable<AuthResponse> {
    return this.http.post<AuthResponse>('/auth/login', credentials).pipe(
      tap(response => {
        this.setToken(response.accessToken);
      })
    );
  }
  
  private setToken(token: string): void {
    localStorage.setItem('access_token', token);
    this.tokenSubject.next(token);
  }
  
  getToken(): string | null {
    return localStorage.getItem('access_token');
  }
  
  logout(): void {
    localStorage.removeItem('access_token');
    this.tokenSubject.next(null);
  }
}
```

### HTTP Interceptor

```typescript
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}
  
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.getToken();
    
    if (token) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }
    
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          this.authService.logout();
          // Redirect to login
        }
        return throwError(() => error);
      })
    );
  }
}
```

## 🎯 Endpoints

### Authentication Endpoints

#### POST /auth/login
Authenticate user and receive JWT token.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "user"
  },
  "expiresIn": 3600
}
```

#### POST /auth/refresh
Refresh expired JWT token.

**Request:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### POST /auth/logout
Invalidate current session.

**Headers:**
```
Authorization: Bearer <access_token>
```

### User Management Endpoints

#### GET /users
Retrieve list of users with pagination.

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10, max: 100)
- `search` (string): Search term for name/email
- `role` (string): Filter by user role
- `status` (string): Filter by user status

**Example:**
```
GET /users?page=1&limit=20&search=john&role=admin
```

**Response:**
```json
{
  "data": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "email": "john.doe@example.com",
      "name": "John Doe",
      "role": "admin",
      "status": "active",
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-07-29T14:20:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8,
    "hasNext": true,
    "hasPrev": false
  },
  "meta": {
    "timestamp": "2024-07-29T15:30:00Z",
    "requestId": "req_123456789"
  }
}
```

#### GET /users/:id
Retrieve specific user by ID.

**Response:**
```json
{
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "email": "john.doe@example.com",
    "name": "John Doe",
    "role": "admin",
    "status": "active",
    "profile": {
      "avatar": "https://example.com/avatars/john.jpg",
      "bio": "Senior developer with 10 years experience",
      "location": "San Francisco, CA"
    },
    "preferences": {
      "theme": "dark",
      "notifications": true,
      "language": "en"
    },
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-07-29T14:20:00Z"
  }
}
```

#### POST /users
Create new user.

**Request:**
```json
{
  "email": "jane.smith@example.com",
  "name": "Jane Smith",
  "password": "securePassword123",
  "role": "user"
}
```

#### PUT /users/:id
Update existing user.

**Request:**
```json
{
  "name": "Jane Smith Updated",
  "role": "admin",
  "profile": {
    "bio": "Updated bio information"
  }
}
```

#### DELETE /users/:id
Delete user (soft delete).

**Response:**
```json
{
  "message": "User deleted successfully",
  "deletedAt": "2024-07-29T15:30:00Z"
}
```

### Health and Status Endpoints

#### GET /health
Health check endpoint for monitoring.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-07-29T15:30:00Z",
  "version": "1.0.0",
  "uptime": 86400,
  "checks": {
    "database": "healthy",
    "cache": "healthy",
    "external_api": "healthy"
  }
}
```

#### GET /status
Detailed status information.

**Response:**
```json
{
  "application": {
    "name": "Angular Team Project API",
    "version": "1.0.0",
    "environment": "production"
  },
  "system": {
    "uptime": 86400,
    "memory": {
      "used": "256MB",
      "total": "1GB"
    },
    "cpu": {
      "usage": "25%"
    }
  },
  "database": {
    "status": "connected",
    "connections": 5,
    "maxConnections": 100
  }
}
```

## 📊 Data Models

### User Model

```typescript
interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user' | 'moderator';
  status: 'active' | 'inactive' | 'suspended';
  profile?: UserProfile;
  preferences?: UserPreferences;
  createdAt: string; // ISO 8601 date
  updatedAt: string; // ISO 8601 date
}

interface UserProfile {
  avatar?: string;
  bio?: string;
  location?: string;
  website?: string;
  socialLinks?: {
    twitter?: string;
    linkedin?: string;
    github?: string;
  };
}

interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string; // ISO 639-1 code
  timezone?: string; // IANA timezone
}
```

### API Response Models

```typescript
interface ApiResponse<T> {
  data: T;
  meta?: {
    timestamp: string;
    requestId: string;
    version?: string;
  };
}

interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

interface ErrorResponse {
  error: {
    code: string;
    message: string;
    details?: any;
    timestamp: string;
    requestId: string;
  };
}
```

### Authentication Models

```typescript
interface LoginCredentials {
  email: string;
  password: string;
}

interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
  expiresIn: number; // seconds
}

interface RefreshTokenRequest {
  refreshToken: string;
}
```

## ❌ Error Handling

### Error Response Format

All API errors follow a consistent format:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "The request data is invalid",
    "details": {
      "field": "email",
      "reason": "Email format is invalid"
    },
    "timestamp": "2024-07-29T15:30:00Z",
    "requestId": "req_123456789"
  }
}
```

### HTTP Status Codes

| Status Code | Description | Usage |
|-------------|-------------|-------|
| 200 | OK | Successful GET, PUT requests |
| 201 | Created | Successful POST requests |
| 204 | No Content | Successful DELETE requests |
| 400 | Bad Request | Invalid request data |
| 401 | Unauthorized | Missing or invalid authentication |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource not found |
| 422 | Unprocessable Entity | Validation errors |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server errors |

### Error Handling in Angular

```typescript
@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private http: HttpClient) {}
  
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An error occurred';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Client Error: ${error.error.message}`;
    } else {
      // Server-side error
      const serverError = error.error as ErrorResponse;
      errorMessage = serverError.error.message || `Server Error: ${error.status}`;
    }
    
    console.error('API Error:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
  
  getUsers(): Observable<User[]> {
    return this.http.get<ApiResponse<User[]>>('/users').pipe(
      map(response => response.data),
      catchError(this.handleError)
    );
  }
}
```

## 🚦 Rate Limiting

### Rate Limits

- **Authentication endpoints**: 5 requests per minute per IP
- **User endpoints**: 100 requests per minute per user
- **Health endpoints**: 1000 requests per minute per IP

### Rate Limit Headers

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1627846261
X-RateLimit-RetryAfter: 60
```

### Handling Rate Limits

```typescript
@Injectable()
export class RateLimitInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 429) {
          const retryAfter = error.headers.get('X-RateLimit-RetryAfter');
          const retryDelay = retryAfter ? parseInt(retryAfter) * 1000 : 60000;
          
          return timer(retryDelay).pipe(
            switchMap(() => next.handle(req))
          );
        }
        return throwError(() => error);
      })
    );
  }
}
```

## 📚 Versioning

### URL Versioning

```
GET /api/v1/users
GET /api/v2/users
```

### Header Versioning

```
GET /api/users
Accept: application/vnd.api+json;version=1
```

### Version Support Policy

- **Current version**: v1.0 (fully supported)
- **Previous version**: v0.9 (security updates only)
- **Deprecated versions**: v0.8 and below (no support)

## 🧪 Testing APIs

### Unit Testing Services

```typescript
describe('UserService', () => {
  let service: UserService;
  let httpMock: jasmine.SpyObj<HttpClient>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('HttpClient', ['get', 'post', 'put', 'delete']);
    
    TestBed.configureTestingModule({
      providers: [
        UserService,
        { provide: HttpClient, useValue: spy }
      ]
    });
    
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpClient) as jasmine.SpyObj<HttpClient>;
  });

  it('should fetch users', () => {
    const mockResponse: ApiResponse<User[]> = {
      data: [
        { id: '1', name: 'John', email: 'john@example.com', role: 'user', status: 'active', createdAt: '2024-01-01', updatedAt: '2024-01-01' }
      ]
    };
    
    httpMock.get.and.returnValue(of(mockResponse));
    
    service.getUsers().subscribe(users => {
      expect(users).toEqual(mockResponse.data);
      expect(httpMock.get).toHaveBeenCalledWith('/users');
    });
  });
});
```

### Integration Testing

```typescript
// Mock backend for testing
export class MockApiService {
  private users: User[] = [
    { id: '1', name: 'John Doe', email: 'john@example.com', role: 'user', status: 'active', createdAt: '2024-01-01', updatedAt: '2024-01-01' }
  ];
  
  getUsers(): Observable<User[]> {
    return of(this.users).pipe(delay(100)); // Simulate network delay
  }
  
  createUser(user: Partial<User>): Observable<User> {
    const newUser: User = {
      id: Date.now().toString(),
      role: 'user',
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...user
    } as User;
    
    this.users.push(newUser);
    return of(newUser).pipe(delay(100));
  }
}
```

### API Testing Tools

#### Postman Collection

```json
{
  "info": {
    "name": "Angular Team Project API",
    "description": "API collection for development and testing"
  },
  "auth": {
    "type": "bearer",
    "bearer": [
      {
        "key": "token",
        "value": "{{access_token}}"
      }
    ]
  },
  "variable": [
    {
      "key": "base_url",
      "value": "http://localhost:3000/api"
    }
  ]
}
```

#### Environment Variables

```json
{
  "development": {
    "base_url": "http://localhost:3000/api",
    "access_token": "dev_token_123"
  },
  "staging": {
    "base_url": "https://staging-api.example.com/api",
    "access_token": "{{staging_token}}"
  },
  "production": {
    "base_url": "https://api.example.com/api",
    "access_token": "{{prod_token}}"
  }
}
```

## 🛠️ SDK Usage

### Service Factory Pattern

```typescript
@Injectable({
  providedIn: 'root'
})
export class ApiServiceFactory {
  constructor(private http: HttpClient) {}
  
  createUserService(): UserApiService {
    return new UserApiService(this.http);
  }
  
  createAuthService(): AuthApiService {
    return new AuthApiService(this.http);
  }
}

// Usage in components
constructor(private apiFactory: ApiServiceFactory) {
  this.userService = this.apiFactory.createUserService();
}
```

### Generic Repository Pattern

```typescript
export abstract class BaseApiService<T extends { id: string }> {
  protected abstract resourcePath: string;
  
  constructor(protected http: HttpClient) {}
  
  getAll(params?: any): Observable<T[]> {
    return this.http.get<ApiResponse<T[]>>(this.resourcePath, { params }).pipe(
      map(response => response.data)
    );
  }
  
  getById(id: string): Observable<T> {
    return this.http.get<ApiResponse<T>>(`${this.resourcePath}/${id}`).pipe(
      map(response => response.data)
    );
  }
  
  create(item: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Observable<T> {
    return this.http.post<ApiResponse<T>>(this.resourcePath, item).pipe(
      map(response => response.data)
    );
  }
  
  update(id: string, item: Partial<T>): Observable<T> {
    return this.http.put<ApiResponse<T>>(`${this.resourcePath}/${id}`, item).pipe(
      map(response => response.data)
    );
  }
  
  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.resourcePath}/${id}`);
  }
}

// Specific service implementation
@Injectable({
  providedIn: 'root'
})
export class UserApiService extends BaseApiService<User> {
  protected resourcePath = '/users';
  
  constructor(http: HttpClient) {
    super(http);
  }
  
  // Additional user-specific methods
  searchUsers(query: string): Observable<User[]> {
    return this.getAll({ search: query });
  }
}
```

## 📖 Documentation Tools

### OpenAPI/Swagger Integration

When the backend provides OpenAPI documentation:

```typescript
// Generate TypeScript interfaces from OpenAPI spec
// Using @openapitools/openapi-generator-cli

// package.json scripts
{
  "scripts": {
    "generate-api": "openapi-generator-cli generate -i http://localhost:3000/api/docs/json -g typescript-angular -o src/app/generated-api"
  }
}
```

### API Documentation Site

For team reference, consider using:
- **Swagger UI**: Interactive API documentation
- **Redoc**: Clean, responsive API docs
- **Insomnia**: API testing and documentation
- **Bruno**: Open-source API client

---

This API documentation should be updated as new endpoints are added or existing ones are modified. Keep it synchronized with the actual backend implementation.