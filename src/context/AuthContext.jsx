import { createContext, useContext, useState } from 'react';
import { setToken } from '../api/client';
import { loginRequest, registerRequest } from '../api/auth';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('user') || 'null');
    } catch {
      return null;
    }
  });

  const saveSession = (data) => {
    setToken(data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  };

  const login = (email, password) => loginRequest(email, password).then(saveSession);

  const register = (email, password) => registerRequest(email, password).then(saveSession);

  const logout = () => {
    setToken(null);
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
