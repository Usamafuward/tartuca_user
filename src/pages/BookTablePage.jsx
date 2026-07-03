import { useState } from 'react';
import { Calendar, Clock, Users, Check, ChevronRight, Utensils } from 'lucide-react';
import { LoadingOverlay } from '../components/common/Loading';
// import { createReservation } from '../services/api'; 

function BookTablePage() {
  const [partySize, setPartySize] = useState(2);
  const [selectedTime, setSelectedTime] = useState('19:00:00');
  const [occasion, setOccasion] = useState('Date Night');
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: ''
  });
  const [status, setStatus] = useState('idle');

  const times = ['17:00:00', '17:30:00', '18:00:00', '18:30:00', '19:00:00', '19:30:00', '20:00:00', '20:30:00', '21:00:00'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('submitting');
    try {
        await new Promise(resolve => setTimeout(resolve, 1500));
        setStatus('success');
    } catch (error) {
        console.error("Booking failed", error);
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
                <h2 className="text-2xl font-bold text-dark mb-2">Table Booked!</h2>
                <p className="text-gray-500">We look forward to seeing you. Check your email for confirmation.</p>
                <button onClick={() => setStatus('idle')} className="mt-6 text-primary font-bold hover:underline">Book another</button>
            </div>
        </div>
      );
  }

  return (
    <div className="bg-light min-h-screen py-12 relative">
      <LoadingOverlay isVisible={status === 'submitting'} text="Confirming your table..." />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-dark mb-2">Book Your Table</h1>
          <p className="text-gray-500">Select your preferences below to check availability.</p>
        </div>

        <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Steps */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Step 1: Party Size */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-4 mb-6">
                <span className="w-8 h-8 rounded-full bg-orange-100 text-primary font-bold flex items-center justify-center">1</span>
                <h2 className="text-xl font-bold text-dark">Party Size</h2>
              </div>
              
              <div className="flex flex-wrap gap-4 items-center">
                <span className="text-sm font-bold text-gray-400 uppercase mr-4">Guests</span>
                <div className="flex items-center bg-gray-50 rounded-xl p-1">
                  <button 
                    type="button"
                    onClick={() => setPartySize(Math.max(1, partySize - 1))}
                    className="w-10 h-10 flex items-center justify-center text-gray-500 hover:bg-white hover:shadow-sm rounded-lg transition-all"
                  >
                    -
                  </button>
                  <span className="w-12 text-center font-bold text-lg text-dark">{partySize}</span>
                  <button 
                    type="button"
                    onClick={() => setPartySize(partySize + 1)}
                    className="w-10 h-10 flex items-center justify-center text-primary hover:bg-white hover:shadow-sm rounded-lg transition-all"
                  >
                    +
                  </button>
                </div>

                <div className="flex gap-3 ml-auto">
                  {['Date Night', 'Business', 'Family'].map((type) => (
                    <button
                      type="button"
                      key={type}
                      onClick={() => setOccasion(type)}
                      className={`px-4 py-2 rounded-xl text-sm font-bold transition-all border ${
                        occasion === type 
                          ? 'bg-primary text-white border-primary' 
                          : 'bg-white text-gray-500 border-gray-200 hover:border-primary/50'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Step 2: Date & Time */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-4 mb-6">
                <span className="w-8 h-8 rounded-full bg-orange-100 text-primary font-bold flex items-center justify-center">2</span>
                <h2 className="text-xl font-bold text-dark">Date & Time</h2>
              </div>

              {/* Simplified Time Selection */}
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                  {times.map((time) => (
                    <button
                      type="button"
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`py-2 rounded-lg text-sm font-bold transition-all border ${
                        selectedTime === time
                          ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20'
                          : 'bg-white text-gray-600 border-gray-100 hover:border-primary/30'
                      }`}
                    >
                      {time.slice(0, 5)}
                    </button>
                  ))}
              </div>
            </div>

            {/* Step 3: Preferences */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-4 mb-6">
                <span className="w-8 h-8 rounded-full bg-orange-100 text-primary font-bold flex items-center justify-center">3</span>
                <h2 className="text-xl font-bold text-dark">Preferences</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                 <div>
                    <h3 className="text-sm font-bold text-dark mb-4">Seating Area</h3>
                    <div className="relative h-40 rounded-2xl overflow-hidden group cursor-pointer">
                       <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors z-10" />
                       <img src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800" alt="Restaurant Interior" className="w-full h-full object-cover" />
                       <div className="absolute bottom-3 left-3 right-3 flex gap-2 z-20">
                          <button type="button" className="flex-1 bg-primary text-white text-xs font-bold py-2 rounded-lg">Main Dining</button>
                          <button type="button" className="flex-1 bg-white/20 backdrop-blur-md text-white text-xs font-bold py-2 rounded-lg hover:bg-white/30">Patio</button>
                       </div>
                    </div>
                 </div>

                 <div>
                    <h3 className="text-sm font-bold text-dark mb-4">Special Requests</h3>
                    <div className="flex flex-wrap gap-2 mb-4">
                       {['Window Seat', 'High Chair', 'Anniversary', 'Birthday', 'Quiet Area'].map(req => (
                          <span key={req} className="px-3 py-1.5 rounded-full border border-gray-200 text-xs font-medium text-gray-600 cursor-pointer hover:border-primary hover:text-primary transition-colors">
                             {req}
                          </span>
                       ))}
                    </div>
                    <textarea 
                       placeholder="Add any specific dietary requirements or notes..." 
                       className="w-full h-24 bg-gray-50 rounded-xl border-none p-4 text-sm focus:ring-2 focus:ring-primary/20 focus:outline-none resize-none"
                    ></textarea>
                 </div>
              </div>
            </div>

            {/* Step 4: Contact Info */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-4 mb-6">
                    <span className="w-8 h-8 rounded-full bg-orange-100 text-primary font-bold flex items-center justify-center">4</span>
                    <h2 className="text-xl font-bold text-dark">Contact Details</h2>
                </div>
                <div className="space-y-4">
                    <input 
                        type="text" 
                        placeholder="Your Name" 
                        required
                        className="w-full px-4 py-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-primary/20 focus:outline-none"
                        value={formData.customer_name}
                        onChange={e => setFormData({...formData, customer_name: e.target.value})}
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <input 
                            type="email" 
                            placeholder="Email Address" 
                            required
                            className="w-full px-4 py-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-primary/20 focus:outline-none"
                            value={formData.customer_email}
                            onChange={e => setFormData({...formData, customer_email: e.target.value})}
                        />
                        <input 
                            type="tel" 
                            placeholder="Phone Number" 
                            required
                            className="w-full px-4 py-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-primary/20 focus:outline-none"
                            value={formData.customer_phone}
                            onChange={e => setFormData({...formData, customer_phone: e.target.value})}
                        />
                    </div>
                </div>
            </div>
          </div>

          {/* Right Column - Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 sticky top-24 overflow-hidden">
               {/* Header Image */}
               <div className="h-32 bg-gray-200 relative">
                  <img src="https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80&w=800" alt="Drink" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent flex items-end p-6">
                     <h2 className="text-white font-bold text-xl">Reservation Summary</h2>
                  </div>
               </div>

               <div className="p-6 space-y-6">
                  {/* Summary Items */}
                  <div className="flex gap-4 items-start">
                     <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-primary shrink-0">
                        <Calendar size={20} />
                     </div>
                     <div>
                        <p className="text-xs font-bold text-gray-400 uppercase mb-1">Date</p>
                        <p className="font-bold text-dark">Tomorrow</p>
                     </div>
                  </div>

                  <div className="flex gap-4 items-start">
                     <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-primary shrink-0">
                        <Clock size={20} />
                     </div>
                     <div>
                        <p className="text-xs font-bold text-gray-400 uppercase mb-1">Time</p>
                        <p className="font-bold text-dark">{selectedTime.slice(0, 5)}</p>
                     </div>
                  </div>

                  <div className="flex gap-4 items-start">
                     <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-primary shrink-0">
                        <Users size={20} />
                     </div>
                     <div>
                        <p className="text-xs font-bold text-gray-400 uppercase mb-1">Guests</p>
                        <p className="font-bold text-dark">{partySize} People</p>
                     </div>
                  </div>

                  <div className="flex gap-4 items-start pb-6 border-b border-gray-100">
                     <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-primary shrink-0">
                        <Utensils size={20} />
                     </div>
                     <div>
                        <p className="text-xs font-bold text-gray-400 uppercase mb-1">Occasion</p>
                        <p className="font-bold text-dark">{occasion}</p>
                     </div>
                  </div>

                  <button 
                    type="submit" 
                    disabled={status === 'submitting'}
                    className="w-full bg-primary text-white py-3.5 rounded-xl font-bold hover:bg-primary-dark transition-colors shadow-lg shadow-primary/30 flex items-center justify-center gap-2 disabled:opacity-70"
                  >
                     {status === 'submitting' ? 'Booking...' : (
                        <>Confirm Reservation <ChevronRight size={18} /></>
                     )}
                  </button>
                  
                  <div className="flex items-center justify-center gap-4 text-[10px] text-gray-400">
                     <span className="flex items-center gap-1"><Check size={12} /> Secure Booking</span>
                     <span className="flex items-center gap-1"><Check size={12} /> Instant Confirmation</span>
                  </div>
               </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default BookTablePage;
