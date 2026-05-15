import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { BsGrid3X3GapFill, BsListUl } from 'react-icons/bs';
import { FiHeart } from 'react-icons/fi';
import { fetchProducts } from '../lib/api';
import ProductFilterSidebar from '../components/ProductFilterSidebar';
import Newsletter from '../components/Newsletter';
import PromoBanner from '../components/PromoBanner';

function hashString(s) {
  let h = 0;
  const str = String(s);
  for (let i = 0; i < str.length; i += 1) h = (h << 5) - h + str.charCodeAt(i);
  return h | 0;
}

function pseudoRating(id) {
  const h = Math.abs(hashString(id));
  return Math.round((3 + (h % 20) / 10) * 10) / 10;
}

function pseudoOrders(id) {
  const h = Math.abs(hashString(id));
  return 50 + (h % 450);
}

function pseudoVerified(id) {
  return Math.abs(hashString(id)) % 3 !== 0;
}

function listPriceWas(price, id) {
  const bump = 1.06 + (Math.abs(hashString(id)) % 8) / 100;
  return Math.round(price * bump * 100) / 100;
}

function matchFeature(feature, text) {
  const t = text.toLowerCase();
  const f = feature.toLowerCase();
  const rules = {
    metallic: ['metal', 'steel', 'silver', 'chrome'],
    'plastic cover': ['plastic', 'poly'],
    '8gb ram': ['8gb', 'ram', 'memory', 'gb'],
    'large memory': ['memory', 'storage', 'gb', 'large'],
    wireless: ['wireless', 'bluetooth', 'wifi', 'cordless'],
    'fast charge': ['fast', 'charge', 'usb-c', 'quick'],
  };
  const keys = rules[f] || [f];
  return keys.some((k) => t.includes(k));
}

function filterCatalog(products, f) {
  return products.filter((p) => {
    const text = `${p.name} ${p.description || ''}`.toLowerCase();

    if (f.appliedMinPrice !== '' && Number(f.appliedMinPrice) > p.price) return false;
    if (f.appliedMaxPrice !== '' && Number(f.appliedMaxPrice) < p.price) return false;

    if (f.selectedBrands.length) {
      const ok = f.selectedBrands.some((b) => text.includes(b.toLowerCase()));
      if (!ok) return false;
    }

    if (f.selectedFeatures.length) {
      const ok = f.selectedFeatures.some((feat) => matchFeature(feat, text));
      if (!ok) return false;
    }

    if (f.verifiedOnly && !pseudoVerified(p.id)) return false;

    if (f.selectedRatings.length) {
      const minStars = Math.min(...f.selectedRatings);
      if (pseudoRating(p.id) < minStars - 0.05) return false;
    }

    if (f.condition === 'brand_new') {
      if (!(p.stock > 0 && p.featured)) return false;
    } else if (f.condition === 'refurbished') {
      if (!(p.stock > 0 && !p.featured)) return false;
    } else if (f.condition === 'old') {
      if (p.stock !== 0) return false;
    }

    return true;
  });
}

function sortCatalog(list, sortBy) {
  const arr = [...list];
  switch (sortBy) {
    case 'price-asc':
      return arr.sort((a, b) => a.price - b.price);
    case 'price-desc':
      return arr.sort((a, b) => b.price - a.price);
    case 'name':
      return arr.sort((a, b) => a.name.localeCompare(b.name));
    case 'featured':
    default:
      return arr.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0) || b.price - a.price);
  }
}

