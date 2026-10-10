import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { signupUser, clearAuthError } from '../store/slices/authSlice';
import { Store, UserPlus, AlertCircle, CheckCircle2, ShieldCheck } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.auth);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [clientError, setClientError] = useState<string | null>(null);

  // Validation checkers for visual feedback
  const isNameValid = name.trim().length >= 20 && name.trim().length <= 60;
  const isAddressValid = address.trim().length > 0 && address.trim().length <= 400;
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isPasswordLength = password.length >= 8 && password.length <= 16;
  const hasUppercase = /[A-Z]/.test(password);
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
  const isPasswordValid = isPasswordLength && hasUppercase && hasSpecialChar;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setClientError(null);
    dispatch(clearAuthError());

    if (!isNameValid) {
      setClientError('Name must be between 20 and 60 characters long');
      return;
    }
    if (!isEmailValid) {
      setClientError('Please enter a valid email address');
      return;
    }
    if (!isAddressValid) {
      setClientError('Address cannot exceed 400 characters');
      return;
    }
    if (!isPasswordValid) {
      setClientError('Password must meet all complexity requirements');
      return;
    }

    const result = await dispatch(
      signupUser({
        name: name.trim(),
        email: email.trim(),
        address: address.trim(),
        password,
      })
    );

    if (signupUser.fulfilled.match(result)) {
      navigate('/stores');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-950 via-slate-900 to-slate-950 py-12">
      <div className="w-full max-w-lg">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 shadow-xl shadow-indigo-500/25 mb-3">
            <Store className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Create Account</h1>
          <p className="text-sm text-slate-400 mt-1">
            Join RateHub to rate and review registered stores
          </p>
        </div>

        {/* Register Card */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-8 shadow-2xl backdrop-blur-xl">
          {(error || clientError) && (
            <div className="flex items-center gap-2.5 p-3.5 mb-5 bg-red-950/50 border border-red-800 text-red-200 text-sm rounded-xl">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{clientError || error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Full Name
                </label>
                <span
                  className={`text-xs ${
                    name.length >= 20 && name.length <= 60
                      ? 'text-emerald-400'
                      : name.length > 0
                      ? 'text-amber-400'
                      : 'text-slate-500'
                  }`}
                >
                  {name.length}/60 chars (Min 20)
                </span>
              </div>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Jonathan Bartholomew Peterson (min 20 chars)"
                maxLength={60}
                className="w-full px-4 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm"
                required
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Must be at least 20 characters and at most 60 characters.
              </p>
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                className="w-full px-4 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm"
                required
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Password
                </label>
                <span className="text-xs text-slate-500">{password.length}/16</span>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="8-16 chars with uppercase & symbol"
                maxLength={16}
                className="w-full px-4 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm"
                required
              />

              {/* Password Requirements Checklist */}
              <div className="grid grid-cols-3 gap-1.5 mt-2 text-[11px]">
                <div
                  className={`flex items-center gap-1 ${
                    isPasswordLength ? 'text-emerald-400 font-medium' : 'text-slate-500'
                  }`}
                >
                  <span className="text-xs">{isPasswordLength ? '✓' : '○'}</span>
                  <span>8-16 Chars</span>
                </div>
                <div
                  className={`flex items-center gap-1 ${
                    hasUppercase ? 'text-emerald-400 font-medium' : 'text-slate-500'
                  }`}
                >
                  <span className="text-xs">{hasUppercase ? '✓' : '○'}</span>
                  <span>1 Uppercase</span>
                </div>
                <div
                  className={`flex items-center gap-1 ${
                    hasSpecialChar ? 'text-emerald-400 font-medium' : 'text-slate-500'
                  }`}
                >
                  <span className="text-xs">{hasSpecialChar ? '✓' : '○'}</span>
                  <span>1 Special Char</span>
                </div>
              </div>
            </div>

            {/* Address */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Address
                </label>
                <span className="text-xs text-slate-500">{address.length}/400 max</span>
              </div>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Your residence or delivery street address"
                maxLength={400}
                rows={2}
                className="w-full px-4 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm resize-none"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold rounded-xl shadow-lg shadow-indigo-600/30 transition-all text-sm cursor-pointer mt-4"
            >
              <UserPlus className="w-4 h-4" />
              <span>{isLoading ? 'Creating account...' : 'Complete Registration'}</span>
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center text-xs text-slate-400">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-indigo-400 hover:text-indigo-300 font-semibold underline underline-offset-4"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
