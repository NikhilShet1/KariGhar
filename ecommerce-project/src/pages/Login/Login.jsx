import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiCamera, FiArrowLeft, FiTrash2 } from 'react-icons/fi';
import toast from 'react-hot-toast';
import '../../styles/auth.css';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { 
    isLoggedIn, 
    login 
  } = useAuth();

  // Mode States
  const queryParams = new URLSearchParams(location.search);
  const initialSignup = queryParams.get('signup') === 'true';
  const [isSignup, setIsSignup] = useState(initialSignup);
  const [role, setRole] = useState('Customer'); // 'Customer' | 'Seller'

  // Input States
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [avatar, setAvatar] = useState(null); // base64 string
  
  const fileInputRef = useRef(null);

  // Redirect if already logged in
  useEffect(() => {
    if (isLoggedIn) {
      navigate('/');
    }
  }, [isLoggedIn, navigate]);

  // Image upload with FileReader preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2000000) {
        toast.error("File is too large. Please select an image under 2MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result);
        toast.success("Profile photo uploaded!");
      };
      reader.readAsDataURL(file);
    }
  };

  // Trigger file upload dialog
  const triggerImagePicker = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Form Submit: Login or Register
  const handleSubmitForm = (e) => {
    e.preventDefault();
    
    // Quick validation
    if (isSignup && !fullName.trim()) {
      toast.error("Please enter your full name.");
      return;
    }
    if (!username.trim() || username.length < 3) {
      toast.error("Please enter a valid username (min 3 characters).");
      return;
    }
    if (!password.trim() || password.length < 4) {
      toast.error("Please enter a valid password (min 4 characters).");
      return;
    }
    if (isSignup && (!phone.trim() || phone.length < 10)) {
      toast.error("Please enter a valid phone number (min 10 digits).");
      return;
    }

    const userData = {
      name: isSignup ? fullName : (role === 'Seller' ? 'Meera Devi' : 'Ananya Gupta'),
      username: username,
      phone: isSignup ? phone : (role === 'Seller' ? '9876543210' : '9988776655'),
      role: role,
      avatar: avatar
    };

    login(userData);
    toast.success(role === 'Seller' ? "Artisan dashboard unlocked!" : "Successfully signed in!");
    navigate(role === 'Seller' ? '/seller' : '/');
  };

  return (
    <div className="auth-page-wrapper">
      <div className="auth-split-card">
        
        {/* LEFT SIDE IMAGERY */}
        <div className="auth-visual-panel">
          <div>
            <h2 className="auth-visual-title">KariGhar</h2>
            <p className="auth-visual-quote">
              Step into a world where every stitch and stroke tells a story of ancient hands and modern hearts.
            </p>
          </div>
          
          <img 
            src="https://images.unsplash.com/photo-1506806732259-39c2d0268443?q=80&w=600&auto=format&fit=crop" 
            alt="Weaving hands threads" 
            className="auth-visual-image"
          />
          
          <div style={{ fontSize: '11px', opacity: 0.7 }}>
            © 2026 KariGhar. Preserving Craft, Honoring Hands.
          </div>
        </div>

        {/* RIGHT SIDE INTERACTIVE FORMS */}
        <div className="auth-form-panel">
          
          <form onSubmit={handleSubmitForm}>
            <h2 className="auth-welcome-title">
              {isSignup ? 'Create Account' : 'Welcome Back'}
            </h2>
            <p className="auth-welcome-sub">
              {isSignup ? 'Join our marketplace to collect or sell.' : 'Welcome back to KariGhar.'}
            </p>

            {/* Customer / Seller Toggle */}
            <div className="auth-role-toggle-pill">
              <button 
                type="button"
                onClick={() => setRole('Customer')}
                className={`auth-role-btn ${role === 'Customer' ? 'active' : 'inactive'}`}
              >
                Customer
              </button>
              <button 
                type="button"
                onClick={() => setRole('Seller')}
                className={`auth-role-btn ${role === 'Seller' ? 'active' : 'inactive'}`}
              >
                Seller Artisan
              </button>
            </div>

            {/* Photo Upload preview (Signup Mode only) */}
            {isSignup && (
              <div className="auth-photo-uploader" onClick={triggerImagePicker}>
                <div className="photo-upload-circle">
                  {avatar ? (
                    <img src={avatar} alt="Avatar preview" />
                  ) : (
                    <FiCamera size={26} />
                  )}
                </div>
                <span className="photo-upload-text">
                  {avatar ? 'Change Profile Photo' : 'Upload Profile Photo'}
                </span>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleImageChange}
                  accept="image/*"
                  style={{ display: 'none' }}
                />
              </div>
            )}

            {/* Full Name (Signup Mode only) */}
            {isSignup && (
              <div className="auth-input-group">
                <label>Full Name</label>
                <input 
                  type="text" 
                  placeholder="Enter your name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="auth-input-field"
                  required
                />
              </div>
            )}

            {/* Username */}
            <div className="auth-input-group">
              <label>Username</label>
              <input 
                type="text" 
                placeholder="Choose a username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="auth-input-field"
                required
              />
            </div>

            {/* Password */}
            <div className="auth-input-group">
              <label>Password</label>
              <input 
                type="password" 
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="auth-input-field"
                required
              />
            </div>

            {/* Phone Number (Signup Mode only) */}
            {isSignup && (
              <div className="auth-input-group">
                <label>Phone Number</label>
                <input 
                  type="tel" 
                  placeholder="e.g. 9876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="auth-input-field"
                  required
                />
              </div>
            )}

            {/* Submit button */}
            <button 
              type="submit" 
              className="btn-primary" 
              style={{ width: '100%', justifyContent: 'center', padding: '14px', marginTop: '10px' }}
            >
              {isSignup ? 'Create Account' : 'Log In'}
            </button>

            {/* Toggle Mode Link */}
            <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '13px', color: 'var(--warm-charcoal-muted)' }}>
              {isSignup ? (
                <span>Already have an account? <button type="button" onClick={() => setIsSignup(false)} style={{ color: 'var(--primary-terracotta)', fontWeight: '700' }}>Log In</button></span>
              ) : (
                <span>Don't have an account? <button type="button" onClick={() => setIsSignup(true)} style={{ color: 'var(--primary-terracotta)', fontWeight: '700' }}>Sign Up</button></span>
              )}
            </div>

          </form>

        </div>

      </div>
    </div>
  );
};

export default Login;
