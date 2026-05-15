import { Link } from 'react-router-dom';

export default function ProductCard({ product }) {
  return (
    <Link
      to={`/products/${product.id}`}
      className="group flex flex-col bg-white rounded-lg border border-gray-200-custom overflow-hidden hover:shadow-md transition-shadow"
    >
      <div className="aspect-square bg-gray-100-custom overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
          loading="lazy"
        />
      </div>
      <div className="p-3 flex flex-col flex-1 gap-1">
        <p className="text-xs text-gray-500-custom uppercase tracking-wide">{product.category}</p>
        <h3 className="text-sm font-semibold text-dark line-clamp-2 min-h-[2.5rem]">{product.name}</h3>
        <p className="text-base font-bold text-primary mt-auto">USD {product.price}</p>
        {product.stock != null && (
          <p className="text-xs text-gray-500-custom">{product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}</p>
        )}
      </div>
    </Link>
  );
}
