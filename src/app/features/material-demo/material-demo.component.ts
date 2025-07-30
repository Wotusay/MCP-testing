import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { FormsModule } from '@angular/forms';

// Import existing custom components to show they work alongside Material
import { ButtonComponent } from '../../shared/components/button/button.component';
import { StatusBadgeComponent } from '../../shared/components/status-badge/status-badge.component';

@Component({
  selector: 'app-material-demo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    // Angular Material modules - reduced set for smaller bundle
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatChipsModule,
    FormsModule,
    // Existing custom components
    ButtonComponent,
    StatusBadgeComponent,
  ],
  template: `
    <div class="max-w-6xl mx-auto">
      <!-- Header Section -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Angular Material Integration Demo
        </h1>
        <p class="text-lg text-gray-700 dark:text-gray-300 mb-6">
          This page demonstrates Angular Material components working alongside
          existing custom components.
        </p>
        <app-status-badge
          text="Material Integrated"
          variant="success"
          class="mr-2"
        ></app-status-badge>
        <app-status-badge
          text="Dark Mode Compatible"
          variant="info"
        ></app-status-badge>
      </div>

      <!-- Buttons Comparison Section -->
      <div class="mb-8">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Button Components Comparison
        </h2>

        <!-- Material Buttons -->
        <mat-card class="mb-6">
          <mat-card-header>
            <mat-card-title>Angular Material Buttons</mat-card-title>
            <mat-card-subtitle
              >Standard Material Design buttons</mat-card-subtitle
            >
          </mat-card-header>
          <mat-card-content>
            <div class="flex flex-wrap gap-4 items-center">
              <button mat-raised-button color="primary">Primary</button>
              <button mat-raised-button color="accent">Accent</button>
              <button mat-raised-button color="warn">Warning</button>
              <button mat-stroked-button>Outlined</button>
              <button mat-flat-button>Flat</button>
              <button mat-icon-button>
                <mat-icon>favorite</mat-icon>
              </button>
              <button mat-fab color="primary" class="ml-4">
                <mat-icon>add</mat-icon>
              </button>
            </div>
          </mat-card-content>
        </mat-card>

        <!-- Custom Buttons -->
        <mat-card class="mb-6">
          <mat-card-header>
            <mat-card-title>Custom Tailwind Buttons</mat-card-title>
            <mat-card-subtitle
              >Existing custom button components</mat-card-subtitle
            >
          </mat-card-header>
          <mat-card-content>
            <div class="flex flex-wrap gap-4 items-center">
              <app-button text="Primary" variant="primary"></app-button>
              <app-button text="Secondary" variant="secondary"></app-button>
              <app-button text="Success" variant="success"></app-button>
              <app-button text="Danger" variant="danger"></app-button>
              <app-button text="Small" variant="primary" size="sm"></app-button>
              <app-button text="Large" variant="primary" size="lg"></app-button>
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <!-- Content Display Demo -->
      <div class="mb-8">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Content Display Components
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <mat-card>
            <mat-card-header>
              <mat-card-title>Material Cards</mat-card-title>
              <mat-card-subtitle
                >Standard Material Design cards</mat-card-subtitle
              >
            </mat-card-header>
            <mat-card-content>
              <p class="text-gray-700 dark:text-gray-300 mb-4">
                Material cards provide a flexible content container with
                consistent elevation and spacing.
              </p>
              <div class="mt-4">
                <mat-chip-set>
                  <mat-chip>Angular</mat-chip>
                  <mat-chip>Material</mat-chip>
                  <mat-chip>TypeScript</mat-chip>
                </mat-chip-set>
              </div>
            </mat-card-content>
            <mat-card-actions>
              <button mat-button color="primary">Learn More</button>
              <button mat-button>Share</button>
            </mat-card-actions>
          </mat-card>

          <mat-card>
            <mat-card-header>
              <mat-card-title>Integration Benefits</mat-card-title>
              <mat-card-subtitle
                >Why use both Material and custom components</mat-card-subtitle
              >
            </mat-card-header>
            <mat-card-content>
              <ul
                class="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2"
              >
                <li>Rich Material components for complex UI patterns</li>
                <li>Custom components for brand-specific styling</li>
                <li>Consistent theming across both systems</li>
                <li>Best of both worlds approach</li>
              </ul>
            </mat-card-content>
            <mat-card-actions>
              <button mat-raised-button color="accent">
                <mat-icon>thumb_up</mat-icon>
                Like
              </button>
            </mat-card-actions>
          </mat-card>
        </div>
      </div>

      <!-- Integration Notes -->
      <mat-card class="mt-8">
        <mat-card-header>
          <mat-card-title>
            <mat-icon class="mr-2">info</mat-icon>
            Integration Notes
          </mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 class="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                What's Preserved
              </h3>
              <ul class="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                <li>✅ All existing custom components unchanged</li>
                <li>✅ Tailwind CSS styling system intact</li>
                <li>✅ Dark mode functionality preserved</li>
                <li>✅ Custom design tokens maintained</li>
                <li>✅ Existing component tests still pass</li>
              </ul>
            </div>
            <div>
              <h3 class="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                What's Added
              </h3>
              <ul class="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                <li>✨ Angular Material component library</li>
                <li>✨ Material Design theming system</li>
                <li>✨ Rich form controls and data tables</li>
                <li>✨ Advanced UI patterns (dialogs, snackbars, etc.)</li>
                <li>✨ Accessibility improvements</li>
              </ul>
            </div>
          </div>
          <div class="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p class="text-sm text-blue-800 dark:text-blue-200">
              <strong>Note:</strong> This demo shows a basic integration.
              Additional Material components like form fields, tables, dialogs,
              and navigation can be added as needed while maintaining the
              existing custom component library.
            </p>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
})
export class MaterialDemoComponent {
  // This component demonstrates Material integration without complex form data
}
