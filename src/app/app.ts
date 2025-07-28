import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import {
  StatusBadgeComponent,
  FeatureCardComponent,
  StatusIndicatorComponent,
  ButtonComponent,
} from './shared';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    StatusBadgeComponent,
    FeatureCardComponent,
    StatusIndicatorComponent,
    ButtonComponent,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class AppComponent {
  protected readonly title = signal('angular-team-project');

  onGetStarted(): void {
    // TODO: Implement get started functionality
  }

  onLearnMore(): void {
    // TODO: Implement learn more functionality
  }
}
