import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUser, FiLock, FiUnlock, FiEdit2 } from 'react-icons/fi';
import SellerLayout from './components/SellerLayout';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const SellerLogin = () => {
  const navigate = useNavigate();
  const { login, isLoggedIn, user } = useAuth();
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isLoggedIn && user?.role === 'seller') {
      navigate('/seller/dashboard');
    }
  }, [isLoggedIn, user, navigate]);

  const handleVoiceInput = (text) => {
    const cleanText = text.toLowerCase();
    if (cleanText.includes('login') || cleanText.includes('aage') || cleanText.includes('enter') || cleanText.includes('sign in')) {
      handleLoginSubmit();
    } else {
      // Split by words or capture name/pass
      if (!fullName) {
        setFullName(text);
      } else {
        const digits = text.replace(/[^0-9]/g, '');
        if (digits) {
          setPassword(digits);
        }
      }
    }
  };

  const handleLoginSubmit = (e) => {
    if (e) e.preventDefault();
    
    const name = fullName.trim() || 'Aparna Devi';
    
    const mockUser = {
      id: `artisan-login-${Date.now()}`,
      email: `${name.toLowerCase().replace(/\s+/g, '')}@karigar.com`,
      full_name: name,
      role: 'seller',
      phone_number: '98765 00000',
      state: 'Gujarat',
      district: 'Bhuj',
      profile_pic_url: '/karighar-assistant-lady.png'
    };

    login(mockUser, 'mock_seller_jwt_token');
    toast.success(`Welcome back, ${name}!`);
    navigate('/seller/dashboard');
  };

  return (
    <SellerLayout onVoiceInput={handleVoiceInput}>
      {/* Top Bar */}
      <div className="flex justify-between items-center w-full py-4 border-b border-[#E5DCD0]/60 z-10">
        <span className="text-2xl font-bold text-[#8B3A1A] tracking-wide karigar-serif cursor-pointer" onClick={() => navigate('/seller')}>
          KariGhar
        </span>
        <button 
          onClick={() => navigate('/seller')}
          className="w-10 h-10 rounded-full bg-white border border-[#E5DCD0] flex items-center justify-center text-[#8B3A1A] hover:bg-[#FFF0EB]"
          title="Profile Welcome"
        >
          <FiUser className="w-5 h-5" />
        </button>
      </div>

      {/* Login Screen Frame */}
      <div className="flex-1 flex flex-col items-center justify-center py-12 max-w-2xl mx-auto w-full z-10">
        
        {/* Underlined Flourish Title */}
        <div className="text-center mb-8 flex flex-col items-center">
          <h2 className="text-3xl md:text-4xl font-bold text-[#8B3A1A] italic karigar-serif leading-snug">
            "Welcome back, Sister. Your craft inspires us all."
          </h2>
          <div className="w-48 h-1.5 bg-[#8B3A1A] rounded-full mt-4 opacity-80"></div>
        </div>

        {/* Login White Card */}
        <form onSubmit={handleLoginSubmit} className="karigar-card w-full flex flex-col gap-6">
          
          {/* Green rounded icon row */}
          <div className="flex items-center gap-3 bg-[#EBF5EE] text-[#2D5A3D] p-4 rounded-2xl border border-[#2D5A3D]/10">
            <FiUnlock className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm font-semibold">
              Please enter your name and password.
            </p>
          </div>

          {/* Full Name */}
          <div className="flex flex-col gap-1.5 relative">
            <label className="text-sm font-bold text-[#8B3A1A]">Full Name</label>
            <div className="relative">
              <input 
                type="text" 
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Aparna Devi"
                className="karigar-input pr-14"
                required
              />
              <span className="absolute right-6 top-1/2 -translate-y-1/2 text-lg text-[#666666]">
                <FiEdit2 />
              </span>
            </div>
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5 relative">
            <label className="text-sm font-bold text-[#8B3A1A]">Password</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="karigar-input pr-14"
                required
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-6 top-1/2 -translate-y-1/2 text-2xl text-[#8B3A1A]"
                title={showPassword ? "Hide Password" : "Show Password"}
              >
                {showPassword ? <FiUnlock /> : <FiLock />}
              </button>
            </div>
          </div>

          {/* Login Button */}
          <button type="submit" className="karigar-btn-primary w-full justify-center text-lg py-5 mt-2">
            Login &rarr;
          </button>

        </form>

      </div>
    </SellerLayout>
  );
};

export default SellerLogin;
