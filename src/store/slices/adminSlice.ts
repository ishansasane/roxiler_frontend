import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiRequest } from '../../services/api';
import { AdminStats, User, Store, Pagination, UserRole } from '../../types';

interface AdminState {
  stats: AdminStats | null;
  users: User[];
  stores: Store[];
  availableOwners: Array<{ id: number; name: string; email: string }>;
  userPagination: Pagination | null;
  storePagination: Pagination | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: AdminState = {
  stats: null,
  users: [],
  stores: [],
  availableOwners: [],
  userPagination: null,
  storePagination: null,
  isLoading: false,
  error: null,
};

export const fetchAdminStats = createAsyncThunk(
  'admin/fetchAdminStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiRequest('/dashboard/admin');
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to fetch admin statistics');
    }
  }
);

export const fetchAdminUsers = createAsyncThunk(
  'admin/fetchAdminUsers',
  async (
    params:
      | {
          search?: string;
          name?: string;
          email?: string;
          address?: string;
          role?: string;
          sortBy?: string;
          sortOrder?: 'asc' | 'desc';
          page?: number;
          limit?: number;
        }
      | void,
    { rejectWithValue }
  ) => {
    try {
      const response = await apiRequest('/users', { params: params || {} });
      return response;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to fetch users');
    }
  }
);

export const createAdminUser = createAsyncThunk(
  'admin/createAdminUser',
  async (
    userData: {
      name: string;
      email: string;
      address: string;
      password: string;
      role: UserRole;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await apiRequest('/users', {
        method: 'POST',
        body: JSON.stringify(userData),
      });
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to create user');
    }
  }
);

export const fetchAdminStores = createAsyncThunk(
  'admin/fetchAdminStores',
  async (
    params:
      | {
          search?: string;
          name?: string;
          email?: string;
          address?: string;
          sortBy?: string;
          sortOrder?: 'asc' | 'desc';
          page?: number;
          limit?: number;
        }
      | void,
    { rejectWithValue }
  ) => {
    try {
      const response = await apiRequest('/stores', { params: params || {} });
      return response;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to fetch stores');
    }
  }
);

export const createAdminStore = createAsyncThunk(
  'admin/createAdminStore',
  async (
    storeData: {
      name: string;
      email: string;
      address: string;
      ownerId?: number | null;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await apiRequest('/stores', {
        method: 'POST',
        body: JSON.stringify(storeData),
      });
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to create store');
    }
  }
);

export const fetchAvailableOwners = createAsyncThunk(
  'admin/fetchAvailableOwners',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiRequest('/users/available-owners');
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to fetch available store owners');
    }
  }
);

export const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    clearAdminError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Stats
    builder
      .addCase(fetchAdminStats.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAdminStats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.stats = action.payload;
      })
      .addCase(fetchAdminStats.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Users
    builder
      .addCase(fetchAdminUsers.fulfilled, (state, action) => {
        state.users = action.payload.data;
        state.userPagination = action.payload.pagination;
      });

    // Stores
    builder
      .addCase(fetchAdminStores.fulfilled, (state, action) => {
        state.stores = action.payload.data;
        state.storePagination = action.payload.pagination;
      });

    // Available Owners
    builder
      .addCase(fetchAvailableOwners.fulfilled, (state, action) => {
        state.availableOwners = action.payload;
      });

    // Create User
    builder
      .addCase(createAdminUser.fulfilled, (state, action) => {
        state.users.unshift(action.payload);
      });

    // Create Store
    builder
      .addCase(createAdminStore.fulfilled, (state, action) => {
        state.stores.unshift(action.payload);
      });
  },
});

export const { clearAdminError } = adminSlice.actions;
export default adminSlice.reducer;
