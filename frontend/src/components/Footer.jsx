import { Link } from 'react-router-dom';
import { FiFacebook, FiTwitter, FiLinkedin, FiInstagram, FiYoutube } from 'react-icons/fi';

function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-8">
      <div className="max-w-container mx-auto px-4 lg:px-10 py-10">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8">
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">B</span>
              </div>
              <span className="text-xl font-bold text-blue-500">Brand</span>
            </Link>
            <p className="text-xs text-gray-500 mb-4 leading-relaxed">
              Best information about the company gies here but now lorem ipsum is
            </p>
            <div className="flex gap-2">
              {[FiFacebook, FiTwitter, FiLinkedin, FiInstagram, FiYoutube].map((Icon, i) => (
                <a key={i} href="#" className="w-8 h-8 rounded-full bg-gray-200 hover:bg-blue-500 hover:text-white flex items-center justify-center text-gray-500 transition-colors">
                  <Icon className="text-sm" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-3 text-sm">About</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/products" className="text-sm text-gray-500 hover:text-blue-500 transition-colors">
                  Categories
                </Link>
              </li>
              {['About Us', 'Find store', 'Blogs'].map((item) => (
                <li key={item}>
                  <span className="text-sm text-gray-400">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-3 text-sm">Partnership</h4>
            <ul className="space-y-2">
              {['Suppliers', 'Affiliates', 'Advertise'].map((item) => (
                <li key={item}>
                  <span className="text-sm text-gray-400">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-3 text-sm">Information</h4>
            <ul className="space-y-2">
              {['Help Center', 'Money Refund', 'Shipping', 'Contact us'].map((item) => (
                <li key={item}>
                  <span className="text-sm text-gray-400">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-3 text-sm">For users</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/login" className="text-sm text-gray-500 hover:text-blue-500 transition-colors">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/signup" className="text-sm text-gray-500 hover:text-blue-500 transition-colors">
                  Register
                </Link>
              </li>
              <li>
                <Link to="/cart" className="text-sm text-gray-500 hover:text-blue-500 transition-colors">
                  My cart
                </Link>
              </li>
              <li>
                <span className="text-sm text-gray-400">My Orders</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-3 text-sm">Get app</h4>
            <div className="space-y-2">
              <a href="#" className="block bg-gray-900 text-white rounded-md px-3 py-2 text-xs hover:bg-gray-800 transition-colors">
                <span className="text-[10px] text-gray-400">Download on the</span>
                <br />
                <span className="font-semibold">App Store</span>
              </a>
              <a href="#" className="block bg-gray-900 text-white rounded-md px-3 py-2 text-xs hover:bg-gray-800 transition-colors">
                <span className="text-[10px] text-gray-400">Get it on</span>
                <br />
                <span className="font-semibold">Google Play</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200">
        <div className="max-w-container mx-auto px-4 lg:px-10 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-sm text-gray-500">© 2023 Ecommerce.</p>
          <span className="text-sm text-gray-500 flex items-center gap-1">
            🇺🇸 English
          </span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
