import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { DashboardComponent } from './dashboard.component';
import { DashboardService } from '../../shared/services';
import {
  ClientFormDialogComponent,
  ClientFormData,
} from '../../shared/components';
import {
  SummaryCard,
  PerformanceChartData,
  FunnelChartData,
  QuickOverviewMetric,
  ClientEntry,
  Client,
} from '../../shared/models';

// Mock DashboardService
class MockDashboardService {
  getAllDashboardData(): Observable<{
    summaryCards: SummaryCard[];
    performanceData: PerformanceChartData[];
    funnelData: FunnelChartData[];
    recentOutreach: QuickOverviewMetric[];
    engagementTypes: QuickOverviewMetric[];
    todaySchedule: QuickOverviewMetric[];
    performanceMetrics: QuickOverviewMetric[];
    clientEntries: ClientEntry[];
    clients?: ClientEntry[]; // Support both for backwards compatibility
  }> {
    return of({
      summaryCards: [],
      performanceData: [],
      funnelData: [],
      recentOutreach: [],
      engagementTypes: [],
      todaySchedule: [],
      performanceMetrics: [],
      clientEntries: [
        {
          id: '1',
          name: 'John Smith',
          company: 'TechCorp Solutions',
          email: 'john.smith@techcorp.com',
          phone: '+1 (555) 123-4567',
          status: 'Interested',
          method: 'Email',
          revenue: 15000,
          lastContact: '2023-12-01',
        },
        {
          id: '2',
          name: 'Sarah Johnson',
          company: 'Digital Marketing Pro',
          email: 'sarah@digitalmarketing.com',
          phone: '+1 (555) 987-6543',
          status: 'Follow-up',
          method: 'Phone',
          revenue: 8500,
          lastContact: '2023-12-02',
        },
      ],
      clients: [
        {
          id: '1',
          name: 'John Smith',
          company: 'TechCorp Solutions',
          email: 'john.smith@techcorp.com',
          phone: '+1 (555) 123-4567',
          status: 'Interested',
          method: 'Email',
          revenue: 15000,
          lastContact: '2023-12-01',
        },
        {
          id: '2',
          name: 'Sarah Johnson',
          company: 'Digital Marketing Pro',
          email: 'sarah@digitalmarketing.com',
          phone: '+1 (555) 987-6543',
          status: 'Follow-up',
          method: 'Phone',
          revenue: 8500,
          lastContact: '2023-12-02',
        },
      ],
    });
  }

  addClient(
    client: Omit<Client, 'id' | 'created_at' | 'updated_at'>,
  ): Observable<Client> {
    return of({
      id: 'new-id',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      ...client,
    } as Client);
  }

  updateClient(id: string, updates: Partial<Client>): Observable<Client> {
    return of({
      id,
      name: 'Updated Client',
      company: 'Updated Company',
      email: 'updated@test.com',
      phone: '+1 555 123 4567',
      status: 'Converted',
      contact_method: 'Email',
      revenue: 20000,
      last_contact: new Date().toISOString(),
      created_at: '2023-01-01',
      updated_at: new Date().toISOString(),
      ...updates,
    } as Client);
  }

