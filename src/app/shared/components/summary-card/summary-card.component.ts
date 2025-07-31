import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SummaryCard } from '../../testing/mock-data';

@Component({
  selector: 'app-summary-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  template: `
    <div
      class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
    >
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <div class="p-2 rounded-lg bg-gray-100 dark:bg-gray-700">
            <svg
              class="w-5 h-5 text-gray-600 dark:text-gray-400"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path [attr.d]="card.icon"></path>
            </svg>
          </div>
        </div>
        <div class="text-right">
          <p class="text-sm font-medium text-gray-600 dark:text-gray-400">
            {{ card.title }}
          </p>
          <p class="text-2xl font-bold text-gray-900 dark:text-white">
            {{ card.value }}
          </p>
          <p
            class="text-sm font-medium"
            [class.text-success-600]="card.changeType === 'positive'"
            [class.text-danger-600]="card.changeType === 'negative'"
          >
            {{ card.change }}
          </p>
        </div>
      </div>
    </div>
  `,
})
export class SummaryCardComponent {
  @Input() card!: SummaryCard;
}
