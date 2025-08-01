import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface ClientFormData {
  name: string;
  company: string;
  email: string;
  phone?: string;
  status:
    | 'Interested'
    | 'Follow-up'
    | 'Converted'
    | 'Initial Contact'
    | 'Not Interested';
  contact_method: 'Email' | 'Phone' | 'Meeting' | 'LinkedIn';
  revenue: number;
}

@Component({
  selector: 'app-client-form-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <!-- Modal Backdrop -->
    <div
      *ngIf="isOpen"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
      (click)="onBackdropClick($event)"
    >
      <!-- Modal Container -->
      <div
        class="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 xl:w-1/3 shadow-lg rounded-md bg-white dark:bg-gray-800"
      >
        <!-- Modal Header -->
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white">
            {{ title }}
          </h3>
          <button
            type="button"
            (click)="onCancel()"
            class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            aria-label="Close"
          >
            <svg
              class="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div>

        <!-- Form -->
        <form (ngSubmit)="onSubmit()" #clientForm="ngForm" class="space-y-4">
          <!-- Name -->
          <div>
            <label
              for="name"
              class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Name *
            </label>
            <input
              id="name"
              name="name"
              type="text"
              [(ngModel)]="formData.name"
              required
              minlength="2"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Client full name"
            />
            <div
              *ngIf="
                clientForm.submitted && clientForm.controls['name']?.invalid
              "
              class="text-red-600 text-sm mt-1"
            >
              Name is required and must be at least 2 characters
            </div>
          </div>

          <!-- Company -->
          <div>
            <label
              for="company"
              class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Company *
            </label>
            <input
              id="company"
              name="company"
              type="text"
              [(ngModel)]="formData.company"
              required
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Company name"
            />
            <div
              *ngIf="
                clientForm.submitted && clientForm.controls['company']?.invalid
              "
              class="text-red-600 text-sm mt-1"
            >
              Company is required
            </div>
          </div>

          <!-- Email -->
          <div>
            <label
              for="email"
              class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Email *
            </label>
            <input
              id="email"
              name="email"
              type="email"
              [(ngModel)]="formData.email"
              required
              email
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="client@company.com"
            />
            <div
              *ngIf="
                clientForm.submitted && clientForm.controls['email']?.invalid
              "
              class="text-red-600 text-sm mt-1"
            >
              Please enter a valid email address
            </div>
          </div>

          <!-- Phone -->
          <div>
            <label
              for="phone"
              class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Phone
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              [(ngModel)]="formData.phone"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="+1 (555) 123-4567"
            />
          </div>

          <!-- Status -->
          <div>
            <label
              for="status"
              class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Status *
            </label>
            <select
              id="status"
              name="status"
              [(ngModel)]="formData.status"
              required
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="Initial Contact">Initial Contact</option>
              <option value="Interested">Interested</option>
              <option value="Follow-up">Follow-up</option>
              <option value="Converted">Converted</option>
              <option value="Not Interested">Not Interested</option>
            </select>
          </div>

          <!-- Contact Method -->
          <div>
            <label
              for="contact_method"
              class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Preferred Contact Method *
            </label>
            <select
              id="contact_method"
              name="contact_method"
              [(ngModel)]="formData.contact_method"
              required
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="Email">Email</option>
              <option value="Phone">Phone</option>
              <option value="Meeting">Meeting</option>
              <option value="LinkedIn">LinkedIn</option>
            </select>
          </div>

          <!-- Revenue -->
          <div>
            <label
              for="revenue"
              class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Expected Revenue ($)
            </label>
            <input
              id="revenue"
              name="revenue"
              type="number"
              [(ngModel)]="formData.revenue"
              min="0"
              step="100"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="5000"
            />
          </div>

          <!-- Form Actions -->
          <div class="flex justify-end space-x-3 pt-6">
            <button
              type="button"
              (click)="onCancel()"
              class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              [disabled]="isSubmitting"
              class="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {{
                isSubmitting
                  ? title.includes('Edit')
                    ? 'Updating...'
                    : 'Adding...'
                  : title.includes('Edit')
                    ? 'Update Client'
                    : 'Add Client'
              }}
            </button>
          </div>

          <!-- Success Message -->
          <div
            *ngIf="successMessage"
            class="mt-4 p-3 bg-green-50 dark:bg-green-900/50 border border-green-200 dark:border-green-800 rounded-md"
          >
            <p class="text-sm text-green-800 dark:text-green-200">
              {{ successMessage }}
            </p>
          </div>

          <!-- Error Message -->
          <div
            *ngIf="errorMessage"
            class="mt-4 p-3 bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 rounded-md"
          >
            <p class="text-sm text-red-800 dark:text-red-200">
              {{ errorMessage }}
            </p>
          </div>
        </form>
      </div>
    </div>
  `,
})
export class ClientFormDialogComponent implements OnInit {
  @Input() isOpen = false;
  @Input() title = 'Add New Client';
  @Input() initialData: Partial<ClientFormData> = {};
  @Input() isSubmitting = false;

  @Output() clientSubmit = new EventEmitter<ClientFormData>();
  @Output() dialogCancel = new EventEmitter<void>();
  @Output() dialogClose = new EventEmitter<void>();

  formData: ClientFormData = {
    name: '',
    company: '',
    email: '',
    phone: '',
    status: 'Initial Contact',
    contact_method: 'Email',
    revenue: 0,
  };

  successMessage = '';
  errorMessage = '';

  ngOnInit() {
    // Initialize form with any provided data
    if (this.initialData && Object.keys(this.initialData).length > 0) {
      this.formData = { ...this.formData, ...this.initialData };
    }
  }

  onSubmit() {
    this.clearMessages();

    if (this.isFormValid()) {
      this.clientSubmit.emit({ ...this.formData });
    }
  }

  onCancel() {
    this.clearMessages();
    this.resetForm();
    this.dialogCancel.emit();
  }

  onBackdropClick(event: MouseEvent) {
    // Only close if clicking the backdrop itself, not the modal content
    if (event.target === event.currentTarget) {
      this.onCancel();
    }
  }

  showSuccess(message: string) {
    this.successMessage = message;
    this.errorMessage = '';

    // Auto-close after success
    setTimeout(() => {
      this.resetForm();
      this.clearMessages();
      this.dialogClose.emit();
    }, 2000);
  }

  showError(message: string) {
    this.errorMessage = message;
    this.successMessage = '';
  }

  private clearMessages() {
    this.successMessage = '';
    this.errorMessage = '';
  }

  private resetForm() {
    const defaultFormData = {
      name: '',
      company: '',
      email: '',
      phone: '',
      status: 'Initial Contact' as const,
      contact_method: 'Email' as const,
      revenue: 0,
    };

    // If we have initial data, keep it for edit mode, otherwise use defaults
    if (this.initialData && Object.keys(this.initialData).length > 0) {
      this.formData = { ...defaultFormData, ...this.initialData };
    } else {
      this.formData = defaultFormData;
    }
  }

  private isFormValid(): boolean {
    return (
      this.formData.name.length >= 2 &&
      this.formData.company.length > 0 &&
      this.formData.email.includes('@') &&
      this.formData.email.includes('.')
    );
  }
}
