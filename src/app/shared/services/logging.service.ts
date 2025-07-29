import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: Date;
  data?: unknown;
  source?: string;
}

@Injectable({
  providedIn: 'root',
})
export class LoggingService {
  private logs: LogEntry[] = [];
  private readonly maxLogs = 1000; // Keep last 1000 logs in memory
  private readonly isProduction = environment.production;

  /**
   * Log debug message
   */
  debug(message: string, data?: unknown, source?: string): void {
    this.log('debug', message, data, source);
  }

  /**
   * Log info message
   */
  info(message: string, data?: unknown, source?: string): void {
    this.log('info', message, data, source);
  }

  /**
   * Log warning message
   */
  warn(message: string, data?: unknown, source?: string): void {
    this.log('warn', message, data, source);
  }

  /**
   * Log error message
   */
  error(message: string, data?: unknown, source?: string): void {
    this.log('error', message, data, source);
  }

  /**
   * Log HTTP request
   */
  logHttpRequest(method: string, url: string, data?: unknown): void {
    this.info(`HTTP ${method.toUpperCase()} ${url}`, data, 'HTTP');
  }

  /**
   * Log HTTP response
   */
  logHttpResponse(
    method: string,
    url: string,
    status: number,
    data?: unknown,
  ): void {
    const level = status >= 400 ? 'error' : 'info';
    this.log(
      level,
      `HTTP ${method.toUpperCase()} ${url} - ${status}`,
      data,
      'HTTP',
    );
  }

  /**
   * Log user action
   */
  logUserAction(action: string, data?: unknown): void {
    this.info(`User action: ${action}`, data, 'USER');
  }

  /**
   * Log performance metric
   */
  logPerformance(metric: string, value: number, unit = 'ms'): void {
    this.info(
      `Performance: ${metric} = ${value}${unit}`,
      { value, unit },
      'PERF',
    );
  }

  /**
   * Get all logs
   */
  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  /**
   * Get logs by level
   */
  getLogsByLevel(level: LogLevel): LogEntry[] {
    return this.logs.filter((log) => log.level === level);
  }

  /**
   * Get logs by source
   */
  getLogsBySource(source: string): LogEntry[] {
    return this.logs.filter((log) => log.source === source);
  }

  /**
   * Clear all logs
   */
  clearLogs(): void {
    this.logs = [];
  }

  /**
   * Export logs as JSON string
   */
  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }

  /**
   * Get log statistics
   */
  getLogStats(): Record<LogLevel, number> {
    return {
      debug: this.logs.filter((log) => log.level === 'debug').length,
      info: this.logs.filter((log) => log.level === 'info').length,
      warn: this.logs.filter((log) => log.level === 'warn').length,
      error: this.logs.filter((log) => log.level === 'error').length,
    };
  }

  private log(
    level: LogLevel,
    message: string,
    data?: unknown,
    source?: string,
  ): void {
    const logEntry: LogEntry = {
      level,
      message,
      timestamp: new Date(),
      data,
      source,
    };

    // Add to internal log storage
    this.logs.push(logEntry);

    // Trim logs if we exceed max size
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    // Console output (respect log levels in production)
    if (!this.isProduction || level !== 'debug') {
      this.consoleOutput(logEntry);
    }
  }

  private consoleOutput(entry: LogEntry): void {
    const timestamp = entry.timestamp.toISOString();
    const source = entry.source ? `[${entry.source}]` : '';
    const prefix = `${timestamp} ${source}`.trim();

    switch (entry.level) {
      case 'debug':
        // eslint-disable-next-line no-console
        console.debug(`🐛 ${prefix}`, entry.message, entry.data || '');
        break;
      case 'info':
        // eslint-disable-next-line no-console
        console.info(`ℹ️ ${prefix}`, entry.message, entry.data || '');
        break;
      case 'warn':
        // eslint-disable-next-line no-console
        console.warn(`⚠️ ${prefix}`, entry.message, entry.data || '');
        break;
      case 'error':
        // eslint-disable-next-line no-console
        console.error(`❌ ${prefix}`, entry.message, entry.data || '');
        break;
    }
  }
}
