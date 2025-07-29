import {
  Component,
  ChangeDetectionStrategy,
  signal,
  OnInit,
  inject,
} from '@angular/core';
import { ButtonComponent, PerformanceMonitoringService } from '../../shared';

@Component({
  selector: 'app-contact',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonComponent],
  template: `
    <div class="bg-white rounded-lg shadow-md p-8">
      <div class="max-w-2xl mx-auto">
        <h2 class="text-3xl font-bold text-gray-900 mb-6">Contact Us</h2>
        
        <div class="mb-8">
          <p class="text-lg text-gray-600 mb-6">
            Get in touch with our development team for questions, suggestions, or collaboration opportunities.
          </p>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="bg-gray-50 p-4 rounded-lg">
              <h3 class="font-semibold text-gray-900 mb-2">Development Team</h3>
              <p class="text-gray-600">team@example.com</p>
            </div>
            
            <div class="bg-gray-50 p-4 rounded-lg">
              <h3 class="font-semibold text-gray-900 mb-2">Project Repository</h3>
              <p class="text-gray-600">github.com/team/project</p>
            </div>
          </div>
        </div>
        
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 class="font-semibold text-blue-900 mb-2">Performance Metrics</h3>
          <p class="text-blue-800 text-sm">
            This page loads with lazy loading and OnPush change detection for optimal performance.
            Load time: {{ loadTime() }}ms
          </p>
        </div>
        
        <div class="flex justify-center space-x-4">
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
