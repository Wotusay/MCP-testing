import {
  AuthUser,
  AuthTokens,
  AuthStatus,
} from '../../../shared/models/auth.models';

export interface AuthState {
  // User data
  user: AuthUser | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;

  // UI state
  isLoading: boolean;
  error: string | null;

  // Status computed from other state
  status: AuthStatus;

  // Operation-specific loading states
  loadingStates: {
    login: boolean;
    register: boolean;
    logout: boolean;
    refreshToken: boolean;
    updateProfile: boolean;
    requestPasswordReset: boolean;
    verifyEmail: boolean;
    initialization: boolean;
  };
}

export const initialAuthState: AuthState = {
  // User data
  user: null,
  tokens: null,
  isAuthenticated: false,

  // UI state
  isLoading: false,
  error: null,

  // Status
  status: 'unauthenticated',

  // Operation-specific loading states
  loadingStates: {
    login: false,
    register: false,
    logout: false,
    refreshToken: false,
    updateProfile: false,
    requestPasswordReset: false,
    verifyEmail: false,
    initialization: false,
  },
};
