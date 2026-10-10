import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { logout } from '../store/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import { Store, LogOut, KeyRound, User as UserIcon, Shield, Store as StoreIcon } from 'lucide-react';
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
    switch (role) {
      case 'ADMIN':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <Shield className="w-3 h-3" /> Admin
          </span>
        );
      case 'STORE_OWNER':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <StoreIcon className="w-3 h-3" /> Store Owner
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <UserIcon className="w-3 h-3" /> User
          </span>
        );
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-900/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Store className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-300 bg-clip-text text-transparent">
                RateHub
              </span>
              <span className="text-xs text-indigo-400 font-medium block -mt-1">
                Store Rating Platform
              </span>
            </div>
          </div>

          {/* User profile & actions */}
          {user && (
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="hidden sm:flex flex-col items-end">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-slate-200 truncate max-w-[200px]" title={user.name}>
                    {user.name}
                  </span>
                  {getRoleBadge(user.role)}
                </div>
                <span className="text-xs text-slate-400 truncate max-w-[200px]">
                  {user.email}
                </span>
              </div>

              <div className="flex items-center gap-2 border-l border-slate-800 pl-3">
                <button
                  onClick={() => setIsPasswordModalOpen(true)}
                  title="Update Password"
                  className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-750 border border-slate-700/80 rounded-xl transition-all"
                >
                  <KeyRound className="w-3.5 h-3.5 text-slate-400" />
                  <span className="hidden md:inline">Password</span>
                </button>

                <button
                  onClick={handleLogout}
                  title="Log out"
                  className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-rose-300 hover:text-white bg-rose-950/30 hover:bg-rose-900/50 border border-rose-800/40 rounded-xl transition-all"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Password Modal */}
      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
      />
    </>
  );
};
