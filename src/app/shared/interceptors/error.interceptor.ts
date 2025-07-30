import { Injectable, inject } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
  HttpResponse,
} from '@angular/common/http';
import { Observable, throwError, timer } from 'rxjs';
import { catchError, tap, retryWhen, mergeMap, finalize } from 'rxjs/operators';

import { ErrorHandlingService } from '../services/error-handling.service';
import { LoggingService } from '../services/logging.service';
import { AuthenticationService } from '../services/auth.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  private readonly errorHandler = inject(ErrorHandlingService);
  private readonly logger = inject(LoggingService);
  private readonly authService = inject(AuthenticationService);

  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler,
  ): Observable<HttpEvent<unknown>> {
    const startTime = performance.now();

    return next.handle(req).pipe(
      tap((event) => {
        if (event instanceof HttpResponse) {
          const duration = performance.now() - startTime;
          this.logger.logApiCall(req.method, req.url, duration, event.status);
        }
      }),
      retryWhen((errors) =>
        errors.pipe(
          mergeMap((error, index) => {
            const retryAttempt = index + 1;

            // Only retry specific errors
            if (this.shouldRetry(error, retryAttempt)) {
              const delay = Math.min(1000 * Math.pow(2, index), 10000);
              this.logger.warn(`Retrying request (attempt ${retryAttempt})`, {
                url: req.url,
                method: req.method,
                error: error.message,
                delay,
              });
              return timer(delay);
            }

            return throwError(() => error);
          }),
        ),
      ),
      catchError((error: HttpErrorResponse) => {
        const duration = performance.now() - startTime;

        // Log the error
        this.logger.logApiCall(req.method, req.url, duration, error.status);

        // Handle specific error types
        this.handleHttpError(error, req);

        // Create and handle application error
        const appError = this.errorHandler.handleError(error, {
          category: 'network',
          context: {
            url: req.url,
            method: req.method,
            status: error.status,
            headers: req.headers.keys().reduce(
              (acc, key) => {
                acc[key] = req.headers.get(key);
                return acc;
              },
              {} as Record<string, string | null>,
            ),
          },
          showToUser: this.shouldShowToUser(error),
          retryable: this.isRetryableError(error),
        });

        return throwError(() => appError);
      }),
      finalize(() => {
        // Log completion
        const duration = performance.now() - startTime;
        this.logger.debug(`Request completed`, {
          url: req.url,
          method: req.method,
          duration,
        });
      }),
    );
  }

  private handleHttpError(
    error: HttpErrorResponse,
    req: HttpRequest<unknown>,
  ): void {
    switch (error.status) {
      case 401:
        this.handleUnauthorized(error, req);
        break;
      case 403:
        this.handleForbidden(error, req);
        break;
      case 404:
        this.handleNotFound(error, req);
        break;
      case 422:
        this.handleValidationError(error, req);
        break;
      case 429:
        this.handleRateLimit(error, req);
        break;
      case 500:
      case 502:
      case 503:
      case 504:
        this.handleServerError(error, req);
        break;
      default:
        this.handleGenericError(error, req);
    }
  }

  private handleUnauthorized(
    error: HttpErrorResponse,
    req: HttpRequest<unknown>,
  ): void {
    this.logger.warn('Unauthorized request', {
      url: req.url,
      method: req.method,
      status: error.status,
    });

    // Don't logout for auth endpoints
    if (!req.url.includes('/auth/')) {
      this.authService.logout();
    }
  }

  private handleForbidden(
    error: HttpErrorResponse,
    req: HttpRequest<unknown>,
  ): void {
    this.logger.warn('Forbidden request', {
      url: req.url,
      method: req.method,
      status: error.status,
      user: this.authService.user()?.id,
    });
  }

  private handleNotFound(
    error: HttpErrorResponse,
    req: HttpRequest<unknown>,
  ): void {
    this.logger.info('Resource not found', {
      url: req.url,
      method: req.method,
      status: error.status,
    });
  }

  private handleValidationError(
    error: HttpErrorResponse,
    req: HttpRequest<unknown>,
  ): void {
    this.logger.info('Validation error', {
      url: req.url,
      method: req.method,
      status: error.status,
      errors: error.error,
    });
  }

  private handleRateLimit(
    error: HttpErrorResponse,
    req: HttpRequest<unknown>,
  ): void {
    const retryAfter = error.headers.get('Retry-After');
    this.logger.warn('Rate limit exceeded', {
      url: req.url,
      method: req.method,
      status: error.status,
      retryAfter,
    });
  }

  private handleServerError(
    error: HttpErrorResponse,
    req: HttpRequest<unknown>,
  ): void {
    this.logger.error('Server error', {
      url: req.url,
      method: req.method,
      status: error.status,
      message: error.message,
    });
  }

  private handleGenericError(
    error: HttpErrorResponse,
    req: HttpRequest<unknown>,
  ): void {
    this.logger.error('HTTP error', {
      url: req.url,
      method: req.method,
      status: error.status,
      message: error.message,
    });
  }

  private shouldRetry(error: HttpErrorResponse, retryAttempt: number): boolean {
    const maxRetries = 3;

    if (retryAttempt >= maxRetries) {
      return false;
    }

    // Retry on network errors or specific HTTP status codes
    return (
      error.status === 0 || // Network error
      error.status === 408 || // Request timeout
      error.status === 429 || // Rate limit (with backoff)
      (error.status >= 500 && error.status < 600) // Server errors
    );
  }

  private isRetryableError(error: HttpErrorResponse): boolean {
    return (
      error.status === 0 ||
      error.status === 408 ||
      error.status === 429 ||
      (error.status >= 500 && error.status < 600)
    );
  }

  private shouldShowToUser(error: HttpErrorResponse): boolean {
    // Don't show network errors or server errors to user by default
    // These should be handled by the error service
    return !(
      error.status === 0 || // Network error
      (error.status >= 500 && error.status < 600) // Server errors
    );
  }
}
