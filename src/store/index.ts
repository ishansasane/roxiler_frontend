import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import adminReducer from './slices/adminSlice';
import storeReducer from './slices/storeSlice';
import ownerReducer from './slices/ownerSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    admin: adminReducer,
    stores: storeReducer,
    owner: ownerReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
