import { Injectable, signal } from '@angular/core';
import {
  AppError,
  ErrorSeverity,
  ErrorCategory,
  ErrorHandlerOptions,
  ErrorReport,
  RetryConfig,
  ErrorDisplayConfig,
} from '../models/error.models';

@Injectable({
  providedIn: 'root',
})
export class ErrorHandlingService {
  private readonly errors = signal<AppError[]>([]);
  private readonly maxStoredErrors = 100;
  private retryConfigs = new Map<string, RetryConfig>();

  readonly currentErrors = this.errors.asReadonly();

  /**
   * Handle an error with various options
   */
  handleError(error: unknown, options: ErrorHandlerOptions = {}): AppError {
    const appError = this.normalizeError(error, options);

    // Add to errors collection
    this.addError(appError);

    // Log to console if enabled
    if (options.logToConsole !== false) {
      this.logToConsole(appError);
    }

    // Log to server if enabled
    if (options.logToServer) {
      this.logToServer(appError);
    }

    // Show to user if enabled
    if (options.showToUser) {
      this.showToUser(appError);
    }

    return appError;
  }

  /**
   * Create an error report for detailed analysis
   */
  createErrorReport(
    error: AppError,
    context?: Record<string, unknown>,
  ): ErrorReport {
    return {
      error,
      context: {
        ...context,
        userAgent: navigator.userAgent,
        url: window.location.href,
        timestamp: Date.now(),
      },
    };
  }

  /**
   * Clear all stored errors
   */
  clearErrors(): void {
    this.errors.set([]);
  }

  /**
   * Clear a specific error by ID
   */
  clearError(errorId: string): void {
    this.errors.update((errors) => errors.filter((e) => e.id !== errorId));
  }

  /**
   * Get errors by category
   */
  getErrorsByCategory(category: ErrorCategory): AppError[] {
    return this.errors().filter((error) => error.category === category);
  }

  /**
   * Get errors by severity
   */
  getErrorsBySeverity(severity: ErrorSeverity): AppError[] {
    return this.errors().filter((error) => error.severity === severity);
  }

  /**
   * Check if there are any critical errors
   */
  hasCriticalErrors(): boolean {
    return this.errors().some((error) => error.severity === 'critical');
  }

  /**
   * Set retry configuration for specific error codes
   */
  setRetryConfig(errorCode: string, config: RetryConfig): void {
    this.retryConfigs.set(errorCode, config);
  }

  /**
   * Attempt to retry a failed operation
   */
  async retryOperation<T>(
    operation: () => Promise<T>,
    errorCode: string,
    context?: Record<string, unknown>,
  ): Promise<T> {
    const config =
      this.retryConfigs.get(errorCode) || this.getDefaultRetryConfig();
    let lastError: AppError | null = null;

    for (let attempt = 0; attempt <= config.maxRetries; attempt++) {
      try {
        if (attempt > 0) {
          const delay = Math.min(
            config.baseDelay * Math.pow(config.backoffMultiplier, attempt - 1),
            config.maxDelay,
          );
          await this.delay(delay);
        }

        return await operation();
      } catch (error) {
        lastError = this.handleError(error, {
          category: 'system',
          context: { ...context, attempt: attempt + 1 },
        });

        if (config.retryCondition && !config.retryCondition(lastError)) {
          break;
        }
      }
    }

    throw lastError;
  }

  private normalizeError(
    error: unknown,
    options: ErrorHandlerOptions = {},
  ): AppError {
    const id = this.generateErrorId();
    const timestamp = Date.now();

    if (error instanceof Error) {
      return {
        id,
        code: error.name || 'UnknownError',
        message: error.message || 'An unknown error occurred',
        severity: this.determineSeverity(error, options),
        category: options.category || this.categorizeError(error),
        timestamp,
        details: options.context,
        stack: error.stack,
        userAgent: navigator.userAgent,
        url: window.location.href,
        retryable: options.retryable ?? false,
        handled: false,
      };
    }

    // Handle HTTP errors
    if (typeof error === 'object' && error !== null && 'status' in error) {
      const httpError = error as {
        status: number;
        message?: string;
        error?: unknown;
      };
      return {
        id,
        code: `HTTP_${httpError.status}`,
        message: httpError.message || `HTTP Error ${httpError.status}`,
        severity: this.determineHttpSeverity(httpError.status),
        category: 'network',
        timestamp,
        details: {
          ...options.context,
          httpStatus: httpError.status,
          httpError: httpError.error,
        },
        userAgent: navigator.userAgent,
        url: window.location.href,
        retryable: this.isHttpRetryable(httpError.status),
        handled: false,
      };
    }

    // Handle string errors
    if (typeof error === 'string') {
      return {
        id,
        code: 'StringError',
        message: error,
        severity: 'medium',
        category: options.category || 'unknown',
        timestamp,
        details: options.context,
        userAgent: navigator.userAgent,
        url: window.location.href,
        retryable: options.retryable ?? false,
        handled: false,
      };
    }

    // Handle unknown errors
    return {
      id,
      code: 'UnknownError',
      message: 'An unknown error occurred',
      severity: 'medium',
      category: options.category || 'unknown',
      timestamp,
      details: { ...options.context, originalError: error },
      userAgent: navigator.userAgent,
      url: window.location.href,
      retryable: options.retryable ?? false,
      handled: false,
    };
  }

