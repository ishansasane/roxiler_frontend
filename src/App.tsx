import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { fetchCurrentUser } from './store/slices/authSlice';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { StoreOwnerDashboardPage } from './pages/StoreOwnerDashboardPage';
import { UserDashboardPage } from './pages/UserDashboardPage';
import { ProtectedRoute } from './routes/ProtectedRoute';

export const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (localStorage.getItem('token')) {
      dispatch(fetchCurrentUser());
    }
  }, [dispatch]);

  const getDefaultRedirect = () => {
    if (!isAuthenticated || !user) {
      return '/login';
    }
    if (user.role === 'ADMIN') return '/admin';
    if (user.role === 'STORE_OWNER') return '/owner';
    return '/stores';
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/login"
          element={
            isAuthenticated && user ? (
              <Navigate to={getDefaultRedirect()} replace />
            ) : (
              <LoginPage />
            )
          }
        />
        <Route
          path="/register"
          element={
            isAuthenticated && user ? (
              <Navigate to={getDefaultRedirect()} replace />
            ) : (
              <RegisterPage />
            )
          }
        />

        {/* Protected Routes for System Administrator */}
        <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
          <Route path="/admin" element={<AdminDashboardPage />} />
        </Route>

        {/* Protected Routes for Store Owner */}
        <Route element={<ProtectedRoute allowedRoles={['STORE_OWNER']} />}>
          <Route path="/owner" element={<StoreOwnerDashboardPage />} />
        </Route>

        {/* Protected Routes for Normal User */}
        <Route element={<ProtectedRoute allowedRoles={['USER']} />}>
          <Route path="/stores" element={<UserDashboardPage />} />
        </Route>

        {/* Root Redirect */}
        <Route path="/" element={<Navigate to={getDefaultRedirect()} replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
