import { TestBed } from '@angular/core/testing';
import { LoggingService, LogLevel } from './logging.service';

describe('LoggingService', () => {
  let service: LoggingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoggingService);

    // Configure to prevent console output during tests
    service.configure({
      enableConsole: false,
      enableStorage: false,
      enableRemote: false,
    });
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should log debug messages', () => {
    service.debug('Debug message', { test: true });

    const logs = service.getLogs();
    expect(logs.length).toBe(1);
    expect(logs[0].level).toBe('debug');
    expect(logs[0].message).toBe('Debug message');
    expect(logs[0].data).toEqual({ test: true });
  });

  it('should log info messages', () => {
    service.info('Info message');

    const logs = service.getLogs();
    expect(logs.length).toBe(1);
    expect(logs[0].level).toBe('info');
    expect(logs[0].message).toBe('Info message');
  });

  it('should log warning messages', () => {
    service.warn('Warning message', null, 'test-category');

    const logs = service.getLogs();
    expect(logs.length).toBe(1);
    expect(logs[0].level).toBe('warn');
    expect(logs[0].message).toBe('Warning message');
    expect(logs[0].category).toBe('test-category');
  });

  it('should log error messages', () => {
    service.error('Error message');

    const logs = service.getLogs();
    expect(logs.length).toBe(1);
    expect(logs[0].level).toBe('error');
    expect(logs[0].message).toBe('Error message');
  });

  it('should respect minimum log level', () => {
    service.configure({ minLogLevel: 'warn' });

    service.debug('Debug message');
    service.info('Info message');
    service.warn('Warning message');
    service.error('Error message');

    const logs = service.getLogs();
    expect(logs.length).toBe(2);
    expect(logs[0].level).toBe('error');
    expect(logs[1].level).toBe('warn');
  });

  it('should filter by categories when configured', () => {
    service.configure({ categories: ['allowed'] });

    service.info('Allowed message', null, 'allowed');
    service.info('Blocked message', null, 'blocked');
    service.info('No category message');

    const logs = service.getLogs();
    expect(logs.length).toBe(1);
    expect(logs[0].message).toBe('Allowed message');
  });

  it('should get logs by level', () => {
    service.debug('Debug message');
    service.info('Info message');
    service.warn('Warning message');
    service.error('Error message');

    const errorLogs = service.getLogsByLevel('error');
    const infoLogs = service.getLogsByLevel('info');

    expect(errorLogs.length).toBe(1);
    expect(errorLogs[0].message).toBe('Error message');
    expect(infoLogs.length).toBe(1);
    expect(infoLogs[0].message).toBe('Info message');
  });

  it('should get logs by category', () => {
    service.info('User message', null, 'user');
    service.info('System message', null, 'system');
    service.info('User message 2', null, 'user');

    const userLogs = service.getLogsByCategory('user');
    const systemLogs = service.getLogsByCategory('system');

    expect(userLogs.length).toBe(2);
    expect(systemLogs.length).toBe(1);
  });

  it('should get logs by time range', () => {
    const startTime = Date.now();

    service.info('Message 1');

    // Wait a bit and add another message
    setTimeout(() => {
      service.info('Message 2');

      const endTime = Date.now();
      const logsInRange = service.getLogsByTimeRange(startTime, endTime);

      expect(logsInRange.length).toBe(2);
    }, 10);
  });

  it('should clear all logs', () => {
    service.info('Message 1');
    service.info('Message 2');

    expect(service.getLogs().length).toBe(2);

    service.clearLogs();

    expect(service.getLogs().length).toBe(0);
  });

  it('should export logs as JSON', () => {
    service.info('Test message');

    const jsonLogs = service.exportLogs();
    const parsedLogs = JSON.parse(jsonLogs);

    expect(Array.isArray(parsedLogs)).toBe(true);
    expect(parsedLogs.length).toBe(1);
    expect(parsedLogs[0].message).toBe('Test message');
  });

  it('should import logs from JSON', () => {
    const testLogs = [
      {
        id: 'test1',
        level: 'info' as LogLevel,
        message: 'Imported message',
        timestamp: Date.now(),
        sessionId: 'test-session',
      },
    ];

    service.importLogs(JSON.stringify(testLogs));

    const logs = service.getLogs();
    expect(logs.length).toBe(1);
    expect(logs[0].message).toBe('Imported message');
  });

  it('should log user activity', () => {
    service.logUserActivity('login', { userId: '123' });

    const logs = service.getLogs();
    expect(logs.length).toBe(1);
    expect(logs[0].message).toBe('User Activity: login');
    expect(logs[0].category).toBe('user-activity');
    expect(logs[0].data).toEqual({ userId: '123' });
  });

  it('should log performance metrics', () => {
    service.logPerformance('page-load', 1500);

    const logs = service.getLogs();
    expect(logs.length).toBe(1);
    expect(logs[0].message).toBe('Performance: page-load');
    expect(logs[0].category).toBe('performance');
    expect(logs[0].data).toEqual({ value: 1500, unit: 'ms' });
  });

  it('should log API calls', () => {
    service.logApiCall('GET', '/api/users', 250, 200);

    const logs = service.getLogs();
    expect(logs.length).toBe(1);
    expect(logs[0].message).toBe('API Call: GET /api/users');
    expect(logs[0].category).toBe('api');
    expect(logs[0].data).toEqual({ duration: 250, status: 200 });
    expect(logs[0].level).toBe('info');
  });

  it('should log API errors with error level', () => {
    service.logApiCall('POST', '/api/users', 100, 500);

    const logs = service.getLogs();
    expect(logs.length).toBe(1);
    expect(logs[0].level).toBe('error');
  });

  it('should generate log statistics', () => {
    service.debug('Debug message');
    service.info('Info message');
    service.warn('Warning message');
    service.error('Error message');
    service.error('Another error');

    const stats = service.getLogStatistics();

    expect(stats['total']).toBe(5);
    expect(stats['debug']).toBe(1);
    expect(stats['info']).toBe(1);
    expect(stats['warn']).toBe(1);
    expect(stats['error']).toBe(2);
  });

  it('should trim logs when max size is exceeded', () => {
    service.configure({ maxStoredLogs: 3 });

    service.info('Message 1');
    service.info('Message 2');
    service.info('Message 3');
    service.info('Message 4');
    service.info('Message 5');

    const logs = service.getLogs();
    expect(logs.length).toBe(3);
    // Should keep the most recent logs
    expect(logs[0].message).toBe('Message 5');
    expect(logs[1].message).toBe('Message 4');
    expect(logs[2].message).toBe('Message 3');
  });
});
