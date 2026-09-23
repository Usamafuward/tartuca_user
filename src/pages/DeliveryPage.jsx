import { MapPin, Clock, Truck, ShieldCheck, Sparkles, Flame, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

function DeliveryPage() {

  const deliveryZones = [
    {
      zone: 'Zone 1: Central Colombo',
      coverage: 'Colombo 03 (Kollupitiya), Colombo 07 (Cinnamon Gardens), Colombo 04 (Bambalapitiya)',
      distance: '0 – 3 km from Tartuca',
      price: '$1.99',
      freeThreshold: 'Free over $35',
      time: '20–30 min',
      popular: true,
    },
    {
      zone: 'Zone 2: Inner Colombo',
      coverage: 'Colombo 01 (Fort), Colombo 02 (Slave Island), Colombo 05 (Havelock), Colombo 06 (Wellawatte)',
      distance: '3 – 6 km from Tartuca',
      price: '$2.99',
      freeThreshold: 'Free over $45',
      time: '25–35 min',
      popular: false,
    },
    {
      zone: 'Zone 3: Greater Colombo',
      coverage: 'Colombo 08 (Borella), Rajagiriya, Nawala, Nugegoda, Dehiwala',
      distance: '6 – 10 km from Tartuca',
      price: '$3.99',
      freeThreshold: 'Free over $55',
      time: '35–45 min',
      popular: false,
    }
  ];

  return (
    <div className="min-h-screen py-10 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-500 dark:text-amber-400 text-xs font-bold uppercase tracking-wider mb-4">
            <Truck size={13} /> Doorstep Delivery
          </div>
          <h1 className="text-4xl sm:text-5xl font-serif font-bold text-stone-900 dark:text-white tracking-tight mb-4">
            Fresh Doorstep Delivery
          </h1>
          <p className="text-stone-600 dark:text-slate-400 text-sm leading-relaxed">
            Enjoy our aromatic curries, ocean-fresh seafood, woodfired pizzas, and delicious dishes delivered fresh and warm to your home or office.
          </p>
        </div>

        {/* How It Works & Map Visual */}
        <div className="grid lg:grid-cols-2 gap-10 items-center mb-16">
          <div>
            <div className="glass-card p-8 rounded-3xl border border-stone-200/80 dark:border-white/10 shadow-2xl space-y-8">
              <h2 className="text-2xl font-serif font-bold text-stone-900 dark:text-white">How Our Delivery Works</h2>
              
              <div className="space-y-6">
                <div className="flex gap-4 items-start">
                  <div className="w-12 h-12 bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400 rounded-2xl flex items-center justify-center shrink-0">
                    <MapPin size={22} />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-stone-900 dark:text-white text-base mb-1">1. Our Delivery Area</h3>
                    <p className="text-stone-600 dark:text-slate-400 text-xs leading-relaxed">
                      We deliver across Colombo 1 to 15 and nearby suburbs like Rajagiriya, Nawala, and Dehiwala to guarantee food arrives hot.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="w-12 h-12 bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400 rounded-2xl flex items-center justify-center shrink-0">
                    <Flame size={22} />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-stone-900 dark:text-white text-base mb-1">2. Made Fresh to Order</h3>
                    <p className="text-stone-600 dark:text-slate-400 text-xs leading-relaxed">
                      Your order is never pre-cooked. Our kitchen prepares every curry, seafood, and dish fresh right before dispatch.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="w-12 h-12 bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400 rounded-2xl flex items-center justify-center shrink-0">
                    <Truck size={22} />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-stone-900 dark:text-white text-base mb-1">3. Prompt Courier Delivery</h3>
                    <p className="text-stone-600 dark:text-slate-400 text-xs leading-relaxed">
                      Delivered in insulated food-grade containers so your curries, seafood, and dishes arrive piping hot and fresh.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-stone-200/80 dark:border-white/[0.08]">
                <Link
                  to="/menu"
                  className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-600 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 hover:from-amber-300 hover:to-amber-500 transition-all"
                >
                  <span>Order Now for Delivery</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>

          {/* Map Representation Visual */}
          <div className="relative h-full rounded-3xl overflow-hidden shadow-2xl border border-stone-200/80 dark:border-white/10 bg-[#0E1015]">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=800')] bg-cover bg-center opacity-60" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#08090C] via-black/40 to-transparent" />
            
            <div className="absolute bottom-6 left-6 right-6 glass-card p-5 rounded-2xl border border-white/10">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center text-slate-950 shadow-md">
                  <MapPin size={20} className="stroke-[2.5]" />
                </div>
                <div>
                  <p className="font-serif font-bold text-white text-sm">Central Kitchen Hub</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Average dispatch time: 30 mins • Free delivery on orders over $50</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Delivery Zones & Fees Breakdown */}
        <div className="glass-card rounded-3xl p-8 sm:p-12 border border-stone-200/80 dark:border-white/10 shadow-xl text-center mb-16">
          <span className="text-amber-600 dark:text-amber-400 font-bold text-xs uppercase tracking-[0.2em] mb-2 block">
            Clear Delivery Rates
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 dark:text-white mb-3">
            Delivery Zones & Estimated Times
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-slate-400 max-w-xl mx-auto mb-10">
            Calculated by radial distance from our restaurant in Colombo 07 to ensure fast delivery and fresh meals.
          </p>
          
          <div className="grid sm:grid-cols-3 gap-6 text-left">
            {deliveryZones.map((z, idx) => (
              <div 
                key={idx}
                className={`relative p-6 rounded-2xl transition-all duration-300 flex flex-col justify-between ${
                  z.popular 
                    ? 'bg-amber-500/[0.06] border-2 border-amber-500/50 shadow-lg' 
                    : 'bg-stone-50/80 dark:bg-white/[0.03] border border-stone-200/80 dark:border-white/10 hover:border-amber-500/40 shadow-sm'
                }`}
              >
                {z.popular && (
                  <span className="absolute -top-3 right-4 px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-extrabold uppercase tracking-wider shadow-md">
                    Fastest Delivery
                  </span>
                )}
                <div>
                  <h3 className="font-serif font-bold text-stone-900 dark:text-white text-base mb-1">
                    {z.zone}
                  </h3>
                  <p className="text-xs text-stone-500 dark:text-slate-400 mb-4">{z.coverage}</p>
                  
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-amber-600 dark:text-amber-400 font-extrabold text-3xl font-sans">{z.price}</span>
                    <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">{z.freeThreshold}</span>
                  </div>
                  <p className="text-[11px] text-stone-500 dark:text-slate-400 font-mono mb-4">{z.distance}</p>
                </div>

                <div className="pt-4 border-t border-stone-200/80 dark:border-white/[0.08] flex items-center justify-between text-xs font-semibold">
                  <span className="text-stone-600 dark:text-slate-300">Estimated Time:</span>
                  <span className="text-amber-600 dark:text-amber-400 font-bold">{z.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Call to Action */}
        <div className="relative rounded-3xl overflow-hidden p-8 sm:p-12 border border-amber-500/25 dark:border-amber-500/30 bg-gradient-to-r from-[#FFFDF8] via-[#F6EFE3] to-[#EDE3D0] dark:from-[#141720] dark:via-[#1A1E29] dark:to-[#141720] text-center shadow-xl">
          <div className="absolute -top-24 -left-24 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-2xl mx-auto relative z-10 space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-xs font-bold uppercase tracking-wider">
              <Sparkles size={13} className="text-amber-500 dark:text-amber-400" />
              <span>Doorstep Delivery Service</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 dark:text-white tracking-tight">
              Ready to Order Delicious Food?
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-slate-300 max-w-md mx-auto leading-relaxed font-normal">
              Browse our menu of freshly prepared curries, seafood specialties, woodfired pizzas, and desserts. Delivered warm and fresh in 25–45 minutes.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row justify-center gap-3">
              <Link
                to="/menu"
                className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-slate-950 text-xs font-extrabold uppercase tracking-wider shadow-lg shadow-amber-500/25 hover:brightness-105 transition-all inline-flex items-center justify-center gap-2"
              >
                <span>Order Now for Delivery</span>
                <ArrowRight size={14} />
              </Link>
              <Link
                to="/book-table"
                className="px-8 py-3.5 rounded-xl bg-stone-200/70 hover:bg-stone-200 text-stone-800 border border-stone-300/80 dark:bg-white/[0.08] dark:hover:bg-white/[0.12] dark:text-white dark:border-white/20 text-xs font-bold uppercase tracking-wider transition-all inline-flex items-center justify-center"
              >
                Reserve a Table Instead
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default DeliveryPage;
