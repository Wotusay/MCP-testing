import { inject } from '@angular/core';
import {
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn,
  HttpResponse,
  HttpEvent,
} from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LoggingService } from './logging.service';

interface CacheEntry {
  response: HttpResponse<unknown>;
  timestamp: number;
}

class CacheStorage {
  private cache = new Map<string, CacheEntry>();
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  get(url: string): CacheEntry | undefined {
    return this.cache.get(url);
  }

  set(url: string, entry: CacheEntry): void {
    this.cache.set(url, entry);
  }

  isCacheValid(timestamp: number): boolean {
    return Date.now() - timestamp < this.CACHE_TTL;
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }
}

// Singleton cache storage
const cacheStorage = new CacheStorage();

export const cacheInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> => {
  const logger = inject(LoggingService);

  // Only cache GET requests
  if (req.method !== 'GET') {
    return next(req);
  }

  const cachedResponse = cacheStorage.get(req.url);

  // Check if we have a valid cached response
  if (cachedResponse && cacheStorage.isCacheValid(cachedResponse.timestamp)) {
    logger.debug(`Cache hit for ${req.url}`, {}, 'HTTP_CACHE');
    return of(cachedResponse.response);
  }

  // Make the request and cache the response
  return next(req).pipe(
    tap((event) => {
      if (event instanceof HttpResponse) {
        logger.debug(`Caching response for ${req.url}`, {}, 'HTTP_CACHE');
        cacheStorage.set(req.url, {
          response: event.clone(),
          timestamp: Date.now(),
        });
      }
    }),
  );
};

// Export cache utilities for manual cache management
export const clearHttpCache = (): void => {
  cacheStorage.clear();
};

export const getHttpCacheSize = (): number => {
  return cacheStorage.size();
};
