const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000/api';

class ApiClient {
  constructor() {
    this.baseURL = API_BASE;
  }

  getToken() {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('nutricore_token');
    }
    return null;
  }

  setToken(token) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('nutricore_token', token);
    }
  }

  removeToken() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('nutricore_token');
    }
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const token = this.getToken();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'C\u00f3 l\u1ed7i x\u1ea3y ra');
      }

      return data;
    } catch (error) {
      if (error.message === 'Failed to fetch') {
        throw new Error('Kh\u00f4ng th\u1ec3 k\u1ebft n\u1ed1i \u0111\u1ebfn server');
      }
      throw error;
    }
  }

  get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  }

  post(endpoint, body) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  put(endpoint, body) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }

  async uploadImage(file) {
    const url = `${this.baseURL}/upload`;
    const token = this.getToken();
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Upload th\u1ea5t b\u1ea1i');
    }
    return data;
  }

  async login(email, password) {
    const data = await this.post('/auth/login', { email, password });
    this.setToken(data.token);
    if (typeof window !== 'undefined') {
      localStorage.setItem('nutricore_user', JSON.stringify(data.user));
    }
    return data;
  }

  async register(name, email, password, phone) {
    return this.post('/auth/register', { name, email, password, phone });
  }

  async verifyEmail(token) {
    return this.get(`/auth/verify-email?token=${encodeURIComponent(token)}`);
  }

  async resendVerification(email) {
    return this.post('/auth/resend-verification', { email });
  }

  async forgotPassword(email) {
    return this.post('/auth/forgot-password', { email });
  }

  async resetPassword(token, password) {
    return this.post('/auth/reset-password', { token, password });
  }

  async googleLogin(firebasePayload) {
    const data = await this.post('/auth/google', firebasePayload);
    this.setToken(data.token);
    if (typeof window !== 'undefined') {
      localStorage.setItem('nutricore_user', JSON.stringify(data.user));
    }
    return data;
  }

  async getMe() {
    return this.get('/auth/me');
  }

  logout() {
    this.removeToken();
    if (typeof window !== 'undefined') {
      localStorage.removeItem('nutricore_user');
      localStorage.removeItem('nutricore_token');
    }
  }

  isLoggedIn() {
    return !!this.getToken();
  }

  getUser() {
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem('nutricore_user');
      return user ? JSON.parse(user) : null;
    }
    return null;
  }
}

const api = new ApiClient();
export default api;
