import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useProducts } from '../../context/ProductContext';
import { formatPrice } from '../../utils/helpers';
import { FiDollarSign, FiPlusCircle, FiBarChart2, FiAward, FiUploadCloud, FiInfo } from 'react-icons/fi';
import toast from 'react-hot-toast';
import '../../styles/seller.css';

const Seller = () => {
  const navigate = useNavigate();
  const { user, isLoggedIn, demoLogin } = useAuth();
  const { addProduct, products } = useProducts();

  // If not signed in as a seller, prompt to quick-login as Meera Devi
  useEffect(() => {
    if (isLoggedIn && user?.role !== 'Seller') {
      toast.error("Please switch to an Artisan account to access the dashboard.");
    }
  }, [isLoggedIn, user]);

  // Pricing Tool States
  const [materialCost, setMaterialCost] = useState(1200);
  const [loomHours, setLoomHours] = useState(8);
  const [packCost, setPackCost] = useState(250);

  // Upload Form States
  const [prodTitle, setProdTitle] = useState('');
  const [prodCategory, setProdCategory] = useState('Pottery & Ceramics');
  const [prodDistrict, setProdDistrict] = useState('Bhuj');
  const [prodPrice, setProdPrice] = useState('');
  const [prodDesc, setProdDesc] = useState('');
  const [prodImg, setProdImg] = useState(null); // base64 string

  const fileInputRef = useRef(null);

  // Pricing Tool Math (Fair Trade Pricing Model)
  const laborCost = loomHours * 150; // ₹150/hr fair regional craft wage
  const baseCost = materialCost + laborCost + packCost;
  const suggestedPrice = Math.round(baseCost * 1.15); // Add 15% cooperative safety margin

  // Fill Recommended Price into Product Price input
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
      images: prodImg ? [prodImg] : ["https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?q=80&w=300"],
      artisanId: user?.id || 'seller-meera',
      tags: ["Handmade", "Organic Materials"]
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
  };

  const handleSwitchToSeller = () => {
    demoLogin('Seller');
    toast.success("Welcome back to your KariGhar artisan portal, Meera!");
    navigate('/seller');
  };

  if (!isLoggedIn || user?.role !== 'Seller') {
    return (
      <div className="container text-center" style={{ padding: '80px 0', animation: 'fadeIn 0.6s ease-out' }}>
        <h2 className="serif-title" style={{ fontSize: '32px', marginBottom: '16px' }}>Artisan Partner Panel</h2>
        <p style={{ color: 'var(--warm-charcoal-muted)', marginBottom: '24px' }}>
          Please log in as an Artisan Partner to manage your digital shop, view pricing assistance tools, and upload creations.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <Link to="/login" className="btn-primary">Sign In / Register</Link>
          <button onClick={handleSwitchToSeller} className="btn-secondary">Quick Log In as Meera Devi</button>
        </div>
      </div>
    );
  }

  // Filter products listed by this specific seller
  const sellerProducts = products.filter(p => p.artisanId === user.id || p.artisanId === 'meera-devi');

  return (
    <div style={{ animation: 'fadeIn 0.6s ease-out' }}>
      
      {/* HEADER HERO */}
      <section className="seller-hero">
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span className="hero-badge-tag">Artisan Partner Dashboard</span>
            <h1 style={{ marginTop: '10px', fontSize: '36px' }}>Namaste, {user.name}</h1>
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
          
          {/* 1. LEFT SIDE: SALES METRICS & PRICING TOOL */}
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

              {/* Calculator suggested output box */}
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

          </div>

          {/* 2. RIGHT SIDE: UPLOAD CREATION FORM */}
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

              {/* Price with info bubble */}
              <div className="auth-input-group">
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  Selling Price (INR)
                  <FiInfo style={{ color: 'var(--primary-terracotta)' }} title="Suggested: use the Fair-Trade Tool on the left!" />
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
