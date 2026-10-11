
import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { logout } from '../store/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import {
  Store,
  LogOut,
  KeyRound,
  User as UserIcon,
  Shield,
  Store as StoreIcon,
} from 'lucide-react';
import { ChangePasswordModal } from './ChangePasswordModal';

export const Navbar: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const getRoleBadge = (role?: string) => {
    const badgeClass =
      'inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-xs font-medium';

    switch (role) {
      case 'ADMIN':
        return (
          <span className={`${badgeClass} border-rose-500/20 bg-rose-500/10 text-rose-300`}>
            <Shield size={12} />
            Admin
          </span>
        );

      case 'STORE_OWNER':
        return (
          <span className={`${badgeClass} border-amber-500/20 bg-amber-500/10 text-amber-300`}>
            <StoreIcon size={12} />
            Store Owner
          </span>
        );

      default:
        return (
          <span className={`${badgeClass} border-indigo-500/20 bg-indigo-500/10 text-indigo-300`}>
            <UserIcon size={12} />
            User
          </span>
        );
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-[#30333b] bg-[#191c22]">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

          {/* Brand */}
          <div className="flex shrink-0 items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white">
              <Store size={20} />
            </div>

            <div>
              <span className="text-lg font-semibold tracking-tight text-white">
                RateHub
              </span>
              <span className="hidden text-xs text-slate-400 sm:block">
                Store Rating Platform
              </span>
            </div>
          </div>

          {/* User information and actions */}
          {user && (
            <div className="flex min-w-0 items-center gap-3 sm:gap-5">
              <div className="hidden min-w-0 items-center gap-3 sm:flex">
                <div className="min-w-0 text-right">
                  <p
                    className="truncate text-sm font-medium text-slate-200"
                    title={user.name}
                  >
                    {user.name}
                  </p>
                  <p
                    className="max-w-[220px] truncate text-xs text-slate-400"
                    title={user.email}
                  >
                    {user.email}
                  </p>
                </div>

                {getRoleBadge(user.role)}
              </div>

              <div className="flex items-center gap-2 border-l border-[#30333b] pl-3 sm:pl-4">
                <button
                  type="button"
                  onClick={() => setIsPasswordModalOpen(true)}
                  title="Change password"
                  aria-label="Change password"
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#3a3e48] bg-[#20242c] px-3 py-2 text-sm font-medium text-slate-300 transition hover:border-slate-500 hover:bg-[#282d36] hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                >
                  <KeyRound size={15} />
                  <span className="hidden md:inline">Password</span>
                </button>

                <button
                  type="button"
                  onClick={handleLogout}
                  title="Log out"
                  aria-label="Log out"
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-rose-500/20 bg-rose-500/5 px-3 py-2 text-sm font-medium text-rose-300 transition hover:border-rose-500/40 hover:bg-rose-500/15 hover:text-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-500/30"
                >
                  <LogOut size={15} />
                  <span className="hidden md:inline">Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
      />
    </>
  );
};
