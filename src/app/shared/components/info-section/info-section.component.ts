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
      <h3 class="text-xl font-semibold text-theme-primary mb-3">{{ title }}</h3>
      <ul class="list-disc list-inside space-y-2 mb-6">
        <li *ngFor="let item of items" class="text-theme-secondary">
          <span class="text-theme-primary">{{ item.text }}</span>
          <span *ngIf="item.description" class="text-theme-secondary">
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
