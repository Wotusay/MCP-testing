import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ButtonComponent, InfoSectionComponent, InfoItem } from '../../shared';

@Component({
  selector: 'app-about',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonComponent, InfoSectionComponent],
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

          <app-info-section
            title="Key Features"
            [items]="keyFeatures"
          ></app-info-section>

          <app-info-section
            title="Technology Stack"
            [items]="techStack"
          ></app-info-section>
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
  keyFeatures: InfoItem[] = [
    { text: 'Angular 20 with zoneless change detection' },
    { text: 'Lazy loading for optimal performance' },
    { text: 'OnPush change detection strategy' },
    { text: 'Performance monitoring and budgets' },
    { text: 'Service worker caching' },
    { text: 'Bundle optimization and code splitting' },
  ];

  techStack: InfoItem[] = [
    { text: 'Angular 20', description: 'Modern frontend framework' },
    { text: 'TypeScript', description: 'Type-safe development' },
    { text: 'Tailwind CSS', description: 'Utility-first styling' },
    { text: 'ESLint & Prettier', description: 'Code quality tools' },
    { text: 'Husky', description: 'Git hooks for quality control' },
  ];

  goBack(): void {
    window.history.back();
  }
}
