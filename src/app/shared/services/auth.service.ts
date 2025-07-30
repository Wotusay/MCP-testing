import {
  Injectable,
  inject,
  signal,
  computed,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';

import {
  AuthUser,
  AuthTokens,
  AuthState,
  LoginCredentials,
  RegisterData,
  AuthStatus,
} from '../models/auth.models';
import { LoggingService } from './logging.service';
import { ErrorHandlingService } from './error-handling.service';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly logger = inject(LoggingService);
  private readonly errorHandler = inject(ErrorHandlingService);
  private readonly platformId = inject(PLATFORM_ID);

  private readonly apiUrl = '/api/auth';

  // State management
  private readonly authState = signal<AuthState>({
    user: null,
    tokens: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
  });

  // Public readonly signals
  readonly user = computed(() => this.authState().user);
  readonly tokens = computed(() => this.authState().tokens);
  readonly isAuthenticated = computed(() => this.authState().isAuthenticated);
  readonly isLoading = computed(() => this.authState().isLoading);
  readonly error = computed(() => this.authState().error);
  readonly status = computed((): AuthStatus => {
    const state = this.authState();
    if (state.isLoading) return 'loading';
    if (state.error) return 'error';
    if (state.isAuthenticated) return 'authenticated';
    return 'unauthenticated';
  });

  // Refresh token timer
  private refreshTokenTimer?: ReturnType<typeof setTimeout>;

  constructor() {
    this.initializeAuth();
  }

  /**
   * Initialize authentication state from storage
   */
  private initializeAuth(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.setLoading(true);

    try {
      const storedTokens = this.getStoredTokens();
      const storedUser = this.getStoredUser();

      if (storedTokens && storedUser && this.isTokenValid(storedTokens)) {
        this.updateAuthState({
          user: storedUser,
          tokens: storedTokens,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });

        this.scheduleTokenRefresh(storedTokens);
        this.logger.info('Auth initialized from storage', {
          userId: storedUser.id,
        });
      } else {
        this.clearAuthState();
        this.logger.info('Auth initialized as unauthenticated');
      }
    } catch (error) {
      this.logger.error('Failed to initialize auth', { error });
      this.clearAuthState();
    }
  }

  /**
   * Login with email and password
   */
  login(credentials: LoginCredentials): Observable<AuthUser> {
    this.setLoading(true);
    this.logger.info('Login attempt', { email: credentials.email });

    return this.http
      .post<{
        user: AuthUser;
        tokens: AuthTokens;
      }>(`${this.apiUrl}/login`, credentials)
      .pipe(
        tap((response) => {
          this.handleAuthSuccess(response.user, response.tokens);
          this.logger.logUserActivity('login', { userId: response.user.id });
        }),
        map((response) => response.user),
        catchError((error) => this.handleAuthError(error, 'login')),
      );
  }

  /**
   * Register a new user
   */
  register(data: RegisterData): Observable<AuthUser> {
    this.setLoading(true);
    this.logger.info('Registration attempt', { email: data.email });

    return this.http
      .post<{
        user: AuthUser;
        tokens: AuthTokens;
      }>(`${this.apiUrl}/register`, data)
      .pipe(
        tap((response) => {
          this.handleAuthSuccess(response.user, response.tokens);
          this.logger.logUserActivity('register', { userId: response.user.id });
        }),
        map((response) => response.user),
        catchError((error) => this.handleAuthError(error, 'register')),
      );
  }

  /**
   * Logout the current user
   */
  logout(): void {
    const currentUser = this.user();
    this.logger.info('Logout initiated', { userId: currentUser?.id });

    // Call logout endpoint if user is authenticated
    if (this.isAuthenticated()) {
      this.http
        .post(`${this.apiUrl}/logout`, {})
        .pipe(
          catchError((error) => {
            this.logger.warn('Logout endpoint failed', { error });
            return throwError(() => error);
          }),
        )
        .subscribe();
    }

    this.clearAuthState();
    this.logger.logUserActivity('logout', { userId: currentUser?.id });
    this.router.navigate(['/login']);
  }

  /**
   * Refresh the authentication token
   */
  refreshToken(): Observable<AuthTokens> {
    const currentTokens = this.tokens();

    if (!currentTokens?.refreshToken) {
      return throwError(() => new Error('No refresh token available'));
    }

    this.logger.debug('Refreshing auth token');

    return this.http
      .post<{ tokens: AuthTokens }>(`${this.apiUrl}/refresh`, {
        refreshToken: currentTokens.refreshToken,
      })
      .pipe(
        tap((response) => {
          this.updateTokens(response.tokens);
          this.scheduleTokenRefresh(response.tokens);
          this.logger.debug('Token refreshed successfully');
        }),
        map((response) => response.tokens),
        catchError((error) => {
          this.logger.error('Token refresh failed', { error });
          this.clearAuthState();
          this.router.navigate(['/login']);
          return throwError(() => error);
        }),
      );
  }

  /**
   * Check if user has specific permission
   */
  hasPermission(permission: string): boolean {
    const currentUser = this.user();
    return currentUser?.permissions.includes(permission) ?? false;
  }

  /**
   * Check if user has specific role
   */
  hasRole(role: string): boolean {
    const currentUser = this.user();
    return currentUser?.roles.includes(role) ?? false;
  }

  /**
   * Check if user has any of the specified roles
   */
  hasAnyRole(roles: string[]): boolean {
    const currentUser = this.user();
    if (!currentUser) return false;

    return roles.some((role) => currentUser.roles.includes(role));
  }

  /**
   * Get current authentication header value
   */
  getAuthHeader(): string | null {
    const currentTokens = this.tokens();
    return currentTokens
      ? `${currentTokens.tokenType} ${currentTokens.accessToken}`
      : null;
  }

  /**
   * Update user profile
   */
  updateProfile(updates: Partial<AuthUser>): Observable<AuthUser> {
    this.setLoading(true);

    return this.http.patch<AuthUser>(`${this.apiUrl}/profile`, updates).pipe(
      tap((updatedUser) => {
        this.updateUser(updatedUser);
        this.logger.logUserActivity('profile_update', {
          userId: updatedUser.id,
        });
      }),
      catchError((error) => this.handleAuthError(error, 'profile_update')),
    );
  }

  /**
   * Request password reset
   */
  requestPasswordReset(email: string): Observable<void> {
    this.logger.info('Password reset requested', { email });

    return this.http
      .post<void>(`${this.apiUrl}/reset-password`, { email })
      .pipe(
        tap(() =>
          this.logger.logUserActivity('password_reset_requested', { email }),
        ),
        catchError((error) => {
          this.errorHandler.handleError(error, {
            category: 'authentication',
            showToUser: true,
          });
          return throwError(() => error);
        }),
      );
  }

  /**
   * Verify email address
   */
  verifyEmail(token: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/verify-email`, { token }).pipe(
      tap(() => {
        // Update user's email verification status
        const currentUser = this.user();
        if (currentUser) {
          this.updateUser({ ...currentUser, isEmailVerified: true });
          this.logger.logUserActivity('email_verified', {
            userId: currentUser.id,
          });
        }
      }),
      catchError((error) => this.handleAuthError(error, 'email_verification')),
    );
  }

  private handleAuthSuccess(user: AuthUser, tokens: AuthTokens): void {
    this.updateAuthState({
      user,
      tokens,
      isAuthenticated: true,
      isLoading: false,
      error: null,
    });

    this.storeTokens(tokens);
    this.storeUser(user);
    this.scheduleTokenRefresh(tokens);
  }

  private handleAuthError(
    error: unknown,
    operation: string,
  ): Observable<never> {
    const appError = this.errorHandler.handleError(error, {
      category: 'authentication',
      context: { operation },
      showToUser: true,
    });

    this.updateAuthState({
      ...this.authState(),
      isLoading: false,
      error: appError.message,
    });

    return throwError(() => appError);
  }

  private updateAuthState(newState: Partial<AuthState>): void {
    this.authState.update((state) => ({ ...state, ...newState }));
  }

  private updateUser(user: AuthUser): void {
    this.authState.update((state) => ({ ...state, user }));
    this.storeUser(user);
  }

  private updateTokens(tokens: AuthTokens): void {
    this.authState.update((state) => ({ ...state, tokens }));
    this.storeTokens(tokens);
  }

  private setLoading(loading: boolean): void {
    this.authState.update((state) => ({ ...state, isLoading: loading }));
  }

  private clearAuthState(): void {
    this.clearStoredTokens();
    this.clearStoredUser();
    this.clearRefreshTimer();

    this.authState.set({
      user: null,
      tokens: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  }

  private scheduleTokenRefresh(tokens: AuthTokens): void {
    this.clearRefreshTimer();

    // Refresh token 1 minute before expiration
    const refreshTime = tokens.expiresAt - Date.now() - 60 * 1000;

    if (refreshTime > 0) {
      this.refreshTokenTimer = setTimeout(() => {
        this.refreshToken().subscribe();
      }, refreshTime);
    }
  }

  private clearRefreshTimer(): void {
    if (this.refreshTokenTimer) {
      clearTimeout(this.refreshTokenTimer);
      this.refreshTokenTimer = undefined;
    }
  }

  private isTokenValid(tokens: AuthTokens): boolean {
    return Date.now() < tokens.expiresAt;
  }

  private storeTokens(tokens: AuthTokens): void {
    if (!isPlatformBrowser(this.platformId)) return;

    try {
      localStorage.setItem('auth_tokens', JSON.stringify(tokens));
    } catch (error) {
      this.logger.warn('Failed to store tokens', { error });
    }
  }

  private getStoredTokens(): AuthTokens | null {
    if (!isPlatformBrowser(this.platformId)) return null;

    try {
      const stored = localStorage.getItem('auth_tokens');
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      this.logger.warn('Failed to retrieve stored tokens', { error });
      return null;
    }
  }

  private clearStoredTokens(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    try {
      localStorage.removeItem('auth_tokens');
    } catch (error) {
      this.logger.warn('Failed to clear stored tokens', { error });
    }
  }

  private storeUser(user: AuthUser): void {
    if (!isPlatformBrowser(this.platformId)) return;

    try {
      localStorage.setItem('auth_user', JSON.stringify(user));
    } catch (error) {
      this.logger.warn('Failed to store user', { error });
    }
  }

  private getStoredUser(): AuthUser | null {
    if (!isPlatformBrowser(this.platformId)) return null;

    try {
      const stored = localStorage.getItem('auth_user');
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      this.logger.warn('Failed to retrieve stored user', { error });
      return null;
    }
  }

  private clearStoredUser(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    try {
      localStorage.removeItem('auth_user');
    } catch (error) {
      this.logger.warn('Failed to clear stored user', { error });
    }
  }
}
