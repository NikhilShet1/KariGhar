import React, { useState, useEffect, useRef } from 'react';
import { FiUploadCloud, FiDollarSign, FiTruck, FiShield, FiSend, FiGlobe, FiChevronRight } from 'react-icons/fi';
import toast from 'react-hot-toast';
import '../../styles/help.css';

const Help = () => {
  const [messages, setMessages] = useState([
    {
      id: 'm1',
      sender: 'assistant',
      text: "Namaste! I am your KariGhar digital companion. How can I assist your craft today?"
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [language, setLanguage] = useState('English (India)');

  const messagesEndRef = useRef(null);

  // Auto-scroll chatbot to the newest message
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  const handleSendMessage = (textToSend) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    // Append User Message
    const userMsg = {
      id: `m-${Date.now()}`,
      sender: 'user',
      text: text
    };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    // Simulate smart, keyword-aware streaming reply after 1.5 seconds
    setTimeout(() => {
      setIsTyping(false);
      let replyText = "";
      const query = text.toLowerCase();

      if (query.includes('calculate') || query.includes('pricing') || query.includes('price') || query.includes('scarf') || query.includes('scarves')) {
        replyText = "Let's calculate! What is the cost of your raw silk threads? We will add your average weaving hours to recommend a fair price. (Formula: Raw materials + (Hours * ₹150 fair wage) = Recommendation).";
      } else if (query.includes('competitor') || query.includes('insights') || query.includes('market')) {
        replyText = "Varanasi hand-woven silk scarves average between ₹4,500 and ₹9,500 in international collector markets depending on zari thread weight, while Bhuj terracotta vases range from ₹3,000 to ₹7,000 depending on carving details.";
      } else if (query.includes('ship') || query.includes('delicate') || query.includes('fragile') || query.includes('vase') || query.includes('logistics')) {
        replyText = "Delicate items like clay pottery are best wrapped in two layers of organic honeycomb cardboard, cushioned with dried wheat-husks, and sealed in corrugated boxes. KariGhar logistics partners handle fragile items with extreme care.";
      } else if (query.includes('upload') || query.includes('product') || query.includes('sell') || query.includes('story')) {
        replyText = "To showcase your craft, go to your Seller Dashboard and click 'Upload Creation'. Tell the story of your clay or silk source, upload high-res images, and let collectors connect with your hands.";
      } else {
        replyText = "Namaste! That is a wonderful question about our artisan ecosystem. I recommend looking at our Fair-Trade guides in the Support cards, or let me know if you would like me to help compute a material cost!";
      }

      const assistantMsg = {
        id: `m-${Date.now() + 1}`,
        sender: 'assistant',
        text: replyText
      };
      setMessages(prev => [...prev, assistantMsg]);
    }, 1500);
  };

  const handleChipClick = (chipText) => {
    handleSendMessage(chipText);
  };

  const handleLanguageChange = () => {
    const nextLang = language === 'English (India)' ? 'Hindi (हिन्दी)' : 'English (India)';
    setLanguage(nextLang);
    toast.success(`Language assistance changed to ${nextLang}`);
    
    // Companion acknowledges language switch
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const ackMsg = {
        id: `m-${Date.now()}`,
        sender: 'assistant',
        text: nextLang === 'Hindi (हिन्दी)' 
          ? "नमस्ते! अब मैं हिन्दी में आपकी सहायता के लिए तैयार हूँ। आप अपना प्रश्न पूछ सकते हैं।"
          : "Great! I am now ready to assist you in English (India). How can I help you today?"
      };
      setMessages(prev => [...prev, ackMsg]);
    }, 1000);
  };

  return (
    <div className="container" style={{ animation: 'fadeIn 0.6s ease-out' }}>
      <div className="help-page-layout">
        
        {/* 1. LEFT COLUMN: SUPPORT HUB DETAILS */}
        <div className="support-hub-content">
          <div>
            <span className="hero-badge-tag">Artisan Support Hub</span>
            <h1 className="support-hub-title" style={{ marginTop: '12px' }}>How can we help you create?</h1>
            <p className="support-hub-desc" style={{ marginTop: '16px' }}>
              Our Artisan Support Hub is designed to bridge the gap between tradition and the digital world. Whether you need help with fair-trade pricing, eco-packaging, or uploading your story, we are here.
            </p>
          </div>

          {/* 4 support tiles */}
          <div className="help-cards-grid">
            
            <div className="help-card">
              <div className="help-card-icon"><FiUploadCloud /></div>
              <h3 className="help-card-title">Product Upload</h3>
              <p className="help-card-desc">
                Learn how to showcase your craft with high-resolution imagery and ancestral storytelling.
              </p>
            </div>

            <div className="help-card">
              <div className="help-card-icon"><FiDollarSign /></div>
              <h3 className="help-card-title">Pricing Help</h3>
              <p className="help-card-desc">
                Guidance on fair-trade pricing, computing material costs, and global market positioning.
              </p>
            </div>

            <div className="help-card">
              <div className="help-card-icon"><FiTruck /></div>
              <h3 className="help-card-title">Shipping Logistics</h3>
              <p className="help-card-desc">
                Eco-packaging standards and global shipping partners experienced in delicate art handling.
              </p>
            </div>

            <div className="help-card">
              <div className="help-card-icon"><FiShield /></div>
              <h3 className="help-card-title">Artisan Pledge</h3>
              <p className="help-card-desc">
                Our pledge to 100% transparency, heritage preservation, and immediate bank cooperative pay.
              </p>
            </div>

          </div>

          {/* Elegant separator */}
          <div className="help-divider-wrap">
            <div className="help-divider-line"></div>
            <div className="help-divider-flower">❀</div>
          </div>

          {/* Community Success Story */}
          <div className="help-community-story-box">
            <img 
              src="https://images.unsplash.com/photo-1565192647048-f997ded87958?q=80&w=600&auto=format&fit=crop" 
              alt="Pottery hands story" 
              className="help-community-story-img"
            />
            <div className="help-community-story-body">
              <span className="hero-badge-tag" style={{ fontSize: '9px', padding: '4px 10px' }}>Community Story</span>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '22px', margin: '8px 0', color: 'var(--primary-terracotta)' }}>
                Bridging Generations through Digital Presence
              </h3>
              <p style={{ fontSize: '14px', color: 'var(--warm-charcoal-muted)', lineHeight: '1.6' }}>
                How Rao's family pottery workshop in a remote Kutch village reached art collectors in Kyoto and San Francisco, doubling their income and ensuring the children can continue their five-generation legacy.
              </p>
            </div>
          </div>

        </div>

        {/* 2. RIGHT COLUMN: DYNAMIC KARIGHAR ASSISTANT CHATBOT */}
        <div className="chatbot-panel-card">
          
          {/* Header Forest Teal bar */}
          <div className="chatbot-header">
            <div className="chatbot-header-profile">
              <div className="chatbot-avatar" style={{ overflow: 'hidden', padding: 0 }}>
                <img 
                  src="/hearth-assistant-lady.png" 
                  alt="Hearth Assistant Mascot" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                />
              </div>
              <div>
                <h4 style={{ fontSize: '15px', color: 'var(--white-pure)', fontWeight: '600', fontFamily: 'var(--font-sans)' }}>KariGhar Assistant</h4>
                <div style={{ fontSize: '11px', opacity: 0.9 }}>
                  <span className="chatbot-status-dot"></span>Always here to help
                </div>
              </div>
            </div>
            
            <button onClick={handleLanguageChange} style={{ color: 'var(--white-pure)', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: '600' }}>
              <FiGlobe /> {language === 'English (India)' ? 'A/क' : 'En'}
            </button>
          </div>

          {/* Messages Track */}
          <div className="chatbot-messages-track">
            {messages.map(msg => (
              <div key={msg.id} className={`chat-bubble ${msg.sender}`}>
                {msg.text}
              </div>
            ))}

            {/* typing... animation bubble */}
            {isTyping && (
              <div className="typing-bubble assistant">
                <span></span>
                <span></span>
                <span></span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick interactive action chips */}
          <div className="chat-chips-scroll-row">
            <button onClick={() => handleChipClick("Calculate Materials")} className="chat-suggest-chip">
              Calculate Materials
            </button>
            <button onClick={() => handleChipClick("Competitor Insights")} className="chat-suggest-chip">
              Competitor Insights
            </button>
          </div>

          {/* Bottom input form */}
          <div className="chat-input-bar">
            <input 
              type="text" 
              placeholder="Type your question..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              className="chat-text-input"
              disabled={isTyping}
            />
            <button 
              onClick={() => handleSendMessage()} 
              className="chat-btn-send"
              disabled={isTyping || !inputText.trim()}
              title="Send Message"
            >
              <FiSend />
            </button>
          </div>

          {/* Current language label */}
          <div style={{
            fontSize: '11px',
            color: 'var(--warm-charcoal-muted)',
            textAlign: 'center',
            padding: '8px 24px',
            background: 'var(--white-pure)',
            borderTop: '1px solid var(--cream-border)',
            display: 'flex',
            justifyContent: 'space-between'
          }}>
            <span>Current Language: <strong>{language}</strong></span>
            <button onClick={handleLanguageChange} style={{ color: 'var(--primary-terracotta)', fontWeight: '700' }}>Change</button>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Help;
