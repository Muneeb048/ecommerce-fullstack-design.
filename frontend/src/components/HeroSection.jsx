import { Link, useLocation } from "react-router-dom";

const HERO_IMG = {
  laptop:
    "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=520&h=400&fit=crop&q=80",

  headphones:
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=320&h=320&fit=crop&q=80",
};

function HeroSection() {
  const { pathname } = useLocation();
  const isHome = pathname === "/";

  const categories = [
    { label: "Automobiles", to: "/products?search=auto" },
    { label: "Clothes and wear", to: "/products?category=Clothing" },
    { label: "Home interiors", to: "/products?category=Home%20%26%20Garden" },
    { label: "Computer and tech", to: "/products?category=Electronics" },
    { label: "Tools, equipments", to: "/products" },
    { label: "Sports and outdoor", to: "/products?category=Sports" },
    { label: "Animal and pets", to: "/products" },
    { label: "Machinery tools", to: "/products" },
    { label: "More category", to: "/products" },
  ];

  return (
    <section className="max-w-container mx-auto px-4 lg:px-10 mt-4">
      {/* Single grey-bordered frame like Figma */}
      <div className="rounded-lg border border-gray-200-custom bg-white overflow-hidden shadow-sm">
        <div className="flex flex-col lg:flex-row lg:min-h-[360px]">
          {/* Left — category list */}
          <aside className="w-full lg:w-[240px] shrink-0 border-b lg:border-b-0 lg:border-r border-gray-200-custom bg-white">
            <ul className="py-1">
              {categories.map((cat, index) => {
                const active = isHome && index === 0;
                return (
                  <li key={cat.label}>
                    <Link
                      to={cat.to}
                      className={`block px-4 py-2.5 text-sm transition-colors ${
                        active
                          ? "bg-[#E5F1FF] text-primary font-medium"
                          : "text-[#1C1C1C] hover:bg-gray-100-custom hover:text-primary"
                      }`}
                    >
                      {cat.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </aside>

          {/* Center — teal banner + lifestyle imagery */}
          <div
            className="relative flex-1 min-h-[260px] sm:min-h-[300px] lg:min-h-0 overflow-hidden"
            style={{
              background:
                "linear-gradient(115deg, #d4f0e4 0%, #b8e6d4 35%, #8fd4b8 70%, #7ec4a8 100%)",
            }}
          >
            <div className="relative z-10 flex h-full flex-col justify-center p-6 sm:p-8 lg:max-w-[48%]">
              <p className="text-sm text-gray-700 mb-1">Latest trending</p>
              <h2 className="text-2xl sm:text-[28px] font-bold text-gray-900 leading-tight mb-5">
                Electronic items
              </h2>
              <Link
                to="/products?category=Electronics"
                className="inline-flex w-fit items-center rounded-md bg-white px-5 py-2 text-sm font-semibold text-gray-900 shadow-sm transition-shadow hover:shadow-md"
              >
                Learn more
              </Link>
            </div>

            {/* Product collage — right side */}
            <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[58%] sm:block">
              <img
                src={HERO_IMG.laptop}
                alt=""
                className="absolute bottom-2 right-[6%] z-[1] h-[min(78%,220px)] w-auto max-w-[55%] rounded-lg object-contain drop-shadow-xl"
              />
              <img
                src={HERO_IMG.headphones}
                alt=""
                className="absolute right-[38%] top-[14%] z-[2] h-[min(32%,120px)] w-auto max-w-[38%] rounded-lg object-cover shadow-lg ring-2 ring-white/80"
              />
            </div>
          </div>

          {/* Right — stacked promo cards (Figma) — from lg */}
          <aside className="flex w-full shrink-0 flex-col gap-3 border-t border-gray-200-custom bg-white p-4 lg:w-[220px] lg:border-l lg:border-t-0 xl:w-[236px]">
            <div className="rounded-lg bg-[#E5F1FF] p-4 text-center">
              <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-white">
                <span className="text-lg text-primary" aria-hidden>
                  👤
                </span>
              </div>
              <p className="text-sm leading-snug text-gray-800">
                Hi, user
                <span className="font-semibold"> let&apos;s get started</span>
              </p>
              <Link
                to="/signup"
                className="mt-3 block w-full rounded-md bg-gradient-to-b from-primary-light to-primary-dark py-2 text-sm font-semibold text-white transition-opacity hover:opacity-95"
              >
                Join now
              </Link>
              <Link
                to="/login"
                className="mt-2 block w-full rounded-md border border-gray-200-custom bg-white py-2 text-sm font-semibold text-primary transition-colors hover:bg-gray-50"
              >
                Log in
              </Link>
            </div>

            <div className="rounded-lg bg-[#F38332] p-4 text-sm leading-snug text-white shadow-sm">
              <p className="font-bold">Get US $10 off</p>
              <p className="mt-1 text-xs opacity-95">with a new supplier</p>
            </div>

            <div className="rounded-lg bg-[#00AEB8] p-4 text-sm leading-snug text-white shadow-sm">
              <p className="font-bold">Send quotes with supplier preferences</p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
