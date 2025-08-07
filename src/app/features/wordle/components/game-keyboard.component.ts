import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { KeyboardKeyState } from '../services/wordle-game.service';

@Component({
  selector: 'app-game-keyboard',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  template: `
    <div class="px-2 py-4" role="region" aria-label="Virtual keyboard">
      <!-- First row: QWERTYUIOP -->
      <div class="flex justify-center gap-1 mb-2">
        <button
          *ngFor="let key of topRow"
          class="keyboard-key"
          [class]="getKeyClasses(key)"
          (click)="onKeyPress(key)"
          [attr.aria-label]="getKeyAriaLabel(key)"
        >
          {{ key }}
        </button>
      </div>

      <!-- Second row: ASDFGHJKL -->
      <div class="flex justify-center gap-1 mb-2">
        <button
          *ngFor="let key of middleRow"
          class="keyboard-key"
          [class]="getKeyClasses(key)"
          (click)="onKeyPress(key)"
          [attr.aria-label]="getKeyAriaLabel(key)"
        >
          {{ key }}
        </button>
      </div>

      <!-- Third row: ENTER ZXCVBNM BACKSPACE -->
      <div class="flex justify-center gap-1">
        <button
          class="keyboard-key keyboard-key-wide font-bold text-sm"
          [class]="getKeyClasses('ENTER')"
          (click)="onEnterPress()"
          aria-label="Submit guess"
        >
          ENTER
        </button>

        <button
          *ngFor="let key of bottomRow"
          class="keyboard-key"
          [class]="getKeyClasses(key)"
          (click)="onKeyPress(key)"
          [attr.aria-label]="getKeyAriaLabel(key)"
        >
          {{ key }}
        </button>

        <button
          class="keyboard-key keyboard-key-wide"
          [class]="getKeyClasses('BACKSPACE')"
          (click)="onBackspacePress()"
          aria-label="Delete letter"
        >
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path
              d="M22 3H7c-.69 0-1.23.35-1.59.88L0 12l5.41 8.11c.36.53.9.89 1.59.89h15c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-3 12.59L17.59 17 14 13.41 10.41 17 9 15.59 12.59 12 9 8.41 10.41 7 14 10.59 17.59 7 19 8.41 15.41 12 19 15.59z"
            />
          </svg>
        </button>
      </div>
    </div>
  `,
  styles: [
    `
      .keyboard-key {
        @apply px-2 py-3 
        min-w-[40px] h-12 
        bg-secondary-200 hover:bg-secondary-300 
        dark:bg-secondary-700 dark:hover:bg-secondary-600 
        text-secondary-900 dark:text-secondary-100 
        font-bold text-sm 
        rounded 
        transition-colors duration-200 
        flex items-center justify-center
        border border-transparent;
      }

      .keyboard-key-wide {
        @apply min-w-[60px];
      }

      .keyboard-key:active {
        @apply transform scale-95;
      }

      .keyboard-key:disabled {
        @apply opacity-50 cursor-not-allowed;
      }
    `,
  ],
})
export class GameKeyboardComponent {
  @Input() keyboardState: Map<string, KeyboardKeyState> = new Map();
  @Input() disabled: boolean = false;

  @Output() letterPress = new EventEmitter<string>();
  @Output() enterPress = new EventEmitter<void>();
  @Output() backspacePress = new EventEmitter<void>();

  readonly topRow = ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'];
  readonly middleRow = ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'];
  readonly bottomRow = ['Z', 'X', 'C', 'V', 'B', 'N', 'M'];

  onKeyPress(key: string): void {
    if (!this.disabled) {
      this.letterPress.emit(key);
    }
  }

  onEnterPress(): void {
    if (!this.disabled) {
      this.enterPress.emit();
    }
  }

  onBackspacePress(): void {
    if (!this.disabled) {
      this.backspacePress.emit();
    }
  }

  getKeyClasses(key: string): string {
    const state = this.keyboardState.get(key);
    const disabledClass = this.disabled ? 'opacity-50 cursor-not-allowed' : '';

    switch (state) {
      case 'correct':
        return `bg-success-500 hover:bg-success-600 dark:bg-success-600 dark:hover:bg-success-700 text-white border-success-500 dark:border-success-600 ${disabledClass}`;
      case 'present':
        return `bg-warning-500 hover:bg-warning-600 dark:bg-warning-600 dark:hover:bg-warning-700 text-white border-warning-500 dark:border-warning-600 ${disabledClass}`;
      case 'absent':
        return `bg-secondary-500 hover:bg-secondary-600 dark:bg-secondary-600 dark:hover:bg-secondary-700 text-white border-secondary-500 dark:border-secondary-600 ${disabledClass}`;
      default:
        return disabledClass;
    }
  }

  getKeyAriaLabel(key: string): string {
    const state = this.keyboardState.get(key);
    const stateDescription: Record<string, string> = {
      correct: ' - correct',
      present: ' - wrong position',
      absent: ' - not in word',
    };

    return (
      key + (state && stateDescription[state] ? stateDescription[state] : '')
    );
  }
}
