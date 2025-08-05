import { createReducer, on } from '@ngrx/store';
import { initialAuthState } from './auth.state';
import * as AuthActions from './auth.actions';

export const authReducer = createReducer(
  initialAuthState,

  // Initialize Auth
  on(AuthActions.initializeAuth, (state) => ({
    ...state,
    loadingStates: {
      ...state.loadingStates,
      initialization: true,
    },
    error: null,
  })),

  on(AuthActions.initializeAuthSuccess, (state, action) => ({
    ...state,
    user: action.user,
    tokens: action.tokens,
    isAuthenticated: true,
    status: 'authenticated' as const,
    loadingStates: {
      ...state.loadingStates,
      initialization: false,
    },
    error: null,
  })),

  on(AuthActions.initializeAuthFailure, (state) => ({
    ...state,
    user: null,
    tokens: null,
    isAuthenticated: false,
    status: 'unauthenticated' as const,
    loadingStates: {
      ...state.loadingStates,
      initialization: false,
    },
    error: null,
  })),

  // Login
  on(AuthActions.login, (state) => ({
    ...state,
    loadingStates: {
      ...state.loadingStates,
      login: true,
    },
    status: 'loading' as const,
    error: null,
  })),

  on(AuthActions.loginSuccess, (state, action) => ({
    ...state,
    user: action.user,
    tokens: action.tokens,
    isAuthenticated: true,
    status: 'authenticated' as const,
    loadingStates: {
      ...state.loadingStates,
      login: false,
    },
    error: null,
  })),

  on(AuthActions.loginFailure, (state, action) => ({
    ...state,
    user: null,
    tokens: null,
    isAuthenticated: false,
    status: 'error' as const,
    loadingStates: {
      ...state.loadingStates,
      login: false,
    },
    error: action.error,
  })),

  // Register
  on(AuthActions.register, (state) => ({
    ...state,
    loadingStates: {
      ...state.loadingStates,
      register: true,
    },
    status: 'loading' as const,
    error: null,
  })),

  on(AuthActions.registerSuccess, (state, action) => ({
    ...state,
    user: action.user,
    tokens: action.tokens,
    isAuthenticated: true,
    status: 'authenticated' as const,
    loadingStates: {
      ...state.loadingStates,
      register: false,
    },
    error: null,
  })),

  on(AuthActions.registerFailure, (state, action) => ({
    ...state,
    user: null,
    tokens: null,
    isAuthenticated: false,
    status: 'error' as const,
    loadingStates: {
      ...state.loadingStates,
      register: false,
    },
    error: action.error,
  })),

  // Logout
  on(AuthActions.logout, (state) => ({
    ...state,
    loadingStates: {
      ...state.loadingStates,
      logout: true,
    },
    error: null,
  })),

  on(AuthActions.logoutSuccess, (state) => ({
    ...state,
    user: null,
    tokens: null,
    isAuthenticated: false,
    status: 'unauthenticated' as const,
    loadingStates: {
      ...state.loadingStates,
      logout: false,
    },
    error: null,
  })),

  // Refresh Token
  on(AuthActions.refreshToken, (state) => ({
    ...state,
    loadingStates: {
      ...state.loadingStates,
      refreshToken: true,
    },
    error: null,
  })),

  on(AuthActions.refreshTokenSuccess, (state, action) => ({
    ...state,
    tokens: action.tokens,
    loadingStates: {
      ...state.loadingStates,
      refreshToken: false,
    },
    error: null,
  })),

  on(AuthActions.refreshTokenFailure, (state, action) => ({
    ...state,
    user: null,
    tokens: null,
    isAuthenticated: false,
    status: 'unauthenticated' as const,
    loadingStates: {
      ...state.loadingStates,
      refreshToken: false,
    },
    error: action.error,
  })),

  // Update Profile
  on(AuthActions.updateProfile, (state) => ({
    ...state,
    loadingStates: {
      ...state.loadingStates,
      updateProfile: true,
    },
    error: null,
  })),

  on(AuthActions.updateProfileSuccess, (state, action) => ({
    ...state,
    user: action.user,
    loadingStates: {
      ...state.loadingStates,
      updateProfile: false,
    },
    error: null,
  })),

  on(AuthActions.updateProfileFailure, (state, action) => ({
    ...state,
    loadingStates: {
      ...state.loadingStates,
      updateProfile: false,
    },
    error: action.error,
  })),

  // Request Password Reset
  on(AuthActions.requestPasswordReset, (state) => ({
    ...state,
    loadingStates: {
      ...state.loadingStates,
      requestPasswordReset: true,
    },
    error: null,
  })),

  on(AuthActions.requestPasswordResetSuccess, (state) => ({
    ...state,
    loadingStates: {
      ...state.loadingStates,
      requestPasswordReset: false,
    },
    error: null,
  })),

  on(AuthActions.requestPasswordResetFailure, (state, action) => ({
    ...state,
    loadingStates: {
      ...state.loadingStates,
      requestPasswordReset: false,
    },
    error: action.error,
  })),

  // Verify Email
  on(AuthActions.verifyEmail, (state) => ({
    ...state,
    loadingStates: {
      ...state.loadingStates,
      verifyEmail: true,
    },
    error: null,
  })),

  on(AuthActions.verifyEmailSuccess, (state) => {
    const updatedUser = state.user
      ? { ...state.user, isEmailVerified: true }
      : null;

    return {
      ...state,
      user: updatedUser,
      loadingStates: {
        ...state.loadingStates,
        verifyEmail: false,
      },
      error: null,
    };
  }),

  on(AuthActions.verifyEmailFailure, (state, action) => ({
    ...state,
    loadingStates: {
      ...state.loadingStates,
      verifyEmail: false,
    },
    error: action.error,
  })),

  // UI State
  on(AuthActions.setLoading, (state, action) => ({
    ...state,
    isLoading: action.loading,
    status: action.loading ? ('loading' as const) : state.status,
  })),

  on(AuthActions.clearError, (state) => ({
    ...state,
    error: null,
    status: state.isAuthenticated
      ? ('authenticated' as const)
      : ('unauthenticated' as const),
  })),
);
