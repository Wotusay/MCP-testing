import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  SummaryCardComponent,
  PerformanceChartComponent,
  FunnelChartComponent,
  QuickOverviewComponent,
  ClientTableComponent,
} from '../../shared/components';
import {
  SummaryCard,
  PerformanceData,
  FunnelData,
  QuickMetric,
  ClientEntry,
} from '../../shared/testing/mock-data';
import { DashboardDataService, LoggingService } from '../../shared/services';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    SummaryCardComponent,
    PerformanceChartComponent,
    FunnelChartComponent,
    QuickOverviewComponent,
    ClientTableComponent,
  ],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div class="mb-6">
        <div class="flex justify-between items-center">
          <div>
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
              Client Reach Dashboard
            </h1>
            <p class="text-gray-600 dark:text-gray-400 mt-1">
              Track your outreach performance and client engagement
            </p>
          </div>
          <button
            class="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-4 py-2 rounded-lg font-medium hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
            (click)="addNewClient()"
          >
            + New Client
          </button>
        </div>
      </div>

      <!-- Loading State -->
      @if (isLoading()) {
        <div class="flex justify-center items-center py-12">
          <div
            class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"
          ></div>
          <span class="ml-3 text-gray-600 dark:text-gray-400"
            >Loading dashboard data...</span
          >
        </div>
      } @else {
        <!-- Summary Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <app-summary-card
            *ngFor="let card of summaryCards()"
            [card]="card"
          ></app-summary-card>
        </div>

        <!-- Charts Section -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Weekly Outreach Performance -->
          <app-performance-chart
            [data]="performanceData()"
            title="Weekly Outreach Performance"
            primaryLabel="Outreach Attempts"
            secondaryLabel="Responses"
          ></app-performance-chart>

          <!-- Client Journey Funnel -->
          <app-funnel-chart
            [data]="funnelData()"
            title="Client Journey Funnel"
          ></app-funnel-chart>
        </div>

        <!-- Quick Overview -->
        <app-quick-overview
          [recentOutreach]="recentOutreach()"
          [engagementTypes]="engagementTypes()"
          [todaySchedule]="todaySchedule()"
          [performanceMetrics]="performanceMetrics()"
          title="Quick Overview"
          subtitle="Key metrics and recent activity summary"
        ></app-quick-overview>

        <!-- Client Entries Table -->
        <app-client-table
          [clients]="clientEntries()"
          title="Client Entries"
          subtitle="Manage and track all your client interactions"
        ></app-client-table>
      }

      <!-- Error State -->
      @if (error()) {
        <div
          class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4"
        >
          <div class="flex">
            <div class="flex-shrink-0">
              <svg
                class="h-5 w-5 text-red-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-red-800 dark:text-red-400">
                Failed to load dashboard data
              </h3>
              <p class="mt-1 text-sm text-red-700 dark:text-red-300">
                {{ error() }}
              </p>
              <div class="mt-4">
                <button
                  type="button"
                  class="bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-400 px-3 py-2 rounded-md text-sm font-medium hover:bg-red-200 dark:hover:bg-red-900/70 transition-colors"
                  (click)="retryLoad()"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  `,
})
export class DashboardComponent implements OnInit {
  private readonly dashboardService = inject(DashboardDataService);
  private readonly logger = inject(LoggingService);

  // Reactive state
  readonly isLoading = signal(false);
  readonly error = signal<string | null>(null);
  readonly summaryCards = signal<SummaryCard[]>([]);
  readonly performanceData = signal<PerformanceData[]>([]);
  readonly funnelData = signal<FunnelData[]>([]);
  readonly recentOutreach = signal<QuickMetric[]>([]);
  readonly engagementTypes = signal<QuickMetric[]>([]);
  readonly todaySchedule = signal<QuickMetric[]>([]);
  readonly performanceMetrics = signal<QuickMetric[]>([]);
  readonly clientEntries = signal<ClientEntry[]>([]);

  ngOnInit(): void {
    this.loadDashboardData();
  }

  /**
   * Load all dashboard data from Supabase via MCP
   */
  private loadDashboardData(): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.dashboardService.getDashboardData().subscribe({
      next: (data) => {
        this.summaryCards.set(data.summaryCards);
        this.performanceData.set(data.performanceData);
        this.funnelData.set(data.funnelData);
        this.recentOutreach.set(data.recentOutreach);
        this.engagementTypes.set(data.engagementTypes);
        this.todaySchedule.set(data.todaySchedule);
        this.performanceMetrics.set(data.performanceMetrics);
        this.clientEntries.set(data.clientEntries);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set(err.message || 'An unexpected error occurred');
        this.isLoading.set(false);
      },
    });
  }

  /**
   * Retry loading dashboard data
   */
  retryLoad(): void {
    this.loadDashboardData();
  }

  /**
   * Add new client handler (placeholder for future implementation)
   */
  addNewClient(): void {
    // TODO: Implement add new client functionality
    this.logger.info('Add new client functionality to be implemented');
  }
}
