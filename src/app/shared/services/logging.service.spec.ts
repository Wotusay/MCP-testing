import { TestBed } from '@angular/core/testing';
import { LoggingService } from './logging.service';

describe('LoggingService', () => {
  let service: LoggingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LoggingService],
    });

    service = TestBed.inject(LoggingService);

    // Replace console methods with spies
    spyOn(console, 'debug');
    spyOn(console, 'info');
    spyOn(console, 'warn');
    spyOn(console, 'error');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should log debug messages', () => {
    const message = 'Debug message';
    const data = { test: 'data' };

    service.debug(message, data, 'TEST');

    const logs = service.getLogs();
    expect(logs.length).toBe(1);
    expect(logs[0].level).toBe('debug');
    expect(logs[0].message).toBe(message);
    expect(logs[0].data).toEqual(data);
    expect(logs[0].source).toBe('TEST');
  });

  it('should log info messages', () => {
    const message = 'Info message';

    service.info(message);

    const logs = service.getLogs();
    expect(logs.length).toBe(1);
    expect(logs[0].level).toBe('info');
    expect(logs[0].message).toBe(message);
  });

  it('should log warning messages', () => {
    const message = 'Warning message';

    service.warn(message);

    const logs = service.getLogs();
    expect(logs.length).toBe(1);
    expect(logs[0].level).toBe('warn');
    expect(logs[0].message).toBe(message);
  });

  it('should log error messages', () => {
    const message = 'Error message';

    service.error(message);

    const logs = service.getLogs();
    expect(logs.length).toBe(1);
    expect(logs[0].level).toBe('error');
    expect(logs[0].message).toBe(message);
  });

  it('should log HTTP requests', () => {
    service.logHttpRequest('GET', '/api/test', { param: 'value' });

    const logs = service.getLogs();
    expect(logs.length).toBe(1);
    expect(logs[0].level).toBe('info');
    expect(logs[0].message).toBe('HTTP GET /api/test');
    expect(logs[0].source).toBe('HTTP');
  });

  it('should log HTTP responses', () => {
    service.logHttpResponse('POST', '/api/test', 201, { id: 1 });

    const logs = service.getLogs();
    expect(logs.length).toBe(1);
    expect(logs[0].level).toBe('info');
    expect(logs[0].message).toBe('HTTP POST /api/test - 201');
    expect(logs[0].source).toBe('HTTP');
  });

  it('should log HTTP error responses as errors', () => {
    service.logHttpResponse('GET', '/api/test', 500);

    const logs = service.getLogs();
    expect(logs.length).toBe(1);
    expect(logs[0].level).toBe('error');
    expect(logs[0].message).toBe('HTTP GET /api/test - 500');
  });

  it('should log user actions', () => {
    service.logUserAction('button_click', { button: 'submit' });

    const logs = service.getLogs();
    expect(logs.length).toBe(1);
    expect(logs[0].level).toBe('info');
    expect(logs[0].message).toBe('User action: button_click');
    expect(logs[0].source).toBe('USER');
  });

  it('should log performance metrics', () => {
    service.logPerformance('page_load', 150);

    const logs = service.getLogs();
    expect(logs.length).toBe(1);
    expect(logs[0].level).toBe('info');
    expect(logs[0].message).toBe('Performance: page_load = 150ms');
    expect(logs[0].source).toBe('PERF');
  });

  it('should filter logs by level', () => {
    service.info('Info message');
    service.warn('Warning message');
    service.error('Error message');

    const errorLogs = service.getLogsByLevel('error');
    expect(errorLogs.length).toBe(1);
    expect(errorLogs[0].message).toBe('Error message');
  });

  it('should filter logs by source', () => {
    service.info('Message 1', undefined, 'SOURCE1');
    service.info('Message 2', undefined, 'SOURCE2');
    service.info('Message 3', undefined, 'SOURCE1');

    const source1Logs = service.getLogsBySource('SOURCE1');
    expect(source1Logs.length).toBe(2);
  });

  it('should clear logs', () => {
    service.info('Test message');
    expect(service.getLogs().length).toBe(1);

    service.clearLogs();
    expect(service.getLogs().length).toBe(0);
  });

  it('should export logs as JSON', () => {
    service.info('Test message');

    const exported = service.exportLogs();
    const parsed = JSON.parse(exported);

    expect(Array.isArray(parsed)).toBeTrue();
    expect(parsed.length).toBe(1);
    expect(parsed[0].message).toBe('Test message');
  });

  it('should provide log statistics', () => {
    service.debug('Debug');
    service.info('Info');
    service.warn('Warning');
    service.error('Error');
    service.error('Another error');

    const stats = service.getLogStats();

    expect(stats.debug).toBe(1);
    expect(stats.info).toBe(1);
    expect(stats.warn).toBe(1);
    expect(stats.error).toBe(2);
  });
});
