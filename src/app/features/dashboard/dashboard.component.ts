import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
  ViewChild,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { Store } from '@ngrx/store';
import {
  SummaryCardComponent,
  PerformanceChartComponent,
  FunnelChartComponent,
  QuickOverviewComponent,
  ClientTableComponent,
  ClientFormDialogComponent,
  ClientFormData,
} from '../../shared/components';
import {
  SummaryCard,
  PerformanceChartData,
  FunnelChartData,
  QuickOverviewMetric,
  ClientEntry,
} from '../../shared/models';
import * as DashboardActions from '../../store/dashboard/dashboard.actions';
import * as DashboardSelectors from '../../store/dashboard/dashboard.selectors';

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
        <div class="mb-8">
          <app-quick-overview
            [recentOutreach]="recentOutreach"
            [engagementTypes]="engagementTypes"
            [todaySchedule]="todaySchedule"
            [performanceMetrics]="performanceMetrics"
            title="Quick Overview"
            subtitle="Key metrics and recent activity summary"
          ></app-quick-overview>
        </div>

        <!-- Client Entries Table -->
        <app-client-table
          [clients]="clientEntries"
          title="Client Entries"
          subtitle="Manage and track all your client interactions"
          (editClient)="onEditClient($event)"
          (deleteClient)="onDeleteClient($event)"
        ></app-client-table>
      </div>

      <!-- Client Form Dialog -->
      <app-client-form-dialog
        [isOpen]="isClientDialogOpen"
        [isSubmitting]="isAddingClient"
        [title]="isEditingClient ? 'Edit Client' : 'Add New Client'"
        [initialData]="editingClientData"
        (clientSubmit)="onUpdateClient($event)"
        (dialogCancel)="closeClientDialog()"
        (dialogClose)="closeClientDialog()"
      ></app-client-form-dialog>

      <!-- Delete Confirmation Dialog -->
      <div
        *ngIf="isDeleteConfirmOpen"
        class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
        (click)="cancelDeleteClient()"
      >
        <div
          class="relative top-20 mx-auto p-5 border w-11/12 md:w-96 shadow-lg rounded-md bg-white dark:bg-gray-800"
          (click)="$event.stopPropagation()"
        >
          <div class="mt-3 text-center">
            <div
              class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/20"
            >
              <svg
                class="h-6 w-6 text-red-600 dark:text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mt-4">
              Delete Client
            </h3>
            <div class="mt-2 px-7 py-3">
              <p class="text-sm text-gray-600 dark:text-gray-400">
                Are you sure you want to delete
                <strong>{{ clientToDelete?.name }}</strong> from
                <strong>{{ clientToDelete?.company }}</strong
                >? This action cannot be undone.
              </p>
            </div>
            <div class="items-center px-4 py-3">
              <button
                (click)="confirmDeleteClient()"
                class="px-4 py-2 bg-red-600 text-white text-base font-medium rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 mr-2"
              >
                Delete
              </button>
              <button
                (click)="cancelDeleteClient()"
                class="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white text-base font-medium rounded-md shadow-sm hover:bg-gray-400 dark:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class DashboardComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private store = inject(Store);
  private cdr = inject(ChangeDetectorRef);

  @ViewChild(ClientFormDialogComponent)
  clientDialog!: ClientFormDialogComponent;

  // Dashboard data properties - now sourced from store
  summaryCards$ = this.store.select(DashboardSelectors.selectSummaryCards);
  performanceData$ = this.store.select(
    DashboardSelectors.selectPerformanceData,
  );
  funnelData$ = this.store.select(DashboardSelectors.selectFunnelData);
  recentOutreach$ = this.store.select(DashboardSelectors.selectRecentOutreach);
  engagementTypes$ = this.store.select(
    DashboardSelectors.selectEngagementTypes,
  );
  todaySchedule$ = this.store.select(DashboardSelectors.selectTodaySchedule);
  performanceMetrics$ = this.store.select(
    DashboardSelectors.selectPerformanceMetrics,
  );
  clientEntries$ = this.store.select(DashboardSelectors.selectClients);

  // UI state from store
  isLoading$ = this.store.select(DashboardSelectors.selectIsAnyDataLoading);
  errorMessage$ = this.store.select(DashboardSelectors.selectDashboardError);
  isAddingClient$ = this.store.select(DashboardSelectors.selectAddingClient);

  // Local component state for dialog management
  isClientDialogOpen = false;
  isEditingClient = false;
  editingClientData: Partial<ClientFormData> = {};
  isDeleteConfirmOpen = false;
  clientToDelete: ClientEntry | null = null;

  // Temporary properties for template compatibility (will be removed later)
  summaryCards: SummaryCard[] = [];
  performanceData: PerformanceChartData[] = [];
  funnelData: FunnelChartData[] = [];
  recentOutreach: QuickOverviewMetric[] = [];
  engagementTypes: QuickOverviewMetric[] = [];
  todaySchedule: QuickOverviewMetric[] = [];
  performanceMetrics: QuickOverviewMetric[] = [];
  clientEntries: ClientEntry[] = [];
  isLoading = false;
  errorMessage = '';
  isAddingClient = false;

  ngOnInit(): void {
    this.loadDashboardData();
    this.subscribeToStoreData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private subscribeToStoreData(): void {
    // Subscribe to store data to update local properties for template compatibility
    this.summaryCards$.pipe(takeUntil(this.destroy$)).subscribe((cards) => {
      this.summaryCards = cards;
      this.cdr.markForCheck();
    });

    this.performanceData$.pipe(takeUntil(this.destroy$)).subscribe((data) => {
      this.performanceData = data;
      this.cdr.markForCheck();
    });

    this.funnelData$.pipe(takeUntil(this.destroy$)).subscribe((data) => {
      this.funnelData = data;
      this.cdr.markForCheck();
    });

    this.recentOutreach$.pipe(takeUntil(this.destroy$)).subscribe((data) => {
      this.recentOutreach = data;
      this.cdr.markForCheck();
    });

    this.engagementTypes$.pipe(takeUntil(this.destroy$)).subscribe((data) => {
      this.engagementTypes = data;
      this.cdr.markForCheck();
    });

    this.todaySchedule$.pipe(takeUntil(this.destroy$)).subscribe((data) => {
      this.todaySchedule = data;
      this.cdr.markForCheck();
    });

    this.performanceMetrics$
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.performanceMetrics = data;
        this.cdr.markForCheck();
      });

    this.clientEntries$.pipe(takeUntil(this.destroy$)).subscribe((clients) => {
      this.clientEntries = clients;
      this.cdr.markForCheck();
    });

    this.isLoading$.pipe(takeUntil(this.destroy$)).subscribe((loading) => {
      this.isLoading = loading;
      this.cdr.markForCheck();
    });

    this.errorMessage$.pipe(takeUntil(this.destroy$)).subscribe((error) => {
      this.errorMessage = error || '';
      this.cdr.markForCheck();
    });

    this.isAddingClient$.pipe(takeUntil(this.destroy$)).subscribe((adding) => {
      this.isAddingClient = adding;
      this.cdr.markForCheck();
    });
  }

  loadDashboardData(): void {
    this.store.dispatch(DashboardActions.loadDashboardData());
  }

  openNewClientDialog(): void {
    this.isClientDialogOpen = true;
  }

  closeClientDialog(): void {
    this.isClientDialogOpen = false;
    this.isAddingClient = false;
    this.isEditingClient = false;
    this.editingClientData = {};
  }

  onAddClient(clientData: ClientFormData): void {
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

    this.store.dispatch(DashboardActions.addClient({ client: newClient }));

    // Listen for success to show message and close dialog
    this.store
      .select(DashboardSelectors.selectAddingClient)
      .pipe(takeUntil(this.destroy$))
      .subscribe((adding) => {
        if (!adding && !this.errorMessage) {
          // Client added successfully
          this.clientDialog.showSuccess('Client added successfully!');
        }
      });
  }

  onEditClient(client: ClientEntry): void {
    this.isEditingClient = true;
    this.editingClientData = {
      name: client.name,
      company: client.company,
      email: client.email,
      phone: client.phone,
      status: client.status,
      contact_method: client.method,
      revenue: client.revenue,
    };
    this.isClientDialogOpen = true;
  }

  onUpdateClient(clientData: ClientFormData): void {
    if (!this.isEditingClient) {
      this.onAddClient(clientData);
      return;
    }

    // Find the client being edited
    const clientToUpdate = this.clientEntries.find(
      (c) =>
        c.name === this.editingClientData.name &&
        c.company === this.editingClientData.company,
    );

    if (!clientToUpdate) {
      // eslint-disable-next-line no-console
      console.error('Client to update not found');
      return;
    }

    // Transform form data to match Client interface
    const updates = {
      name: clientData.name,
      company: clientData.company,
      email: clientData.email,
      phone: clientData.phone || '',
      status: clientData.status,
      contact_method: clientData.contact_method,
      revenue: clientData.revenue,
      last_contact: new Date().toISOString(),
    };

    this.store.dispatch(
      DashboardActions.updateClient({
        id: clientToUpdate.id,
        updates,
      }),
    );

    // Listen for success to show message and close dialog
    this.store
      .select(DashboardSelectors.selectUpdatingClient)
      .pipe(takeUntil(this.destroy$))
      .subscribe((updating) => {
        if (!updating && !this.errorMessage) {
          // Client updated successfully
          this.isEditingClient = false;
          this.editingClientData = {};
          this.clientDialog.showSuccess('Client updated successfully!');
        }
      });
  }

  onDeleteClient(client: ClientEntry): void {
    this.clientToDelete = client;
    this.isDeleteConfirmOpen = true;
  }

  confirmDeleteClient(): void {
    if (!this.clientToDelete) return;

    this.store.dispatch(
      DashboardActions.deleteClient({
        id: this.clientToDelete.id,
      }),
    );

    // Listen for success to close dialog
    this.store
      .select(DashboardSelectors.selectDeletingClient)
      .pipe(takeUntil(this.destroy$))
      .subscribe((deleting) => {
        if (!deleting && !this.errorMessage) {
          // Client deleted successfully
          this.isDeleteConfirmOpen = false;
          this.clientToDelete = null;
        }
      });
  }

  cancelDeleteClient(): void {
    this.isDeleteConfirmOpen = false;
    this.clientToDelete = null;
  }
}
