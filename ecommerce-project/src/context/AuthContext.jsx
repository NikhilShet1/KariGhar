import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Initialize auth state from localStorage on startup
  useEffect(() => {
    const storedUser = localStorage.getItem('karighar_user');
    const storedAuth = localStorage.getItem('karighar_auth');
    if (storedUser && storedAuth === 'true') {
      setUser(JSON.parse(storedUser));
      setIsLoggedIn(true);
    }
  }, []);

  // Simulates user authentication (Login and Registration)
  const login = (userData) => {
    const authenticatedUser = {
      ...userData,
      id: userData.id || `u-${Date.now()}`,
      avatar: userData.avatar || (userData.role === 'Seller'
        ? "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150&auto=format&fit=crop"
        : "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150&auto=format&fit=crop")
    };

    setUser(authenticatedUser);
    setIsLoggedIn(true);

    // Persist in localStorage
    localStorage.setItem('karighar_user', JSON.stringify(authenticatedUser));
    localStorage.setItem('karighar_auth', 'true');
    return authenticatedUser;
  };

  // Logs the user out
  const logout = () => {
    setUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem('karighar_user');
    localStorage.removeItem('karighar_auth');
  };

  return (
    <AuthContext.Provider value={{
      user,
      isLoggedIn,
      login,
      logout
    }}>
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
