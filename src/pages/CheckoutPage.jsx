import { useState } from 'react';
import { CreditCard, Wallet, Banknote, Lock, ChevronRight, Minus, Plus, Trash2, Check } from 'lucide-react';
import { createOrder } from '../services/api';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

function CheckoutPage() {
  const { cartItems, updateQuantity, removeFromCart, getCartTotal, clearCart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState('cash'); // Default to cash
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    address: '',
    apt: '',
    phone: '',
    instructions: ''
  });
  const [status, setStatus] = useState('idle');

  const subtotal = getCartTotal();
  const deliveryFee = 2.99;
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

      await createOrder({
        customer_name: `${formData.firstName} ${formData.lastName}`,
        customer_phone: formData.phone,
        delivery_address: `${formData.address}, ${formData.apt}`,
        delivery_instructions: formData.instructions,
        payment_method: paymentMethod,
        items: items
      });
      clearCart();
      setStatus('success');
    } catch (error) {
      console.error("Order failed", error);
      setStatus('error');
    }
  };

  if (status === 'success') {
      return (
        <div className="bg-light min-h-screen py-12 flex items-center justify-center">
            <div className="bg-white p-8 rounded-3xl shadow-sm max-w-md text-center">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check size={32} />
                </div>
                <h2 className="text-2xl font-bold text-dark mb-2">Order Placed!</h2>
                <p className="text-gray-500">Your delicious food is on the way.</p>
                <Link to="/" className="inline-block mt-6 text-primary font-bold hover:underline">Back to Home</Link>
            </div>
        </div>
      );
  }

  // NOTE: Previous "Empty Cart" UI logic removed to maintain consistent layout.
  // The cartItems length check will now disable the submit button instead.

  return (
    <div className="bg-light min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb / Stepper */}
        <div className="flex items-center justify-center mb-12 text-sm font-medium">
          <Link to="/menu" className="text-gray-400 hover:text-primary">1. Menu</Link>
          <span className="mx-4 text-gray-300">——</span>
          <span className="text-primary flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs">2</span>
            Cart & Checkout
          </span>
        </div>

        <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Forms */}
          <div className="lg:col-span-2 space-y-8">
            {/* Delivery Details */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-dark mb-6 flex items-center gap-2">
                <span className="w-2 h-6 bg-primary rounded-full"></span>
                Where are we sending your food?
              </h2>
              
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase">First Name</label>
                  <input 
                    type="text" 
                    placeholder="John" 
                    required
                    className="w-full px-4 py-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-primary/20 focus:outline-none" 
                    value={formData.firstName}
                    onChange={e => setFormData({...formData, firstName: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase">Last Name</label>
                  <input 
                    type="text" 
                    placeholder="Doe" 
                    required
                    className="w-full px-4 py-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-primary/20 focus:outline-none" 
                    value={formData.lastName}
                    onChange={e => setFormData({...formData, lastName: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="space-y-2 mb-6">
                <label className="text-xs font-bold text-gray-500 uppercase">Street Address</label>
                <input 
                    type="text" 
                    placeholder="123 Delicious Ave" 
                    required
                    className="w-full px-4 py-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-primary/20 focus:outline-none" 
                    value={formData.address}
                    onChange={e => setFormData({...formData, address: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-6 mb-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase">Apt, Suite, etc.</label>
                  <input 
                    type="text" 
                    placeholder="Apt 4B" 
                    className="w-full px-4 py-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-primary/20 focus:outline-none" 
                    value={formData.apt}
                    onChange={e => setFormData({...formData, apt: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase">Phone Number</label>
                  <input 
                    type="tel" 
                    placeholder="(555) 123-4567" 
                    required
                    className="w-full px-4 py-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-primary/20 focus:outline-none" 
                    value={formData.phone}
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase">Delivery Instructions</label>
                <textarea 
                    rows="3" 
                    placeholder="Gate code is 1234, leave at door..." 
                    className="w-full px-4 py-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-primary/20 focus:outline-none resize-none"
                    value={formData.instructions}
                    onChange={e => setFormData({...formData, instructions: e.target.value})}
                ></textarea>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-dark mb-6 flex items-center gap-2">
                <span className="w-2 h-6 bg-primary rounded-full"></span>
                How would you like to pay?
              </h2>

              <div className="grid grid-cols-3 gap-4 mb-8">
                <button
                    type="button"
                    onClick={() => setPaymentMethod('cash')}
                    className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all ${
                      paymentMethod === 'cash' 
                        ? 'border-primary bg-primary/5 text-primary' 
                        : 'border-gray-100 bg-white text-gray-400 hover:border-gray-200'
                    }`}
                  >
                    <Banknote size={24} className="mb-2" />
                    <span className="text-sm font-bold">Cash on Delivery</span>
                  </button>
                  
                  {/* Disabled options */}
                  <button type="button" disabled className="flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed">
                    <CreditCard size={24} className="mb-2" />
                    <span className="text-sm font-bold">Credit Card</span>
                  </button>
                  <button type="button" disabled className="flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed">
                    <Wallet size={24} className="mb-2" />
                    <span className="text-sm font-bold">Wallet</span>
                  </button>
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 sticky top-24">
              <h2 className="text-xl font-bold text-dark mb-2">Order Summary</h2>
              <p className="text-sm text-gray-400 mb-6">From <span className="text-primary font-semibold">Tartuca Central Kitchen</span></p>

              <div className="space-y-6 mb-8 max-h-100 overflow-y-auto pr-2">
                {cartItems.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        <p>Your cart is empty.</p>
                        <Link to="/menu" className="text-primary hover:underline text-sm font-medium">Browse Menu</Link>
                    </div>
                ) : (
                    cartItems.map((item, i) => (
                    <div key={`${item.id}-${item.type}`} className="flex gap-4 group">
                        <div className="w-16 h-16 bg-gray-50 rounded-xl overflow-hidden shrink-0">
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1">
                        <div className="flex justify-between items-start mb-1">
                            <h4 className="font-bold text-dark text-sm line-clamp-2">{item.name}</h4>
                            <span className="font-bold text-dark text-sm ml-2">${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                        
                        <div className="flex items-center gap-3 mt-2">
                            <div className="flex items-center bg-gray-100 rounded-lg overflow-hidden">
                                <button 
                                    type="button"
                                    onClick={() => updateQuantity(item.id, item.type, item.quantity - 1)}
                                    className="px-2 py-1 hover:bg-gray-200"
                                >
                                    <Minus size={12} />
                                </button>
                                <span className="text-xs font-bold px-2">{item.quantity}</span>
                                <button 
                                    type="button"
                                    onClick={() => updateQuantity(item.id, item.type, item.quantity + 1)}
                                    className="px-2 py-1 hover:bg-gray-200"
                                >
                                    <Plus size={12} />
                                </button>
                            </div>
                            <button 
                                type="button"
                                onClick={() => removeFromCart(item.id, item.type)}
                                className="text-gray-400 hover:text-red-500 transition-colors"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                        </div>
                    </div>
                    ))
                )}
              </div>

              <div className="space-y-3 pt-6 border-t border-gray-100 mb-6">
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Subtotal</span>
                  <span className="font-bold text-dark">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Delivery Fee</span>
                  <span className="font-bold text-dark">${deliveryFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Tax (8%)</span>
                  <span className="font-bold text-dark">${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xl font-bold text-dark pt-4 border-t border-gray-100">
                  <span>Total</span>
                  <span className="text-primary">${total.toFixed(2)}</span>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={status === 'submitting' || cartItems.length === 0}
                className="w-full bg-primary text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/40 hover:-translate-y-1 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {status === 'submitting' ? 'Processing...' : 'Place Order'}
              </button>
              
              <p className="text-center text-[10px] text-gray-400 mt-4">
                By placing an order, you agree to our Terms and Privacy Policy.
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CheckoutPage;
