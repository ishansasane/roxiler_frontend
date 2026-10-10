import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { apiRequest } from '../../services/api';
import { Store, Pagination } from '../../types';

interface StoreState {
  stores: Store[];
  pagination: Pagination | null;
  isLoading: boolean;
  error: string | null;
  searchQuery: string;
}

const initialState: StoreState = {
  stores: [],
  pagination: null,
  isLoading: false,
  error: null,
  searchQuery: '',
};

export const fetchUserStores = createAsyncThunk(
  'stores/fetchUserStores',
  async (
    params: {
      search?: string;
      sortBy?: string;
      sortOrder?: 'asc' | 'desc';
      page?: number;
      limit?: number;
    } = {},
    { rejectWithValue }
  ) => {
    try {
      const response = await apiRequest('/stores', { params });
      return response;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to fetch stores');
    }
  }
);

export const submitUserRating = createAsyncThunk(
  'stores/submitUserRating',
  async (
    payload: { storeId: number; rating: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await apiRequest(`/ratings/${payload.storeId}`, {
        method: 'POST',
        body: JSON.stringify({ rating: payload.rating }),
      });
      return {
        storeId: payload.storeId,
        rating: payload.rating,
        overallRating: response.data.overallRating,
        totalRatings: response.data.totalRatings,
      };
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to submit rating');
    }
  }
);

export const storeSlice = createSlice({
  name: 'stores',
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    clearStoreError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Stores
    builder
      .addCase(fetchUserStores.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserStores.fulfilled, (state, action) => {
        state.isLoading = false;
        state.stores = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchUserStores.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Submit Rating
    builder
      .addCase(submitUserRating.fulfilled, (state, action) => {
        const index = state.stores.findIndex((s) => s.id === action.payload.storeId);
        if (index !== -1) {
          state.stores[index].overallRating = action.payload.overallRating;
          state.stores[index].totalRatings = action.payload.totalRatings;
          state.stores[index].userSubmittedRating = action.payload.rating;
        }
      });
  },
});

export const { setSearchQuery, clearStoreError } = storeSlice.actions;
export default storeSlice.reducer;
