import React, { createContext, useState, useEffect, useContext } from 'react';
import { getCartSubtotal, getShippingCost } from '../utils/helpers';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Initialize cart from localStorage on mount
  useEffect(() => {
    const storedCart = localStorage.getItem('karighar_cart');
    if (storedCart) {
      try {
        setCartItems(JSON.parse(storedCart));
      } catch (err) {
        console.error("Failed to parse cart items from localStorage", err);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  const saveCart = (items) => {
    setCartItems(items);
    localStorage.setItem('karighar_cart', JSON.stringify(items));
  };

  // Add a product to the cart
  const addToCart = (product, quantity = 1) => {
    const existingItemIndex = cartItems.findIndex(item => item.id === product.id);
    let updatedItems = [...cartItems];

    if (existingItemIndex > -1) {
      updatedItems[existingItemIndex].quantity += quantity;
    } else {
      updatedItems.push({
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.images ? product.images[0] : "/images/earthen-sanctuary-vase.png",
        subtitle: product.subtitle || "",
        quantity: quantity
      });
    }

    saveCart(updatedItems);
    setIsCartOpen(true); // Automatically open the cart drawer when adding an item
  };

  // Remove an item from the cart
  const removeFromCart = (productId) => {
    const updatedItems = cartItems.filter(item => item.id !== productId);
    saveCart(updatedItems);
  };

  // Update item quantity
  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    const updatedItems = cartItems.map(item => 
      item.id === productId ? { ...item, quantity: newQuantity } : item
    );
    saveCart(updatedItems);
  };

  // Clear the cart (e.g. after successful checkout)
  const clearCart = () => {
    saveCart([]);
  };

  const toggleCart = () => setIsCartOpen(!isCartOpen);
  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  // Computed values
  const subtotal = getCartSubtotal(cartItems);
  const shippingFee = getShippingCost(subtotal);
  const totalAmount = subtotal + shippingFee;
  const totalItemsCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      cartItems,
      isCartOpen,
      subtotal,
      shippingFee,
      totalAmount,
      totalItemsCount,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      toggleCart,
      openCart,
      closeCart
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
