import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserFormComponent } from './user-form.component';
import { TestUtils } from '../../testing';

describe('UserFormComponent', () => {
  let component: UserFormComponent;
  let fixture: ComponentFixture<UserFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserFormComponent, FormsModule],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(UserFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the title', () => {
    component.title = 'Test User Form';
    fixture.detectChanges();

    TestUtils.expectElementToHaveText(fixture, 'h2', 'Test User Form');
  });

  it('should initialize with default form data', () => {
    expect(component.formData).toEqual({
      name: '',
      email: '',
      active: true,
    });
  });

  it('should initialize with provided initial data', () => {
    const initialData = { name: 'John Doe', email: 'john@example.com' };
    component.initialData = initialData;
    component.ngOnInit();

    expect(component.formData.name).toBe('John Doe');
    expect(component.formData.email).toBe('john@example.com');
    expect(component.formData.active).toBe(true); // default value
  });

  describe('Form Interactions', () => {
    it('should update name field when typed', () => {
      TestUtils.setInputValue(
        fixture,
        '[data-testid="name-input"]',
        'Jane Doe',
      );

      expect(component.formData.name).toBe('Jane Doe');
    });

    it('should update email field when typed', () => {
      TestUtils.setInputValue(
        fixture,
        '[data-testid="email-input"]',
        'jane@example.com',
      );

      expect(component.formData.email).toBe('jane@example.com');
    });

    it('should toggle active checkbox', () => {
      const checkbox = TestUtils.querySelector<HTMLInputElement>(
        fixture,
        '[data-testid="active-checkbox"]',
      );

      expect(component.formData.active).toBe(true);

      TestUtils.click(checkbox!);
      fixture.detectChanges();

      expect(component.formData.active).toBe(false);
    });
  });

  describe('Form Submission', () => {
    it('should emit userSubmit event with form data when valid', () => {
      spyOn(component.userSubmit, 'emit');

      // Fill out valid form data
      component.formData = {
        name: 'John Doe',
        email: 'john@example.com',
        active: true,
      };

      component.onSubmit();

      expect(component.userSubmit.emit).toHaveBeenCalledWith({
        name: 'John Doe',
        email: 'john@example.com',
        active: true,
      });
    });

    it('should not emit userSubmit event when form is invalid', () => {
      spyOn(component.userSubmit, 'emit');

      // Set invalid form data
      component.formData = {
        name: 'A', // too short
        email: 'invalid-email', // invalid format
        active: true,
      };

      component.onSubmit();

      expect(component.userSubmit.emit).not.toHaveBeenCalled();
    });

    it('should show submit button as disabled when submitting', () => {
      component.isSubmitting = true;
      fixture.detectChanges();

      const submitButton = TestUtils.querySelector<HTMLButtonElement>(
        fixture,
        '[data-testid="submit-button"]',
      );
      expect(submitButton?.disabled).toBe(true);
      expect(submitButton?.textContent?.trim()).toBe('Saving...');
    });

    it('should trigger form submission when submit button is clicked', () => {
      spyOn(component, 'onSubmit');

      const submitButton = TestUtils.querySelector(
        fixture,
        '[data-testid="submit-button"]',
      );
      TestUtils.click(submitButton!);

      expect(component.onSubmit).toHaveBeenCalled();
    });
  });

  describe('Form Cancellation', () => {
    it('should emit userCancel event when cancel button is clicked', () => {
      spyOn(component.userCancel, 'emit');

      const cancelButton = TestUtils.querySelector(
        fixture,
        '[data-testid="cancel-button"]',
      );
      TestUtils.click(cancelButton!);

      expect(component.userCancel.emit).toHaveBeenCalled();
    });

    it('should clear messages when cancel is clicked', () => {
      component.successMessage = 'Success!';
      component.errorMessage = 'Error!';

      component.onCancel();

      expect(component.successMessage).toBe('');
      expect(component.errorMessage).toBe('');
    });
  });

  describe('Message Display', () => {
    it('should show success message when showSuccess is called', () => {
      component.showSuccess('User saved successfully!');
      fixture.detectChanges();

      TestUtils.expectElementToExist(
        fixture,
        '[data-testid="success-message"]',
      );
      TestUtils.expectElementToHaveText(
        fixture,
        '[data-testid="success-message"]',
        'User saved successfully!',
      );
      TestUtils.expectElementNotToExist(
        fixture,
        '[data-testid="error-message"]',
      );
    });

    it('should show error message when showError is called', () => {
      component.showError('Failed to save user!');
      fixture.detectChanges();

      TestUtils.expectElementToExist(fixture, '[data-testid="error-message"]');
      TestUtils.expectElementToHaveText(
        fixture,
        '[data-testid="error-message"]',
        'Failed to save user!',
      );
      TestUtils.expectElementNotToExist(
        fixture,
        '[data-testid="success-message"]',
      );
    });

    it('should clear messages when clearMessages is called', () => {
      component.successMessage = 'Success!';
      component.errorMessage = 'Error!';

      component['clearMessages']();

      expect(component.successMessage).toBe('');
      expect(component.errorMessage).toBe('');
    });
  });

  describe('Form Validation', () => {
    it('should validate name length', () => {
      component.formData.name = 'A';
      component.formData.email = 'valid@example.com';

      expect(component['isFormValid']()).toBe(false);

      component.formData.name = 'John';
      expect(component['isFormValid']()).toBe(true);
    });

    it('should validate email format', () => {
      component.formData.name = 'John Doe';
      component.formData.email = 'invalid-email';

      expect(component['isFormValid']()).toBe(false);

      component.formData.email = 'john@example.com';
      expect(component['isFormValid']()).toBe(true);
    });
  });

  describe('Integration Tests', () => {
    it('should complete full form workflow', async () => {
      spyOn(component.userSubmit, 'emit');

      // Fill out the form
      TestUtils.setInputValue(
        fixture,
        '[data-testid="name-input"]',
        'John Doe',
      );
      TestUtils.setInputValue(
        fixture,
        '[data-testid="email-input"]',
        'john@example.com',
      );

      // Toggle active checkbox to false
      const checkbox = TestUtils.querySelector<HTMLInputElement>(
        fixture,
        '[data-testid="active-checkbox"]',
      );
      TestUtils.click(checkbox!);
      fixture.detectChanges();

      // Submit the form
      const submitButton = TestUtils.querySelector(
        fixture,
        '[data-testid="submit-button"]',
      );
      TestUtils.click(submitButton!);

      // Verify the emission
      expect(component.userSubmit.emit).toHaveBeenCalledWith({
        name: 'John Doe',
        email: 'john@example.com',
        active: false,
      });
    });
  });
});
