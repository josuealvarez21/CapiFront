import type { DashboardData, CategoriaBackend } from './types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// =============================================
// Core HTTP helper with auth and error handling
// =============================================

interface ApiRequestOptions extends Omit<RequestInit, 'headers'> {
  token?: string | null;
  headers?: Record<string, string>;
}

async function apiRequest<T>(
  endpoint: string,
  { token, headers = {}, ...options }: ApiRequestOptions = {}
): Promise<T> {
  const finalHeaders: Record<string, string> = { ...headers };

  if (token) {
    finalHeaders['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: finalHeaders,
  });

  if (response.status === 401) {
    throw new UnauthorizedError();
  }

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new ApiError(
      errorBody.detail || `Error ${response.status}`,
      response.status
    );
  }

  return response.json();
}

// =============================================
// Custom error classes
// =============================================

export class UnauthorizedError extends Error {
  constructor() {
    super('Unauthorized');
    this.name = 'UnauthorizedError';
  }
}

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

// =============================================
// API service — typed methods for each endpoint
// =============================================

export const api = {
  // --- Auth ---
  auth: {
    login: async (email: string, password: string) => {
      const params = new URLSearchParams();
      params.append('username', email);
      params.append('password', password);

      const response = await fetch(`${API_BASE}/api/v1/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString(),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new ApiError(
          errorData.detail || 'Credenciales incorrectas',
          response.status
        );
      }

      return response.json() as Promise<{ access_token: string; token_type: string }>;
    },

    signup: async (nombre: string, email: string, password: string) => {
      return apiRequest('/api/v1/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, email, password }),
      });
    },

    forgotPassword: async (email: string) => {
      return apiRequest(`/api/v1/auth/forgot-password?email=${encodeURIComponent(email)}`, {
        method: 'POST',
      });
    },
  },

  // --- Dashboard ---
  dashboard: {
    get: async (token: string): Promise<DashboardData> => {
      const data = await apiRequest<DashboardData>('/api/v1/dashboard/', { token });
      // Fix Decimal string values from backend for Recharts
      data.distribucion_gastos = data.distribucion_gastos.map((item) => ({
        ...item,
        valor: Number(item.valor),
      }));
      return data;
    },
  },

  // --- Categories ---
  categories: {
    list: (token: string) =>
      apiRequest<CategoriaBackend[]>('/api/v1/categories/', { token }),
  },

  // --- Movements ---
  movements: {
    create: (token: string, data: { id_categoria: number; monto: number; descripcion: string; fecha: string }) =>
      apiRequest('/api/v1/movements/', {
        method: 'POST',
        token,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }),

    delete: (token: string, id: string) =>
      apiRequest(`/api/v1/movements/${id}`, { method: 'DELETE', token }),
  },

  // --- Goals ---
  goals: {
    create: (token: string, data: { nombre_meta: string; monto_objetivo: number; monto_actual: number; fecha_limite: string }) =>
      apiRequest('/api/v1/goals/', {
        method: 'POST',
        token,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }),

    delete: (token: string, id: string) =>
      apiRequest(`/api/v1/goals/${id}`, { method: 'DELETE', token }),

    update: (token: string, id: string, montoAdicional: number) =>
      apiRequest(`/api/v1/goals/${id}`, {
        method: 'PUT',
        token,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ monto_adicional: montoAdicional }),
      }),

    bulkAllocate: (token: string, allocations: { id_meta: number; monto: number }[]) =>
      apiRequest('/api/v1/goals/bulk-allocate/', {
        method: 'POST',
        token,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(allocations),
      }),
  },

  // --- Budgets ---
  budgets: {
    create: (token: string, data: { id_categoria: number; monto_limite: number; mes: number; anio: number }) =>
      apiRequest('/api/v1/budgets/', {
        method: 'POST',
        token,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }),

    delete: (token: string, id: string) =>
      apiRequest(`/api/v1/budgets/${id}`, { method: 'DELETE', token }),
  },

  // --- Users ---
  users: {
    updateProfile: async (token: string, formData: FormData) => {
      const response = await fetch(`${API_BASE}/api/v1/users/profile-picture`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (response.status === 401) throw new UnauthorizedError();
      if (!response.ok) throw new ApiError('Error updating profile', response.status);

      return response.json();
    },
  },
};
