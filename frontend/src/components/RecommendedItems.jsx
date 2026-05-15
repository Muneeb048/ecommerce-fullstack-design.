import { Link } from 'react-router-dom';

const FALLBACK = [
  { id: 'f1', price: '$10.30', name: 'T-shirts with multiple colors, for men', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop&q=80' },
  { id: 'f2', price: '$10.30', name: 'Jeans shorts for men blue color', image: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=300&h=300&fit=crop&q=80' },
  { id: 'f3', price: '$12.50', name: 'Brown winter coat medium size', image: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=300&h=300&fit=crop&q=80' },
  { id: 'f4', price: '$34.00', name: 'Jeans bag for travel for men', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop&q=80' },
  { id: 'f5', price: '$99.00', name: 'Leather wallet', image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=300&h=300&fit=crop&q=80' },
  { id: 'f6', price: '$9.99', name: 'Canon camera black, 100x zoom', image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=300&h=300&fit=crop&q=80' },
  { id: 'f7', price: '$8.99', name: 'Headset for gaming with mic', image: 'https://images.unsplash.com/photo-1599669454699-248893623440?w=300&h=300&fit=crop&q=80' },
  { id: 'f8', price: '$10.30', name: 'Smartwatch silver color modern', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop&q=80' },
  { id: 'f9', price: '$10.30', name: 'Blue wallet for men leather material', image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=300&h=300&fit=crop&q=80' },
  { id: 'f10', price: '$80.95', name: 'Backpack for travel for men', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop&q=80' },
];

function formatPrice(n) {
  const num = Number(n);
  if (Number.isNaN(num)) return n;
  return `$${num.toFixed(2)}`;
}

function RecommendedItems({ products = [] }) {
  const items =
    products.length > 0
      ? products.slice(0, 10).map((p) => ({
          id: p.id,
          price: formatPrice(p.price),
          name: p.name,
          image: p.image,
        }))
      : FALLBACK;

  return (
    <section className="max-w-container mx-auto px-4 lg:px-10 mt-8">
      <h2 className="mb-4 text-xl font-bold text-gray-900">Recommended items</h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5">
        {items.map((item) => (
          <Link
            key={item.id}
            to={/^f\d+$/.test(String(item.id)) ? '/products' : `/products/${item.id}`}
            className="group rounded-lg border border-gray-200-custom bg-white p-3 transition-shadow hover:shadow-md"
          >
            <div className="mb-3 aspect-square overflow-hidden rounded-md bg-gray-50 ring-1 ring-gray-100">
              <img src={item.image} alt="" className="h-full w-full object-cover transition-transform group-hover:scale-105" />
            </div>
            <p className="text-base font-bold text-gray-900">{item.price}</p>
            <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-gray-500">{item.name}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default RecommendedItems;
