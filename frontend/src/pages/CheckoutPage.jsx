import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './CheckoutPage.css';

export default function CheckoutPage() {
  const { cart, subtotal, shippingCost, tax, total } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: user?.name || '',
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    zip: user?.address?.zip || '',
    country: user?.address?.country || 'US',
  });

  const update = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (cart.length === 0) return toast.error('Your cart is empty');

    setLoading(true);
    try {
      // Map cart items for API
      const items = cart.map(i => ({ productId: i.productId, quantity: i.quantity }));

      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/payments/create-checkout-session`,
        { items, shippingAddress: form }
      );

      // Redirect to Stripe Checkout
      window.location.href = res.data.url;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Checkout failed. Please try again.');
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="checkout-page">
      <div className="container">
        <div className="checkout-header">
          <h1>Checkout</h1>
          <div className="checkout-steps">
            <span className="step step--active">1. Shipping</span>
            <span className="step-arrow">→</span>
            <span className="step">2. Payment (Stripe)</span>
            <span className="step-arrow">→</span>
            <span className="step">3. Confirmation</span>
          </div>
        </div>

        <div className="checkout-layout">
          {/* Shipping Form */}
          <form onSubmit={handleCheckout} className="shipping-form">
            <div className="form-section">
              <h3>Shipping Information</h3>
              <div className="form-grid">
                <div className="form-group form-grid--full">
                  <label className="form-label">Full Name</label>
                  <input className="form-input" value={form.name} onChange={update('name')} required placeholder="John Doe" />
                </div>
                <div className="form-group form-grid--full">
                  <label className="form-label">Street Address</label>
                  <input className="form-input" value={form.street} onChange={update('street')} required placeholder="123 Main Street" />
                </div>
                <div className="form-group">
                  <label className="form-label">City</label>
                  <input className="form-input" value={form.city} onChange={update('city')} required placeholder="New York" />
                </div>
                <div className="form-group">
                  <label className="form-label">State / Province</label>
                  <input className="form-input" value={form.state} onChange={update('state')} required placeholder="NY" />
                </div>
                <div className="form-group">
                  <label className="form-label">ZIP / Postal Code</label>
                  <input className="form-input" value={form.zip} onChange={update('zip')} required placeholder="10001" />
                </div>
                <div className="form-group">
                  <label className="form-label">Country</label>
                  <select className="form-select" value={form.country} onChange={update('country')}>
                    <option value="US">United States</option>
                    <option value="CA">Canada</option>
                    <option value="GB">United Kingdom</option>
                    <option value="AU">Australia</option>
                    <option value="PK">Pakistan</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="stripe-notice">
              <div className="stripe-notice__icon">🔒</div>
              <div>
                <p className="stripe-notice__title">Secure Payment via Stripe</p>
                <p className="stripe-notice__desc">You'll be redirected to Stripe's secure payment page to complete your purchase. We accept all major credit cards.</p>
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}>
              {loading ? (
                <><span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> Redirecting to Stripe...</>
              ) : (
                `Proceed to Payment → $${total.toFixed(2)}`
              )}
            </button>
          </form>

          {/* Order Summary */}
          <aside className="checkout-summary">
            <h3>Order Summary</h3>
            <div className="checkout-items">
              {cart.map(item => (
                <div key={item.productId} className="checkout-item">
                  <div className="checkout-item__img">
                    <img src={item.image || 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=80&h=80&fit=crop'} alt={item.name} onError={e => { e.target.src = 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=80&h=80&fit=crop'; }} />
                    <span className="checkout-item__qty">{item.quantity}</span>
                  </div>
                  <p className="checkout-item__name">{item.name}</p>
                  <p className="checkout-item__price">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
            <hr className="divider" />
            <div className="checkout-totals">
              <div className="checkout-total-line"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
              <div className="checkout-total-line"><span>Shipping</span><span>{shippingCost === 0 ? <span className="free">FREE</span> : `$${shippingCost.toFixed(2)}`}</span></div>
              <div className="checkout-total-line"><span>Tax</span><span>${tax.toFixed(2)}</span></div>
              <hr className="divider" />
              <div className="checkout-total-line checkout-total-line--total">
                <span>Total</span>
                <span className="grand-total">${total.toFixed(2)}</span>
              </div>
            </div>
            <div className="payment-icons">
              {['VISA', 'MC', 'AMEX', 'DISCOVER'].map(c => (
                <span key={c} className="payment-icon">{c}</span>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}