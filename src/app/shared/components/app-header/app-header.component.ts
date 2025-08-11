import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
} from '@angular/core';
import { NgIf } from '@angular/common';
import { StatusBadgeComponent } from '../status-badge/status-badge.component';
import { DesktopNavigationComponent } from '../desktop-navigation/desktop-navigation.component';
import { MobileNavigationComponent } from '../mobile-navigation/mobile-navigation.component';
import { ThemeToggleComponent } from '../theme-toggle/theme-toggle.component';

@Component({
  selector: 'app-header',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgIf,
    StatusBadgeComponent,
    DesktopNavigationComponent,
    MobileNavigationComponent,
    ThemeToggleComponent,
  ],
  template: `
    <header
      class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 transition-colors duration-200"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-4">
          <!-- Logo/Title Section -->
          <div class="flex items-center">
            <h1
              class="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-200"
            >
              <span class="hidden sm:inline">{{ title }}</span>
              <span class="sm:hidden">ATP</span>
            </h1>
            <app-status-badge
              class="ml-3 hidden sm:block"
              text="Development"
              variant="success"
            />
            <app-status-badge
              class="ml-2 sm:hidden"
              text="Dev"
              variant="success"
            />
          </div>

          <!-- Desktop Navigation -->
          <app-desktop-navigation></app-desktop-navigation>

          <!-- Mobile Menu Button and Theme Toggle -->
          <div class="lg:hidden flex items-center space-x-2">
            <app-theme-toggle></app-theme-toggle>
            <button
              (click)="toggleMobileMenu()"
              class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 transition-colors duration-200"
              [attr.aria-expanded]="isMobileMenuOpen"
              aria-label="Toggle mobile menu"
            >
              <!-- Hamburger Icon -->
              <svg
                class="h-6 w-6 transition-transform duration-200"
                [class.rotate-90]="isMobileMenuOpen"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  *ngIf="!isMobileMenuOpen"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
                <path
                  *ngIf="isMobileMenuOpen"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        <!-- Mobile Navigation Menu -->
        <app-mobile-navigation
          [isOpen]="isMobileMenuOpen"
          (linkClick)="closeMobileMenu()"
        />
      </div>
    </header>
  `,
})
export class AppHeaderComponent {
  @Input() title = 'angular-team-project';
  @Input() isMobileMenuOpen = false;
  @Output() mobileMenuToggle = new EventEmitter<void>();
  @Output() mobileMenuClose = new EventEmitter<void>();

  protected toggleMobileMenu(): void {
    this.mobileMenuToggle.emit();
  }

  protected closeMobileMenu(): void {
    this.mobileMenuClose.emit();
  }
}
