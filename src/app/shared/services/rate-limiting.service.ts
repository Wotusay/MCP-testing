import { Injectable, inject } from '@angular/core';
import { Observable, throwError, timer } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { LoggingService } from './logging.service';
import { environment } from '../../../environments/environment';

interface RequestRecord {
  count: number;
  firstRequest: number;
  blocked: boolean;
  blockedUntil?: number;
}

@Injectable({
  providedIn: 'root',
})
export class RateLimitingService {
  private readonly logger = inject(LoggingService);
  private readonly requestCounts = new Map<string, RequestRecord>();
  private readonly maxRequestsPerMinute =
    environment.security.maxRequestsPerMinute;
  private readonly blockDuration = 60000; // 1 minute

  /**
   * Checks if a request should be rate limited
   */
  checkRateLimit(identifier: string): Observable<boolean> {
    const now = Date.now();
    const record = this.requestCounts.get(identifier) || {
      count: 0,
      firstRequest: now,
      blocked: false,
    };

    // Check if currently blocked
    if (record.blocked && record.blockedUntil && now < record.blockedUntil) {
      this.logger.warn('Request blocked due to rate limiting', {
        identifier,
        remainingTime: record.blockedUntil - now,
      });
      return throwError(
        () => new Error('Rate limit exceeded. Please try again later.'),
      );
    }

    // Reset if time window has passed
    if (now - record.firstRequest > 60000) {
      record.count = 0;
      record.firstRequest = now;
      record.blocked = false;
      record.blockedUntil = undefined;
    }

    // Increment counter
    record.count++;

    // Check if limit exceeded
    if (record.count > this.maxRequestsPerMinute) {
      record.blocked = true;
      record.blockedUntil = now + this.blockDuration;

      this.logger.warn('Rate limit exceeded', {
        identifier,
        count: record.count,
        maxAllowed: this.maxRequestsPerMinute,
        blockedUntil: record.blockedUntil,
      });

      this.requestCounts.set(identifier, record);
      return throwError(
        () => new Error('Rate limit exceeded. Please try again later.'),
      );
    }

    // Update record
    this.requestCounts.set(identifier, record);

    // Add slight delay for high frequency requests
    const delayMs = this.calculateDelay(record.count);

    this.logger.debug('Rate limit check passed', {
      identifier,
      count: record.count,
      maxAllowed: this.maxRequestsPerMinute,
      delay: delayMs,
    });

    return timer(delayMs).pipe(mergeMap(() => [true]));
  }

  /**
   * Creates a rate-limited observable
   */
  rateLimit<T>(identifier: string, source$: Observable<T>): Observable<T> {
    return this.checkRateLimit(identifier).pipe(mergeMap(() => source$));
  }

  /**
   * Clears rate limiting for an identifier
   */
  clearRateLimit(identifier: string): void {
    this.requestCounts.delete(identifier);
    this.logger.debug('Rate limit cleared', { identifier });
  }

  /**
   * Gets current rate limit status
   */
  getRateLimitStatus(identifier: string): {
    count: number;
    remaining: number;
    resetTime: number;
    blocked: boolean;
  } {
    const record = this.requestCounts.get(identifier);
    const now = Date.now();

    if (!record) {
      return {
        count: 0,
        remaining: this.maxRequestsPerMinute,
        resetTime: now + 60000,
        blocked: false,
      };
    }

    const remaining = Math.max(0, this.maxRequestsPerMinute - record.count);
    const resetTime = record.firstRequest + 60000;

    return {
      count: record.count,
      remaining,
      resetTime,
      blocked:
        record.blocked &&
        (record.blockedUntil ? now < record.blockedUntil : false),
    };
  }

  /**
   * Calculates delay based on request frequency
   */
  private calculateDelay(count: number): number {
    if (count < this.maxRequestsPerMinute * 0.5) {
      return 0; // No delay for low frequency
    } else if (count < this.maxRequestsPerMinute * 0.8) {
      return 100; // Small delay for medium frequency
    } else {
      return 500; // Larger delay for high frequency
    }
  }

  /**
   * Cleanup expired records
   */
  cleanup(): void {
    const now = Date.now();
    const toDelete: string[] = [];

    this.requestCounts.forEach((record, identifier) => {
      if (now - record.firstRequest > 120000) {
        // 2 minutes
        toDelete.push(identifier);
      }
    });

    toDelete.forEach((identifier) => {
      this.requestCounts.delete(identifier);
    });

    if (toDelete.length > 0) {
      this.logger.debug('Cleaned up expired rate limit records', {
        count: toDelete.length,
      });
    }
  }
}
