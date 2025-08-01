import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuickMetric } from '../../testing/mock-data';

@Component({
  selector: 'app-quick-overview',
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
      <p class="text-sm text-gray-600 dark:text-gray-400 mb-6">
        {{ subtitle }}
      </p>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <!-- Recent Outreach -->
        <div>
          <h4 class="font-medium text-gray-900 dark:text-white mb-3">
            {{ recentOutreachTitle }}
          </h4>
          <div class="space-y-2">
            <div
              *ngFor="let metric of recentOutreach"
              class="flex justify-between items-center p-1 rounded hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150"
            >
              <span class="text-sm text-gray-600 dark:text-gray-400">{{
                metric.label
              }}</span>
              <div class="flex items-center space-x-2">
                <span
                  class="text-sm font-medium text-gray-900 dark:text-white"
                  >{{ metric.value }}</span
                >
                <span
                  class="text-xs px-2 py-1 rounded-full"
                  [ngClass]="{
                    'bg-success-100 text-success-800 dark:bg-success-900/20 dark:text-success-400':
                      metric.status === 'success',
                    'bg-warning-100 text-warning-800 dark:bg-warning-900/20 dark:text-warning-400':
                      metric.status === 'warning',
                    'bg-danger-100 text-danger-800 dark:bg-danger-900/20 dark:text-danger-400':
                      metric.status === 'danger',
                  }"
                >
                  {{ getStatusText(metric.status) }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Engagement Types -->
        <div>
          <h4 class="font-medium text-gray-900 dark:text-white mb-3">
            {{ engagementTypesTitle }}
          </h4>
          <div class="space-y-2">
            <div
              *ngFor="let metric of engagementTypes"
              class="flex justify-between items-center p-1 rounded hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150"
            >
              <span class="text-sm text-gray-600 dark:text-gray-400">{{
                metric.label
              }}</span>
              <span class="text-sm font-medium text-gray-900 dark:text-white">{{
                metric.value
              }}</span>
            </div>
          </div>
        </div>

        <!-- Today's Schedule -->
        <div>
          <h4 class="font-medium text-gray-900 dark:text-white mb-3">
            {{ todayScheduleTitle }}
          </h4>
          <div class="space-y-2">
            <div
              *ngFor="let metric of todaySchedule"
              class="flex justify-between items-center p-1 rounded hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150"
            >
              <span class="text-sm text-gray-600 dark:text-gray-400">{{
                metric.label
              }}</span>
              <div class="flex items-center space-x-2">
                <span
                  class="text-sm font-medium text-gray-900 dark:text-white"
                  >{{ metric.value }}</span
                >
                <span
                  class="text-xs text-gray-500 dark:text-gray-400"
                  *ngIf="metric.status"
                >
                  {{ getStatusText(metric.status) }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Performance Metrics -->
        <div>
          <h4 class="font-medium text-gray-900 dark:text-white mb-3">
            {{ performanceMetricsTitle }}
          </h4>
          <div class="space-y-2">
            <div
              *ngFor="let metric of performanceMetrics"
              class="flex justify-between items-center p-1 rounded hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150"
            >
              <span class="text-sm text-gray-600 dark:text-gray-400">{{
                metric.label
              }}</span>
              <div class="flex items-center space-x-2">
                <span
                  class="text-sm font-medium text-gray-900 dark:text-white"
                  >{{ metric.value }}</span
                >
                <span
                  class="text-xs px-2 py-1 rounded-full"
                  [ngClass]="{
                    'bg-success-100 text-success-800 dark:bg-success-900/20 dark:text-success-400':
                      metric.status === 'success',
                    'bg-warning-100 text-warning-800 dark:bg-warning-900/20 dark:text-warning-400':
                      metric.status === 'warning',
                    'bg-danger-100 text-danger-800 dark:bg-danger-900/20 dark:text-danger-400':
                      metric.status === 'danger',
                  }"
                >
                  {{ getStatusText(metric.status) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class QuickOverviewComponent {
  @Input() title: string = 'Quick Overview';
  @Input() subtitle: string = 'Key metrics and recent activity summary';
  @Input() recentOutreach: QuickMetric[] = [];
  @Input() engagementTypes: QuickMetric[] = [];
  @Input() todaySchedule: QuickMetric[] = [];
  @Input() performanceMetrics: QuickMetric[] = [];
  @Input() recentOutreachTitle: string = 'Recent Outreach';
  @Input() engagementTypesTitle: string = 'Engagement Types';
  @Input() todayScheduleTitle: string = "Today's Schedule";
  @Input() performanceMetricsTitle: string = 'Performance Metrics';

  getStatusText(status?: string): string {
    const statusTexts = {
      success: '+5%',
      warning: '-1%',
      danger: '-2%',
    };
    return statusTexts[status as keyof typeof statusTexts] || '';
  }
}
