import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    try { return JSON.parse(localStorage.getItem('cart')) || []; }
    catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product, quantity = 1) => {
    setCart(prev => {
      const exists = prev.find(i => i.productId === product._id);
      if (exists) {
        return prev.map(i => i.productId === product._id
          ? { ...i, quantity: Math.min(i.quantity + quantity, product.stock) }
          : i
        );
      }
      return [...prev, {
        productId: product._id,
        name: product.name,
        price: product.price,
        image: product.images?.[0] || '',
        stock: product.stock,
        quantity,
      }];
    });
  };

  const removeFromCart = (productId) => setCart(prev => prev.filter(i => i.productId !== productId));

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) return removeFromCart(productId);
    setCart(prev => prev.map(i => i.productId === productId ? { ...i, quantity } : i));
  };

  const clearCart = () => setCart([]);

  const cartCount = cart.reduce((s, i) => s + i.quantity, 0);
  const subtotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  const shippingCost = subtotal >= 50 ? 0 : subtotal > 0 ? 5.99 : 0;
  const tax = Math.round(subtotal * 0.08 * 100) / 100;
  const total = subtotal + shippingCost + tax;

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, cartCount, subtotal, shippingCost, tax, total }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be inside CartProvider');
  return ctx;
};