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
      class="font-bold rounded-lg transition duration-200"
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
    const baseClasses = this.getVariantClasses() + ' ' + this.getSizeClasses();
    return this.disabled
      ? baseClasses + ' opacity-50 cursor-not-allowed'
      : baseClasses;
  }

  private getVariantClasses(): string {
    const variants = {
      primary: 'bg-primary-600 hover:bg-primary-700 text-white',
      secondary:
        'bg-theme-secondary hover:bg-theme-tertiary text-theme-primary border border-theme',
      success: 'bg-success-600 hover:bg-success-700 text-white',
      danger: 'bg-danger-600 hover:bg-danger-700 text-white',
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
}
