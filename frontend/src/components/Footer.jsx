import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          <div className="footer__brand">
            <Link to="/" className="footer__logo">◈ LUXE<em>STORE</em></Link>
            <p>Curated luxury goods delivered to your door. Premium quality, exceptional service.</p>
            <div className="footer__social">
              {['Twitter', 'Instagram', 'Facebook'].map(s => (
                <a key={s} href="#!" className="social-link">{s[0]}</a>
              ))}
            </div>
          </div>
          <div className="footer__col">
            <h4>Shop</h4>
            <Link to="/products">All Products</Link>
            <Link to="/products?category=Electronics">Electronics</Link>
            <Link to="/products?category=Clothing">Clothing</Link>
            <Link to="/products?featured=true">Featured</Link>
          </div>
          <div className="footer__col">
            <h4>Account</h4>
            <Link to="/login">Sign In</Link>
            <Link to="/register">Create Account</Link>
            <Link to="/orders">My Orders</Link>
            <Link to="/profile">Profile</Link>
          </div>
          <div className="footer__col">
            <h4>Support</h4>
            <Link to="/faqs">FAQs</Link>
            <Link to="/shipping-info">Shipping info</Link>
            <Link to="/returns">Returns</Link>
            <Link to="/contact">Contact Us</Link>
          </div>
        </div>
        <div className="footer__bottom">
          <p>© {new Date().getFullYear()} LuxeStore. All rights reserved.</p>
          <div className="footer__payment-icons">
            <span className="payment-icon">VISA</span>
            <span className="payment-icon">MC</span>
            <span className="payment-icon">AMEX</span>
            <span className="payment-icon">STRIPE</span>
          </div>
        </div>
      </div>
    </footer>
  );
}