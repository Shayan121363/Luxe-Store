import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import './CartPage.css';

const PLACEHOLDER = 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=200&h=200&fit=crop';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, clearCart, subtotal, shippingCost, tax, total } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!user) {
      toast.error('Please sign in to checkout');
      navigate('/login');
      return;
    }
    navigate('/checkout');
  };

  if (cart.length === 0) {
    return (
      <div className="cart-page">
        <div className="container">
          <div className="empty-state" style={{ paddingTop: 120 }}>
            <div className="icon">🛒</div>
            <h3>Your cart is empty</h3>
            <p>Discover our amazing products and add them to your cart</p>
            <Link to="/products" className="btn btn-primary" style={{ marginTop: 24 }}>Start Shopping</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        <div className="cart-header">
          <h1>Shopping Cart</h1>
          <button className="btn btn-ghost btn-sm" onClick={() => { clearCart(); toast.success('Cart cleared'); }}>
            Clear All
          </button>
        </div>

        <div className="cart-layout">
          {/* Cart Items */}
          <div className="cart-items">
            {cart.map(item => (
              <div key={item.productId} className="cart-item fade-in">
                <Link to={`/products/${item.productId}`} className="cart-item__img-wrap">
                  <img
                    src={item.image || PLACEHOLDER}
                    alt={item.name}
                    onError={e => { e.target.src = PLACEHOLDER; }}
                  />
                </Link>
                <div className="cart-item__info">
                  <Link to={`/products/${item.productId}`} className="cart-item__name">{item.name}</Link>
                  <p className="cart-item__price">${item.price.toFixed(2)} each</p>
                </div>
                <div className="cart-item__controls">
                  <div className="qty-control">
                    <button className="qty-btn" onClick={() => updateQuantity(item.productId, item.quantity - 1)}>−</button>
                    <input className="qty-value" value={item.quantity} readOnly />
                    <button className="qty-btn" onClick={() => updateQuantity(item.productId, Math.min(item.stock, item.quantity + 1))}>+</button>
                  </div>
                  <p className="cart-item__total">${(item.price * item.quantity).toFixed(2)}</p>
                  <button
                    className="cart-item__remove"
                    onClick={() => { removeFromCart(item.productId); toast.success('Item removed'); }}
                    title="Remove"
                  >✕</button>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <aside className="cart-summary">
            <h3>Order Summary</h3>

            <div className="summary-lines">
              <div className="summary-line">
                <span>Subtotal ({cart.reduce((s,i) => s + i.quantity, 0)} items)</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="summary-line">
                <span>Shipping</span>
                <span className={shippingCost === 0 ? 'free' : ''}>
                  {shippingCost === 0 ? 'FREE' : `$${shippingCost.toFixed(2)}`}
                </span>
              </div>
              <div className="summary-line">
                <span>Tax (8%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
            </div>

            {subtotal < 50 && shippingCost > 0 && (
              <div className="free-shipping-msg">
                Add <strong>${(50 - subtotal).toFixed(2)}</strong> more for free shipping!
                <div className="shipping-progress">
                  <div className="shipping-progress__bar" style={{ width: `${Math.min((subtotal / 50) * 100, 100)}%` }} />
                </div>
              </div>
            )}

            <hr className="divider" />
            <div className="summary-total">
              <span>Total</span>
              <span className="total-price">${total.toFixed(2)}</span>
            </div>

            <button className="btn btn-primary btn-full btn-lg" onClick={handleCheckout}>
              Proceed to Checkout →
            </button>
            <Link to="/products" className="btn btn-ghost btn-full" style={{ marginTop: 8, textAlign: 'center' }}>
              ← Continue Shopping
            </Link>

            <div className="security-badge">
              🔒 Secured by Stripe
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}