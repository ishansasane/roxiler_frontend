
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { loginUser, clearAuthError } from '../store/slices/authSlice';
import { Store, LogIn, AlertCircle, Loader2 } from 'lucide-react';

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
    dispatch(clearAuthError());
  };

  const demoAccounts = [
    { label: 'Admin', email: 'admin@punehotelrating.in' },
    { label: 'Store owner', email: 'sandeep.joshi@hotelsahyadri.in' },
    { label: 'Regular user', email: 'rohan.kulkarni@gmail.com' },
  ];

  return (
    <main className="min-h-screen bg-[#111318] flex items-center justify-center p-5 sm:p-8">
      <div className="w-full max-w-5xl overflow-hidden rounded-2xl border border-[#30333b] bg-[#191c22] md:grid md:grid-cols-2">

        {/* Brand section */}
        <section className="hidden md:flex flex-col justify-between bg-[#151820] p-10 lg:p-12 text-white border-r border-[#30333b]">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600 text-white">
                <Store size={22} />
              </div>
              <span className="text-xl font-semibold tracking-tight">
                RateHub
              </span>
            </div>

            <div className="mt-24">
              <p className="text-sm font-medium text-indigo-400">
                YOUR LOCAL GUIDE
              </p>
              <h1 className="mt-4 text-4xl font-semibold leading-tight tracking-tight">
                Good places.
                <br />
                Honest reviews.
              </h1>
              <p className="mt-5 max-w-sm text-sm leading-6 text-slate-400">
                Discover stores, share your experience, and help others
                make better choices.
              </p>
            </div>
          </div>

          <p className="text-xs text-slate-500">
            RateHub · Store Rating & Review Platform
          </p>
        </section>

        {/* Login section */}
        <section className="p-6 sm:p-9 lg:p-12">
          <div className="mb-8 md:hidden">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white">
                <Store size={20} />
              </div>
              <span className="text-xl font-semibold text-white">
                RateHub
              </span>
            </div>
          </div>

          <div className="mb-7">
            <h2 className="text-2xl font-semibold tracking-tight text-white">
              Welcome back
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              Sign in to continue to your account.
            </p>
          </div>

          {error && (
            <div
              role="alert"
              className="mb-5 flex items-start gap-2 rounded-lg border border-red-900/70 bg-red-950/40 p-3 text-sm text-red-300"
            >
              <AlertCircle size={17} className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Email address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-lg border border-[#3a3e48] bg-[#12151b] px-3.5 py-3 text-sm text-white placeholder:text-slate-600 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                required
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full rounded-lg border border-[#3a3e48] bg-[#12151b] px-3.5 py-3 text-sm text-white placeholder:text-slate-600 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <Loader2 size={17} className="animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  <LogIn size={17} />
                  Sign in
                </>
              )}
            </button>
          </form>

          {/* Demo accounts */}
          <div className="mt-8 border-t border-[#30333b] pt-6">
            <p className="text-sm font-medium text-slate-200">
              Just exploring?
            </p>
            <p className="mt-1 text-xs leading-5 text-slate-400">
              Fill in a demo account to try a different role.
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              {demoAccounts.map((account) => (
                <button
                  key={account.email}
                  type="button"
                  onClick={() => handleQuickLogin(account.email)}
                  className="rounded-md border border-[#3a3e48] bg-[#20242c] px-3 py-2 text-xs font-medium text-slate-300 transition hover:border-indigo-500/60 hover:bg-indigo-500/10 hover:text-indigo-300"
                >
                  {account.label}
                </button>
              ))}
            </div>

            <p className="mt-3 text-xs text-slate-500">
              Demo password: Password@123
            </p>
          </div>

          <p className="mt-7 text-center text-sm text-slate-400">
            New to RateHub?{' '}
            <Link
              to="/register"
              className="font-medium text-indigo-400 hover:text-indigo-300 hover:underline"
            >
              Create an account
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
};
