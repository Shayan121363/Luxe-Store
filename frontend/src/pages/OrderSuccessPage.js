import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import './OrderSuccessPage.css';

export default function OrderSuccessPage() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const { clearCart } = useCart();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    clearCart();
    if (sessionId) {
      axios.get(`${process.env.REACT_APP_API_URL}/payments/session/${sessionId}`)
        .then(res => setSession(res.data))
        .catch(() => {})
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [sessionId, clearCart]);

  return (
    <div className="success-page">
      <div className="container-sm">
        <div className="success-card">
          <div className="success-icon">
            <div className="success-circle">
              <svg viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="26" cy="26" r="25" stroke="currentColor" strokeWidth="2" className="success-circle__ring" />
                <path d="M14 26l8 8 16-16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="success-circle__check" />
              </svg>
            </div>
          </div>

          <h1>Order Confirmed!</h1>
          <p className="success-subtitle">
            Thank you for your purchase. Your order has been placed successfully and you'll receive a confirmation email shortly.
          </p>

          {!loading && session && (
            <div className="order-details">
              <div className="order-detail-row">
                <span>Customer</span>
                <span>{session.customer_details?.name || session.customer_email}</span>
              </div>
              <div className="order-detail-row">
                <span>Email</span>
                <span>{session.customer_email}</span>
              </div>
              <div className="order-detail-row">
                <span>Amount Paid</span>
                <span className="paid-amount">${(session.amount_total / 100).toFixed(2)}</span>
              </div>
              <div className="order-detail-row">
                <span>Status</span>
                <span className="badge badge-success">Paid ✓</span>
              </div>
            </div>
          )}

          <div className="success-actions">
            <Link to="/orders" className="btn btn-primary btn-lg">View My Orders</Link>
            <Link to="/products" className="btn btn-outline btn-lg">Continue Shopping</Link>
          </div>

          <div className="success-perks">
            <div className="success-perk">
              <span>📦</span>
              <p>Order Processing</p>
              <small>1-2 business days</small>
            </div>
            <div className="success-perk">
              <span>🚚</span>
              <p>Shipping</p>
              <small>3-7 business days</small>
            </div>
            <div className="success-perk">
              <span>📧</span>
              <p>Tracking Email</p>
              <small>Within 24 hours</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
