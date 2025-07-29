import {
  Component,
  ChangeDetectionStrategy,
  inject,
  computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatTooltipModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      mat-icon-button
      (click)="toggleTheme()"
      [matTooltip]="buttonTitle()"
      [attr.aria-label]="buttonAriaLabel()"
      [disabled]="isTransitioning"
      class="theme-toggle-button"
    >
      <!-- Material Icons for theme states -->
      <mat-icon *ngIf="!isDark() && !isTransitioning">light_mode</mat-icon>
      <mat-icon *ngIf="isDark() && !isTransitioning">dark_mode</mat-icon>

      <!-- Loading/Transition State with Material progress spinner -->
      <mat-icon *ngIf="isTransitioning" class="transition-icon"
        >refresh</mat-icon
      >
    </button>
  `,
  styles: [
    `
      .theme-toggle-button {
        transition: all 0.2s ease-in-out;
      }

      .theme-toggle-button:hover {
        transform: scale(1.05);
      }

      .transition-icon {
        animation: spin 0.5s linear infinite;
      }

      @keyframes spin {
        from {
          transform: rotate(0deg);
        }
        to {
          transform: rotate(360deg);
        }
      }

      /* Material theme colors */
      .theme-toggle-button mat-icon {
        color: var(--mat-sys-on-surface);
        transition: color 0.2s ease-in-out;
      }

      .theme-toggle-button:hover mat-icon {
        color: var(--mat-sys-primary);
      }
    `,
  ],
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
    }, 500);
  }
}
