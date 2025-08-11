import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <footer
      class="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-12 transition-colors duration-200"
    >
      <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div
          class="text-center text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200"
        >
          <p>
            Angular Team Project - Built with Angular 20, Tailwind CSS, and
            modern development tools.
          </p>
          <p class="mt-1">
            Optimized with lazy loading, OnPush change detection, performance
            monitoring, and theme switching.
          </p>
        </div>
      </div>
    </footer>
  `,
})
export class AppFooterComponent {}
