import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ClientFormDialogComponent, ClientFormData } from './client-form-dialog.component';
import { TestUtils } from '../../testing';

describe('ClientFormDialogComponent', () => {
  let component: ClientFormDialogComponent;
  let fixture: ComponentFixture<ClientFormDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientFormDialogComponent, FormsModule],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(ClientFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default form data', () => {
    expect(component.formData).toEqual({
      name: '',
      company: '',
      email: '',
      phone: '',
      status: 'Initial Contact',
      contact_method: 'Email',
      revenue: 0,
    });
  });

  describe('Form Prefilling (OnInit)', () => {
    it('should prefill form with initial data on ngOnInit', () => {
      const initialData = {
        name: 'John Smith',
        company: 'TechCorp Solutions',
        email: 'john.smith@techcorp.com',
        phone: '+1 (555) 123-4567',
        status: 'Interested' as const,
        contact_method: 'Phone' as const,
        revenue: 15000,
      };

      component.initialData = initialData;
      component.ngOnInit();

      expect(component.formData.name).toBe('John Smith');
      expect(component.formData.company).toBe('TechCorp Solutions');
      expect(component.formData.email).toBe('john.smith@techcorp.com');
      expect(component.formData.phone).toBe('+1 (555) 123-4567');
      expect(component.formData.status).toBe('Interested');
      expect(component.formData.contact_method).toBe('Phone');
      expect(component.formData.revenue).toBe(15000);
    });

    it('should maintain default values when initial data is empty', () => {
      component.initialData = {};
      component.ngOnInit();

      expect(component.formData.status).toBe('Initial Contact');
      expect(component.formData.contact_method).toBe('Email');
      expect(component.formData.revenue).toBe(0);
    });
  });

  describe('Form Prefilling (OnChanges)', () => {
    it('should update form data when initialData changes', () => {
      // Set initial data
      const firstClient = {
        name: 'John Smith',
        company: 'TechCorp Solutions',
        email: 'john.smith@techcorp.com',
      };
      component.initialData = firstClient;
      component.ngOnInit();

      expect(component.formData.name).toBe('John Smith');

      // Simulate change to different client data
      const secondClient = {
        name: 'Sarah Johnson',
        company: 'Digital Marketing Pro',
        email: 'sarah@digitalmarketing.com',
      };
      component.initialData = secondClient;

      // Create changes object as Angular would
      const changes: SimpleChanges = {
        initialData: {
          previousValue: firstClient,
          currentValue: secondClient,
          firstChange: false,
          isFirstChange: () => false,
        },
      };

      component.ngOnChanges(changes);

      expect(component.formData.name).toBe('Sarah Johnson');
      expect(component.formData.company).toBe('Digital Marketing Pro');
      expect(component.formData.email).toBe('sarah@digitalmarketing.com');
    });

    it('should not update form data on first change', () => {
      const initialData = {
        name: 'John Smith',
        company: 'TechCorp Solutions',
      };

      // Simulate first change (component initialization)
      const changes: SimpleChanges = {
        initialData: {
          previousValue: undefined,
          currentValue: initialData,
          firstChange: true,
          isFirstChange: () => true,
        },
      };

      // Set form to different values first
      component.formData.name = 'Different Name';
      component.formData.company = 'Different Company';

      component.ngOnChanges(changes);

      // Should not change because it's the first change
      expect(component.formData.name).toBe('Different Name');
      expect(component.formData.company).toBe('Different Company');
    });
  });

  describe('Form Validation', () => {
    it('should validate required fields', () => {
      expect(component['isFormValid']()).toBe(false);

      component.formData.name = 'John Doe';
      component.formData.company = 'Test Company';
      component.formData.email = 'john@test.com';

      expect(component['isFormValid']()).toBe(true);
    });

    it('should validate email format', () => {
      component.formData.name = 'John Doe';
      component.formData.company = 'Test Company';
      component.formData.email = 'invalid-email';

      expect(component['isFormValid']()).toBe(false);

      component.formData.email = 'john@test.com';
      expect(component['isFormValid']()).toBe(true);
    });
  });

  describe('Form Submission', () => {
    it('should emit clientSubmit event with form data when valid', () => {
      spyOn(component.clientSubmit, 'emit');

      const validFormData: ClientFormData = {
        name: 'John Doe',
        company: 'Test Company',
        email: 'john@test.com',
        phone: '+1 555 123 4567',
        status: 'Interested',
        contact_method: 'Email',
        revenue: 10000,
      };

      component.formData = validFormData;
      component.onSubmit();

      expect(component.clientSubmit.emit).toHaveBeenCalledWith(validFormData);
    });

    it('should not emit clientSubmit event when form is invalid', () => {
      spyOn(component.clientSubmit, 'emit');

      // Invalid form data (missing required fields)
      component.formData = {
        name: '',
        company: '',
        email: '',
        phone: '',
        status: 'Initial Contact',
        contact_method: 'Email',
        revenue: 0,
      };

      component.onSubmit();

      expect(component.clientSubmit.emit).not.toHaveBeenCalled();
    });
  });

  describe('Form Cancellation', () => {
    it('should emit dialogCancel event when cancel is called', () => {
      spyOn(component.dialogCancel, 'emit');

      component.onCancel();

      expect(component.dialogCancel.emit).toHaveBeenCalled();
    });

    it('should reset form when cancel is called', () => {
      // Set form to some values
      component.formData.name = 'Test Name';
      component.formData.company = 'Test Company';

      component.onCancel();

      expect(component.formData.name).toBe('');
      expect(component.formData.company).toBe('');
    });
  });

  describe('Message Display', () => {
    it('should show success message when showSuccess is called', () => {
      component.showSuccess('Client saved successfully!');

      expect(component.successMessage).toBe('Client saved successfully!');
      expect(component.errorMessage).toBe('');
    });

    it('should show error message when showError is called', () => {
      component.showError('Failed to save client!');

      expect(component.errorMessage).toBe('Failed to save client!');
      expect(component.successMessage).toBe('');
    });

    it('should clear messages when clearMessages is called', () => {
      component.successMessage = 'Success!';
      component.errorMessage = 'Error!';

      component['clearMessages']();

      expect(component.successMessage).toBe('');
      expect(component.errorMessage).toBe('');
    });
  });

  describe('Dialog Behavior', () => {
    it('should close dialog on backdrop click', () => {
      spyOn(component, 'onCancel');

      const mockEvent = {
        target: {},
        currentTarget: {},
      };
      // Make target equal to currentTarget (clicking backdrop)
      mockEvent.target = mockEvent.currentTarget;

      component.onBackdropClick(mockEvent as any);

      expect(component.onCancel).toHaveBeenCalled();
    });

    it('should not close dialog when clicking inside modal', () => {
      spyOn(component, 'onCancel');

      const mockEvent = {
        target: {},
        currentTarget: {},
      };
      // Make target different from currentTarget (clicking inside modal)

      component.onBackdropClick(mockEvent as any);

      expect(component.onCancel).not.toHaveBeenCalled();
    });
  });

  describe('Integration Tests', () => {
    it('should handle complete edit workflow', () => {
      spyOn(component.clientSubmit, 'emit');

      // Simulate editing a client - initial data provided
      const clientToEdit = {
        name: 'John Smith',
        company: 'TechCorp Solutions',
        email: 'john.smith@techcorp.com',
        phone: '+1 (555) 123-4567',
        status: 'Interested' as const,
        contact_method: 'Phone' as const,
        revenue: 15000,
      };

      component.initialData = clientToEdit;
      component.ngOnInit();

      // Verify form is prefilled
      expect(component.formData.name).toBe('John Smith');
      expect(component.formData.company).toBe('TechCorp Solutions');

      // Simulate editing data
      component.formData.status = 'Converted';
      component.formData.revenue = 20000;

      // Submit form
      component.onSubmit();

      expect(component.clientSubmit.emit).toHaveBeenCalledWith({
        name: 'John Smith',
        company: 'TechCorp Solutions',
        email: 'john.smith@techcorp.com',
        phone: '+1 (555) 123-4567',
        status: 'Converted',
        contact_method: 'Phone',
        revenue: 20000,
      });
    });
  });
});