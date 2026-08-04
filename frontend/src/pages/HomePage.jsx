import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import './HomePage.css';

const CATEGORIES = [
  { name: 'Electronics', icon: '⚡', color: '#60a5fa' },
  { name: 'Clothing', icon: '👕', color: '#c4a85a' },
  { name: 'Books', icon: '📚', color: '#4ade80' },
  { name: 'Home & Garden', icon: '🏡', color: '#f472b6' },
  { name: 'Sports', icon: '🏃', color: '#fb923c' },
  { name: 'Beauty', icon: '✨', color: '#a78bfa' },
  { name: 'Toys', icon: '🧸', color: '#fb7185' },
];

export default function HomePage() {
  const [featured, setFeatured] = useState([]);
  const [latest, setLatest] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([
      axios.get(`${process.env.REACT_APP_API_URL}/products?featured=true&limit=4`),
      axios.get(`${process.env.REACT_APP_API_URL}/products?sort=newest&limit=8`),
    ]).then(([f, l]) => {
      setFeatured(f.data.products);
      setLatest(l.data.products);
    }).finally(() => setLoading(false));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) navigate(`/products?search=${encodeURIComponent(search)}`);
  };

  return (
    <div className="home">
      {/* Hero */}
      <section className="hero">
        <div className="hero__bg">
          <div className="hero__orb hero__orb--1" />
          <div className="hero__orb hero__orb--2" />
          <div className="hero__grid" />
        </div>
        <div className="container hero__content">
          <div className="hero__badge">✦ Premium Collection 2024</div>
          <h1 className="hero__title">
            Discover <em>Extraordinary</em><br />Products
          </h1>
          <p className="hero__subtitle">
            Handpicked luxury items from around the world. Free shipping on orders over $50.
          </p>
          <form className="hero__search" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search for anything..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="hero__search-input"
            />
            <button type="submit" className="btn btn-primary">Search</button>
          </form>
          <div className="hero__actions">
            <Link to="/products" className="btn btn-primary btn-lg">Shop Now</Link>
            <Link to="/products?featured=true" className="btn btn-outline btn-lg">View Featured</Link>
          </div>
          <div className="hero__stats">
            <div className="hero__stat"><span>10k+</span><p>Products</p></div>
            <div className="hero__stat-divider" />
            <div className="hero__stat"><span>50k+</span><p>Customers</p></div>
            <div className="hero__stat-divider" />
            <div className="hero__stat"><span>4.9★</span><p>Avg Rating</p></div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="section">
        <div className="container">
          <div className="section-title">
            <h2>Shop by Category</h2>
            <p>Explore our curated collections across every lifestyle</p>
          </div>
          <div className="categories-grid">
            {CATEGORIES.map(cat => (
              <Link
                key={cat.name}
                to={`/products?category=${encodeURIComponent(cat.name)}`}
                className="category-card"
                style={{ '--cat-color': cat.color }}
              >
                <span className="category-card__icon">{cat.icon}</span>
                <span className="category-card__name">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {featured.length > 0 && (
        <section className="section section--dark">
          <div className="container">
            <div className="section-title">
              <h2>Featured Products</h2>
              <p>Our most exclusive and sought-after items</p>
            </div>
            {loading ? (
              <div className="page-loader"><div className="spinner" /></div>
            ) : (
              <div className="products-grid">
                {featured.map(p => <ProductCard key={p._id} product={p} />)}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Latest Products */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div className="section-title" style={{ textAlign: 'left', marginBottom: 0 }}>
              <h2>New Arrivals</h2>
              <p>Fresh drops you don't want to miss</p>
            </div>
            <Link to="/products?sort=newest" className="btn btn-outline">View All →</Link>
          </div>
          {loading ? (
            <div className="page-loader"><div className="spinner" /></div>
          ) : (
            <div className="products-grid" style={{ marginTop: 32 }}>
              {latest.map(p => <ProductCard key={p._id} product={p} />)}
            </div>
          )}
        </div>
      </section>

      {/* Banner */}
      <section className="promo-banner">
        <div className="container promo-banner__inner">
          <div>
            <h2>Free Shipping on Orders Over $50</h2>
            <p>Plus easy 30-day returns on all purchases</p>
          </div>
          <Link to="/products" className="btn btn-primary btn-lg">Start Shopping</Link>
        </div>
      </section>
    </div>
  );
}