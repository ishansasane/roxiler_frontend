import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchOwnerStoreRatings } from '../store/slices/ownerSlice';
import { Navbar } from '../components/Navbar';
import { StarRating } from '../components/StarRating';
import { SortIcon } from '../components/SortIcon';
import { Pagination } from '../components/Pagination';
import {
  Store,
  Star,
  Users,
  MapPin,
  Mail,
  Calendar,
  AlertCircle,
  Clock,
} from 'lucide-react';

export const StoreOwnerDashboardPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { store, ratings, pagination, isLoading, error } = useAppSelector(
    (state) => state.owner
  );

  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(
      fetchOwnerStoreRatings({
        sortBy,
        sortOrder,
        page,
        limit: 10,
      })
    );
  }, [dispatch, sortBy, sortOrder, page]);

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Store Owner Dashboard
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Monitor customer reviews, overall store performance, and rating trends
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-2.5 p-4 bg-amber-950/40 border border-amber-800 text-amber-200 text-sm rounded-2xl">
            <AlertCircle className="w-5 h-5 shrink-0 text-amber-400" />
            <div>
              <p className="font-semibold">{error}</p>
              <p className="text-xs text-amber-300/80 mt-0.5">
                If your account hasn't been assigned to a store yet, please contact a System Administrator.
              </p>
            </div>
          </div>
        )}

        {/* Store Overview Performance Card */}
        {store && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Store Information */}
            <div className="md:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-400 mb-2">
                  <Store className="w-4 h-4" />
                  <span>Your Registered Store</span>
                </div>
                <h2 className="text-2xl font-bold text-white tracking-tight">
                  {store.name}
                </h2>
                <div className="mt-3 space-y-2 text-sm text-slate-400">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-slate-500 mt-0.5 shrink-0" />
                    <span>{store.address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-slate-500 shrink-0" />
                    <span>{store.email}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-800 flex items-center gap-2 text-xs text-slate-400">
                <Users className="w-4 h-4 text-slate-500" />
                <span>{ratings.length} total customer submissions loaded</span>
              </div>
            </div>

            {/* Average Rating Big Metric */}
            <div className="bg-gradient-to-br from-slate-900 to-indigo-950/40 border border-indigo-900/30 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Store Average Rating
                </span>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-5xl font-black text-amber-300">
                    {store.averageRating > 0 ? store.averageRating.toFixed(2) : '0.00'}
                  </span>
                  <span className="text-sm text-slate-400 font-medium">/ 5.00</span>
                </div>
                <div className="mt-2">
                  <StarRating rating={store.averageRating} size="md" />
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-indigo-900/30 flex items-center justify-between text-xs text-slate-400">
                <span>Total Feedback:</span>
                <span className="font-bold text-slate-200">
                  {store.totalRatings} {store.totalRatings === 1 ? 'Rating' : 'Ratings'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Customer Ratings Table */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">
                Users Who Submitted Ratings
              </h3>
              <p className="text-xs text-slate-400">
                Review specific ratings given by customers, including user details and submission date
              </p>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="bg-slate-850/80 text-xs uppercase tracking-wider text-slate-400 border-b border-slate-800">
                  <tr>
                    <th
                      onClick={() => handleSort('userName')}
                      className="py-3.5 px-4 cursor-pointer hover:text-white transition-colors"
                    >
                      Customer Name <SortIcon field="userName" currentSortBy={sortBy} currentSortOrder={sortOrder} />
                    </th>
                    <th
                      onClick={() => handleSort('userEmail')}
                      className="py-3.5 px-4 cursor-pointer hover:text-white transition-colors"
                    >
                      Email Address <SortIcon field="userEmail" currentSortBy={sortBy} currentSortOrder={sortOrder} />
                    </th>
                    <th className="py-3.5 px-4">Customer Address</th>
                    <th
                      onClick={() => handleSort('rating')}
                      className="py-3.5 px-4 cursor-pointer hover:text-white transition-colors"
                    >
                      Rating Given <SortIcon field="rating" currentSortBy={sortBy} currentSortOrder={sortOrder} />
                    </th>
                    <th
                      onClick={() => handleSort('createdAt')}
                      className="py-3.5 px-4 cursor-pointer hover:text-white transition-colors"
                    >
                      Submitted At <SortIcon field="createdAt" currentSortBy={sortBy} currentSortOrder={sortOrder} />
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {ratings.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-slate-500">
                        No customer ratings have been submitted for your store yet.
                      </td>
                    </tr>
                  ) : (
                    ratings.map((r) => (
                      <tr key={r.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-4 px-4 font-semibold text-white">
                          {r.userName}
                        </td>
                        <td className="py-4 px-4 text-slate-300">{r.userEmail}</td>
                        <td className="py-4 px-4 text-slate-400 max-w-xs truncate" title={r.userAddress}>
                          {r.userAddress}
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <StarRating rating={r.rating} size="sm" />
                            <span className="font-bold text-amber-300 text-xs">
                              {r.rating} ★
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-slate-400 text-xs">
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-slate-500" />
                            <span>
                              {new Date(r.createdAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })}
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="p-4 border-t border-slate-800">
              <Pagination pagination={pagination} onPageChange={(p) => setPage(p)} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
