import { User } from '../actions/user.actions';

export interface UserState {
  // Data
  users: User[];
  selectedUser: User | null;

  // UI state
  loading: boolean;
  error: string | null;

  // Individual loading states
  loadingStates: {
    loadUsers: boolean;
    loadUserById: boolean;
    createUser: boolean;
    updateUser: boolean;
    deleteUser: boolean;
  };

  // Filters
  filters: {
    activeOnly: boolean;
  };
}

export const initialUserState: UserState = {
  // Data
  users: [],
  selectedUser: null,

  // UI state
  loading: false,
  error: null,

  // Individual loading states
  loadingStates: {
    loadUsers: false,
    loadUserById: false,
    createUser: false,
    updateUser: false,
    deleteUser: false,
  },

  // Filters
  filters: {
    activeOnly: false,
  },
};
