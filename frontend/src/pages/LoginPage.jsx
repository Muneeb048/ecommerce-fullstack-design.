import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from;
  const redirectTo = typeof from === 'string' && from.startsWith('/') ? from : '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login(email, password);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="bg-white border border-gray-200-custom rounded-xl p-6 sm:p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-dark">Log in</h1>
        <p className="text-sm text-gray-500-custom mt-1 mb-6">
          New here?{' '}
          <Link to="/signup" className="text-primary font-semibold hover:underline">
            Create an account
          </Link>
        </p>
        {error && <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-md px-3 py-2">{error}</div>}
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-dark mb-1">Email</label>
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-200-custom rounded-md px-3 py-2 text-sm outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-dark mb-1">Password</label>
            <input
              type="password"
              required
              autoComplete="current-password"
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
            {submitting ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}
