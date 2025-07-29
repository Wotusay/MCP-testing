import { Injectable } from '@angular/core';

export interface PerformanceMetrics {
  loadTime: number;
  domContentLoadedTime: number;
  firstContentfulPaint?: number;
  largestContentfulPaint?: number;
  firstInputDelay?: number;
  cumulativeLayoutShift?: number;
}

@Injectable({
  providedIn: 'root',
})
export class PerformanceMonitoringService {
  private metrics: PerformanceMetrics = {
    loadTime: 0,
    domContentLoadedTime: 0,
  };

  constructor() {
    this.initializeMetrics();
    this.setupPerformanceObserver();
  }

  private initializeMetrics(): void {
    if (typeof window !== 'undefined' && window.performance) {
      const navigation = performance.getEntriesByType(
        'navigation',
      )[0] as PerformanceNavigationTiming;

      if (navigation) {
        this.metrics.loadTime =
          navigation.loadEventEnd - navigation.loadEventStart;
        this.metrics.domContentLoadedTime =
          navigation.domContentLoadedEventEnd -
          navigation.domContentLoadedEventStart;
      }
    }
  }

  private setupPerformanceObserver(): void {
    if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
      // Observe Core Web Vitals
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          switch (entry.entryType) {
            case 'paint':
              if (entry.name === 'first-contentful-paint') {
                this.metrics.firstContentfulPaint = entry.startTime;
              }
              break;
            case 'largest-contentful-paint':
              this.metrics.largestContentfulPaint = entry.startTime;
              break;
            case 'first-input':
              this.metrics.firstInputDelay =
                (entry as PerformanceEntry & { processingStart: number })
                  .processingStart - entry.startTime;
              break;
            case 'layout-shift':
              if (
                !(entry as PerformanceEntry & { hadRecentInput: boolean })
                  .hadRecentInput
              ) {
                this.metrics.cumulativeLayoutShift =
                  (this.metrics.cumulativeLayoutShift || 0) +
                  (entry as PerformanceEntry & { value: number }).value;
              }
              break;
          }
        }
      });

      try {
        observer.observe({
          entryTypes: [
            'paint',
            'largest-contentful-paint',
            'first-input',
            'layout-shift',
          ],
        });
      } catch (error) {
        // Fallback for browsers that don't support all entry types
        // eslint-disable-next-line no-console
        console.warn('Performance observer setup failed:', error);
      }
    }
  }

  getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  logPerformance(): void {
    // eslint-disable-next-line no-console
    console.group('🚀 Performance Metrics');
    // eslint-disable-next-line no-console
    console.log('Load Time:', this.metrics.loadTime.toFixed(2), 'ms');
    // eslint-disable-next-line no-console
    console.log(
      'DOM Content Loaded:',
      this.metrics.domContentLoadedTime.toFixed(2),
      'ms',
    );

    if (this.metrics.firstContentfulPaint) {
      // eslint-disable-next-line no-console
      console.log(
        'First Contentful Paint:',
        this.metrics.firstContentfulPaint.toFixed(2),
        'ms',
      );
    }

    if (this.metrics.largestContentfulPaint) {
      // eslint-disable-next-line no-console
      console.log(
        'Largest Contentful Paint:',
        this.metrics.largestContentfulPaint.toFixed(2),
        'ms',
      );
    }

    if (this.metrics.firstInputDelay) {
      // eslint-disable-next-line no-console
      console.log(
        'First Input Delay:',
        this.metrics.firstInputDelay.toFixed(2),
        'ms',
      );
    }

    if (this.metrics.cumulativeLayoutShift) {
      // eslint-disable-next-line no-console
      console.log(
        'Cumulative Layout Shift:',
        this.metrics.cumulativeLayoutShift.toFixed(4),
      );
    }

    // eslint-disable-next-line no-console
    console.groupEnd();
  }

  measureComponentLoad(): number {
    const startTime = performance.now();
    return startTime;
  }

  logComponentLoad(componentName: string, startTime: number): void {
    const endTime = performance.now();
    const loadTime = endTime - startTime;
    // eslint-disable-next-line no-console
    console.log(`📦 ${componentName} loaded in ${loadTime.toFixed(2)}ms`);
  }
}
