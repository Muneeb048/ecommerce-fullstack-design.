import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function SignupPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await register({ name, email, password });
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.message || 'Could not create account');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="bg-white border border-gray-200-custom rounded-xl p-6 sm:p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-dark">Create account</h1>
        <p className="text-sm text-gray-500-custom mt-1 mb-6">
          Already have an account?{' '}
          <Link to="/login" className="text-primary font-semibold hover:underline">
            Log in
          </Link>
        </p>
        {error && <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-md px-3 py-2">{error}</div>}
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-dark mb-1">Name (optional)</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-200-custom rounded-md px-3 py-2 text-sm outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-dark mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-200-custom rounded-md px-3 py-2 text-sm outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-dark mb-1">Password (min 6 characters)</label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-200-custom rounded-md px-3 py-2 text-sm outline-none focus:border-primary"
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-primary text-white font-semibold py-2.5 rounded-md hover:opacity-95 disabled:opacity-60"
          >
            {submitting ? 'Creating…' : 'Sign up'}
          </button>
        </form>
      </div>
    </div>
  );
}
