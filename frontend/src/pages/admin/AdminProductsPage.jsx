import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { deleteProduct, fetchProducts } from '../../lib/api';

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetchProducts({});
      setProducts(res.data || []);
    } catch (e) {
      setError(e.message || 'Failed to load');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (e) {
      alert(e.message || 'Delete failed');
    }
  };

  return (
    <div>
      {error && <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-3">{error}</div>}
      {loading ? (
        <p className="text-gray-500-custom">Loading products…</p>
      ) : (
        <div className="overflow-x-auto bg-white border border-gray-200-custom rounded-lg">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100-custom text-left text-gray-600">
              <tr>
                <th className="px-4 py-3 font-semibold">Image</th>
                <th className="px-4 py-3 font-semibold">Name</th>
                <th className="px-4 py-3 font-semibold">Category</th>
                <th className="px-4 py-3 font-semibold">Price</th>
                <th className="px-4 py-3 font-semibold">Stock</th>
                <th className="px-4 py-3 font-semibold">Featured</th>
                <th className="px-4 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-t border-gray-100-custom">
                  <td className="px-4 py-2">
                    <img src={p.image} alt="" className="w-12 h-12 object-cover rounded" />
                  </td>
                  <td className="px-4 py-2 font-medium text-dark max-w-[200px] truncate">{p.name}</td>
                  <td className="px-4 py-2 text-gray-600">{p.category}</td>
                  <td className="px-4 py-2">{p.price}</td>
                  <td className="px-4 py-2">{p.stock}</td>
                  <td className="px-4 py-2">{p.featured ? 'Yes' : 'No'}</td>
                  <td className="px-4 py-2 text-right space-x-2 whitespace-nowrap">
                    <Link to={`/admin/products/${p.id}/edit`} className="text-primary font-semibold hover:underline">
                      Edit
                    </Link>
                    <button type="button" onClick={() => onDelete(p.id)} className="text-red-600 font-semibold hover:underline">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {products.length === 0 && (
            <p className="text-center text-gray-500-custom py-10">No products yet. Add one to get started.</p>
          )}
        </div>
      )}
    </div>
  );
}
