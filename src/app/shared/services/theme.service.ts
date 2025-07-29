import { Injectable, signal, effect, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type Theme = 'light' | 'dark' | 'auto';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly platformId = inject(PLATFORM_ID);
  
  // Current theme state
  private readonly _theme = signal<Theme>('auto');
  private readonly _isDark = signal<boolean>(false);
  
  // Public readonly signals
  readonly theme = this._theme.asReadonly();
  readonly isDark = this._isDark.asReadonly();
  
  constructor() {
    // Initialize theme on browser platform
    if (isPlatformBrowser(this.platformId)) {
      this.initializeTheme();
      this.setupThemeEffect();
      this.setupSystemThemeListener();
    }
  }
  
  /**
   * Set the theme
   */
  setTheme(theme: Theme): void {
    this._theme.set(theme);
    
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('theme', theme);
    }
  }
  
  /**
   * Toggle between light and dark themes
   */
  toggleTheme(): void {
    const currentTheme = this._theme();
    if (currentTheme === 'auto') {
      // If auto, switch to the opposite of current system preference
      const isDarkSystem = this.getSystemTheme() === 'dark';
      this.setTheme(isDarkSystem ? 'light' : 'dark');
    } else {
      // Toggle between light and dark
      this.setTheme(currentTheme === 'light' ? 'dark' : 'light');
    }
  }
  
  /**
   * Get the computed theme (resolves 'auto' to actual theme)
   */
  getComputedTheme(): 'light' | 'dark' {
    const theme = this._theme();
    if (theme === 'auto') {
      return this.getSystemTheme();
    }
    return theme;
  }
  
  private initializeTheme(): void {
    // Get theme from localStorage or default to 'auto'
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    const initialTheme = this.isValidTheme(savedTheme) ? savedTheme : 'auto';
    
    this._theme.set(initialTheme);
    this.updateIsDark();
  }
  
  private setupThemeEffect(): void {
    // Effect to apply theme changes to the DOM
    effect(() => {
      const isDark = this._isDark();
      const htmlElement = document.documentElement;
      
      if (isDark) {
        htmlElement.classList.add('dark');
        htmlElement.classList.remove('light');
      } else {
        htmlElement.classList.add('light');
        htmlElement.classList.remove('dark');
      }
      
      // Set data attribute for CSS custom properties
      htmlElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    });
    
    // Effect to update isDark when theme changes
    effect(() => {
      this._theme(); // Subscribe to theme changes
      this.updateIsDark();
    });
  }
  
  private setupSystemThemeListener(): void {
    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleSystemThemeChange = () => {
      if (this._theme() === 'auto') {
        this.updateIsDark();
      }
    };
    
    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleSystemThemeChange);
    } else {
      // Legacy browsers
      mediaQuery.addListener(handleSystemThemeChange);
    }
  }
  
  private updateIsDark(): void {
    const computedTheme = this.getComputedTheme();
    this._isDark.set(computedTheme === 'dark');
  }
  
  private getSystemTheme(): 'light' | 'dark' {
    if (!isPlatformBrowser(this.platformId)) {
      return 'light';
    }
    
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  }
  
  private isValidTheme(theme: string | null): theme is Theme {
    return theme === 'light' || theme === 'dark' || theme === 'auto';
  }
}