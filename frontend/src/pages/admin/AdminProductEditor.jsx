import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createProduct, fetchProduct, updateProduct } from '../../lib/api';

const emptyForm = {
  name: '',
  price: '',
  image: '',
  description: '',
  category: 'Electronics',
  stock: '',
  featured: false,
};

export default function AdminProductEditor() {
  const { id } = useParams();
  const isNew = !id;
  const navigate = useNavigate();
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isNew) {
      setForm(emptyForm);
      setLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const res = await fetchProduct(id);
        const p = res.data;
        if (!cancelled) {
          setForm({
            name: p.name,
            price: String(p.price),
            image: p.image,
            description: p.description || '',
            category: p.category,
            stock: String(p.stock),
            featured: Boolean(p.featured),
          });
        }
      } catch (e) {
        if (!cancelled) setError(e.message || 'Load failed');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id, isNew]);

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    const payload = {
      name: form.name.trim(),
      price: Number(form.price),
      image: form.image.trim(),
      description: form.description.trim(),
      category: form.category.trim(),
      stock: Number(form.stock),
      featured: form.featured,
    };
    try {
      if (isNew) {
        await createProduct(payload);
      } else {
        await updateProduct(id, payload);
      }
      navigate('/admin');
    } catch (err) {
      setError(err.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p className="text-gray-500-custom">Loading…</p>;
  }

  return (
    <div className="max-w-2xl">
      <h2 className="text-xl font-bold text-dark mb-4">{isNew ? 'Add product' : 'Edit product'}</h2>
      {error && <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-3">{error}</div>}
      <form onSubmit={onSubmit} className="bg-white border border-gray-200-custom rounded-lg p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input name="name" value={form.name} onChange={onChange} required className="w-full border border-gray-200-custom rounded-md px-3 py-2 text-sm" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Price (USD)</label>
            <input name="price" type="number" min="0" step="0.01" value={form.price} onChange={onChange} required className="w-full border border-gray-200-custom rounded-md px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Stock</label>
            <input name="stock" type="number" min="0" value={form.stock} onChange={onChange} required className="w-full border border-gray-200-custom rounded-md px-3 py-2 text-sm" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Image URL</label>
          <input name="image" value={form.image} onChange={onChange} required className="w-full border border-gray-200-custom rounded-md px-3 py-2 text-sm" placeholder="https://…" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <select name="category" value={form.category} onChange={onChange} className="w-full border border-gray-200-custom rounded-md px-3 py-2 text-sm">
            <option value="Electronics">Electronics</option>
            <option value="Home & Garden">Home & Garden</option>
            <option value="Clothing">Clothing</option>
            <option value="Sports">Sports</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea name="description" value={form.description} onChange={onChange} rows={4} className="w-full border border-gray-200-custom rounded-md px-3 py-2 text-sm" />
        </div>
        <label className="inline-flex items-center gap-2 text-sm">
          <input name="featured" type="checkbox" checked={form.featured} onChange={onChange} />
          Featured on home page
        </label>
        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={saving} className="bg-primary text-white font-semibold px-6 py-2 rounded-md disabled:opacity-60">
            {saving ? 'Saving…' : 'Save product'}
          </button>
          <button type="button" onClick={() => navigate('/admin')} className="px-6 py-2 rounded-md border border-gray-200-custom">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
