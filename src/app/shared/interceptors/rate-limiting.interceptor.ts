import { Injectable, inject } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { RateLimitingService } from '../services/rate-limiting.service';
import { AuthenticationService } from '../services/auth.service';

@Injectable()
export class RateLimitingInterceptor implements HttpInterceptor {
  private readonly rateLimitService = inject(RateLimitingService);
  private readonly authService = inject(AuthenticationService);

  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler,
  ): Observable<HttpEvent<unknown>> {
    // Skip rate limiting for certain requests
    if (this.shouldSkipRateLimit(req)) {
      return next.handle(req);
    }

    // Create identifier for rate limiting
    const identifier = this.createIdentifier(req);

    // Apply rate limiting
    return this.rateLimitService
      .checkRateLimit(identifier)
      .pipe(mergeMap(() => next.handle(req)));
  }

  private shouldSkipRateLimit(req: HttpRequest<unknown>): boolean {
    // Skip rate limiting for certain endpoints
    const skipEndpoints = [
      '/auth/refresh',
      '/auth/logout',
      '/health',
      '/assets/',
      '/favicon.ico',
    ];

    return skipEndpoints.some((endpoint) => req.url.includes(endpoint));
  }

  private createIdentifier(req: HttpRequest<unknown>): string {
    // Use user ID if authenticated, otherwise use a combination of method and URL
    const user = this.authService.user();
    const baseIdentifier = user?.id || 'anonymous';

    // For sensitive endpoints, use more specific rate limiting
    if (this.isSensitiveEndpoint(req)) {
      return `${baseIdentifier}:${req.method}:${req.url}`;
    }

    // For general requests, use broader rate limiting
    return `${baseIdentifier}:general`;
  }

  private isSensitiveEndpoint(req: HttpRequest<unknown>): boolean {
    const sensitiveEndpoints = [
      '/auth/login',
      '/auth/register',
      '/auth/reset-password',
      '/auth/change-password',
      '/user/profile',
      '/admin/',
    ];

    return sensitiveEndpoints.some((endpoint) => req.url.includes(endpoint));
  }
}
