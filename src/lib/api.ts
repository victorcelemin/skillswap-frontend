import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://skillswap-api-production-3671.up.railway.app/api';

export const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Inyectar JWT en cada request automáticamente
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('skillswap_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Redirigir al login si el token expiró (401)
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('skillswap_token');
      localStorage.removeItem('skillswap_user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// ==================== AUTH ====================
export const authApi = {
  register: (data: { username: string; email: string; password: string; fullName: string; bio?: string }) =>
    api.post('/auth/register', data),
  login: (data: { identifier: string; password: string }) =>
    api.post('/auth/login', data),
};

// ==================== SKILLS ====================
export const skillsApi = {
  getAll: (page = 0, size = 20) => api.get(`/skills?page=${page}&size=${size}`),
  getCategories: () => api.get('/skills/categories'),
  getByCategory: (category: string) => api.get(`/skills/category/${category}`),
};

// ==================== OFFERS ====================
export const offersApi = {
  getAll: (params?: { q?: string; category?: string; page?: number; size?: number; sortBy?: string }) =>
    api.get('/offers', { params: { page: 0, size: 12, ...params } }),
  getById: (id: number) => api.get(`/offers/${id}`),
  getMine: (page = 0) => api.get(`/offers/my?page=${page}`),
  create: (data: object) => api.post('/offers', data),
  updateStatus: (id: number, status: string) => api.patch(`/offers/${id}/status?status=${status}`),
};

// ==================== SESSIONS ====================
export const sessionsApi = {
  book: (data: { offerId: number; scheduledAt: string; studentNotes?: string }) =>
    api.post('/sessions', data),
  confirm: (id: number) => api.patch(`/sessions/${id}/confirm`),
  complete: (id: number) => api.patch(`/sessions/${id}/complete`),
  cancel: (id: number) => api.patch(`/sessions/${id}/cancel`),
  getAsStudent: (page = 0) => api.get(`/sessions/my/student?page=${page}`),
  getAsTeacher: (page = 0) => api.get(`/sessions/my/teacher?page=${page}`),
};

// ==================== REVIEWS ====================
export const reviewsApi = {
  create: (data: { sessionId: number; rating: number; comment?: string; isPublic?: boolean }) =>
    api.post('/reviews', data),
  getForTeacher: (teacherId: number, page = 0) =>
    api.get(`/reviews/teacher/${teacherId}?page=${page}`),
};

// ==================== USERS ====================
export const usersApi = {
  getMe: () => api.get('/users/me'),
  getById: (id: number) => api.get(`/users/${id}`),
  getByUsername: (username: string) => api.get(`/users/username/${username}`),
};
