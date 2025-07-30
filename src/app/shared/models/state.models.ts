/**
 * State management models and interfaces
 */

export interface LoadingState {
  isLoading: boolean;
  loadingText?: string;
  progress?: number;
}

export interface EntityState<T> {
  entities: Record<string | number, T>;
  ids: (string | number)[];
  loading: LoadingState;
  error: string | null;
  lastUpdated?: number;
}

export interface ListState<T> {
  items: T[];
  loading: LoadingState;
  error: string | null;
  totalCount?: number;
  hasMore?: boolean;
  lastUpdated?: number;
}

export interface CacheState<T> {
  data: T;
  timestamp: number;
  expiresAt?: number;
  isStale: boolean;
}

export interface AppState {
  auth: import('./auth.models').AuthState;
  ui: UiState;
  cache: Record<string, CacheState<unknown>>;
  notifications: NotificationState[];
}

export interface UiState {
  sidebarOpen: boolean;
  theme: 'light' | 'dark' | 'auto';
  language: string;
  notifications: {
    enabled: boolean;
    position: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  };
  preferences: UserPreferences;
}

export interface UserPreferences {
  dateFormat: string;
  timeFormat: '12h' | '24h';
  timezone: string;
  currency: string;
  language: string;
  accessibility: AccessibilityPreferences;
}

export interface AccessibilityPreferences {
  highContrast: boolean;
  reducedMotion: boolean;
  fontSize: 'small' | 'medium' | 'large' | 'extra-large';
  screenReader: boolean;
}

export interface NotificationState {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
  timestamp: number;
  read: boolean;
  persistent: boolean;
  actions?: NotificationAction[];
}

export interface NotificationAction {
  label: string;
  action: () => void;
  style?: 'primary' | 'secondary';
}

export interface StateSnapshot<T> {
  data: T;
  timestamp: number;
  version: number;
}

export interface StateHistory<T> {
  snapshots: StateSnapshot<T>[];
  currentIndex: number;
  maxSize: number;
}

export type StateUpdateType = 'set' | 'merge' | 'patch' | 'delete';

export interface StateUpdate<T> {
  type: StateUpdateType;
  path?: string;
  data: Partial<T>;
  timestamp: number;
}
