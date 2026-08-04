import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';
import './ProductCard.css';

const PLACEHOLDER = 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=400&h=400&fit=crop';

function Stars({ rating }) {
  return (
    <div className="stars">
      {[1,2,3,4,5].map(s => (
        <span key={s} className={s <= Math.round(rating) ? 'star' : 'star star--empty'}>★</span>
      ))}
    </div>
  );
}

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (product.stock === 0) return;
    addToCart(product, 1);
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <Link to={`/products/${product._id}`} className="product-card">
      <div className="product-card__img-wrap">
        <img
          src={product.images?.[0] || PLACEHOLDER}
          alt={product.name}
          className="product-card__img"
          onError={e => { e.target.src = PLACEHOLDER; }}
        />
        {discount > 0 && <span className="product-card__discount">-{discount}%</span>}
        {product.stock === 0 && <div className="product-card__out-of-stock">Out of Stock</div>}
        {product.featured && <span className="product-card__featured">Featured</span>}
        <button
          className="product-card__quick-add"
          onClick={handleAddToCart}
          disabled={product.stock === 0}
        >
          {product.stock === 0 ? 'Sold Out' : '+ Add to Cart'}
        </button>
      </div>
      <div className="product-card__body">
        <p className="product-card__brand">{product.brand || product.category}</p>
        <h3 className="product-card__name">{product.name}</h3>
        <div className="product-card__meta">
          <div className="product-card__rating">
            <Stars rating={product.rating} />
            <span className="product-card__reviews">({product.numReviews})</span>
          </div>
        </div>
        <div className="product-card__pricing">
          <span className="price">${product.price.toFixed(2)}</span>
          {product.originalPrice && (
            <span className="price-original">${product.originalPrice.toFixed(2)}</span>
          )}
        </div>
      </div>
    </Link>
  );
}