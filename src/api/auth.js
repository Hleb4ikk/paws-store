import { api } from './client';

export const loginRequest = (email, password) =>
  api('/auth/login', { method: 'POST', body: { email, password } });

export const registerRequest = (email, password) =>
  api('/auth/register', { method: 'POST', body: { email, password } });
