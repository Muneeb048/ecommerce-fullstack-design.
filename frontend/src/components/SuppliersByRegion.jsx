function SuppliersByRegion() {
  const suppliers = [
    { country: 'Arabic Emirates', domain: 'shopname.ae', flag: '🇦🇪' },
    { country: 'Australia', domain: 'shopname.ae', flag: '🇦🇺' },
    { country: 'United States', domain: 'shopname.ae', flag: '🇺🇸' },
    { country: 'Russia', domain: 'shopname.ru', flag: '🇷🇺' },
    { country: 'Italy', domain: 'shopname.it', flag: '🇮🇹' },
    { country: 'Denmark', domain: 'denmark.com.dk', flag: '🇩🇰' },
    { country: 'France', domain: 'shopname.com.fr', flag: '🇫🇷' },
    { country: 'Arabic Emirates', domain: 'shopname.ae', flag: '🇦🇪' },
    { country: 'China', domain: 'shopname.ae', flag: '🇨🇳' },
    { country: 'Great Britain', domain: 'shopname.co.uk', flag: '🇬🇧' },
  ];

  return (
    <section className="max-w-container mx-auto px-4 lg:px-10 mt-8">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Suppliers by region</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {suppliers.map((s, i) => (
          <a key={i} href="#" className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-md transition-colors">
            <span className="text-2xl">{s.flag}</span>
            <div>
              <p className="text-sm font-medium text-gray-800">{s.country}</p>
              <p className="text-xs text-gray-400">{s.domain}</p>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}

export default SuppliersByRegion;