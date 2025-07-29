import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ButtonComponent } from '../../shared';

@Component({
  selector: 'app-about',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonComponent],
  template: `
    <div class="bg-white rounded-lg shadow-md p-8">
      <div class="max-w-4xl mx-auto">
        <h2 class="text-3xl font-bold text-gray-900 mb-6">About Our Project</h2>

        <div class="prose max-w-none text-gray-600 mb-8">
          <p class="text-lg mb-4">
            This Angular Team Project demonstrates modern web development
            practices and performance optimizations for enterprise-grade
            applications.
          </p>

          <h3 class="text-xl font-semibold text-gray-900 mb-3">Key Features</h3>
          <ul class="list-disc list-inside space-y-2 mb-6">
            <li>Angular 20 with zoneless change detection</li>
            <li>Lazy loading for optimal performance</li>
            <li>OnPush change detection strategy</li>
            <li>Performance monitoring and budgets</li>
            <li>Service worker caching</li>
            <li>Bundle optimization and code splitting</li>
          </ul>

          <h3 class="text-xl font-semibold text-gray-900 mb-3">
            Technology Stack
          </h3>
          <ul class="list-disc list-inside space-y-2 mb-6">
            <li>Angular 20 - Modern frontend framework</li>
            <li>TypeScript - Type-safe development</li>
            <li>Tailwind CSS - Utility-first styling</li>
            <li>ESLint & Prettier - Code quality tools</li>
            <li>Husky - Git hooks for quality control</li>
          </ul>
        </div>

        <div class="flex justify-center">
          <app-button
            text="Back to Home"
            variant="primary"
            (buttonClick)="goBack()"
          >
          </app-button>
        </div>
      </div>
    </div>
  `,
})
export class AboutComponent {
  goBack(): void {
    window.history.back();
  }
}
