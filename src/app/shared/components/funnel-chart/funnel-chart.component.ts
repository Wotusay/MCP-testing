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
        <div class="relative w-48 h-48">
          <svg class="w-full h-full" viewBox="0 0 200 200">
            <g *ngFor="let segment of data; let i = index">
              <path
                [attr.d]="getArcPath(segment, i)"
                [attr.fill]="segment.color"
                class="hover:opacity-80 transition-opacity cursor-pointer"
                [attr.stroke]="'white'"
                [attr.stroke-width]="2"
              ></path>
            </g>
          </svg>
          <!-- Legend -->
          <div class="absolute -right-6 top-0 space-y-2">
            <div
              *ngFor="let segment of data"
              class="flex items-center space-x-2"
            >
              <div
                class="w-3 h-3 rounded-full"
                [style.background-color]="segment.color"
              ></div>
              <span class="text-xs text-gray-600 dark:text-gray-400"
                >{{ segment.label }} {{ segment.percentage }}%</span
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class FunnelChartComponent {
  @Input() title: string = 'Client Journey Funnel';
  @Input() data: FunnelData[] = [];

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
