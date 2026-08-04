import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); setDropdownOpen(false); }, [location]);

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="navbar__inner">
        <Link to="/" className="navbar__brand">
          <span className="brand-icon">◈</span>
          <span className="brand-name">LUXE<em>STORE</em></span>
        </Link>

        <div className={`navbar__links ${menuOpen ? 'navbar__links--open' : ''}`}>
          <Link to="/products" className="nav-link">Shop</Link>
          <Link to="/products?category=Electronics" className="nav-link">Electronics</Link>
          <Link to="/products?category=Clothing" className="nav-link">Clothing</Link>
          <Link to="/products?featured=true" className="nav-link">Featured</Link>
        </div>

        <div className="navbar__actions">
          <button className="nav-icon-btn theme-btn" onClick={toggleTheme} aria-label="Toggle Theme">
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>

          <Link to="/cart" className="nav-icon-btn cart-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 01-8 0"/>
            </svg>
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>

          {user ? (
            <div className="user-menu">
              <button className="user-avatar" onClick={() => setDropdownOpen(!dropdownOpen)}>
                <span>{user.name?.charAt(0).toUpperCase()}</span>
              </button>
              {dropdownOpen && (
                <div className="user-dropdown">
                  <div className="user-dropdown__header">
                    <p className="user-dropdown__name">{user.name}</p>
                    <p className="user-dropdown__email">{user.email}</p>
                  </div>
                  <div className="user-dropdown__divider" />
                  <Link to="/profile" className="user-dropdown__item">Profile</Link>
                  <Link to="/orders" className="user-dropdown__item">My Orders</Link>
                  {user.role === 'admin' && <Link to="/admin" className="user-dropdown__item user-dropdown__item--admin">Admin Panel</Link>}
                  <div className="user-dropdown__divider" />
                  <button className="user-dropdown__item user-dropdown__item--danger" onClick={handleLogout}>Sign Out</button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-links">
              <Link to="/login" className="btn btn-ghost btn-sm">Sign In</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Join</Link>
            </div>
          )}

          <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
            <span /><span /><span />
          </button>
        </div>
      </div>
    </nav>
  );
}