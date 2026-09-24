import { ChefHat, Users, Award, Sparkles, Flame, Clock, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

function AboutPage() {
  return (
    <div className="min-h-screen pb-20 sm:pb-24">
      {/* Hero Banner */}
      <div className="relative py-24 sm:py-28 bg-[#FAF7F2] dark:bg-[#050608] overflow-hidden">
        <div className="absolute inset-0 opacity-50 bg-[url('https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#FAF7F2] via-[#FAF7F2]/80 to-[#FAF7F2]/60 dark:from-[#050608] dark:via-[#050608]/60 dark:to-[#050608]/75" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-700 dark:bg-amber-500/20 dark:border-amber-500/40 dark:text-amber-300 text-xs font-bold uppercase tracking-wider mb-6 backdrop-blur-md shadow-sm">
            <Sparkles size={13} className="text-amber-600 dark:text-amber-400" />
            <span>Our Heritage • Est. 2014</span>
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-serif font-bold mb-6 tracking-tight text-stone-900 dark:text-white drop-shadow-sm dark:drop-shadow-lg">
            About Tartuca
          </h1>
          <p className="text-base sm:text-lg text-stone-600 dark:text-slate-200 max-w-2xl mx-auto leading-relaxed font-normal">
            Bringing rich Sri Lankan culinary traditions and diverse cooking to life. Serving authentic curries, ocean-fresh seafood, signature grills, woodfired pizzas, and handcrafted culinary favorites.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20">
        
        {/* Mission Section */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
          <div>
            <span className="text-amber-600 dark:text-amber-400 font-bold text-xs uppercase tracking-[0.2em] mb-2 block">
              Sri Lankan Heritage • Since 2014
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 dark:text-white mb-6">
              Authentic Sri Lankan Flavours & Honest Cooking.
            </h2>
            <div className="space-y-4 text-stone-600 dark:text-slate-400 text-sm leading-relaxed font-normal">
              <p>
                Tartuca was founded in Colombo with a simple mission: to celebrate the vibrant flavours of Sri Lankan cuisine alongside diverse contemporary dishes, prepared with authentic recipes and honest, high-quality ingredients.
              </p>
              <p>
                From rich slow-simmered curries and ocean-fresh seafood to crispy woodfired pizzas, flame-grilled specialties, and handcrafted desserts, our kitchen prepares every dish with freshly ground spices, coconut milk, and ingredients sourced from trusted local farmers and markets.
              </p>
            </div>

            <div className="mt-8 flex gap-4">
              <Link 
                to="/book-table"
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-600 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 hover:from-amber-300 hover:to-amber-500 transition-all"
              >
                Reserve a Table
              </Link>
              <Link 
                to="/menu"
                className="px-6 py-3 rounded-xl bg-stone-100 hover:bg-stone-200/80 text-stone-800 border border-stone-300/80 dark:bg-white/[0.04] dark:border-white/10 dark:text-slate-200 dark:hover:border-white/20 font-bold text-xs uppercase tracking-wider transition-all"
              >
                View Our Menu
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 bg-amber-500/10 rounded-3xl blur-2xl -z-10" />
            <div className="rounded-3xl overflow-hidden border border-stone-200/80 dark:border-white/10 shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&q=80&w=800" 
                alt="Chef preparing fresh dishes at Tartuca" 
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" 
              />
            </div>
          </div>
        </div>

        {/* Milestone Stats */}
        <div className="glass-card rounded-3xl p-10 sm:p-12 border border-stone-200/80 dark:border-white/10 grid sm:grid-cols-3 gap-8 text-center mb-24 shadow-2xl">
          <div>
            <div className="w-14 h-14 bg-amber-500/15 text-amber-600 dark:text-amber-400 rounded-2xl border border-amber-500/30 flex items-center justify-center mx-auto mb-4">
              <Users size={28} />
            </div>
            <h3 className="text-4xl font-serif font-bold text-stone-900 dark:text-white mb-1">10+ Years</h3>
            <p className="text-xs text-stone-500 dark:text-slate-400 uppercase tracking-wider font-semibold">Of Hospitality & Dining</p>
          </div>
          <div>
            <div className="w-14 h-14 bg-amber-500/15 text-amber-600 dark:text-amber-400 rounded-2xl border border-amber-500/30 flex items-center justify-center mx-auto mb-4">
              <Flame size={28} />
            </div>
            <h3 className="text-4xl font-serif font-bold text-stone-900 dark:text-white mb-1">100%</h3>
            <p className="text-xs text-stone-500 dark:text-slate-400 uppercase tracking-wider font-semibold">Fresh Spices & Honest Cooking</p>
          </div>
          <div>
            <div className="w-14 h-14 bg-amber-500/15 text-amber-600 dark:text-amber-400 rounded-2xl border border-amber-500/30 flex items-center justify-center mx-auto mb-4">
              <Award size={28} />
            </div>
            <h3 className="text-4xl font-serif font-bold text-stone-900 dark:text-white mb-1">4.9 ★</h3>
            <p className="text-xs text-stone-500 dark:text-slate-400 uppercase tracking-wider font-semibold">Average Customer Rating</p>
          </div>
        </div>

        {/* Culinary Team */}
        <div className="text-center mb-12">
          <span className="text-amber-600 dark:text-amber-400 font-bold text-xs uppercase tracking-[0.2em] mb-2 block">
            Our Kitchen Team
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 dark:text-white mb-3">Meet Our Kitchen Team</h2>
          <p className="text-stone-600 dark:text-slate-400 text-sm max-w-xl mx-auto">Experienced chefs passionate about authentic Sri Lankan cuisine, diverse dishes, and warm island hospitality.</p>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
          {[
            { name: 'Marco Rossi', role: 'Head Chef & Co-Founder', img: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&q=80&w=800' },
            { name: 'Sarah Kline', role: 'Head of Pastry & Desserts', img: 'https://images.unsplash.com/photo-1595273670150-bd0c3c392e46?auto=format&fit=crop&q=80&w=800' },
            { name: 'David Chen', role: 'Sous Chef', img: 'https://images.unsplash.com/photo-1566554273541-37a9ca77b91f?auto=format&fit=crop&q=80&w=800' },
          ].map((chef, i) => (
            <div key={i} className="glass-card rounded-3xl overflow-hidden border border-stone-200/80 dark:border-white/10 hover:border-amber-500/40 transition-all duration-300 group shadow-lg">
              <div className="h-80 overflow-hidden bg-stone-100 dark:bg-[#0F1117] relative">
                <img 
                  src={chef.img} 
                  alt={chef.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-900/40 dark:from-[#151821] via-transparent to-transparent opacity-80" />
              </div>
              <div className="p-6 text-center">
                <h3 className="font-serif font-bold text-stone-900 dark:text-white text-xl mb-1">{chef.name}</h3>
                <p className="text-amber-600 dark:text-amber-400 text-xs font-semibold uppercase tracking-wider">{chef.role}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

export default AboutPage;
