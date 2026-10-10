export type UserRole = 'ADMIN' | 'USER' | 'STORE_OWNER';

export interface User {
  id: number;
  name: string;
  email: string;
  address: string;
  role: UserRole;
  storeRating?: number | null;
  storeName?: string | null;
  storeId?: number | null;
  createdAt: string;
  store?: StoreSummary | null;
}

export interface StoreSummary {
  id: number;
  name: string;
  email: string;
  address: string;
  averageRating: number;
  totalRatings: number;
}

export interface Store {
  id: number;
  name: string;
  email: string;
  address: string;
  overallRating: number;
  totalRatings: number;
  userSubmittedRating?: number | null;
  owner?: {
    id: number;
    name: string;
    email: string;
  } | null;
  createdAt: string;
}

export interface OwnerRatingItem {
  id: number;
  rating: number;
  createdAt: string;
  updatedAt: string;
  userId: number;
  userName: string;
  userEmail: string;
  userAddress: string;
}

export interface AdminStats {
  totalUsers: number;
  totalStores: number;
  totalRatings: number;
  rolesBreakdown: {
    ADMIN: number;
    USER: number;
    STORE_OWNER: number;
  };
  recentStores: Array<{
    id: number;
    name: string;
    email: string;
    address: string;
    rating: number;
    ratingsCount: number;
    owner?: { name: string; email: string } | null;
    createdAt: string;
  }>;
  recentRatings: Array<{
    id: number;
    rating: number;
    userId: number;
    storeId: number;
    createdAt: string;
    user: { id: number; name: string; email: string };
    store: { id: number; name: string };
  }>;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
