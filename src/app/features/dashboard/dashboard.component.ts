import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

// Dashboard data interfaces
interface SummaryCard {
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative';
  icon: string;
}

interface PerformanceData {
  day: string;
  value: number;
  secondaryValue: number;
}

interface FunnelData {
  label: string;
  value: number;
  percentage: number;
  color: string;
}

interface QuickMetric {
  label: string;
  value: string;
  status?: 'success' | 'warning' | 'danger';
}

interface ClientEntry {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  status:
    | 'Interested'
    | 'Follow-up'
    | 'Converted'
    | 'Initial Contact'
    | 'Not Interested';
  lastContact: string;
  method: 'Email' | 'Phone' | 'Meeting' | 'LinkedIn';
  revenue: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
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
        <div
          *ngFor="let card of summaryCards"
          class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <div class="p-2 rounded-lg bg-gray-100 dark:bg-gray-700">
                <svg
                  class="w-5 h-5 text-gray-600 dark:text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path [attr.d]="card.icon"></path>
                </svg>
              </div>
            </div>
            <div class="text-right">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">
                {{ card.title }}
              </p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">
                {{ card.value }}
              </p>
              <p
                class="text-sm font-medium"
                [class.text-success-600]="card.changeType === 'positive'"
                [class.text-danger-600]="card.changeType === 'negative'"
              >
                {{ card.change }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Charts Section -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Weekly Outreach Performance -->
        <div
          class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Weekly Outreach Performance
          </h3>
          <div class="h-64 flex items-end justify-between space-x-2 px-4">
            <div
              *ngFor="let item of performanceData"
              class="flex flex-col items-center space-y-2 flex-1 min-w-0"
            >
              <div
                class="flex flex-col items-center space-y-1 h-48 justify-end w-full"
              >
                <!-- Primary bar (Outreach Attempts) -->
                <div
                  class="w-8 bg-primary-500 rounded-t transition-all duration-300 hover:bg-primary-600"
                  [style.height.px]="(item.value / maxPerformanceValue) * 160"
                  [title]="'Outreach Attempts: ' + item.value"
                ></div>
                <!-- Secondary bar (Responses) -->
                <div
                  class="w-8 bg-success-500 rounded-t transition-all duration-300 hover:bg-success-600 -mt-1"
                  [style.height.px]="
                    (item.secondaryValue / maxPerformanceValue) * 160
                  "
                  [title]="'Responses: ' + item.secondaryValue"
                ></div>
              </div>
              <span
                class="text-xs text-gray-600 dark:text-gray-400 font-medium"
                >{{ item.day }}</span
              >
            </div>
          </div>
          <!-- Chart Legend -->
          <div
            class="flex justify-center space-x-6 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700"
          >
            <div class="flex items-center space-x-2">
              <div class="w-3 h-3 bg-primary-500 rounded"></div>
              <span class="text-sm text-gray-600 dark:text-gray-400"
                >Outreach Attempts</span
              >
            </div>
            <div class="flex items-center space-x-2">
              <div class="w-3 h-3 bg-success-500 rounded"></div>
              <span class="text-sm text-gray-600 dark:text-gray-400"
                >Responses</span
              >
            </div>
          </div>
        </div>

        <!-- Client Journey Funnel -->
        <div
          class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Client Journey Funnel
          </h3>
          <div class="flex items-center justify-center h-64">
            <div class="relative w-48 h-48">
              <svg class="w-full h-full" viewBox="0 0 200 200">
                <g *ngFor="let segment of funnelData; let i = index">
                  <path
                    [attr.d]="getArcPath(segment, i)"
                    [attr.fill]="segment.color"
                    class="hover:opacity-80 transition-opacity cursor-pointer"
                    [attr.stroke]="'white'"
                    [attr.stroke-width]="2"
                  ></path>
                </g>
              </svg>
              <!-- Legend -->
              <div class="absolute -right-6 top-0 space-y-2">
                <div
                  *ngFor="let segment of funnelData"
                  class="flex items-center space-x-2"
                >
                  <div
                    class="w-3 h-3 rounded-full"
                    [style.background-color]="segment.color"
                  ></div>
                  <span class="text-xs text-gray-600 dark:text-gray-400"
                    >{{ segment.label }} {{ segment.percentage }}%</span
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Overview -->
      <div
        class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
      >
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Quick Overview
        </h3>
        <p class="text-sm text-gray-600 dark:text-gray-400 mb-6">
          Key metrics and recent activity summary
        </p>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <!-- Recent Outreach -->
          <div>
            <h4 class="font-medium text-gray-900 dark:text-white mb-3">
              Recent Outreach
            </h4>
            <div class="space-y-2">
              <div
                *ngFor="let metric of recentOutreach"
                class="flex justify-between items-center"
              >
                <span class="text-sm text-gray-600 dark:text-gray-400">{{
                  metric.label
                }}</span>
                <div class="flex items-center space-x-2">
                  <span
                    class="text-sm font-medium text-gray-900 dark:text-white"
                    >{{ metric.value }}</span
                  >
                  <span
                    class="text-xs px-2 py-1 rounded-full"
                    [ngClass]="{
                      'bg-success-100 text-success-800 dark:bg-success-900/20 dark:text-success-400':
                        metric.status === 'success',
                      'bg-warning-100 text-warning-800 dark:bg-warning-900/20 dark:text-warning-400':
                        metric.status === 'warning',
                      'bg-danger-100 text-danger-800 dark:bg-danger-900/20 dark:text-danger-400':
                        metric.status === 'danger',
                    }"
                  >
                    {{ getStatusText(metric.status) }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Engagement Types -->
          <div>
            <h4 class="font-medium text-gray-900 dark:text-white mb-3">
              Engagement Types
            </h4>
            <div class="space-y-2">
              <div
                *ngFor="let metric of engagementTypes"
                class="flex justify-between items-center"
              >
                <span class="text-sm text-gray-600 dark:text-gray-400">{{
                  metric.label
                }}</span>
                <span
                  class="text-sm font-medium text-gray-900 dark:text-white"
                  >{{ metric.value }}</span
                >
              </div>
            </div>
          </div>

          <!-- Today's Schedule -->
          <div>
            <h4 class="font-medium text-gray-900 dark:text-white mb-3">
              Today's Schedule
            </h4>
            <div class="space-y-2">
              <div
                *ngFor="let metric of todaySchedule"
                class="flex justify-between items-center"
              >
                <span class="text-sm text-gray-600 dark:text-gray-400">{{
                  metric.label
                }}</span>
                <div class="flex items-center space-x-2">
                  <span
                    class="text-sm font-medium text-gray-900 dark:text-white"
                    >{{ metric.value }}</span
                  >
                  <span
                    class="text-xs text-gray-500 dark:text-gray-400"
                    *ngIf="metric.status"
                  >
                    {{ getStatusText(metric.status) }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Performance Metrics -->
          <div>
            <h4 class="font-medium text-gray-900 dark:text-white mb-3">
              Performance Metrics
            </h4>
            <div class="space-y-2">
              <div
                *ngFor="let metric of performanceMetrics"
                class="flex justify-between items-center"
              >
                <span class="text-sm text-gray-600 dark:text-gray-400">{{
                  metric.label
                }}</span>
                <div class="flex items-center space-x-2">
                  <span
                    class="text-sm font-medium text-gray-900 dark:text-white"
                    >{{ metric.value }}</span
                  >
                  <span
                    class="text-xs px-2 py-1 rounded-full"
                    [ngClass]="{
                      'bg-success-100 text-success-800 dark:bg-success-900/20 dark:text-success-400':
                        metric.status === 'success',
                      'bg-warning-100 text-warning-800 dark:bg-warning-900/20 dark:text-warning-400':
                        metric.status === 'warning',
                      'bg-danger-100 text-danger-800 dark:bg-danger-900/20 dark:text-danger-400':
                        metric.status === 'danger',
                    }"
                  >
                    {{ getStatusText(metric.status) }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Client Entries Table -->
      <div
        class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
      >
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
            Client Entries
          </h3>
          <button
            class="text-sm text-gray-900 dark:text-white bg-transparent border border-gray-300 dark:border-gray-600 px-3 py-1 rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Export Data
          </button>
        </div>
        <p class="text-sm text-gray-600 dark:text-gray-400 mb-6">
          Manage and track all your client interactions
        </p>

        <div class="overflow-x-auto">
          <table
            class="min-w-full divide-y divide-gray-200 dark:divide-gray-700"
          >
            <thead class="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  Client
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  Contact Info
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  Last Contact
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  Method
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  Revenue
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody
              class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700"
            >
              <tr
                *ngFor="let client of clientEntries"
                class="hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10">
                      <div
                        class="h-10 w-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center"
                      >
                        <span
                          class="text-sm font-medium text-primary-700 dark:text-primary-300"
                          >{{ getInitials(client.name) }}</span
                        >
                      </div>
                    </div>
                    <div class="ml-4">
                      <div
                        class="text-sm font-medium text-gray-900 dark:text-white"
                      >
                        {{ client.name }}
                      </div>
                      <div class="text-sm text-gray-500 dark:text-gray-400">
                        {{ client.company }}
                      </div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900 dark:text-white">
                    {{ client.email }}
                  </div>
                  <div class="text-sm text-gray-500 dark:text-gray-400">
                    {{ client.phone }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                    [ngClass]="getStatusClass(client.status)"
                  >
                    {{ client.status }}
                  </span>
                </td>
                <td
                  class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400"
                >
                  {{ client.lastContact }}
                </td>
                <td
                  class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400"
                >
                  {{ client.method }}
                </td>
                <td
                  class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white"
                >
                  {{ formatCurrency(client.revenue) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button
                    class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <svg
                      class="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M12 6a1 1 0 110-2 1 1 0 010 2zM12 13a1 1 0 110-2 1 1 0 010 2zM12 20a1 1 0 110-2 1 1 0 010 2z"
                      />
                    </svg>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
})
export class DashboardComponent {
  // Summary cards data
  summaryCards: SummaryCard[] = [
    {
      title: 'Total Clients Reached',
      value: '1,247',
      change: '+12.5% from last month',
      changeType: 'positive',
      icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
    },
    {
      title: 'Response Rate',
      value: '34.2%',
      change: '+2.1% from last month',
      changeType: 'positive',
      icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z',
    },
    {
      title: 'Conversion Rate',
      value: '8.7%',
      change: '-0.3% from last month',
      changeType: 'negative',
      icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
    },
    {
      title: 'Revenue Generated',
      value: '$24,890',
      change: '+18.2% from last month',
      changeType: 'positive',
      icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    },
  ];

  // Performance chart data
  performanceData: PerformanceData[] = [
    { day: 'Mon', value: 85, secondaryValue: 42 },
    { day: 'Tue', value: 92, secondaryValue: 58 },
    { day: 'Wed', value: 78, secondaryValue: 35 },
    { day: 'Thu', value: 100, secondaryValue: 67 },
    { day: 'Fri', value: 88, secondaryValue: 51 },
    { day: 'Sat', value: 45, secondaryValue: 18 },
    { day: 'Sun', value: 52, secondaryValue: 22 },
  ];

  get maxPerformanceValue(): number {
    return Math.max(
      ...this.performanceData.map((d) => Math.max(d.value, d.secondaryValue)),
    );
  }

  // Funnel chart data
  funnelData: FunnelData[] = [
    { label: 'Initial Contact', value: 600, percentage: 48, color: '#3b82f6' },
    { label: 'Follow-up', value: 413, percentage: 33, color: '#10b981' },
    { label: 'Interested', value: 175, percentage: 14, color: '#f59e0b' },
    { label: 'Converted', value: 63, percentage: 5, color: '#ef4444' },
  ];

  // Quick Overview data
  recentOutreach: QuickMetric[] = [
    { label: 'Emails Sent', value: '157', status: 'success' },
    { label: 'Cold Calls', value: '89', status: 'warning' },
    { label: 'LinkedIn Messages', value: '34', status: 'success' },
  ];

  engagementTypes: QuickMetric[] = [
    { label: 'Email Responses', value: '43' },
    { label: 'Phone Call-backs', value: '18' },
    { label: 'Meeting Requests', value: '12' },
  ];

  todaySchedule: QuickMetric[] = [
    { label: 'Scheduled Calls', value: '8', status: 'success' },
    { label: 'Follow-ups Due', value: '15', status: 'warning' },
    { label: 'New Leads', value: '5' },
  ];

  performanceMetrics: QuickMetric[] = [
    { label: 'Avg Response Time', value: '2.4h', status: 'success' },
    { label: 'Meeting Show Rate', value: '78%', status: 'success' },
    { label: 'Deal Close Rate', value: '12%', status: 'warning' },
  ];

  // Client entries data
  clientEntries: ClientEntry[] = [
    {
      id: 'SJ',
      name: 'Sarah Johnson',
      company: 'TechCorp Inc.',
      email: 'sarah.johnson@techcorp.com',
      phone: '+1 (555) 123-4567',
      status: 'Interested',
      lastContact: '2 hours ago',
      method: 'Email',
      revenue: 15000,
    },
    {
      id: 'MC',
      name: 'Michael Chen',
      company: 'DataSystems LLC',
      email: 'm.chen@datasystems.com',
      phone: '+1 (555) 987-6543',
      status: 'Follow-up',
      lastContact: '1 day ago',
      method: 'Phone',
      revenue: 8500,
    },
    {
      id: 'ER',
      name: 'Emily Rodriguez',
      company: 'CloudVentures',
      email: 'emily@cloudventures.io',
      phone: '+1 (555) 456-7890',
      status: 'Converted',
      lastContact: '3 days ago',
      method: 'Meeting',
      revenue: 25000,
    },
    {
      id: 'DK',
      name: 'David Kim',
      company: 'StartupHub',
      email: 'd.kim@startuphub.com',
      phone: '+1 (555) 321-0987',
      status: 'Initial Contact',
      lastContact: '5 hours ago',
      method: 'LinkedIn',
      revenue: 0,
    },
    {
      id: 'LT',
      name: 'Lisa Thompson',
      company: 'InnovateLab',
      email: 'lisa@innovatelab.com',
      phone: '+1 (555) 654-3210',
      status: 'Interested',
      lastContact: '6 hours ago',
      method: 'Email',
      revenue: 12000,
    },
    {
      id: 'JW',
      name: 'James Wilson',
      company: 'Future Systems',
      email: 'j.wilson@futuresys.com',
      phone: '+1 (555) 789-0123',
      status: 'Not Interested',
      lastContact: '1 week ago',
      method: 'Phone',
      revenue: 0,
    },
  ];

  getInitials(name: string): string {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  }

  getStatusClass(status: string): string {
    const statusClasses = {
      Interested:
        'bg-primary-100 text-primary-800 dark:bg-primary-900/20 dark:text-primary-400',
      'Follow-up':
        'bg-warning-100 text-warning-800 dark:bg-warning-900/20 dark:text-warning-400',
      Converted:
        'bg-success-100 text-success-800 dark:bg-success-900/20 dark:text-success-400',
      'Initial Contact':
        'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
      'Not Interested':
        'bg-danger-100 text-danger-800 dark:bg-danger-900/20 dark:text-danger-400',
    };
    return (
      statusClasses[status as keyof typeof statusClasses] ||
      'bg-gray-100 text-gray-800'
    );
  }

  getStatusText(status?: string): string {
    const statusTexts = {
      success: '+5%',
      warning: '-1%',
      danger: '-2%',
    };
    return statusTexts[status as keyof typeof statusTexts] || '';
  }

  formatCurrency(amount: number): string {
    if (amount === 0) return '$0';
    return `$${amount.toLocaleString()}`;
  }

  getArcPath(segment: FunnelData, index: number): string {
    const centerX = 100;
    const centerY = 100;
    const radius = 80;
    const total = this.funnelData.reduce((sum, item) => sum + item.value, 0);

    let startAngle = 0;
    for (let i = 0; i < index; i++) {
      startAngle += (this.funnelData[i].value / total) * 2 * Math.PI;
    }

    const endAngle = startAngle + (segment.value / total) * 2 * Math.PI;

    const startX = centerX + radius * Math.cos(startAngle - Math.PI / 2);
    const startY = centerY + radius * Math.sin(startAngle - Math.PI / 2);
    const endX = centerX + radius * Math.cos(endAngle - Math.PI / 2);
    const endY = centerY + radius * Math.sin(endAngle - Math.PI / 2);

    const largeArcFlag = endAngle - startAngle <= Math.PI ? '0' : '1';

    return [
      'M',
      centerX,
      centerY,
      'L',
      startX,
      startY,
      'A',
      radius,
      radius,
      0,
      largeArcFlag,
      1,
      endX,
      endY,
      'z',
    ].join(' ');
  }
}
