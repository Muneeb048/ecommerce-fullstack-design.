import { Link } from 'react-router-dom';

function CategorySection({ title, products, bannerImage, sourceHref = '/products' }) {
  return (
    <section className="max-w-container mx-auto px-4 lg:px-10 mt-6">
      <div className="overflow-hidden rounded-lg border border-gray-200-custom bg-white shadow-sm">
        <div className="flex flex-col md:flex-row">
          <div className="relative min-h-[220px] w-full shrink-0 overflow-hidden md:w-[280px] md:min-h-[280px] lg:w-[320px]">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${bannerImage})` }}
              role="img"
              aria-hidden
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/25 to-transparent" />
            <div className="relative z-10 flex h-full min-h-[220px] flex-col justify-end p-6 md:min-h-[280px] md:justify-center">
              <h3 className="max-w-[14rem] text-xl font-bold leading-snug text-white drop-shadow-sm">{title}</h3>
              <Link
                to={sourceHref}
                className="mt-4 inline-flex w-fit rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-md transition-shadow hover:shadow-lg"
              >
                Source now
              </Link>
            </div>
          </div>

          <div className="grid flex-1 grid-cols-2 divide-x divide-y divide-gray-200-custom sm:grid-cols-4">
            {products.map((product) => (
              <Link
                key={product.id || product.name}
                to={product.id ? `/products/${product.id}` : '/products'}
                className="group flex flex-col border-l border-b border-gray-200-custom p-3 transition-colors hover:bg-gray-bg sm:p-3.5"
              >
                <div className="flex items-start gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-dark">{product.name}</p>
                    <p className="mt-0.5 text-xs text-gray-400">From</p>
                    <p className="text-xs font-medium text-gray-600">USD {product.price}</p>
                  </div>
                  <div className="h-[72px] w-[72px] shrink-0 overflow-hidden rounded-md bg-gray-50 ring-1 ring-gray-100 sm:h-[80px] sm:w-[80px]">
                    {product.image ? (
                      <img src={product.image} alt="" className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-3xl">{product.emoji}</div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default CategorySection;
