import { Injectable, signal, computed, inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, distinctUntilChanged } from 'rxjs/operators';

import {
  AppState,
  LoadingState,
  EntityState,
  ListState,
  CacheState,
  NotificationState,
} from '../models/state.models';
import { AuthState } from '../models/auth.models';
import { LoggingService } from './logging.service';

@Injectable({
  providedIn: 'root',
})
export class StateManagementService {
  private readonly logger = inject(LoggingService);

  // Initial state
  private readonly initialState: AppState = {
    auth: {
      user: null,
      tokens: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    },
    ui: {
      sidebarOpen: false,
      theme: 'auto',
      language: 'en',
      notifications: {
        enabled: true,
        position: 'top-right',
      },
      preferences: {
        dateFormat: 'MM/dd/yyyy',
        timeFormat: '12h',
        timezone: 'America/New_York',
        currency: 'USD',
        language: 'en',
        accessibility: {
          highContrast: false,
          reducedMotion: false,
          fontSize: 'medium',
          screenReader: false,
        },
      },
    },
    cache: {},
    notifications: [],
  };

  // State signal
  private readonly appState = signal<AppState>(this.initialState);

  // Public readonly signals
  readonly state = this.appState.asReadonly();
  readonly auth = computed(() => this.state().auth);
  readonly ui = computed(() => this.state().ui);
  readonly notifications = computed(() => this.state().notifications);

  /**
   * Select a specific part of the state
   */
  select<T>(selector: (state: AppState) => T): Observable<T> {
    return new BehaviorSubject(this.appState()).pipe(
      map(selector),
      distinctUntilChanged(),
    );
  }

  /**
   * Update the entire state
   */
  setState(newState: Partial<AppState>): void {
    this.appState.update((currentState) => ({
      ...currentState,
      ...newState,
    }));

    this.logger.debug('State updated', { newState });
  }

  /**
   * Update auth state
   */
  updateAuthState(authState: Partial<AuthState>): void {
    this.appState.update((currentState) => ({
      ...currentState,
      auth: {
        ...currentState.auth,
        ...authState,
      },
    }));

    this.logger.debug('Auth state updated', { authState });
  }

  /**
   * Update UI state
   */
  updateUiState(uiUpdates: Partial<AppState['ui']>): void {
    this.appState.update((currentState) => ({
      ...currentState,
      ui: {
        ...currentState.ui,
        ...uiUpdates,
      },
    }));

    this.logger.debug('UI state updated', { uiUpdates });
  }

  /**
   * Add a notification
   */
  addNotification(
    notification: Omit<NotificationState, 'id' | 'timestamp' | 'read'>,
  ): void {
    const newNotification: NotificationState = {
      id: this.generateId(),
      timestamp: Date.now(),
      read: false,
      ...notification,
    };

    this.appState.update((currentState) => ({
      ...currentState,
      notifications: [newNotification, ...currentState.notifications],
    }));

    this.logger.info('Notification added', { notification: newNotification });
  }

  /**
   * Remove a notification
   */
  removeNotification(id: string): void {
    this.appState.update((currentState) => ({
      ...currentState,
      notifications: currentState.notifications.filter((n) => n.id !== id),
    }));

    this.logger.debug('Notification removed', { id });
  }

  /**
   * Mark notification as read
   */
  markNotificationRead(id: string): void {
    this.appState.update((currentState) => ({
      ...currentState,
      notifications: currentState.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n,
      ),
    }));

