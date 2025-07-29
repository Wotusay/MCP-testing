import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';

/**
 * Mock HTTP service for testing HTTP interactions
 */
@Injectable()
export class MockHttpService {
  private delay = 100; // Default delay in milliseconds

  /**
   * Set response delay for simulating network latency
   */
  setDelay(delayMs: number): void {
    this.delay = delayMs;
  }

  /**
   * Mock successful GET request
   */
  get<T>(data: T): Observable<T> {
    return of(data).pipe(delay(this.delay));
  }

  /**
   * Mock successful POST request
   */
  post<T>(data: T): Observable<T> {
    return of(data).pipe(delay(this.delay));
  }

  /**
   * Mock successful PUT request
   */
  put<T>(data: T): Observable<T> {
    return of(data).pipe(delay(this.delay));
  }

  /**
   * Mock successful DELETE request
   */
  delete<T>(data: T): Observable<T> {
    return of(data).pipe(delay(this.delay));
  }

  /**
   * Mock HTTP error response
   */
  error(
    errorMessage: string = 'Server Error',
    status: number = 500,
  ): Observable<never> {
    const error = {
      error: { message: errorMessage },
      status,
      statusText: this.getStatusText(status),
    };
    return throwError(() => error).pipe(delay(this.delay));
  }

  private getStatusText(status: number): string {
    const statusTexts: { [key: number]: string } = {
      400: 'Bad Request',
      401: 'Unauthorized',
      403: 'Forbidden',
      404: 'Not Found',
      500: 'Internal Server Error',
      502: 'Bad Gateway',
      503: 'Service Unavailable',
    };
    return statusTexts[status] || 'Unknown Error';
  }
}

/**
 * Mock local storage for testing
 */
export class MockLocalStorage implements Storage {
  private store: { [key: string]: string } = {};

  get length(): number {
    return Object.keys(this.store).length;
  }

  clear(): void {
    this.store = {};
  }

  getItem(key: string): string | null {
    return this.store[key] || null;
  }

  key(index: number): string | null {
    const keys = Object.keys(this.store);
    return keys[index] || null;
  }

  removeItem(key: string): void {
    delete this.store[key];
  }

  setItem(key: string, value: string): void {
    this.store[key] = value;
  }
}

/**
 * Mock session storage for testing
 */
export class MockSessionStorage extends MockLocalStorage {}

/**
 * Test environment setup utilities
 */
export class TestEnvironment {
  private static originalLocalStorage: Storage;
  private static originalSessionStorage: Storage;

  /**
   * Setup mock storage for testing
   */
  static setupMockStorage(): void {
    this.originalLocalStorage = window.localStorage;
    this.originalSessionStorage = window.sessionStorage;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).localStorage = new MockLocalStorage();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).sessionStorage = new MockSessionStorage();
  }

  /**
   * Restore original storage after testing
   */
  static restoreStorage(): void {
    if (this.originalLocalStorage) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).localStorage = this.originalLocalStorage;
    }
    if (this.originalSessionStorage) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).sessionStorage = this.originalSessionStorage;
    }
  }

  /**
   * Mock console methods to prevent test output pollution
   */
  static mockConsole(): jasmine.SpyObj<Console> {
    return jasmine.createSpyObj('Console', [
      'log',
      'warn',
      'error',
      'info',
      'debug',
    ]);
  }
}
