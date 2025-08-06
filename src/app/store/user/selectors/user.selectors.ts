import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UserState } from '../state/user.state';

// Feature selector
export const selectUserState = createFeatureSelector<UserState>('user');

// Data selectors
export const selectUsers = createSelector(
  selectUserState,
  (state) => state.users,
);

export const selectSelectedUser = createSelector(
  selectUserState,
  (state) => state.selectedUser,
);

// UI state selectors
export const selectUserLoading = createSelector(
  selectUserState,
  (state) => state.loading,
);

export const selectUserError = createSelector(
  selectUserState,
  (state) => state.error,
);

export const selectLoadingStates = createSelector(
  selectUserState,
  (state) => state.loadingStates,
);

// Specific loading state selectors
export const selectLoadUsersLoading = createSelector(
  selectLoadingStates,
  (loadingStates) => loadingStates.loadUsers,
);

export const selectLoadUserByIdLoading = createSelector(
  selectLoadingStates,
  (loadingStates) => loadingStates.loadUserById,
);

export const selectCreateUserLoading = createSelector(
  selectLoadingStates,
  (loadingStates) => loadingStates.createUser,
);

export const selectUpdateUserLoading = createSelector(
  selectLoadingStates,
  (loadingStates) => loadingStates.updateUser,
);

export const selectDeleteUserLoading = createSelector(
  selectLoadingStates,
  (loadingStates) => loadingStates.deleteUser,
);

// Filter selectors
export const selectFilters = createSelector(
  selectUserState,
  (state) => state.filters,
);

export const selectActiveFilter = createSelector(
  selectFilters,
  (filters) => filters.activeOnly,
);

// Filtered data selectors
export const selectFilteredUsers = createSelector(
  selectUsers,
  selectActiveFilter,
  (users, activeOnly) => {
    if (activeOnly) {
      return users.filter((user) => user.active);
    }
    return users;
  },
);

export const selectActiveUsers = createSelector(selectUsers, (users) =>
  users.filter((user) => user.active),
);

export const selectInactiveUsers = createSelector(selectUsers, (users) =>
  users.filter((user) => !user.active),
);

// User statistics selectors
export const selectUserCount = createSelector(
  selectUsers,
  (users) => users.length,
);

export const selectActiveUserCount = createSelector(
  selectActiveUsers,
  (activeUsers) => activeUsers.length,
);

export const selectInactiveUserCount = createSelector(
  selectInactiveUsers,
  (inactiveUsers) => inactiveUsers.length,
);

// User lookup selectors
export const selectUserById = (id: number) =>
  createSelector(selectUsers, (users) => users.find((user) => user.id === id));

export const selectUserByEmail = (email: string) =>
  createSelector(selectUsers, (users) =>
    users.find((user) => user.email === email),
  );

// Composite selectors
export const selectUserStats = createSelector(
  selectUserCount,
  selectActiveUserCount,
  selectInactiveUserCount,
  (total, active, inactive) => ({
    total,
    active,
    inactive,
    activePercentage: total > 0 ? Math.round((active / total) * 100) : 0,
  }),
);

export const selectIsAnyUserActionLoading = createSelector(
  selectLoadingStates,
  (loadingStates) =>
    loadingStates.loadUsers ||
    loadingStates.loadUserById ||
    loadingStates.createUser ||
    loadingStates.updateUser ||
    loadingStates.deleteUser,
);

export const selectUserManagementState = createSelector(
  selectUsers,
  selectSelectedUser,
  selectIsAnyUserActionLoading,
  selectUserError,
  selectFilters,
  (users, selectedUser, loading, error, filters) => ({
    users,
    selectedUser,
    loading,
    error,
    filters,
  }),
);

// Search and filter helpers
export const selectUsersSearch = (searchTerm: string) =>
  createSelector(selectFilteredUsers, (users) => {
    if (!searchTerm.trim()) {
      return users;
    }

    const term = searchTerm.toLowerCase();
    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term),
    );
  });

// Validation selectors
export const selectEmailExists = (email: string) =>
  createSelector(selectUsers, (users) =>
    users.some((user) => user.email.toLowerCase() === email.toLowerCase()),
  );

export const selectCanDeleteUser = (userId: number) =>
  createSelector(
    selectUserById(userId),
    selectDeleteUserLoading,
    (user, deleting) => user && !deleting,
  );
