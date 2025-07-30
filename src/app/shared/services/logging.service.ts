import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogEntry {
  id: string;
  level: LogLevel;
  message: string;
  timestamp: number;
  category?: string;
  data?: unknown;
  userId?: string;
  sessionId?: string;
  url?: string;
  userAgent?: string;
}

export interface LogConfig {
  enableConsole: boolean;
  enableStorage: boolean;
  enableRemote: boolean;
  maxStoredLogs: number;
  minLogLevel: LogLevel;
  remoteEndpoint?: string;
  categories?: string[];
}

@Injectable({
  providedIn: 'root',
})
export class LoggingService {
  private readonly platformId = inject(PLATFORM_ID);
  private logs: LogEntry[] = [];
  private sessionId: string;

  private config: LogConfig = {
    enableConsole: true,
    enableStorage: true,
    enableRemote: false,
    maxStoredLogs: 1000,
    minLogLevel: 'debug',
    categories: [],
  };

  private readonly logLevels: Record<LogLevel, number> = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
  };

  constructor() {
    this.sessionId = this.generateSessionId();
    this.loadStoredLogs();
  }

  /**
   * Configure the logging service
   */
  configure(config: Partial<LogConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Log a debug message
   */
  debug(message: string, data?: unknown, category?: string): void {
    this.log('debug', message, data, category);
  }

  /**
   * Log an informational message
   */
  info(message: string, data?: unknown, category?: string): void {
    this.log('info', message, data, category);
  }

  /**
   * Log a warning message
   */
  warn(message: string, data?: unknown, category?: string): void {
    this.log('warn', message, data, category);
  }

  /**
   * Log an error message
   */
  error(message: string, data?: unknown, category?: string): void {
    this.log('error', message, data, category);
  }

  /**
   * Log a message with specified level
   */
  log(
    level: LogLevel,
    message: string,
    data?: unknown,
    category?: string,
  ): void {
    // Check if logging is enabled for this level
    if (this.logLevels[level] < this.logLevels[this.config.minLogLevel]) {
      return;
    }

    // Check if category is allowed
    if (this.config.categories && this.config.categories.length > 0) {
      if (!category || !this.config.categories.includes(category)) {
        return;
      }
    }

    const logEntry: LogEntry = {
      id: this.generateLogId(),
      level,
      message,
      timestamp: Date.now(),
      category,
      data,
      sessionId: this.sessionId,
      ...(isPlatformBrowser(this.platformId) && {
        url: window.location.href,
        userAgent: navigator.userAgent,
      }),
    };

    this.addLogEntry(logEntry);
  }

  /**
   * Log user activity
   */
  logUserActivity(activity: string, details?: Record<string, unknown>): void {
    this.info(`User Activity: ${activity}`, details, 'user-activity');
  }

  /**
   * Log performance metrics
   */
  logPerformance(metric: string, value: number, unit: string = 'ms'): void {
    this.info(`Performance: ${metric}`, { value, unit }, 'performance');
  }

  /**
   * Log API calls
   */
  logApiCall(
    method: string,
    url: string,
    duration: number,
    status?: number,
  ): void {
    const level: LogLevel = status && status >= 400 ? 'error' : 'info';
    this.log(level, `API Call: ${method} ${url}`, { duration, status }, 'api');
  }

  /**
   * Get all logs
   */
  getLogs(): LogEntry[] {
    return [...this.logs].reverse();
  }

  /**
   * Get logs by level
   */
  getLogsByLevel(level: LogLevel): LogEntry[] {
    return this.logs.filter((log) => log.level === level);
  }

  /**
   * Get logs by category
   */
  getLogsByCategory(category: string): LogEntry[] {
    return this.logs.filter((log) => log.category === category);
  }

  /**
   * Get logs within a time range
   */
  getLogsByTimeRange(startTime: number, endTime: number): LogEntry[] {
    return this.logs.filter(
      (log) => log.timestamp >= startTime && log.timestamp <= endTime,
    );
  }

  /**
   * Clear all logs
   */
  clearLogs(): void {
    this.logs = [];
    this.clearStoredLogs();
  }

  /**
   * Export logs as JSON
   */
  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }

  /**
   * Import logs from JSON
   */
  importLogs(jsonLogs: string): void {
    try {
      const importedLogs = JSON.parse(jsonLogs) as LogEntry[];
      this.logs = [...this.logs, ...importedLogs];
      this.trimLogs();
      this.storeLogsLocally();
    } catch (error) {
      this.error('Failed to import logs', { error: (error as Error).message });
    }
  }

  /**
   * Send logs to remote endpoint
   */
  async sendLogsToRemote(logs?: LogEntry[]): Promise<void> {
    if (!this.config.enableRemote || !this.config.remoteEndpoint) {
      return;
    }

    const logsToSend = logs || this.logs;

    try {
      const response = await fetch(this.config.remoteEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId: this.sessionId,
          logs: logsToSend,
          timestamp: Date.now(),
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to send logs: ${response.status}`);
      }

      this.debug('Logs sent to remote endpoint successfully');
    } catch (error) {
      this.error('Failed to send logs to remote endpoint', {
        error: (error as Error).message,
      });
    }
  }

  /**
   * Get log statistics
   */
  getLogStatistics(): Record<string, number> {
    const stats: Record<string, number> = {
      total: this.logs.length,
      debug: 0,
      info: 0,
      warn: 0,
      error: 0,
    };

    this.logs.forEach((log) => {
      stats[log.level]++;
    });

    return stats;
  }

  private addLogEntry(logEntry: LogEntry): void {
    this.logs.push(logEntry);
    this.trimLogs();

    // Console logging
    if (this.config.enableConsole) {
      this.logToConsole(logEntry);
    }

    // Local storage
    if (this.config.enableStorage && isPlatformBrowser(this.platformId)) {
      this.storeLogsLocally();
    }

    // Remote logging (async)
    if (this.config.enableRemote) {
      this.sendLogsToRemote([logEntry]).catch(() => {
        // Silent fail for remote logging
      });
    }
  }

  private logToConsole(logEntry: LogEntry): void {
    const prefix = `[${new Date(logEntry.timestamp).toISOString()}]`;
    const category = logEntry.category ? `[${logEntry.category}]` : '';
    const message = `${prefix} ${category} ${logEntry.message}`;

    switch (logEntry.level) {
      case 'debug':
        // eslint-disable-next-line no-console
        console.debug(message, logEntry.data);
        break;
      case 'info':
        // eslint-disable-next-line no-console
        console.info(message, logEntry.data);
        break;
      case 'warn':
        // eslint-disable-next-line no-console
        console.warn(message, logEntry.data);
        break;
      case 'error':
        // eslint-disable-next-line no-console
        console.error(message, logEntry.data);
        break;
    }
  }

  private trimLogs(): void {
    if (this.logs.length > this.config.maxStoredLogs) {
      this.logs = this.logs.slice(-this.config.maxStoredLogs);
    }
  }

  private storeLogsLocally(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    try {
      const logsToStore = this.logs.slice(-100); // Store only last 100 logs
      localStorage.setItem('app_logs', JSON.stringify(logsToStore));
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn('Failed to store logs locally:', error);
    }
  }

  private loadStoredLogs(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    try {
      const storedLogs = localStorage.getItem('app_logs');
      if (storedLogs) {
        const parsedLogs = JSON.parse(storedLogs) as LogEntry[];
        this.logs = parsedLogs;
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn('Failed to load stored logs:', error);
    }
  }

  private clearStoredLogs(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    try {
      localStorage.removeItem('app_logs');
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn('Failed to clear stored logs:', error);
    }
  }

  private generateLogId(): string {
    return `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
