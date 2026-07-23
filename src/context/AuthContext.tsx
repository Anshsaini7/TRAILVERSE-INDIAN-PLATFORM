'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'USER' | 'GUIDE' | 'ADMIN';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  username?: string;
  city?: string;
  bio?: string;
  profile_image?: string;
  completed_treks?: string[]; // IDs
  saved_treks?: string[]; // IDs
  wishlist?: string[]; // IDs
  achievement_badges?: string[]; // IDs
}


interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<any>;
  signup: (name: string, email: string, password: string, role?: UserRole) => Promise<any>;
  logout: () => void;
  updateProfile: (data: Partial<UserProfile>) => Promise<any>;
  sendOTP: (phone: string) => Promise<string>;
  verifyOTP: (phone: string, otp: string) => Promise<any>;
  googleLogin: (name: string, email: string) => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

// Mock users for local fallback mode
const MOCK_USERS: Record<string, UserProfile & { password: string }> = {
  'abhinav@gmail.com': {
    id: 'm-usr-1',
    name: 'Abhinav Sharma',
    email: 'abhinav@gmail.com',
    password: 'password',
    role: 'USER',
    username: 'abhinav_conquers',
    city: 'Delhi',
    bio: 'Avid climber and backpacker. Conquering high peaks, one ridge at a time.',
    completed_treks: ['roopkund', 'kedarkantha'],
    saved_treks: ['chadar', 'goechala'],
    wishlist: ['chadar', 'goechala'],
    achievement_badges: ['Peak Conqueror', 'Cold Hardened']
  },
  'bikat@gmail.com': {
    id: 'm-usr-2',
    name: 'Bikat Adventures',
    email: 'bikat@gmail.com',
    password: 'password',
    role: 'GUIDE',
    phone: '+91 9999911111',
    city: 'Dehradun',
    bio: 'IMF certified local guiding agency.'
  },
  'admin@gmail.com': {
    id: 'm-usr-3',
    name: 'System Admin',
    email: 'admin@gmail.com',
    password: 'password',
    role: 'ADMIN'
  }
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(() => {
    if (typeof window === 'undefined') return null;
    const saved = localStorage.getItem('tv_user');
    try {
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('tv_token');
  });
  const [loading, setLoading] = useState(false);

  // Check if live backend server is reachable
  const executeApi = async (path: string, options: RequestInit) => {
    try {
      const headers = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...((options.headers || {}) as any)
      };

      const res = await fetch(`${API_BASE_URL}${path}`, {
        ...options,
        headers
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `API error (${res.status})`);
      }

      return await res.json();
    } catch (err: any) {
      // Re-throw to handle connection/status failures
      throw err;
    }
  };

  /**
   * Login
   */
  const login = async (email: string, password: string) => {
    try {
      // 1. Try Backend API
      const result = await executeApi('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });

      const loggedUser = result.data;
      const loggedToken = result.token;

      setUser(loggedUser);
      setToken(loggedToken);
      localStorage.setItem('tv_user', JSON.stringify(loggedUser));
      localStorage.setItem('tv_token', loggedToken);
      return result;
    } catch (err) {
      console.warn('⚠️ Backend unreachable or error, falling back to Local Mock Database.', err);
      
      // 2. Local fallback
      let registeredUser = null;
      try {
        const storedUsers = localStorage.getItem('tv_registered_users');
        if (storedUsers) {
          const registeredUsers = JSON.parse(storedUsers);
          registeredUser = registeredUsers[email];
        }
      } catch (e) {
        console.error('Failed to parse registered users:', e);
      }

      const mockUser = registeredUser || MOCK_USERS[email];
      if (mockUser && mockUser.password === password) {
        const { password: _, ...profile } = mockUser;
        
        // Save to local storage mock cache
        setUser(profile);
        setToken('mock_jwt_token_key');
        localStorage.setItem('tv_user', JSON.stringify(profile));
        localStorage.setItem('tv_token', 'mock_jwt_token_key');
        return { success: true, data: profile };
      } else {
        throw new Error('Incorrect email or password (Mock DB)');
      }
    }
  };

  /**
   * Signup
   */
  const signup = async (name: string, email: string, password: string, role: UserRole = 'USER') => {
    try {
      // 1. Try Backend API
      const result = await executeApi('/auth/signup', {
        method: 'POST',
        body: JSON.stringify({ name, email, password, role })
      });

      const loggedUser = result.data;
      const loggedToken = result.token;

      setUser(loggedUser);
      setToken(loggedToken);
      localStorage.setItem('tv_user', JSON.stringify(loggedUser));
      localStorage.setItem('tv_token', loggedToken);
      return result;
    } catch (err) {
      console.warn('⚠️ Backend unreachable, saving new account locally in mock cache.', err);

      // 2. Local mock creation
      const username = email.split('@')[0];
      const newMockProfile: UserProfile = {
        id: `mock-usr-${Date.now()}`,
        name,
        email,
        role,
        username,
        completed_treks: [],
        saved_treks: [],
        wishlist: [],
        achievement_badges: []
      };

      try {
        const storedUsers = localStorage.getItem('tv_registered_users');
        const registeredUsers = storedUsers ? JSON.parse(storedUsers) : {};
        registeredUsers[email] = { ...newMockProfile, password };
        localStorage.setItem('tv_registered_users', JSON.stringify(registeredUsers));
      } catch (e) {
        console.error('Failed to save registered user:', e);
      }

      setUser(newMockProfile);
      setToken('mock_jwt_token_key');
      localStorage.setItem('tv_user', JSON.stringify(newMockProfile));
      localStorage.setItem('tv_token', 'mock_jwt_token_key');

      return { success: true, data: newMockProfile };
    }
  };

  /**
   * Logout
   */
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('tv_user');
    localStorage.removeItem('tv_token');
  };

  /**
   * Profile Update
   */
  const updateProfile = async (data: Partial<UserProfile>) => {
    if (!user) throw new Error('Not authenticated');
    
    const updated = { ...user, ...data };
    
    try {
      // Try Backend update
      await executeApi(`/auth/profile`, {
        method: 'PUT',
        body: JSON.stringify(data)
      });
    } catch (err) {
      console.warn('⚠️ Backend profile update skipped, caching locally.', err);
    }

    // Always update client-side state
    setUser(updated);
    localStorage.setItem('tv_user', JSON.stringify(updated));
    return { success: true, data: updated };
  };

  /**
   * Send OTP Phone
   */
  const sendOTP = async (phone: string) => {
    try {
      const res = await executeApi('/auth/otp/send', {
        method: 'POST',
        body: JSON.stringify({ phone })
      });
      return res.otp || '123456';
    } catch (err) {
      console.warn('⚠️ OTP service mock dispatch code: 123456');
      return '123456'; // mock fallback
    }
  };

  /**
   * Verify OTP Phone
   */
  const verifyOTP = async (phone: string, otp: string) => {
    try {
      await executeApi('/auth/otp/verify', {
        method: 'POST',
        body: JSON.stringify({ phone, otp })
      });
      
      // Auto-login traveler on successful OTP
      const email = `otp_${phone.replace(/\D/g, '')}@trailverse.in`;
      return await signup(`Traveler ${phone.substring(phone.length - 4)}`, email, 'otp_pwd_token', 'USER');
    } catch (err) {
      console.warn('⚠️ OTP mock verification verification');
      if (otp === '123456') {
        const email = `otp_${phone.replace(/\D/g, '')}@trailverse.in`;
        return await signup(`Traveler ${phone.substring(phone.length - 4)}`, email, 'otp_pwd_token', 'USER');
      } else {
        throw new Error('Invalid verification OTP code.');
      }
    }
  };

  /**
   * Google login mock/auth
   */
  const googleLogin = async (name: string, email: string) => {
    try {
      const res = await executeApi('/auth/google-login', {
        method: 'POST',
        body: JSON.stringify({ idToken: 'google_mock_token', name, email })
      });
      const loggedUser = res.data;
      const loggedToken = res.token;

      setUser(loggedUser);
      setToken(loggedToken);
      localStorage.setItem('tv_user', JSON.stringify(loggedUser));
      localStorage.setItem('tv_token', loggedToken);
      return res;
    } catch (err) {
      console.warn('⚠️ Backend OAuth unreachable, logging in via mock details.');
      return await signup(name, email, 'google_oauth_token', 'USER');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        signup,
        logout,
        updateProfile,
        sendOTP,
        verifyOTP,
        googleLogin
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
