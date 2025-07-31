import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PerformanceData } from '../../testing/mock-data';

@Component({
  selector: 'app-performance-chart',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  template: `
    <div
      class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
    >
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        {{ title }}
      </h3>
      <div class="h-64 flex items-end justify-between space-x-2 px-4">
        <div
          *ngFor="let item of data"
          class="flex flex-col items-center space-y-2 flex-1 min-w-0"
        >
          <div
            class="flex flex-col items-center space-y-1 h-48 justify-end w-full"
          >
            <!-- Primary bar (Outreach Attempts) -->
            <div
              class="w-8 bg-primary-500 rounded-t transition-all duration-300 hover:bg-primary-600"
              [style.height.px]="(item.value / maxValue) * 160"
              [title]="primaryLabel + ': ' + item.value"
            ></div>
            <!-- Secondary bar (Responses) -->
            <div
              class="w-8 bg-success-500 rounded-t transition-all duration-300 hover:bg-success-600 -mt-1"
              [style.height.px]="(item.secondaryValue / maxValue) * 160"
              [title]="secondaryLabel + ': ' + item.secondaryValue"
            ></div>
          </div>
          <span class="text-xs text-gray-600 dark:text-gray-400 font-medium">{{
            item.day
          }}</span>
        </div>
      </div>
      <!-- Chart Legend -->
      <div
        class="flex justify-center space-x-6 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700"
      >
        <div class="flex items-center space-x-2">
          <div class="w-3 h-3 bg-primary-500 rounded"></div>
          <span class="text-sm text-gray-600 dark:text-gray-400">{{
            primaryLabel
          }}</span>
        </div>
        <div class="flex items-center space-x-2">
          <div class="w-3 h-3 bg-success-500 rounded"></div>
          <span class="text-sm text-gray-600 dark:text-gray-400">{{
            secondaryLabel
          }}</span>
        </div>
      </div>
    </div>
  `,
})
export class PerformanceChartComponent {
  @Input() title: string = 'Weekly Outreach Performance';
  @Input() data: PerformanceData[] = [];
  @Input() primaryLabel: string = 'Outreach Attempts';
  @Input() secondaryLabel: string = 'Responses';

  get maxValue(): number {
    if (!this.data.length) return 0;
    return Math.max(
      ...this.data.map((d) => Math.max(d.value, d.secondaryValue)),
    );
  }
}
