import {
  Component,
  signal,
  ChangeDetectionStrategy,
  AfterViewInit,
  inject,
} from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

import {
  StatusBadgeComponent,
  PerformanceMonitoringService,
  ThemeToggleComponent,
} from './shared';

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    StatusBadgeComponent,
    ThemeToggleComponent,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class AppComponent implements AfterViewInit {
  protected readonly title = signal('angular-team-project');
  private readonly performanceService = inject(PerformanceMonitoringService);

  ngAfterViewInit(): void {
    // Log performance metrics after the view is initialized
    setTimeout(() => {
      this.performanceService.logPerformance();
    }, 1000);
  }
}
