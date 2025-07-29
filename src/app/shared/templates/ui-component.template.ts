import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
} from '@angular/core';
import { BaseComponent } from '../base/base.component';
import {
  VariantComponent,
  ColorVariant,
  SizeVariant,
} from '../base/component.interfaces';

/**
 * Template for creating UI components
 *
 * Replace COMPONENT_NAME with your actual component name
 * Replace SELECTOR_NAME with your component selector
 *
 * Usage:
 * 1. Copy this file to your component location
 * 2. Rename the file and class name
 * 3. Update the selector
 * 4. Implement your specific functionality
 * 5. Add your template and styles
 */

@Component({
  selector: 'app-component-name',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      [class]="componentClasses"
      [attr.aria-label]="ariaLabel"
      [attr.aria-describedby]="ariaDescribedBy"
      [attr.aria-disabled]="disabled"
    >
      <!-- Add your component template here -->
      <ng-content></ng-content>

      <!-- Error display -->
      @if (hasError()) {
        <div class="text-red-600 dark:text-red-400 text-sm mt-1">
          {{ error }}
        </div>
      }
    </div>
  `,
})
export class COMPONENT_NAMEComponent
  extends BaseComponent
  implements VariantComponent
{
  // Component-specific inputs
  @Input() variant: ColorVariant = 'primary';
  @Input() size: SizeVariant = 'md';

  // Component-specific outputs
  @Output() componentClick = new EventEmitter<void>();

  /**
   * Get component-specific CSS classes
   */
  get componentClasses(): string {
    const baseClasses = this.getComponentClasses();
    const variantClasses = this.getVariantClasses();
    const sizeClasses = this.getSizeClasses();

    return `${baseClasses} ${variantClasses} ${sizeClasses}`.trim();
  }

  /**
   * Handle component click
   */
  onClick(): void {
    if (!this.disabled && !this.loading) {
      this.componentClick.emit();
    }
  }

  /**
   * Get variant-specific CSS classes
   */
  private getVariantClasses(): string {
    const variants = {
      primary: 'bg-blue-600 hover:bg-blue-700 text-white',
      secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800',
      success: 'bg-green-600 hover:bg-green-700 text-white',
      warning: 'bg-yellow-600 hover:bg-yellow-700 text-white',
      danger: 'bg-red-600 hover:bg-red-700 text-white',
      info: 'bg-cyan-600 hover:bg-cyan-700 text-white',
    };
    return variants[this.variant];
  }

  /**
   * Get size-specific CSS classes
   */
  private getSizeClasses(): string {
    const sizes = {
      xs: 'px-2 py-1 text-xs',
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
      xl: 'px-8 py-4 text-xl',
    };
    return sizes[this.size];
  }
}