  private addError(error: AppError): void {
    this.errors.update((errors) => {
      const newErrors = [error, ...errors];
      // Keep only the most recent errors
      return newErrors.slice(0, this.maxStoredErrors);
    });
  }

  private generateErrorId(): string {
    return `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private determineSeverity(
    error: Error,
    options: ErrorHandlerOptions,
  ): ErrorSeverity {
    if (error.name === 'TypeError' || error.name === 'ReferenceError') {
      return 'high';
    }
    if (error.name === 'NetworkError') {
      return 'medium';
    }
    return options.category === 'system' ? 'high' : 'medium';
  }

  private determineHttpSeverity(status: number): ErrorSeverity {
    if (status >= 500) return 'high';
    if (status >= 400) return 'medium';
    return 'low';
  }

  private categorizeError(error: Error): ErrorCategory {
    if (error.name === 'NetworkError' || error.message.includes('fetch')) {
      return 'network';
    }
    if (error.name === 'ValidationError') {
      return 'validation';
    }
    if (error.message.includes('auth') || error.message.includes('token')) {
      return 'authentication';
    }
    return 'system';
  }

  private isHttpRetryable(status: number): boolean {
    // Retry on 5xx errors and certain 4xx errors
    return status >= 500 || status === 408 || status === 429;
  }

  private logToConsole(error: AppError): void {
    const style = this.getConsoleStyle(error.severity);
    // eslint-disable-next-line no-console
    console.group(
      `%c🚨 ${error.severity.toUpperCase()} Error: ${error.code}`,
      style,
    );
    // eslint-disable-next-line no-console
    console.error('Message:', error.message);
    // eslint-disable-next-line no-console
    console.error('Category:', error.category);
    // eslint-disable-next-line no-console
    console.error('Timestamp:', new Date(error.timestamp).toISOString());
    if (error.details) {
      // eslint-disable-next-line no-console
      console.error('Details:', error.details);
    }
    if (error.stack) {
      // eslint-disable-next-line no-console
      console.error('Stack:', error.stack);
    }
    // eslint-disable-next-line no-console
    console.groupEnd();
  }

  private async logToServer(error: AppError): Promise<void> {
    try {
      // In a real app, this would send to your logging service
      await fetch('/api/errors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.createErrorReport(error)),
      });
    } catch (logError) {
      // eslint-disable-next-line no-console
      console.error('Failed to log error to server:', logError);
    }
  }

  private showToUser(error: AppError): void {
    // In a real app, this would integrate with a notification service
    const config: ErrorDisplayConfig = {
      title: `${error.severity.charAt(0).toUpperCase() + error.severity.slice(1)} Error`,
      message: this.getUserFriendlyMessage(error),
      autoHide: error.severity !== 'critical',
      hideAfter: 5000,
    };

    // eslint-disable-next-line no-console
    console.warn('User notification:', config);
  }

  private getUserFriendlyMessage(error: AppError): string {
    switch (error.category) {
      case 'network':
        return 'Network connection failed. Please check your internet connection and try again.';
      case 'authentication':
        return 'Authentication failed. Please log in again.';
      case 'authorization':
        return "You don't have permission to perform this action.";
      case 'validation':
        return 'Please check your input and try again.';
      default:
        return 'Something went wrong. Please try again or contact support if the problem persists.';
    }
  }

  private getConsoleStyle(severity: ErrorSeverity): string {
    switch (severity) {
      case 'critical':
        return 'color: white; background-color: #dc2626; font-weight: bold; padding: 2px 8px; border-radius: 3px;';
      case 'high':
        return 'color: white; background-color: #ea580c; font-weight: bold; padding: 2px 8px; border-radius: 3px;';
      case 'medium':
        return 'color: white; background-color: #ca8a04; font-weight: bold; padding: 2px 8px; border-radius: 3px;';
      case 'low':
        return 'color: white; background-color: #059669; font-weight: bold; padding: 2px 8px; border-radius: 3px;';
      default:
        return 'color: white; background-color: #6b7280; font-weight: bold; padding: 2px 8px; border-radius: 3px;';
    }
  }

  private getDefaultRetryConfig(): RetryConfig {
    return {
      maxRetries: 3,
      baseDelay: 1000,
      maxDelay: 10000,
      backoffMultiplier: 2,
    };
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
