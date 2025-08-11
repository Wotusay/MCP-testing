import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { NgIf } from '@angular/common';

export interface TypingStats {
  wpm: number;
  accuracy: number;
  remainingTime: number;
  isComplete: boolean;
  duration?: number;
}

export interface TypingConfig {
  mode: 'time' | 'words';
}

@Component({
  selector: 'app-typing-stats',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgIf],
  template: `
    <!-- Live Stats During Test -->
    <div
      *ngIf="!stats.isComplete"
      class="flex justify-center gap-8 mb-8 text-center"
    >
      <div class="text-center">
        <div class="text-2xl font-bold text-primary-600 dark:text-primary-400">
          {{ stats.wpm }}
        </div>
        <div class="text-sm text-secondary-600 dark:text-secondary-400">
          WPM
        </div>
      </div>
      <div class="text-center">
        <div class="text-2xl font-bold text-success-600 dark:text-success-400">
          {{ stats.accuracy }}%
        </div>
        <div class="text-sm text-secondary-600 dark:text-secondary-400">
          Accuracy
        </div>
      </div>
      <div *ngIf="config.mode === 'time'" class="text-center">
        <div class="text-2xl font-bold text-warning-600 dark:text-warning-400">
          {{ stats.remainingTime }}
        </div>
        <div class="text-sm text-secondary-600 dark:text-secondary-400">
          Seconds
        </div>
      </div>
    </div>

    <!-- Final Results -->
    <div
      *ngIf="stats.isComplete"
      class="text-center p-8 bg-secondary-50 dark:bg-secondary-800 rounded-lg border border-secondary-200 dark:border-secondary-700 mb-8"
    >
      <div class="mb-6">
        <h3
          class="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mb-2"
        >
          🎉 Test Complete!
        </h3>
        <p class="text-secondary-600 dark:text-secondary-400">
          Great job! Here are your results:
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div
          class="text-center p-6 bg-white dark:bg-gray-800 rounded-lg border border-secondary-200 dark:border-secondary-700"
        >
          <div
            class="text-4xl font-bold text-primary-600 dark:text-primary-400 mb-2"
          >
            {{ stats.wpm }}
          </div>
          <div class="text-secondary-600 dark:text-secondary-400">WPM</div>
        </div>

        <div
          class="text-center p-6 bg-white dark:bg-gray-800 rounded-lg border border-secondary-200 dark:border-secondary-700"
        >
          <div
            class="text-4xl font-bold text-success-600 dark:text-success-400 mb-2"
          >
            {{ stats.accuracy }}%
          </div>
          <div class="text-secondary-600 dark:text-secondary-400">Accuracy</div>
        </div>

        <div
          class="text-center p-6 bg-white dark:bg-gray-800 rounded-lg border border-secondary-200 dark:border-secondary-700"
        >
          <div
            class="text-4xl font-bold text-warning-600 dark:text-warning-400 mb-2"
          >
            {{ stats.duration || 0 }}s
          </div>
          <div class="text-secondary-600 dark:text-secondary-400">Duration</div>
        </div>
      </div>
    </div>
  `,
})
export class TypingStatsComponent {
  @Input() stats!: TypingStats;
  @Input() config!: TypingConfig;
}
