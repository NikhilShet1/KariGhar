import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FiSend, FiX, FiMessageCircle, FiBookOpen, FiHelpCircle, FiChevronRight, FiGlobe } from 'react-icons/fi';
import toast from 'react-hot-toast';
import './karigharbot.css';

const KariGharBot = () => {
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

  // Handle Custom Question Submissions — calls Gemini API with website context
  const handleSendMessage = async (textToSend) => {
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

    try {
      const response = await fetch('http://localhost:5000/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transcript: text,
          page: location.pathname,
          language: language,
        }),
      });

      const data = await response.json();
      const replyText = data.reply || "I'm sorry, I couldn't generate a response right now.";

      setIsTyping(false);
      const assistantMsg = {
        id: `a-${Date.now()}`,
        sender: 'assistant',
        text: replyText
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      console.error('Gemini chat error:', err);
      setIsTyping(false);
      const fallbackMsg = {
        id: `a-${Date.now()}`,
        sender: 'assistant',
        text: "Namaste! I'm having trouble connecting right now. Please try again in a moment, or explore our Help page for FAQs. 🙏"
      };
      setMessages(prev => [...prev, fallbackMsg]);
    }
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
    <div className="karigharbot-wrapper">
      
      {/* 1. FLOATING Figurine TRIGGER (Closed State) */}
      {!isOpen && (
        <div className="karigharbot-trigger-wrap">
          {showTooltip && (
            <div className="karigharbot-floating-tooltip">
              <span className="tooltip-close" onClick={(e) => { e.stopPropagation(); setShowTooltip(false); }}>&times;</span>
              <strong>Facing any problem?</strong> Tap me, I'm here to guide you! ❀
            </div>
          )}
          
          <button className="karigharbot-avatar-trigger" onClick={() => { setIsOpen(true); setShowTooltip(false); }} title="Open KariGhar Companion">
            <img src="/karighar-assistant-lady.png" alt="KariGhar Assistant Standing Figurine" className="bot-lady-avatar-img" />
            <span className="bot-status-indicator pulse-green"></span>
          </button>
        </div>
      )}

      {/* 2. CHAT OVERLAY WINDOW + STANDING MASCOT (Open State) */}
      {isOpen && (
        <div className="karigharbot-active-container">
          
          {/* A. Chat Window Card */}
          <div className="karigharbot-chat-window animate-slide-up">
            
            {/* Header */}
            <div className="karigharbot-header-bar">
              <div className="bot-profile-info">
                <div className="bot-avatar-circle">
                  <img src="/karighar-assistant-lady.png" alt="KariGhar Lady Avatar" className="bot-header-img" />
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
            <div className="karigharbot-messages-track">
              {messages.map(msg => (
                <div key={msg.id} className={`karighar-bubble ${msg.sender}`}>
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
                <div className="karighar-typing-indicator karighar-bubble assistant">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Suggestion action chips */}
            <div className="karigharbot-chips-container">
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
            <div className="karigharbot-input-bar">
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
          <div className="karigharbot-mascot-niche">
            <img src="/karighar-assistant-lady.png" alt="KariGhar Assistant Mascot" className="bot-lady-avatar-img" />
            <span className="bot-status-indicator pulse-green" style={{ top: '10px', right: '10px' }}></span>
          </div>

        </div>
      )}

    </div>
  );
};

export default KariGharBot;
