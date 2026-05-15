import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FiCheck, FiHeart, FiMapPin, FiShield, FiGlobe } from 'react-icons/fi';
import { fetchProduct, fetchProducts } from '../lib/api';
import { useCart } from '../context/CartContext';
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
  return Math.round((40 + (h % 11)) / 10) / 10;
}

function pseudoReviews(id) {
  return 10 + (Math.abs(hashString(id)) % 90);
}

function pseudoSold(id) {
  return 80 + (Math.abs(hashString(id)) % 400);
}

function listPriceWas(price, id) {
  const bump = 1.08 + (Math.abs(hashString(id)) % 10) / 100;
  return Math.round(price * bump * 100) / 100;
}

export default function ProductDetailPage() {
  const { id } = useParams();
  const { addItem } = useCart();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [added, setAdded] = useState(false);
  const [activeThumb, setActiveThumb] = useState(0);
  const [activeTab, setActiveTab] = useState('description');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetchProduct(id);
        if (!cancelled) {
          setProduct(res.data);
          setQty(1);
          setActiveThumb(0);
        }
      } catch (e) {
        if (!cancelled) setError(e.message || 'Product not found');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  useEffect(() => {
    if (!product) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetchProducts({ category: product.category });
        const list = (res.data || []).filter((p) => p.id !== product.id);
        if (!cancelled) setRelated(list);
      } catch {
        if (!cancelled) setRelated([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [product]);

  const thumbs = useMemo(() => {
    if (!product) return [];
    return Array.from({ length: 6 }, (_, i) => ({ key: i, src: product.image }));
  }, [product]);

  const maxQty = product?.stock ?? 0;
  const canBuy = product && maxQty > 0;
  const rating = product ? pseudoRating(product.id) : 0;
  const reviews = product ? pseudoReviews(product.id) : 0;
  const sold = product ? pseudoSold(product.id) : 0;
  const wasPrice = product ? listPriceWas(product.price, product.id) : 0;

  const bulkTiers = useMemo(() => {
    if (!product) return [];
    const p = product.price;
    return [
      { price: (p * 0.98).toFixed(2), range: '50-100 pcs' },
      { price: (p * 0.95).toFixed(2), range: '100-500 pcs' },
      { price: (p * 0.92).toFixed(2), range: '500+ pcs' },
    ];
  }, [product]);

  const handleAdd = () => {
    if (!product || !canBuy) return;
    addItem(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) {
    return (
      <div className="max-w-container mx-auto px-4 py-12 lg:px-10">
        <div className="h-96 animate-pulse rounded-xl bg-gray-100-custom" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-container mx-auto px-4 py-16 text-center lg:px-10">
        <p className="mb-4 text-gray-600">{error || 'Product unavailable.'}</p>
        <Link to="/products" className="font-semibold text-primary hover:underline">
          Back to catalog
        </Link>
      </div>
    );
  }

  const youMayLike = related.slice(0, 5);
  const relatedGrid = related.slice(0, 6);

  const tabs = [
    { id: 'description', label: 'Description' },
    { id: 'reviews', label: 'Reviews' },
    { id: 'shipping', label: 'Shipping' },
    { id: 'seller', label: 'About seller' },
  ];

  return (
    <div className="max-w-container mx-auto px-4 py-6 lg:px-10 lg:py-10">
      <nav className="mb-6 flex flex-wrap gap-1 text-sm text-gray-500-custom">
        <Link to="/" className="hover:text-primary">
          Home
        </Link>
        <span className="text-gray-300">/</span>
        <Link to="/products" className="hover:text-primary">
          Products
        </Link>
        <span className="text-gray-300">/</span>
        <Link to={`/products?category=${encodeURIComponent(product.category)}`} className="hover:text-primary">
          {product.category}
        </Link>
        <span className="text-gray-300">/</span>
        <span className="line-clamp-1 font-medium text-dark">{product.name}</span>
      </nav>

      <div className="overflow-hidden rounded-xl border border-gray-200-custom bg-white shadow-sm">
        <div className="grid grid-cols-1 gap-8 p-6 lg:grid-cols-12 lg:gap-6 lg:p-8">
          <div className="lg:col-span-5">
            <div className="overflow-hidden rounded-lg bg-gray-100-custom">
              <img
                src={thumbs[activeThumb]?.src || product.image}
                alt={product.name}
                className="aspect-square w-full object-contain"
              />
            </div>
            <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
              {thumbs.map((t, i) => (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => setActiveThumb(i)}
                  className={`h-16 w-16 shrink-0 overflow-hidden rounded-md border-2 bg-white ${
                    activeThumb === i ? 'border-primary' : 'border-gray-200-custom'
                  }`}
                >
                  <img src={t.src} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div className="lg:col-span-4">
            <div className="flex items-center gap-2 text-sm font-medium text-green-600">
              <FiCheck className="text-lg" strokeWidth={2.5} />
              {maxQty > 0 ? 'In stock' : 'Out of stock'}
            </div>
            <h1 className="mt-2 text-2xl font-bold leading-tight text-dark sm:text-[26px]">{product.name}</h1>
            <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-gray-600">
              <span className="text-amber-400">{'★'.repeat(Math.min(5, Math.round(rating)))}</span>
              <span className="font-semibold text-dark">{rating.toFixed(1)}</span>
              <span className="text-gray-400">|</span>
              <span>{reviews} reviews</span>
              <span className="text-gray-400">|</span>
              <span>{sold} sold</span>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {bulkTiers.map((tier) => (
                <div key={tier.range} className="rounded-md border border-orange-200 bg-orange-50 px-3 py-2 text-center">
                  <p className="text-sm font-bold text-dark">${tier.price}</p>
                  <p className="text-[11px] text-gray-600">{tier.range}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 border-t border-gray-100-custom pt-4">
              <table className="w-full text-sm">
                <tbody className="divide-y divide-gray-100-custom">
                  <tr>
                    <td className="py-2 text-gray-500-custom">Price</td>
                    <td className="py-2 font-medium text-dark">Negotiable</td>
                  </tr>
                  <tr>
                    <td className="py-2 text-gray-500-custom">Type</td>
                    <td className="py-2 text-dark">{product.category}</td>
                  </tr>
                  <tr>
                    <td className="py-2 text-gray-500-custom">Material</td>
                    <td className="py-2 text-dark">Premium quality</td>
                  </tr>
                  <tr>
                    <td className="py-2 text-gray-500-custom">Design</td>
                    <td className="py-2 text-dark">Modern</td>
                  </tr>
                  <tr>
                    <td className="py-2 text-gray-500-custom">Protection</td>
                    <td className="py-2 text-dark">2 Year</td>
                  </tr>
                  <tr>
                    <td className="py-2 text-gray-500-custom">Warranty</td>
                    <td className="py-2 text-dark">1 year global</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-6">
              <p className="text-3xl font-bold text-dark">
                USD {product.price.toFixed(2)}{' '}
                <span className="text-lg font-normal text-gray-400 line-through">USD {wasPrice.toFixed(2)}</span>
              </p>
              <p className="mt-2 text-sm text-gray-500-custom">{maxQty > 0 ? `${maxQty} units available` : 'Currently unavailable'}</p>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="flex w-fit items-center rounded-md border border-gray-200-custom">
                <button
                  type="button"
                  className="px-3 py-2 text-lg text-gray-600 hover:bg-gray-50"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span className="min-w-[3rem] px-4 py-2 text-center font-semibold">{qty}</span>
                <button
                  type="button"
                  className="px-3 py-2 text-lg text-gray-600 hover:bg-gray-50"
                  onClick={() => setQty((q) => (canBuy ? Math.min(maxQty, q + 1) : q))}
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
              <button
                type="button"
                disabled={!canBuy}
                onClick={handleAdd}
                className="rounded-md bg-gradient-to-b from-primary-light to-primary-dark px-8 py-3 font-semibold text-white transition-opacity hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Add to cart
              </button>
              <Link
                to="/cart"
                className="rounded-md border border-primary py-3 text-center font-semibold text-primary transition-colors hover:bg-primary hover:text-white"
              >
                View cart
              </Link>
            </div>
            {added && <p className="mt-3 text-sm font-medium text-green-600">Added to your cart.</p>}
          </div>

          <div className="lg:col-span-3">
            <div className="rounded-lg border border-gray-200-custom bg-gray-100-custom p-5">
              <div className="flex items-start gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-teal-500 text-lg font-bold text-white">
                  R
                </div>
                <div>
                  <p className="font-semibold text-dark">Guanjoi Trading LLC</p>
                  <div className="mt-2 space-y-1.5 text-xs text-gray-600">
                    <p className="flex items-center gap-1.5">
                      <FiMapPin className="shrink-0 text-gray-400" /> Germany
                    </p>
                    <p className="flex items-center gap-1.5">
                      <FiShield className="shrink-0 text-green-600" /> Verified Seller
                    </p>
                    <p className="flex items-center gap-1.5">
                      <FiGlobe className="shrink-0 text-gray-400" /> Worldwide shipping
                    </p>
                  </div>
                </div>
              </div>
              <button
                type="button"
                className="mt-4 w-full rounded-md bg-gradient-to-b from-primary-light to-primary-dark py-2.5 text-sm font-semibold text-white hover:opacity-95"
                onClick={() => alert('Inquiry form is a demo in this build.')}
              >
                Send inquiry
              </button>
              <button
                type="button"
                className="mt-2 w-full rounded-md border border-primary bg-white py-2.5 text-sm font-semibold text-primary hover:bg-blue-50"
                onClick={() => alert('Seller profile is a demo.')}
              >
                Seller&apos;s profile
              </button>
              <button
                type="button"
                className="mt-3 flex w-full items-center justify-center gap-2 text-sm font-semibold text-primary hover:underline"
                onClick={() => alert('Saved to your list (demo).')}
              >
                <FiHeart /> Save for later
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <div className="border-b border-gray-200-custom">
            <div className="flex flex-wrap gap-6">
              {tabs.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setActiveTab(t.id)}
                  className={`relative pb-3 text-sm font-semibold transition-colors ${
                    activeTab === t.id ? 'text-primary' : 'text-gray-600 hover:text-dark'
                  }`}
                >
                  {t.label}
                  {activeTab === t.id && <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-primary" />}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 rounded-lg border border-gray-200-custom bg-white p-6">
            {activeTab === 'description' && (
              <div className="max-w-none text-sm leading-relaxed text-gray-700">
                <p className="leading-relaxed">{product.description || 'No description provided for this product.'}</p>
                <h3 className="mt-6 text-base font-bold text-dark">Specifications</h3>
                <div className="mt-3 grid grid-cols-1 gap-x-8 gap-y-2 sm:grid-cols-2 text-sm">
                  <div className="flex justify-between border-b border-gray-100-custom py-2">
                    <span className="text-gray-500-custom">Model</span>
                    <span className="font-medium text-dark">SKU-{String(product.id).slice(-6)}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-100-custom py-2">
                    <span className="text-gray-500-custom">Style</span>
                    <span className="font-medium text-dark">{product.category}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-100-custom py-2">
                    <span className="text-gray-500-custom">Certificate</span>
                    <span className="font-medium text-dark">CE / FCC</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-100-custom py-2">
                    <span className="text-gray-500-custom">Size</span>
                    <span className="font-medium text-dark">Standard</span>
                  </div>
                </div>
                <ul className="mt-6 space-y-2 text-sm">
                  {['Fast delivery options', 'Secure packaging', 'Easy returns within 30 days', '24/7 customer support'].map((line) => (
                    <li key={line} className="flex items-start gap-2">
                      <FiCheck className="mt-0.5 shrink-0 text-primary" />
                      {line}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {activeTab === 'reviews' && (
              <p className="text-sm text-gray-600">Reviews will appear here. This product has {reviews} community ratings (demo data).</p>
            )}
            {activeTab === 'shipping' && (
              <p className="text-sm text-gray-600">
                Standard shipping 5–10 business days. Express options available at checkout. Worldwide shipping from verified
                warehouses.
              </p>
            )}
            {activeTab === 'seller' && (
              <p className="text-sm text-gray-600">
                Guanjoi Trading LLC is a verified supplier with global fulfillment. Contact them using Send inquiry for bulk or
                custom orders.
              </p>
            )}
          </div>

          {relatedGrid.length > 0 && (
            <div className="mt-10">
              <h2 className="mb-4 text-lg font-bold text-dark">Related products</h2>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-3">
                {relatedGrid.map((p) => (
                  <Link
                    key={p.id}
                    to={`/products/${p.id}`}
                    className="overflow-hidden rounded-lg border border-gray-200-custom bg-white transition-shadow hover:shadow-md"
                  >
                    <div className="aspect-square bg-gray-100-custom">
                      <img src={p.image} alt="" className="h-full w-full object-cover" />
                    </div>
                    <div className="p-3">
                      <p className="line-clamp-2 text-sm font-medium text-dark">{p.name}</p>
                      <p className="mt-1 text-xs text-gray-500-custom">
                        ${(p.price * 0.9).toFixed(2)} – ${(p.price * 1.1).toFixed(2)}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        <aside className="lg:col-span-4">
          <div className="rounded-lg border border-gray-200-custom bg-white p-4 lg:sticky lg:top-28">
            <h2 className="mb-4 text-base font-bold text-dark">You may like</h2>
            <ul className="space-y-4">
              {youMayLike.length === 0 && <li className="text-sm text-gray-500-custom">No suggestions yet.</li>}
              {youMayLike.map((p) => (
                <li key={p.id}>
                  <Link to={`/products/${p.id}`} className="flex gap-3 group">
                    <div className="h-16 w-16 shrink-0 overflow-hidden rounded-md bg-gray-100-custom">
                      <img src={p.image} alt="" className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                    </div>
                    <div className="min-w-0">
                      <p className="line-clamp-2 text-sm font-medium text-dark group-hover:text-primary">{p.name}</p>
                      <p className="mt-1 text-xs text-gray-500-custom">
                        ${(p.price * 0.95).toFixed(2)} – ${(p.price * 1.05).toFixed(2)}
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>

      <div className="mt-10">
        <PromoBanner />
      </div>
      <Newsletter />
    </div>
  );
}
