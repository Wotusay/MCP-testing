/**
 * Error handling models and interfaces
 */

export type ErrorSeverity = 'low' | 'medium' | 'high' | 'critical';

export type ErrorCategory =
  | 'network'
  | 'validation'
  | 'authentication'
  | 'authorization'
  | 'business'
  | 'system'
  | 'user'
  | 'unknown';

export interface AppError {
  id: string;
  code: string;
  message: string;
  severity: ErrorSeverity;
  category: ErrorCategory;
  timestamp: number;
  details?: Record<string, unknown>;
  stack?: string;
  userAgent?: string;
  url?: string;
  userId?: string;
  sessionId?: string;
  retryable: boolean;
  handled: boolean;
}

export interface ErrorReport {
  error: AppError;
  context?: Record<string, unknown>;
  userFeedback?: string;
  reproductionSteps?: string[];
}

export interface ValidationError {
  field: string;
  message: string;
  code: string;
  value?: unknown;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

export interface ErrorHandlerOptions {
  showToUser?: boolean;
  logToConsole?: boolean;
  logToServer?: boolean;
  retryable?: boolean;
  category?: ErrorCategory;
  context?: Record<string, unknown>;
}

export interface RetryConfig {
  maxRetries: number;
  baseDelay: number;
  maxDelay: number;
  backoffMultiplier: number;
  retryCondition?: (error: AppError) => boolean;
}

export interface ErrorAction {
  label: string;
  action: () => void;
  primary?: boolean;
}

export interface ErrorDisplayConfig {
  title?: string;
  message: string;
  actions?: ErrorAction[];
  autoHide?: boolean;
  hideAfter?: number;
  icon?: string;
}

export type ErrorHandler = (
  error: AppError,
  options?: ErrorHandlerOptions,
) => void;
