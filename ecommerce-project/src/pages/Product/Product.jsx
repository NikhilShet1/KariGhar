import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useProducts } from '../../context/ProductContext';
import { useCart } from '../../context/CartContext';
import { formatPrice } from '../../utils/helpers';
import { FiStar, FiShoppingCart, FiHeart, FiX, FiInfo } from 'react-icons/fi';
import toast from 'react-hot-toast';
import '../../styles/product.css';

const Product = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getProductById, getArtisanById, getReviewsForProduct, addReview, products } = useProducts();
  const { addToCart } = useCart();

  const product = getProductById(id);
  const artisan = product ? getArtisanById(product.artisanId) : null;
  const productReviews = product ? getReviewsForProduct(product.id) : [];

  // Page States
  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [artisanModalOpen, setArtisanModalOpen] = useState(false);

  // Review Form States
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewName, setNewReviewName] = useState('');
  const [newReviewText, setNewReviewText] = useState('');

  // Scroll to top on product change
  useEffect(() => {
    setActiveImgIndex(0);
    setQuantity(1);
  }, [id]);

  if (!product) {
    return (
      <div style={{ padding: '80px 0', textAlignment: 'center' }} className="container text-center">
        <h2 className="serif-title" style={{ fontSize: '32px', marginBottom: '16px' }}>Creation Not Found</h2>
        <p style={{ color: 'var(--warm-charcoal-muted)', marginBottom: '24px' }}>The handcrafted item you are looking for does not exist in our catalog.</p>
        <Link to="/collections" className="btn-primary">Back to Collections</Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, quantity);
    toast.success(`Added ${quantity} x ${product.title} to cart!`);
  };

  const handleWishlistToggle = () => {
    setIsWishlisted(!isWishlisted);
    toast.success(
      isWishlisted ? "Removed from your collector wishlist." : "Added to your collector wishlist!",
      {
        icon: <FiHeart style={{ fill: isWishlisted ? 'none' : 'var(--primary-terracotta)', color: 'var(--primary-terracotta)' }} />
      }
    );
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!newReviewName.trim() || !newReviewText.trim()) {
      toast.error("Please fill in both name and review comment.");
      return;
    }

    addReview(product.id, newReviewRating, newReviewName, newReviewText);
    toast.success("Thank you! Your verified collector review has been appended.");
    
    // Reset Form & Close
    setNewReviewRating(5);
    setNewReviewName('');
    setNewReviewText('');
    setReviewModalOpen(false);
  };

  // Filter 4 products from same category/collection for related shelf
  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="container" style={{ animation: 'fadeIn 0.6s ease-out' }}>
      
      {/* BREADCRUMBS */}
      <div className="product-breadcrumbs">
        <Link to="/">Home</Link> / <Link to="/collections">Collections</Link> / <span style={{ color: 'var(--primary-terracotta)', fontWeight: '600' }}>{product.title}</span>
      </div>

      {/* TOP SECTION (SPLIT MAIN HERO) */}
      <section className="product-main-container">
        
        {/* Left Column: Media Gallery */}
        <div className="product-gallery-wrap">
          <img 
            src={product.images ? product.images[activeImgIndex] : ""} 
            alt={product.title} 
            className="product-main-image"
          />
          
          <div className="product-thumbnails-row">
            {product.images && product.images.map((img, idx) => (
              <img 
                key={idx}
                src={img}
                alt={`${product.title} detail ${idx + 1}`}
                className={`product-thumb-item ${activeImgIndex === idx ? 'active' : ''}`}
                onClick={() => setActiveImgIndex(idx)}
              />
            ))}
          </div>
        </div>

        {/* Right Column: Descriptions & Actions */}
        <div className="product-details-wrap">
          <span className="product-origin-label">{product.subtitle || "HAND-THROWN • KUTCH"}</span>
          <h1 className="product-main-title">{product.title}</h1>
          
          <div className="product-stars-row">
            <span className="stars-container">
              {Array.from({ length: 5 }).map((_, i) => (
                <FiStar key={i} style={{ fill: i < Math.floor(product.rating) ? 'var(--gold-accent)' : 'none' }} />
              ))}
            </span>
            <strong>{product.rating} Rating</strong>
            <span style={{ color: 'var(--warm-charcoal-muted)' }}>({productReviews.length} collector reviews)</span>
          </div>

          <div className="product-price-tag">{formatPrice(product.price)}</div>

          <p className="product-story-quote">{product.description}</p>

          <div className="product-badges-row">
            {product.tags && product.tags.map(tag => (
              <span 
                key={tag} 
                className={tag === 'Eco-friendly' || tag === 'Sustainable' ? 'badge-eco' : 'badge-handmade'}
              >
                {tag}
              </span>
            ))}
          </div>

          <span className="product-stock-banner">
            <FiCheck /> {product.stockStatus}
          </span>

          <div className="product-actions-row">
            {/* Quantity pick controls */}
            <div className="quantity-picker-wrap">
              <button 
                onClick={() => setQuantity(q => Math.max(q - 1, 1))}
                style={{ cursor: 'pointer' }}
              >
                -
              </button>
              <span>{quantity}</span>
              <button 
                onClick={() => setQuantity(q => q + 1)}
                style={{ cursor: 'pointer' }}
              >
                +
              </button>
            </div>

            {/* Add to Cart button */}
            <button 
              onClick={handleAddToCart}
              className="btn-primary" 
              style={{ flex: 1, padding: '16px', justifyContent: 'center' }}
            >
              <FiShoppingCart size={18} /> Add to Cart • {formatPrice(product.price * quantity)}
            </button>

            {/* Wishlist toggle heart button */}
            <button 
              onClick={handleWishlistToggle}
              className="btn-wishlist"
              title="Add to Wishlist"
            >
              <FiHeart style={{ fill: isWishlisted ? 'var(--primary-terracotta)' : 'none', color: isWishlisted ? 'var(--primary-terracotta)' : 'inherit' }} />
            </button>
          </div>

        </div>

      </section>



      {/* CROSS-SELLS: RELATED SHELF */}
      {relatedProducts.length > 0 && (
        <section className="related-section">
          <h3 className="serif-title" style={{ fontSize: '26px', marginBottom: '24px' }}>From the Same Collection</h3>
          <div className="curation-grid" style={{ gridTemplateColumns: `repeat(${relatedProducts.length}, 1fr)` }}>
            {relatedProducts.map(prod => (
              <Link to={`/product/${prod.id}`} key={prod.id} className="product-card-container">
                <div className="product-card-image-wrap">
                  <img src={prod.images ? prod.images[0] : ""} alt={prod.title} />
                  <button 
                    onClick={(e) => handleAddToCart(e, prod)}
                    className="product-card-add-btn"
                    title="Add to Cart"
                  >
                    <FiShoppingCart size={18} />
                  </button>
                </div>
                <div className="product-card-details">
                  <span className="product-card-category">{prod.category}</span>
                  <h4 className="product-card-title">{prod.title}</h4>
                  <div className="product-card-meta">
                    <span className="product-card-price">{formatPrice(prod.price)}</span>
                    <span className="product-card-rating">
                      <FiStar style={{ fill: 'var(--gold-accent)', color: 'var(--gold-accent)' }} />
                      <strong>{prod.rating}</strong>
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* REVIEWS & COLLECTOR FEEDBACK */}
      <section className="reviews-section">
        <h3 className="serif-title" style={{ fontSize: '26px', marginBottom: '24px' }}>What our collectors say</h3>
        
        {/* Cumulative Rating Board */}
        <div className="reviews-dashboard">
          
          <div className="reviews-summary-score">
            <h2 style={{ fontSize: '48px', color: 'var(--primary-terracotta)' }}>{product.rating}</h2>
            <div className="stars-container" style={{ margin: '8px 0', fontSize: '18px' }}>
              {Array.from({ length: 5 }).map((_, i) => (
                <FiStar key={i} style={{ fill: i < Math.floor(product.rating) ? 'var(--gold-accent)' : 'none' }} />
              ))}
            </div>
            <p style={{ fontSize: '14px', color: 'var(--warm-charcoal-muted)' }}>Based on {productReviews.length} reviews</p>
            <button 
              onClick={() => setReviewModalOpen(true)}
              className="btn-primary" 
              style={{ marginTop: '16px', padding: '10px 20px', fontSize: '13px' }}
            >
              Write a Review
            </button>
          </div>

          <div className="reviews-bars-list">
            <div className="review-bar-item">
              <span>5 Star</span>
              <div className="bar-track"><div className="bar-fill" style={{ width: '85%' }}></div></div>
              <span>85%</span>
            </div>
            <div className="review-bar-item">
              <span>4 Star</span>
              <div className="bar-track"><div className="bar-fill" style={{ width: '10%' }}></div></div>
              <span>10%</span>
            </div>
            <div className="review-bar-item">
              <span>3 Star</span>
              <div className="bar-track"><div className="bar-fill" style={{ width: '5%' }}></div></div>
              <span>5%</span>
            </div>
          </div>

        </div>

        {/* Individual Reviews Cards List */}
        <div className="reviews-list-container">
          {productReviews.length === 0 ? (
            <p style={{ textAlign: 'center', color: 'var(--warm-charcoal-muted)', fontStyle: 'italic', padding: '24px' }}>
              No collector reviews yet. Be the first to share your thoughts on this masterpiece!
            </p>
          ) : (
            productReviews.map(review => (
              <div key={review.id} className="review-item-card">
                <div className="review-card-header">
                  <div>
                    <h4 style={{ fontSize: '15px', fontWeight: '600' }}>{review.reviewerName}</h4>
                    <span style={{ fontSize: '11px', color: 'var(--primary-terracotta)', fontWeight: '600' }}>{review.date}</span>
                  </div>
                  <div className="stars-container" style={{ fontSize: '13px' }}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <FiStar key={i} style={{ fill: i < review.rating ? 'var(--gold-accent)' : 'none' }} />
                    ))}
                  </div>
                </div>
                <p style={{ fontSize: '14px', color: 'var(--warm-charcoal)', lineHeight: '1.6', marginTop: '10px' }}>
                  "{review.text}"
                </p>
              </div>
            ))
          )}
        </div>

      </section>

      {/* DYNAMIC WRITE A REVIEW MODAL */}
      {reviewModalOpen && (
        <div className="story-modal-overlay" onClick={() => setReviewModalOpen(false)}>
          <div className="story-modal-card" style={{ maxWidth: '500px' }} onClick={(e) => e.stopPropagation()}>
            <button className="story-modal-close" onClick={() => setReviewModalOpen(false)} title="Close Modal">
              <FiX />
            </button>
            <div className="story-modal-body">
              <h2 className="serif-title" style={{ fontSize: '26px', marginBottom: '8px' }}>Write a Review</h2>
              <p style={{ color: 'var(--warm-charcoal-muted)', fontSize: '13px', marginBottom: '16px' }}>Share your experience with this unique handcrafted masterpiece.</p>
              
              <form onSubmit={handleReviewSubmit}>
                
                {/* Rating Pick Row */}
                <div>
                  <label style={{ fontSize: '14px', fontWeight: '600' }}>Select Rating:</label>
                  <div className="review-stars-picker">
                    {[1, 2, 3, 4, 5].map(idx => (
                      <FiStar 
                        key={idx}
                        className={newReviewRating >= idx ? 'active' : ''}
                        onClick={() => setNewReviewRating(idx)}
                      />
                    ))}
                  </div>
                </div>

                {/* Name */}
                <div>
                  <label style={{ fontSize: '14px', fontWeight: '600', display: 'block', marginBottom: '6px' }}>Your Name</label>
                  <input 
                    type="text"
                    placeholder="e.g. Ananya Gupta"
                    value={newReviewName}
                    onChange={(e) => setNewReviewName(e.target.value)}
                    className="review-form-input"
                    required
                  />
                </div>

                {/* Text comment */}
                <div>
                  <label style={{ fontSize: '14px', fontWeight: '600', display: 'block', marginBottom: '6px' }}>Collector Review</label>
                  <textarea 
                    placeholder="Describe the texture, weight, detail, and packaging..."
                    value={newReviewText}
                    onChange={(e) => setNewReviewText(e.target.value)}
                    className="review-form-input"
                    rows={4}
                    style={{ resize: 'none', height: '100px' }}
                    required
                  />
                </div>

                <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '12px', marginTop: '8px' }}>
                  Submit Review
                </button>

              </form>
            </div>
          </div>
        </div>
      )}

      {/* DYNAMIC ARTISAN VIDEO STORY MODAL */}
      {artisanModalOpen && artisan && (
        <div className="story-modal-overlay" onClick={() => setArtisanModalOpen(false)}>
          <div className="story-modal-card" onClick={(e) => e.stopPropagation()}>
            <button className="story-modal-close" onClick={() => setArtisanModalOpen(false)} title="Close Modal">
              <FiX />
            </button>
            <div className="story-modal-body">
              <h2 className="serif-title" style={{ fontSize: '32px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <FiInfo style={{ color: 'var(--gold-accent)' }} />
                Story of {artisan.name}
              </h2>
              
              <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', marginTop: '20px' }}>
                <img 
                  src={artisan.photo} 
                  alt={artisan.name} 
                  style={{ width: '220px', height: '220px', objectFit: 'cover', borderRadius: '12px', border: '1px solid var(--gold-accent)' }}
                />
                <div style={{ flex: 1, minWidth: '280px', display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '15px' }}>
                  <p><strong>{artisan.role} • Bhuj, Kutch District</strong></p>
                  <p>{artisan.story}</p>
                  <p style={{ fontStyle: 'italic', color: 'var(--primary-terracotta)' }}>
                    "The clay has its own language. When you hand-throw, you aren't just shaping dirt, you are capturing a breath of history."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Product;