function StarRow({ rating }) {
  const n = Math.min(5, Math.max(0, Math.round(rating)));
  return (
    <span className="inline-flex items-center gap-0.5 text-amber-400 text-sm leading-none" aria-hidden>
      {'★'.repeat(n)}
      {'☆'.repeat(5 - n)}
    </span>
  );
}

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';
  const viewParam = searchParams.get('view');
  const view = viewParam === 'list' ? 'list' : 'grid';

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedFeatures, setSelectedFeatures] = useState([]);
  const [selectedRatings, setSelectedRatings] = useState([]);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [appliedMinPrice, setAppliedMinPrice] = useState('');
  const [appliedMaxPrice, setAppliedMaxPrice] = useState('');
  const [condition, setCondition] = useState('any');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [sortBy, setSortBy] = useState('featured');
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [wishlist, setWishlist] = useState(() => new Set());

  const queryKey = useMemo(() => `${search}|${category}`, [search, category]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetchProducts({ search: search || undefined, category: category || undefined });
        if (!cancelled) setProducts(res.data || []);
      } catch (e) {
        if (!cancelled) setError(e.message || 'Failed to load products');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [queryKey, search, category]);

  const priceExtent = useMemo(() => {
    if (!products.length) return { min: 0, max: 2000 };
    const prices = products.map((p) => p.price);
    return { min: Math.floor(Math.min(...prices)), max: Math.ceil(Math.max(...prices)) };
  }, [products]);

  const filtered = useMemo(() => {
    const f = {
      appliedMinPrice,
      appliedMaxPrice,
      selectedBrands,
      selectedFeatures,
      selectedRatings,
      condition,
      verifiedOnly,
    };
    return sortCatalog(filterCatalog(products, f), sortBy);
  }, [products, appliedMinPrice, appliedMaxPrice, selectedBrands, selectedFeatures, selectedRatings, condition, verifiedOnly, sortBy]);

  useEffect(() => {
    setPage(1);
  }, [search, category, appliedMinPrice, appliedMaxPrice, selectedBrands, selectedFeatures, selectedRatings, condition, verifiedOnly, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pageItems = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, currentPage, pageSize]);

  const setView = (next) => {
    const nextParams = new URLSearchParams(searchParams);
    if (next === 'list') nextParams.set('view', 'list');
    else nextParams.delete('view');
    setSearchParams(nextParams, { replace: true });
  };

  const onPickCategory = useCallback(
    (c) => {
      const next = new URLSearchParams();
      if (c.category) next.set('category', c.category);
      if (c.search) next.set('search', c.search);
      if (view === 'list') next.set('view', 'list');
      setSearchParams(next, { replace: true });
    },
    [setSearchParams, view]
  );

  const toggleBrand = (b) => {
    setSelectedBrands((prev) => (prev.includes(b) ? prev.filter((x) => x !== b) : [...prev, b]));
  };

  const toggleFeature = (f) => {
    setSelectedFeatures((prev) => (prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f]));
  };

  const toggleRating = (r) => {
    setSelectedRatings((prev) => (prev.includes(r) ? prev.filter((x) => x !== r) : [...prev, r]));
  };

  const applyPrice = () => {
    setAppliedMinPrice(minPrice);
    setAppliedMaxPrice(maxPrice);
  };

  const clearAllFilters = () => {
    setSelectedBrands([]);
    setSelectedFeatures([]);
    setSelectedRatings([]);
    setCondition('any');
    setVerifiedOnly(false);
    setMinPrice('');
    setMaxPrice('');
    setAppliedMinPrice('');
    setAppliedMaxPrice('');
    const next = new URLSearchParams();
    if (view === 'list') next.set('view', 'list');
    setSearchParams(next, { replace: true });
  };

  const removeTagBrand = (b) => setSelectedBrands((prev) => prev.filter((x) => x !== b));
  const removeTagFeature = (f) => setSelectedFeatures((prev) => prev.filter((x) => x !== f));
  const removeTagRating = (r) => setSelectedRatings((prev) => prev.filter((x) => x !== r));

  const breadcrumbLabel = category || (search ? `"${search}"` : 'All products');

  const hasActiveTags =
    selectedBrands.length > 0 ||
    selectedFeatures.length > 0 ||
    selectedRatings.length > 0 ||
    (appliedMinPrice !== '' && appliedMinPrice != null) ||
    (appliedMaxPrice !== '' && appliedMaxPrice != null) ||
    search ||
    category;

  const toggleWishlist = (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    setWishlist((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const sidebar = (
    <ProductFilterSidebar
      selectedCategory={category}
      selectedSearch={search}
      onPickCategory={onPickCategory}
      selectedBrands={selectedBrands}
      onToggleBrand={toggleBrand}
      selectedFeatures={selectedFeatures}
      onToggleFeature={toggleFeature}
      minPrice={minPrice}
      maxPrice={maxPrice}
      onMinPriceChange={setMinPrice}
      onMaxPriceChange={setMaxPrice}
      onApplyPrice={applyPrice}
      priceExtent={priceExtent}
      condition={condition}
      onConditionChange={setCondition}
      selectedRatings={selectedRatings}
      onToggleRating={toggleRating}
      showAllCategories={showAllCategories}
      onToggleSeeAllCategories={() => setShowAllCategories((s) => !s)}
    />
  );

  return (
    <>
      <div className="max-w-container mx-auto px-4 lg:px-10 py-6 lg:py-8">
      {/* Breadcrumbs */}
      <nav className="mb-4 flex flex-wrap items-center gap-1 text-sm text-gray-500-custom">
        <Link to="/" className="hover:text-primary">
          Home
        </Link>
        <span className="text-gray-300">/</span>
        <Link to="/products" className="hover:text-primary">
          Products
        </Link>
        <span className="text-gray-300">/</span>
        <span className="font-medium text-dark">{breadcrumbLabel}</span>
      </nav>

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        {/* Mobile / tablet collapsible filters */}
        <details className="group rounded-lg border border-gray-200-custom bg-white lg:hidden">
          <summary className="cursor-pointer list-none px-4 py-3 text-sm font-semibold text-dark [&::-webkit-details-marker]:hidden">
            <span className="flex items-center justify-between">
              Filters
              <span className="text-xs font-normal text-gray-500-custom">{filtered.length} results</span>
            </span>
          </summary>
          <div className="border-t border-gray-100-custom px-2 pb-2">{sidebar}</div>
        </details>

        {/* Desktop sidebar */}
        <aside className="hidden w-full shrink-0 lg:block lg:w-[260px] xl:w-[280px]">
          <div className="lg:sticky lg:top-24">{sidebar}</div>
        </aside>

        {/* Main */}
        <div className="min-w-0 flex-1">
          {error && (
            <div className="mb-4 rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>
          )}

          {/* Toolbar */}
          <div className="mb-4 flex flex-col gap-3 rounded-lg border border-gray-200-custom bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-gray-700">
              <span className="font-bold text-dark">{filtered.length.toLocaleString()}</span>{' '}
              <span className="text-gray-500-custom">items in</span>{' '}
              <span className="font-semibold text-dark">{breadcrumbLabel}</span>
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={verifiedOnly}
                  onChange={(e) => setVerifiedOnly(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                Verified only
              </label>
              <div className="flex items-center gap-2">
                <label htmlFor="sort-featured" className="text-xs text-gray-500-custom whitespace-nowrap">
                  Sort
                </label>
                <select
                  id="sort-featured"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="rounded-md border border-gray-200-custom bg-white px-2 py-1.5 text-sm outline-none focus:border-primary"
                >
                  <option value="featured">Featured</option>
                  <option value="price-asc">Price: Low to high</option>
                  <option value="price-desc">Price: High to low</option>
                  <option value="name">Name</option>
                </select>
              </div>
              <div className="ml-auto flex rounded-md border border-gray-200-custom bg-gray-100-custom p-0.5">
                <button
                  type="button"
                  onClick={() => setView('grid')}
                  className={`rounded p-2 transition-colors ${view === 'grid' ? 'bg-white text-primary shadow-sm' : 'text-gray-500-custom hover:text-dark'}`}
                  aria-label="Grid view"
                  title="Grid view"
                >
                  <BsGrid3X3GapFill className="text-lg" />
                </button>
                <button
                  type="button"
                  onClick={() => setView('list')}
                  className={`rounded p-2 transition-colors ${view === 'list' ? 'bg-white text-primary shadow-sm' : 'text-gray-500-custom hover:text-dark'}`}
                  aria-label="List view"
                  title="List view"
                >
                  <BsListUl className="text-xl" />
                </button>
              </div>
            </div>
          </div>

          {/* Active filter chips (grid design) */}
          {hasActiveTags && (
            <div className="mb-4 flex flex-wrap items-center gap-2">
              {category && (
                <span className="inline-flex items-center gap-1 rounded-full bg-[#E5F1FF] px-2.5 py-1 text-xs font-medium text-primary">
                  {category}
                  <button
                    type="button"
                    className="hover:text-red-600"
                    onClick={() => {
                      const next = new URLSearchParams(searchParams);
                      next.delete('category');
                      setSearchParams(next, { replace: true });
                    }}
                    aria-label="Remove category"
                  >
                    ×
                  </button>
                </span>
              )}
              {search && !category && (
                <span className="inline-flex items-center gap-1 rounded-full bg-[#E5F1FF] px-2.5 py-1 text-xs font-medium text-primary">
                  {search}
                  <button
                    type="button"
                    className="hover:text-red-600"
                    onClick={() => {
                      const next = new URLSearchParams(searchParams);
                      next.delete('search');
                      setSearchParams(next, { replace: true });
                    }}
                    aria-label="Remove search"
                  >
                    ×
                  </button>
                </span>
              )}
              {selectedBrands.map((b) => (
                <span
                  key={b}
                  className="inline-flex items-center gap-1 rounded-full bg-[#E5F1FF] px-2.5 py-1 text-xs font-medium text-primary"
                >
                  {b}
                  <button type="button" className="hover:text-red-600" onClick={() => removeTagBrand(b)} aria-label={`Remove ${b}`}>
                    ×
                  </button>
                </span>
              ))}
              {selectedFeatures.map((f) => (
                <span
                  key={f}
                  className="inline-flex items-center gap-1 rounded-full bg-[#E5F1FF] px-2.5 py-1 text-xs font-medium text-primary"
                >
                  {f}
                  <button type="button" className="hover:text-red-600" onClick={() => removeTagFeature(f)} aria-label={`Remove ${f}`}>
                    ×
                  </button>
                </span>
              ))}
              {selectedRatings.map((r) => (
                <span
                  key={r}
                  className="inline-flex items-center gap-1 rounded-full bg-[#E5F1FF] px-2.5 py-1 text-xs font-medium text-primary"
                >
                  {r} star
                  <button type="button" className="hover:text-red-600" onClick={() => removeTagRating(r)} aria-label={`Remove ${r} star`}>
                    ×
                  </button>
                </span>
              ))}
              {(appliedMinPrice !== '' || appliedMaxPrice !== '') && (
                <span className="inline-flex items-center gap-1 rounded-full bg-[#E5F1FF] px-2.5 py-1 text-xs font-medium text-primary">
                  ${appliedMinPrice || '…'} – ${appliedMaxPrice || '…'}
                  <button
                    type="button"
                    className="hover:text-red-600"
                    onClick={() => {
                      setMinPrice('');
                      setMaxPrice('');
                      setAppliedMinPrice('');
                      setAppliedMaxPrice('');
                    }}
                    aria-label="Remove price filter"
                  >
                    ×
                  </button>
                </span>
              )}
              <button type="button" onClick={clearAllFilters} className="text-xs font-semibold text-primary hover:underline">
                Clear all filter
              </button>
            </div>
          )}

          {loading && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-80 animate-pulse rounded-lg bg-gray-100-custom" />
              ))}
            </div>
          )}

          {!loading && !error && view === 'grid' && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {pageItems.map((p) => {
                const rating = pseudoRating(p.id);
                const was = listPriceWas(p.price, p.id);
                const liked = wishlist.has(p.id);
                return (
                  <div
                    key={p.id}
                    className="group relative flex flex-col overflow-hidden rounded-lg border border-gray-200-custom bg-white transition-shadow hover:shadow-md"
                  >
                    <Link to={`/products/${p.id}`} className="block flex-1">
                      <div className="relative aspect-square overflow-hidden bg-gray-100-custom">
                        <img src={p.image} alt={p.name} className="h-full w-full object-cover transition-transform group-hover:scale-[1.02]" loading="lazy" />
                      </div>
                      <div className="relative p-3">
                        <div className="mb-1 flex items-start justify-between gap-2">
                          <div>
                            <p className="text-lg font-bold text-dark">
                              ${p.price.toFixed(2)}{' '}
                              <span className="text-sm font-normal text-gray-400 line-through">${was.toFixed(2)}</span>
                            </p>
                            <div className="mt-1 flex items-center gap-1.5 text-xs text-gray-600">
                              <StarRow rating={rating} />
                              <span>{rating.toFixed(1)}</span>
                            </div>
                          </div>
                        </div>
                        <h3 className="line-clamp-2 text-sm font-medium leading-snug text-dark">{p.name}</h3>
                      </div>
                    </Link>
                    <button
                      type="button"
                      onClick={(e) => toggleWishlist(e, p.id)}
                      className={`absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full border bg-white/95 shadow-sm transition-colors ${
                        liked ? 'border-primary text-primary' : 'border-gray-200-custom text-primary hover:bg-blue-50'
                      }`}
                      aria-label={liked ? 'Remove from wishlist' : 'Add to wishlist'}
                    >
                      <FiHeart className={liked ? 'fill-current' : ''} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {!loading && !error && view === 'list' && (
            <div className="space-y-3">
              {pageItems.map((p) => {
                const rating = pseudoRating(p.id);
                const was = listPriceWas(p.price, p.id);
                const orders = pseudoOrders(p.id);
                const liked = wishlist.has(p.id);
                return (
                  <div
                    key={p.id}
                    className="relative flex flex-col gap-4 rounded-lg border border-gray-200-custom bg-white p-4 transition-shadow hover:shadow-md sm:flex-row"
                  >
                    <Link to={`/products/${p.id}`} className="flex shrink-0 sm:w-36">
                      <div className="mx-auto h-32 w-full max-w-[140px] overflow-hidden rounded-md bg-gray-100-custom sm:mx-0 sm:h-32 sm:w-32">
                        <img src={p.image} alt="" className="h-full w-full object-cover" />
                      </div>
                    </Link>
                    <div className="min-w-0 flex-1">
                      <Link to={`/products/${p.id}`}>
                        <h2 className="text-base font-semibold text-dark hover:text-primary sm:text-lg">{p.name}</h2>
                      </Link>
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <span className="text-lg font-bold text-dark">${p.price.toFixed(2)}</span>
                        <span className="text-sm text-gray-400 line-through">${was.toFixed(2)}</span>
                      </div>
                      <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-gray-600">
                        <StarRow rating={rating} />
                        <span className="font-medium">{rating.toFixed(1)}</span>
                        <span className="text-gray-400">|</span>
                        <span>{orders} orders</span>
                      </div>
                      {p.stock > 0 && <p className="mt-2 text-sm font-medium text-green-600">Free Shipping</p>}
                      <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-gray-600">{p.description || 'Quality product from verified suppliers.'}</p>
                      <Link to={`/products/${p.id}`} className="mt-3 inline-block text-sm font-semibold text-primary hover:underline">
                        View details
                      </Link>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => toggleWishlist(e, p.id)}
                      className={`self-start rounded-full border p-2 transition-colors sm:self-center ${
                        liked ? 'border-primary text-primary' : 'border-gray-200-custom text-primary hover:bg-blue-50'
                      }`}
                      aria-label="Wishlist"
                    >
                      <FiHeart className={liked ? 'fill-current' : ''} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {!loading && !error && filtered.length === 0 && (
            <p className="rounded-lg border border-dashed border-gray-200-custom py-16 text-center text-gray-500-custom">
              No products match your filters.
            </p>
          )}

          {!loading && !error && filtered.length > 0 && (
            <div className="mt-6 flex flex-col items-stretch justify-between gap-3 border-t border-gray-100-custom pt-4 sm:flex-row sm:items-center">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>Show</span>
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setPage(1);
                  }}
                  className="rounded-md border border-gray-200-custom px-2 py-1 text-sm outline-none focus:border-primary"
                >
                  {[10, 20, 50].map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-1">
                <button
                  type="button"
                  disabled={currentPage <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="rounded-md border border-gray-200-custom px-3 py-1.5 text-sm font-medium text-dark hover:bg-gray-bg disabled:opacity-40"
                >
                  ‹
                </button>
                {(() => {
                  const nums = [];
                  const windowSize = Math.min(5, totalPages);
                  let start = 1;
                  if (totalPages > 5) {
                    start = Math.max(1, Math.min(currentPage - 2, totalPages - 4));
                  }
                  for (let i = 0; i < windowSize; i += 1) nums.push(start + i);
                  return nums.map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setPage(n)}
                      className={`min-w-[2.25rem] rounded-md px-2 py-1.5 text-sm font-semibold ${
                        currentPage === n ? 'bg-primary text-white' : 'border border-gray-200-custom text-dark hover:bg-gray-bg'
                      }`}
                    >
                      {n}
                    </button>
                  ));
                })()}
                <button
                  type="button"
                  disabled={currentPage >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className="rounded-md border border-gray-200-custom px-3 py-1.5 text-sm font-medium text-dark hover:bg-gray-bg disabled:opacity-40"
                >
                  ›
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      </div>

      <div className="max-w-container mx-auto mt-8 px-4 lg:px-10">
        <PromoBanner />
      </div>
      <Newsletter />
    </>
  );
}
