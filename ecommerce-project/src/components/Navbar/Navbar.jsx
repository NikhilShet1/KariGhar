import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useProducts } from '../../context/ProductContext';
import { formatPrice } from '../../utils/helpers';
import '../../styles/navbar.css';

// React Icons
import { FiSearch, FiShoppingCart, FiGlobe, FiUser, FiLogOut, FiMenu, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';

const Navbar = () => {
  const navigate = useNavigate();
  const { toggleCart, totalItemsCount } = useCart();
  const { user, isLoggedIn, logout } = useAuth();
  const { products } = useProducts();

  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const searchContainerRef = useRef(null);

  // Filter products based on search query for real-time suggestions dropdown
  useEffect(() => {
    if (searchQuery.trim().length > 1) {
      const filtered = products.filter(p =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5); // Max 5 suggestions
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  }, [searchQuery, products]);

  // Handle outside clicks to close search suggestions
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchFocused(false);
      navigate(`/collections?search=${encodeURIComponent(searchQuery)}`);
      toast.success(`Showing results for "${searchQuery}"`);
    }
  };

  const handleSuggestionClick = (productId) => {
    setSearchQuery('');
    setSuggestions([]);
    setIsSearchFocused(false);
    navigate(`/product/${productId}`);
  };

  const handleLanguageToggle = () => {
    toast.success("Language switched to English (India) • Hindi assistance active", {
      icon: <FiGlobe style={{ color: 'var(--gold-accent)' }} />
    });
  };

  return (
    <header className="header-nav">
      <div className="nav-container container">

        {/* Logo */}
        <Link to="/" className="nav-logo">
          KariGhar<span>.</span>
        </Link>

        {/* Navigation Menu */}
        <nav>
          <ul className={`nav-menu ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
            <li>
              <NavLink to="/" onClick={() => setIsMobileMenuOpen(false)} className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                Our Story
              </NavLink>
            </li>
            <li>
              <NavLink to="/collections" onClick={() => setIsMobileMenuOpen(false)} className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                Collections
              </NavLink>
            </li>
            <li>
              <NavLink to="/help" onClick={() => setIsMobileMenuOpen(false)} className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                Workshops
              </NavLink>
            </li>
            <li>
              <NavLink to="/artisans" onClick={() => setIsMobileMenuOpen(false)} className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                Artisans
              </NavLink>
            </li>
          </ul>
        </nav>

        {/* Dynamic Search Box with Dropdown Overlay */}
        <div className="nav-search-wrapper" ref={searchContainerRef}>
          <form onSubmit={handleSearchSubmit} className="nav-search-bar">
            <FiSearch size={18} />
            <input
              type="text"
              placeholder="Search crafts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
            />
          </form>

          {/* Live Search Suggestions Dropdown */}
          {isSearchFocused && suggestions.length > 0 && (
            <div className="search-suggestions-overlay">
              <div className="suggestion-header">Suggested Crafts</div>
              <div className="suggestion-list">
                {suggestions.map(prod => (
                  <div
                    key={prod.id}
                    className="suggestion-item"
                    onClick={() => handleSuggestionClick(prod.id)}
                    style={{ cursor: 'pointer' }}
                  >
                    <img
                      src={prod.images ? prod.images[0] : ""}
                      alt={prod.title}
                      className="suggestion-thumb"
                    />
                    <div className="suggestion-details">
                      <div className="suggestion-title">{prod.title}</div>
                      <div className="suggestion-price">{formatPrice(prod.price)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Action Icons */}
        <div className="nav-actions">

          {/* Language Toggle */}
          <button className="nav-btn-icon" onClick={handleLanguageToggle} title="Language Select">
            <FiGlobe />
          </button>

          {/* Cart Icon with badge counts */}
          <button className="nav-btn-icon" onClick={toggleCart} title="Shopping Cart">
            <FiShoppingCart />
            {totalItemsCount > 0 && (
              <span className="nav-cart-badge">{totalItemsCount}</span>
            )}
          </button>

          {/* Auth/Profile Toggle */}
          {isLoggedIn ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <img
                src={user?.avatar}
                alt={user?.name}
                className="nav-profile-avatar"
                onClick={() => navigate('/profile')}
                title={`${user?.name} (${user?.role})`}
              />
              <button
                className="nav-btn-icon"
                onClick={() => { logout(); toast.success("Successfully signed out."); navigate('/'); }}
                title="Sign Out"
                style={{ fontSize: '18px', width: '32px', height: '32px' }}
              >
                <FiLogOut />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Link to="/login" className="nav-btn-icon" title="Login / Register">
                <FiUser />
              </Link>
            </div>
          )}

          {/* Hamburger Menu Toggle (Mobile only) */}
          <button
            className="nav-hamburger-btn"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <FiX /> : <FiMenu />}
          </button>

        </div>

      </div>
    </header>
  );
};

export default Navbar;
