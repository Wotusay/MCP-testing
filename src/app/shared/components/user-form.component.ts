import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

export interface UserFormData {
  name: string;
  email: string;
  active: boolean;
}

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatButtonModule,
    MatCardModule,
    MatProgressSpinnerModule,
  ],
  template: `
    <mat-card class="user-form-card">
      <mat-card-header>
        <mat-card-title>{{ title }}</mat-card-title>
      </mat-card-header>

      <mat-card-content>
        <form (ngSubmit)="onSubmit()" #userForm="ngForm" class="user-form">
          <mat-form-field appearance="outline" class="form-field">
            <mat-label>Name</mat-label>
            <input
              matInput
              id="name"
              name="name"
              type="text"
              [(ngModel)]="formData.name"
              required
              minlength="2"
              data-testid="name-input"
              placeholder="Enter full name"
            />
            <mat-error
              *ngIf="userForm.submitted && userForm.controls['name']?.invalid"
              data-testid="name-error"
            >
              Name is required and must be at least 2 characters
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" class="form-field">
            <mat-label>Email</mat-label>
            <input
              matInput
              id="email"
              name="email"
              type="email"
              [(ngModel)]="formData.email"
              required
              email
              data-testid="email-input"
              placeholder="Enter email address"
            />
            <mat-error
              *ngIf="userForm.submitted && userForm.controls['email']?.invalid"
              data-testid="email-error"
            >
              Please enter a valid email address
            </mat-error>
          </mat-form-field>

          <div class="checkbox-field">
            <mat-checkbox
              name="active"
              [(ngModel)]="formData.active"
              data-testid="active-checkbox"
              color="primary"
            >
              Active User
            </mat-checkbox>
          </div>

          <div class="form-actions">
            <button
              mat-raised-button
              color="primary"
              type="submit"
              [disabled]="isSubmitting"
              data-testid="submit-button"
              class="submit-button"
            >
              <mat-spinner
                *ngIf="isSubmitting"
                diameter="16"
                class="spinner"
              ></mat-spinner>
              {{ isSubmitting ? 'Saving...' : 'Save User' }}
            </button>

            <button
              mat-button
              type="button"
              (click)="onCancel()"
              data-testid="cancel-button"
            >
              Cancel
            </button>
          </div>
        </form>
      </mat-card-content>

      <!-- Success/Error Messages -->
      <mat-card-footer *ngIf="successMessage || errorMessage">
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
      </mat-card-footer>
    </mat-card>
  `,
  styles: [
    `
      .user-form-card {
        max-width: 500px;
        margin: 0 auto;
      }

      .user-form {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }

      .form-field {
        width: 100%;
      }

      .checkbox-field {
        margin: 8px 0;
      }

      .form-actions {
        display: flex;
        gap: 12px;
        margin-top: 20px;
        align-items: center;
      }

      .submit-button {
        position: relative;
      }

      .spinner {
        position: absolute;
        left: 8px;
        top: 50%;
        transform: translateY(-50%);
      }

      .success-message {
        color: var(--mat-sys-success, #28a745);
        font-size: 14px;
        padding: 12px;
        background-color: var(--mat-sys-success-container, #d4edda);
        border-radius: 4px;
        margin: 8px 0;
      }

      .error-message {
        color: var(--mat-sys-error, #dc3545);
        font-size: 14px;
        padding: 12px;
        background-color: var(--mat-sys-error-container, #f8d7da);
        border-radius: 4px;
        margin: 8px 0;
      }

      /* Ensure proper spacing for Material form fields */
      ::ng-deep .mat-mdc-form-field {
        margin-bottom: 8px;
      }

      /* Custom styling for form field labels */
      ::ng-deep .mat-mdc-form-field-label {
        color: var(--mat-sys-on-surface-variant);
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
