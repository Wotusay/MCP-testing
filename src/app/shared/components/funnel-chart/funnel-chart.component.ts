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
        <div class="w-48 h-48 relative">
          <svg class="w-full h-full" viewBox="0 0 200 200">
            <g *ngFor="let segment of data; let i = index">
              <path
                [attr.d]="getArcPath(segment, i)"
                [attr.fill]="segment.color"
                class="hover:opacity-80 transition-all duration-200 cursor-pointer"
                [attr.stroke]="'white'"
                [attr.stroke-width]="2"
                (mouseenter)="onSegmentHover(i)"
                (mouseleave)="onSegmentLeave()"
              ></path>
              <!-- White overlay with percentage for hovered segment -->
              <g
                *ngIf="hoveredSegmentIndex === i"
                style="pointer-events: none;"
              >
                <circle
                  [attr.cx]="getSegmentCenter(segment, i).x"
                  [attr.cy]="getSegmentCenter(segment, i).y"
                  r="20"
                  fill="white"
                  fill-opacity="0.9"
                  stroke="#e5e7eb"
                  stroke-width="1"
                ></circle>
                <text
                  [attr.x]="getSegmentCenter(segment, i).x"
                  [attr.y]="getSegmentCenter(segment, i).y + 2"
                  text-anchor="middle"
                  class="text-xs font-semibold fill-gray-900"
                  font-size="10"
                >
                  {{ segment.percentage }}%
                </text>
              </g>
            </g>
          </svg>
        </div>
      </div>
      <!-- Legend moved to bottom with improved responsiveness -->
      <div
        class="flex flex-wrap justify-center gap-x-6 gap-y-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700"
      >
        <div
          *ngFor="let segment of data"
          class="flex items-center space-x-2 min-w-0"
        >
          <div
            class="w-3 h-3 rounded-full flex-shrink-0"
            [style.background-color]="segment.color"
          ></div>
          <span class="text-sm text-gray-600 dark:text-gray-400 truncate">{{
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

  // Hover state tracking
  hoveredSegmentIndex: number | null = null;

  onSegmentHover(index: number): void {
    this.hoveredSegmentIndex = index;
  }

  onSegmentLeave(): void {
    this.hoveredSegmentIndex = null;
  }

  getArcPath(segment: FunnelData, index: number): string {
    const centerX = 100;
    const centerY = 100;
    // Make radius larger when hovered
    const baseRadius = 80;
    const radius =
      this.hoveredSegmentIndex === index ? baseRadius + 8 : baseRadius;
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

  getSegmentCenter(
    segment: FunnelData,
    index: number,
  ): { x: number; y: number } {
    const centerX = 100;
    const centerY = 100;
    const radius = 50; // Position text at 50% of radius
    const total = this.data.reduce((sum, item) => sum + item.value, 0);

    if (total === 0) return { x: centerX, y: centerY };

    let startAngle = 0;
    for (let i = 0; i < index; i++) {
      startAngle += (this.data[i].value / total) * 2 * Math.PI;
    }

    const segmentAngle = (segment.value / total) * 2 * Math.PI;
    const midAngle = startAngle + segmentAngle / 2 - Math.PI / 2;

    const x = centerX + radius * Math.cos(midAngle);
    const y = centerY + radius * Math.sin(midAngle);

    return { x, y };
  }
}
