import { TestBed } from '@angular/core/testing';
import { ErrorHandlingService } from './error-handling.service';
import { AppError } from '../models/error.models';

describe('ErrorHandlingService', () => {
  let service: ErrorHandlingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ErrorHandlingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should handle JavaScript errors', () => {
    const jsError = new Error('Test error');
    const appError = service.handleError(jsError, { logToConsole: false });

    expect(appError).toBeDefined();
    expect(appError.message).toBe('Test error');
    expect(appError.code).toBe('Error');
    expect(appError.category).toBe('system');
  });

  it('should handle HTTP errors', () => {
    const httpError = { status: 404, message: 'Not Found' };
    const appError = service.handleError(httpError, { logToConsole: false });

    expect(appError).toBeDefined();
    expect(appError.code).toBe('HTTP_404');
    expect(appError.category).toBe('network');
    expect(appError.severity).toBe('medium');
  });

  it('should handle string errors', () => {
    const stringError = 'Something went wrong';
    const appError = service.handleError(stringError, { logToConsole: false });

    expect(appError).toBeDefined();
    expect(appError.message).toBe('Something went wrong');
    expect(appError.code).toBe('StringError');
  });

  it('should categorize errors correctly', () => {
    const networkError = new Error('fetch failed');
    const appError = service.handleError(networkError, { logToConsole: false });

    expect(appError.category).toBe('network');
  });

  it('should determine HTTP retryability correctly', () => {
    const retryableError = { status: 500, message: 'Server Error' };
    const appError = service.handleError(retryableError, {
      logToConsole: false,
    });

    expect(appError.retryable).toBe(true);
  });

  it('should store errors in collection', () => {
    const error1 = service.handleError('Error 1', { logToConsole: false });
    const error2 = service.handleError('Error 2', { logToConsole: false });

    const errors = service.currentErrors();
    expect(errors.length).toBe(2);
    expect(errors[0].id).toBe(error2.id); // Most recent first
    expect(errors[1].id).toBe(error1.id);
  });

  it('should filter errors by category', () => {
    service.handleError('Network error', {
      category: 'network',
      logToConsole: false,
    });
    service.handleError('Auth error', {
      category: 'authentication',
      logToConsole: false,
    });

    const networkErrors = service.getErrorsByCategory('network');
    const authErrors = service.getErrorsByCategory('authentication');

    expect(networkErrors.length).toBe(1);
    expect(authErrors.length).toBe(1);
  });

  it('should filter errors by severity', () => {
    const error1 = new Error('Critical error');
    const error2 = new Error('Low error');

    service.handleError(error1, { category: 'system', logToConsole: false });
    service.handleError(error2, { category: 'user', logToConsole: false });

    const highErrors = service.getErrorsBySeverity('high');
    const mediumErrors = service.getErrorsBySeverity('medium');

    expect(highErrors.length).toBe(1);
    expect(mediumErrors.length).toBe(1);
  });

  it('should detect critical errors', () => {
    expect(service.hasCriticalErrors()).toBe(false);

    // Force a critical error by directly adding to the collection
    const criticalError: AppError = {
      id: 'test',
      code: 'CRITICAL',
      message: 'Critical error',
      severity: 'critical',
      category: 'system',
      timestamp: Date.now(),
      userAgent: 'test',
      url: 'test',
      retryable: false,
      handled: false,
    };

    // Use private method access for testing
    (service as unknown as { addError: (error: AppError) => void }).addError(
      criticalError,
    );

    expect(service.hasCriticalErrors()).toBe(true);
  });

  it('should clear errors', () => {
    service.handleError('Error 1', { logToConsole: false });
    service.handleError('Error 2', { logToConsole: false });

    expect(service.currentErrors().length).toBe(2);

    service.clearErrors();

    expect(service.currentErrors().length).toBe(0);
  });

  it('should clear specific error', () => {
    const error1 = service.handleError('Error 1', { logToConsole: false });
    const error2 = service.handleError('Error 2', { logToConsole: false });

    expect(service.currentErrors().length).toBe(2);

    service.clearError(error1.id);

    const remainingErrors = service.currentErrors();
    expect(remainingErrors.length).toBe(1);
    expect(remainingErrors[0].id).toBe(error2.id);
  });
});
