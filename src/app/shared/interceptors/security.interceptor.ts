import { Injectable, inject } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from '@angular/common/http';
import { Observable } from 'rxjs';

import { LoggingService } from '../services/logging.service';

@Injectable()
export class SecurityInterceptor implements HttpInterceptor {
  private readonly logger = inject(LoggingService);

  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler,
  ): Observable<HttpEvent<unknown>> {
    // Add security headers to outgoing requests
    const secureReq = req.clone({
      setHeaders: {
        'X-Requested-With': 'XMLHttpRequest',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        Pragma: 'no-cache',
        Expires: '0',
      },
    });

    // Log security-relevant requests
    if (this.isSecurityRelevantRequest(req)) {
      this.logger.info('Security-relevant request intercepted', {
        url: req.url,
        method: req.method,
        headers: this.getSafeHeaders(req),
      });
    }

    return next.handle(secureReq);
  }

  private isSecurityRelevantRequest(req: HttpRequest<unknown>): boolean {
    const securityEndpoints = [
      '/auth/',
      '/login',
      '/register',
      '/password',
      '/user',
      '/admin',
    ];

    return securityEndpoints.some((endpoint) => req.url.includes(endpoint));
  }

  private getSafeHeaders(req: HttpRequest<unknown>): Record<string, string> {
    const safeHeaders: Record<string, string> = {};
    const sensitiveHeaders = ['authorization', 'cookie', 'x-api-key'];

    req.headers.keys().forEach((key) => {
      const lowerKey = key.toLowerCase();
      if (!sensitiveHeaders.includes(lowerKey)) {
        safeHeaders[key] = req.headers.get(key) || '';
      } else {
        safeHeaders[key] = '[REDACTED]';
      }
    });

    return safeHeaders;
  }
}
