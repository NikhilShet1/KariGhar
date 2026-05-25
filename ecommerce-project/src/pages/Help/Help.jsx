import React from 'react';
import { FiUploadCloud, FiDollarSign, FiTruck, FiShield } from 'react-icons/fi';
import '../../styles/help.css';

const Help = () => {
  return (
    <div className="container" style={{ animation: 'fadeIn 0.6s ease-out' }}>
      <div className="help-page-layout" style={{ gridTemplateColumns: '1fr', maxWidth: '850px', margin: '0 auto' }}>
        
        {/* LEFT COLUMN: SUPPORT HUB DETAILS */}
        <div className="support-hub-content" style={{ width: '100%' }}>
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
              src="/images/meera-devi-potter.png" 
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

      </div>
    </div>
  );
};

export default Help;
