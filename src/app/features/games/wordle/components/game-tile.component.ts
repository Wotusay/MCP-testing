import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { TileState } from '../services/wordle-game.service';

@Component({
  selector: 'app-game-tile',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="w-14 h-14 border-2 flex items-center justify-center text-2xl font-bold uppercase transition-all duration-300"
      [class]="tileClasses"
      [attr.aria-label]="ariaLabel"
    >
      {{ letter }}
    </div>
  `,
})
export class GameTileComponent {
  @Input() letter: string = '';
  @Input() state: TileState = 'empty';
  @Input() isCurrentPosition: boolean = false;

  get tileClasses(): string {
    const baseClasses = 'rounded-md';

    // Add animation for current position
    const positionClasses = this.isCurrentPosition
      ? 'border-secondary-400 dark:border-secondary-500'
      : '';

    // State-specific classes
    const stateClasses = this.getStateClasses();

    return `${baseClasses} ${positionClasses} ${stateClasses}`.trim();
  }

  private getStateClasses(): string {
    switch (this.state) {
      case 'correct':
        return 'bg-success-500 border-success-500 text-white dark:bg-success-600 dark:border-success-600';
      case 'present':
        return 'bg-warning-500 border-warning-500 text-white dark:bg-warning-600 dark:border-warning-600';
      case 'absent':
        return 'bg-secondary-500 border-secondary-500 text-white dark:bg-secondary-600 dark:border-secondary-600';
      default:
        // Empty state
        if (this.letter) {
          return 'bg-white dark:bg-gray-800 border-secondary-300 dark:border-secondary-600 text-secondary-900 dark:text-secondary-100';
        }
        return 'bg-white dark:bg-gray-800 border-secondary-200 dark:border-secondary-700 text-secondary-900 dark:text-secondary-100';
    }
  }

  get ariaLabel(): string {
    if (!this.letter) {
      return 'Empty tile';
    }

    const stateDescription = {
      correct: 'correct position',
      present: 'wrong position',
      absent: 'not in word',
      empty: '',
    };

    const description = stateDescription[this.state];
    return description ? `${this.letter}, ${description}` : this.letter;
  }
}
