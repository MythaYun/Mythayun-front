'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  fullName: string;
  email: string;
  isAdmin?: boolean;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

export function useAuth() {
  const router = useRouter();
  const [state, setState] = useState<AuthState>({
    user: null,
    accessToken: null,
    refreshToken: null,
    isLoading: true,
    isAuthenticated: false,
    error: null,
  });

  // Load auth state from localStorage on initial mount
  useEffect(() => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const refreshToken = localStorage.getItem('refreshToken');
      const userData = localStorage.getItem('user');

      if (accessToken && userData) {
        const user = JSON.parse(userData);
        setState({
          user,
          accessToken,
          refreshToken,
          isLoading: false,
          isAuthenticated: true,
          error: null,
        });
      } else {
        setState((prev) => ({ ...prev, isLoading: false }));
      }
    } catch (error) {
      console.error('Error loading auth state:', error);
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: 'Failed to load authentication state',
      }));
    }
  }, []);

  // Login function
  const login = useCallback(
    async (email: string, password: string) => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Login failed');
        }

        const data = await response.json();

        // Store tokens and user data
        localStorage.setItem('accessToken', data.token);
        localStorage.setItem('refreshToken', data.refreshToken);
        localStorage.setItem('user', JSON.stringify(data.user));

        setState({
          user: data.user,
          accessToken: data.token,
          refreshToken: data.refreshToken,
          isLoading: false,
          isAuthenticated: true,
          error: null,
        });

        return data;
      } catch (error: any) {
        console.error('Login error:', error);
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: error.message || 'Failed to login',
        }));
        throw error;
      }
    },
    [router]
  );

  // Register function
  const register = useCallback(
    async (fullName: string, email: string, password: string) => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fullName, email, password }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Registration failed');
        }

        const data = await response.json();

        // After successful registration, log the user in
        return login(email, password);
      } catch (error: any) {
        console.error('Registration error:', error);
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: error.message || 'Failed to register',
        }));
        throw error;
      }
    },
    [login]
  );

  // Logout function
  const logout = useCallback(() => {
    // Clear local storage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');

    // Reset state
    setState({
      user: null,
      accessToken: null,
      refreshToken: null,
      isLoading: false,
      isAuthenticated: false,
      error: null,
    });

    // Redirect to login page
    router.push('/auth/login');
  }, [router]);

  // Function to refresh the token
  const refreshAuthToken = useCallback(async () => {
    if (!state.refreshToken) {
      return false;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: state.refreshToken }),
      });

      if (!response.ok) {
        // If refresh fails, log out
        logout();
        return false;
      }

      const data = await response.json();

      // Update tokens in storage and state
      localStorage.setItem('accessToken', data.token);
      localStorage.setItem('refreshToken', data.refreshToken);

      setState((prev) => ({
        ...prev,
        accessToken: data.token,
        refreshToken: data.refreshToken,
      }));

      return true;
    } catch (error) {
      console.error('Token refresh error:', error);
      logout();
      return false;
    }
  }, [state.refreshToken, logout]);

  return {
    ...state,
    login,
    register,
    logout,
    refreshAuthToken,
  };
}
