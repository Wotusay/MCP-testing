import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { LoggingService } from './logging.service';
import {
  AuthUser,
  LoginCredentials,
  RegisterData,
  AuthState,
  ApiResponse,
} from '../models';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private logger = inject(LoggingService);

  private readonly apiUrl = `${environment.apiUrl}/auth`;
  private readonly tokenKey = 'auth_token';
  private readonly refreshTokenKey = 'refresh_token';
  private readonly userKey = 'auth_user';

  // State management using signals and BehaviorSubject
  private authStateSubject = new BehaviorSubject<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
  });

  // Public observables
  public authState$ = this.authStateSubject.asObservable();
  public user$ = this.authState$.pipe(map((state) => state.user));
  public isAuthenticated$ = this.authState$.pipe(
    map((state) => state.isAuthenticated),
  );
  public isLoading$ = this.authState$.pipe(map((state) => state.isLoading));

  constructor() {
    this.initializeAuth();
  }

  /**
   * Initialize authentication state from stored tokens
   */
  private initializeAuth(): void {
    const token = this.getStoredToken();
    const user = this.getStoredUser();

    if (token && user && !this.isTokenExpired(token)) {
      this.updateAuthState({
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
      this.logger.info('User session restored', { userId: user.id }, 'AUTH');
    } else {
      this.clearStoredAuth();
    }
  }

  /**
   * Login user with credentials
   */
  login(credentials: LoginCredentials): Observable<AuthUser> {
    this.updateAuthState({
      ...this.currentState,
      isLoading: true,
      error: null,
    });

    this.logger.info(
      'User login attempt',
      { email: credentials.email },
      'AUTH',
    );

    return this.http
      .post<ApiResponse<AuthUser>>(`${this.apiUrl}/login`, credentials)
      .pipe(
        map((response: ApiResponse<AuthUser>) => {
          if (!response.success || !response.data) {
            throw new Error(response.message || 'Login failed');
          }
          return response.data;
        }),
        tap((authUser) => {
          this.setAuthenticated(authUser);
          this.logger.info(
            'User logged in successfully',
            { userId: authUser.id },
            'AUTH',
          );
        }),
        catchError((error) => {
          this.updateAuthState({
            ...this.currentState,
            isLoading: false,
            error: 'Login failed. Please check your credentials.',
          });
          this.logger.error('Login failed', error, 'AUTH');
          return throwError(() => error);
        }),
      );
  }

  /**
   * Register new user
   */
  register(registerData: RegisterData): Observable<AuthUser> {
    this.updateAuthState({
      ...this.currentState,
      isLoading: true,
      error: null,
    });

    this.logger.info(
      'User registration attempt',
      { email: registerData.email },
      'AUTH',
    );

    return this.http
      .post<ApiResponse<AuthUser>>(`${this.apiUrl}/register`, registerData)
      .pipe(
        map((response: ApiResponse<AuthUser>) => {
          if (!response.success || !response.data) {
            throw new Error(response.message || 'Registration failed');
          }
          return response.data;
        }),
        tap((authUser) => {
          this.setAuthenticated(authUser);
          this.logger.info(
            'User registered successfully',
            { userId: authUser.id },
            'AUTH',
          );
        }),
        catchError((error) => {
          this.updateAuthState({
            ...this.currentState,
            isLoading: false,
            error: 'Registration failed. Please try again.',
          });
          this.logger.error('Registration failed', error, 'AUTH');
          return throwError(() => error);
        }),
      );
  }

  /**
   * Logout user
   */
  logout(): void {
    const currentUser = this.currentState.user;

    this.clearStoredAuth();
    this.updateAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });

    this.logger.info('User logged out', { userId: currentUser?.id }, 'AUTH');
    this.router.navigate(['/login']);
  }

  /**
   * Refresh authentication token
   */
  refreshToken(): Observable<AuthUser> {
    const refreshToken = localStorage.getItem(this.refreshTokenKey);

    if (!refreshToken) {
      return throwError(() => new Error('No refresh token available'));
    }

    return this.http
      .post<ApiResponse<AuthUser>>(`${this.apiUrl}/refresh`, { refreshToken })
      .pipe(
        map((response: ApiResponse<AuthUser>) => {
          if (!response.success || !response.data) {
            throw new Error(response.message || 'Token refresh failed');
          }
          return response.data;
        }),
        tap((authUser) => {
          this.setAuthenticated(authUser);
          this.logger.info(
            'Token refreshed successfully',
            { userId: authUser.id },
            'AUTH',
          );
        }),
        catchError((error) => {
          this.logout();
          this.logger.error('Token refresh failed', error, 'AUTH');
          return throwError(() => error);
        }),
      );
  }

  /**
   * Check if user has specific role
   */
  hasRole(role: string): boolean {
    const user = this.currentState.user;
    return user?.roles?.includes(role) ?? false;
  }

  /**
   * Check if user has any of the specified roles
   */
  hasAnyRole(roles: string[]): boolean {
    return roles.some((role) => this.hasRole(role));
  }

  /**
   * Get current user
   */
  getCurrentUser(): AuthUser | null {
    return this.currentState.user;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return this.currentState.isAuthenticated;
  }

  private get currentState(): AuthState {
    return this.authStateSubject.value;
  }

  private updateAuthState(newState: AuthState): void {
    this.authStateSubject.next(newState);
  }

  private setAuthenticated(authUser: AuthUser): void {
    // Store tokens and user data
    localStorage.setItem(this.tokenKey, authUser.token);
    if (authUser.refreshToken) {
      localStorage.setItem(this.refreshTokenKey, authUser.refreshToken);
    }
    localStorage.setItem(this.userKey, JSON.stringify(authUser));

    // Update state
    this.updateAuthState({
      user: authUser,
      isAuthenticated: true,
      isLoading: false,
      error: null,
    });
  }

  private clearStoredAuth(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.refreshTokenKey);
    localStorage.removeItem(this.userKey);
  }

  private getStoredToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  private getStoredUser(): AuthUser | null {
    const userJson = localStorage.getItem(this.userKey);
    try {
      return userJson ? JSON.parse(userJson) : null;
    } catch {
      return null;
    }
  }

  private isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  }
}
