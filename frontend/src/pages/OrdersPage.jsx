import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './OrdersPage.css';

const STATUS_COLORS = {
  pending: 'badge-warning',
  processing: 'badge-info',
  paid: 'badge-success',
  shipped: 'badge-info',
  delivered: 'badge-success',
  cancelled: 'badge-error',
  refunded: 'badge-muted',
};

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/orders/my`)
      .then(res => setOrders(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="page-loader" style={{ paddingTop: 140 }}><div className="spinner" /></div>;

  return (
    <div className="orders-page">
      <div className="container">
        <div className="page-header">
          <h1>My Orders</h1>
          <p>{orders.length} order{orders.length !== 1 ? 's' : ''} placed</p>
        </div>

        {orders.length === 0 ? (
          <div className="empty-state">
            <div className="icon">📦</div>
            <h3>No orders yet</h3>
            <p>Start shopping and your orders will appear here</p>
            <Link to="/products" className="btn btn-primary" style={{ marginTop: 24 }}>Browse Products</Link>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map(order => (
              <div key={order._id} className="order-card fade-in">
                <div className="order-card__header">
                  <div>
                    <p className="order-id">Order #{order._id.slice(-8).toUpperCase()}</p>
                    <p className="order-date">{new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  </div>
                  <div className="order-card__header-right">
                    <span className={`badge ${STATUS_COLORS[order.status] || 'badge-muted'}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                    <span className="order-total">${order.total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="order-card__items">
                  {order.items.slice(0, 3).map((item, i) => (
                    <div key={i} className="order-item-preview">
                      <img
                        src={item.image || 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=80&h=80&fit=crop'}
                        alt={item.name}
                        onError={e => { e.target.src = 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=80&h=80&fit=crop'; }}
                      />
                      <div>
                        <p className="order-item-name">{item.name}</p>
                        <p className="order-item-qty">Qty: {item.quantity} · ${item.price.toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                  {order.items.length > 3 && (
                    <p className="more-items">+{order.items.length - 3} more item{order.items.length - 3 !== 1 ? 's' : ''}</p>
                  )}
                </div>

                <div className="order-card__footer">
                  <div className="order-shipping">
                    <span>📍</span>
                    <span>{order.shippingAddress.city}, {order.shippingAddress.country}</span>
                  </div>
                  {order.trackingNumber && (
                    <div className="order-tracking">
                      <span>🚚</span>
                      <span>Tracking: {order.trackingNumber}</span>
                    </div>
                  )}
                  <Link to={`/orders/${order._id}`} className="btn btn-outline btn-sm order-detail-btn">
                    View Details →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}