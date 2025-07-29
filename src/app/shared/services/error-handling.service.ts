import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

export interface AppError {
  id: string;
  message: string;
  type: 'error' | 'warning' | 'info';
  timestamp: Date;
  details?: unknown;
}

@Injectable({
  providedIn: 'root',
})
export class ErrorHandlingService {
  private errorsSubject = new BehaviorSubject<AppError[]>([]);
  public errors$ = this.errorsSubject.asObservable();

  /**
   * Handle HTTP errors and convert them to user-friendly messages
   */
  handleHttpError(error: HttpErrorResponse): AppError {
    let message: string;
    const type: AppError['type'] = 'error';

    switch (error.status) {
      case 0:
        message = 'Network error. Please check your connection.';
        break;
      case 400:
        message = 'Invalid request. Please check your input.';
        break;
      case 401:
        message = 'Unauthorized. Please log in again.';
        break;
      case 403:
        message = 'Access denied. You do not have permission.';
        break;
      case 404:
        message = 'Resource not found.';
        break;
      case 500:
        message = 'Server error. Please try again later.';
        break;
      case 503:
        message = 'Service unavailable. Please try again later.';
        break;
      default:
        message = error.message || 'An unexpected error occurred.';
    }

    const appError: AppError = {
      id: this.generateErrorId(),
      message,
      type,
      timestamp: new Date(),
      details: {
        status: error.status,
        statusText: error.statusText,
        url: error.url,
        originalError: error.error,
      },
    };

    this.addError(appError);
    return appError;
  }

  /**
   * Handle application errors
   */
  handleError(
    message: string,
    type: AppError['type'] = 'error',
    details?: unknown,
  ): AppError {
    const appError: AppError = {
      id: this.generateErrorId(),
      message,
      type,
      timestamp: new Date(),
      details,
    };

    this.addError(appError);
    return appError;
  }

  /**
   * Add an error to the error list
   */
  private addError(error: AppError): void {
    const currentErrors = this.errorsSubject.value;
    this.errorsSubject.next([...currentErrors, error]);

    // Auto-remove errors after 30 seconds for non-critical errors
    if (error.type !== 'error') {
      setTimeout(() => {
        this.removeError(error.id);
      }, 30000);
    }
  }

  /**
   * Remove an error by ID
   */
  removeError(errorId: string): void {
    const currentErrors = this.errorsSubject.value;
    const filteredErrors = currentErrors.filter((e) => e.id !== errorId);
    this.errorsSubject.next(filteredErrors);
  }

  /**
   * Clear all errors
   */
  clearAllErrors(): void {
    this.errorsSubject.next([]);
  }

  /**
   * Get current error count
   */
  getErrorCount(): number {
    return this.errorsSubject.value.length;
  }

  /**
   * Check if there are any critical errors
   */
  hasCriticalErrors(): boolean {
    return this.errorsSubject.value.some((error) => error.type === 'error');
  }

  private generateErrorId(): string {
    return `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
