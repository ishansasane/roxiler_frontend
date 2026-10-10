import React, { useState, useEffect } from 'react';
import { Modal } from '../Modal';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { createAdminStore, fetchAdminStores, fetchAdminStats, fetchAvailableOwners } from '../../store/slices/adminSlice';
import { Store as StoreIcon, AlertCircle, CheckCircle2 } from 'lucide-react';

interface AddStoreModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddStoreModal: React.FC<AddStoreModalProps> = ({ isOpen, onClose }) => {
  const dispatch = useAppDispatch();
  const { availableOwners } = useAppSelector((state) => state.admin);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [ownerId, setOwnerId] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      dispatch(fetchAvailableOwners());
    }
  }, [isOpen, dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (name.length < 20 || name.length > 60) {
      setError('Store Name must be between 20 and 60 characters long');
      return;
    }

    if (address.length > 400) {
      setError('Address cannot exceed 400 characters');
      return;
    }

    setLoading(true);
    try {
      const selectedOwner = ownerId ? parseInt(ownerId, 10) : null;
      const resultAction = await dispatch(
        createAdminStore({
          name,
          email,
          address,
          ownerId: selectedOwner,
        })
      );

      if (createAdminStore.fulfilled.match(resultAction)) {
        setSuccess('Store created successfully!');
        setName('');
        setEmail('');
        setAddress('');
        setOwnerId('');
        dispatch(fetchAdminStores());
        dispatch(fetchAdminStats());
        dispatch(fetchAvailableOwners());
        setTimeout(() => {
          setSuccess(null);
          onClose();
        }, 1200);
      } else {
        setError((resultAction.payload as string) || 'Failed to create store');
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Store" maxWidth="lg">
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
            Store Name <span className="text-indigo-400 font-normal">({name.length}/60 chars - min 20)</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Downtown Organic Supermarket (min 20 chars)"
            maxLength={60}
            className="w-full px-3.5 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
            Store Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="store@example.com"
            className="w-full px-3.5 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
            Assign Store Owner <span className="text-slate-500 font-normal">(Optional)</span>
          </label>
          <select
            value={ownerId}
            onChange={(e) => setOwnerId(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm"
          >
            <option value="">-- No Owner Assigned --</option>
            {availableOwners.map((owner) => (
              <option key={owner.id} value={owner.id}>
                {owner.name} ({owner.email})
              </option>
            ))}
          </select>
          {availableOwners.length === 0 && (
            <p className="text-xs text-slate-500 mt-1">
              Tip: To assign an owner, first create a user with the Store Owner role.
            </p>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
            Store Address <span className="text-slate-500 font-normal">({address.length}/400 max)</span>
          </label>
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Full physical street address of the store"
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
            <StoreIcon className="w-4 h-4" />
            <span>{loading ? 'Adding...' : 'Register Store'}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
