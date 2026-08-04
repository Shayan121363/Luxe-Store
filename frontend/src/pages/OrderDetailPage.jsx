import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './OrderDetailPage.css';

const STATUS_STEPS = ['pending', 'processing', 'paid', 'shipped', 'delivered'];

const STATUS_COLORS = {
  pending: 'badge-warning',
  processing: 'badge-info',
  paid: 'badge-success',
  shipped: 'badge-info',
  delivered: 'badge-success',
  cancelled: 'badge-error',
  refunded: 'badge-muted',
};

export default function OrderDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/orders/${id}`)
      .then(res => setOrder(res.data))
      .catch(() => navigate('/orders'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  if (loading) return <div className="page-loader" style={{ paddingTop: 140 }}><div className="spinner" /></div>;
  if (!order) return null;

  const currentStep = STATUS_STEPS.indexOf(order.status);
  const isCancelled = order.status === 'cancelled' || order.status === 'refunded';

  return (
    <div className="order-detail-page">
      <div className="container">
        <div className="order-detail-header">
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('/orders')}>← Back to Orders</button>
          <div className="order-detail-title">
            <h1>Order #{order._id.slice(-8).toUpperCase()}</h1>
            <p>Placed on {new Date(order.createdAt).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
          <span className={`badge ${STATUS_COLORS[order.status] || 'badge-muted'}`} style={{ fontSize: 14, padding: '6px 16px' }}>
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </span>
        </div>

        {/* Progress tracker */}
        {!isCancelled && (
          <div className="order-progress">
            {STATUS_STEPS.map((step, i) => (
              <React.Fragment key={step}>
                <div className={`progress-step ${i <= currentStep ? 'progress-step--done' : ''} ${i === currentStep ? 'progress-step--current' : ''}`}>
                  <div className="progress-step__circle">
                    {i < currentStep ? '✓' : i + 1}
                  </div>
                  <span className="progress-step__label">{step.charAt(0).toUpperCase() + step.slice(1)}</span>
                </div>
                {i < STATUS_STEPS.length - 1 && (
                  <div className={`progress-line ${i < currentStep ? 'progress-line--done' : ''}`} />
                )}
              </React.Fragment>
            ))}
          </div>
        )}

        <div className="order-detail-layout">
          {/* Left column */}
          <div className="order-detail-main">
            {/* Items */}
            <div className="detail-card">
              <h3>Order Items</h3>
              <div className="detail-items">
                {order.items.map((item, i) => (
                  <div key={i} className="detail-item">
                    <img
                      src={item.image || 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=100&h=100&fit=crop'}
                      alt={item.name}
                      onError={e => { e.target.src = 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=100&h=100&fit=crop'; }}
                    />
                    <div className="detail-item__info">
                      <p className="detail-item__name">{item.name}</p>
                      <p className="detail-item__price">${item.price.toFixed(2)} × {item.quantity}</p>
                    </div>
                    <p className="detail-item__total">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping */}
            <div className="detail-card">
              <h3>Shipping Address</h3>
              <div className="shipping-info">
                <p className="shipping-name">{order.shippingAddress.name}</p>
                <p>{order.shippingAddress.street}</p>
                <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}</p>
                <p>{order.shippingAddress.country}</p>
                {order.trackingNumber && (
                  <div className="tracking-box">
                    <span>🚚 Tracking Number:</span>
                    <strong>{order.trackingNumber}</strong>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right column - Summary */}
          <aside className="order-detail-summary">
            <div className="detail-card">
              <h3>Payment Summary</h3>
              <div className="summary-rows">
                <div className="summary-row"><span>Subtotal</span><span>${order.subtotal.toFixed(2)}</span></div>
                <div className="summary-row">
                  <span>Shipping</span>
                  <span>{order.shippingCost === 0 ? <span style={{ color: 'var(--success)' }}>FREE</span> : `$${order.shippingCost.toFixed(2)}`}</span>
                </div>
                <div className="summary-row"><span>Tax</span><span>${order.tax.toFixed(2)}</span></div>
                <hr className="divider" />
                <div className="summary-row summary-row--total">
                  <span>Total</span>
                  <span className="summary-grand-total">${order.total.toFixed(2)}</span>
                </div>
              </div>

              <div className="payment-method">
                <span>💳 Paid via Stripe</span>
                {order.paymentResult?.paidAt && (
                  <span>{new Date(order.paymentResult.paidAt).toLocaleDateString()}</span>
                )}
              </div>
            </div>

            <Link to="/products" className="btn btn-outline btn-full" style={{ marginTop: 12 }}>
              Continue Shopping
            </Link>
          </aside>
        </div>
      </div>
    </div>
  );
}