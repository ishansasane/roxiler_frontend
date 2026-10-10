import React, { useState } from 'react';
import { Modal } from '../Modal';
import { useAppDispatch } from '../../store/hooks';
import { createAdminUser, fetchAdminUsers, fetchAdminStats, fetchAvailableOwners } from '../../store/slices/adminSlice';
import { UserRole } from '../../types';
import { UserPlus, AlertCircle, CheckCircle2 } from 'lucide-react';

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddUserModal: React.FC<AddUserModalProps> = ({ isOpen, onClose }) => {
  const dispatch = useAppDispatch();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('USER');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Validation
    if (name.length < 20 || name.length > 60) {
      setError('Name must be between 20 and 60 characters long');
      return;
    }

    if (address.length > 400) {
      setError('Address cannot exceed 400 characters');
      return;
    }

    if (password.length < 8 || password.length > 16) {
      setError('Password must be between 8 and 16 characters');
      return;
    }

    if (!/[A-Z]/.test(password)) {
      setError('Password must include at least one uppercase letter');
      return;
    }

    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      setError('Password must include at least one special character');
      return;
    }

    setLoading(true);
    try {
      const resultAction = await dispatch(
        createAdminUser({ name, email, address, password, role })
      );

      if (createAdminUser.fulfilled.match(resultAction)) {
        setSuccess('User created successfully!');
        setName('');
        setEmail('');
        setAddress('');
        setPassword('');
        setRole('USER');
        dispatch(fetchAdminUsers());
        dispatch(fetchAdminStats());
        dispatch(fetchAvailableOwners());
        setTimeout(() => {
          setSuccess(null);
          onClose();
        }, 1200);
      } else {
        setError((resultAction.payload as string) || 'Failed to create user');
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New User" maxWidth="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-950/50 border border-red-800 text-red-200 text-sm rounded-xl">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="flex items-center gap-2 p-3 bg-emerald-950/50 border border-emerald-800 text-emerald-200 text-sm rounded-xl">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{success}</span>
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
            Full Name <span className="text-indigo-400 font-normal">({name.length}/60 chars - min 20)</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Jonathan Alexander Higgins (min 20 chars)"
            maxLength={60}
            className="w-full px-3.5 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
            Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="user@example.com"
            className="w-full px-3.5 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
            User Role
          </label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as UserRole)}
            className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm"
          >
            <option value="USER">Normal User</option>
            <option value="ADMIN">System Administrator</option>
            <option value="STORE_OWNER">Store Owner</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
            Password <span className="text-slate-500 font-normal">(8-16 chars, 1 uppercase, 1 special)</span>
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="e.g. Secret@2026"
            className="w-full px-3.5 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
            Address <span className="text-slate-500 font-normal">({address.length}/400 max)</span>
          </label>
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Physical residence or office address"
            maxLength={400}
            rows={2}
            className="w-full px-3.5 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm resize-none"
            required
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-medium rounded-xl shadow-lg shadow-indigo-600/30 transition-all text-sm"
          >
            <UserPlus className="w-4 h-4" />
            <span>{loading ? 'Adding...' : 'Create User'}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
