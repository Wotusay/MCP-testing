import { Component } from '@angular/core';
import { TypographyShowcaseComponent } from '../../shared/components/typography-showcase';

@Component({
  selector: 'app-design-system',
  standalone: true,
  imports: [TypographyShowcaseComponent],
  template: `
    <div class="min-h-screen bg-secondary-50 dark:bg-secondary-900">
      <app-typography-showcase></app-typography-showcase>
    </div>
  `,
  styles: [],
})
export class DesignSystemComponent {}
