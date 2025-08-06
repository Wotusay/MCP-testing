import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { map, catchError, switchMap, tap, mergeMap } from 'rxjs/operators';
import { LoggingService } from '../../../shared/services/logging.service';
import { ErrorHandlingService } from '../../../shared/services/error-handling.service';
import { AuthUser, AuthTokens } from '../../../shared/models/auth.models';
import * as AuthActions from '../actions/auth.actions';

@Injectable()
export class AuthEffects {
  private actions$ = inject(Actions);
  private http = inject(HttpClient);
  private router = inject(Router);
  private logger = inject(LoggingService);
  private errorHandler = inject(ErrorHandlingService);
  private platformId = inject(PLATFORM_ID);

  private readonly apiUrl = '/api/auth';

  // Login effect
  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      switchMap((action) =>
        this.http
          .post<{
            user: AuthUser;
            tokens: AuthTokens;
          }>(`${this.apiUrl}/login`, action.credentials)
          .pipe(
            tap((response) => {
              this.storeTokens(response.tokens);
              this.storeUser(response.user);
              this.scheduleTokenRefresh(response.tokens);
              this.logger.logUserActivity('login', {
                userId: response.user.id,
              });
            }),
            map((response) =>
              AuthActions.loginSuccess({
                user: response.user,
                tokens: response.tokens,
              }),
            ),
            catchError((error) => {
              const appError = this.errorHandler.handleError(error, {
                category: 'authentication',
                context: { operation: 'login' },
                showToUser: true,
              });
              return of(
                AuthActions.loginFailure({
                  error: appError.message,
                }),
              );
            }),
          ),
      ),
    ),
  );

  // Register effect
  register$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.register),
      switchMap((action) =>
        this.http
          .post<{
            user: AuthUser;
            tokens: AuthTokens;
          }>(`${this.apiUrl}/register`, action.data)
          .pipe(
            tap((response) => {
              this.storeTokens(response.tokens);
              this.storeUser(response.user);
              this.scheduleTokenRefresh(response.tokens);
              this.logger.logUserActivity('register', {
                userId: response.user.id,
              });
            }),
            map((response) =>
              AuthActions.registerSuccess({
                user: response.user,
                tokens: response.tokens,
              }),
            ),
            catchError((error) => {
              const appError = this.errorHandler.handleError(error, {
                category: 'authentication',
                context: { operation: 'register' },
                showToUser: true,
              });
              return of(
                AuthActions.registerFailure({
                  error: appError.message,
                }),
              );
            }),
          ),
      ),
    ),
  );

  // Logout effect
  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.logout),
      switchMap(() =>
        this.http.post(`${this.apiUrl}/logout`, {}).pipe(
          tap(() => {
            this.clearStoredTokens();
            this.clearStoredUser();
            this.clearRefreshTimer();
            this.router.navigate(['/login']);
          }),
          map(() => AuthActions.logoutSuccess()),
          catchError((error) => {
            // Even if logout API fails, clear local state
            this.logger.warn('Logout endpoint failed', { error });
            this.clearStoredTokens();
            this.clearStoredUser();
            this.clearRefreshTimer();
            this.router.navigate(['/login']);
            return of(AuthActions.logoutSuccess());
          }),
        ),
      ),
    ),
  );

  // Refresh Token effect
  refreshToken$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.refreshToken),
      switchMap(() => {
        const currentTokens = this.getStoredTokens();

        if (!currentTokens?.refreshToken) {
          return of(
            AuthActions.refreshTokenFailure({
              error: 'No refresh token available',
            }),
          );
        }

        return this.http
          .post<{ tokens: AuthTokens }>(`${this.apiUrl}/refresh`, {
            refreshToken: currentTokens.refreshToken,
          })
          .pipe(
            tap((response) => {
              this.storeTokens(response.tokens);
              this.scheduleTokenRefresh(response.tokens);
              this.logger.debug('Token refreshed successfully');
            }),
            map((response) =>
              AuthActions.refreshTokenSuccess({
                tokens: response.tokens,
              }),
            ),
            catchError((error) => {
              this.logger.error('Token refresh failed', { error });
              this.clearStoredTokens();
              this.clearStoredUser();
              this.router.navigate(['/login']);
              return of(
                AuthActions.refreshTokenFailure({
                  error: 'Token refresh failed',
                }),
              );
            }),
          );
      }),
    ),
  );

  // Update Profile effect
  updateProfile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.updateProfile),
      mergeMap((action) =>
        this.http
          .patch<AuthUser>(`${this.apiUrl}/profile`, action.updates)
          .pipe(
            tap((updatedUser) => {
              this.storeUser(updatedUser);
              this.logger.logUserActivity('profile_update', {
                userId: updatedUser.id,
              });
            }),
            map((updatedUser) =>
              AuthActions.updateProfileSuccess({ user: updatedUser }),
            ),
            catchError((error) => {
              const appError = this.errorHandler.handleError(error, {
                category: 'authentication',
                context: { operation: 'profile_update' },
                showToUser: true,
              });
              return of(
                AuthActions.updateProfileFailure({
                  error: appError.message,
                }),
              );
            }),
          ),
      ),
    ),
  );

  // Request Password Reset effect
  requestPasswordReset$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.requestPasswordReset),
      mergeMap((action) =>
        this.http
          .post<void>(`${this.apiUrl}/reset-password`, { email: action.email })
          .pipe(
            tap(() =>
              this.logger.logUserActivity('password_reset_requested', {
                email: action.email,
              }),
            ),
            map(() => AuthActions.requestPasswordResetSuccess()),
            catchError((error) => {
              this.errorHandler.handleError(error, {
                category: 'authentication',
                showToUser: true,
              });
              return of(
                AuthActions.requestPasswordResetFailure({
                  error: 'Failed to request password reset',
                }),
              );
            }),
          ),
      ),
    ),
  );

  // Verify Email effect
  verifyEmail$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.verifyEmail),
      mergeMap((action) =>
        this.http
          .post<void>(`${this.apiUrl}/verify-email`, { token: action.token })
          .pipe(
            tap(() => {
              const currentUser = this.getStoredUser();
              if (currentUser) {
                this.logger.logUserActivity('email_verified', {
                  userId: currentUser.id,
                });
              }
            }),
            map(() => AuthActions.verifyEmailSuccess()),
            catchError((error) => {
              const appError = this.errorHandler.handleError(error, {
                category: 'authentication',
                context: { operation: 'email_verification' },
                showToUser: true,
              });
              return of(
                AuthActions.verifyEmailFailure({
                  error: appError.message,
                }),
              );
            }),
          ),
      ),
    ),
  );

  // Initialize Auth effect
  initializeAuth$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.initializeAuth),
      switchMap(() => {
        if (!isPlatformBrowser(this.platformId)) {
          return of(AuthActions.initializeAuthFailure());
        }

        try {
          const storedTokens = this.getStoredTokens();
          const storedUser = this.getStoredUser();

          if (storedTokens && storedUser && this.isTokenValid(storedTokens)) {
            this.scheduleTokenRefresh(storedTokens);
            this.logger.info('Auth initialized from storage', {
              userId: storedUser.id,
            });

            return of(
              AuthActions.initializeAuthSuccess({
                user: storedUser,
                tokens: storedTokens,
              }),
            );
          } else {
            this.logger.info('Auth initialized as unauthenticated');
            return of(AuthActions.initializeAuthFailure());
          }
        } catch (error) {
          this.logger.error('Failed to initialize auth', { error });
          return of(AuthActions.initializeAuthFailure());
        }
      }),
    ),
  );

  // Token refresh timer
  private refreshTokenTimer?: ReturnType<typeof setTimeout>;

  private scheduleTokenRefresh(tokens: AuthTokens): void {
    this.clearRefreshTimer();

    // Refresh token 1 minute before expiration
    const refreshTime = tokens.expiresAt - Date.now() - 60 * 1000;

    if (refreshTime > 0) {
      this.refreshTokenTimer = setTimeout(() => {
        // Dispatch refresh token action
        this.actions$.pipe(ofType(AuthActions.refreshToken));
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
