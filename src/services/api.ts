// Connect directly to deployed Render backend by default, or use VITE_API_URL if specified
const API_BASE = import.meta.env.VITE_API_URL || 'https://roxiler-backend-gq1t.onrender.com';
const BASE_URL = `${API_BASE.replace(/\/+$/, '')}/api`;

let activeRequests = 0;
const listeners = new Set<(activeCount: number) => void>();

export function subscribeToApiLoading(listener: (activeCount: number) => void) {
  listeners.add(listener);
  listener(activeRequests);
  return () => {
    listeners.delete(listener);
  };
}

function notifyLoading() {
  listeners.forEach((listener) => listener(activeRequests));
}

interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | undefined | null>;
}

export async function apiRequest<T = any>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { params, headers = {}, ...rest } = options;

  let url = `${BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, String(value));
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      url += `?${queryString}`;
    }
  }

  const token = localStorage.getItem('token');
  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  console.log(`[API Request] ${options.method || 'GET'} -> ${url}`);

  activeRequests++;
  notifyLoading();

  try {
    const response = await fetch(url, {
      headers: {
        ...defaultHeaders,
        ...headers,
      },
      ...rest,
    });

    const data = await response.json().catch(() => ({ success: false, message: 'Server communication error' }));

    if (!response.ok || data.success === false) {
      const errorMsg = data.message || `HTTP ${response.status}: Request failed`;
      const err: any = new Error(errorMsg);
      err.status = response.status;
      err.errors = data.errors;
      throw err;
    }

    return data;
  } finally {
    activeRequests = Math.max(0, activeRequests - 1);
    notifyLoading();
  }
}
