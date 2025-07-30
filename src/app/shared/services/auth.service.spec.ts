import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { AuthenticationService } from './auth.service';
import { LoggingService } from './logging.service';
import { ErrorHandlingService } from './error-handling.service';
import { AuthUser, AuthTokens, LoginCredentials } from '../models/auth.models';
import { AppError } from '../models/error.models';

describe('AuthenticationService', () => {
  let service: AuthenticationService;
  let httpMock: HttpTestingController;
  let routerSpy: jasmine.SpyObj<Router>;
  let loggerSpy: jasmine.SpyObj<LoggingService>;
  let errorHandlerSpy: jasmine.SpyObj<ErrorHandlingService>;

  const mockUser: AuthUser = {
    id: '1',
    email: 'test@example.com',
    name: 'Test User',
    roles: ['user'],
    permissions: ['read'],
    isEmailVerified: true,
  };

  const mockTokens: AuthTokens = {
    accessToken: 'access-token',
    refreshToken: 'refresh-token',
    expiresAt: Date.now() + 3600000, // 1 hour from now
    tokenType: 'Bearer',
  };

  beforeEach(() => {
    const routerSpyObj = jasmine.createSpyObj('Router', [
      'navigate',
      'createUrlTree',
    ]);
    const loggerSpyObj = jasmine.createSpyObj('LoggingService', [
      'info',
      'warn',
      'error',
      'debug',
      'logUserActivity',
    ]);
    const errorHandlerSpyObj = jasmine.createSpyObj('ErrorHandlingService', [
      'handleError',
    ]);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        provideZonelessChangeDetection(),
        AuthenticationService,
        { provide: Router, useValue: routerSpyObj },
        { provide: LoggingService, useValue: loggerSpyObj },
        { provide: ErrorHandlingService, useValue: errorHandlerSpyObj },
      ],
    });

    service = TestBed.inject(AuthenticationService);
    httpMock = TestBed.inject(HttpTestingController);
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    loggerSpy = TestBed.inject(
      LoggingService,
    ) as jasmine.SpyObj<LoggingService>;
    errorHandlerSpy = TestBed.inject(
      ErrorHandlingService,
    ) as jasmine.SpyObj<ErrorHandlingService>;

    // Clear localStorage before each test
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should start as unauthenticated', () => {
    expect(service.isAuthenticated()).toBe(false);
    expect(service.user()).toBeNull();
    expect(service.status()).toBe('unauthenticated');
  });

  it('should login successfully', () => {
    const credentials: LoginCredentials = {
      email: 'test@example.com',
      password: 'password',
    };

    service.login(credentials).subscribe((user) => {
      expect(user).toEqual(mockUser);
      expect(service.isAuthenticated()).toBe(true);
      expect(service.user()).toEqual(mockUser);
    });

    const req = httpMock.expectOne('/api/auth/login');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(credentials);

    req.flush({ user: mockUser, tokens: mockTokens });

    expect(loggerSpy.info).toHaveBeenCalledWith('Login attempt', {
      email: credentials.email,
    });
    expect(loggerSpy.logUserActivity).toHaveBeenCalledWith('login', {
      userId: mockUser.id,
    });
  });

  it('should handle login errors', () => {
    const credentials: LoginCredentials = {
      email: 'test@example.com',
      password: 'wrong-password',
    };

    const mockError = { message: 'Invalid credentials', code: 'AUTH_ERROR' };
    errorHandlerSpy.handleError.and.returnValue(
      mockError as unknown as AppError,
    );

    service.login(credentials).subscribe({
      next: () => fail('Should have failed'),
      error: (error) => {
        expect(error).toEqual(mockError);
        expect(service.isAuthenticated()).toBe(false);
      },
    });

    const req = httpMock.expectOne('/api/auth/login');
    req.flush(
      { message: 'Invalid credentials' },
      { status: 401, statusText: 'Unauthorized' },
    );

    expect(errorHandlerSpy.handleError).toHaveBeenCalled();
  });

  it('should logout successfully', () => {
    // First login
    service
      .login({ email: 'test@example.com', password: 'password' })
      .subscribe();

    const loginReq = httpMock.expectOne('/api/auth/login');
    loginReq.flush({ user: mockUser, tokens: mockTokens });

    expect(service.isAuthenticated()).toBe(true);

    // Then logout
    service.logout();

    const logoutReq = httpMock.expectOne('/api/auth/logout');
    logoutReq.flush({});

    expect(service.isAuthenticated()).toBe(false);
    expect(service.user()).toBeNull();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
    expect(loggerSpy.logUserActivity).toHaveBeenCalledWith('logout', {
      userId: mockUser.id,
    });
  });

  it('should refresh tokens', () => {
    // Setup authenticated state
    service
      .login({ email: 'test@example.com', password: 'password' })
      .subscribe();
    const loginReq = httpMock.expectOne('/api/auth/login');
    loginReq.flush({ user: mockUser, tokens: mockTokens });

    const newTokens: AuthTokens = {
      ...mockTokens,
      accessToken: 'new-access-token',
      expiresAt: Date.now() + 3600000,
    };

    service.refreshToken().subscribe((tokens) => {
      expect(tokens).toEqual(newTokens);
      expect(service.tokens()).toEqual(newTokens);
    });

    const req = httpMock.expectOne('/api/auth/refresh');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ refreshToken: mockTokens.refreshToken });

    req.flush({ tokens: newTokens });
  });

  it('should check user permissions', () => {
    // Setup authenticated state
    service
      .login({ email: 'test@example.com', password: 'password' })
      .subscribe();
    const loginReq = httpMock.expectOne('/api/auth/login');
    loginReq.flush({ user: mockUser, tokens: mockTokens });

    expect(service.hasPermission('read')).toBe(true);
    expect(service.hasPermission('write')).toBe(false);
  });

  it('should check user roles', () => {
    // Setup authenticated state
    service
      .login({ email: 'test@example.com', password: 'password' })
      .subscribe();
    const loginReq = httpMock.expectOne('/api/auth/login');
    loginReq.flush({ user: mockUser, tokens: mockTokens });

    expect(service.hasRole('user')).toBe(true);
    expect(service.hasRole('admin')).toBe(false);
    expect(service.hasAnyRole(['user', 'admin'])).toBe(true);
    expect(service.hasAnyRole(['admin', 'moderator'])).toBe(false);
  });

  it('should get auth header', () => {
    expect(service.getAuthHeader()).toBeNull();

    // Setup authenticated state
    service
      .login({ email: 'test@example.com', password: 'password' })
      .subscribe();
    const loginReq = httpMock.expectOne('/api/auth/login');
    loginReq.flush({ user: mockUser, tokens: mockTokens });

    expect(service.getAuthHeader()).toBe(`Bearer ${mockTokens.accessToken}`);
  });

  it('should update user profile', () => {
    // Setup authenticated state
    service
      .login({ email: 'test@example.com', password: 'password' })
      .subscribe();
    const loginReq = httpMock.expectOne('/api/auth/login');
    loginReq.flush({ user: mockUser, tokens: mockTokens });

    const updates = { name: 'Updated Name' };
    const updatedUser = { ...mockUser, ...updates };

    service.updateProfile(updates).subscribe((user) => {
      expect(user).toEqual(updatedUser);
      expect(service.user()).toEqual(updatedUser);
    });

    const req = httpMock.expectOne('/api/auth/profile');
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual(updates);

    req.flush(updatedUser);

    expect(loggerSpy.logUserActivity).toHaveBeenCalledWith('profile_update', {
      userId: updatedUser.id,
    });
  });

  it('should request password reset', () => {
    const email = 'test@example.com';

    service.requestPasswordReset(email).subscribe();

    const req = httpMock.expectOne('/api/auth/reset-password');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ email });

    req.flush({});

    expect(loggerSpy.info).toHaveBeenCalledWith('Password reset requested', {
      email,
    });
    expect(loggerSpy.logUserActivity).toHaveBeenCalledWith(
      'password_reset_requested',
      { email },
    );
  });

  it('should verify email', () => {
    // Setup authenticated state
    service
      .login({ email: 'test@example.com', password: 'password' })
      .subscribe();
    const loginReq = httpMock.expectOne('/api/auth/login');
    loginReq.flush({
      user: { ...mockUser, isEmailVerified: false },
      tokens: mockTokens,
    });

    const token = 'verification-token';

    service.verifyEmail(token).subscribe();

    const req = httpMock.expectOne('/api/auth/verify-email');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ token });

    req.flush({});

    expect(service.user()?.isEmailVerified).toBe(true);
    expect(loggerSpy.logUserActivity).toHaveBeenCalledWith('email_verified', {
      userId: mockUser.id,
    });
  });
});
