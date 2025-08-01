import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
} from '@angular/core';

export type ButtonVariant = 'primary' | 'secondary' | 'success' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-button',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      class="font-bold rounded-lg transition duration-200 focus:outline-none"
      [class]="buttonClasses"
      (click)="buttonClick.emit()"
      [disabled]="disabled"
    >
      {{ text }}
    </button>
  `,
})
export class ButtonComponent {
  @Input() text: string = '';
  @Input() variant: ButtonVariant = 'primary';
  @Input() size: ButtonSize = 'md';
  @Input() disabled: boolean = false;
  @Output() buttonClick = new EventEmitter<void>();

  handleKeydown(event: KeyboardEvent): void {
    if (!this.disabled && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      this.buttonClick.emit();
    }
  }

  get buttonClasses(): string {
    const baseClasses =
      this.getVariantClasses() +
      ' ' +
      this.getSizeClasses() +
      ' ' +
      this.getFocusClasses();
    return this.disabled
      ? baseClasses + ' opacity-50 cursor-not-allowed'
      : baseClasses;
  }

  private getVariantClasses(): string {
    const variants = {
      primary:
        'bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 text-white',
      secondary:
        'bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700',
      success:
        'bg-success-600 hover:bg-success-700 dark:bg-success-500 dark:hover:bg-success-600 text-white',
      danger:
        'bg-danger-600 hover:bg-danger-700 dark:bg-danger-500 dark:hover:bg-danger-600 text-white',
    };
    return variants[this.variant];
  }

  private getSizeClasses(): string {
    const sizes = {
      sm: 'py-1 px-3 text-sm',
      md: 'py-2 px-4',
      lg: 'py-3 px-6 text-lg',
    };
    return sizes[this.size];
  }

  private getFocusClasses(): string {
    const focusClasses = {
      sm: 'focus:ring-2 focus:ring-primary-500 focus:ring-offset-1',
      md: 'focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
      lg: 'focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
    };
    return focusClasses[this.size];
  }
}
