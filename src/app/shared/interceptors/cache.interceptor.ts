import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpResponse,
  HttpEvent,
} from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

interface CacheEntry {
  response: HttpResponse<unknown>;
  timestamp: number;
}

@Injectable()
export class CacheInterceptor implements HttpInterceptor {
  private cache = new Map<string, CacheEntry>();
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler,
  ): Observable<HttpEvent<unknown>> {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next.handle(req);
    }

    const cachedResponse = this.cache.get(req.url);

    // Check if we have a valid cached response
    if (cachedResponse && this.isCacheValid(cachedResponse.timestamp)) {
      // eslint-disable-next-line no-console
      console.log(`🚀 Cache hit for ${req.url}`);
      return of(cachedResponse.response);
    }

    // Make the request and cache the response
    return next.handle(req).pipe(
      tap((event) => {
        if (event instanceof HttpResponse) {
          // eslint-disable-next-line no-console
          console.log(`💾 Caching response for ${req.url}`);
          this.cache.set(req.url, {
            response: event.clone(),
            timestamp: Date.now(),
          });
        }
      }),
    );
  }

  private isCacheValid(timestamp: number): boolean {
    return Date.now() - timestamp < this.CACHE_TTL;
  }

  clearCache(): void {
    this.cache.clear();
    // eslint-disable-next-line no-console
    console.log('🗑️ Cache cleared');
  }

  getCacheSize(): number {
    return this.cache.size;
  }
}
