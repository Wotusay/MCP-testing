import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FunnelData } from '../../testing/mock-data';

@Component({
  selector: 'app-funnel-chart',
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
      <div class="flex items-center justify-center h-64">
        <div class="w-48 h-48">
          <svg class="w-full h-full" viewBox="0 0 200 200">
            <g *ngFor="let segment of data; let i = index">
              <path
                [attr.d]="getArcPath(segment, i)"
                [attr.fill]="segment.color"
                class="hover:opacity-80 transition-opacity cursor-pointer"
                [attr.stroke]="'white'"
                [attr.stroke-width]="2"
                (mouseenter)="showTooltip($event, segment)"
                (mouseleave)="hideTooltip()"
                (mousemove)="updateTooltipPosition($event)"
              ></path>
            </g>
          </svg>
          <!-- Hover Tooltip -->
          <div
            *ngIf="tooltipVisible"
            class="absolute bg-gray-900 text-white text-xs rounded px-2 py-1 pointer-events-none z-10 shadow-lg"
            [style.left.px]="tooltipX"
            [style.top.px]="tooltipY"
          >
            <div class="font-medium">{{ tooltipData?.label }}</div>
            <div>{{ tooltipData?.percentage }}% ({{ tooltipData?.value }})</div>
          </div>
        </div>
      </div>
      <!-- Legend moved to bottom -->
      <div
        class="flex justify-center space-x-6 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700"
      >
        <div *ngFor="let segment of data" class="flex items-center space-x-2">
          <div
            class="w-3 h-3 rounded-full"
            [style.background-color]="segment.color"
          ></div>
          <span class="text-sm text-gray-600 dark:text-gray-400">{{
            segment.label
          }}</span>
        </div>
      </div>
    </div>
  `,
})
export class FunnelChartComponent {
  @Input() title: string = 'Client Journey Funnel';
  @Input() data: FunnelData[] = [];

  // Tooltip properties
  tooltipVisible = false;
  tooltipX = 0;
  tooltipY = 0;
  tooltipData: FunnelData | null = null;

  showTooltip(event: MouseEvent, segment: FunnelData): void {
    this.tooltipVisible = true;
    this.tooltipData = segment;
    this.updateTooltipPosition(event);
  }

  hideTooltip(): void {
    this.tooltipVisible = false;
    this.tooltipData = null;
  }

  updateTooltipPosition(event: MouseEvent): void {
    if (this.tooltipVisible) {
      // Position tooltip near mouse, but offset to avoid overlapping cursor
      this.tooltipX = event.offsetX + 10;
      this.tooltipY = event.offsetY - 10;
    }
  }

  getArcPath(segment: FunnelData, index: number): string {
    const centerX = 100;
    const centerY = 100;
    const radius = 80;
    const total = this.data.reduce((sum, item) => sum + item.value, 0);

    if (total === 0) return '';

    let startAngle = 0;
    for (let i = 0; i < index; i++) {
      startAngle += (this.data[i].value / total) * 2 * Math.PI;
    }

    const endAngle = startAngle + (segment.value / total) * 2 * Math.PI;

    const startX = centerX + radius * Math.cos(startAngle - Math.PI / 2);
    const startY = centerY + radius * Math.sin(startAngle - Math.PI / 2);
    const endX = centerX + radius * Math.cos(endAngle - Math.PI / 2);
    const endY = centerY + radius * Math.sin(endAngle - Math.PI / 2);

    const largeArcFlag = endAngle - startAngle <= Math.PI ? '0' : '1';

    return [
      'M',
      centerX,
      centerY,
      'L',
      startX,
      startY,
      'A',
      radius,
      radius,
      0,
      largeArcFlag,
      1,
      endX,
      endY,
      'z',
    ].join(' ');
  }
}
