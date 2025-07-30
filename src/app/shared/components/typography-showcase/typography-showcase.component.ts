import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-typography-showcase',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-4xl mx-auto p-8 space-y-12">
      <!-- Page Header -->
      <header
        class="text-center border-b border-secondary-200 dark:border-secondary-700 pb-8"
      >
        <h1
          class="text-display-lg text-secondary-900 dark:text-secondary-100 mb-4"
        >
          Typography Scale & Color Palette
        </h1>
        <p class="text-body-lg text-secondary-600 dark:text-secondary-400">
          A comprehensive design system for consistent typography and colors
        </p>
      </header>

      <!-- Display Sizes -->
      <section>
        <h2
          class="text-h2 mb-6 border-b border-secondary-100 dark:border-secondary-800 pb-2"
        >
          Display Sizes
        </h2>
        <div class="space-y-6">
          <div class="flex items-center gap-4">
            <span class="text-caption w-24 text-right">Display 2XL</span>
            <span class="text-display-2xl">Design System</span>
          </div>
          <div class="flex items-center gap-4">
            <span class="text-caption w-24 text-right">Display XL</span>
            <span class="text-display-xl">Design System</span>
          </div>
          <div class="flex items-center gap-4">
            <span class="text-caption w-24 text-right">Display LG</span>
            <span class="text-display-lg">Design System</span>
          </div>
        </div>
      </section>

      <!-- Headings -->
      <section>
        <h2
          class="text-h2 mb-6 border-b border-secondary-100 dark:border-secondary-800 pb-2"
        >
          Headings
        </h2>
        <div class="space-y-4">
          <div class="flex items-center gap-4">
            <span class="text-caption w-16 text-right">H1</span>
            <h1 class="text-h1">Main Page Heading</h1>
          </div>
          <div class="flex items-center gap-4">
            <span class="text-caption w-16 text-right">H2</span>
            <h2 class="text-h2">Section Heading</h2>
          </div>
          <div class="flex items-center gap-4">
            <span class="text-caption w-16 text-right">H3</span>
            <h3 class="text-h3">Subsection Heading</h3>
          </div>
          <div class="flex items-center gap-4">
            <span class="text-caption w-16 text-right">H4</span>
            <h4 class="text-h4">Article Heading</h4>
          </div>
          <div class="flex items-center gap-4">
            <span class="text-caption w-16 text-right">H5</span>
            <h5 class="text-h5">Small Heading</h5>
          </div>
        </div>
      </section>

      <!-- Body Text -->
      <section>
        <h2
          class="text-h2 mb-6 border-b border-secondary-100 dark:border-secondary-800 pb-2"
        >
          Body Text
        </h2>
        <div class="space-y-6">
          <div>
            <h3 class="text-h4 mb-2">Body XL</h3>
            <p class="text-body-xl">
              This is extra large body text, perfect for important introductory
              paragraphs or lead text that needs to stand out and be easily
              readable.
            </p>
          </div>
          <div>
            <h3 class="text-h4 mb-2">Body Large (Default)</h3>
            <p class="text-body-lg">
              This is large body text, the default size for most content. It
              provides excellent readability while maintaining a comfortable
              reading experience for users.
            </p>
          </div>
          <div>
            <h3 class="text-h4 mb-2">Body Medium</h3>
            <p class="text-body-md">
              This is medium body text, suitable for secondary content, form
              labels, or areas where space is at a premium but readability is
              still important.
            </p>
          </div>
          <div>
            <h3 class="text-h4 mb-2">Body Small</h3>
            <p class="text-body-sm">
              This is small body text, ideal for footnotes, disclaimers, or
              supplementary information that needs to be less prominent.
            </p>
          </div>
        </div>
      </section>

      <!-- Specialized Text -->
      <section>
        <h2
          class="text-h2 mb-6 border-b border-secondary-100 dark:border-secondary-800 pb-2"
        >
          Specialized Text
        </h2>
        <div class="space-y-4">
          <div>
            <h3 class="text-h4 mb-2">Links</h3>
            <p class="text-body-lg">
              Visit our <a href="#" class="text-link">documentation</a> or check
              out the
              <a href="#" class="text-link">getting started guide</a> for more
              information.
            </p>
          </div>

          <div>
            <h3 class="text-h4 mb-2">Emphasis & Muted</h3>
            <p class="text-body-lg">
              <span class="text-emphasis">Important information</span> should
              stand out, while
              <span class="text-muted">less important details</span> can be
              muted.
            </p>
          </div>

          <div>
            <h3 class="text-h4 mb-2">Caption & Overline</h3>
            <div class="space-y-2">
              <p class="text-overline">Form Section</p>
              <p class="text-body-lg">Main content goes here</p>
              <p class="text-caption">Additional context or metadata</p>
            </div>
          </div>

          <div>
            <h3 class="text-h4 mb-2">Status Text</h3>
            <div class="space-y-2">
              <p class="text-success">✓ Operation completed successfully</p>
              <p class="text-warning">⚠ Please review your input</p>
              <p class="text-danger">✗ An error occurred</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Color Palette -->
      <section>
        <h2
          class="text-h2 mb-6 border-b border-secondary-100 dark:border-secondary-800 pb-2"
        >
          Color Palette
        </h2>

        <!-- Primary Colors -->
        <div class="mb-8">
          <h3 class="text-h3 mb-4">Primary (Blue)</h3>
          <div class="grid grid-cols-11 gap-2">
            <div *ngFor="let shade of primaryShades" class="text-center">
              <div
                [class]="'h-16 w-full rounded-lg mb-2 ' + shade.bgClass"
              ></div>
              <div class="text-caption">{{ shade.name }}</div>
              <div class="text-caption text-muted">{{ shade.value }}</div>
            </div>
          </div>
        </div>

        <!-- Secondary Colors -->
        <div class="mb-8">
          <h3 class="text-h3 mb-4">Secondary (Slate)</h3>
          <div class="grid grid-cols-11 gap-2">
            <div *ngFor="let shade of secondaryShades" class="text-center">
              <div
                [class]="'h-16 w-full rounded-lg mb-2 ' + shade.bgClass"
              ></div>
              <div class="text-caption">{{ shade.name }}</div>
              <div class="text-caption text-muted">{{ shade.value }}</div>
            </div>
          </div>
        </div>

        <!-- Semantic Colors -->
        <div class="grid md:grid-cols-3 gap-6">
          <div>
            <h3 class="text-h4 mb-4">Success (Green)</h3>
            <div class="grid grid-cols-5 gap-2">
              <div *ngFor="let shade of successShades" class="text-center">
                <div
                  [class]="'h-12 w-full rounded-lg mb-2 ' + shade.bgClass"
                ></div>
                <div class="text-caption">{{ shade.name }}</div>
              </div>
            </div>
          </div>

          <div>
            <h3 class="text-h4 mb-4">Warning (Amber)</h3>
            <div class="grid grid-cols-5 gap-2">
              <div *ngFor="let shade of warningShades" class="text-center">
                <div
                  [class]="'h-12 w-full rounded-lg mb-2 ' + shade.bgClass"
                ></div>
                <div class="text-caption">{{ shade.name }}</div>
              </div>
            </div>
          </div>

          <div>
            <h3 class="text-h4 mb-4">Danger (Red)</h3>
            <div class="grid grid-cols-5 gap-2">
              <div *ngFor="let shade of dangerShades" class="text-center">
                <div
                  [class]="'h-12 w-full rounded-lg mb-2 ' + shade.bgClass"
                ></div>
                <div class="text-caption">{{ shade.name }}</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [],
})
export class TypographyShowcaseComponent {
  primaryShades = [
    { name: '50', value: '#eff6ff', bgClass: 'bg-primary-50' },
    { name: '100', value: '#dbeafe', bgClass: 'bg-primary-100' },
    { name: '200', value: '#bfdbfe', bgClass: 'bg-primary-200' },
    { name: '300', value: '#93c5fd', bgClass: 'bg-primary-300' },
    { name: '400', value: '#60a5fa', bgClass: 'bg-primary-400' },
    { name: '500', value: '#3b82f6', bgClass: 'bg-primary-500' },
    { name: '600', value: '#2563eb', bgClass: 'bg-primary-600' },
    { name: '700', value: '#1d4ed8', bgClass: 'bg-primary-700' },
    { name: '800', value: '#1e40af', bgClass: 'bg-primary-800' },
    { name: '900', value: '#1e3a8a', bgClass: 'bg-primary-900' },
    { name: '950', value: '#172554', bgClass: 'bg-primary-950' },
  ];

