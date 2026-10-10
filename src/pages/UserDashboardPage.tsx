import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchUserStores } from '../store/slices/storeSlice';
import { Navbar } from '../components/Navbar';
import { StarRating } from '../components/StarRating';
import { RateStoreModal } from '../components/user/RateStoreModal';
import { Pagination } from '../components/Pagination';
import { Store } from '../types';
import {
  Search,
  Store as StoreIcon,
  Star,
  MapPin,
  Mail,
  Edit3,
  PlusCircle,
  SlidersHorizontal,
  ArrowUpDown,
  CheckCircle2,
} from 'lucide-react';

export const UserDashboardPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { stores, pagination, isLoading } = useAppSelector((state) => state.stores);

  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState(1);

  // Selected store for rating modal
  const [selectedStoreForRating, setSelectedStoreForRating] = useState<Store | null>(null);

  useEffect(() => {
    dispatch(
      fetchUserStores({
        search,
        sortBy,
        sortOrder,
        page,
        limit: 12,
      })
    );
  }, [dispatch, search, sortBy, sortOrder, page]);

  const handleRatingClick = (store: Store) => {
    setSelectedStoreForRating(store);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Browse Registered Stores
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Discover stores, explore community ratings, and share your own feedback
            </p>
          </div>

          {/* Search bar & Sort Controls */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative min-w-[280px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by Store Name or Address..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-inner"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [newSortBy, newSortOrder] = e.target.value.split('-');
                  setSortBy(newSortBy);
                  setSortOrder(newSortOrder as 'asc' | 'desc');
                  setPage(1);
                }}
                className="px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="name-asc">Sort by: Name (A-Z)</option>
                <option value="name-desc">Sort by: Name (Z-A)</option>
                <option value="overallRating-desc">Sort by: Highest Rated</option>
                <option value="overallRating-asc">Sort by: Lowest Rated</option>
              </select>
            </div>
          </div>
        </div>

        {/* Store Grid */}
        {stores.length === 0 ? (
          <div className="text-center py-16 bg-slate-900/40 border border-slate-800 rounded-3xl">
            <StoreIcon className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-slate-300">No stores found</h3>
            <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
              We couldn't find any registered stores matching your search query. Try searching for a different name or address.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stores.map((store) => {
              const hasRated = store.userSubmittedRating !== null && store.userSubmittedRating !== undefined;

              return (
                <div
                  key={store.id}
                  className="bg-slate-900/90 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-6 shadow-xl flex flex-col justify-between transition-all group"
                >
                  <div>
                    {/* Header: Store Name & Category/Icon */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
                        <StoreIcon className="w-5 h-5" />
                      </div>

                      {hasRated ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Rated: {store.userSubmittedRating} ★</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-800 text-slate-400 border border-slate-700">
                          Not Rated Yet
                        </span>
                      )}
                    </div>

                    <h3 className="text-lg font-bold text-white tracking-tight group-hover:text-indigo-300 transition-colors line-clamp-2">
                      {store.name}
                    </h3>

                    {/* Address & Email */}
                    <div className="mt-3 space-y-2 text-xs text-slate-400">
                      <div className="flex items-start gap-2">
                        <MapPin className="w-3.5 h-3.5 text-slate-500 mt-0.5 shrink-0" />
                        <span className="line-clamp-2">{store.address}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span className="truncate">{store.email}</span>
                      </div>
                    </div>

                    {/* Overall Rating Block */}
                    <div className="mt-5 p-3 bg-slate-850/80 rounded-xl border border-slate-800/80 flex items-center justify-between">
                      <div>
                        <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                          Overall Rating
                        </div>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className="text-xl font-black text-amber-300">
                            {store.overallRating > 0 ? store.overallRating.toFixed(1) : '—'}
                          </span>
                          <span className="text-xs text-slate-500">/ 5.0</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <StarRating rating={store.overallRating} size="sm" />
                        <span className="text-[11px] text-slate-500 block mt-1">
                          {store.totalRatings} {store.totalRatings === 1 ? 'rating' : 'ratings'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Rating Actions */}
                  <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between gap-3">
                    {hasRated ? (
                      <button
                        onClick={() => handleRatingClick(store)}
                        className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-800 hover:bg-slate-750 text-amber-300 border border-amber-500/30 hover:border-amber-500/50 rounded-xl text-xs font-semibold transition-all cursor-pointer shadow-sm"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Modify My Rating ({store.userSubmittedRating} ★)</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => handleRatingClick(store)}
                        className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/20 transition-all cursor-pointer"
                      >
                        <Star className="w-3.5 h-3.5 fill-white" />
                        <span>Submit Rating (1 - 5)</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        <Pagination pagination={pagination} onPageChange={(p) => setPage(p)} />
      </main>

      {/* Rate Store Modal */}
      <RateStoreModal
        isOpen={Boolean(selectedStoreForRating)}
        onClose={() => setSelectedStoreForRating(null)}
        store={selectedStoreForRating}
      />
    </div>
  );
};
