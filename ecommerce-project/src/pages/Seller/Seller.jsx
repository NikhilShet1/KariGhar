import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useProducts } from '../../context/ProductContext';
import { formatPrice } from '../../utils/helpers';
import { 
  FiDollarSign, FiPlusCircle, FiBarChart2, FiAward, 
  FiUploadCloud, FiInfo, FiMic, FiSquare, FiPlay, 
  FiPause, FiMessageSquare, FiMessageCircle, FiChevronRight, 
  FiArrowLeft, FiX, FiCheckCircle, FiStar
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import '../../styles/seller.css';

const Seller = () => {
  const navigate = useNavigate();
  const { user, isLoggedIn } = useAuth();
  const { addProduct, products } = useProducts();

  // If not signed in as a seller, prompt to login
  useEffect(() => {
    if (isLoggedIn && user?.role !== 'seller') {
      toast.error("Please switch to an Artisan account to access the dashboard.");
    }
  }, [isLoggedIn, user]);

  // 1. Pricing Tool States
  const [materialCost, setMaterialCost] = useState(1200);
  const [loomHours, setLoomHours] = useState(8);
  const [packCost, setPackCost] = useState(250);

  // 2. Upload Form States
  const [prodTitle, setProdTitle] = useState('');
  const [prodCategory, setProdCategory] = useState('Pottery & Ceramics');
  const [prodDistrict, setProdDistrict] = useState('Bhuj');
  const [prodPrice, setProdPrice] = useState('');
  const [prodDesc, setProdDesc] = useState('');
  const [prodImg, setProdImg] = useState(null); // base64 string
  
  // 3. Audio Voice Recorder States (Product Description)
  const [recorderState, setRecorderState] = useState('idle'); // 'idle' | 'recording' | 'done'
  const [recordTimer, setRecordTimer] = useState(0);
  const [recordedVoiceUrl, setRecordedVoiceUrl] = useState(null);
  const timerIntervalRef = useRef(null);

  // 4. WhatsApp Link Generator States
  const [waNumber, setWaNumber] = useState('+919876543210');
  const [waText, setWaText] = useState("Namaste! I saw your beautiful hand-thrown pottery on KariGhar and would love to enquire about purchasing it directly...");
  const [showWaPreview, setShowWaPreview] = useState(false);

  // 5. Artisan Community Voice Rooms States
  const [activeRoom, setActiveRoom] = useState('none'); // 'none' | 'pottery' | 'handloom'
  const [forumInput, setForumInput] = useState('');
  const [forumMicRecording, setForumMicRecording] = useState(false);
  const [cooperativeMessages, setCooperativeMessages] = useState([
    { id: 'c1', sender: 'Parvati Devi', text: "Namaste sisters! I am having amazing sales on KariGhar this month. Let me know if you need help with your Ajrakh borders!", voice: false },
    { id: 'c2', sender: 'Radha Bai', text: "Yes, I also need help with pricing my cotton throws. The Pricing Tool helped me compute labor wage!", voice: false }
  ]);
  const [potteryMessages, setPotteryMessages] = useState([
    { id: 'p1', sender: 'Devi Bai', text: "The new riverbed clay is very smooth after the rain. Happy potting!", voice: false },
    { id: 'p2', sender: 'Radha Bai', text: "Yes, I am starting the firing of 20 Earthen Sanctuary Vases today!", voice: false }
  ]);

  const fileInputRef = useRef(null);

  // Pricing Tool Math (Fair Trade Pricing Model)
  const laborCost = loomHours * 150; // ₹150/hr fair regional craft wage
  const baseCost = materialCost + laborCost + packCost;
  const suggestedPrice = Math.round(baseCost * 1.15); // Add 15% cooperative safety margin

  // Voice recording timer effect
  useEffect(() => {
    if (recorderState === 'recording') {
      timerIntervalRef.current = setInterval(() => {
        setRecordTimer(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(timerIntervalRef.current);
    }
    return () => clearInterval(timerIntervalRef.current);
  }, [recorderState]);

  // Format timer seconds (e.g. 0:04)
  const formatSeconds = (totalSecs) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Pricing click autofiller
  const handleUseSuggestedPrice = () => {
    setProdPrice(suggestedPrice);
    toast.success(`Pricing set to suggested fair-trade rate: ${formatPrice(suggestedPrice)}`);
  };

  // Convert uploaded image
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProdImg(reader.result);
        toast.success("Product preview image prepared!");
      };
      reader.readAsDataURL(file);
    }
  };

  // Voice Recorder triggers
  const startRecordingVoice = () => {
    setRecorderState('recording');
    setRecordTimer(0);
    setRecordedVoiceUrl(null);
    toast.success("Recording started! Speak clearly into your device microphone.");
  };

  const stopRecordingVoice = () => {
    setRecorderState('done');
    setRecordedVoiceUrl('mock_audio_kutch_devi.mp3');
    toast.success("Audio description recorded successfully!");
  };

  const clearRecordedVoice = () => {
    setRecorderState('idle');
    setRecordedVoiceUrl(null);
    setRecordTimer(0);
    toast.success("Voice recording cleared.");
  };

  // Submit Product: Saves Live Product
  const handleProductSubmit = (e) => {
    e.preventDefault();
    if (!prodTitle.trim() || !prodPrice || !prodDesc.trim()) {
      toast.error("Please fill in all product upload details.");
      return;
    }

    const newProd = {
      title: prodTitle,
      subtitle: `HAND-MADE • ${prodDistrict.toUpperCase()} DISTRICT`,
      price: Number(prodPrice),
      category: prodCategory,
      district: prodDistrict,
      description: prodDesc,
      images: prodImg ? [prodImg] : ["/images/earthen-sanctuary-vase.png"],
      artisanId: user?.id || 'seller-meera',
      tags: ["Handmade", "Organic Materials"],
      voice_description_url: recordedVoiceUrl // implements products.voice_description_url database schema!
    };

    addProduct(newProd);
    toast.success(`Congratulations! "${prodTitle}" is now live in the global KariGhar catalog!`, {
      duration: 6000
    });

    // Reset Form
    setProdTitle('');
    setProdPrice('');
    setProdDesc('');
    setProdImg(null);
    clearRecordedVoice();
  };

  // WhatsApp click-to-chat url escaping (escapes text correctly!)
  const generatedWhatsAppLink = `https://wa.me/${waNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(waText)}`;

  const handleWhatsAppGenerate = () => {
    setShowWaPreview(true);
    toast.success("WhatsApp Click-to-Chat link generated! Ready to test.");
  };

  // Forums Posting Text Message
  const handleSendForumMessage = (e) => {
    e.preventDefault();
    if (!forumInput.trim()) return;

    const newMsg = {
      id: `fm-${Date.now()}`,
      sender: `${user?.name || 'Artisan'} (Me)`,
      text: forumInput,
      voice: false
    };

    if (activeRoom === 'pottery') {
      setPotteryMessages([...potteryMessages, newMsg]);
    } else {
      setCooperativeMessages([...cooperativeMessages, newMsg]);
    }

    setForumInput('');
    toast.success("Message posted in Cooperative circle.");
  };

  // Forums Posting Mock Audio Message (Table 10 messages.voice_message_url)
  const handleRecordForumAudio = () => {
    setForumMicRecording(true);
    toast.success("Recording cooperative voice clip...");

    setTimeout(() => {
      setForumMicRecording(false);
      const newAudioMsg = {
        id: `fma-${Date.now()}`,
        sender: `${user?.name || 'Artisan'} (Me)`,
        text: "Voice Note (0:04) 🔊",
        voice: true
      };

      if (activeRoom === 'pottery') {
        setPotteryMessages([...potteryMessages, newAudioMsg]);
      } else {
        setCooperativeMessages([...cooperativeMessages, newAudioMsg]);
      }
      toast.success("Audio message posted in cooperative room logs!");
    }, 2000);
  };

  if (!isLoggedIn || user?.role !== 'seller') {
    return (
      <div className="container text-center" style={{ padding: '80px 0', animation: 'fadeIn 0.6s ease-out' }}>
        <h2 className="serif-title" style={{ fontSize: '32px', marginBottom: '16px' }}>Artisan Partner Panel</h2>
        <p style={{ color: 'var(--warm-charcoal-muted)', marginBottom: '24px' }}>
          Please log in as an Artisan Partner to manage your digital shop, view pricing assistance tools, and upload creations.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <Link to="/login" className="btn-primary">Sign In / Register</Link>
        </div>
      </div>
    );
  }

  // Filter products listed by this specific seller
  const sellerProducts = products.filter(p => p.artisanId === user?.id || p.artisanId === 'meera-devi');

  return (
    <div style={{ animation: 'fadeIn 0.6s ease-out' }}>
      
      {/* HEADER HERO */}
      <section className="seller-hero">
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span className="hero-badge-tag">Artisan Partner Dashboard</span>
            <h1 style={{ marginTop: '10px', fontSize: '36px' }}>Namaste, {user?.name || 'Artisan'}</h1>
            <p style={{ color: 'var(--warm-charcoal-muted)', fontSize: '14px', marginTop: '6px' }}>
              Your digital shop portal. Keep your beautiful traditional crafts accessible to global collectors.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <span className="badge-handmade" style={{ padding: '8px 16px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <FiAward /> Verified Artisan
            </span>
          </div>
        </div>
      </section>

      {/* METRICS & UPLOAD CONTAINER */}
      <section className="container">
        <div className="seller-grid">
          
          {/* 1. LEFT SIDE: SALES METRICS & PRICING TOOL & COMMUNITY VOICE FORUMS */}
          <div className="seller-left-wrap">
            
            {/* Sales Metrics Cards */}
            <div>
              <h3 className="serif-title" style={{ fontSize: '20px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FiBarChart2 style={{ color: 'var(--primary-terracotta)' }} /> Performance Summary
              </h3>
              <div className="seller-metrics-grid">
                <div className="metric-card-box">
                  <div className="metric-num">₹85,000</div>
                  <div className="metric-lbl">Total Sales</div>
                </div>
                <div className="metric-card-box">
                  <div className="metric-num">{sellerProducts.length}</div>
                  <div className="metric-lbl">Creations Live</div>
                </div>
                <div className="metric-card-box">
                  <div className="metric-num">12</div>
                  <div className="metric-lbl">Orders Fulfilled</div>
                </div>
              </div>
            </div>

            {/* Fair-Trade Pricing Tool Calculator */}
            <div className="pricing-calculator-card">
              <h3 className="serif-title" style={{ fontSize: '20px', color: 'var(--primary-terracotta)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FiDollarSign style={{ color: 'var(--primary-terracotta)' }} /> Fair-Trade Pricing Tool
              </h3>
              <p style={{ fontSize: '12px', color: 'var(--warm-charcoal-muted)', marginBottom: '20px' }}>
                Calculate a fair-trade price that guarantees a living wage for your hours and covers material costs.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                
                {/* Slider: Material Cost */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>
                    <span>Raw Material Costs (Clay/Silk/Zari)</span>
                    <span style={{ color: 'var(--primary-terracotta)' }}>{formatPrice(materialCost)}</span>
                  </div>
                  <input 
                    type="range" 
                    min="100" 
                    max="10000" 
                    step="100"
                    value={materialCost}
                    onChange={(e) => setMaterialCost(Number(e.target.value))}
                    className="price-slider-input"
                  />
                </div>

                {/* Slider: Loom hours */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>
                    <span>Crafting / Weaving Labor Hours</span>
                    <span style={{ color: 'var(--primary-terracotta)' }}>{loomHours} hours</span>
                  </div>
                  <input 
                    type="range" 
                    min="1" 
                    max="60" 
                    step="1"
                    value={loomHours}
                    onChange={(e) => setLoomHours(Number(e.target.value))}
                    className="price-slider-input"
                  />
                </div>

                {/* Slider: Packaging */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>
                    <span>Eco-Packaging & Box cushion cost</span>
                    <span style={{ color: 'var(--primary-terracotta)' }}>{formatPrice(packCost)}</span>
                  </div>
                  <input 
                    type="range" 
                    min="50" 
                    max="1000" 
                    step="50"
                    value={packCost}
                    onChange={(e) => setPackCost(Number(e.target.value))}
                    className="price-slider-input"
                  />
                </div>

              </div>

              {/* Calculator suggested price output box */}
              <div className="pricing-result-pane">
                <div style={{ fontSize: '11px', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.5px', color: 'var(--primary-terracotta)', marginBottom: '4px' }}>
                  Suggested Fair-Trade Price
                </div>
                <h3 style={{ fontSize: '28px', color: 'var(--primary-terracotta)', marginBottom: '8px' }}>
                  {formatPrice(suggestedPrice)}
                </h3>
                <p style={{ fontSize: '11px', color: 'var(--warm-charcoal-muted)', lineHeight: '1.5', maxWidth: '300px', margin: '0 auto 12px auto' }}>
                  Covers {formatPrice(laborCost)} labor payment (₹150/hr fair wage) and {formatPrice(materialCost + packCost)} materials, adding 15% cooperative safety allowance.
                </p>
                <button 
                  onClick={handleUseSuggestedPrice}
                  className="btn-primary" 
                  style={{ padding: '8px 16px', fontSize: '12px' }}
                >
                  Use Recommended Price
                </button>
              </div>

            </div>

            {/* FEATURE 2: WHATSAPP CLICK TO CHAT GENERATOR */}
            <div className="whatsapp-generator-card">
              <h3 className="serif-title" style={{ fontSize: '20px', color: 'var(--primary-terracotta)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FiMessageCircle style={{ color: 'var(--primary-terracotta)' }} /> WhatsApp Click-to-Chat Link
              </h3>
              <p style={{ fontSize: '12px', color: 'var(--warm-charcoal-muted)', marginBottom: '16px' }}>
                Generateescaped WhatsApp click redirections to allow collectors to converse with you directly!
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div className="auth-input-group">
                  <label>WhatsApp Phone Number (with Country Code)</label>
                  <input 
                    type="text" 
                    value={waNumber}
                    onChange={(e) => setWaNumber(e.target.value)}
                    className="auth-input-field"
                    placeholder="+91XXXXXXXXXX"
                  />
                </div>
                <div className="auth-input-group">
                  <label>Pre-Filled Customer Message</label>
                  <textarea 
                    value={waText}
                    onChange={(e) => setWaText(e.target.value)}
                    className="auth-input-field"
                    rows={3}
                    style={{ resize: 'none', height: '70px', fontSize: '13px' }}
                  />
                </div>
                <button onClick={handleWhatsAppGenerate} className="btn-secondary" style={{ justifyContent: 'center' }}>
                  Generate Direct Chat Link
                </button>
              </div>

              {showWaPreview && (
                <div className="whatsapp-output-pane">
                  <div style={{ fontWeight: '700', marginBottom: '4px' }}>Generated Escaped Redirection Link:</div>
                  <a href={generatedWhatsAppLink} target="_blank" rel="noreferrer" style={{ fontStyle: 'italic', textDecoration: 'underline' }}>
                    {generatedWhatsAppLink}
                  </a>
                </div>
              )}
            </div>

            {/* FEATURE 3: ARTISAN COMMUNITY COOPERATIVE VOICE ROOMS */}
            <div className="artisan-forums-card">
              <h3 className="serif-title" style={{ fontSize: '20px', color: 'var(--primary-terracotta)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FiMessageSquare style={{ color: 'var(--primary-terracotta)' }} /> Artisan Voice & Text Forums
              </h3>
              <p style={{ fontSize: '14px', color: 'var(--warm-charcoal)', marginBottom: '20px' }}>
                Connect client-side with cooperative circles across India. Speak, share advice, and record voice notes in the rooms!
              </p>

              {activeRoom === 'none' ? (
                /* List of Rooms */
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  
                  {/* Room 1: Pottery circle */}
                  <div className="forum-room-item">
                    <div>
                      <h4 style={{ fontSize: '15px', fontWeight: '700' }}>🏺 Kutch Pottery Circle</h4>
                      <p style={{ fontSize: '14px', color: 'var(--warm-charcoal)', marginTop: '4px' }}>Cooperative discussions on clay firing & sourcing</p>
                    </div>
                    <button onClick={() => setActiveRoom('pottery')} className="btn-primary" style={{ padding: '8px 14px', fontSize: '13px' }}>
                      Join Room
                    </button>
                  </div>

                  {/* Room 2: Handloom circle */}
                  <div className="forum-room-item">
                    <div>
                      <h4 style={{ fontSize: '15px', fontWeight: '700' }}>🧵 Banarasi Saree Cooperative</h4>
                      <p style={{ fontSize: '14px', color: 'var(--warm-charcoal)', marginTop: '4px' }}>Discussions on silk weights and Ajrakh prints</p>
                    </div>
                    <button onClick={() => setActiveRoom('handloom')} className="btn-primary" style={{ padding: '8px 14px', fontSize: '13px' }}>
                      Join Room
                    </button>
                  </div>

                </div>
              ) : (
                /* ACTIVE CHATROOM ENVIRONMENT */
                <div className="forum-chat-box">
                  
                  {/* Header */}
                  <div className="forum-chat-header">
                    <span>{activeRoom === 'pottery' ? '🏺 Kutch Pottery Room' : '🧵 Banarasi Handloom Room'}</span>
                    <button onClick={() => setActiveRoom('none')} style={{ color: 'var(--white-pure)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <FiX /> Exit
                    </button>
                  </div>

                  {/* Messages list */}
                  <div className="forum-messages-list">
                    {(activeRoom === 'pottery' ? potteryMessages : cooperativeMessages).map(msg => (
                      <div key={msg.id} className={`forum-message-item ${msg.sender.includes('(Me)') ? 'me' : 'other'}`}>
                        <div className="forum-msg-sender">{msg.sender}</div>
                        <div style={{ wordBreak: 'break-word' }}>{msg.text}</div>
                      </div>
                    ))}
                  </div>

                  {/* Input form panel */}
                  <form onSubmit={handleSendForumMessage} className="forum-input-row">
                    
                    {/* Voice audio posting mic */}
                    <button 
                      type="button" 
                      onClick={handleRecordForumAudio}
                      className={`forum-mic-btn ${forumMicRecording ? 'recording' : ''}`}
                      disabled={forumMicRecording}
                      title="Post Voice Message"
                    >
                      <FiMic />
                    </button>

                    <input 
                      type="text" 
                      placeholder={forumMicRecording ? "Recording clip..." : "Type a message..."}
                      value={forumInput}
                      onChange={(e) => setForumInput(e.target.value)}
                      className="forum-text-input"
                      disabled={forumMicRecording}
                    />

                    <button type="submit" className="forum-send-btn" disabled={forumMicRecording || !forumInput.trim()}>
                      <FiChevronRight />
                    </button>
                  </form>

                </div>
              )}

            </div>

          </div>

          {/* 2. RIGHT SIDE: UPLOAD CREATION FORM & INTEGRATED AUDIO RECORDER */}
          <div className="seller-upload-card">
            <h3 className="serif-title" style={{ fontSize: '22px', color: 'var(--primary-terracotta)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FiPlusCircle /> Upload New Creation
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--warm-charcoal-muted)', marginBottom: '24px' }}>
              Showcase your creation to global collectors. Set a detailed description of the raw materials and history.
            </p>

            <form onSubmit={handleProductSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              <div className="auth-input-group">
                <label>Creation Title</label>
                <input 
                  type="text" 
                  placeholder="e.g. Pashmina Emerald Scarf"
                  value={prodTitle}
                  onChange={(e) => setProdTitle(e.target.value)}
                  className="auth-input-field"
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="auth-input-group">
                  <label>Craft Category</label>
                  <select 
                    value={prodCategory} 
                    onChange={(e) => setProdCategory(e.target.value)}
                    className="district-select-custom"
                    style={{ padding: '10px' }}
                  >
                    <option value="Pottery & Ceramics">Pottery & Ceramics</option>
                    <option value="Hand-loom Textiles">Hand-loom Textiles</option>
                    <option value="Metalwork (Dhokra)">Metalwork (Dhokra)</option>
                    <option value="Wooden Carvings">Wooden Carvings</option>
                  </select>
                </div>

                <div className="auth-input-group">
                  <label>District Origin</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Varanasi, Bhuj, Bastar"
                    value={prodDistrict}
                    onChange={(e) => setProdDistrict(e.target.value)}
                    className="auth-input-field"
                    required
                  />
                </div>
              </div>

              {/* Price with suggested link option */}
              <div className="auth-input-group">
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  Selling Price (INR)
                  <FiInfo style={{ color: 'var(--primary-terracotta)', cursor: 'pointer' }} onClick={handleUseSuggestedPrice} title="Click to use Suggested Price on the left!" />
                </label>
                <input 
                  type="number" 
                  placeholder="e.g. 4500"
                  value={prodPrice}
                  onChange={(e) => setProdPrice(e.target.value)}
                  className="auth-input-field"
                  required
                />
              </div>

              <div className="auth-input-group">
                <label>Creation Story / Description</label>
                <textarea 
                  placeholder="Tell the story of how you harvested clay or thread, the traditional designs used, and how long it took to craft..."
                  value={prodDesc}
                  onChange={(e) => setProdDesc(e.target.value)}
                  className="auth-input-field"
                  rows={4}
                  style={{ resize: 'none', height: '100px' }}
                  required
                />
              </div>

              {/* AUDIO VOICE RECORDER (Description Audio URL table schema) */}
              <div>
                <label style={{ fontSize: '13px', fontWeight: '600', display: 'block', marginBottom: '8px' }}>
                  Voice Description / Audio Story (Optional)
                </label>
                <div className="voice-recorder-widget">
                  <div className="voice-recorder-header">
                    <span>
                      {recorderState === 'idle' && 'No voice note recorded'}
                      {recorderState === 'recording' && 'Speak now... Recording'}
                      {recorderState === 'done' && 'Voice Description Captured'}
                    </span>
                    {recorderState === 'recording' && <span className="recording-indicator-glow"></span>}
                  </div>

                  {recorderState === 'recording' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
                      <div className="voice-waveform-bouncing">
                        <span></span><span></span><span></span><span></span><span></span>
                      </div>
                      <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--primary-terracotta)' }}>
                        {formatSeconds(recordTimer)}
                      </span>
                    </div>
                  )}

                  {recorderState === 'done' && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: '#2e7d32', fontWeight: '600' }}>
                      <FiCheckCircle size={18} />
                      <span>Audio Story Ready (0:12 Duration) • voice_description.mp3</span>
                    </div>
                  )}

                  {/* Action buttons */}
                  <div style={{ display: 'flex', gap: '10px' }}>
                    {recorderState === 'idle' && (
                      <button type="button" onClick={startRecordingVoice} className="btn-secondary" style={{ padding: '8px 14px', fontSize: '12px', flex: 1, justifyContent: 'center' }}>
                        <FiMic /> Start Voice Note
                      </button>
                    )}
                    {recorderState === 'recording' && (
                      <button type="button" onClick={stopRecordingVoice} className="btn-primary" style={{ padding: '8px 14px', fontSize: '12px', flex: 1, justifyContent: 'center', backgroundColor: '#f44336' }}>
                        <FiSquare /> Stop & Save
                      </button>
                    )}
                    {recorderState === 'done' && (
                      <>
                        <button type="button" onClick={clearRecordedVoice} className="btn-secondary" style={{ padding: '8px 14px', fontSize: '12px', flex: 1, justifyContent: 'center', borderColor: '#f44336', color: '#f44336' }}>
                          Delete Clip
                        </button>
                        <button type="button" onClick={startRecordingVoice} className="btn-secondary" style={{ padding: '8px 14px', fontSize: '12px', flex: 1, justifyContent: 'center' }}>
                          Record Again
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Photo Upload preview */}
              <div>
                <label style={{ fontSize: '13px', fontWeight: '600', display: 'block', marginBottom: '8px' }}>Product Cover Photo</label>
                <div 
                  onClick={() => fileInputRef.current.click()}
                  style={{
                    border: '2px dashed var(--cream-border)',
                    borderRadius: 'var(--border-radius-sm)',
                    padding: '24px',
                    textAlign: 'center',
                    background: 'var(--secondary-cream)',
                    cursor: 'pointer',
                    transition: 'var(--transition-fast)'
                  }}
                >
                  {prodImg ? (
                    <img 
                      src={prodImg} 
                      alt="Uploaded product preview" 
                      style={{ height: '100px', margin: '0 auto', objectFit: 'cover', borderRadius: '4px' }}
                    />
                  ) : (
                    <div style={{ color: 'var(--warm-charcoal-muted)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                      <FiUploadCloud size={32} style={{ color: 'var(--primary-terracotta)' }} />
                      <span style={{ fontSize: '12px', fontWeight: '600' }}>Upload image file (JPEG, PNG under 2MB)</span>
                    </div>
                  )}
                  <input 
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    style={{ display: 'none' }}
                  />
                </div>
              </div>

              <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '14px', marginTop: '10px' }}>
                Publish Creation Live
              </button>

            </form>
          </div>

        </div>

        {/* 3. BOTTOM SECTION: ACTIVE LISTINGS PREVIEWS */}
        {sellerProducts.length > 0 && (
          <div className="seller-listed-section">
            <h3 className="serif-title" style={{ fontSize: '24px', marginBottom: '24px' }}>Your Listed Creations</h3>
            <div className="curation-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
              {sellerProducts.map(prod => (
                <div key={prod.id} className="product-card-container">
                  <div className="product-card-image-wrap">
                    <img src={prod.images[0]} alt={prod.title} />
                  </div>
                  <div className="product-card-details">
                    <span className="product-card-category">{prod.category} • {prod.district}</span>
                    <h4 className="product-card-title">{prod.title}</h4>
                    <div className="product-card-meta">
                      <span className="product-card-price">{formatPrice(prod.price)}</span>
                      <span className="product-card-rating">
                        <FiStar style={{ fill: 'var(--gold-accent)', color: 'var(--gold-accent)' }} />
                        <strong>{prod.rating}</strong>
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </section>

    </div>
  );
};

export default Seller;
