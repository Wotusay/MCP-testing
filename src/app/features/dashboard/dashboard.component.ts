import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  SummaryCardComponent,
  PerformanceChartComponent,
  FunnelChartComponent,
  QuickOverviewComponent,
  ClientTableComponent,
} from '../../shared/components';
import {
  mockSummaryCards,
  mockPerformanceData,
  mockFunnelData,
  mockRecentOutreach,
  mockEngagementTypes,
  mockTodaySchedule,
  mockPerformanceMetrics,
  mockClientEntries,
} from '../../shared/testing/mock-data';

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
          >
            + New Client
          </button>
        </div>
      </div>

      <!-- Summary Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <app-summary-card
          *ngFor="let card of summaryCards"
          [card]="card"
        ></app-summary-card>
      </div>

      <!-- Charts Section -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
  `,
})
export class DashboardComponent {
  // Use mock data from the shared testing module
  summaryCards = mockSummaryCards;
  performanceData = mockPerformanceData;
  funnelData = mockFunnelData;
  recentOutreach = mockRecentOutreach;
  engagementTypes = mockEngagementTypes;
  todaySchedule = mockTodaySchedule;
  performanceMetrics = mockPerformanceMetrics;
  clientEntries = mockClientEntries;
}
