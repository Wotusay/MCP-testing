import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientEntry } from '../../testing/mock-data';

@Component({
  selector: 'app-client-table',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  template: `
    <div
      class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
    >
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
          {{ title }}
        </h3>
        <button
          class="text-sm text-gray-900 dark:text-white bg-transparent border border-gray-300 dark:border-gray-600 px-3 py-1 rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          {{ exportButtonText }}
        </button>
      </div>
      <p class="text-sm text-gray-600 dark:text-gray-400 mb-6">
        {{ subtitle }}
      </p>

      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
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
              *ngFor="let client of clients"
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
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
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
  `,
})
export class ClientTableComponent {
  @Input() title: string = 'Client Entries';
  @Input() subtitle: string = 'Manage and track all your client interactions';
  @Input() exportButtonText: string = 'Export Data';
  @Input() clients: ClientEntry[] = [];

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

  formatCurrency(amount: number): string {
    if (amount === 0) return '$0';
    return `$${amount.toLocaleString()}`;
  }
}
