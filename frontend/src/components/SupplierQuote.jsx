function SupplierQuote() {
  return (
    <section className="max-w-container mx-auto px-4 lg:px-10 mt-6">
      <div
        className="rounded-lg overflow-hidden relative border border-transparent"
        style={{
          background: 'linear-gradient(135deg, #127FFF 0%, #0067DC 50%, #004BA0 100%)',
        }}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 p-8 md:p-10">
          <div className="flex-1 text-white">
            <h2 className="text-2xl md:text-3xl font-bold leading-tight mb-3">
              An easy way to send<br />requests to all suppliers
            </h2>
            <p className="text-sm text-blue-100 max-w-md leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt.
            </p>
          </div>

          <div className="w-full md:w-[400px] shrink-0 bg-white rounded-lg p-5 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Send quote to suppliers</h3>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="What item you need?"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-blue-400 transition-colors placeholder-gray-400"
              />
              <textarea
                placeholder="Type more details"
                rows={3}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-blue-400 transition-colors placeholder-gray-400 resize-none"
              />
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Quantity"
                  className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-blue-400 transition-colors placeholder-gray-400"
                />
                <select className="w-[80px] border border-gray-300 rounded-md px-2 py-2 text-sm outline-none focus:border-blue-400 transition-colors bg-white text-gray-600">
                  <option>Pcs</option>
                  <option>Kg</option>
                  <option>Set</option>
                  <option>Box</option>
                </select>
              </div>
              <button className="bg-blue-500 hover:bg-blue-600 text-white font-medium text-sm px-6 py-2.5 rounded-md transition-colors">
                Send inquiry
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SupplierQuote;
