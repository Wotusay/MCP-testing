import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  HostListener,
} from '@angular/core';
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
          class="text-sm text-gray-900 dark:text-white bg-transparent border border-gray-300 dark:border-gray-600 px-3 py-1 rounded hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1 transition-colors duration-150"
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
              class="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150"
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
                <div class="relative inline-block text-left">
                  <button
                    (click)="toggleDropdown(client.id)"
                    class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 rounded-md p-1 transition-colors duration-150"
                    [attr.aria-expanded]="activeDropdown === client.id"
                    aria-haspopup="true"
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

                  <!-- Dropdown Menu -->
                  <div
                    *ngIf="activeDropdown === client.id"
                    class="absolute right-0 z-10 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none"
                    role="menu"
                    aria-orientation="vertical"
                    [attr.aria-labelledby]="'dropdown-button-' + client.id"
                  >
                    <div class="py-1 grid" role="none">
                      <button
                        (click)="onEditClient(client)"
                        class="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-700 transition-colors duration-150"
                        role="menuitem"
                        tabindex="-1"
                      >
                        <div class="flex items-center justify-start">
                          <svg
                            class="w-4 h-4 mr-3 flex-shrink-0"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                          <span class="align-middle">Edit</span>
                        </div>
                      </button>
                      <button
                        (click)="onDeleteClient(client)"
                        class="w-full text-left px-4 py-2 text-sm text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 focus:outline-none focus:bg-red-50 dark:focus:bg-red-900/20 transition-colors duration-150"
                        role="menuitem"
                        tabindex="-1"
                      >
                        <div class="flex items-center justify-start">
                          <svg
                            class="w-4 h-4 mr-3 flex-shrink-0"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                          <span class="align-middle">Delete</span>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
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

  @Output() editClient = new EventEmitter<ClientEntry>();
  @Output() deleteClient = new EventEmitter<ClientEntry>();

  activeDropdown: string | null = null;

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

  toggleDropdown(clientId: string): void {
    this.activeDropdown = this.activeDropdown === clientId ? null : clientId;
  }

  onEditClient(client: ClientEntry): void {
    this.activeDropdown = null;
    this.editClient.emit(client);
  }

  onDeleteClient(client: ClientEntry): void {
    this.activeDropdown = null;
    this.deleteClient.emit(client);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    // Close dropdown when clicking outside
    const target = event.target as HTMLElement;
    if (!target.closest('.relative.inline-block.text-left')) {
      this.activeDropdown = null;
    }
  }

  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    // Close dropdown when pressing Escape
    this.activeDropdown = null;
  }
}
