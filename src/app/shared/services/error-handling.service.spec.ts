import { TestBed } from '@angular/core/testing';
import { ErrorHandlingService } from './error-handling.service';
import { HttpErrorResponse } from '@angular/common/http';

describe('ErrorHandlingService', () => {
  let service: ErrorHandlingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ErrorHandlingService],
    });
    service = TestBed.inject(ErrorHandlingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should handle HTTP 400 error', () => {
    const httpError = new HttpErrorResponse({
      status: 400,
      statusText: 'Bad Request',
      url: '/api/test',
    });

    const appError = service.handleHttpError(httpError);

    expect(appError.message).toBe('Invalid request. Please check your input.');
    expect(appError.type).toBe('error');
    expect(appError.details).toEqual({
      status: 400,
      statusText: 'Bad Request',
      url: '/api/test',
      originalError: undefined,
    });
  });

  it('should handle HTTP 401 error', () => {
    const httpError = new HttpErrorResponse({
      status: 401,
      statusText: 'Unauthorized',
    });

    const appError = service.handleHttpError(httpError);

    expect(appError.message).toBe('Unauthorized. Please log in again.');
    expect(appError.type).toBe('error');
  });

  it('should handle HTTP 404 error', () => {
    const httpError = new HttpErrorResponse({
      status: 404,
      statusText: 'Not Found',
    });

    const appError = service.handleHttpError(httpError);

    expect(appError.message).toBe('Resource not found.');
  });

  it('should handle network error (status 0)', () => {
    const httpError = new HttpErrorResponse({
      status: 0,
      statusText: 'Unknown Error',
    });

    const appError = service.handleHttpError(httpError);

    expect(appError.message).toBe(
      'Network error. Please check your connection.',
    );
  });

  it('should handle application errors', () => {
    const errorMessage = 'Test application error';
    const errorDetails = { test: 'data' };

    const appError = service.handleError(errorMessage, 'warning', errorDetails);

    expect(appError.message).toBe(errorMessage);
    expect(appError.type).toBe('warning');
    expect(appError.details).toEqual(errorDetails);
  });

  it('should track errors in observable', (done) => {
    const errorMessage = 'Test error';

    service.errors$.subscribe((errors) => {
      if (errors.length > 0) {
        expect(errors[0].message).toBe(errorMessage);
        done();
      }
    });

    service.handleError(errorMessage);
  });

  it('should remove errors by ID', () => {
    const error = service.handleError('Test error');

    expect(service.getErrorCount()).toBe(1);

    service.removeError(error.id);

    expect(service.getErrorCount()).toBe(0);
  });

  it('should clear all errors', () => {
    service.handleError('Error 1');
    service.handleError('Error 2');

    expect(service.getErrorCount()).toBe(2);

    service.clearAllErrors();

    expect(service.getErrorCount()).toBe(0);
  });

  it('should detect critical errors', () => {
    expect(service.hasCriticalErrors()).toBeFalse();

    service.handleError('Critical error', 'error');

    expect(service.hasCriticalErrors()).toBeTrue();
  });
});
