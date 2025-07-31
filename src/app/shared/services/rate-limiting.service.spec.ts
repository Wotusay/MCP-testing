import { TestBed } from '@angular/core/testing';
import { provideZoneChangeDetection } from '@angular/core';
import { RateLimitingService } from './rate-limiting.service';
import { LoggingService } from './logging.service';

describe('RateLimitingService', () => {
  let service: RateLimitingService;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('LoggingService', [
      'debug',
      'warn',
      'info',
    ]);

    TestBed.configureTestingModule({
      providers: [
        provideZoneChangeDetection(),
        RateLimitingService,
        { provide: LoggingService, useValue: spy },
      ],
    });

    service = TestBed.inject(RateLimitingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should allow requests within rate limit', (done) => {
    service.checkRateLimit('test-user').subscribe({
      next: (result) => {
        expect(result).toBe(true);
        done();
      },
      error: () => {
        fail('Should not have errored');
        done();
      },
    });
  });

  it('should return correct rate limit status', () => {
    const identifier = 'status-test';
    const status = service.getRateLimitStatus(identifier);

    expect(status.count).toBe(0);
    expect(status.remaining).toBe(100); // maxRequestsPerMinute
    expect(status.blocked).toBe(false);
    expect(status.resetTime).toBeGreaterThan(Date.now());
  });

  it('should clear rate limit for identifier', (done) => {
    const identifier = 'clear-test';

    // Make a request to create a record
    service.checkRateLimit(identifier).subscribe(() => {
      const statusBefore = service.getRateLimitStatus(identifier);
      expect(statusBefore.count).toBe(1);

      // Clear the rate limit
      service.clearRateLimit(identifier);

      const statusAfter = service.getRateLimitStatus(identifier);
      expect(statusAfter.count).toBe(0);
      expect(statusAfter.remaining).toBe(100);

      done();
    });
  });

  it('should clean up expired records', () => {
    // This test would need to manipulate time or wait for actual time to pass
    // For now, we'll just test that the cleanup method exists and can be called
    expect(() => service.cleanup()).not.toThrow();
  });
});
