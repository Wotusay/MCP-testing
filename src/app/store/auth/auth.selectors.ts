import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState } from './auth.state';

// Feature selector
export const selectAuthState = createFeatureSelector<AuthState>('auth');

// User selectors
export const selectUser = createSelector(
  selectAuthState,
  (state) => state.user,
);

export const selectTokens = createSelector(
  selectAuthState,
  (state) => state.tokens,
);

export const selectIsAuthenticated = createSelector(
  selectAuthState,
  (state) => state.isAuthenticated,
);

// UI state selectors
export const selectAuthLoading = createSelector(
  selectAuthState,
  (state) => state.isLoading,
);

export const selectAuthError = createSelector(
  selectAuthState,
  (state) => state.error,
);

export const selectAuthStatus = createSelector(
  selectAuthState,
  (state) => state.status,
);

export const selectLoadingStates = createSelector(
  selectAuthState,
  (state) => state.loadingStates,
);

// Specific loading state selectors
export const selectLoginLoading = createSelector(
  selectLoadingStates,
  (loadingStates) => loadingStates.login,
);

export const selectRegisterLoading = createSelector(
  selectLoadingStates,
  (loadingStates) => loadingStates.register,
);

export const selectLogoutLoading = createSelector(
  selectLoadingStates,
  (loadingStates) => loadingStates.logout,
);

export const selectRefreshTokenLoading = createSelector(
  selectLoadingStates,
  (loadingStates) => loadingStates.refreshToken,
);

export const selectUpdateProfileLoading = createSelector(
  selectLoadingStates,
  (loadingStates) => loadingStates.updateProfile,
);

export const selectPasswordResetLoading = createSelector(
  selectLoadingStates,
  (loadingStates) => loadingStates.requestPasswordReset,
);

export const selectVerifyEmailLoading = createSelector(
  selectLoadingStates,
  (loadingStates) => loadingStates.verifyEmail,
);

export const selectInitializationLoading = createSelector(
  selectLoadingStates,
  (loadingStates) => loadingStates.initialization,
);

// Authorization selectors
export const selectUserPermissions = createSelector(
  selectUser,
  (user) => user?.permissions || [],
);

export const selectUserRoles = createSelector(
  selectUser,
  (user) => user?.roles || [],
);

export const selectHasPermission = (permission: string) =>
  createSelector(selectUserPermissions, (permissions) =>
    permissions.includes(permission),
  );

export const selectHasRole = (role: string) =>
  createSelector(selectUserRoles, (roles) => roles.includes(role));

export const selectHasAnyRole = (roles: string[]) =>
  createSelector(selectUserRoles, (userRoles) =>
    roles.some((role) => userRoles.includes(role)),
  );

// Auth header selector
export const selectAuthHeader = createSelector(selectTokens, (tokens) =>
  tokens ? `${tokens.tokenType} ${tokens.accessToken}` : null,
);

// User profile selectors
export const selectUserProfile = createSelector(selectUser, (user) => ({
  id: user?.id,
  email: user?.email,
  name: user?.name,
  isEmailVerified: user?.isEmailVerified,
}));

export const selectIsEmailVerified = createSelector(
  selectUser,
  (user) => user?.isEmailVerified || false,
);

// Token validation selectors
export const selectTokenExpiresAt = createSelector(
  selectTokens,
  (tokens) => tokens?.expiresAt,
);

export const selectIsTokenExpired = createSelector(
  selectTokenExpiresAt,
  (expiresAt) => {
    if (!expiresAt) return true;
    return Date.now() >= expiresAt;
  },
);

export const selectTokenExpiresIn = createSelector(
  selectTokenExpiresAt,
  (expiresAt) => {
    if (!expiresAt) return 0;
    const timeLeft = expiresAt - Date.now();
    return Math.max(0, timeLeft);
  },
);

// Composite selectors
export const selectAuthInfo = createSelector(
  selectUser,
  selectTokens,
  selectIsAuthenticated,
  selectAuthStatus,
  (user, tokens, isAuthenticated, status) => ({
    user,
    tokens,
    isAuthenticated,
    status,
  }),
);

export const selectIsAnyAuthActionLoading = createSelector(
  selectLoadingStates,
  (loadingStates) =>
    loadingStates.login ||
    loadingStates.register ||
    loadingStates.logout ||
    loadingStates.refreshToken ||
    loadingStates.updateProfile ||
    loadingStates.requestPasswordReset ||
    loadingStates.verifyEmail ||
    loadingStates.initialization,
);

export const selectCanRefreshToken = createSelector(
  selectTokens,
  selectIsTokenExpired,
  (tokens, isExpired) => !!tokens?.refreshToken && !isExpired,
);

// Navigation guards selectors
export const selectCanActivateAuthenticated = createSelector(
  selectIsAuthenticated,
  selectAuthStatus,
  (isAuthenticated, status) => isAuthenticated && status === 'authenticated',
);

export const selectCanActivateUnauthenticated = createSelector(
  selectIsAuthenticated,
  selectAuthStatus,
  (isAuthenticated, status) => !isAuthenticated && status !== 'loading',
);
