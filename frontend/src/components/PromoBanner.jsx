import { Link } from 'react-router-dom';

export default function PromoBanner() {
  return (
    <section
      className="relative mt-8 overflow-hidden rounded-lg border border-transparent"
      style={{
        background: 'linear-gradient(135deg, #127FFF 0%, #0067DC 55%, #004BA0 100%)',
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />
      <div className="relative z-10 flex flex-col items-start justify-between gap-4 px-6 py-6 sm:flex-row sm:items-center sm:px-10 sm:py-8">
        <div className="text-white">
          <h2 className="text-xl font-bold sm:text-2xl">Super discount on more than 100 USD</h2>
          <p className="mt-1 max-w-xl text-sm text-blue-100">Explore thousands of products from verified suppliers worldwide.</p>
        </div>
        <Link
          to="/products"
          className="inline-flex shrink-0 items-center justify-center rounded-md bg-[#F38332] px-8 py-3 text-sm font-bold text-white shadow-md transition-opacity hover:opacity-95"
        >
          Shop now
        </Link>
      </div>
    </section>
  );
}
