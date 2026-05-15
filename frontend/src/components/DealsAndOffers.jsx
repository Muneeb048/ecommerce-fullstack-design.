import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const DEFAULT_DISCOUNTS = ['-25%', '-15%', '-40%', '-25%', '-25%'];

const FALLBACK_DEALS = [
  {
    id: 'fallback-1',
    name: 'Smart watches',
    discount: '-25%',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&h=200&fit=crop&q=80',
  },
  {
    id: 'fallback-2',
    name: 'Laptops',
    discount: '-15%',
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=200&h=200&fit=crop&q=80',
  },
  {
    id: 'fallback-3',
    name: 'GoPro cameras',
    discount: '-40%',
    image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=200&h=200&fit=crop&q=80',
  },
  {
    id: 'fallback-4',
    name: 'Headphones',
    discount: '-25%',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop&q=80',
  },
  {
    id: 'fallback-5',
    name: 'Canon cameras',
    discount: '-25%',
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=200&h=200&fit=crop&q=80',
  },
];

function DealsAndOffers({ products = [] }) {
  const [timeLeft, setTimeLeft] = useState({
    days: 4,
    hours: 13,
    minutes: 34,
    seconds: 56,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        let { days, hours, minutes, seconds } = prev;
        seconds -= 1;
        if (seconds < 0) {
          seconds = 59;
          minutes -= 1;
        }
        if (minutes < 0) {
          minutes = 59;
          hours -= 1;
        }
        if (hours < 0) {
          hours = 23;
          days -= 1;
        }
        if (days < 0) {
          days = 0;
          hours = 0;
          minutes = 0;
          seconds = 0;
        }
        return { days, hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const deals =
    products.length > 0
      ? products.slice(0, 5).map((p, i) => ({
          id: p.id,
          name: p.name,
          discount: DEFAULT_DISCOUNTS[i % DEFAULT_DISCOUNTS.length],
          image: p.image,
        }))
      : FALLBACK_DEALS;

  const pad = (n) => String(n).padStart(2, '0');

  return (
    <section className="max-w-container mx-auto px-4 lg:px-10 mt-6">
      <div className="overflow-hidden rounded-lg border border-gray-200-custom bg-white shadow-sm">
        <div className="flex flex-col md:flex-row">
          <div className="flex shrink-0 flex-col justify-center border-b border-gray-200-custom bg-white p-5 md:w-[240px] md:border-b-0 md:border-r">
            <h3 className="text-xl font-bold text-gray-900">Deals and offers</h3>
            <p className="mt-1 text-sm text-gray-500-custom">Hygiene equipments</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {[
                { label: 'Days', value: pad(timeLeft.days) },
                { label: 'Hour', value: pad(timeLeft.hours) },
                { label: 'Min', value: pad(timeLeft.minutes) },
                { label: 'Sec', value: pad(timeLeft.seconds) },
              ].map((item) => (
                <div
                  key={item.label}
                  className="min-w-[48px] rounded-md bg-[#475569] px-2.5 py-2 text-center text-white shadow-inner"
                >
                  <div className="text-base font-bold leading-none">{item.value}</div>
                  <div className="mt-1 text-[10px] font-medium uppercase tracking-wide opacity-90">{item.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid flex-1 grid-cols-2 divide-x divide-y divide-gray-200-custom sm:grid-cols-3 md:grid-cols-5">
            {deals.map((deal) => (
              <Link
                key={deal.id}
                to={deal.id?.toString().startsWith('fallback') ? '/products' : `/products/${deal.id}`}
                className="group flex flex-col items-center p-4 transition-colors hover:bg-gray-bg"
              >
                <div className="mb-3 flex h-[100px] w-[100px] items-center justify-center overflow-hidden rounded-lg bg-gray-100-custom ring-1 ring-gray-200-custom transition-transform group-hover:scale-[1.02]">
                  <img src={deal.image} alt="" className="h-full w-full object-cover" />
                </div>
                <p className="mb-2 line-clamp-2 text-center text-sm font-medium text-dark">{deal.name}</p>
                <span className="rounded-full bg-[#FFE3E3] px-2.5 py-0.5 text-xs font-semibold text-[#EB001B]">
                  {deal.discount}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default DealsAndOffers;
