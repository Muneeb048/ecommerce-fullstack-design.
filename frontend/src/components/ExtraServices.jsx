import { FiSearch, FiBox, FiSend, FiCheckCircle } from 'react-icons/fi';

function ExtraServices() {
  const services = [
    { icon: <FiSearch />, title: 'Source from Industry Hubs', bg: 'from-blue-600 to-blue-800', color: 'bg-blue-500' },
    { icon: <FiBox />, title: 'Customize Your Products', bg: 'from-orange-500 to-orange-700', color: 'bg-orange-500' },
    { icon: <FiSend />, title: 'Fast, reliable shipping by ocean or air', bg: 'from-teal-500 to-teal-700', color: 'bg-teal-500' },
    { icon: <FiCheckCircle />, title: 'Product monitoring and inspection', bg: 'from-indigo-500 to-indigo-700', color: 'bg-indigo-500' },
  ];

  return (
    <section className="max-w-container mx-auto px-4 lg:px-10 mt-8">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Our extra services</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {services.map((service, index) => (
          <div key={index} className="rounded-lg overflow-hidden group cursor-pointer hover:shadow-lg transition-shadow">
            <div className={`h-[140px] bg-gradient-to-br ${service.bg} relative flex items-center justify-center`}>
              <div className="text-white text-5xl opacity-30">{service.icon}</div>
            </div>
            <div className="bg-white border border-t-0 border-gray-200 rounded-b-lg p-4 flex items-start gap-3">
              <div className={`w-8 h-8 rounded-full ${service.color} flex items-center justify-center shrink-0 text-white`}>
                {service.icon}
              </div>
              <p className="text-sm text-gray-700 leading-snug font-medium">{service.title}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default ExtraServices;
