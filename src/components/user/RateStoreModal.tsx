import React, { useState, useEffect } from 'react';
import { Modal } from '../Modal';
import { Store } from '../../types';
import { StarRating } from '../StarRating';
import { useAppDispatch } from '../../store/hooks';
import { submitUserRating, fetchUserStores } from '../../store/slices/storeSlice';
import { Star, AlertCircle, CheckCircle2 } from 'lucide-react';

interface RateStoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  store: Store | null;
}

export const RateStoreModal: React.FC<RateStoreModalProps> = ({ isOpen, onClose, store }) => {
  const dispatch = useAppDispatch();
  const [selectedRating, setSelectedRating] = useState<number>(5);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (store && store.userSubmittedRating) {
      setSelectedRating(store.userSubmittedRating);
    } else {
      setSelectedRating(5);
    }
    setError(null);
    setSuccess(null);
  }, [store, isOpen]);

  if (!store) return null;

  const isModifying = Boolean(store.userSubmittedRating);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedRating < 1 || selectedRating > 5) {
      setError('Rating must be between 1 and 5 stars');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const resultAction = await dispatch(
        submitUserRating({ storeId: store.id, rating: selectedRating })
      );

      if (submitUserRating.fulfilled.match(resultAction)) {
        setSuccess(isModifying ? 'Your rating has been updated!' : 'Thank you for submitting your rating!');
        setTimeout(() => {
          setSuccess(null);
          onClose();
        }, 1200);
      } else {
        setError((resultAction.payload as string) || 'Failed to submit rating');
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isModifying ? 'Modify Your Store Rating' : 'Submit Store Rating'}
      maxWidth="md"
    >
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

        {/* Store Summary Card */}
        <div className="p-4 bg-slate-850 rounded-xl border border-slate-800">
          <h4 className="font-semibold text-white text-base">{store.name}</h4>
          <p className="text-xs text-slate-400 mt-1">{store.address}</p>
          <div className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-800/80 text-xs">
            <span className="text-slate-400">Current Average:</span>
            <div className="flex items-center gap-1 font-bold text-amber-300">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{store.overallRating > 0 ? store.overallRating.toFixed(1) : 'No ratings'}</span>
            </div>
            <span className="text-slate-500">({store.totalRatings} ratings)</span>
          </div>
        </div>

        {/* Star Selection Area */}
        <div className="text-center py-4 bg-slate-800/40 rounded-xl border border-slate-800/80">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
            Select Your Rating (1 to 5 Stars)
          </label>

          <div className="flex justify-center mb-3">
            <StarRating
              rating={selectedRating}
              interactive={true}
              onRatingChange={(newVal) => setSelectedRating(newVal)}
              size="lg"
            />
          </div>

          <div className="text-sm font-semibold text-indigo-300">
            {selectedRating} out of 5 Stars
            {selectedRating === 5 && ' - Excellent! 🌟'}
            {selectedRating === 4 && ' - Very Good! 👍'}
            {selectedRating === 3 && ' - Average ⚖️'}
            {selectedRating === 2 && ' - Needs Improvement ⚠️'}
            {selectedRating === 1 && ' - Poor 👎'}
          </div>
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
            className="flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold rounded-xl shadow-lg shadow-amber-500/20 transition-all text-sm"
          >
            <Star className="w-4 h-4 fill-slate-950" />
            <span>{loading ? 'Submitting...' : isModifying ? 'Update Rating' : 'Submit Rating'}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
