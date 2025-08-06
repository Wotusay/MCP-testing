import { createAction, props } from '@ngrx/store';
import {
  AuthUser,
  AuthTokens,
  LoginCredentials,
  RegisterData,
} from '../../../shared/models/auth.models';

// Authentication Actions
export const login = createAction(
  '[Auth] Login',
  props<{ credentials: LoginCredentials }>(),
);

export const loginSuccess = createAction(
  '[Auth] Login Success',
  props<{ user: AuthUser; tokens: AuthTokens }>(),
);

export const loginFailure = createAction(
  '[Auth] Login Failure',
  props<{ error: string }>(),
);

// Registration Actions
export const register = createAction(
  '[Auth] Register',
  props<{ data: RegisterData }>(),
);

export const registerSuccess = createAction(
  '[Auth] Register Success',
  props<{ user: AuthUser; tokens: AuthTokens }>(),
);

export const registerFailure = createAction(
  '[Auth] Register Failure',
  props<{ error: string }>(),
);

// Logout Actions
export const logout = createAction('[Auth] Logout');

export const logoutSuccess = createAction('[Auth] Logout Success');

// Token Refresh Actions
export const refreshToken = createAction('[Auth] Refresh Token');

export const refreshTokenSuccess = createAction(
  '[Auth] Refresh Token Success',
  props<{ tokens: AuthTokens }>(),
);

export const refreshTokenFailure = createAction(
  '[Auth] Refresh Token Failure',
  props<{ error: string }>(),
);

// Profile Actions
export const updateProfile = createAction(
  '[Auth] Update Profile',
  props<{ updates: Partial<AuthUser> }>(),
);

export const updateProfileSuccess = createAction(
  '[Auth] Update Profile Success',
  props<{ user: AuthUser }>(),
);

export const updateProfileFailure = createAction(
  '[Auth] Update Profile Failure',
  props<{ error: string }>(),
);

// Password Reset Actions
export const requestPasswordReset = createAction(
  '[Auth] Request Password Reset',
  props<{ email: string }>(),
);

export const requestPasswordResetSuccess = createAction(
  '[Auth] Request Password Reset Success',
);

export const requestPasswordResetFailure = createAction(
  '[Auth] Request Password Reset Failure',
  props<{ error: string }>(),
);

// Email Verification Actions
export const verifyEmail = createAction(
  '[Auth] Verify Email',
  props<{ token: string }>(),
);

export const verifyEmailSuccess = createAction('[Auth] Verify Email Success');

export const verifyEmailFailure = createAction(
  '[Auth] Verify Email Failure',
  props<{ error: string }>(),
);

// Initialization Actions
export const initializeAuth = createAction('[Auth] Initialize Auth');

export const initializeAuthSuccess = createAction(
  '[Auth] Initialize Auth Success',
  props<{ user: AuthUser; tokens: AuthTokens }>(),
);

export const initializeAuthFailure = createAction(
  '[Auth] Initialize Auth Failure',
);

// UI State Actions
export const setLoading = createAction(
  '[Auth] Set Loading',
  props<{ loading: boolean }>(),
);

export const clearError = createAction('[Auth] Clear Error');

// Token Management Actions
export const scheduleTokenRefresh = createAction(
  '[Auth] Schedule Token Refresh',
  props<{ tokens: AuthTokens }>(),
);

export const clearTokenRefresh = createAction('[Auth] Clear Token Refresh');
