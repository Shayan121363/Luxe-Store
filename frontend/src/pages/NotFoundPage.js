import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './NotFoundPage.css';

export default function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <div className="notfound-page">
      <div className="notfound-bg">
        <div className="notfound-orb notfound-orb--1" />
        <div className="notfound-orb notfound-orb--2" />
      </div>
      <div className="notfound-content">
        <div className="notfound-code">404</div>
        <h1>Page Not Found</h1>
        <p>The page you're looking for doesn't exist or has been moved.</p>
        <div className="notfound-actions">
          <button className="btn btn-ghost" onClick={() => navigate(-1)}>← Go Back</button>
          <Link to="/" className="btn btn-primary">Return Home</Link>
          <Link to="/products" className="btn btn-outline">Browse Shop</Link>
        </div>
      </div>
    </div>
  );
}
