import { TestBed } from '@angular/core/testing';
import { StateService } from './state.service';

describe('StateService', () => {
  let service: StateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StateService],
    });
    service = TestBed.inject(StateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with default state', () => {
    const state = service.getState();

    expect(state.loading).toBeFalse();
    expect(state.errors).toEqual([]);
    expect(state.notifications).toEqual([]);
    expect(state.theme).toBe('auto');
    expect(state.sidebarOpen).toBeFalse();
    expect(state.user).toBeNull();
  });

  it('should update partial state', () => {
    service.updateState({ loading: true });

    const state = service.getState();
    expect(state.loading).toBeTrue();
  });

  it('should set loading state', () => {
    service.setLoading(true);

    const state = service.getState();
    expect(state.loading).toBeTrue();
  });

  it('should add and remove errors', () => {
    service.addError('Test error');

    expect(service.getState().errors).toContain('Test error');

    service.removeError('Test error');

    expect(service.getState().errors).not.toContain('Test error');
  });

  it('should clear all errors', () => {
    service.addError('Error 1');
    service.addError('Error 2');

    expect(service.getState().errors.length).toBe(2);

    service.clearErrors();

    expect(service.getState().errors).toEqual([]);
  });

  it('should add notifications', () => {
    service.addNotification({
      type: 'success',
      message: 'Test notification',
    });

    const notifications = service.getState().notifications;
    expect(notifications.length).toBe(1);
    expect(notifications[0].message).toBe('Test notification');
    expect(notifications[0].type).toBe('success');
    expect(notifications[0].id).toBeDefined();
    expect(notifications[0].timestamp).toBeDefined();
  });

  it('should remove notifications', () => {
    service.addNotification({
      type: 'info',
      message: 'Test notification',
    });

    const notification = service.getState().notifications[0];
    service.removeNotification(notification.id);

    expect(service.getState().notifications.length).toBe(0);
  });

  it('should clear all notifications', () => {
    service.addNotification({ type: 'info', message: 'Test 1' });
    service.addNotification({ type: 'info', message: 'Test 2' });

    expect(service.getState().notifications.length).toBe(2);

    service.clearNotifications();

    expect(service.getState().notifications.length).toBe(0);
  });

  it('should set and toggle sidebar state', () => {
    service.setSidebarOpen(true);

    expect(service.getState().sidebarOpen).toBeTrue();

    service.toggleSidebar();

    expect(service.getState().sidebarOpen).toBeFalse();
  });

  it('should set and clear user', () => {
    const user = { id: 1, name: 'Test User' };

    service.setUser(user);

    expect(service.getState().user).toEqual(user);

    service.clearUser();

    expect(service.getState().user).toBeNull();
  });

  it('should select specific state slices', (done) => {
    service.select('loading').subscribe((loading) => {
      expect(loading).toBeFalse();
      done();
    });
  });

  it('should select derived state', (done) => {
    service
      .selectDerived((state) => state.errors.length)
      .subscribe((errorCount) => {
        expect(errorCount).toBe(0);
        done();
      });
  });

  it('should reset state to initial values', () => {
    service.updateState({
      loading: true,
      sidebarOpen: true,
      user: { id: 1 },
    });

    service.resetState();

    const state = service.getState();
    expect(state.loading).toBeFalse();
    expect(state.sidebarOpen).toBeFalse();
    expect(state.user).toBeNull();
  });

  it('should handle state changes with callback', () => {
    const callback = jasmine.createSpy('callback');

    service.onStateChange('loading', callback);
    service.setLoading(true);

    expect(callback).toHaveBeenCalledWith(true);
  });
});
