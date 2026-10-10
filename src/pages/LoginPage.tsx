import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { loginUser, clearAuthError } from '../store/slices/authSlice';
import { Store, LogIn, AlertCircle, Shield, User, Store as StoreIcon } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(clearAuthError());

    const result = await dispatch(loginUser({ email, password }));
    if (loginUser.fulfilled.match(result)) {
      const user = result.payload.user;
      if (user.role === 'ADMIN') {
        navigate('/admin');
      } else if (user.role === 'STORE_OWNER') {
        navigate('/owner');
      } else {
        navigate('/stores');
      }
    }
  };

  const handleQuickLogin = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('Password@123');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-950 via-slate-900 to-slate-950">
      <div className="w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 shadow-xl shadow-indigo-500/25 mb-3">
            <Store className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">RateHub</h1>
          <p className="text-sm text-slate-400 mt-1">
            Store Rating & Review Platform
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-8 shadow-2xl backdrop-blur-xl">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-white">Sign In</h2>
            <p className="text-xs text-slate-400 mt-1">
              Enter your credentials to access your dashboard
            </p>
          </div>

          {error && (
            <div className="flex items-center gap-2.5 p-3.5 mb-5 bg-red-950/50 border border-red-800 text-red-200 text-sm rounded-xl">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full px-4 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full px-4 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold rounded-xl shadow-lg shadow-indigo-600/30 transition-all text-sm cursor-pointer mt-2"
            >
              <LogIn className="w-4 h-4" />
              <span>{isLoading ? 'Signing in...' : 'Sign In'}</span>
            </button>
          </form>

          {/* Quick Demo Login Fillers */}
          <div className="mt-6 pt-5 border-t border-slate-800">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2.5 text-center">
              Quick Demo Accounts (1-Click Fill)
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('admin@storerating.com')}
                className="flex flex-col items-center p-2 rounded-xl bg-slate-800/60 hover:bg-slate-750 border border-slate-700/60 transition-all text-center cursor-pointer group"
              >
                <Shield className="w-4 h-4 text-rose-400 mb-1 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-medium text-slate-200">Admin</span>
                <span className="text-[10px] text-slate-500">System</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('alexander.smith@organicmarket.com')}
                className="flex flex-col items-center p-2 rounded-xl bg-slate-800/60 hover:bg-slate-750 border border-slate-700/60 transition-all text-center cursor-pointer group"
              >
                <StoreIcon className="w-4 h-4 text-amber-400 mb-1 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-medium text-slate-200">Owner</span>
                <span className="text-[10px] text-slate-500">Store</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('user1@example.com')}
                className="flex flex-col items-center p-2 rounded-xl bg-slate-800/60 hover:bg-slate-750 border border-slate-700/60 transition-all text-center cursor-pointer group"
              >
                <User className="w-4 h-4 text-indigo-400 mb-1 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-medium text-slate-200">User</span>
                <span className="text-[10px] text-slate-500">Normal</span>
              </button>
            </div>
          </div>

          {/* Registration link */}
          <div className="mt-6 text-center text-xs text-slate-400">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="text-indigo-400 hover:text-indigo-300 font-semibold underline underline-offset-4"
            >
              Sign up as Normal User
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
