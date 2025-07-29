import {
  Component,
  ChangeDetectionStrategy,
  signal,
  OnInit,
  inject,
} from '@angular/core';
import {
  ButtonComponent,
  PerformanceMonitoringService,
  InfoCardComponent,
  MetricsBoxComponent,
} from '../../shared';

@Component({
  selector: 'app-contact',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonComponent, InfoCardComponent, MetricsBoxComponent],
  template: `
    <div
      class="bg-white dark:bg-gray-900 rounded-lg shadow-md p-4 sm:p-6 lg:p-8 border border-gray-200 dark:border-gray-700"
    >
      <div class="max-w-2xl mx-auto">
        <h2
          class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4 sm:mb-6"
        >
          Contact Us
        </h2>

        <div class="mb-6 sm:mb-8">
          <p
            class="text-base sm:text-lg text-gray-700 dark:text-gray-300 mb-4 sm:mb-6"
          >
            Get in touch with our development team for questions, suggestions,
            or collaboration opportunities.
          </p>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <app-info-card
              title="Development Team"
              content="team@example.com"
            ></app-info-card>

            <app-info-card
              title="Project Repository"
              content="github.com/team/project"
            ></app-info-card>
          </div>
        </div>

        <app-metrics-box title="Performance Metrics" variant="info">
          This page loads with lazy loading and OnPush change detection for
          optimal performance. Load time: {{ loadTime() }}ms
        </app-metrics-box>

        <div
          class="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4"
        >
          <app-button
            text="Send Message"
            variant="primary"
            (buttonClick)="sendMessage()"
          >
          </app-button>
          <app-button
            text="Back to Home"
            variant="secondary"
            (buttonClick)="goBack()"
          >
          </app-button>
        </div>
      </div>
    </div>
  `,
})
export class ContactComponent implements OnInit {
  protected readonly loadTime = signal(0);
  private startTime: number;
  private readonly performanceService = inject(PerformanceMonitoringService);

  constructor() {
    this.startTime = this.performanceService.measureComponentLoad();
  }

  ngOnInit(): void {
    // Simulate component initialization and measure load time
    setTimeout(() => {
      this.performanceService.logComponentLoad(
        'ContactComponent',
        this.startTime,
      );
      const endTime = performance.now();
      this.loadTime.set(Math.round(endTime - this.startTime));
    }, 0);
  }

  sendMessage(): void {
    // TODO: Implement send message functionality
    alert('Message functionality would be implemented here');
  }

  goBack(): void {
    window.history.back();
  }
}
