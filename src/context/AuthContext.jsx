import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('revolt_client_token');
      if (token) {
        try {
          const res = await fetch('/api/auth/me', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          const data = await res.json();
          if (data.success && data.user.role === 'client') {
            setCurrentUser(data.user);
          } else {
            localStorage.removeItem('revolt_client_token');
          }
        } catch (err) {
          console.error("Failed to fetch user session", err);
          localStorage.removeItem('revolt_client_token');
        }
      }
      setLoading(false);
    };

    fetchUser();
  }, []);

  const login = async (email, password) => {
    const res = await fetch('/api/auth/client-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (data.success) {
      localStorage.setItem('revolt_client_token', data.token);
      setCurrentUser(data.user);
      return { success: true };
    }
    return { success: false, error: data.error };
  };

  const register = async (userData) => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    const data = await res.json();
    if (data.success) {
      localStorage.setItem('revolt_client_token', data.token);
      setCurrentUser(data.user);
      return { success: true };
    }
    return { success: false, error: data.error };
  };

  const logout = () => {
    localStorage.removeItem('revolt_client_token');
    setCurrentUser(null);
    window.location.href = '/login';
  };

  const updateProfile = async (updates) => {
    const token = localStorage.getItem('revolt_client_token');
    const res = await fetch('/api/auth/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(updates)
    });
    const data = await res.json();
    if (data.success) {
      setCurrentUser(data.user);
      return { success: true };
    }
    return { success: false, error: data.error };
  };

  const updateAddresses = async (addresses) => {
    const token = localStorage.getItem('revolt_client_token');
    const res = await fetch('/api/auth/address', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ addresses })
    });
    const data = await res.json();
    if (data.success) {
      setCurrentUser(data.user);
      return { success: true };
    }
    return { success: false, error: data.error };
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      loading,
      login,
      register,
      logout,
      updateProfile,
      updateAddresses
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
