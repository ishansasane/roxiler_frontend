import React from 'react';
import { Modal } from '../Modal';
import { User } from '../../types';
import { StarRating } from '../StarRating';
import { User as UserIcon, Mail, MapPin, Shield, Store, Calendar } from 'lucide-react';

interface UserDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
}

export const UserDetailModal: React.FC<UserDetailModalProps> = ({ isOpen, onClose, user }) => {
  if (!user) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="User Details" maxWidth="md">
      <div className="space-y-4">
        {/* Header with avatar & role */}
        <div className="flex items-center gap-3 p-3.5 bg-slate-800/60 rounded-xl border border-slate-700/60">
          <div className="w-12 h-12 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-bold text-lg">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h4 className="font-semibold text-white text-base leading-snug">{user.name}</h4>
            <span
              className={`inline-block mt-0.5 px-2 py-0.5 text-xs font-semibold rounded-md border ${
                user.role === 'ADMIN'
                  ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                  : user.role === 'STORE_OWNER'
                  ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                  : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
              }`}
            >
              {user.role === 'ADMIN' ? 'System Administrator' : user.role === 'STORE_OWNER' ? 'Store Owner' : 'Normal User'}
            </span>
          </div>
        </div>

        {/* Contact & Details */}
        <div className="space-y-3 text-sm">
          <div className="flex items-start gap-3 p-3 bg-slate-800/30 rounded-xl border border-slate-800">
            <Mail className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">Email Address</div>
              <div className="text-slate-200 break-all">{user.email}</div>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-slate-800/30 rounded-xl border border-slate-800">
            <MapPin className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">Address</div>
              <div className="text-slate-200">{user.address}</div>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-slate-800/30 rounded-xl border border-slate-800">
            <Calendar className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">Joined Platform</div>
              <div className="text-slate-300">
                {new Date(user.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </div>
            </div>
          </div>

          {/* Store Owner specific section */}
          {user.role === 'STORE_OWNER' && (
            <div className="p-4 bg-amber-500/5 rounded-xl border border-amber-500/20">
              <div className="flex items-center gap-2 mb-2">
                <Store className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                  Store Owner Information & Rating
                </span>
              </div>

              {user.storeName ? (
                <div className="space-y-2 mt-2 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Store Name:</span>
                    <span className="font-semibold text-slate-200">{user.storeName}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Store Overall Rating:</span>
                    <div className="flex items-center gap-2">
                      <StarRating rating={user.storeRating || 0} size="sm" />
                      <span className="font-bold text-amber-300">
                        {user.storeRating ? user.storeRating.toFixed(1) : 'No ratings yet'}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic mt-1">
                  This user has not been assigned to any registered store yet.
                </p>
              )}
            </div>
          )}
        </div>

        <div className="flex justify-end pt-3 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium rounded-xl transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};
