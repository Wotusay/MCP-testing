import { Injectable, inject } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from '@angular/common/http';
import { Observable } from 'rxjs';

import { AuthenticationService } from '../services/auth.service';
import { LoggingService } from '../services/logging.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private readonly authService = inject(AuthenticationService);
  private readonly logger = inject(LoggingService);

  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler,
  ): Observable<HttpEvent<unknown>> {
    // Skip auth header for certain requests
    if (this.shouldSkipAuth(req)) {
      return next.handle(req);
    }

    const authHeader = this.authService.getAuthHeader();

    if (authHeader) {
      const authReq = req.clone({
        headers: req.headers.set('Authorization', authHeader),
      });

      this.logger.debug('Added authorization header to request', {
        url: req.url,
        method: req.method,
      });

      return next.handle(authReq);
    }

    return next.handle(req);
  }

  private shouldSkipAuth(req: HttpRequest<unknown>): boolean {
    // Skip auth for login, register, and public endpoints
    const skipEndpoints = [
      '/auth/login',
      '/auth/register',
      '/auth/reset-password',
      '/auth/verify-email',
      '/public/',
      '/assets/',
    ];

    return skipEndpoints.some((endpoint) => req.url.includes(endpoint));
  }
}
