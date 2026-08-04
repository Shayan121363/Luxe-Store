import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import './AdminPage.css';

const CATEGORIES = ['Electronics', 'Clothing', 'Books', 'Home & Garden', 'Sports', 'Beauty', 'Toys', 'Food', 'Other'];
const ORDER_STATUSES = ['pending', 'processing', 'paid', 'shipped', 'delivered', 'cancelled', 'refunded'];

const STATUS_COLORS = {
  pending: 'badge-warning', processing: 'badge-info', paid: 'badge-success',
  shipped: 'badge-info', delivered: 'badge-success', cancelled: 'badge-error', refunded: 'badge-muted',
};

const emptyProduct = {
  name: '', description: '', price: '', originalPrice: '',
  category: 'Electronics', brand: '', stock: '', images: '',
  featured: false, tags: '',
};

export default function AdminPage() {
  const [tab, setTab] = useState('dashboard');
  const [stats, setStats] = useState({ products: 0, orders: 0, revenue: 0, users: 0 });
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [productForm, setProductForm] = useState(emptyProduct);
  const [savingProduct, setSavingProduct] = useState(false);
  const [orderPage, setOrderPage] = useState(1);
  const [orderTotal, setOrderTotal] = useState(0);
  const [statusFilter, setStatusFilter] = useState('');

  const fetchProducts = useCallback(async () => {
    setLoadingProducts(true);
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/products?limit=50`);
      setProducts(res.data.products);
      setStats(s => ({ ...s, products: res.data.total }));
    } finally { setLoadingProducts(false); }
  }, []);

  const fetchOrders = useCallback(async () => {
    setLoadingOrders(true);
    try {
      const params = new URLSearchParams({ page: orderPage, limit: 15 });
      if (statusFilter) params.set('status', statusFilter);
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/orders?${params}`);
      setOrders(res.data.orders);
      setOrderTotal(res.data.total);
      const revenue = res.data.orders.filter(o => o.status === 'paid' || o.status === 'delivered').reduce((s, o) => s + o.total, 0);
      setStats(s => ({ ...s, orders: res.data.total, revenue }));
    } finally { setLoadingOrders(false); }
  }, [orderPage, statusFilter]);

  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, [fetchProducts, fetchOrders]);

  const openNewProduct = () => { setEditProduct(null); setProductForm(emptyProduct); setShowProductForm(true); };
  const openEditProduct = (p) => {
    setEditProduct(p);
    setProductForm({
      name: p.name, description: p.description, price: p.price, originalPrice: p.originalPrice || '',
      category: p.category, brand: p.brand || '', stock: p.stock,
      images: p.images?.join(', ') || '', featured: p.featured, tags: p.tags?.join(', ') || '',
    });
    setShowProductForm(true);
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    setSavingProduct(true);
    try {
      const payload = {
        ...productForm,
        price: Number(productForm.price),
        originalPrice: productForm.originalPrice ? Number(productForm.originalPrice) : undefined,
        stock: Number(productForm.stock),
        images: productForm.images ? productForm.images.split(',').map(s => s.trim()).filter(Boolean) : [],
        tags: productForm.tags ? productForm.tags.split(',').map(s => s.trim()).filter(Boolean) : [],
      };
      if (editProduct) {
        await axios.put(`${process.env.REACT_APP_API_URL}/products/${editProduct._id}`, payload);
        toast.success('Product updated!');
      } else {
        await axios.post(`${process.env.REACT_APP_API_URL}/products`, payload);
        toast.success('Product created!');
      }
      setShowProductForm(false);
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    } finally { setSavingProduct(false); }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/products/${id}`);
      toast.success('Product deleted');
      fetchProducts();
    } catch (err) { toast.error('Delete failed'); }
  };

  const handleOrderStatus = async (orderId, status) => {
    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/orders/${orderId}/status`, { status });
      toast.success('Order status updated');
      fetchOrders();
    } catch (err) { toast.error('Update failed'); }
  };

  const upd = k => e => setProductForm(f => ({ ...f, [k]: e.target.value }));

  return (
    <div className="admin-page">
      <div className="admin-sidebar">
        <div className="admin-sidebar__brand">◈ Admin Panel</div>
        <nav className="admin-nav">
          {['dashboard', 'products', 'orders'].map(t => (
            <button key={t} className={`admin-nav__item ${tab === t ? 'admin-nav__item--active' : ''}`} onClick={() => setTab(t)}>
              {t === 'dashboard' ? '📊' : t === 'products' ? '📦' : '🛒'} {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </nav>
      </div>

      <div className="admin-content">
        {/* Dashboard */}
        {tab === 'dashboard' && (
          <div className="admin-section fade-in">
            <h2>Dashboard Overview</h2>
            <div className="stats-grid">
              <div className="stat-card"><div className="stat-card__icon">📦</div><div><p className="stat-value">{stats.products}</p><p className="stat-label">Total Products</p></div></div>
              <div className="stat-card"><div className="stat-card__icon">🛒</div><div><p className="stat-value">{stats.orders}</p><p className="stat-label">Total Orders</p></div></div>
              <div className="stat-card stat-card--accent"><div className="stat-card__icon">💰</div><div><p className="stat-value">${stats.revenue.toFixed(2)}</p><p className="stat-label">Revenue</p></div></div>
              <div className="stat-card"><div className="stat-card__icon">⭐</div><div><p className="stat-value">{products.filter(p => p.featured).length}</p><p className="stat-label">Featured Items</p></div></div>
            </div>
            <div className="quick-actions">
              <h3>Quick Actions</h3>
              <div className="quick-action-btns">
                <button className="btn btn-primary" onClick={() => { setTab('products'); openNewProduct(); }}>+ Add Product</button>
                <button className="btn btn-outline" onClick={() => setTab('orders')}>View Orders</button>
              </div>
            </div>
          </div>
        )}

        {/* Products */}
        {tab === 'products' && (
          <div className="admin-section fade-in">
            <div className="admin-section__header">
              <h2>Products <span className="count-badge">{products.length}</span></h2>
              <button className="btn btn-primary" onClick={openNewProduct}>+ Add Product</button>
            </div>

            {loadingProducts ? <div className="page-loader"><div className="spinner" /></div> : (
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Stock</th>
                      <th>Rating</th>
                      <th>Featured</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map(p => (
                      <tr key={p._id}>
                        <td>
                          <div className="product-cell">
                            <img src={p.images?.[0] || 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=50&h=50&fit=crop'} alt={p.name} onError={e => { e.target.src = 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=50&h=50&fit=crop'; }} />
                            <span>{p.name}</span>
                          </div>
                        </td>
                        <td><span className="badge badge-muted">{p.category}</span></td>
                        <td className="price">${p.price.toFixed(2)}</td>
                        <td><span className={p.stock < 5 ? 'low-stock' : ''}>{p.stock}</span></td>
                        <td>★ {p.rating.toFixed(1)} ({p.numReviews})</td>
                        <td>{p.featured ? '✓' : '—'}</td>
                        <td>
                          <div className="table-actions">
                            <button className="btn btn-outline btn-sm" onClick={() => openEditProduct(p)}>Edit</button>
                            <button className="btn btn-danger btn-sm" onClick={() => handleDeleteProduct(p._id)}>Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Orders */}
        {tab === 'orders' && (
          <div className="admin-section fade-in">
            <div className="admin-section__header">
              <h2>Orders <span className="count-badge">{orderTotal}</span></h2>
              <select className="form-select" style={{ maxWidth: 180 }} value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setOrderPage(1); }}>
                <option value="">All Statuses</option>
                {ORDER_STATUSES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
              </select>
            </div>

            {loadingOrders ? <div className="page-loader"><div className="spinner" /></div> : (
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Date</th>
                      <th>Total</th>
                      <th>Status</th>
                      <th>Update Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map(o => (
                      <tr key={o._id}>
                        <td><code className="order-code">#{o._id.slice(-8).toUpperCase()}</code></td>
                        <td>
                          <div>
                            <p style={{ fontWeight: 500 }}>{o.user?.name}</p>
                            <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{o.user?.email}</p>
                          </div>
                        </td>
                        <td style={{ fontSize: 13, color: 'var(--text-muted)' }}>{new Date(o.createdAt).toLocaleDateString()}</td>
                        <td className="price">${o.total.toFixed(2)}</td>
                        <td><span className={`badge ${STATUS_COLORS[o.status] || 'badge-muted'}`}>{o.status}</span></td>
                        <td>
                          <select
                            className="form-select"
                            style={{ fontSize: 12, padding: '6px 10px', maxWidth: 150 }}
                            value={o.status}
                            onChange={e => handleOrderStatus(o._id, e.target.value)}
                          >
                            {ORDER_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Product Form Modal */}
      {showProductForm && (
        <div className="modal-overlay" onClick={() => setShowProductForm(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal__header">
              <h3>{editProduct ? 'Edit Product' : 'Add New Product'}</h3>
              <button className="modal__close" onClick={() => setShowProductForm(false)}>✕</button>
            </div>
            <form onSubmit={handleProductSubmit} className="modal__body">
              <div className="modal-grid">
                <div className="form-group modal-grid--full">
                  <label className="form-label">Product Name *</label>
                  <input className="form-input" value={productForm.name} onChange={upd('name')} required placeholder="Product name" />
                </div>
                <div className="form-group modal-grid--full">
                  <label className="form-label">Description *</label>
                  <textarea className="form-textarea" value={productForm.description} onChange={upd('description')} required placeholder="Product description..." />
                </div>
                <div className="form-group">
                  <label className="form-label">Price ($) *</label>
                  <input className="form-input" type="number" step="0.01" min="0" value={productForm.price} onChange={upd('price')} required placeholder="29.99" />
                </div>
                <div className="form-group">
                  <label className="form-label">Original Price ($)</label>
                  <input className="form-input" type="number" step="0.01" min="0" value={productForm.originalPrice} onChange={upd('originalPrice')} placeholder="49.99" />
                </div>
                <div className="form-group">
                  <label className="form-label">Category *</label>
                  <select className="form-select" value={productForm.category} onChange={upd('category')}>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Brand</label>
                  <input className="form-input" value={productForm.brand} onChange={upd('brand')} placeholder="Brand name" />
                </div>
                <div className="form-group">
                  <label className="form-label">Stock *</label>
                  <input className="form-input" type="number" min="0" value={productForm.stock} onChange={upd('stock')} required placeholder="100" />
                </div>
                <div className="form-group">
                  <label className="form-label">Featured</label>
                  <select className="form-select" value={productForm.featured} onChange={e => setProductForm(f => ({ ...f, featured: e.target.value === 'true' }))}>
                    <option value="false">No</option>
                    <option value="true">Yes</option>
                  </select>
                </div>
                <div className="form-group modal-grid--full">
                  <label className="form-label">Image URLs (comma-separated)</label>
                  <input className="form-input" value={productForm.images} onChange={upd('images')} placeholder="https://..., https://..." />
                </div>
                <div className="form-group modal-grid--full">
                  <label className="form-label">Tags (comma-separated)</label>
                  <input className="form-input" value={productForm.tags} onChange={upd('tags')} placeholder="new, sale, trending" />
                </div>
              </div>
              <div className="modal__footer">
                <button type="button" className="btn btn-ghost" onClick={() => setShowProductForm(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={savingProduct}>
                  {savingProduct ? 'Saving...' : editProduct ? 'Update Product' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}