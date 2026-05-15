import { useState } from 'react';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';

const CATEGORY_LINKS = [
  { label: 'Mobile accessory', search: 'mobile' },
  { label: 'Electronics', category: 'Electronics' },
  { label: 'Smartphones', search: 'phone' },
  { label: 'Modern tech', search: 'smart' },
  { label: 'Home & outdoor', category: 'Home & Garden' },
  { label: 'Clothing', category: 'Clothing' },
  { label: 'Sports', category: 'Sports' },
];

const BRANDS = ['Samsung', 'Apple', 'Huawei', 'Pocco', 'Lenovo'];

const FEATURES = ['Metallic', 'Plastic cover', '8GB Ram', 'Large memory', 'Wireless', 'Fast charge'];

const CONDITIONS = [
  { value: 'any', label: 'Any' },
  { value: 'refurbished', label: 'Refurbished' },
  { value: 'brand_new', label: 'Brand new' },
  { value: 'old', label: 'Old items' },
];

const RATING_OPTIONS = [5, 4, 3, 2];

function Section({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gray-200-custom last:border-b-0">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between py-3 text-left text-sm font-semibold text-dark"
      >
        {title}
        {open ? <FiChevronUp className="text-gray-500-custom" /> : <FiChevronDown className="text-gray-500-custom" />}
      </button>
      {open && <div className="pb-3">{children}</div>}
    </div>
  );
}

export default function ProductFilterSidebar({
  selectedCategory,
  selectedSearch,
  onPickCategory,
  selectedBrands,
  onToggleBrand,
  selectedFeatures,
  onToggleFeature,
  minPrice,
  maxPrice,
  onMinPriceChange,
  onMaxPriceChange,
  onApplyPrice,
  priceExtent,
  condition,
  onConditionChange,
  selectedRatings,
  onToggleRating,
  showAllCategories,
  onToggleSeeAllCategories,
}) {
  const visibleCats = showAllCategories ? CATEGORY_LINKS : CATEGORY_LINKS.slice(0, 5);

  return (
    <div className="rounded-lg border border-gray-200-custom bg-white p-4 text-sm">
      <Section title="Category">
        <ul className="space-y-1.5">
          {visibleCats.map((c) => {
            const active =
              (c.category && selectedCategory === c.category) ||
              (c.search && (selectedSearch || '').toLowerCase() === c.search.toLowerCase());
            return (
              <li key={c.label}>
                <button
                  type="button"
                  onClick={() => onPickCategory(c)}
                  className={`w-full rounded-md px-2 py-1.5 text-left transition-colors ${
                    active ? 'bg-[#E5F1FF] font-medium text-primary' : 'text-gray-700 hover:bg-gray-bg'
                  }`}
                >
                  {c.label}
                </button>
              </li>
            );
          })}
        </ul>
        <button
          type="button"
          onClick={onToggleSeeAllCategories}
          className="mt-2 text-xs font-semibold text-primary hover:underline"
        >
          {showAllCategories ? 'Show less' : 'See all'}
        </button>
      </Section>

      <Section title="Brands">
        <ul className="space-y-2">
          {BRANDS.map((b) => (
            <li key={b} className="flex items-center gap-2">
              <input
                id={`brand-${b}`}
                type="checkbox"
                checked={selectedBrands.includes(b)}
                onChange={() => onToggleBrand(b)}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <label htmlFor={`brand-${b}`} className="cursor-pointer text-gray-700">
                {b}
              </label>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Features">
        <ul className="space-y-2">
          {FEATURES.map((f) => (
            <li key={f} className="flex items-center gap-2">
              <input
                id={`feat-${f}`}
                type="checkbox"
                checked={selectedFeatures.includes(f)}
                onChange={() => onToggleFeature(f)}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <label htmlFor={`feat-${f}`} className="cursor-pointer text-gray-700">
                {f}
              </label>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Price range">
        <div className="flex gap-2">
          <div className="flex-1">
            <label className="mb-1 block text-xs text-gray-500-custom">Min</label>
            <input
              type="number"
              min={0}
              value={minPrice}
              onChange={(e) => onMinPriceChange(e.target.value)}
              className="w-full rounded-md border border-gray-200-custom px-2 py-1.5 text-sm outline-none focus:border-primary"
              placeholder={String(priceExtent.min)}
            />
          </div>
          <div className="flex-1">
            <label className="mb-1 block text-xs text-gray-500-custom">Max</label>
            <input
              type="number"
              min={0}
              value={maxPrice}
              onChange={(e) => onMaxPriceChange(e.target.value)}
              className="w-full rounded-md border border-gray-200-custom px-2 py-1.5 text-sm outline-none focus:border-primary"
              placeholder={String(priceExtent.max)}
            />
          </div>
        </div>
        <button
          type="button"
          onClick={onApplyPrice}
          className="mt-3 w-full rounded-md bg-gradient-to-b from-primary-light to-primary-dark py-2 text-sm font-semibold text-white hover:opacity-95"
        >
          Apply
        </button>
      </Section>

      <Section title="Condition">
        <div className="space-y-2">
          {CONDITIONS.map((c) => (
            <label key={c.value} className="flex cursor-pointer items-center gap-2">
              <input
                type="radio"
                name="condition"
                value={c.value}
                checked={condition === c.value}
                onChange={() => onConditionChange(c.value)}
                className="h-4 w-4 border-gray-300 text-primary focus:ring-primary"
              />
              <span className="text-gray-700">{c.label}</span>
            </label>
          ))}
        </div>
      </Section>

      <Section title="Ratings">
        <ul className="space-y-2">
          {RATING_OPTIONS.map((stars) => (
            <li key={stars} className="flex items-center gap-2">
              <input
                id={`rate-${stars}`}
                type="checkbox"
                checked={selectedRatings.includes(stars)}
                onChange={() => onToggleRating(stars)}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <label htmlFor={`rate-${stars}`} className="flex cursor-pointer items-center gap-1 text-gray-700">
                <span className="text-amber-400">{'★'.repeat(stars)}</span>
                <span className="text-gray-400">& up</span>
              </label>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Manufacturer" defaultOpen={false}>
        <p className="text-xs text-gray-500-custom">Use brand filters above for manufacturer-style matching.</p>
      </Section>
    </div>
  );
}
