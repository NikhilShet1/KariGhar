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
    otpSent, 
    pendingUserData, 
    sendOTP, 
    verifyOTP, 
    demoLogin, 
    cancelOTP 
  } = useAuth();

  // Mode States
  const queryParams = new URLSearchParams(location.search);
  const initialSignup = queryParams.get('signup') === 'true';
  const [isSignup, setIsSignup] = useState(initialSignup);
  const [role, setRole] = useState('Customer'); // 'Customer' | 'Seller'

  // Input States
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [avatar, setAvatar] = useState(null); // base64 string
  
  // OTP States
  const [otpCodes, setOtpCodes] = useState(['', '', '', '']);
  const [timerCount, setTimerCount] = useState(59);

  // Refs for OTP sequentially auto-focus
  const otpRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];
  const fileInputRef = useRef(null);

  // Redirect if already logged in
  useEffect(() => {
    if (isLoggedIn) {
      navigate('/');
    }
  }, [isLoggedIn, navigate]);

  // Countdown timer for OTP resend
  useEffect(() => {
    let interval = null;
    if (otpSent && timerCount > 0) {
      interval = setInterval(() => {
        setTimerCount(prev => prev - 1);
      }, 1000);
    } else if (timerCount === 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [otpSent, timerCount]);

  // Restart timer if OTP resent
  const handleResendOTP = () => {
    setTimerCount(59);
    toast.success("OTP Code resent! Enter 1234 to verify.");
  };

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

  // Form Submit: Sends Mock OTP
  const handleSubmitForm = (e) => {
    e.preventDefault();
    
    // Quick validation
    if (isSignup && !fullName.trim()) {
      toast.error("Please enter your full name.");
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      toast.error("Please enter a valid email address.");
      return;
    }
    if (!phone.trim() || phone.length < 10) {
      toast.error("Please enter a valid phone number (min 10 digits).");
      return;
    }

    const userData = {
      name: isSignup ? fullName : (role === 'Seller' ? 'Meera Devi' : 'Ananya Gupta'),
      email: email,
      phone: phone,
      role: role,
      avatar: avatar
    };

    sendOTP(userData);
    toast.success("Namaste! Verification OTP code dispatched. Enter 1234 to log in.");
    setTimerCount(59);
  };

  // OTP Digits onChange sequential shifting
  const handleOtpChange = (index, value) => {
    if (isNaN(value)) return; // Allow numbers only
    
    const newOtp = [...otpCodes];
    newOtp[index] = value.substring(value.length - 1); // Get last digit
    setOtpCodes(newOtp);

    // Auto-focus next input box
    if (value && index < 3) {
      otpRefs[index + 1].current.focus();
    }
  };

  // OTP Digits backspace key shift-back
  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpCodes[index] && index > 0) {
      otpRefs[index - 1].current.focus();
    }
  };

  // Submit OTP Verification
  const handleVerifyOTP = (e) => {
    e.preventDefault();
    const finalCode = otpCodes.join('');
    if (finalCode.length < 4) {
      toast.error("Please enter all 4 digits.");
      return;
    }

    const res = verifyOTP(finalCode);
    if (res.success) {
      toast.success(role === 'Seller' ? "Seller dashboard unlocked!" : "Successfully signed in!");
      navigate(role === 'Seller' ? '/seller' : '/');
    } else {
      toast.error(res.message);
      setOtpCodes(['', '', '', '']);
      otpRefs[0].current.focus();
    }
  };

  const handleGoogleLogin = () => {
    demoLogin(role);
    toast.success(`Signed in successfully with Google as a ${role}!`);
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
          
          {!otpSent ? (
            /* PHASE 1: REGISTRATION / LOGIN FORM */
            <form onSubmit={handleSubmitForm}>
              <h2 className="auth-welcome-title">
                {isSignup ? 'Create Account' : 'Welcome Back'}
              </h2>
              <p className="auth-welcome-sub">
                {isSignup ? 'Join our marketplace to collect or sell.' : 'Welcome back to the hearth.'}
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

              {/* Email Address */}
              <div className="auth-input-group">
                <label>Email Address</label>
                <input 
                  type="email" 
                  placeholder="e.g. collector@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="auth-input-field"
                  required
                />
              </div>

              {/* Phone Number */}
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

              {/* Continue to OTP button */}
              <button 
                type="submit" 
                className="btn-primary" 
                style={{ width: '100%', justifyContent: 'center', padding: '14px', marginTop: '10px' }}
              >
                Continue to OTP
              </button>

              {/* Divider OR CONNECT WITH */}
              <div className="auth-divider-line">OR CONNECT WITH</div>

              {/* Google Sign In */}
              <button 
                type="button" 
                onClick={handleGoogleLogin}
                className="btn-google-signon"
              >
                <img 
                  src="https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?q=80&w=100&auto=format&fit=crop" 
                  alt="Google" 
                  className="google-brand-img"
                />
                Continue with Google
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
          ) : (
            /* PHASE 2: OTP VERIFICATION INTERFACE */
            <div>
              <button 
                type="button" 
                onClick={cancelOTP}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '13px',
                  color: 'var(--warm-charcoal-muted)',
                  marginBottom: '24px'
                }}
              >
                <FiArrowLeft /> Back to details
              </button>

              <h2 className="auth-welcome-title">Verify Details</h2>
              <p className="auth-welcome-sub">
                Enter the verification code sent to {phone}. (Use mock code <strong>1234</strong>)
              </p>

              <form onSubmit={handleVerifyOTP}>
                {/* 4 Digit OTP Code entry grid */}
                <div className="otp-inputs-grid">
                  {otpCodes.map((code, idx) => (
                    <input 
                      key={idx}
                      type="text"
                      maxLength={1}
                      value={code}
                      ref={otpRefs[idx]}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                      className="otp-box-item"
                      required
                    />
                  ))}
                </div>

                <button 
                  type="submit" 
                  className="btn-primary" 
                  style={{ width: '100%', justifyContent: 'center', padding: '14px' }}
                >
                  Verify & Continue
                </button>

                {/* Dynamic Timer display & Resend button */}
                <div className="otp-timer-lbl">
                  {timerCount > 0 ? (
                    <span>Resend verification code in <strong>{timerCount}s</strong></span>
                  ) : (
                    <span>Didn't receive code? <button type="button" onClick={handleResendOTP} style={{ color: 'var(--primary-terracotta)', fontWeight: '700' }}>Resend OTP</button></span>
                  )}
                </div>

              </form>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};

export default Login;
