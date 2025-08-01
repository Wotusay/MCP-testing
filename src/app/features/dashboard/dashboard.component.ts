import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import {
  SummaryCardComponent,
  PerformanceChartComponent,
  FunnelChartComponent,
  QuickOverviewComponent,
  ClientTableComponent,
  ClientFormDialogComponent,
  ClientFormData,
} from '../../shared/components';
import { DashboardService } from '../../shared/services';
import {
  SummaryCard,
  PerformanceChartData,
  FunnelChartData,
  QuickOverviewMetric,
  ClientEntry,
} from '../../shared/models';

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
    ClientFormDialogComponent,
  ],
  template: `
    <div class="space-y-8">
      <!-- Header -->
      <div class="mb-8">
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
            (click)="openNewClientDialog()"
            class="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-4 py-2 rounded-lg font-medium hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
          >
            + New Client
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div *ngIf="isLoading" class="text-center py-8">
        <div
          class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"
        ></div>
        <p class="mt-2 text-gray-600 dark:text-gray-400">
          Loading dashboard data...
        </p>
      </div>

      <!-- Error State -->
      <div
        *ngIf="errorMessage"
        class="bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-8"
      >
        <div class="flex">
          <div class="ml-3">
            <h3 class="text-sm font-medium text-red-800 dark:text-red-200">
              Error loading dashboard data
            </h3>
            <div class="mt-2 text-sm text-red-700 dark:text-red-300">
              {{ errorMessage }}
            </div>
            <div class="mt-4">
              <button
                (click)="loadDashboardData()"
                class="bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-200 px-3 py-1 rounded text-sm hover:bg-red-200 dark:hover:bg-red-700 transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Dashboard Content -->
      <div *ngIf="!isLoading && !errorMessage">
        <!-- Summary Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <app-summary-card
            *ngFor="let card of summaryCards"
            [card]="card"
          ></app-summary-card>
        </div>

        <!-- Charts Section -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <!-- Weekly Outreach Performance -->
          <app-performance-chart
            [data]="performanceData"
            title="Weekly Outreach Performance"
            primaryLabel="Outreach Attempts"
            secondaryLabel="Responses"
          ></app-performance-chart>

          <!-- Client Journey Funnel -->
          <app-funnel-chart
            [data]="funnelData"
            title="Client Journey Funnel"
          ></app-funnel-chart>
        </div>

        <!-- Quick Overview -->
        <app-quick-overview
          [recentOutreach]="recentOutreach"
          [engagementTypes]="engagementTypes"
          [todaySchedule]="todaySchedule"
          [performanceMetrics]="performanceMetrics"
          title="Quick Overview"
          subtitle="Key metrics and recent activity summary"
        ></app-quick-overview>

        <!-- Client Entries Table -->
        <app-client-table
          [clients]="clientEntries"
          title="Client Entries"
          subtitle="Manage and track all your client interactions"
        ></app-client-table>
      </div>

      <!-- Client Form Dialog -->
      <app-client-form-dialog
        [isOpen]="isClientDialogOpen"
        [isSubmitting]="isAddingClient"
        (clientSubmit)="onAddClient($event)"
        (dialogCancel)="closeClientDialog()"
        (dialogClose)="closeClientDialog()"
      ></app-client-form-dialog>
    </div>
  `,
})
export class DashboardComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  // Dashboard data properties
  summaryCards: SummaryCard[] = [];
  performanceData: PerformanceChartData[] = [];
  funnelData: FunnelChartData[] = [];
  recentOutreach: QuickOverviewMetric[] = [];
  engagementTypes: QuickOverviewMetric[] = [];
  todaySchedule: QuickOverviewMetric[] = [];
  performanceMetrics: QuickOverviewMetric[] = [];
  clientEntries: ClientEntry[] = [];

  // Component state
  isLoading = true;
  errorMessage = '';
  isClientDialogOpen = false;
  isAddingClient = false;

  // eslint-disable-next-line @angular-eslint/prefer-inject
  constructor(
    // eslint-disable-next-line @angular-eslint/prefer-inject
    private dashboardService: DashboardService,
    // eslint-disable-next-line @angular-eslint/prefer-inject
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadDashboardData(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.dashboardService
      .getAllDashboardData()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.summaryCards = data.summaryCards;
          this.performanceData = data.performanceData;
          this.funnelData = data.funnelData;
          this.recentOutreach = data.recentOutreach;
          this.engagementTypes = data.engagementTypes;
          this.todaySchedule = data.todaySchedule;
          this.performanceMetrics = data.performanceMetrics;
          this.clientEntries = data.clients;
          this.isLoading = false;
          // Trigger change detection for OnPush strategy
          this.cdr.markForCheck();
        },
        error: (error) => {
          // eslint-disable-next-line no-console
          console.error('Failed to load dashboard data:', error);
          this.errorMessage =
            error.message ||
            'An unexpected error occurred while loading dashboard data.';
          this.isLoading = false;
          // Trigger change detection for OnPush strategy
          this.cdr.markForCheck();
        },
      });
  }

  openNewClientDialog(): void {
    this.isClientDialogOpen = true;
  }

  closeClientDialog(): void {
    this.isClientDialogOpen = false;
    this.isAddingClient = false;
  }

  onAddClient(clientData: ClientFormData): void {
    this.isAddingClient = true;

    // Transform form data to match Client interface
    const newClient = {
      name: clientData.name,
      company: clientData.company,
      email: clientData.email,
      phone: clientData.phone || '',
      status: clientData.status,
      contact_method: clientData.contact_method,
      revenue: clientData.revenue,
      last_contact: new Date().toISOString(),
    };

    this.dashboardService
      .addClient(newClient)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          // Client added successfully, refresh data
          this.loadDashboardData();

          // The dialog will auto-close via the success message
          this.isAddingClient = false;
        },
        error: (error) => {
          // eslint-disable-next-line no-console
          console.error('Failed to add client:', error);
          this.isAddingClient = false;

          // Show error message in dialog (if you have access to dialog component)
          // For now, we'll just log the error
        },
      });
  }
}