    this.logger.debug('Notification marked as read', { id });
  }

  /**
   * Clear all notifications
   */
  clearNotifications(): void {
    this.appState.update((currentState) => ({
      ...currentState,
      notifications: [],
    }));

    this.logger.debug('All notifications cleared');
  }

  /**
   * Create an entity state helper
   */
  createEntityState<T>(initialEntities: T[] = []): EntityState<T> {
    const entities: Record<string | number, T> = {};
    const ids: (string | number)[] = [];

    initialEntities.forEach((entity, index) => {
      const id = (entity as Record<string, unknown>)['id'] as
        | string
        | number
        | undefined;
      const entityId = id ?? index;
      entities[entityId] = entity;
      ids.push(entityId);
    });

    return {
      entities,
      ids,
      loading: { isLoading: false },
      error: null,
      lastUpdated: Date.now(),
    };
  }

  /**
   * Update entity state
   */
  updateEntityState<T>(
    currentState: EntityState<T>,
    updates: Partial<EntityState<T>>,
  ): EntityState<T> {
    return {
      ...currentState,
      ...updates,
      lastUpdated: Date.now(),
    };
  }

  /**
   * Add entity to entity state
   */
  addEntity<T>(
    currentState: EntityState<T>,
    entity: T,
    getId: (entity: T) => string | number,
  ): EntityState<T> {
    const id = getId(entity);

    return {
      ...currentState,
      entities: {
        ...currentState.entities,
        [id]: entity,
      },
      ids: currentState.ids.includes(id)
        ? currentState.ids
        : [...currentState.ids, id],
      lastUpdated: Date.now(),
    };
  }

  /**
   * Update entity in entity state
   */
  updateEntity<T>(
    currentState: EntityState<T>,
    id: string | number,
    updates: Partial<T>,
  ): EntityState<T> {
    const entity = currentState.entities[id];
    if (!entity) return currentState;

    return {
      ...currentState,
      entities: {
        ...currentState.entities,
        [id]: { ...entity, ...updates },
      },
      lastUpdated: Date.now(),
    };
  }

  /**
   * Remove entity from entity state
   */
  removeEntity<T>(
    currentState: EntityState<T>,
    id: string | number,
  ): EntityState<T> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { [id]: _removed, ...entities } = currentState.entities;

    return {
      ...currentState,
      entities,
      ids: currentState.ids.filter((entityId) => entityId !== id),
      lastUpdated: Date.now(),
    };
  }

  /**
   * Create a list state helper
   */
  createListState<T>(initialItems: T[] = []): ListState<T> {
    return {
      items: initialItems,
      loading: { isLoading: false },
      error: null,
      totalCount: initialItems.length,
      hasMore: false,
      lastUpdated: Date.now(),
    };
  }

  /**
   * Update list state
   */
  updateListState<T>(
    currentState: ListState<T>,
    updates: Partial<ListState<T>>,
  ): ListState<T> {
    return {
      ...currentState,
      ...updates,
      lastUpdated: Date.now(),
    };
  }

  /**
   * Set loading state
   */
  setLoading(
    currentState: { loading: LoadingState },
    loading: boolean,
    loadingText?: string,
    progress?: number,
  ): LoadingState {
    return {
      isLoading: loading,
      loadingText,
      progress,
    };
  }

  /**
   * Cache data with expiration
   */
  setCacheData<T>(key: string, data: T, ttlMs?: number): void {
    const cacheEntry: CacheState<T> = {
      data,
      timestamp: Date.now(),
      expiresAt: ttlMs ? Date.now() + ttlMs : undefined,
      isStale: false,
    };

    this.appState.update((currentState) => ({
      ...currentState,
      cache: {
        ...currentState.cache,
        [key]: cacheEntry as CacheState<unknown>,
      },
    }));

    this.logger.debug('Data cached', { key, ttlMs });
  }

  /**
   * Get cached data
   */
  getCacheData<T>(key: string): T | null {
    const cacheEntry = this.appState().cache[key] as CacheState<T> | undefined;

    if (!cacheEntry) {
      return null;
    }

    // Check if expired
    if (cacheEntry.expiresAt && Date.now() > cacheEntry.expiresAt) {
      this.removeCacheData(key);
      return null;
    }

    return cacheEntry.data;
  }

  /**
   * Remove cached data
   */
  removeCacheData(key: string): void {
    this.appState.update((currentState) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [key]: _removed, ...cache } = currentState.cache;
      return {
        ...currentState,
        cache,
      };
    });

    this.logger.debug('Cache data removed', { key });
  }

  /**
   * Clear all cached data
   */
  clearCache(): void {
    this.appState.update((currentState) => ({
      ...currentState,
      cache: {},
    }));

    this.logger.debug('All cache cleared');
  }

  /**
   * Reset state to initial values
   */
  reset(): void {
    this.appState.set(this.initialState);
    this.logger.info('State reset to initial values');
  }

  /**
   * Get state snapshot for debugging
   */
  getSnapshot(): AppState {
    return { ...this.appState() };
  }

  private generateId(): string {
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
