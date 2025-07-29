import {
  Component,
  ChangeDetectionStrategy,
  inject,
  computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      class="relative p-2 rounded-lg transition-all duration-200 ease-in-out
             hover:bg-gray-100 dark:hover:bg-gray-800 
             focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
             dark:focus:ring-offset-gray-900"
      (click)="toggleTheme()"
      [attr.aria-label]="buttonAriaLabel()"
      [title]="buttonTitle()"
    >
      <!-- Sun Icon (Light Mode) -->
      <svg
        *ngIf="!isDark()"
        class="w-5 h-5 text-yellow-500 transition-transform duration-200 hover:scale-110"
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill-rule="evenodd"
          d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
          clip-rule="evenodd"
        />
      </svg>

      <!-- Moon Icon (Dark Mode) -->
      <svg
        *ngIf="isDark()"
        class="w-5 h-5 text-blue-400 transition-transform duration-200 hover:scale-110"
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"
        />
      </svg>

      <!-- Loading/Transition State -->
      <div
        *ngIf="isTransitioning"
        class="absolute inset-0 flex items-center justify-center"
      >
        <div class="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    </button>
  `,
})
export class ThemeToggleComponent {
  private readonly themeService = inject(ThemeService);

  // Component state
  protected isTransitioning = false;

  // Computed values from theme service
  protected readonly theme = this.themeService.theme;
  protected readonly isDark = this.themeService.isDark;

  // Computed aria label and title
  protected readonly buttonAriaLabel = computed(() => {
    const current = this.isDark() ? 'dark' : 'light';
    const next = this.isDark() ? 'light' : 'dark';
    return `Switch from ${current} to ${next} theme`;
  });

  protected readonly buttonTitle = computed(() => {
    const themeText = this.theme();
    const computedText = this.isDark() ? 'dark' : 'light';
    
    if (themeText === 'auto') {
      return `Theme: Auto (${computedText})`;
    }
    return `Theme: ${themeText}`;
  });

  protected toggleTheme(): void {
    if (this.isTransitioning) return;

    this.isTransitioning = true;
    this.themeService.toggleTheme();

    // Reset transition state after animation
    setTimeout(() => {
      this.isTransitioning = false;
    }, 200);
  }
}