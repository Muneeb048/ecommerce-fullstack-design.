import { useState } from 'react';
import { Link, NavLink, useNavigate, useSearchParams } from 'react-router-dom';
import {
  FiSearch,
  FiUser,
  FiMessageSquare,
  FiHeart,
  FiShoppingCart,
  FiChevronDown,
  FiMenu,
  FiX,
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const navLinkClass = ({ isActive }) =>
  `text-sm font-medium transition-colors ${isActive ? 'text-primary' : 'text-dark hover:text-primary'}`;

function Header() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, logout, isAdmin } = useAuth();
  const { cartCount } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState(() => searchParams.get('search') || '');
  const [category, setCategory] = useState(() => searchParams.get('category') || '');

  const onSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set('search', query.trim());
    if (category.trim()) params.set('category', category.trim());
    navigate(`/products?${params.toString()}`);
    setMobileOpen(false);
  };

  return (
    <header className="bg-white font-inter sticky top-0 z-50 shadow-sm">
      <div className="max-w-container mx-auto px-4 lg:px-10">
        <div className="flex items-center justify-between py-3 sm:py-4 gap-3">
          <Link to="/" className="flex items-center gap-2.5 shrink-0" onClick={() => setMobileOpen(false)}>
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center shadow-sm">
              <svg viewBox="0 0 24 24" className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
                <path d="M6 8V6a2 2 0 012-2h8a2 2 0 012 2v2" strokeLinecap="round" />
                <path d="M4 10h16l-1.2 12H5.2L4 10z" strokeLinejoin="round" />
                <path d="M9 14v3M15 14v3" strokeLinecap="round" />
              </svg>
            </div>
            <span className="text-[20px] sm:text-[22px] font-semibold text-primary tracking-tight">Brand</span>
          </Link>

          <form onSubmit={onSearch} className="hidden sm:flex flex-1 max-w-[660px] h-10 min-w-0">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search"
              className="flex-1 min-w-0 border-2 border-primary border-r-0 rounded-l-md px-3 text-sm sm:text-base text-dark outline-none placeholder:text-gray-500-custom font-inter"
            />
            <div className="relative shrink-0">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="h-full w-[128px] sm:w-auto min-w-[110px] appearance-none border-2 border-primary border-l border-l-gray-200-custom pl-2 pr-8 text-sm sm:text-base bg-white text-dark outline-none cursor-pointer font-inter"
              >
                <option value="">All category</option>
                <option value="Electronics">Electronics</option>
                <option value="Home & Garden">Home & Garden</option>
                <option value="Clothing">Clothing</option>
                <option value="Sports">Sports</option>
              </select>
              <FiChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500-custom text-sm pointer-events-none" />
            </div>
            <button
              type="submit"
              className="bg-gradient-to-b from-primary-light to-primary-dark hover:from-primary-dark hover:to-primary-dark text-white px-4 sm:px-5 rounded-r-md text-sm sm:text-base font-medium transition-all duration-200 shrink-0"
            >
              Search
            </button>
          </form>

          <div className="hidden md:flex items-center gap-3 lg:gap-5">
            {user ? (
              <div className="flex items-center gap-3 lg:gap-4">
                <span className="text-xs text-gray-500-custom max-w-[120px] truncate hidden lg:inline">
                  {user.email}
                </span>
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="text-xs font-semibold text-primary hover:underline whitespace-nowrap"
                  >
                    Admin
                  </Link>
                )}
                <button
                  type="button"
                  onClick={logout}
                  className="text-xs text-gray-500-custom hover:text-primary whitespace-nowrap"
                >
                  Log out
                </button>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="flex flex-col items-center text-gray-500-custom hover:text-primary transition-colors min-w-[44px]"
                >
                  <FiUser className="text-[22px] mb-0.5 stroke-[1.5]" />
                  <span className="text-xs leading-[15px]">Profile</span>
                </Link>
                <Link
                  to="/signup"
                  className="hidden xl:flex flex-col items-center text-gray-500-custom hover:text-primary transition-colors min-w-[44px]"
                >
                  <FiUser className="text-[22px] mb-0.5 stroke-[1.5] opacity-80" />
                  <span className="text-xs leading-[15px]">Register</span>
                </Link>
              </>
            )}
            <span className="flex flex-col items-center text-gray-400 min-w-[44px] cursor-not-allowed" title="Coming soon">
              <FiMessageSquare className="text-[22px] mb-0.5 stroke-[1.5]" />
              <span className="text-xs leading-[15px]">Message</span>
            </span>
            <Link
              to="/products"
              className="flex flex-col items-center text-gray-500-custom hover:text-primary transition-colors min-w-[44px]"
            >
              <FiHeart className="text-[22px] mb-0.5 stroke-[1.5]" />
              <span className="text-xs leading-[15px]">Orders</span>
            </Link>
            <Link
              to="/cart"
              className="flex flex-col items-center text-gray-500-custom hover:text-primary transition-colors min-w-[44px] relative"
            >
              <FiShoppingCart className="text-[22px] mb-0.5 stroke-[1.5]" />
              <span className="text-xs leading-[15px]">My cart</span>
              {cartCount > 0 && (
                <span className="absolute -top-0.5 right-0 min-w-[18px] h-[18px] px-1 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </Link>
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <Link
              to="/cart"
              className="relative p-2 text-gray-500-custom hover:text-primary"
              aria-label="Cart"
            >
              <FiShoppingCart className="text-2xl" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 min-w-[16px] h-[16px] px-0.5 rounded-full bg-primary text-white text-[9px] font-bold flex items-center justify-center">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </Link>
            <button
              type="button"
              className="p-2 text-gray-500-custom hover:text-primary"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              onClick={() => setMobileOpen((o) => !o)}
            >
              {mobileOpen ? <FiX className="text-2xl" /> : <FiMenu className="text-2xl" />}
            </button>
          </div>
        </div>

        <form onSubmit={onSearch} className="sm:hidden pb-3 flex gap-2">
          <div className="flex-1 flex rounded-md border-2 border-primary overflow-hidden">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products"
              className="flex-1 min-w-0 px-3 py-2 text-sm outline-none"
            />
            <button type="submit" className="bg-primary text-white px-3 shrink-0" aria-label="Search">
              <FiSearch className="text-lg" />
            </button>
          </div>
        </form>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-gray-200-custom bg-white px-4 py-3 space-y-3 max-h-[70vh] overflow-y-auto">
          <nav className="flex flex-col gap-2">
            <NavLink to="/" className={navLinkClass} onClick={() => setMobileOpen(false)}>
              Home
            </NavLink>
            <NavLink to="/products" className={navLinkClass} onClick={() => setMobileOpen(false)}>
              All products
            </NavLink>
            <NavLink to="/cart" className={navLinkClass} onClick={() => setMobileOpen(false)}>
              Cart {cartCount > 0 ? `(${cartCount})` : ''}
            </NavLink>
            {isAdmin && (
              <NavLink to="/admin" className={navLinkClass} onClick={() => setMobileOpen(false)}>
                Admin panel
              </NavLink>
            )}
          </nav>
          <div className="border-t border-gray-100-custom pt-3">
            {user ? (
              <div className="space-y-2">
                <p className="text-xs text-gray-500-custom break-all">{user.email}</p>
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    setMobileOpen(false);
                  }}
                  className="w-full py-2 rounded-md border border-gray-200-custom text-sm font-medium"
                >
                  Log out
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Link
                  to="/login"
                  className="flex-1 text-center py-2 rounded-md bg-primary text-white text-sm font-medium"
                  onClick={() => setMobileOpen(false)}
                >
                  Log in
                </Link>
                <Link
                  to="/signup"
                  className="flex-1 text-center py-2 rounded-md border border-primary text-primary text-sm font-medium"
                  onClick={() => setMobileOpen(false)}
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="border-t border-gray-200-custom hidden md:block">
        <div className="max-w-container mx-auto px-4 lg:px-10">
          <div className="flex items-center justify-between py-2.5 gap-4">
            <nav className="flex items-center gap-4 lg:gap-6 flex-wrap text-sm">
              <Link to="/products" className="flex items-center gap-1.5 text-dark hover:text-primary font-medium">
                <FiMenu className="text-base shrink-0" />
                All category
              </Link>
              <Link to="/products?search=offers" className="text-dark hover:text-primary">
                Hot offers
              </Link>
              <span className="text-gray-400 cursor-default">Gift boxes</span>
              <span className="text-gray-400 cursor-default">Projects</span>
              <span className="text-gray-400 cursor-default">Menu item</span>
              <button type="button" className="inline-flex items-center gap-1 text-dark hover:text-primary">
                Help
                <FiChevronDown className="text-xs text-gray-500-custom" />
              </button>
            </nav>
            <div className="hidden lg:flex items-center gap-4 text-sm text-dark shrink-0">
              <span className="flex items-center gap-1 text-gray-600 cursor-default">
                English, USD
                <FiChevronDown className="text-xs text-gray-500-custom" />
              </span>
              <span className="flex items-center gap-1 text-gray-600 cursor-default">
                Ship to
                <img
                  src="https://flagcdn.com/w20/de.png"
                  alt=""
                  className="w-5 h-3.5 object-cover rounded-sm ml-0.5"
                />
                <FiChevronDown className="text-xs text-gray-500-custom" />
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
