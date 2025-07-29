import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-info-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bg-theme-secondary p-4 rounded-lg border border-theme">
      <h3 class="font-semibold text-theme-primary mb-2">{{ title }}</h3>
      <p class="text-theme-secondary">{{ content }}</p>
    </div>
  `,
})
export class InfoCardComponent {
  @Input() title: string = '';
  @Input() content: string = '';
}
