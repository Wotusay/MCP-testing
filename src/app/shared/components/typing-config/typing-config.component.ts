import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
} from '@angular/core';
import { NgFor, TitleCasePipe } from '@angular/common';

export interface TestConfig {
  mode: 'time' | 'words';
  duration: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

@Component({
  selector: 'app-typing-config',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgFor, TitleCasePipe],
  template: `
    <div
      class="bg-secondary-50 dark:bg-secondary-800 rounded-lg p-6 border border-secondary-200 dark:border-secondary-700"
    >
      <h3 class="text-h4 mb-4 text-center">Test Settings</h3>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <!-- Mode Selection -->
        <div>
          <label
            class="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2"
          >
            Test Mode
          </label>
          <div class="flex gap-2">
            <button
              *ngFor="let mode of modeOptions"
              (click)="onModeChange(mode)"
              [class]="getModeButtonClass(mode)"
            >
              {{ mode === 'time' ? 'Timed' : 'Word Count' }}
            </button>
          </div>
        </div>

        <!-- Duration/Count Selection -->
        <div>
          <label
            class="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2"
          >
            {{ config.mode === 'time' ? 'Duration (seconds)' : 'Word Count' }}
          </label>
          <div class="flex gap-2 flex-wrap">
            <button
              *ngFor="let option of getDurationOptions()"
              (click)="onDurationChange(option)"
              [class]="getDurationButtonClass(option)"
            >
              {{ option }}{{ config.mode === 'time' ? 's' : '' }}
            </button>
          </div>
        </div>

        <!-- Difficulty Selection -->
        <div>
          <label
            class="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2"
          >
            Difficulty
          </label>
          <div class="flex gap-2">
            <button
              *ngFor="let diff of difficultyOptions"
              (click)="onDifficultyChange(diff)"
              [class]="getDifficultyButtonClass(diff)"
            >
              {{ diff | titlecase }}
            </button>
          </div>
        </div>
      </div>

      <div class="mt-6 text-center">
        <button
          (click)="onStartTest()"
          class="px-8 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
        >
          Start Test
        </button>
      </div>
    </div>
  `,
})
export class TypingConfigComponent {
  @Input() config!: TestConfig;
  @Output() configChange = new EventEmitter<TestConfig>();
  @Output() startTest = new EventEmitter<void>();

  protected readonly modeOptions: Array<'time' | 'words'> = ['time', 'words'];
  protected readonly difficultyOptions: Array<'easy' | 'medium' | 'hard'> = [
    'easy',
    'medium',
    'hard',
  ];

  protected onModeChange(mode: 'time' | 'words'): void {
    const newConfig = {
      ...this.config,
      mode,
      duration: mode === 'time' ? 60 : 25,
    };
    this.configChange.emit(newConfig);
  }

  protected onDurationChange(duration: number): void {
    const newConfig = { ...this.config, duration };
    this.configChange.emit(newConfig);
  }

  protected onDifficultyChange(difficulty: 'easy' | 'medium' | 'hard'): void {
    const newConfig = { ...this.config, difficulty };
    this.configChange.emit(newConfig);
  }

  protected onStartTest(): void {
    this.startTest.emit();
  }

  protected getDurationOptions(): number[] {
    return this.config.mode === 'time' ? [15, 30, 60, 120] : [10, 25, 50, 100];
  }

  protected getModeButtonClass(mode: string): string {
    const baseClasses =
      'px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800';
    return this.config.mode === mode
      ? `${baseClasses} bg-primary-600 text-white`
      : `${baseClasses} bg-secondary-100 dark:bg-secondary-700 text-secondary-700 dark:text-secondary-300 hover:bg-secondary-200 dark:hover:bg-secondary-600`;
  }

  protected getDurationButtonClass(duration: number): string {
    const baseClasses =
      'px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800';
    return this.config.duration === duration
      ? `${baseClasses} bg-primary-600 text-white`
      : `${baseClasses} bg-secondary-100 dark:bg-secondary-700 text-secondary-700 dark:text-secondary-300 hover:bg-secondary-200 dark:hover:bg-secondary-600`;
  }

  protected getDifficultyButtonClass(difficulty: string): string {
    const baseClasses =
      'px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800';
    return this.config.difficulty === difficulty
      ? `${baseClasses} bg-primary-600 text-white`
      : `${baseClasses} bg-secondary-100 dark:bg-secondary-700 text-secondary-700 dark:text-secondary-300 hover:bg-secondary-200 dark:hover:bg-secondary-600`;
  }
}
