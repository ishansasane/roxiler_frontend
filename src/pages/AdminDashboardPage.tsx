import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  fetchAdminStats,
  fetchAdminUsers,
  fetchAdminStores,
} from '../store/slices/adminSlice';
import { Navbar } from '../components/Navbar';
import { AddUserModal } from '../components/admin/AddUserModal';
import { AddStoreModal } from '../components/admin/AddStoreModal';
import { UserDetailModal } from '../components/admin/UserDetailModal';
import { StarRating } from '../components/StarRating';
import { SortIcon } from '../components/SortIcon';
import { Pagination } from '../components/Pagination';
import { User, Store } from '../types';
import {
  Users,
  Store as StoreIcon,
  Star,
  UserPlus,
  PlusCircle,
  Search,
  Filter,
  Eye,
  ArrowUpDown,
  RefreshCw,
  Loader2,
} from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { stats, users, stores, userPagination, storePagination, isLoading } =
    useAppSelector((state) => state.admin);

  // Active view tab: 'stores' or 'users'
  const [activeTab, setActiveTab] = useState<'stores' | 'users'>('stores');

  // Modals state
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isAddStoreOpen, setIsAddStoreOpen] = useState(false);
  const [selectedUserDetail, setSelectedUserDetail] = useState<User | null>(null);

  // Stores filters & sorting
  const [storeSearch, setStoreSearch] = useState('');
  const [storeFilterName, setStoreFilterName] = useState('');
  const [storeFilterEmail, setStoreFilterEmail] = useState('');
  const [storeFilterAddress, setStoreFilterAddress] = useState('');
  const [storeSortBy, setStoreSortBy] = useState('name');
  const [storeSortOrder, setStoreSortOrder] = useState<'asc' | 'desc'>('asc');
  const [storePage, setStorePage] = useState(1);

  // Users filters & sorting
  const [userSearch, setUserSearch] = useState('');
  const [userFilterName, setUserFilterName] = useState('');
  const [userFilterEmail, setUserFilterEmail] = useState('');
  const [userFilterAddress, setUserFilterAddress] = useState('');
  const [userFilterRole, setUserFilterRole] = useState('');
  const [userSortBy, setUserSortBy] = useState('name');
  const [userSortOrder, setUserSortOrder] = useState<'asc' | 'desc'>('asc');
  const [userPage, setUserPage] = useState(1);

  // Load stats on mount
  useEffect(() => {
    dispatch(fetchAdminStats());
  }, [dispatch]);

  // Load stores when store query params change
  useEffect(() => {
    dispatch(
      fetchAdminStores({
        search: storeSearch,
        name: storeFilterName,
        email: storeFilterEmail,
        address: storeFilterAddress,
        sortBy: storeSortBy,
        sortOrder: storeSortOrder,
        page: storePage,
        limit: 10,
      })
    );
  }, [
    dispatch,
    storeSearch,
    storeFilterName,
    storeFilterEmail,
    storeFilterAddress,
    storeSortBy,
    storeSortOrder,
    storePage,
  ]);

  // Load users when user query params change
  useEffect(() => {
    dispatch(
      fetchAdminUsers({
        search: userSearch,
        name: userFilterName,
        email: userFilterEmail,
        address: userFilterAddress,
        role: userFilterRole,
        sortBy: userSortBy,
        sortOrder: userSortOrder,
        page: userPage,
        limit: 10,
      })
    );
  }, [
    dispatch,
    userSearch,
    userFilterName,
    userFilterEmail,
    userFilterAddress,
    userFilterRole,
    userSortBy,
    userSortOrder,
    userPage,
  ]);

  const handleStoreSort = (field: string) => {
    if (storeSortBy === field) {
      setStoreSortOrder(storeSortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setStoreSortBy(field);
      setStoreSortOrder('asc');
    }
  };

  const handleUserSort = (field: string) => {
    if (userSortBy === field) {
      setUserSortOrder(userSortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setUserSortBy(field);
      setUserSortOrder('asc');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Top Header & Quick Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Administrator Dashboard
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Manage system users, registered stores, and platform ratings
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsAddStoreOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl shadow-lg shadow-indigo-600/25 transition-all text-sm cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add New Store</span>
            </button>

            <button
              onClick={() => setIsAddUserOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-medium rounded-xl transition-all text-sm cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>Add New User</span>
            </button>
          </div>
        </div>

        {/* 3 Main Summary Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1: Total Users */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden group hover:border-slate-700 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Total Platform Users
                </p>
                <h3 className="text-3xl sm:text-4xl font-extrabold text-white mt-2">
                  {stats?.totalUsers ?? '...'}
                </h3>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <Users className="w-6 h-6" />
              </div>
            </div>
            {stats && (
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center gap-3 text-xs text-slate-400">
                <span>{stats.rolesBreakdown.USER} Normal</span>
                <span>•</span>
                <span>{stats.rolesBreakdown.STORE_OWNER} Owners</span>
                <span>•</span>
                <span>{stats.rolesBreakdown.ADMIN} Admins</span>
              </div>
            )}
          </div>

          {/* Card 2: Total Stores */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden group hover:border-slate-700 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Total Registered Stores
                </p>
                <h3 className="text-3xl sm:text-4xl font-extrabold text-white mt-2">
                  {stats?.totalStores ?? '...'}
                </h3>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <StoreIcon className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800/80 text-xs text-slate-400">
              Verified business storefronts
            </div>
          </div>

          {/* Card 3: Total Submitted Ratings */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden group hover:border-slate-700 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Submitted Ratings
                </p>
                <h3 className="text-3xl sm:text-4xl font-extrabold text-white mt-2">
                  {stats?.totalRatings ?? '...'}
                </h3>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Star className="w-6 h-6 fill-emerald-400" />
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800/80 text-xs text-slate-400">
              User submitted ratings (1 - 5 stars)
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-slate-800">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('stores')}
              className={`pb-4 px-1 text-sm font-semibold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'stores'
                  ? 'border-indigo-500 text-indigo-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <StoreIcon className="w-4 h-4" />
              <span>Registered Stores Listing ({stores.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('users')}
              className={`pb-4 px-1 text-sm font-semibold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'users'
                  ? 'border-indigo-500 text-indigo-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Users Listing ({users.length})</span>
            </button>
          </div>
        </div>

        {/* TAB 1: STORES LISTING */}
        {activeTab === 'stores' && (
          <div className="space-y-4">
            {/* Store Filters */}
            <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-2xl">
              <div className="flex items-center gap-2 mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">
                <Filter className="w-3.5 h-3.5" />
                <span>Filters & Search</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div>
                  <input
                    type="text"
                    placeholder="Search by Name or Address..."
                    value={storeSearch}
                    onChange={(e) => {
                      setStoreSearch(e.target.value);
                      setStorePage(1);
                    }}
                    className="w-full px-3 py-2 bg-slate-800/90 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Filter by Name..."
                    value={storeFilterName}
                    onChange={(e) => {
                      setStoreFilterName(e.target.value);
                      setStorePage(1);
                    }}
                    className="w-full px-3 py-2 bg-slate-800/90 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Filter by Email..."
                    value={storeFilterEmail}
                    onChange={(e) => {
                      setStoreFilterEmail(e.target.value);
                      setStorePage(1);
                    }}
                    className="w-full px-3 py-2 bg-slate-800/90 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Filter by Address..."
                    value={storeFilterAddress}
                    onChange={(e) => {
                      setStoreFilterAddress(e.target.value);
                      setStorePage(1);
                    }}
                    className="w-full px-3 py-2 bg-slate-800/90 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>

            {/* Stores Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-300">
                  <thead className="bg-slate-850/80 text-xs uppercase tracking-wider text-slate-400 border-b border-slate-800">
                    <tr>
                      <th
                        onClick={() => handleStoreSort('name')}
                        className="py-3.5 px-4 cursor-pointer hover:text-white transition-colors"
                      >
                        Store Name <SortIcon field="name" currentSortBy={storeSortBy} currentSortOrder={storeSortOrder} />
                      </th>
                      <th
                        onClick={() => handleStoreSort('email')}
                        className="py-3.5 px-4 cursor-pointer hover:text-white transition-colors"
                      >
                        Email <SortIcon field="email" currentSortBy={storeSortBy} currentSortOrder={storeSortOrder} />
                      </th>
                      <th
                        onClick={() => handleStoreSort('address')}
                        className="py-3.5 px-4 cursor-pointer hover:text-white transition-colors"
                      >
                        Address <SortIcon field="address" currentSortBy={storeSortBy} currentSortOrder={storeSortOrder} />
                      </th>
                      <th
                        onClick={() => handleStoreSort('overallRating')}
                        className="py-3.5 px-4 cursor-pointer hover:text-white transition-colors"
                      >
                        Rating <SortIcon field="overallRating" currentSortBy={storeSortBy} currentSortOrder={storeSortOrder} />
                      </th>
                      <th className="py-3.5 px-4">Assigned Owner</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {isLoading ? (
                      <tr>
                        <td colSpan={5} className="py-12 text-center text-slate-400">
                          <div className="flex flex-col items-center justify-center gap-2">
                            <Loader2 className="w-6 h-6 animate-spin text-indigo-400" />
                            <span className="text-sm font-medium">Loading registered stores...</span>
                          </div>
                        </td>
                      </tr>
                    ) : stores.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-slate-500">
                          No stores found matching your filters.
                        </td>
                      </tr>
                    ) : (
                      stores.map((store) => (
                        <tr key={store.id} className="hover:bg-slate-800/40 transition-colors">
                          <td className="py-4 px-4 font-semibold text-white">
                            {store.name}
                          </td>
                          <td className="py-4 px-4 text-slate-300">{store.email}</td>
                          <td className="py-4 px-4 text-slate-400 max-w-xs truncate" title={store.address}>
                            {store.address}
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-2">
                              <StarRating rating={store.overallRating} size="sm" />
                              <span className="font-bold text-amber-300 text-xs">
                                {store.overallRating > 0 ? store.overallRating.toFixed(1) : 'No ratings'}
                              </span>
                              <span className="text-[11px] text-slate-500">
                                ({store.totalRatings})
                              </span>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-slate-400 text-xs">
                            {store.owner ? (
                              <span className="font-medium text-slate-300">
                                {store.owner.name}
                              </span>
                            ) : (
                              <span className="text-slate-600 italic">Unassigned</span>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Stores Pagination */}
              <div className="p-4 border-t border-slate-800">
                <Pagination pagination={storePagination} onPageChange={(p) => setStorePage(p)} />
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: USERS LISTING */}
        {activeTab === 'users' && (
          <div className="space-y-4">
            {/* User Filters */}
            <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-2xl">
              <div className="flex items-center gap-2 mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">
                <Filter className="w-3.5 h-3.5" />
                <span>Filters & Search</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                <div>
                  <input
                    type="text"
                    placeholder="Search Name/Email/Address..."
                    value={userSearch}
                    onChange={(e) => {
                      setUserSearch(e.target.value);
                      setUserPage(1);
                    }}
                    className="w-full px-3 py-2 bg-slate-800/90 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Filter by Name..."
                    value={userFilterName}
                    onChange={(e) => {
                      setUserFilterName(e.target.value);
                      setUserPage(1);
                    }}
                    className="w-full px-3 py-2 bg-slate-800/90 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Filter by Email..."
                    value={userFilterEmail}
                    onChange={(e) => {
                      setUserFilterEmail(e.target.value);
                      setUserPage(1);
                    }}
                    className="w-full px-3 py-2 bg-slate-800/90 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Filter by Address..."
                    value={userFilterAddress}
                    onChange={(e) => {
                      setUserFilterAddress(e.target.value);
                      setUserPage(1);
                    }}
                    className="w-full px-3 py-2 bg-slate-800/90 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <select
                    value={userFilterRole}
                    onChange={(e) => {
                      setUserFilterRole(e.target.value);
                      setUserPage(1);
                    }}
                    className="w-full px-3 py-2 bg-slate-800/90 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="">All Roles</option>
                    <option value="ADMIN">Admin Only</option>
                    <option value="USER">Normal User Only</option>
                    <option value="STORE_OWNER">Store Owner Only</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Users Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-300">
                  <thead className="bg-slate-850/80 text-xs uppercase tracking-wider text-slate-400 border-b border-slate-800">
                    <tr>
                      <th
                        onClick={() => handleUserSort('name')}
                        className="py-3.5 px-4 cursor-pointer hover:text-white transition-colors"
                      >
                        User Name <SortIcon field="name" currentSortBy={userSortBy} currentSortOrder={userSortOrder} />
                      </th>
                      <th
                        onClick={() => handleUserSort('email')}
                        className="py-3.5 px-4 cursor-pointer hover:text-white transition-colors"
                      >
                        Email <SortIcon field="email" currentSortBy={userSortBy} currentSortOrder={userSortOrder} />
                      </th>
                      <th
                        onClick={() => handleUserSort('address')}
                        className="py-3.5 px-4 cursor-pointer hover:text-white transition-colors"
                      >
                        Address <SortIcon field="address" currentSortBy={userSortBy} currentSortOrder={userSortOrder} />
                      </th>
                      <th
                        onClick={() => handleUserSort('role')}
                        className="py-3.5 px-4 cursor-pointer hover:text-white transition-colors"
                      >
                        Role <SortIcon field="role" currentSortBy={userSortBy} currentSortOrder={userSortOrder} />
                      </th>
                      <th
                        onClick={() => handleUserSort('storeRating')}
                        className="py-3.5 px-4 cursor-pointer hover:text-white transition-colors"
                      >
                        Store Rating <SortIcon field="storeRating" currentSortBy={userSortBy} currentSortOrder={userSortOrder} />
                      </th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {isLoading ? (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-slate-400">
                          <div className="flex flex-col items-center justify-center gap-2">
                            <Loader2 className="w-6 h-6 animate-spin text-indigo-400" />
                            <span className="text-sm font-medium">Loading platform users...</span>
                          </div>
                        </td>
                      </tr>
                    ) : users.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-slate-500">
                          No users found matching your filters.
                        </td>
                      </tr>
                    ) : (
                      users.map((u) => (
                        <tr key={u.id} className="hover:bg-slate-800/40 transition-colors">
                          <td className="py-4 px-4 font-semibold text-white">
                            {u.name}
                          </td>
                          <td className="py-4 px-4 text-slate-300">{u.email}</td>
                          <td className="py-4 px-4 text-slate-400 max-w-xs truncate" title={u.address}>
                            {u.address}
                          </td>
                          <td className="py-4 px-4">
                            <span
                              className={`inline-block px-2.5 py-0.5 text-xs font-semibold rounded-md border ${
                                u.role === 'ADMIN'
                                  ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                                  : u.role === 'STORE_OWNER'
                                  ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                  : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                              }`}
                            >
                              {u.role === 'ADMIN'
                                ? 'Admin'
                                : u.role === 'STORE_OWNER'
                                ? 'Store Owner'
                                : 'Normal User'}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            {u.role === 'STORE_OWNER' ? (
                              u.storeRating !== null && u.storeRating !== undefined ? (
                                <div className="flex items-center gap-1.5">
                                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                                  <span className="font-bold text-amber-300 text-xs">
                                    {u.storeRating > 0 ? u.storeRating.toFixed(1) : '0.0'}
                                  </span>
                                  {u.storeName && (
                                    <span className="text-[11px] text-slate-500">
                                      ({u.storeName})
                                    </span>
                                  )}
                                </div>
                              ) : (
                                <span className="text-slate-600 text-xs italic">
                                  No Store Assigned
                                </span>
                              )
                            ) : (
                              <span className="text-slate-600 text-xs">—</span>
                            )}
                          </td>
                          <td className="py-4 px-4 text-right">
                            <button
                              onClick={() => setSelectedUserDetail(u)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-indigo-300 hover:text-white bg-indigo-950/40 hover:bg-indigo-900/60 border border-indigo-800/40 rounded-lg transition-all cursor-pointer"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>View Details</span>
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Users Pagination */}
              <div className="p-4 border-t border-slate-800">
                <Pagination pagination={userPagination} onPageChange={(p) => setUserPage(p)} />
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Modals */}
      <AddUserModal isOpen={isAddUserOpen} onClose={() => setIsAddUserOpen(false)} />
      <AddStoreModal isOpen={isAddStoreOpen} onClose={() => setIsAddStoreOpen(false)} />
      <UserDetailModal
        isOpen={Boolean(selectedUserDetail)}
        onClose={() => setSelectedUserDetail(null)}
        user={selectedUserDetail}
      />
    </div>
  );
};
