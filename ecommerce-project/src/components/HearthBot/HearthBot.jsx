import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FiSend, FiX, FiMessageCircle, FiBookOpen, FiHelpCircle, FiChevronRight, FiGlobe } from 'react-icons/fi';
import toast from 'react-hot-toast';
import './hearthbot.css';

const HearthBot = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [language, setLanguage] = useState('English (India)');
  
  // Custom chat history
  const [messages, setMessages] = useState([
    {
      id: 'm1',
      sender: 'assistant',
      text: "Namaste! I am your KariGhar heritage companion. How can I help you navigate our artisan marketplace today? ❀"
    }
  ]);

  const messagesEndRef = useRef(null);

  const handleLanguageChange = () => {
    const nextLang = language === 'English (India)' ? 'Hindi (हिन्दी)' : 'English (India)';
    setLanguage(nextLang);
    toast.success(`Language assistance changed to ${nextLang}`);
    
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const ackMsg = {
        id: `a-lang-${Date.now()}`,
        sender: 'assistant',
        text: nextLang === 'Hindi (हिन्दी)' 
          ? "नमस्ते! अब मैं हिन्दी में आपकी सहायता के लिए तैयार हूँ। आप अपना प्रश्न पूछ सकते हैं। ❀"
          : "Great! I am now ready to assist you in English (India). How can I help you today? ❀"
      };
      setMessages(prev => [...prev, ackMsg]);
    }, 1000);
  };

  // Auto-scroll to newest message
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  // Hide the floating tooltip after 10 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTooltip(false);
    }, 10000);
    return () => clearTimeout(timer);
  }, []);

  // Adapt introduction message & chips based on current active route!
  useEffect(() => {
    let introText = "Namaste! I am your KariGhar digital companion. How can I help you navigate our artisan marketplace today? ❀";
    const path = location.pathname;

    if (path === '/') {
      introText = "Welcome to KariGhar! I can guide you through our artisan stories, help you browse handcraft categories, or explain our direct fair-trade model. How can I assist you? ❀";
    } else if (path === '/categories') {
      introText = "Browsing our curation grid? You can filter crafts by specific Indian districts or use the sliding pricing scale to match your budget. Need help finding something unique? ❀";
    } else if (path.startsWith('/product/')) {
      introText = "This heritage creation is hand-made with regional organic materials! Would you like to review the 3-stage artisanal crafting process or check shipping safety? ❀";
    } else if (path === '/seller') {
      introText = "Namaste Partner! In your Artisan Workspace, you can compute a regional living wage using our Fair-Trade Pricing Tool, generate direct WhatsApp chat links, or record an audio description. Need help? ❀";
    } else if (path === '/help') {
      introText = "You have reached the Support Hub! I am sync-enabled in Hindi and English. Type any question below or click a quick chip to stream an instant reply! ❀";
    } else if (path === '/login' || path === '/signup') {
      introText = "Welcome to our Namaste Authentication panel! You can easily register as a Customer or Seller, upload your profile picture, and enter the mock OTP code '1234' to verify. ❀";
    }

    setMessages([
      {
        id: 'intro-auto',
        sender: 'assistant',
        text: introText
      }
    ]);
  }, [location.pathname]);

  // Handle Custom Question Submissions
  const handleSendMessage = (textToSend) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    // Add user message
    const userMsg = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: text
    };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    // Keyword matching & streaming answer simulator
    setTimeout(() => {
      setIsTyping(false);
      let replyText = "";
      const query = text.toLowerCase();
      const isHindi = language === 'Hindi (हिन्दी)';

      if (isHindi) {
        if (query.includes('pricing') || query.includes('calculate') || query.includes('fair') || query.includes('wage') || query.includes('मूल्य') || query.includes('गणना')) {
          replyText = "कारीघर उचित मूल्य की गारंटी देता है! सेलर पेज पर आप मूल्य कैलकुलेटर का उपयोग कर सकते हैं जिसमें कच्चे माल और ₹150/घंटा श्रम शामिल है।";
        } else if (query.includes('how to use') || query.includes('guide') || query.includes('problem') || query.includes('stuck') || query.includes('error') || query.includes('उपयोग') || query.includes('मदद')) {
          replyText = "कोई चिंता नहीं! यदि आप खरीदना चाहते हैं, तो बस कार्ट में उत्पाद जोड़ें और 'प्लेस ऑर्डर' पर क्लिक करें। यदि आप एक कारीगर हैं, तो अपने उत्पाद अपलोड करने के लिए सेलर डैशबोर्ड का उपयोग करें।";
        } else if (query.includes('ship') || query.includes('delivery') || query.includes('packaging') || query.includes('वितरण') || query.includes('भेजना')) {
          replyText = "हम नाजुक वस्तुओं (जैसे भुज मिट्टी के बर्तन) के लिए 100% जैविक बायोडिग्रेडेबल हनीकॉम्ब कार्डबोर्ड का उपयोग करते हैं।";
        } else {
          replyText = "यह एक बहुत अच्छा प्रश्न है! मैं आपकी सहायता के लिए यहाँ हूँ। अधिक जानकारी के लिए आप हमारे सपोर्ट हब (Help) को भी देख सकते हैं।";
        }
      } else {
        // Smart responses matching the user's intent (English)
        if (query.includes('how to use') || query.includes('guide') || query.includes('problem') || query.includes('stuck') || query.includes('error')) {
          replyText = "No worries! If you're looking to purchase, simply add a creation to your cart and click 'Place Order' in the slide-out drawer (we support mock payment validation!). If you're an artisan, use the Seller Dashboard to upload your products.";
        } else if (query.includes('pricing') || query.includes('calculate') || query.includes('fair') || query.includes('wage')) {
          replyText = "KariGhar guarantees a fair-trade living wage! On the Seller page, you can use our dynamic pricing calculator which factors in raw materials, packaging, and ₹150/hour crafting labor.";
        } else if (query.includes('voice') || query.includes('audio') || query.includes('record')) {
          replyText = "We support audio stories! Sellers can use the built-in browser microphone recorder inside 'Upload Creation' to add custom voice descriptions directly to their listed products.";
        } else if (query.includes('whatsapp') || query.includes('chat') || query.includes('contact')) {
          replyText = "Yes, you can converse directly with artisans! The WhatsApp click-to-chat generator on the Seller page formats and escapes numbers and pre-filled texts automatically.";
        } else if (query.includes('ship') || query.includes('delivery') || query.includes('packaging')) {
          replyText = "We pledge to use 100% organic biodegradable honeycomb cardboard and dried husks cushioning for fragile items like Bhuj pottery. Deliveries are fully tracked global packages.";
        } else if (query.includes('login') || query.includes('otp') || query.includes('verify')) {
          replyText = "To sign in, toggling between Customer/Seller, enter your phone and upload a photo. When prompted for an OTP code, type in our standard mock code: 1234.";
        } else if (query.includes('artisan') || query.includes('meera') || query.includes('parvati')) {
          replyText = "Our master weavers and potters include Parvati Devi (Ajrakh embroidery) and Meera Devi (Kutch terracotta clay). You can click on their stories on the Home or Product pages!";
        } else {
          replyText = "That's a great question! I'm here to ensure your KariGhar journey is seamless. You can also explore our official [Artisan Support Hub](/help) for deep-dive tutorials and Hindi assistance.";
        }
      }

      const assistantMsg = {
        id: `a-${Date.now()}`,
        sender: 'assistant',
        text: replyText
      };
      setMessages(prev => [...prev, assistantMsg]);
    }, 1200);
  };

  const handleChipClick = (chipText) => {
    handleSendMessage(chipText);
  };

  // Get dynamic chips based on current page
  const getPageSuggestChips = () => {
    const path = location.pathname;
    if (path === '/seller') {
      return ["Living Wage Calculator", "WhatsApp Chat Setup", "Voice Recorder Help"];
    } else if (path === '/categories' || path === '/') {
      return ["How to order?", "Direct Fair-Trade?", "Meet Our Artisans"];
    } else if (path.startsWith('/product/')) {
      return ["Fragile Shipping", "Loom Weaving Process", "Review Guidelines"];
    }
    return ["General Website Guide", "OTP Verification", "Packaging Standards"];
  };

  return (
    <div className="hearthbot-wrapper">
      
      {/* 1. FLOATING Figurine TRIGGER (Closed State) */}
      {!isOpen && (
        <div className="hearthbot-trigger-wrap">
          {showTooltip && (
            <div className="hearthbot-floating-tooltip">
              <span className="tooltip-close" onClick={(e) => { e.stopPropagation(); setShowTooltip(false); }}>&times;</span>
              <strong>Facing any problem?</strong> Tap me, I'm here to guide you! ❀
            </div>
          )}
          
          <button className="hearthbot-avatar-trigger" onClick={() => { setIsOpen(true); setShowTooltip(false); }} title="Open KariGhar Companion">
            <img src="/hearth-assistant-lady.png" alt="KariGhar Assistant Standing Figurine" className="bot-lady-avatar-img" />
            <span className="bot-status-indicator pulse-green"></span>
          </button>
        </div>
      )}

      {/* 2. CHAT OVERLAY WINDOW + STANDING MASCOT (Open State) */}
      {isOpen && (
        <div className="hearthbot-active-container">
          
          {/* A. Chat Window Card */}
          <div className="hearthbot-chat-window animate-slide-up">
            
            {/* Header */}
            <div className="hearthbot-header-bar">
              <div className="bot-profile-info">
                <div className="bot-avatar-circle">
                  <img src="/hearth-assistant-lady.png" alt="KariGhar Lady Avatar" className="bot-header-img" />
                </div>
                <div>
                  <h4 className="bot-name-title">KariGhar Assistant</h4>
                  <div className="bot-active-status">
                    <span className="active-dot"></span> Online & Guided Support
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button onClick={handleLanguageChange} style={{ color: 'var(--white-pure)', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: '600', background: 'rgba(255,255,255,0.15)', padding: '4px 8px', borderRadius: '20px', cursor: 'pointer', border: 'none' }} title="Change Language">
                  <FiGlobe /> {language === 'English (India)' ? 'A/क' : 'En'}
                </button>
                <button className="bot-close-btn" onClick={() => setIsOpen(false)} title="Minimize Companion" style={{ cursor: 'pointer' }}>
                  <FiX size={18} />
                </button>
              </div>
            </div>

            {/* Messages Track */}
            <div className="hearthbot-messages-track">
              {messages.map(msg => (
                <div key={msg.id} className={`hearth-bubble ${msg.sender}`}>
                  {msg.text.includes('[') ? (
                    // Simple markdown link parser for specific help button
                    <span>
                      {msg.text.split('[')[0]}
                      <span 
                        className="inline-link" 
                        onClick={() => { navigate('/help'); setIsOpen(false); }}
                      >
                        Artisan Support Hub
                      </span>
                      {msg.text.split(']')[1] || ''}
                    </span>
                  ) : (
                    msg.text
                  )}
                </div>
              ))}

              {isTyping && (
                <div className="hearth-typing-indicator hearth-bubble assistant">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Suggestion action chips */}
            <div className="hearthbot-chips-container">
              {getPageSuggestChips().map((chip, i) => (
                <button 
                  key={i} 
                  className="bot-action-chip"
                  onClick={() => handleChipClick(chip)}
                >
                  {chip}
                </button>
              ))}
            </div>

            {/* Input text form */}
            <div className="hearthbot-input-bar">
              <input 
                type="text" 
                placeholder="Ask a question..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                className="bot-text-field"
                disabled={isTyping}
              />
              <button 
                onClick={() => handleSendMessage()}
                className="bot-send-btn"
                disabled={isTyping || !inputText.trim()}
                title="Submit Inquiry"
              >
                <FiSend />
              </button>
            </div>

            {/* Footer branding */}
            <div className="bot-window-footer">
              Preserving Indian Craft • <strong>KariGhar Companion</strong>
            </div>

          </div>

          {/* B. Standing Arched Figurine Niche (Visual Mascot showing she is presenting the chat panel!) */}
          <div className="hearthbot-mascot-niche">
            <img src="/hearth-assistant-lady.png" alt="KariGhar Assistant Mascot" className="bot-lady-avatar-img" />
            <span className="bot-status-indicator pulse-green" style={{ top: '10px', right: '10px' }}></span>
          </div>

        </div>
      )}

    </div>
  );
};

export default HearthBot;
