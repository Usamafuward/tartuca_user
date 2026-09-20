import { useState, useEffect } from 'react';
import { Calendar, Clock, Users, Check, ChevronRight, Utensils, Sparkles, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { LoadingOverlay } from '../components/common/Loading';
import { createReservation, fetchUserProfile } from '../services/api';

function BookTablePage() {
  const getTomorrowDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  };

  const getTodayDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  const [selectedDate, setSelectedDate] = useState(getTomorrowDate());
  const [partySize, setPartySize] = useState(2);
  const [selectedTime, setSelectedTime] = useState('19:00:00');
  const [occasion, setOccasion] = useState('Date Night');
  const [seatingArea, setSeatingArea] = useState('Main Dining');
  const [selectedTags, setSelectedTags] = useState([]);
  const [specialNotes, setSpecialNotes] = useState('');
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: ''
  });
  const [status, setStatus] = useState('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  const times = ['17:00:00', '17:30:00', '18:00:00', '18:30:00', '19:00:00', '19:30:00', '20:00:00', '20:30:00', '21:00:00', '21:30:00'];
  const tagsList = ['Window Seat', 'High Chair', 'Quiet Area', 'Romantic Setting', 'Booth Preferred'];

  // Prefill authenticated user profile
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUserProfile(token)
        .then(profile => {
          if (profile) {
            setFormData(prev => ({
              customer_name: prev.customer_name || profile.full_name || '',
              customer_email: prev.customer_email || profile.email || '',
              customer_phone: prev.customer_phone || profile.phone || ''
            }));
          }
        })
        .catch(err => console.log('Could not load user profile for prefill', err));
    }
  }, []);

  const toggleTag = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMessage('');

    try {
      const combinedOccasion = [
        occasion,
        seatingArea ? `Area: ${seatingArea}` : '',
        selectedTags.length > 0 ? `Preferences: ${selectedTags.join(', ')}` : '',
        specialNotes ? `Notes: ${specialNotes}` : ''
      ].filter(Boolean).join(' | ');

      const reservationPayload = {
        customer_name: formData.customer_name.trim(),
        customer_email: formData.customer_email.trim(),
        customer_phone: formData.customer_phone.trim(),
        party_size: Number(partySize),
        reservation_date: selectedDate,
        reservation_time: selectedTime,
        occasion: combinedOccasion
      };

      const result = await createReservation(reservationPayload);
      setConfirmedBooking(result);
      setStatus('success');
    } catch (error) {
      console.error("Booking failed", error);
      setErrorMessage(error.message || "Unable to complete reservation. Please try again.");
      setStatus('error');
    }
  };

  if (status === 'success' && confirmedBooking) {
    return (
      <div className="bg-light min-h-screen py-16 flex items-center justify-center px-4">
        <div className="bg-white p-8 sm:p-10 rounded-3xl shadow-xl max-w-lg w-full text-center border border-gray-100 animate-in fade-in zoom-in duration-300">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-md shadow-green-100">
            <Check size={40} className="stroke-[2.5]" />
          </div>
          <h2 className="text-3xl font-bold text-dark mb-2">Reservation Confirmed!</h2>
          <p className="text-gray-500 mb-6 text-sm">
            We are excited to host you at Tartuca. We have received your booking and it is currently being prepared.
          </p>

          <div className="bg-gray-50 rounded-2xl p-5 mb-8 text-left space-y-3 border border-gray-100">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-400 font-medium">Reservation ID</span>
              <span className="font-bold text-dark">#{confirmedBooking.id}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-400 font-medium">Date</span>
              <span className="font-bold text-dark">{confirmedBooking.reservation_date}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-400 font-medium">Time</span>
              <span className="font-bold text-dark">{confirmedBooking.reservation_time ? confirmedBooking.reservation_time.slice(0, 5) : selectedTime.slice(0, 5)}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-400 font-medium">Party Size</span>
              <span className="font-bold text-dark">{confirmedBooking.party_size} Guests</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-400 font-medium">Guest Name</span>
              <span className="font-bold text-dark">{confirmedBooking.customer_name}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-400 font-medium">Status</span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 capitalize">
                {confirmedBooking.status || 'Pending'}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link 
              to="/profile" 
              className="flex-1 bg-primary text-white py-3 rounded-xl font-bold hover:bg-primary-dark transition-all shadow-md shadow-primary/20 text-center text-sm"
            >
              View in My Profile
            </Link>
            <button 
              onClick={() => {
                setStatus('idle');
                setConfirmedBooking(null);
              }} 
              className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-200 transition-all text-sm"
            >
              Book Another Table
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-light min-h-screen py-12 relative">
      <LoadingOverlay isVisible={status === 'submitting'} text="Reserving your table..." />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-2">
            <Sparkles size={14} /> Instant Table Reservation
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-dark tracking-tight">Book Your Table</h1>
          <p className="text-gray-500 mt-1">Reserve a table at Tartuca for fine dining, family gatherings, or romantic evenings.</p>
        </div>

        {errorMessage && (
          <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 flex items-center gap-3">
            <AlertCircle size={20} className="shrink-0" />
            <span className="text-sm font-medium">{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Steps */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Step 1: Party Size & Occasion */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-4 mb-6">
                <span className="w-8 h-8 rounded-full bg-orange-100 text-primary font-bold flex items-center justify-center shrink-0">1</span>
                <div>
                  <h2 className="text-xl font-bold text-dark">Party Size & Occasion</h2>
                  <p className="text-xs text-gray-400">How many guests will be joining?</p>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-4 items-center">
                <span className="text-sm font-bold text-gray-400 uppercase mr-2">Guests</span>
                <div className="flex items-center bg-gray-50 rounded-xl p-1 border border-gray-200">
                  <button 
                    type="button"
                    onClick={() => setPartySize(Math.max(1, partySize - 1))}
                    className="w-10 h-10 flex items-center justify-center text-gray-500 hover:bg-white hover:shadow-sm rounded-lg transition-all font-bold"
                  >
                    -
                  </button>
                  <span className="w-12 text-center font-bold text-lg text-dark">{partySize}</span>
                  <button 
                    type="button"
                    onClick={() => setPartySize(partySize + 1)}
                    className="w-10 h-10 flex items-center justify-center text-primary hover:bg-white hover:shadow-sm rounded-lg transition-all font-bold"
                  >
                    +
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 ml-auto">
                  {['Date Night', 'Business', 'Family', 'Birthday', 'Casual'].map((type) => (
                    <button
                      type="button"
                      key={type}
                      onClick={() => setOccasion(type)}
                      className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all border ${
                        occasion === type 
                          ? 'bg-primary text-white border-primary shadow-sm shadow-primary/20' 
                          : 'bg-white text-gray-600 border-gray-200 hover:border-primary/50'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Step 2: Date & Time */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-4 mb-6">
                <span className="w-8 h-8 rounded-full bg-orange-100 text-primary font-bold flex items-center justify-center shrink-0">2</span>
                <div>
                  <h2 className="text-xl font-bold text-dark">Date & Time</h2>
                  <p className="text-xs text-gray-400">Select when you would like to dine</p>
                </div>
              </div>

              {/* Date Quick Select & Custom Picker */}
              <div className="space-y-4 mb-6">
                <label className="block text-sm font-semibold text-gray-700">Reservation Date</label>
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedDate(getTodayDate())}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${
                      selectedDate === getTodayDate()
                        ? 'bg-primary text-white border-primary shadow-sm'
                        : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    Today
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedDate(getTomorrowDate())}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${
                      selectedDate === getTomorrowDate()
                        ? 'bg-primary text-white border-primary shadow-sm'
                        : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    Tomorrow
                  </button>
                  <div className="relative flex-1 min-w-[200px]">
                    <input
                      type="date"
                      min={getTodayDate()}
                      value={selectedDate}
                      onChange={e => setSelectedDate(e.target.value)}
                      required
                      className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                  </div>
                </div>
              </div>

              {/* Time Slots */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Available Time Slots</label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5">
                  {times.map((time) => (
                    <button
                      type="button"
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`py-2.5 rounded-xl text-sm font-bold transition-all border ${
                        selectedTime === time
                          ? 'bg-primary text-white border-primary shadow-md shadow-primary/20 scale-[1.02]'
                          : 'bg-gray-50 text-gray-700 border-gray-100 hover:border-primary/40 hover:bg-white'
                      }`}
                    >
                      {time.slice(0, 5)}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Step 3: Preferences & Seating */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-4 mb-6">
                <span className="w-8 h-8 rounded-full bg-orange-100 text-primary font-bold flex items-center justify-center shrink-0">3</span>
                <div>
                  <h2 className="text-xl font-bold text-dark">Preferences & Requests</h2>
                  <p className="text-xs text-gray-400">Customise your dining experience</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-bold text-dark mb-3">Seating Area</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setSeatingArea('Main Dining')}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        seatingArea === 'Main Dining'
                          ? 'border-primary bg-primary/5 text-primary font-bold shadow-sm'
                          : 'border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-sm">Main Dining</div>
                      <div className="text-[11px] text-gray-400 font-normal mt-0.5">Classic atmosphere</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSeatingArea('Patio / Terrace')}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        seatingArea === 'Patio / Terrace'
                          ? 'border-primary bg-primary/5 text-primary font-bold shadow-sm'
                          : 'border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-sm">Patio / Terrace</div>
                      <div className="text-[11px] text-gray-400 font-normal mt-0.5">Open air garden</div>
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-dark mb-3">Special Preferences</h3>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {tagsList.map(req => (
                      <button
                        type="button"
                        key={req}
                        onClick={() => toggleTag(req)}
                        className={`px-3 py-1 rounded-full text-xs font-semibold transition-all border ${
                          selectedTags.includes(req)
                            ? 'bg-primary text-white border-primary shadow-xs'
                            : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-primary/40'
                        }`}
                      >
                        {selectedTags.includes(req) ? `✓ ${req}` : `+ ${req}`}
                      </button>
                    ))}
                  </div>
                  <textarea 
                    placeholder="Specific dietary requirements, food allergies, or notes..." 
                    className="w-full h-20 bg-gray-50 rounded-xl border border-gray-200 p-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none resize-none"
                    value={specialNotes}
                    onChange={e => setSpecialNotes(e.target.value)}
                  ></textarea>
                </div>
              </div>
            </div>

            {/* Step 4: Contact Details */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-4 mb-6">
                <span className="w-8 h-8 rounded-full bg-orange-100 text-primary font-bold flex items-center justify-center shrink-0">4</span>
                <div>
                  <h2 className="text-xl font-bold text-dark">Contact Information</h2>
                  <p className="text-xs text-gray-400">Where we should send confirmation details</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Full Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. John Smith" 
                    required
                    className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none text-sm"
                    value={formData.customer_name}
                    onChange={e => setFormData({...formData, customer_name: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Email Address</label>
                    <input 
                      type="email" 
                      placeholder="e.g. john@example.com" 
                      required
                      className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none text-sm"
                      value={formData.customer_email}
                      onChange={e => setFormData({...formData, customer_email: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Phone Number</label>
                    <input 
                      type="tel" 
                      placeholder="e.g. +1 234 567 8900" 
                      required
                      className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none text-sm"
                      value={formData.customer_phone}
                      onChange={e => setFormData({...formData, customer_phone: e.target.value})}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Summary Box */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 sticky top-24 overflow-hidden">
              {/* Header Image */}
              <div className="h-36 bg-gray-200 relative">
                <img 
                  src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800" 
                  alt="Tartuca Restaurant Dining" 
                  className="w-full h-full object-cover" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex items-end p-6">
                  <div>
                    <span className="text-primary-light text-xs font-bold uppercase tracking-wider">Tartuca Fine Dining</span>
                    <h2 className="text-white font-bold text-xl">Reservation Summary</h2>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-5">
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-primary shrink-0">
                    <Calendar size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase mb-0.5">Date</p>
                    <p className="font-bold text-dark">{selectedDate}</p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-primary shrink-0">
                    <Clock size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase mb-0.5">Time</p>
                    <p className="font-bold text-dark">{selectedTime.slice(0, 5)}</p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-primary shrink-0">
                    <Users size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase mb-0.5">Party Size</p>
                    <p className="font-bold text-dark">{partySize} {partySize === 1 ? 'Guest' : 'Guests'}</p>
                  </div>
                </div>

                <div className="flex gap-4 items-start pb-5 border-b border-gray-100">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-primary shrink-0">
                    <Utensils size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase mb-0.5">Occasion & Area</p>
                    <p className="font-bold text-dark">{occasion} ({seatingArea})</p>
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={status === 'submitting'}
                  className="w-full bg-primary text-white py-3.5 rounded-xl font-bold hover:bg-primary-dark transition-all shadow-lg shadow-primary/25 flex items-center justify-center gap-2 disabled:opacity-70 active:scale-[0.98]"
                >
                  {status === 'submitting' ? 'Booking Table...' : (
                    <>Confirm Reservation <ChevronRight size={18} /></>
                  )}
                </button>
                
                <div className="flex items-center justify-center gap-4 text-[11px] text-gray-400 pt-1">
                  <span className="flex items-center gap-1"><Check size={12} className="text-green-500" /> Free Cancellation</span>
                  <span className="flex items-center gap-1"><Check size={12} className="text-green-500" /> Instant Confirmation</span>
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
