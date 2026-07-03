import { MapPin, Clock, Truck, ShieldCheck } from 'lucide-react';

function DeliveryPage() {
  return (
    <div className="bg-light min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-primary font-bold text-xs uppercase tracking-wider mb-2 block">
            Fast & Fresh
          </span>
          <h1 className="text-4xl font-bold text-dark mb-4">Delivery Information</h1>
          <p className="text-gray-500 max-w-2xl mx-auto">
            We deliver your favorite meals hot and fresh right to your doorstep. Check our delivery zones and policies below.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold text-dark mb-6">How It Works</h2>
              
              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-orange-100 text-primary rounded-xl flex items-center justify-center shrink-0">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-dark text-lg mb-1">1. Check your location</h3>
                    <p className="text-gray-500 text-sm">Verify if you are within our delivery radius using the map or zip code checker.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-orange-100 text-primary rounded-xl flex items-center justify-center shrink-0">
                    <ShieldCheck size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-dark text-lg mb-1">2. Place your order</h3>
                    <p className="text-gray-500 text-sm">Choose from our wide menu and place your order online securely.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-orange-100 text-primary rounded-xl flex items-center justify-center shrink-0">
                    <Truck size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-dark text-lg mb-1">3. Fast Delivery</h3>
                    <p className="text-gray-500 text-sm">Our drivers will deliver your food within 30-45 minutes while it's still hot.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="relative h-125 rounded-3xl overflow-hidden shadow-lg border-4 border-white bg-gray-200">
             {/* Map Placeholder */}
             <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=800')] bg-cover bg-center"></div>
             <div className="absolute inset-0 bg-black/10"></div>
             <div className="absolute bottom-6 left-6 right-6 bg-white p-4 rounded-xl shadow-lg">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white">
                      <MapPin size={20} />
                   </div>
                   <div>
                      <p className="font-bold text-dark">Delivery Radius</p>
                      <p className="text-xs text-gray-500">We currently deliver within 5 miles of downtown.</p>
                   </div>
                </div>
             </div>
          </div>
        </div>

        {/* Delivery Zones */}
        <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-sm border border-gray-100 text-center">
           <h2 className="text-2xl font-bold text-dark mb-8">Delivery Zones & Fees</h2>
           <div className="grid md:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl bg-gray-50 border border-gray-100">
                 <h3 className="font-bold text-dark text-lg mb-2">Zone A (Downtown)</h3>
                 <p className="text-primary font-bold text-2xl mb-2">$1.99</p>
                 <p className="text-xs text-gray-500">Delivery Time: 20-30 min</p>
              </div>
              <div className="p-6 rounded-2xl bg-gray-50 border border-gray-100">
                 <h3 className="font-bold text-dark text-lg mb-2">Zone B (Suburbs)</h3>
                 <p className="text-primary font-bold text-2xl mb-2">$3.99</p>
                 <p className="text-xs text-gray-500">Delivery Time: 30-45 min</p>
              </div>
              <div className="p-6 rounded-2xl bg-gray-50 border border-gray-100">
                 <h3 className="font-bold text-dark text-lg mb-2">Zone C (Outer City)</h3>
                 <p className="text-primary font-bold text-2xl mb-2">$5.99</p>
                 <p className="text-xs text-gray-500">Delivery Time: 45-60 min</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}

export default DeliveryPage;
