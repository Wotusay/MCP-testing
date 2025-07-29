import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-info-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bg-gray-50 p-4 rounded-lg">
      <h3 class="font-semibold text-gray-900 mb-2">{{ title }}</h3>
      <p class="text-gray-600">{{ content }}</p>
    </div>
  `,
})
export class InfoCardComponent {
  @Input() title: string = '';
  @Input() content: string = '';
}
