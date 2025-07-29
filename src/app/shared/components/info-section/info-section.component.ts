import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface InfoItem {
  text: string;
  description?: string;
}

@Component({
  selector: 'app-info-section',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  template: `
    <div class="mb-6">
      <h3 class="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
        {{ title }}
      </h3>
      <ul class="list-disc list-inside space-y-2 mb-6">
        <li *ngFor="let item of items" class="text-gray-700 dark:text-gray-300">
          <span class="text-gray-900 dark:text-gray-100">{{ item.text }}</span>
          <span
            *ngIf="item.description"
            class="text-gray-700 dark:text-gray-300"
          >
            - {{ item.description }}</span
          >
        </li>
      </ul>
    </div>
  `,
})
export class InfoSectionComponent {
  @Input() title: string = '';
  @Input() items: InfoItem[] = [];
}
