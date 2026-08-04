import React from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';
import './WishlistPage.css';

const PLACEHOLDER = 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=400&h=400&fit=crop';

export default function WishlistPage() {
  const { wishlist, toggleWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleMoveToCart = (item) => {
    addToCart({ _id: item._id, name: item.name, price: item.price, images: [item.image], stock: 99 }, 1);
    toggleWishlist(item);
    toast.success('Moved to cart!');
  };

  if (wishlist.length === 0) {
    return (
      <div className="wishlist-page">
        <div className="container">
          <div className="empty-state" style={{ paddingTop: 80 }}>
            <div className="icon">❤️</div>
            <h3>Your wishlist is empty</h3>
            <p>Save items you love and come back to them later</p>
            <Link to="/products" className="btn btn-primary" style={{ marginTop: 24 }}>
              Explore Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="wishlist-page">
      <div className="container">
        <div className="wishlist-header">
          <div>
            <h1>My Wishlist</h1>
            <p>{wishlist.length} saved item{wishlist.length !== 1 ? 's' : ''}</p>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={clearWishlist}>
            Clear All
          </button>
        </div>

        <div className="wishlist-grid">
          {wishlist.map((item) => (
            <div key={item._id} className="wishlist-card fade-in">
              <Link to={`/products/${item._id}`} className="wishlist-card__img-wrap">
                <img
                  src={item.image || PLACEHOLDER}
                  alt={item.name}
                  onError={(e) => { e.target.src = PLACEHOLDER; }}
                />
              </Link>
              <div className="wishlist-card__body">
                <p className="wishlist-card__category">{item.category}</p>
                <Link to={`/products/${item._id}`} className="wishlist-card__name">
                  {item.name}
                </Link>
                <p className="wishlist-card__price">${item.price.toFixed(2)}</p>
                <div className="wishlist-card__actions">
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => handleMoveToCart(item)}
                  >
                    Move to Cart
                  </button>
                  <button
                    className="btn btn-ghost btn-sm wishlist-remove"
                    onClick={() => toggleWishlist(item)}
                    title="Remove from wishlist"
                  >
                    ✕
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