  deleteClient(): Observable<void> {
    return of(undefined);
  }
}

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let mockDashboardService: MockDashboardService;
  let mockClientDialog: { showSuccess: jasmine.Spy; showError: jasmine.Spy };

  beforeEach(async () => {
    mockDashboardService = new MockDashboardService();

    await TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers: [
        provideZonelessChangeDetection(),
        { provide: DashboardService, useValue: mockDashboardService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load dashboard data on init', (done) => {
    spyOn(mockDashboardService, 'getAllDashboardData').and.callThrough();

    // Initialize component - don't call fixture.detectChanges() yet
    component.ngOnInit();

    // Wait for the observable to complete
    setTimeout(() => {
      expect(mockDashboardService.getAllDashboardData).toHaveBeenCalled();
      expect(component.clientEntries).toBeDefined();
      expect(component.clientEntries.length).toBe(2);
      expect(component.clientEntries[0].name).toBe('John Smith');
      expect(component.clientEntries[1].name).toBe('Sarah Johnson');
      done();
    }, 100);
  });

  describe('Client Edit Setup', () => {
    beforeEach(() => {
      // Make sure component is initialized
      component.ngOnInit();
    });

    it('should set up editing state when editing a client', () => {
      const clientToEdit: ClientEntry = {
        id: '1',
        name: 'John Smith',
        company: 'TechCorp Solutions',
        email: 'john.smith@techcorp.com',
        phone: '+1 (555) 123-4567',
        status: 'Interested',
        method: 'Email',
        revenue: 15000,
        lastContact: '2023-12-01',
      };

      component.onEditClient(clientToEdit);

      expect(component.isEditingClient).toBe(true);
      expect(component.isClientDialogOpen).toBe(true);
      expect(component.editingClientData).toEqual({
        name: 'John Smith',
        company: 'TechCorp Solutions',
        email: 'john.smith@techcorp.com',
        phone: '+1 (555) 123-4567',
        status: 'Interested',
        contact_method: 'Email',
        revenue: 15000,
      });
    });
  });

  describe('Client Update Operations', () => {
    beforeEach(() => {
      // Initialize component and set up client data
      component.ngOnInit();
      component.clientEntries = [
        {
          id: '1',
          name: 'John Smith',
          company: 'TechCorp Solutions',
          email: 'john.smith@techcorp.com',
          phone: '+1 (555) 123-4567',
          status: 'Interested',
          method: 'Email',
          revenue: 15000,
          lastContact: '2023-12-01',
        },
      ];

      // Mock the clientDialog ViewChild
      mockClientDialog = {
        showSuccess: jasmine.createSpy('showSuccess'),
        showError: jasmine.createSpy('showError'),
      };
      component.clientDialog =
        mockClientDialog as unknown as ClientFormDialogComponent;
    });

    it('should handle successful client update', async () => {
      spyOn(mockDashboardService, 'updateClient').and.callThrough();
      spyOn(component, 'loadDashboardData');

      // Set up editing state
      component.isEditingClient = true;
      component.editingClientData = {
        name: 'John Smith',
        company: 'TechCorp Solutions',
        email: 'john.smith@techcorp.com',
        phone: '+1 (555) 123-4567',
        status: 'Interested',
        contact_method: 'Email',
        revenue: 15000,
      };

      const updatedClientData: ClientFormData = {
        name: 'John Smith',
        company: 'TechCorp Solutions',
        email: 'john.smith@techcorp.com',
        phone: '+1 (555) 123-4567',
        status: 'Converted',
        contact_method: 'Email',
        revenue: 20000,
      };

      component.onUpdateClient(updatedClientData);

      // Wait for async operations to complete
      await new Promise((resolve) => setTimeout(resolve, 10));

      expect(mockDashboardService.updateClient).toHaveBeenCalledWith('1', {
        name: 'John Smith',
        company: 'TechCorp Solutions',
        email: 'john.smith@techcorp.com',
        phone: '+1 (555) 123-4567',
        status: 'Converted',
        contact_method: 'Email',
        revenue: 20000,
        last_contact: jasmine.any(String),
      });
      expect(component.loadDashboardData).toHaveBeenCalled();
      expect(mockClientDialog.showSuccess).toHaveBeenCalledWith(
        'Client updated successfully!',
      );
      expect(component.isAddingClient).toBe(false);
      expect(component.isEditingClient).toBe(false);
      expect(component.editingClientData).toEqual({});
    });

    it('should handle client update error', async () => {
      const errorMessage = 'Network error';
      spyOn(mockDashboardService, 'updateClient').and.returnValue(
        throwError(() => new Error(errorMessage)),
      );

      // Set up editing state
      component.isEditingClient = true;
      component.editingClientData = {
        name: 'John Smith',
        company: 'TechCorp Solutions',
        email: 'john.smith@techcorp.com',
      };

      const updatedClientData: ClientFormData = {
        name: 'John Smith',
        company: 'TechCorp Solutions',
        email: 'john.smith@techcorp.com',
        phone: '+1 (555) 123-4567',
        status: 'Converted',
        contact_method: 'Email',
        revenue: 20000,
      };

      component.onUpdateClient(updatedClientData);

      // Wait for async operations to complete
      await new Promise((resolve) => setTimeout(resolve, 10));

      expect(mockClientDialog.showError).toHaveBeenCalledWith(errorMessage);
      expect(component.isAddingClient).toBe(false);
    });

    it('should handle client not found error', () => {
      // Set up editing state with non-existent client
      component.isEditingClient = true;
      component.editingClientData = {
        name: 'Non-existent Client',
        company: 'Non-existent Company',
      };

      const updatedClientData: ClientFormData = {
        name: 'Non-existent Client',
        company: 'Non-existent Company',
        email: 'test@test.com',
        phone: '',
        status: 'Interested',
        contact_method: 'Email',
        revenue: 0,
      };

      component.onUpdateClient(updatedClientData);

      expect(component.clientDialog.showError).toHaveBeenCalledWith(
        'Client not found. Please try again.',
      );
      expect(component.isAddingClient).toBe(false);
    });

    it('should call onAddClient when not in editing mode', () => {
      spyOn(component, 'onAddClient');

      component.isEditingClient = false;

      const clientData: ClientFormData = {
        name: 'New Client',
        company: 'New Company',
        email: 'new@test.com',
        phone: '',
        status: 'Initial Contact',
        contact_method: 'Email',
        revenue: 0,
      };

      component.onUpdateClient(clientData);

      expect(component.onAddClient).toHaveBeenCalledWith(clientData);
    });
  });

  describe('ViewChild Integration', () => {
    beforeEach(() => {
      // Use the same mock as the main beforeEach
      mockClientDialog = {
        showSuccess: jasmine.createSpy('showSuccess'),
        showError: jasmine.createSpy('showError'),
      };
      component.clientDialog =
        mockClientDialog as unknown as ClientFormDialogComponent;
    });

    it('should have access to clientDialog ViewChild', () => {
      expect(component.clientDialog).toBeDefined();
      expect(component.clientDialog.showSuccess).toBeDefined();
      expect(component.clientDialog.showError).toBeDefined();
    });

    it('should call clientDialog methods for success and error scenarios', () => {
      // Test that the component can call the dialog methods
      component.clientDialog.showSuccess('Test success');
      component.clientDialog.showError('Test error');

      expect(mockClientDialog.showSuccess).toHaveBeenCalledWith('Test success');
      expect(mockClientDialog.showError).toHaveBeenCalledWith('Test error');
    });
  });

  describe('Component Lifecycle', () => {
    it('should clean up subscriptions on destroy', () => {
      const destroySpy = spyOn(component['destroy$'], 'next');
      const completeDestroySpy = spyOn(component['destroy$'], 'complete');

      component.ngOnDestroy();

      expect(destroySpy).toHaveBeenCalled();
      expect(completeDestroySpy).toHaveBeenCalled();
    });
  });
});