  secondaryShades = [
    { name: '50', value: '#f8fafc', bgClass: 'bg-secondary-50' },
    { name: '100', value: '#f1f5f9', bgClass: 'bg-secondary-100' },
    { name: '200', value: '#e2e8f0', bgClass: 'bg-secondary-200' },
    { name: '300', value: '#cbd5e1', bgClass: 'bg-secondary-300' },
    { name: '400', value: '#94a3b8', bgClass: 'bg-secondary-400' },
    { name: '500', value: '#64748b', bgClass: 'bg-secondary-500' },
    { name: '600', value: '#475569', bgClass: 'bg-secondary-600' },
    { name: '700', value: '#334155', bgClass: 'bg-secondary-700' },
    { name: '800', value: '#1e293b', bgClass: 'bg-secondary-800' },
    { name: '900', value: '#0f172a', bgClass: 'bg-secondary-900' },
    { name: '950', value: '#020617', bgClass: 'bg-secondary-950' },
  ];

  successShades = [
    { name: '100', bgClass: 'bg-success-100' },
    { name: '300', bgClass: 'bg-success-300' },
    { name: '500', bgClass: 'bg-success-500' },
    { name: '700', bgClass: 'bg-success-700' },
    { name: '900', bgClass: 'bg-success-900' },
  ];

  warningShades = [
    { name: '100', bgClass: 'bg-warning-100' },
    { name: '300', bgClass: 'bg-warning-300' },
    { name: '500', bgClass: 'bg-warning-500' },
    { name: '700', bgClass: 'bg-warning-700' },
    { name: '900', bgClass: 'bg-warning-900' },
  ];

  dangerShades = [
    { name: '100', bgClass: 'bg-danger-100' },
    { name: '300', bgClass: 'bg-danger-300' },
    { name: '500', bgClass: 'bg-danger-500' },
    { name: '700', bgClass: 'bg-danger-700' },
    { name: '900', bgClass: 'bg-danger-900' },
  ];
}
