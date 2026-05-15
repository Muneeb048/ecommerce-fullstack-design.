import { NavLink, Outlet, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function AdminLayout() {
  const { user, logout } = useAuth();

  const tabClass = ({ isActive }) =>
    `px-4 py-2 rounded-md text-sm font-semibold ${isActive ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100-custom'}`;

  return (
    <div className="min-h-screen bg-gray-bg font-inter">
      <header className="bg-white border-b border-gray-200-custom sticky top-0 z-40">
        <div className="max-w-container mx-auto px-4 lg:px-10 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase text-gray-500-custom tracking-wide">Admin</p>
            <h1 className="text-lg font-bold text-dark">Product management</h1>
            <p className="text-xs text-gray-500-custom truncate max-w-xs">{user?.email}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Link to="/" className="text-sm font-medium text-primary hover:underline">
              View storefront
            </Link>
            <button
              type="button"
              onClick={logout}
              className="text-sm px-3 py-1.5 rounded-md border border-gray-200-custom hover:bg-gray-50"
            >
              Log out
            </button>
          </div>
        </div>
        <div className="max-w-container mx-auto px-4 lg:px-10 pb-4 flex gap-2">
          <NavLink to="/admin" end className={tabClass}>
            Products
          </NavLink>
          <NavLink to="/admin/products/new" className={tabClass}>
            Add product
          </NavLink>
        </div>
      </header>
      <div className="max-w-container mx-auto px-4 lg:px-10 py-8">
        <Outlet />
      </div>
    </div>
  );
}
