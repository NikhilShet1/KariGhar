import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [pendingUserData, setPendingUserData] = useState(null);

  // Initialize auth state from localStorage on startup
  useEffect(() => {
    const storedUser = localStorage.getItem('karighar_user');
    const storedAuth = localStorage.getItem('karighar_auth');
    if (storedUser && storedAuth === 'true') {
      setUser(JSON.parse(storedUser));
      setIsLoggedIn(true);
    }
  }, []);

  // Simulates sending an OTP code
  const sendOTP = (userData) => {
    setPendingUserData(userData);
    setOtpSent(true);
    return true;
  };

  // Simulates verifying the OTP code
  const verifyOTP = (code) => {
    if (code === '1234' && pendingUserData) {
      const authenticatedUser = {
        ...pendingUserData,
        id: pendingUserData.id || `u-${Date.now()}`,
        avatar: pendingUserData.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150&auto=format&fit=crop"
      };
      
      setUser(authenticatedUser);
      setIsLoggedIn(true);
      setOtpSent(false);
      setPendingUserData(null);
      
      // Persist in localStorage
      localStorage.setItem('karighar_user', JSON.stringify(authenticatedUser));
      localStorage.setItem('karighar_auth', 'true');
      return { success: true };
    }
    return { success: false, message: 'Invalid OTP code. Please enter 1234.' };
  };

  // Log in as a pre-existing demo user (quick login)
  const demoLogin = (role = 'Customer') => {
    const demoUser = {
      id: role === 'Seller' ? 'seller-meera' : 'user-demo',
      name: role === 'Seller' ? 'Meera Devi' : 'Ananya Gupta',
      email: role === 'Seller' ? 'meera@karighar.org' : 'ananya@gmail.com',
      phone: role === 'Seller' ? '9876543210' : '9988776655',
      role: role,
      avatar: role === 'Seller' 
        ? "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150&auto=format&fit=crop"
        : "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop"
    };

    setUser(demoUser);
    setIsLoggedIn(true);
    localStorage.setItem('karighar_user', JSON.stringify(demoUser));
    localStorage.setItem('karighar_auth', 'true');
    return demoUser;
  };

  // Logs the user out
  const logout = () => {
    setUser(null);
    setIsLoggedIn(false);
    setOtpSent(false);
    setPendingUserData(null);
    localStorage.removeItem('karighar_user');
    localStorage.removeItem('karighar_auth');
  };

  // Resets the OTP verification flow
  const cancelOTP = () => {
    setOtpSent(false);
    setPendingUserData(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      isLoggedIn,
      otpSent,
      pendingUserData,
      sendOTP,
      verifyOTP,
      demoLogin,
      logout,
      cancelOTP
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
