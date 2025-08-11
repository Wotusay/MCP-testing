import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NgFor } from '@angular/common';
import { NavigationLinkComponent } from '../navigation-link/navigation-link.component';
import { ThemeToggleComponent } from '../theme-toggle/theme-toggle.component';

interface NavigationItem {
  routerLink: string;
  text: string;
}

@Component({
  selector: 'app-desktop-navigation',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgFor, NavigationLinkComponent, ThemeToggleComponent],
  template: `
    <div class="hidden lg:flex items-center space-x-4">
      <nav class="flex space-x-4">
        <app-navigation-link
          *ngFor="let item of navigationItems"
          [routerLink]="item.routerLink"
          [text]="item.text"
          [activeClass]="desktopActiveClass"
          [baseClass]="desktopBaseClass"
        />
      </nav>
      <app-theme-toggle></app-theme-toggle>
    </div>
  `,
})
export class DesktopNavigationComponent {
  protected readonly navigationItems: NavigationItem[] = [
    { routerLink: '/home', text: 'Home' },
    { routerLink: '/about', text: 'About' },
    { routerLink: '/contact', text: 'Contact' },
    { routerLink: '/games', text: 'Games' },
    { routerLink: '/material-demo', text: 'Material Demo' },
    { routerLink: '/design-system', text: 'Design System' },
    { routerLink: '/dashboard', text: 'Dashboard' },
  ];

  protected readonly desktopActiveClass =
    'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-900/20';

  protected readonly desktopBaseClass =
    'text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200';
}
