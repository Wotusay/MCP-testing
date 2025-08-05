import { createReducer, on } from '@ngrx/store';
import { initialUserState } from './user.state';
import * as UserActions from './user.actions';

export const userReducer = createReducer(
  initialUserState,

  // Load Users
  on(UserActions.loadUsers, (state) => ({
    ...state,
    loadingStates: {
      ...state.loadingStates,
      loadUsers: true,
    },
    error: null,
  })),

  on(UserActions.loadUsersSuccess, (state, action) => ({
    ...state,
    users: action.users,
    loadingStates: {
      ...state.loadingStates,
      loadUsers: false,
    },
    error: null,
  })),

  on(UserActions.loadUsersFailure, (state, action) => ({
    ...state,
    loadingStates: {
      ...state.loadingStates,
      loadUsers: false,
    },
    error: action.error,
  })),

  // Load User by ID
  on(UserActions.loadUserById, (state) => ({
    ...state,
    loadingStates: {
      ...state.loadingStates,
      loadUserById: true,
    },
    error: null,
  })),

  on(UserActions.loadUserByIdSuccess, (state, action) => ({
    ...state,
    selectedUser: action.user,
    loadingStates: {
      ...state.loadingStates,
      loadUserById: false,
    },
    error: null,
  })),

  on(UserActions.loadUserByIdFailure, (state, action) => ({
    ...state,
    selectedUser: null,
    loadingStates: {
      ...state.loadingStates,
      loadUserById: false,
    },
    error: action.error,
  })),

  // Create User
  on(UserActions.createUser, (state) => ({
    ...state,
    loadingStates: {
      ...state.loadingStates,
      createUser: true,
    },
    error: null,
  })),

  on(UserActions.createUserSuccess, (state, action) => ({
    ...state,
    users: [...state.users, action.user],
    loadingStates: {
      ...state.loadingStates,
      createUser: false,
    },
    error: null,
  })),

  on(UserActions.createUserFailure, (state, action) => ({
    ...state,
    loadingStates: {
      ...state.loadingStates,
      createUser: false,
    },
    error: action.error,
  })),

  // Update User
  on(UserActions.updateUser, (state) => ({
    ...state,
    loadingStates: {
      ...state.loadingStates,
      updateUser: true,
    },
    error: null,
  })),

  on(UserActions.updateUserSuccess, (state, action) => ({
    ...state,
    users: state.users.map((user) =>
      user.id === action.user.id ? action.user : user,
    ),
    selectedUser:
      state.selectedUser?.id === action.user.id
        ? action.user
        : state.selectedUser,
    loadingStates: {
      ...state.loadingStates,
      updateUser: false,
    },
    error: null,
  })),

  on(UserActions.updateUserFailure, (state, action) => ({
    ...state,
    loadingStates: {
      ...state.loadingStates,
      updateUser: false,
    },
    error: action.error,
  })),

  // Delete User
  on(UserActions.deleteUser, (state) => ({
    ...state,
    loadingStates: {
      ...state.loadingStates,
      deleteUser: true,
    },
    error: null,
  })),

  on(UserActions.deleteUserSuccess, (state, action) => ({
    ...state,
    users: state.users.filter((user) => user.id !== action.id),
    selectedUser:
      state.selectedUser?.id === action.id ? null : state.selectedUser,
    loadingStates: {
      ...state.loadingStates,
      deleteUser: false,
    },
    error: null,
  })),

  on(UserActions.deleteUserFailure, (state, action) => ({
    ...state,
    loadingStates: {
      ...state.loadingStates,
      deleteUser: false,
    },
    error: action.error,
  })),

  // UI State
  on(UserActions.setLoading, (state, action) => ({
    ...state,
    loading: action.loading,
  })),

  on(UserActions.clearError, (state) => ({
    ...state,
    error: null,
  })),

  // Filters
  on(UserActions.setActiveFilter, (state, action) => ({
    ...state,
    filters: {
      ...state.filters,
      activeOnly: action.activeOnly,
    },
  })),

  on(UserActions.clearFilters, (state) => ({
    ...state,
    filters: {
      activeOnly: false,
    },
  })),
);
