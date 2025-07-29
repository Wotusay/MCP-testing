import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { BaseComponent } from '../base/base.component';
import { CommonModule } from '@angular/common';

/**
 * Template for creating feature components (pages/routes)
 *
 * Replace COMPONENT_NAME with your actual component name
 * Replace SELECTOR_NAME with your component selector
 *
 * Features:
 * - Extends BaseComponent for common functionality
 * - Includes lifecycle hooks
 * - Error handling
 * - Loading states
 * - Subscription management
 *
 * Usage:
 * 1. Copy this file to your feature location
 * 2. Rename the file and class name
 * 3. Update the selector
 * 4. Add your imports for shared components
 * 5. Implement your page logic
 */

@Component({
  selector: 'app-component-name',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    // Add your shared component imports here
    // ButtonComponent,
    // FeatureCardComponent,
    // etc.
  ],
  template: `
    <div class="container mx-auto px-4 py-8">
      <!-- Page Header -->
      <header class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Page Title
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          Page description or subtitle
        </p>
      </header>

      <!-- Loading State -->
      @if (loading) {
        <div class="flex items-center justify-center py-12">
          <div
            class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"
          ></div>
          <span class="ml-2 text-gray-600 dark:text-gray-400">Loading...</span>
        </div>
      }

      <!-- Error State -->
      @if (hasError()) {
        <div
          class="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6"
        >
          <div class="flex items-center">
            <svg
              class="w-5 h-5 text-red-600 dark:text-red-400 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clip-rule="evenodd"
              ></path>
            </svg>
            <h3 class="text-red-800 dark:text-red-200 font-medium">Error</h3>
          </div>
          <p class="text-red-700 dark:text-red-300 mt-1">{{ error }}</p>
        </div>
      }

      <!-- Main Content -->
      @if (!loading && !hasError()) {
        <main>
          <!-- Add your main content here -->
          <section class="mb-8">
            <h2
              class="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4"
            >
              Section Title
            </h2>

            <!-- Content goes here -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <!-- Add your components here -->
            </div>
          </section>
        </main>
      }
    </div>
  `,
})
export class COMPONENT_NAMEComponent extends BaseComponent implements OnInit {
  // Component-specific properties
  data: unknown[] = [];

  constructor() {
    // private router: Router, // private dataService: DataService, // Inject your services here
    super();
  }

  ngOnInit(): void {
    this.loadData();
  }

  /**
   * Load component data
   */
  private loadData(): void {
    this.loading = true;
    this.clearError();

    // Example async operation
    // this.dataService.getData()
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe({
    //     next: (data) => {
    //       this.data = data;
    //       this.loading = false;
    //     },
    //     error: (error) => {
    //       this.setError(error);
    //       this.loading = false;
    //     }
    //   });

    // Temporary mock data loading
    setTimeout(() => {
      this.data = [];
      this.loading = false;
    }, 1000);
  }

  /**
   * Handle user actions
   */
  onAction(): void {
    // Implement user action
  }

  /**
   * Navigate to another route
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  navigateTo(_path: string): void {
    // this.router.navigate([path]);
  }
}
