import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import './ProductsPage.css';

const CATEGORIES = ['All', 'Electronics', 'Clothing', 'Books', 'Home & Garden', 'Sports', 'Beauty', 'Toys', 'Other'];
const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'popular', label: 'Most Popular' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
];

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const category = searchParams.get('category') || 'All';
  const search = searchParams.get('search') || '';
  const sort = searchParams.get('sort') || 'newest';
  const page = Number(searchParams.get('page')) || 1;
  const featured = searchParams.get('featured') || '';
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ sort, page, limit: 12 });
      if (category && category !== 'All') params.set('category', category);
      if (search) params.set('search', search);
      if (featured) params.set('featured', featured);
      if (minPrice) params.set('minPrice', minPrice);
      if (maxPrice) params.set('maxPrice', maxPrice);

      const res = await axios.get(`${process.env.REACT_APP_API_URL}/products?${params}`);
      setProducts(res.data.products);
      setTotal(res.data.total);
      setPages(res.data.pages);
    } finally {
      setLoading(false);
    }
  }, [category, search, sort, page, featured, minPrice, maxPrice]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value); else next.delete(key);
    if (key !== 'page') next.delete('page');
    setSearchParams(next);
  };

  const handlePriceFilter = (e) => {
    e.preventDefault();
    fetchProducts();
  };

  return (
    <div className="products-page">
      <div className="products-page__header">
        <div className="container">
          <h1>{search ? `Results for "${search}"` : category !== 'All' ? category : 'All Products'}</h1>
          <p>{total} product{total !== 1 ? 's' : ''} found</p>
        </div>
      </div>

      <div className="container products-page__layout">
        {/* Sidebar */}
        <aside className={`sidebar ${filterOpen ? 'sidebar--open' : ''}`}>
          <div className="sidebar__header">
            <h3>Filters</h3>
            <button className="sidebar__close" onClick={() => setFilterOpen(false)}>✕</button>
          </div>

          <div className="filter-section">
            <h4>Category</h4>
            <div className="category-list">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  className={`cat-btn ${category === cat ? 'cat-btn--active' : ''}`}
                  onClick={() => updateParam('category', cat === 'All' ? '' : cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-section">
            <h4>Price Range</h4>
            <form onSubmit={handlePriceFilter} className="price-filter">
              <input
                type="number" placeholder="Min $" value={minPrice}
                onChange={e => setMinPrice(e.target.value)}
                className="form-input" min="0"
              />
              <input
                type="number" placeholder="Max $" value={maxPrice}
                onChange={e => setMaxPrice(e.target.value)}
                className="form-input" min="0"
              />
              <button type="submit" className="btn btn-outline btn-sm btn-full">Apply</button>
              {(minPrice || maxPrice) && (
                <button type="button" className="btn btn-ghost btn-sm btn-full"
                  onClick={() => { setMinPrice(''); setMaxPrice(''); }}>Clear</button>
              )}
            </form>
          </div>

          <div className="filter-section">
            <h4>Sort By</h4>
            <div className="sort-list">
              {SORT_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  className={`sort-btn ${sort === opt.value ? 'sort-btn--active' : ''}`}
                  onClick={() => updateParam('sort', opt.value)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Main */}
        <main className="products-main">
          <div className="products-toolbar">
            <button className="btn btn-outline btn-sm filter-toggle" onClick={() => setFilterOpen(true)}>
              ☰ Filters
            </button>
            <select
              className="form-select sort-select"
              value={sort}
              onChange={e => updateParam('sort', e.target.value)}
            >
              {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>

          {loading ? (
            <div className="page-loader"><div className="spinner" /></div>
          ) : products.length === 0 ? (
            <div className="empty-state">
              <div className="icon">🔍</div>
              <h3>No products found</h3>
              <p>Try adjusting your filters or search terms</p>
            </div>
          ) : (
            <>
              <div className="products-grid">
                {products.map(p => <ProductCard key={p._id} product={p} />)}
              </div>

              {pages > 1 && (
                <div className="pagination">
                  <button
                    className="btn btn-outline btn-sm"
                    disabled={page <= 1}
                    onClick={() => updateParam('page', page - 1)}
                  >← Prev</button>
                  <div className="pagination__pages">
                    {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
                      <button
                        key={p}
                        className={`page-btn ${page === p ? 'page-btn--active' : ''}`}
                        onClick={() => updateParam('page', p)}
                      >{p}</button>
                    ))}
                  </div>
                  <button
                    className="btn btn-outline btn-sm"
                    disabled={page >= pages}
                    onClick={() => updateParam('page', page + 1)}
                  >Next →</button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}