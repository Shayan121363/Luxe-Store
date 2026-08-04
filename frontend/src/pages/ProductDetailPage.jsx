import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './ProductDetailPage.css';

const PLACEHOLDER = 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=800&h=800&fit=crop';

function Stars({ rating, interactive, onRate }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="stars-row">
      {[1,2,3,4,5].map(s => (
        <span
          key={s}
          className={`star-icon ${s <= (hover || Math.round(rating)) ? 'star-icon--filled' : ''} ${interactive ? 'star-icon--interactive' : ''}`}
          onClick={() => interactive && onRate(s)}
          onMouseEnter={() => interactive && setHover(s)}
          onMouseLeave={() => interactive && setHover(0)}
        >★</span>
      ))}
    </div>
  );
}

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImg, setSelectedImg] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/products/${id}`)
      .then(res => setProduct(res.data))
      .catch(() => navigate('/products'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const handleAddToCart = () => {
    setAddingToCart(true);
    addToCart(product, quantity);
    toast.success(`${quantity}x ${product.name} added to cart!`);
    setTimeout(() => setAddingToCart(false), 800);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigate('/cart');
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) return toast.error('Please sign in to leave a review');
    setSubmittingReview(true);
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/products/${id}/reviews`, {
        rating: reviewRating, comment: reviewComment,
      });
      toast.success('Review submitted!');
      setReviewComment('');
      // Refresh product
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/products/${id}`);
      setProduct(res.data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) return <div className="page-loader" style={{ paddingTop: 140 }}><div className="spinner" /></div>;
  if (!product) return null;

  const images = product.images?.length ? product.images : [PLACEHOLDER];
  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  return (
    <div className="product-detail">
      <div className="container">
        <div className="breadcrumb">
          <span onClick={() => navigate('/')} className="breadcrumb__link">Home</span>
          <span>›</span>
          <span onClick={() => navigate('/products')} className="breadcrumb__link">Shop</span>
          <span>›</span>
          <span onClick={() => navigate(`/products?category=${product.category}`)} className="breadcrumb__link">{product.category}</span>
          <span>›</span>
          <span className="breadcrumb__current">{product.name}</span>
        </div>

        <div className="product-detail__layout">
          {/* Images */}
          <div className="product-images">
            <div className="product-images__main">
              <img
                src={images[selectedImg]}
                alt={product.name}
                onError={e => { e.target.src = PLACEHOLDER; }}
              />
              {discount > 0 && <div className="detail-discount">-{discount}%</div>}
            </div>
            {images.length > 1 && (
              <div className="product-images__thumbs">
                {images.map((img, i) => (
                  <button
                    key={i}
                    className={`thumb ${selectedImg === i ? 'thumb--active' : ''}`}
                    onClick={() => setSelectedImg(i)}
                  >
                    <img src={img} alt="" onError={e => { e.target.src = PLACEHOLDER; }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="product-info">
            {product.brand && <p className="product-info__brand">{product.brand}</p>}
            <h1 className="product-info__name">{product.name}</h1>

            <div className="product-info__rating">
              <Stars rating={product.rating} />
              <span>{product.rating.toFixed(1)}</span>
              <span className="rating-count">({product.numReviews} review{product.numReviews !== 1 ? 's' : ''})</span>
              <span className="rating-dot">•</span>
              <span className={`stock-status ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
              </span>
            </div>

            <div className="product-info__price">
              <span className="price-main">${product.price.toFixed(2)}</span>
              {product.originalPrice && (
                <>
                  <span className="price-original">${product.originalPrice.toFixed(2)}</span>
                  <span className="price-save">Save {discount}%</span>
                </>
              )}
            </div>

            <p className="product-info__desc">{product.description}</p>

            {product.tags?.length > 0 && (
              <div className="product-tags">
                {product.tags.map(tag => <span key={tag} className="tag">{tag}</span>)}
              </div>
            )}

            <hr className="divider" />

            <div className="product-info__actions">
              <div className="qty-control">
                <button className="qty-btn" onClick={() => setQuantity(q => Math.max(1, q - 1))}>−</button>
                <input className="qty-value" value={quantity} readOnly />
                <button className="qty-btn" onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}>+</button>
              </div>
              <button
                className={`btn btn-primary btn-lg ${addingToCart ? 'btn--loading' : ''}`}
                onClick={handleAddToCart}
                disabled={product.stock === 0 || addingToCart}
              >
                {addingToCart ? '✓ Added!' : 'Add to Cart'}
              </button>
              <button
                className="btn btn-outline btn-lg"
                onClick={handleBuyNow}
                disabled={product.stock === 0}
              >
                Buy Now
              </button>
            </div>

            <div className="product-info__perks">
              <div className="perk"><span>🚚</span><p>Free shipping over $50</p></div>
              <div className="perk"><span>↩️</span><p>30-day returns</p></div>
              <div className="perk"><span>🔒</span><p>Secure payment</p></div>
            </div>
          </div>
        </div>

        {/* Reviews */}
        <div className="reviews-section">
          <h2>Customer Reviews</h2>

          {product.reviews.length === 0 ? (
            <p className="no-reviews">No reviews yet. Be the first to review this product!</p>
          ) : (
            <div className="reviews-list">
              {product.reviews.map((r, i) => (
                <div key={i} className="review-card">
                  <div className="review-card__header">
                    <div className="reviewer-avatar">{r.name?.charAt(0)}</div>
                    <div>
                      <p className="reviewer-name">{r.name}</p>
                      <Stars rating={r.rating} />
                    </div>
                    <span className="review-date">{new Date(r.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="review-comment">{r.comment}</p>
                </div>
              ))}
            </div>
          )}

          {/* Review Form */}
          <div className="review-form-wrap">
            <h3>Write a Review</h3>
            {user ? (
              <form onSubmit={handleReviewSubmit} className="review-form">
                <div className="form-group">
                  <label className="form-label">Your Rating</label>
                  <Stars rating={reviewRating} interactive onRate={setReviewRating} />
                </div>
                <div className="form-group">
                  <label className="form-label">Comment</label>
                  <textarea
                    className="form-textarea"
                    value={reviewComment}
                    onChange={e => setReviewComment(e.target.value)}
                    placeholder="Share your experience with this product..."
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary" disabled={submittingReview}>
                  {submittingReview ? 'Submitting...' : 'Submit Review'}
                </button>
              </form>
            ) : (
              <p className="sign-in-prompt">
                <span onClick={() => navigate('/login')} className="breadcrumb__link">Sign in</span> to leave a review
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}