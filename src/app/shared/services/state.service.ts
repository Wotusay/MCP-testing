import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, distinctUntilChanged } from 'rxjs/operators';

export interface AppState {
  loading: boolean;
  errors: string[];
  notifications: Notification[];
  theme: 'light' | 'dark' | 'auto';
  sidebarOpen: boolean;
  user: unknown | null;
  [key: string]: unknown;
}

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  timestamp: Date;
  autoHide?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class StateService {
  private initialState: AppState = {
    loading: false,
    errors: [],
    notifications: [],
    theme: 'auto',
    sidebarOpen: false,
    user: null,
  };

  private stateSubject = new BehaviorSubject<AppState>(this.initialState);
  public state$ = this.stateSubject.asObservable();

  /**
   * Get current state snapshot
   */
  getState(): AppState {
    return this.stateSubject.value;
  }

  /**
   * Update partial state
   */
  updateState(partialState: Partial<AppState>): void {
    const currentState = this.stateSubject.value;
    const newState = { ...currentState, ...partialState };
    this.stateSubject.next(newState);
  }

  /**
   * Set loading state
   */
  setLoading(loading: boolean): void {
    this.updateState({ loading });
  }

  /**
   * Add error to state
   */
  addError(error: string): void {
    const currentErrors = this.getState().errors;
    this.updateState({ errors: [...currentErrors, error] });
  }

  /**
   * Remove error from state
   */
  removeError(error: string): void {
    const currentErrors = this.getState().errors;
    this.updateState({ errors: currentErrors.filter((e) => e !== error) });
  }

  /**
   * Clear all errors
   */
  clearErrors(): void {
    this.updateState({ errors: [] });
  }

  /**
   * Add notification
   */
  addNotification(notification: Omit<Notification, 'id' | 'timestamp'>): void {
    const newNotification: Notification = {
      ...notification,
      id: this.generateId(),
      timestamp: new Date(),
    };

    const currentNotifications = this.getState().notifications;
    this.updateState({
      notifications: [...currentNotifications, newNotification],
    });

    // Auto-hide notification if specified
    if (notification.autoHide) {
      setTimeout(() => {
        this.removeNotification(newNotification.id);
      }, 5000);
    }
  }

  /**
   * Remove notification
   */
  removeNotification(id: string): void {
    const currentNotifications = this.getState().notifications;
    this.updateState({
      notifications: currentNotifications.filter((n) => n.id !== id),
    });
  }

  /**
   * Clear all notifications
   */
  clearNotifications(): void {
    this.updateState({ notifications: [] });
  }

  /**
   * Set sidebar open state
   */
  setSidebarOpen(open: boolean): void {
    this.updateState({ sidebarOpen: open });
  }

  /**
   * Toggle sidebar
   */
  toggleSidebar(): void {
    const currentState = this.getState();
    this.updateState({ sidebarOpen: !currentState.sidebarOpen });
  }

  /**
   * Set user in state
   */
  setUser(user: unknown): void {
    this.updateState({ user });
  }

  /**
   * Clear user from state
   */
  clearUser(): void {
    this.updateState({ user: null });
  }

  /**
   * Get specific state slice as observable
   */
  select<K extends keyof AppState>(key: K): Observable<AppState[K]> {
    return this.state$.pipe(
      map((state) => state[key]),
      distinctUntilChanged(),
    );
  }

  /**
   * Get derived state as observable
   */
  selectDerived<T>(selector: (state: AppState) => T): Observable<T> {
    return this.state$.pipe(map(selector), distinctUntilChanged());
  }

  /**
   * Reset state to initial values
   */
  resetState(): void {
    this.stateSubject.next({ ...this.initialState });
  }

  /**
   * Subscribe to specific state changes
   */
  onStateChange<K extends keyof AppState>(
    key: K,
    callback: (value: AppState[K]) => void,
  ): void {
    this.select(key).subscribe(callback);
  }

  private generateId(): string {
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
