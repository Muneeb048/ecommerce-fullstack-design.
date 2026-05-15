import { useEffect, useState } from 'react';
import HeroSection from '../components/HeroSection';
import DealsAndOffers from '../components/DealsAndOffers';
import CategorySection from '../components/CategorySection';
import SupplierQuote from '../components/SupplierQuote';
import RecommendedItems from '../components/RecommendedItems';
import ExtraServices from '../components/ExtraServices';
import SuppliersByRegion from '../components/SuppliersByRegion';
import Newsletter from '../components/Newsletter';
import { fetchProducts } from '../lib/api';

const BANNER_HOME =
  'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=900&fit=crop&q=80';
const BANNER_ELECTRONICS =
  'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&h=900&fit=crop&q=80';

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetchProducts({});
        if (!cancelled) setProducts(res.data || []);
      } catch (e) {
        if (!cancelled) setError(e.message || 'Could not load products');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const dealsSlice = products.slice(0, 5);

  const homeGarden = products.filter((p) => p.category === 'Home & Garden');
  const electronics = products.filter((p) => p.category === 'Electronics');

  const padCategory = (list, category, n = 8) => {
    if (list.length >= n) return list.slice(0, n);
    const rest = products.filter((p) => !list.some((x) => x.id === p.id) && p.category === category);
    const merged = [...list, ...rest];
    if (merged.length >= n) return merged.slice(0, n);
    const any = products.filter((p) => !merged.some((x) => x.id === p.id));
    return [...merged, ...any].slice(0, n);
  };

  const homeProducts = padCategory(homeGarden, 'Home & Garden').map((p) => ({
    id: p.id,
    name: p.name,
    price: String(p.price),
    image: p.image,
  }));

  const electronicsProducts = padCategory(electronics, 'Electronics').map((p) => ({
    id: p.id,
    name: p.name,
    price: String(p.price),
    image: p.image,
  }));

  const recommendedPool = products.length > 0 ? products.slice(5, 15) : [];

  return (
    <>
      <HeroSection />
      <DealsAndOffers products={dealsSlice} />

      {error && !loading && (
        <div className="max-w-container mx-auto px-4 lg:px-10 mt-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg py-3">
          {error}
        </div>
      )}

      {homeProducts.length > 0 && (
        <CategorySection
          title="Home and outdoor"
          products={homeProducts}
          bannerImage={BANNER_HOME}
          sourceHref="/products?category=Home%20%26%20Garden"
        />
      )}
      {electronicsProducts.length > 0 && (
        <CategorySection
          title="Consumer electronics and gadgets"
          products={electronicsProducts}
          bannerImage={BANNER_ELECTRONICS}
          sourceHref="/products?category=Electronics"
        />
      )}

      <SupplierQuote />
      <RecommendedItems products={recommendedPool} />
      <ExtraServices />
      <SuppliersByRegion />
      <Newsletter />

      {!loading && products.length === 0 && !error && (
        <p className="max-w-container mx-auto px-4 py-6 text-center text-sm text-gray-500-custom">
          No products in the database. Run{' '}
          <code className="rounded bg-gray-100-custom px-1">npm run seed</code> in the backend folder, then refresh.
        </p>
      )}
    </>
  );
}
