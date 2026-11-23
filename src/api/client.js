const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const getToken = () => localStorage.getItem('token');

export const setToken = (token) => {
  if (token) localStorage.setItem('token', token);
  else localStorage.removeItem('token');
};

export class ApiError extends Error {
  constructor(status, code, message) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

export async function api(path, { method = 'GET', body, auth = false } = {}) {
  const headers = {};
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  if (auth) {
    const token = getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (response.status === 204) return null;

  const data = await response.json().catch(() => null);
  if (!response.ok) {
    const err = data?.error || {};
    throw new ApiError(response.status, err.code || 'ERROR', err.message || `Request failed: ${response.status}`);
  }
  return data;
}
