import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export type ButtonVariant = 'primary' | 'secondary' | 'success' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      [attr.color]="materialColor"
      [class]="buttonClasses"
      (click)="buttonClick.emit()"
      [disabled]="disabled"
      mat-flat-button
    >
      <mat-icon *ngIf="icon" class="material-icon">{{ icon }}</mat-icon>
      {{ text }}
    </button>
  `,
  styles: [
    `
      .material-icon {
        margin-right: 8px;
        font-size: 1.2em;
      }

      /* Custom variant colors that integrate with Material theming */
      .success-button {
        background-color: #10b981;
        color: white;
      }
      .success-button:hover {
        background-color: #059669;
      }

      .danger-button {
        background-color: #ef4444;
        color: white;
      }
      .danger-button:hover {
        background-color: #dc2626;
      }

      /* Size variations */
      .size-sm {
        font-size: 0.875rem;
        padding: 6px 16px;
        min-height: 32px;
      }

      .size-lg {
        font-size: 1.125rem;
        padding: 12px 24px;
        min-height: 48px;
      }
    `,
  ],
})
export class ButtonComponent {
  @Input() text: string = '';
  @Input() variant: ButtonVariant = 'primary';
  @Input() size: ButtonSize = 'md';
  @Input() disabled: boolean = false;
  @Input() icon?: string; // New: Material icon name
  @Output() buttonClick = new EventEmitter<void>();

  get materialColor(): string {
    // Map variants to Material colors
    switch (this.variant) {
      case 'primary':
        return 'primary';
      case 'secondary':
        return 'accent';
      default:
        return '';
    }
  }

  get buttonClasses(): string {
    const classes = [];

    // Add variant-specific classes
    if (this.variant === 'success') {
      classes.push('success-button');
    } else if (this.variant === 'danger') {
      classes.push('danger-button');
    }

    // Add size classes
    if (this.size === 'sm') {
      classes.push('size-sm');
    } else if (this.size === 'lg') {
      classes.push('size-lg');
    }

    return classes.join(' ');
  }
}
