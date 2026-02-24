import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'student';
  studentProfile?: string;
  token: string;
}

interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user for no-auth mode
const MOCK_USER: User = {
  _id: 'mock-admin-id',
  name: 'Admin User',
  email: 'admin@example.com',
  role: 'admin',
  token: 'mock-token'
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(MOCK_USER);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // In no-auth mode, we just set the default header for consistency, 
    // though the backend will likely ignore the token validity check.
    axios.defaults.headers.common['Authorization'] = `Bearer ${MOCK_USER.token}`;
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    axios.defaults.headers.common['Authorization'] = `Bearer ${userData.token}`;
  };

  const logout = () => {
    // In no-auth mode, logout might just reset to mock user or do nothing
    setUser(MOCK_USER);
    axios.defaults.headers.common['Authorization'] = `Bearer ${MOCK_USER.token}`;
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
