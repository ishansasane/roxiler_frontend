import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { apiRequest } from '../../services/api';
import { User } from '../../types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialToken = localStorage.getItem('token');
const initialUserJson = localStorage.getItem('user');
let initialUser: User | null = null;
if (initialUserJson) {
  try {
    initialUser = JSON.parse(initialUserJson);
  } catch {
    initialUser = null;
  }
}

const initialState: AuthState = {
  user: initialUser,
  token: initialToken,
  isAuthenticated: !!initialToken,
  isLoading: false,
  error: null,
};

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Login failed');
    }
  }
);

export const signupUser = createAsyncThunk(
  'auth/signupUser',
  async (
    formData: { name: string; email: string; address: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await apiRequest('/auth/signup', {
        method: 'POST',
        body: JSON.stringify(formData),
      });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Signup failed');
    }
  }
);

export const fetchCurrentUser = createAsyncThunk(
  'auth/fetchCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiRequest('/auth/me');
      localStorage.setItem('user', JSON.stringify(response.data));
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to fetch user');
    }
  }
);

export const updatePassword = createAsyncThunk(
  'auth/updatePassword',
  async (
    passwords: { currentPassword: string; newPassword: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await apiRequest('/auth/update-password', {
        method: 'PATCH',
        body: JSON.stringify(passwords),
      });
      return response.message;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Password update failed');
    }
  }
);

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
    clearAuthError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Signup
    builder
      .addCase(signupUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch Current User
    builder
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(fetchCurrentUser.rejected, (state) => {
        // Token might have expired
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      });
  },
});

export const { logout, clearAuthError } = authSlice.actions;
export default authSlice.reducer;
