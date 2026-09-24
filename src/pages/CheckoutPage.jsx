import { useState, useEffect } from 'react';
import { CreditCard, Wallet, Banknote, Lock, ChevronRight, Minus, Plus, Trash2, Check, ShoppingBag, ShieldCheck, ArrowRight, Utensils } from 'lucide-react';
import { createOrder, fetchUserProfile } from '../services/api';
import { useCart } from '../context/CartContext';
import { useSettings } from '../context/SettingsContext';
import { Link, useNavigate } from 'react-router-dom';

function CheckoutPage() {
  const navigate = useNavigate();
  const { cartItems, updateQuantity, removeFromCart, getCartTotal, clearCart } = useCart();
  const { settings, formatPrice } = useSettings();
  const [paymentMethod, setPaymentMethod] = useState('cash'); // Default to cash
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    apt: '',
    phone: '',
    instructions: ''
  });
  const [status, setStatus] = useState('idle');
  const [placedOrder, setPlacedOrder] = useState(null);
  
  const deliveryFee = Number(settings.delivery_fee) || 350.0;

  // Autofill user profile
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUserProfile(token)
        .then(profile => {
          if (profile) {
            const nameParts = (profile.full_name || '').split(' ');
            setFormData(prev => ({
              ...prev,
              firstName: prev.firstName || nameParts[0] || '',
              lastName: prev.lastName || nameParts.slice(1).join(' ') || '',
              email: prev.email || profile.email || '',
              phone: prev.phone || profile.phone || '',
              address: prev.address || profile.address || ''
            }));
          }
        })
        .catch(err => console.log('Could not load profile for checkout', err));
    }
  }, []);

  const subtotal = getCartTotal();
  const tax = subtotal * 0.08;
  const total = subtotal + deliveryFee + tax;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) return;

    setStatus('submitting');
    try {
      const items = cartItems.map(item => ({
        menu_item_id: item.type === 'menu_item' ? item.id : null,
        special_offer_id: item.type === 'special_offer' ? item.id : null,
        quantity: item.quantity
      }));

      const fullAddress = formData.apt 
        ? `${formData.address.trim()}, ${formData.apt.trim()}`
        : formData.address.trim();

      const orderResult = await createOrder({
        customer_name: `${formData.firstName.trim()} ${formData.lastName.trim()}`.trim(),
        customer_email: formData.email.trim() || undefined,
        customer_phone: formData.phone.trim(),
        delivery_address: fullAddress,
        delivery_instructions: formData.instructions.trim() || undefined,
        payment_method: paymentMethod,
        items: items
      });

      setPlacedOrder(orderResult);
      clearCart();
      setStatus('success');
    } catch (error) {
      console.error("Order failed", error);
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="min-h-[80vh] pt-12 sm:pt-16 pb-20 sm:pb-24 flex items-center justify-center px-4">
        <div className="glass-card p-8 sm:p-12 rounded-3xl shadow-2xl max-w-lg w-full text-center border border-amber-500/30 animate-in fade-in zoom-in duration-300">
          <div className="w-20 h-20 bg-amber-500/15 text-amber-400 rounded-full flex items-center justify-center mx-auto mb-6 border border-amber-500/30 shadow-lg shadow-amber-500/20">
            <Check size={40} className="stroke-[2.5]" />
          </div>
          <span className="text-amber-400 font-bold text-xs uppercase tracking-[0.2em] mb-2 block">
            Order Received
          </span>
          <h2 className="text-3xl font-serif font-bold text-white mb-2">Order Confirmed!</h2>
          <p className="text-slate-400 mb-8 text-xs sm:text-sm leading-relaxed">
            Our kitchen has received your order and is preparing it fresh.
          </p>
          
          {placedOrder && (
            <div className="bg-white/[0.03] rounded-2xl p-6 mb-8 text-left space-y-3.5 border border-white/[0.08]">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 uppercase tracking-wider font-semibold">Order Reference</span>
                <span className="font-mono font-bold text-amber-400">#{placedOrder.id}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 uppercase tracking-wider font-semibold">Total Amount</span>
                <span className="font-sans font-bold text-white text-base">{formatPrice(placedOrder.total_amount)}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 uppercase tracking-wider font-semibold">Payment Method</span>
                <span className="font-medium text-slate-200 capitalize">{placedOrder.payment_method}</span>
              </div>
              <div className="flex justify-between items-center text-xs pt-2 border-t border-white/[0.06]">
                <span className="text-slate-500 uppercase tracking-wider font-semibold">Status</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                  Preparing in Kitchen
                </span>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            <Link 
              to="/profile" 
              className="flex-1 bg-gradient-to-r from-amber-400 to-amber-600 text-slate-950 py-3.5 rounded-xl font-extrabold hover:from-amber-300 hover:to-amber-500 transition-all shadow-md shadow-amber-500/20 text-center text-xs uppercase tracking-wider"
            >
              Track in Profile
            </Link>
            <Link 
              to="/menu" 
              className="flex-1 bg-white/[0.05] border border-white/10 text-slate-200 py-3.5 rounded-xl font-bold hover:bg-white/[0.1] transition-all text-center text-xs uppercase tracking-wider"
            >
              Browse Menu
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-8 sm:pt-10 pb-20 sm:pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Stepper Breadcrumb */}
        <div className="flex items-center justify-center mb-10 text-xs font-bold uppercase tracking-wider">
          <Link to="/menu" className="text-slate-400 hover:text-white transition-colors">1. Menu Catalogue</Link>
          <span className="mx-4 text-slate-700">———</span>
          <span className="text-amber-400 flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center text-[10px] font-black">2</span>
            Checkout & Delivery
          </span>
        </div>

        <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-8">
          
          {/* Left Column - Delivery & Payment Form */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Delivery Details */}
            <div className="glass-card p-6 sm:p-8 rounded-3xl border border-white/10">
              <h2 className="text-xl font-serif font-bold text-white mb-6 flex items-center gap-3">
                <span className="w-2.5 h-6 bg-amber-500 rounded-full"></span>
                Delivery Destination
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">First Name</label>
                  <input 
                    type="text" 
                    placeholder="Kasun" 
                    required
                    className="w-full px-4 py-3 bg-[#0E1015] rounded-xl border border-white/10 text-xs text-white focus:border-amber-400/60 focus:outline-none" 
                    value={formData.firstName}
                    onChange={e => setFormData({...formData, firstName: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">Last Name</label>
                  <input 
                    type="text" 
                    placeholder="Perera" 
                    required
                    className="w-full px-4 py-3 bg-[#0E1015] rounded-xl border border-white/10 text-xs text-white focus:border-amber-400/60 focus:outline-none" 
                    value={formData.lastName}
                    onChange={e => setFormData({...formData, lastName: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="mb-5">
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">Street Address</label>
                <input 
                  type="text" 
                  placeholder="No. 45, Alfred House Gardens, Colombo 03" 
                  required
                  className="w-full px-4 py-3 bg-[#0E1015] rounded-xl border border-white/10 text-xs text-white focus:border-amber-400/60 focus:outline-none" 
                  value={formData.address}
                  onChange={e => setFormData({...formData, address: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">Apartment / Suite (Optional)</label>
                  <input 
                    type="text" 
                    placeholder="Apartment 4B, 3rd Floor" 
                    className="w-full px-4 py-3 bg-[#0E1015] rounded-xl border border-white/10 text-xs text-white focus:border-amber-400/60 focus:outline-none" 
                    value={formData.apt}
                    onChange={e => setFormData({...formData, apt: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">Contact Phone Number</label>
                  <input 
                    type="tel" 
                    placeholder="+94 77 123 4567" 
                    required
                    className="w-full px-4 py-3 bg-[#0E1015] rounded-xl border border-white/10 text-xs text-white focus:border-amber-400/60 focus:outline-none" 
                    value={formData.phone}
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">Courier Delivery Instructions</label>
                <textarea 
                  rows="3" 
                  placeholder="Gate details, landmark, or delivery preferences..." 
                  className="w-full px-4 py-3 bg-[#0E1015] rounded-xl border border-white/10 text-xs text-white focus:border-amber-400/60 focus:outline-none resize-none"
                  value={formData.instructions}
                  onChange={e => setFormData({...formData, instructions: e.target.value})}
                />
              </div>
            </div>

            {/* Payment Method */}
            <div className="glass-card p-6 sm:p-8 rounded-3xl border border-white/10">
              <h2 className="text-xl font-serif font-bold text-white mb-6 flex items-center gap-3">
                <span className="w-2.5 h-6 bg-amber-500 rounded-full"></span>
                Payment Method
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('cash')}
                  className={`flex flex-col items-center justify-center p-6 rounded-2xl border transition-all ${
                    paymentMethod === 'cash' 
                      ? 'border-amber-400 bg-amber-500/10 text-amber-300 font-bold shadow-md shadow-amber-500/15' 
                      : 'border-white/10 bg-white/[0.02] text-slate-400 hover:border-white/20'
                  }`}
                >
                  <Banknote size={26} className="mb-2 text-amber-400" />
                  <span className="text-xs font-bold uppercase tracking-wider">Cash on Delivery</span>
                  <span className="text-[10px] text-slate-400 mt-1">Pay upon courier arrival</span>
                </button>
                
                {/* Credit Card / Digital Wallet */}
                <button 
                  type="button" 
                  disabled 
                  className="flex flex-col items-center justify-center p-6 rounded-2xl border border-white/5 bg-white/[0.01] text-slate-600 cursor-not-allowed opacity-60 relative"
                >
                  <CreditCard size={26} className="mb-2" />
                  <span className="text-xs font-bold uppercase tracking-wider">Credit Card</span>
                  <span className="text-[9px] uppercase tracking-wider bg-white/10 px-2 py-0.5 rounded text-slate-400 mt-1">Coming Soon</span>
                </button>

                <button 
                  type="button" 
                  disabled 
                  className="flex flex-col items-center justify-center p-6 rounded-2xl border border-white/5 bg-white/[0.01] text-slate-600 cursor-not-allowed opacity-60 relative"
                >
                  <Wallet size={26} className="mb-2" />
                  <span className="text-xs font-bold uppercase tracking-wider">Apple / Digital Pay</span>
                  <span className="text-[9px] uppercase tracking-wider bg-white/10 px-2 py-0.5 rounded text-slate-400 mt-1">Coming Soon</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary Box */}
          <div className="lg:col-span-1">
            <div className="glass-card p-6 sm:p-8 rounded-3xl border border-white/10 sticky top-6 shadow-2xl">
              <h2 className="text-xl font-serif font-bold text-white mb-1">Your Tasting Order</h2>
              <p className="text-xs text-slate-400 mb-6">Prepared by <span className="text-amber-400 font-semibold">Tartuca Kitchen</span></p>

              {/* Cart Items List */}
              <div className="space-y-4 mb-6 max-h-72 overflow-y-auto pr-1">
                {cartItems.length === 0 ? (
                  <div className="text-center py-8 text-slate-400">
                    <ShoppingBag size={32} className="mx-auto text-slate-600 mb-2" />
                    <p className="text-xs">Your dining bag is currently empty.</p>
                    <Link to="/menu" className="text-amber-400 hover:underline text-xs font-bold mt-2 inline-block">Explore Menu</Link>
                  </div>
                ) : (
                  cartItems.map((item) => (
                    <div key={`${item.id}-${item.type}`} className="flex gap-3.5 items-center justify-between pb-3 border-b border-white/[0.06]">
                      <div className="w-12 h-12 rounded-xl bg-[#0E1015] overflow-hidden shrink-0 border border-white/10">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-white text-xs truncate">{item.name}</h4>
                        <span className="font-mono text-amber-400 text-xs font-bold">{formatPrice(item.price * item.quantity)}</span>
                      </div>
                      
                      {/* Quantity stepper */}
                      <div className="flex items-center gap-1.5 bg-white/[0.04] border border-white/10 rounded-lg p-0.5">
                        <button 
                          type="button"
                          onClick={() => updateQuantity(item.id, item.type, item.quantity - 1)}
                          className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 rounded text-xs"
                        >
                          <Minus size={10} />
                        </button>
                        <span className="text-xs font-bold px-1.5 text-white">{item.quantity}</span>
                        <button 
                          type="button"
                          onClick={() => updateQuantity(item.id, item.type, item.quantity + 1)}
                          className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 rounded text-xs"
                        >
                          <Plus size={10} />
                        </button>
                      </div>

                      <button 
                        type="button"
                        onClick={() => removeFromCart(item.id, item.type)}
                        className="text-slate-500 hover:text-rose-400 transition-colors p-1"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Fee Breakdown */}
              <div className="space-y-2.5 pt-4 border-t border-white/[0.08] mb-6 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Subtotal</span>
                  <span className="font-mono font-semibold text-slate-200">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Delivery Fee</span>
                  <span className="font-mono font-semibold text-slate-200">{formatPrice(deliveryFee)}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Taxes & Service (8%)</span>
                  <span className="font-mono font-semibold text-slate-200">{formatPrice(tax)}</span>
                </div>
                <div className="flex justify-between text-base font-bold text-white pt-3 border-t border-white/[0.08]">
                  <span className="font-serif">Grand Total</span>
                  <span className="font-mono text-amber-400 font-extrabold text-lg">{formatPrice(total)}</span>
                </div>
              </div>

              {/* Submit CTA */}
              <button 
                type="submit" 
                disabled={status === 'submitting' || cartItems.length === 0}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-amber-500/25 transition-all duration-200 hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
              >
                <span>{status === 'submitting' ? 'Placing your order...' : 'Place Order'}</span>
                <ArrowRight size={14} />
              </button>
              
              <p className="text-center text-[10px] text-slate-500 mt-4 flex items-center justify-center gap-1">
                <ShieldCheck size={12} className="text-amber-400" /> Hot & fresh guarantee. Contactless delivery.
              </p>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
}

export default CheckoutPage;
