import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface UserFormData {
  name: string;
  email: string;
  active: boolean;
}

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <form (ngSubmit)="onSubmit()" #userForm="ngForm" class="user-form">
      <h2>{{ title }}</h2>

      <div class="form-group">
        <label for="name">Name:</label>
        <input
          id="name"
          name="name"
          type="text"
          [(ngModel)]="formData.name"
          required
          minlength="2"
          class="form-control"
          data-testid="name-input"
        />
        <div
          *ngIf="userForm.submitted && userForm.controls['name']?.invalid"
          class="error-message"
          data-testid="name-error"
        >
          Name is required and must be at least 2 characters
        </div>
      </div>

      <div class="form-group">
        <label for="email">Email:</label>
        <input
          id="email"
          name="email"
          type="email"
          [(ngModel)]="formData.email"
          required
          email
          class="form-control"
          data-testid="email-input"
        />
        <div
          *ngIf="userForm.submitted && userForm.controls['email']?.invalid"
          class="error-message"
          data-testid="email-error"
        >
          Please enter a valid email address
        </div>
      </div>

      <div class="form-group">
        <label>
          <input
            name="active"
            type="checkbox"
            [(ngModel)]="formData.active"
            data-testid="active-checkbox"
          />
          Active User
        </label>
      </div>

      <div class="form-actions">
        <button
          type="submit"
          [disabled]="isSubmitting"
          class="btn btn-primary"
          data-testid="submit-button"
        >
          {{ isSubmitting ? 'Saving...' : 'Save User' }}
        </button>

        <button
          type="button"
          (click)="onCancel()"
          class="btn btn-secondary"
          data-testid="cancel-button"
        >
          Cancel
        </button>
      </div>

      <div
        *ngIf="successMessage"
        class="success-message"
        data-testid="success-message"
      >
        {{ successMessage }}
      </div>

      <div
        *ngIf="errorMessage"
        class="error-message"
        data-testid="error-message"
      >
        {{ errorMessage }}
      </div>
    </form>
  `,
  styles: [
    `
      .user-form {
        max-width: 400px;
        margin: 0 auto;
        padding: 20px;
      }

      .form-group {
        margin-bottom: 16px;
      }

      .form-control {
        width: 100%;
        padding: 8px;
        border: 1px solid #ccc;
        border-radius: 4px;
      }

      .error-message {
        color: #dc3545;
        font-size: 14px;
        margin-top: 4px;
      }

      .success-message {
        color: #28a745;
        font-size: 14px;
        margin-top: 16px;
      }

      .form-actions {
        display: flex;
        gap: 8px;
        margin-top: 20px;
      }

      .btn {
        padding: 8px 16px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
      }

      .btn-primary {
        background-color: #007bff;
        color: white;
      }

      .btn-primary:disabled {
        background-color: #6c757d;
        cursor: not-allowed;
      }

      .btn-secondary {
        background-color: #6c757d;
        color: white;
      }
    `,
  ],
})
export class UserFormComponent implements OnInit {
  @Input() title = 'User Form';
  @Input() initialData: Partial<UserFormData> = {};
  @Input() isSubmitting = false;

  @Output() userSubmit = new EventEmitter<UserFormData>();
  @Output() userCancel = new EventEmitter<void>();

  formData: UserFormData = {
    name: '',
    email: '',
    active: true,
  };

  successMessage = '';
  errorMessage = '';

  ngOnInit() {
    // Initialize form with any provided data
    this.formData = { ...this.formData, ...this.initialData };
  }

  onSubmit() {
    this.clearMessages();

    if (this.isFormValid()) {
      this.userSubmit.emit({ ...this.formData });
    }
  }

  onCancel() {
    this.clearMessages();
    this.userCancel.emit();
  }

  showSuccess(message: string) {
    this.successMessage = message;
    this.errorMessage = '';
  }

  showError(message: string) {
    this.errorMessage = message;
    this.successMessage = '';
  }

  private clearMessages() {
    this.successMessage = '';
    this.errorMessage = '';
  }

  private isFormValid(): boolean {
    return (
      this.formData.name.length >= 2 &&
      this.formData.email.includes('@') &&
      this.formData.email.includes('.')
    );
  }
}
