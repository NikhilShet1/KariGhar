import React, { createContext, useState, useEffect, useContext } from 'react';
import { INITIAL_PRODUCTS, INITIAL_ARTISANS, INITIAL_REVIEWS } from '../utils/constants';

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [artisans, setArtisans] = useState([]);
  const [reviews, setReviews] = useState([]);

  // Initialize from localStorage or fallback to constants
  useEffect(() => {
    const storedProducts = localStorage.getItem('karighar_db_products');
    const storedArtisans = localStorage.getItem('karighar_db_artisans');
    const storedReviews = localStorage.getItem('karighar_db_reviews');

    if (storedProducts) {
      setProducts(JSON.parse(storedProducts));
    } else {
      setProducts(INITIAL_PRODUCTS);
      localStorage.setItem('karighar_db_products', JSON.stringify(INITIAL_PRODUCTS));
    }

    if (storedArtisans) {
      setArtisans(JSON.parse(storedArtisans));
    } else {
      setArtisans(INITIAL_ARTISANS);
      localStorage.setItem('karighar_db_artisans', JSON.stringify(INITIAL_ARTISANS));
    }

    if (storedReviews) {
      setReviews(JSON.parse(storedReviews));
    } else {
      setReviews(INITIAL_REVIEWS);
      localStorage.setItem('karighar_db_reviews', JSON.stringify(INITIAL_REVIEWS));
    }
  }, []);

  // Retrieve product by ID
  const getProductById = (id) => {
    return products.find(prod => prod.id === id);
  };

  // Retrieve artisan by ID
  const getArtisanById = (id) => {
    return artisans.find(art => art.id === id);
  };

  // Retrieve reviews for a product
  const getReviewsForProduct = (productId) => {
    return reviews.filter(rev => rev.productId === productId);
  };

  // Add a new product (Seller functionality)
  const addProduct = (newProdData) => {
    const newProduct = {
      ...newProdData,
      id: newProdData.id || `p-${Date.now()}`,
      rating: 5.0,
      reviewCount: 0,
      images: newProdData.images || ["https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?q=80&w=300"],
      tags: newProdData.tags || ["Handmade", "Eco-friendly"],
      stockStatus: "In stock, ready to ship"
    };

    const updatedProducts = [newProduct, ...products];
    setProducts(updatedProducts);
    localStorage.setItem('karighar_db_products', JSON.stringify(updatedProducts));
    return newProduct;
  };

  // Submit a customer review (Updates local state & re-calculates product scores!)
  const addReview = (productId, rating, reviewerName, text) => {
    const newReview = {
      id: `r-${Date.now()}`,
      productId: productId,
      reviewerName: reviewerName || "Anonymous Collector",
      rating: Number(rating),
      verified: true,
      date: `Verified Buyer - ${new Date().toLocaleString('en-US', { month: 'short', year: 'numeric' })}`,
      text: text
    };

    const updatedReviews = [newReview, ...reviews];
    setReviews(updatedReviews);
    localStorage.setItem('karighar_db_reviews', JSON.stringify(updatedReviews));

    // Recompute product rating & count!
    const productReviews = updatedReviews.filter(rev => rev.productId === productId);
    const avgRating = productReviews.reduce((sum, rev) => sum + rev.rating, 0) / productReviews.length;

    const updatedProducts = products.map(prod => {
      if (prod.id === productId) {
        return {
          ...prod,
          rating: Number(avgRating.toFixed(1)),
          reviewCount: productReviews.length
        };
      }
      return prod;
    });

    setProducts(updatedProducts);
    localStorage.setItem('karighar_db_products', JSON.stringify(updatedProducts));
  };

  return (
    <ProductContext.Provider value={{
      products,
      artisans,
      reviews,
      getProductById,
      getArtisanById,
      getReviewsForProduct,
      addProduct,
      addReview
    }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};
