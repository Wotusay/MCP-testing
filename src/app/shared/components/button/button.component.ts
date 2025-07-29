import { Component, Input, Output, EventEmitter } from '@angular/core';

export type ButtonVariant = 'primary' | 'secondary' | 'success' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-button',
  standalone: true,
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
      primary: 'bg-blue-600 hover:bg-blue-700 text-white',
      secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800',
      success: 'bg-green-600 hover:bg-green-700 text-white',
      danger: 'bg-red-600 hover:bg-red-700 text-white',
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
