import { Component, Input, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

/**
 * Base abstract component class that provides common functionality
 * for all components in the application.
 *
 * Features:
 * - Automatic subscription cleanup
 * - Loading state management
 * - Error handling
 * - Accessibility support
 * - Common component patterns
 */
@Component({ template: '' })
export abstract class BaseComponent implements OnDestroy {
  /**
   * Subject for managing component destruction and cleanup
   */
  protected readonly destroy$ = new Subject<void>();

  /**
   * Loading state for async operations
   */
  @Input() loading: boolean = false;

  /**
   * Disabled state for interactive components
   */
  @Input() disabled: boolean = false;

  /**
   * CSS class names to apply to the component
   */
  @Input() cssClass: string = '';

  /**
   * Accessibility attributes
   */
  @Input() ariaLabel?: string;
  @Input() ariaDescribedBy?: string;

  /**
   * Error state and message
   */
  protected error: string | null = null;

  /**
   * Set error state
   */
  protected setError(error: string | Error | null): void {
    if (error instanceof Error) {
      this.error = error.message;
    } else {
      this.error = error;
    }
  }

  /**
   * Clear error state
   */
  protected clearError(): void {
    this.error = null;
  }

  /**
   * Check if component has error
   */
  protected hasError(): boolean {
    return this.error !== null;
  }

  /**
   * Get component CSS classes with common patterns
   */
  protected getComponentClasses(): string {
    const classes = [this.cssClass];

    if (this.loading) {
      classes.push('opacity-50 pointer-events-none');
    }

    if (this.disabled) {
      classes.push('opacity-50 cursor-not-allowed');
    }

    if (this.hasError()) {
      classes.push('border-red-500 dark:border-red-400');
    }

    return classes.filter(Boolean).join(' ');
  }

  /**
   * Get accessibility attributes object
   */
  protected getAccessibilityAttributes(): Record<string, string | undefined> {
    return {
      'aria-label': this.ariaLabel,
      'aria-describedby': this.ariaDescribedBy,
      'aria-disabled': this.disabled ? 'true' : undefined,
      'aria-busy': this.loading ? 'true' : undefined,
    };
  }

  /**
   * Cleanup on component destruction
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
