import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiRequest } from '../../services/api';
import { OwnerRatingItem, StoreSummary, Pagination } from '../../types';

interface OwnerState {
  store: StoreSummary | null;
  ratings: OwnerRatingItem[];
  pagination: Pagination | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: OwnerState = {
  store: null,
  ratings: [],
  pagination: null,
  isLoading: false,
  error: null,
};

export const fetchOwnerStoreRatings = createAsyncThunk(
  'owner/fetchOwnerStoreRatings',
  async (
    params: {
      sortBy?: string;
      sortOrder?: 'asc' | 'desc';
      page?: number;
      limit?: number;
    } = {},
    { rejectWithValue }
  ) => {
    try {
      const response = await apiRequest('/ratings/owner', { params });
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to fetch store ratings');
    }
  }
);

export const ownerSlice = createSlice({
  name: 'owner',
  initialState,
  reducers: {
    clearOwnerError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOwnerStoreRatings.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOwnerStoreRatings.fulfilled, (state, action) => {
        state.isLoading = false;
        state.store = action.payload.store;
        state.ratings = action.payload.ratings;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchOwnerStoreRatings.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearOwnerError } = ownerSlice.actions;
export default ownerSlice.reducer;
