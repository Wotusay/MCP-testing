import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PerformanceData } from '../../testing/mock-data';
import { ChartTooltipComponent } from '../chart-tooltip/chart-tooltip.component';
import type { TooltipData } from '../chart-tooltip/chart-tooltip.component';

@Component({
  selector: 'app-performance-chart',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ChartTooltipComponent],
  template: `
    <div
      class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 relative"
    >
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        {{ title }}
      </h3>
      <div class="h-64 flex items-end justify-between space-x-2 px-4">
        <div
          *ngFor="let item of data; trackBy: trackByDay"
          class="flex flex-col items-center space-y-2 flex-1 min-w-0"
        >
          <div
            class="flex flex-col items-center space-y-1 h-48 justify-end w-full relative"
            (mouseenter)="onBarHover($event, item)"
            (mouseleave)="onBarLeave()"
            (mousemove)="onBarMouseMove($event)"
          >
            <!-- Primary bar (Outreach Attempts) -->
            <div
              class="w-8 bg-primary-500 rounded-t transition-all duration-300 hover:bg-primary-600 cursor-pointer"
              [style.height.px]="(item.value / maxValue) * 160"
              [title]="primaryLabel + ': ' + item.value"
              (mouseenter)="onSegmentHover($event, item)"
            ></div>
            <!-- Secondary bar (Responses) -->
            <div
              class="w-8 bg-success-500 rounded-t transition-all duration-300 hover:bg-success-600 -mt-1 cursor-pointer"
              [style.height.px]="(item.secondaryValue / maxValue) * 160"
              [title]="secondaryLabel + ': ' + item.secondaryValue"
              (mouseenter)="onSegmentHover($event, item)"
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

      <!-- Tooltip -->
      <app-chart-tooltip
        [isVisible]="tooltip.isVisible"
        [data]="tooltip.data"
        [position]="tooltip.position"
      ></app-chart-tooltip>
    </div>
  `,
})
export class PerformanceChartComponent {
  @Input() title: string = 'Weekly Outreach Performance';
  @Input() data: PerformanceData[] = [];
  @Input() primaryLabel: string = 'Outreach Attempts';
  @Input() secondaryLabel: string = 'Responses';

  // Tooltip state
  tooltip = {
    isVisible: false,
    data: null as TooltipData | null,
    position: { x: 0, y: 0 },
  };

  get maxValue(): number {
    if (!this.data.length) return 0;
    return Math.max(
      ...this.data.map((d) => Math.max(d.value, d.secondaryValue)),
    );
  }

  trackByDay(index: number, item: PerformanceData): string {
    return item.day;
  }

  onBarHover(event: MouseEvent, item: PerformanceData): void {
    this.showTooltip(event, item);
  }

  onBarMouseMove(event: MouseEvent): void {
    if (this.tooltip.isVisible) {
      this.updateTooltipPosition(event);
    }
  }

  onBarLeave(): void {
    this.hideTooltip();
  }

  onSegmentHover(event: MouseEvent, item: PerformanceData): void {
    this.showTooltip(event, item);
  }

  private showTooltip(event: MouseEvent, item: PerformanceData): void {
    const total = item.value + item.secondaryValue;
    const primaryPercentage =
      total > 0 ? Math.round((item.value / total) * 100) : 0;
    const secondaryPercentage =
      total > 0 ? Math.round((item.secondaryValue / total) * 100) : 0;

    this.tooltip.data = {
      day: item.day,
      primaryValue: item.value,
      secondaryValue: item.secondaryValue,
      primaryLabel: this.primaryLabel,
      secondaryLabel: this.secondaryLabel,
      total: total,
      primaryPercentage: primaryPercentage,
      secondaryPercentage: secondaryPercentage,
    };

    this.updateTooltipPosition(event);
    this.tooltip.isVisible = true;
  }

  private updateTooltipPosition(event: MouseEvent): void {
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    const containerRect = (event.currentTarget as HTMLElement)
      .closest('.bg-white, .dark\\:bg-gray-800')
      ?.getBoundingClientRect();

    if (containerRect) {
      this.tooltip.position = {
        x: rect.left + rect.width / 2 - containerRect.left,
        y: rect.top - containerRect.top,
      };
    }
  }

  private hideTooltip(): void {
    this.tooltip.isVisible = false;
    this.tooltip.data = null;
  }
}
