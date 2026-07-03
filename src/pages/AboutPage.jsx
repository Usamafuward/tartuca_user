import { ChefHat, Users, Award } from 'lucide-react';

function AboutPage() {
  return (
    <div className="bg-light min-h-screen">
      {/* Hero */}
      <div className="relative py-24 bg-dark overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h1 className="text-5xl lg:text-6xl font-bold mb-6">Our Story</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            From humble beginnings to a culinary destination. Discover the passion and tradition behind Tartuca.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Mission */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
           <div>
              <span className="text-primary font-bold text-xs uppercase tracking-wider mb-2 block">
                 Since 2010
              </span>
              <h2 className="text-4xl font-bold text-dark mb-6">Passion for Authentic Flavors</h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                 <p>
                    Tartuca started with a simple mission: to bring authentic, high-quality ingredients to the table in a way that feels both modern and comforting. What began as a small family kitchen has grown into a beloved local spot.
                 </p>
                 <p>
                    We believe that food is more than just sustenance—it's an experience. That's why we source our ingredients locally whenever possible and prepare every dish with meticulous attention to detail.
                 </p>
              </div>
           </div>
           <div className="relative">
              <div className="absolute -inset-4 bg-primary/10 rounded-3xl -z-10 rotate-3"></div>
              <img src="https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&q=80&w=800" alt="Chef cooking" className="rounded-3xl shadow-xl w-full" />
           </div>
        </div>

        {/* Stats */}
        <div className="bg-white rounded-3xl p-12 shadow-sm border border-gray-100 grid md:grid-cols-3 gap-8 text-center mb-24">
           <div>
              <div className="w-16 h-16 bg-orange-50 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                 <Users size={32} />
              </div>
              <h3 className="text-4xl font-bold text-dark mb-1">50k+</h3>
              <p className="text-gray-500">Happy Customers</p>
           </div>
           <div>
              <div className="w-16 h-16 bg-orange-50 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                 <ChefHat size={32} />
              </div>
              <h3 className="text-4xl font-bold text-dark mb-1">15+</h3>
              <p className="text-gray-500">Expert Chefs</p>
           </div>
           <div>
              <div className="w-16 h-16 bg-orange-50 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                 <Award size={32} />
              </div>
              <h3 className="text-4xl font-bold text-dark mb-1">25+</h3>
              <p className="text-gray-500">Awards Won</p>
           </div>
        </div>

        {/* Team */}
        <div className="text-center mb-12">
           <h2 className="text-3xl font-bold text-dark mb-4">Meet Our Chefs</h2>
           <p className="text-gray-500 max-w-2xl mx-auto">The creative minds behind your favorite dishes.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
           {[
              { name: 'Marco Rossi', role: 'Head Chef', img: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&q=80&w=800' },
              { name: 'Sarah Kline', role: 'Pastry Chef', img: 'https://images.unsplash.com/photo-1595273670150-bd0c3c392e46?auto=format&fit=crop&q=80&w=800' },
              { name: 'David Chen', role: 'Sous Chef', img: 'https://images.unsplash.com/photo-1566554273541-37a9ca77b91f?auto=format&fit=crop&q=80&w=800' },
           ].map((chef, i) => (
              <div key={i} className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all group">
                 <div className="h-80 overflow-hidden">
                    <img src={chef.img} alt={chef.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                 </div>
                 <div className="p-6 text-center">
                    <h3 className="font-bold text-dark text-xl">{chef.name}</h3>
                    <p className="text-primary font-medium">{chef.role}</p>
                 </div>
              </div>
           ))}
        </div>
      </div>
    </div>
  );
}

export default AboutPage;
