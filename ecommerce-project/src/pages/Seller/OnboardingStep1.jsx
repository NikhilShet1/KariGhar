import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiGlobe, FiBell, FiPlay, FiX } from 'react-icons/fi';
import SellerLayout from './components/SellerLayout';
import VoiceGuidance from './components/VoiceGuidance';
import { useAuth } from '../../context/AuthContext';

const OnboardingStep1 = () => {
  const navigate = useNavigate();
  const { isLoggedIn, user } = useAuth();
  const [fullName, setFullName] = useState(() => localStorage.getItem('karigar_temp_name') || '');
  const [showVideoModal, setShowVideoModal] = useState(false);

  useEffect(() => {
    if (isLoggedIn && user?.role === 'seller') {
      navigate('/seller/dashboard');
    }
  }, [isLoggedIn, user, navigate]);

  useEffect(() => {
    localStorage.setItem('karigar_temp_name', fullName);
  }, [fullName]);

  const handleVoiceInput = (text) => {
    // If the text contains navigation commands
    const cleanText = text.toLowerCase();
    if (cleanText.includes('aage') || cleanText.includes('next') || cleanText.includes('done') || cleanText.includes('proceed')) {
      if (fullName.trim()) {
        navigate('/seller/onboarding-2');
      } else {
        setFullName("Radha Devi"); // default fallback
      }
    } else {
      // Treat text as their name
      // Remove noise phrases
      const name = text.replace(/my name is/i, '')
                       .replace(/मेरा नाम है/g, '')
                       .replace(/मेरा नाम/g, '')
                       .trim();
      setFullName(name);
    }
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setFullName("Radha Devi"); // default fallback
    }
    navigate('/seller/onboarding-2');
  };

  return (
    <SellerLayout onVoiceInput={handleVoiceInput}>
      {/* Top Bar */}
      <div className="flex justify-between items-center w-full py-4 border-b border-[#E5DCD0]/60 z-10">
        <span className="text-2xl font-bold text-[#8B3A1A] tracking-wide karigar-serif cursor-pointer" onClick={() => navigate('/seller')}>
          KariGhar
        </span>
        <div className="flex items-center gap-6 text-[#1A1A1A]">
          <button className="text-xl hover:text-[#8B3A1A]" title="Language Switcher">
            <FiGlobe />
          </button>
          <button className="text-xl hover:text-[#8B3A1A] relative" title="Notifications">
            <FiBell />
            <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-[#8B3A1A]"></span>
          </button>
        </div>
      </div>

      {/* Main Flow Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-12 items-stretch my-auto py-8">
        
        {/* Left Column (60%) */}
        <div className="lg:col-span-6 flex flex-col gap-6 justify-between">
          <div className="flex flex-col gap-4">
            {/* Progress Bar */}
            <div className="progress-bar-container">
              <div className="progress-step active"></div>
              <div className="progress-step"></div>
              <div className="progress-step"></div>
            </div>

            <p className="text-[#8B3A1A] text-lg md:text-xl italic font-semibold karigar-serif">
              "Namaste behen, let's start your journey."
            </p>
            <h2 className="text-4xl md:text-5xl font-bold text-[#1A1A1A] karigar-serif">
              Tell us your name
            </h2>

            {/* Input Card */}
            <form onSubmit={handleNext} className="karigar-card flex flex-col gap-6 mt-2">
              <div className="flex flex-col gap-2">
                <label className="text-lg font-bold text-[#8B3A1A]">Full Name</label>
                <input 
                  type="text" 
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="E.g. Radha Devi"
                  className="karigar-input"
                  required
                />
              </div>
              <p className="text-sm text-[#666666] italic bg-[#FFFDFB] p-3 rounded-xl border border-[#E5DCD0]/40">
                Speak clearly into the microphone or type your name using the keyboard.
              </p>

              <button type="submit" className="karigar-btn-primary self-start px-12 mt-2">
                Next &rarr;
              </button>
            </form>
          </div>

          {/* Need Help Video Section */}
          <div className="flex flex-col gap-3 mt-4">
            <div 
              onClick={() => setShowVideoModal(true)}
              className="video-thumbnail-container relative w-full max-w-sm h-36 bg-[#E5DCD0] flex items-center justify-center border-2 border-white/80 rounded-2xl"
            >
              <img 
                src="/images/meera-devi-potter.png" 
                alt="Help Video Preview" 
                className="w-full h-full object-cover opacity-60"
              />
              <div className="video-play-btn">
                <FiPlay className="ml-1" />
              </div>
              <span className="absolute bottom-3 left-3 bg-[#1A1A1A]/80 text-white text-xs px-3 py-1.5 rounded-full font-bold">
                Need help? Watch: How to use KariGhar
              </span>
            </div>
          </div>

          {/* Voice Guidance Saree Bubble */}
          <div className="mt-4">
            <VoiceGuidance 
              text="Let's create your profile. Please tell your full name." 
              showDots={true}
            />
          </div>
        </div>

        {/* Right Column (40%) */}
        <div className="lg:col-span-4 relative rounded-[32px] overflow-hidden shadow-xl border-4 border-white/60 min-h-[350px] lg:min-h-full">
          <div className="absolute inset-0 bg-gradient-to-t from-[#8B3A1A]/20 to-transparent z-10 pointer-events-none"></div>
          <img 
            src="/images/parvati-devi-weaver.png" 
            alt="Artisanal Handloom Saree Craft" 
            className="w-full h-full object-cover"
          />
        </div>

      </div>

      {/* Video Modal Box */}
      {showVideoModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-2xl relative shadow-2xl animate-fade-in border-4 border-[#8B3A1A]">
            <button 
              onClick={() => setShowVideoModal(false)}
              className="absolute top-4 right-4 text-2xl text-[#1A1A1A] hover:text-[#8B3A1A]"
              title="Close"
            >
              <FiX />
            </button>
            <h3 className="text-2xl font-bold text-[#8B3A1A] karigar-serif mb-4">How to use KariGhar</h3>
            <div className="aspect-video bg-black rounded-2xl flex items-center justify-center text-white relative overflow-hidden">
              {/* Simulated video playback */}
              <iframe 
                className="w-full h-full"
                src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1" 
                title="Help Video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </SellerLayout>
  );
};

export default OnboardingStep1;
