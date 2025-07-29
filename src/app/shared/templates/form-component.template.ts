import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  forwardRef,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { BaseComponent } from '../base/base.component';

/**
 * Template for creating form input components
 *
 * Replace COMPONENT_NAME with your actual component name
 * Replace SELECTOR_NAME with your component selector
 *
 * Features:
 * - Implements ControlValueAccessor for Angular forms
 * - Extends BaseComponent for common functionality
 * - Includes validation states
 * - Accessibility support
 * - Error handling
 *
 * Usage:
 * 1. Copy this file to your component location
 * 2. Rename the file and class name
 * 3. Update the selector
 * 4. Implement your specific input type
 * 5. Update the template for your input type
 */

@Component({
  selector: 'app-component-name',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => COMPONENT_NAMEComponent),
      multi: true,
    },
  ],
  template: `
    <div class="form-field">
      <!-- Label -->
      @if (label) {
        <label
          [for]="inputId"
          class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          {{ label }}
          @if (required) {
            <span class="text-red-500 ml-1">*</span>
          }
        </label>
      }

      <!-- Input Container -->
      <div class="relative">
        <!-- Input Element -->
        <input
          [id]="inputId"
          [type]="inputType"
          [placeholder]="placeholder"
          [disabled]="disabled"
          [readonly]="readonly"
          [required]="required"
          [value]="value"
          [class]="inputClasses"
          [attr.aria-label]="ariaLabel || label"
          [attr.aria-describedby]="getAriaDescribedBy()"
          [attr.aria-invalid]="hasError() || invalid"
          (input)="onInput($event)"
          (blur)="onBlur()"
          (focus)="onFocus()"
        />

        <!-- Loading Indicator -->
        @if (loading) {
          <div class="absolute inset-y-0 right-0 flex items-center pr-3">
            <div
              class="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"
            ></div>
          </div>
        }
      </div>

      <!-- Help Text -->
      @if (helpText) {
        <p
          [id]="helpTextId"
          class="mt-1 text-sm text-gray-500 dark:text-gray-400"
        >
          {{ helpText }}
        </p>
      }

      <!-- Error Messages -->
      @if (hasError() || invalid) {
        <p [id]="errorId" class="mt-1 text-sm text-red-600 dark:text-red-400">
          {{ error || validationMessage }}
        </p>
      }
    </div>
  `,
})
export class COMPONENT_NAMEComponent
  extends BaseComponent
  implements ControlValueAccessor
{
  // Form input properties
  @Input() label?: string;
  @Input() placeholder: string = '';
  @Input() required: boolean = false;
  @Input() readonly: boolean = false;
  @Input() helpText?: string;
  @Input() inputType: string = 'text';
  @Input() validationMessage?: string;
  @Input() invalid: boolean = false;

  // Events
  @Output() valueChange = new EventEmitter<unknown>();
  @Output() inputBlur = new EventEmitter<void>();
  @Output() inputFocus = new EventEmitter<void>();

  // Internal properties
  value: unknown = '';
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onChange = (_value: unknown): void => {};
  onTouched = (): void => {};

  // Unique IDs for accessibility
  private static idCounter = 0;
  private componentId = ++COMPONENT_NAMEComponent.idCounter;

  get inputId(): string {
    return `input-${this.componentId}`;
  }

  get helpTextId(): string {
    return `help-${this.componentId}`;
  }

  get errorId(): string {
    return `error-${this.componentId}`;
  }

  /**
   * Get CSS classes for input element
   */
  get inputClasses(): string {
    const baseClasses = [
      'block w-full px-3 py-2 border rounded-md shadow-sm',
      'placeholder-gray-400 dark:placeholder-gray-500',
      'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
      'dark:bg-gray-800 dark:text-gray-100',
      'transition-colors duration-200',
    ];

    // State-specific classes
    if (this.disabled) {
      baseClasses.push('bg-gray-50 dark:bg-gray-900 cursor-not-allowed');
    } else if (this.readonly) {
      baseClasses.push('bg-gray-50 dark:bg-gray-900');
    } else {
      baseClasses.push('bg-white dark:bg-gray-800');
    }

    // Validation classes
    if (this.hasError() || this.invalid) {
      baseClasses.push('border-red-500 dark:border-red-400');
    } else {
      baseClasses.push('border-gray-300 dark:border-gray-600');
    }

    const componentClasses = this.getComponentClasses();
    return [...baseClasses, componentClasses].join(' ');
  }

  /**
   * Get aria-describedby attribute value
   */
  getAriaDescribedBy(): string {
    const ids = [];

    if (this.helpText) {
      ids.push(this.helpTextId);
    }

    if (this.hasError() || this.invalid) {
      ids.push(this.errorId);
    }

    if (this.ariaDescribedBy) {
      ids.push(this.ariaDescribedBy);
    }

    return ids.join(' ') || '';
  }

  /**
   * Handle input events
   */
  onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.value = target.value;
    this.onChange(this.value);
    this.valueChange.emit(this.value);
    this.clearError();
  }

  /**
   * Handle blur events
   */
  onBlur(): void {
    this.onTouched();
    this.inputBlur.emit();
  }

  /**
   * Handle focus events
   */
  onFocus(): void {
    this.inputFocus.emit();
  }

  // ControlValueAccessor implementation
  writeValue(value: unknown): void {
    this.value = value || '';
  }

  registerOnChange(fn: (value: unknown) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
