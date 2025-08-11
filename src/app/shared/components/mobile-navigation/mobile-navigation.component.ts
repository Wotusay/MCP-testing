import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
} from '@angular/core';
import { NgFor } from '@angular/common';
import { NavigationLinkComponent } from '../navigation-link/navigation-link.component';

interface NavigationItem {
  routerLink: string;
  text: string;
}

@Component({
  selector: 'app-mobile-navigation',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgFor, NavigationLinkComponent],
  template: `
    <div
      class="lg:hidden transition-all duration-300 ease-in-out overflow-hidden"
      [class.max-h-64]="isOpen"
      [class.max-h-0]="!isOpen"
      [class.opacity-100]="isOpen"
      [class.opacity-0]="!isOpen"
    >
      <nav class="pb-4 space-y-1">
        <app-navigation-link
          *ngFor="let item of navigationItems"
          [routerLink]="item.routerLink"
          [text]="item.text"
          [activeClass]="mobileActiveClass"
          [baseClass]="mobileBaseClass"
          (linkClick)="onLinkClick()"
        />
      </nav>
    </div>
  `,
})
export class MobileNavigationComponent {
  @Input() isOpen = false;
  @Output() linkClick = new EventEmitter<void>();

  protected readonly navigationItems: NavigationItem[] = [
    { routerLink: '/home', text: 'Home' },
    { routerLink: '/about', text: 'About' },
    { routerLink: '/contact', text: 'Contact' },
    { routerLink: '/games', text: 'Games' },
    { routerLink: '/dashboard', text: 'Dashboard' },
  ];

  protected readonly mobileActiveClass =
    'bg-blue-50 border-blue-500 text-blue-700 dark:bg-blue-900/20 dark:border-blue-400 dark:text-blue-400';

  protected readonly mobileBaseClass =
    'block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50 hover:border-gray-300 dark:text-gray-300 dark:hover:text-gray-100 dark:hover:bg-gray-700 transition-colors duration-200';

  protected onLinkClick(): void {
    this.linkClick.emit();
  }
}
