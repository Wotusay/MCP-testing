import { Component, ChangeDetectionStrategy } from '@angular/core';
import {
  FeatureCardComponent,
  StatusIndicatorComponent,
  ButtonComponent,
  AngularImprovementsComponent,
} from '../../shared';

@Component({
  selector: 'app-home',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FeatureCardComponent,
    StatusIndicatorComponent,
    ButtonComponent,
    AngularImprovementsComponent,
  ],
  template: `
    <!-- Welcome Section -->
    <div
      class="bg-white dark:bg-gray-900 rounded-lg shadow-md p-8 mb-8 border border-gray-200 dark:border-gray-700"
    >
      <div class="text-center">
        <h2 class="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Welcome to Angular Team Project
        </h2>
        <p class="text-lg text-gray-700 dark:text-gray-300 mb-6">
          A modern Angular application with Tailwind CSS, ESLint, and Prettier
          configured for team development.
        </p>
        <div class="flex justify-center space-x-4">
          <app-button
            text="Get Started"
            variant="primary"
            (buttonClick)="onGetStarted()"
          >
          </app-button>
          <app-button
            text="Learn More"
            variant="secondary"
            (buttonClick)="onLearnMore()"
          >
          </app-button>
        </div>
      </div>
    </div>

    <!-- Angular 20 Improvements Section -->
    <app-angular-improvements></app-angular-improvements>

    <!-- Feature Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <app-feature-card
        title="Angular 20"
        description="Latest Angular version with zoneless architecture and modern development features."
        iconPath="M12 2L2 7v10c0 5.55 3.84 12 9 12s9-6.45 9-12V7l-10-5z"
        iconColor="red"
      >
      </app-feature-card>

      <app-feature-card
        title="Tailwind CSS"
        description="Utility-first CSS framework for rapid UI development with responsive design."
        iconPath="M12 6c-2.67 0-4.33 1.33-5 4 1-1.33 2.17-1.83 3.5-1.5.76.19 1.31.74 1.91 1.35C13.25 10.69 14.33 12 17 12c2.67 0 4.33-1.33 5-4-1 1.33-2.17 1.83-3.5 1.5-.76-.19-1.31-.74-1.91-1.35C15.75 7.31 14.67 6 12 6zm-5 6c-2.67 0-4.33 1.33-5 4 1-1.33 2.17-1.83 3.5-1.5.76.19 1.31.74 1.91 1.35C8.25 16.69 9.33 18 12 18c2.67 0 4.33-1.33 5-4-1 1.33-2.17 1.83-3.5 1.5-.76-.19-1.31-.74-1.91-1.35C10.75 13.31 9.67 12 7 12z"
        iconColor="cyan"
      >
      </app-feature-card>

      <app-feature-card
        title="Code Quality"
        description="ESLint and Prettier configured with strict rules and pre-commit hooks for consistent code."
        iconPath="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        iconColor="green"
      >
      </app-feature-card>
    </div>

    <!-- Status Section -->
    <div
      class="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700"
    >
      <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
        Project Status
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <app-status-indicator
          text="Development server running"
          status="success"
        >
        </app-status-indicator>
        <app-status-indicator text="Tailwind CSS configured" status="success">
        </app-status-indicator>
        <app-status-indicator text="ESLint & Prettier active" status="success">
        </app-status-indicator>
        <app-status-indicator text="Git hooks configured" status="success">
        </app-status-indicator>
      </div>
    </div>
  `,
})
export class HomeComponent {
  onGetStarted(): void {
    // TODO: Implement get started functionality
  }

  onLearnMore(): void {
    // TODO: Implement learn more functionality
  }
}
