import { FiMail } from 'react-icons/fi';

function Newsletter() {
  return (
    <section className="bg-gray-100-custom mt-8 py-8">
      <div className="max-w-container mx-auto px-4 lg:px-10 text-center">
        <h2 className="text-xl font-bold text-gray-900 mb-1">Subscribe on our newsletter</h2>
        <p className="text-sm text-gray-500-custom mb-5 max-w-lg mx-auto leading-relaxed">
          Get daily news on upcoming offers from many suppliers all over the world
        </p>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-2 max-w-lg mx-auto">
          <div className="relative flex-1">
            <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg pointer-events-none" />
            <input
              type="email"
              placeholder="Email"
              className="w-full border border-gray-200-custom rounded-md pl-10 pr-4 py-2.5 text-sm outline-none focus:border-primary transition-colors placeholder:text-gray-400 bg-white"
            />
          </div>
          <button
            type="button"
            className="bg-gradient-to-b from-primary-light to-primary-dark hover:opacity-95 text-white font-semibold text-sm px-8 py-2.5 rounded-md transition-opacity shrink-0"
          >
            Subscribe
          </button>
        </div>
      </div>
    </section>
  );
}

export default Newsletter;
