import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft, FiShoppingCart, FiShield, FiMessageCircle, FiTruck } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import Newsletter from '../components/Newsletter';
import PromoBanner from '../components/PromoBanner';

const SAVED_KEY = 'ecomm_saved_v1';

function readSaved() {
  try {
    const raw = localStorage.getItem(SAVED_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export default function CartPage() {
  const { items, removeItem, setQty, subtotal, clearCart, addItem } = useCart();
  const [saved, setSaved] = useState(readSaved);
  const [coupon, setCoupon] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(false);

  useEffect(() => {
    localStorage.setItem(SAVED_KEY, JSON.stringify(saved));
  }, [saved]);

  const discount = appliedCoupon ? Math.min(60, subtotal * 0.05) : 0;
  const tax = subtotal > 0 ? Math.round(subtotal * 0.01 * 100) / 100 : 0;
  const total = Math.max(0, subtotal - discount + tax);

  const moveToSaved = (line) => {
    removeItem(line.productId);
    setSaved((prev) => {
      if (prev.some((s) => s.productId === line.productId)) return prev;
      return [...prev, { productId: line.productId, name: line.name, price: line.price, image: line.image, stock: line.stock }];
    });
  };

  const moveSavedToCart = (row) => {
    addItem(
      { id: row.productId, name: row.name, price: row.price, image: row.image, stock: row.stock },
      1
    );
    setSaved((prev) => prev.filter((s) => s.productId !== row.productId));
  };

  const removeSaved = (productId) => {
    setSaved((prev) => prev.filter((s) => s.productId !== productId));
  };

  const applyCoupon = () => {
    const c = coupon.trim();
    if (!c) {
      setAppliedCoupon(false);
      return;
    }
    setAppliedCoupon(true);
  };

  const qtyOptions = (max) => Array.from({ length: max }, (_, i) => i + 1);

  if (items.length === 0) {
    return (
      <div className="max-w-container mx-auto px-4 py-12 text-center lg:px-10">
        <h1 className="text-2xl font-bold text-dark">My cart (0)</h1>
        <p className="mt-2 text-gray-500-custom">Your cart is empty. Browse the catalog and add items you like.</p>
        <Link
          to="/products"
          className="mt-8 inline-flex items-center gap-2 rounded-md bg-primary px-8 py-3 font-semibold text-white hover:opacity-95"
        >
          <FiArrowLeft /> Back to shop
        </Link>
        {saved.length > 0 && (
          <div className="mx-auto mt-12 max-w-4xl text-left">
            <h2 className="mb-4 text-lg font-bold text-dark">Saved for later</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {saved.map((row) => (
                <div key={row.productId} className="overflow-hidden rounded-lg border border-gray-200-custom bg-white p-3">
                  <Link to={`/products/${row.productId}`}>
                    <div className="aspect-square overflow-hidden rounded-md bg-gray-100-custom">
                      <img src={row.image} alt="" className="h-full w-full object-cover" />
                    </div>
                  </Link>
                  <p className="mt-2 text-base font-bold text-dark">${Number(row.price).toFixed(2)}</p>
                  <p className="mt-1 line-clamp-2 text-xs text-gray-600">{row.name}</p>
                  <button
                    type="button"
                    onClick={() => moveSavedToCart(row)}
                    className="mt-3 flex w-full items-center justify-center gap-2 rounded-md border border-primary py-2 text-sm font-semibold text-primary hover:bg-blue-50"
                  >
                    <FiShoppingCart /> Move to cart
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="mx-auto mt-12 max-w-container">
          <PromoBanner />
        </div>
        <Newsletter />
      </div>
    );
  }

  const count = useMemo(() => items.reduce((s, i) => s + i.qty, 0), [items]);

  return (
    <div className="max-w-container mx-auto px-4 py-6 lg:px-10 lg:py-10">
      <h1 className="mb-6 text-2xl font-bold text-dark">
        My cart ({count})
      </h1>

      <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
        <div className="min-w-0 flex-1 space-y-4">
          {items.map((line) => {
            const max = line.stock ?? 99;
            return (
              <div
                key={line.productId}
                className="flex flex-col gap-4 rounded-lg border border-gray-200-custom bg-white p-4 sm:flex-row sm:items-stretch"
              >
                <Link to={`/products/${line.productId}`} className="mx-auto h-28 w-28 shrink-0 overflow-hidden rounded-md bg-gray-100-custom sm:mx-0">
                  <img src={line.image} alt="" className="h-full w-full object-cover" />
                </Link>
                <div className="min-w-0 flex-1">
                  <Link to={`/products/${line.productId}`} className="text-base font-semibold text-dark hover:text-primary sm:text-lg">
                    {line.name}
                  </Link>
                  <p className="mt-2 text-xs leading-relaxed text-gray-500-custom">
                    Size: <span className="text-gray-700">Standard</span> · Color: <span className="text-gray-700">As shown</span> ·
                    Material: <span className="text-gray-700">Premium</span>
                    <br />
                    Seller: <span className="text-gray-700">Verified Store</span>
                  </p>
                  <div className="mt-3 flex flex-wrap gap-4 text-sm">
                    <button type="button" onClick={() => removeItem(line.productId)} className="font-semibold text-red-600 hover:underline">
                      Remove
                    </button>
                    <button type="button" onClick={() => moveToSaved(line)} className="font-semibold text-primary hover:underline">
                      Save for later
                    </button>
                  </div>
                </div>
                <div className="flex shrink-0 flex-col items-end justify-between border-t border-gray-100-custom pt-3 sm:border-l sm:border-t-0 sm:pl-6 sm:pt-0">
                  <p className="text-lg font-bold text-dark">${(line.price * line.qty).toFixed(2)}</p>
                  <label className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                    <span>Qty:</span>
                    <select
                      value={line.qty}
                      onChange={(e) => setQty(line.productId, Number(e.target.value))}
                      className="rounded-md border border-gray-200-custom bg-white px-2 py-1.5 text-sm outline-none focus:border-primary"
                    >
                      {qtyOptions(max).map((n) => (
                        <option key={n} value={n}>
                          {n}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
              </div>
            );
          })}

          <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
            <Link
              to="/products"
              className="inline-flex w-fit items-center justify-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:opacity-95"
            >
              <FiArrowLeft /> Back to shop
            </Link>
            <button
              type="button"
              onClick={() => clearCart()}
              className="rounded-md border border-primary px-5 py-2.5 text-sm font-semibold text-primary hover:bg-blue-50"
            >
              Remove all
            </button>
          </div>
        </div>

        <aside className="w-full shrink-0 lg:w-[320px]">
          <div className="space-y-4 lg:sticky lg:top-24">
            <div className="rounded-lg border border-gray-200-custom bg-white p-5">
              <p className="text-sm font-semibold text-dark">Have a coupon?</p>
              <div className="mt-2 flex gap-2">
                <input
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                  placeholder="Add coupon"
                  className="min-w-0 flex-1 rounded-md border border-gray-200-custom px-3 py-2 text-sm outline-none focus:border-primary"
                />
                <button
                  type="button"
                  onClick={applyCoupon}
                  className="shrink-0 rounded-md border border-primary bg-white px-4 py-2 text-sm font-semibold text-primary hover:bg-blue-50"
                >
                  Apply
                </button>
              </div>
            </div>

            <div className="rounded-lg border border-gray-200-custom bg-white p-6 shadow-sm">
              <h2 className="text-base font-bold text-dark">Order summary</h2>
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-medium text-dark">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Discount</span>
                  <span className={`font-semibold ${discount > 0 ? 'text-red-600' : 'text-gray-400'}`}>
                    {discount > 0 ? `-$${discount.toFixed(2)}` : '$0.00'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-semibold text-green-600">+${tax.toFixed(2)}</span>
                </div>
              </div>
              <div className="mt-4 flex justify-between border-t border-gray-100-custom pt-4 text-lg font-bold text-dark">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <button
                type="button"
                className="mt-6 w-full rounded-md bg-emerald-500 py-3 text-base font-bold text-white shadow-sm transition-colors hover:bg-emerald-600"
                onClick={() => alert('Checkout is not implemented in this demo.')}
              >
                Checkout
              </button>
              <p className="mt-4 text-center text-[10px] uppercase tracking-wider text-gray-400">We accept</p>
              <div className="mt-2 flex flex-wrap items-center justify-center gap-3 text-xs font-semibold text-gray-500">
                <span>Amex</span>
                <span>Mastercard</span>
                <span>PayPal</span>
                <span>Visa</span>
                <span>Apple Pay</span>
              </div>
            </div>
          </div>
        </aside>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-4 rounded-lg border border-gray-200-custom bg-white p-6 sm:grid-cols-3">
        {[
          { icon: FiShield, title: 'Secure payment', sub: 'Your payment information is processed safely.' },
          { icon: FiMessageCircle, title: 'Customer support', sub: 'Have you ever finally just write or call us anytime.' },
          { icon: FiTruck, title: 'Free delivery', sub: 'On eligible orders from verified suppliers.' },
        ].map((t) => (
          <div key={t.title} className="flex gap-3">
            <t.icon className="mt-0.5 shrink-0 text-2xl text-gray-400" />
            <div>
              <p className="font-semibold text-dark">{t.title}</p>
              <p className="mt-1 text-xs text-gray-500-custom leading-relaxed">{t.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {saved.length > 0 && (
        <div className="mt-10 rounded-lg border border-gray-200-custom bg-white p-6">
          <h2 className="mb-4 text-lg font-bold text-dark">Saved for later</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {saved.map((row) => (
              <div key={row.productId} className="flex flex-col overflow-hidden rounded-lg border border-gray-100-custom bg-gray-100-custom p-3">
                <Link to={`/products/${row.productId}`}>
                  <div className="aspect-square overflow-hidden rounded-md bg-white">
                    <img src={row.image} alt="" className="h-full w-full object-cover" />
                  </div>
                </Link>
                <p className="mt-3 text-lg font-bold text-dark">${Number(row.price).toFixed(2)}</p>
                <p className="mt-1 line-clamp-2 text-xs text-gray-600">{row.name}</p>
                <div className="mt-auto flex flex-col gap-2 pt-3">
                  <button
                    type="button"
                    onClick={() => moveSavedToCart(row)}
                    className="flex w-full items-center justify-center gap-2 rounded-md border border-primary py-2 text-sm font-semibold text-primary hover:bg-blue-50"
                  >
                    <FiShoppingCart /> Move to cart
                  </button>
                  <button type="button" onClick={() => removeSaved(row.productId)} className="text-xs font-semibold text-gray-500 hover:text-red-600">
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-10">
        <PromoBanner />
      </div>
      <Newsletter />
    </div>
  );
}
