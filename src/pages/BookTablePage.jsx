import { useState, useEffect } from 'react';
import { 
  Calendar, Clock, Users, Check, ChevronRight, Utensils, 
  Sparkles, AlertCircle, ShieldCheck, Flame, Leaf, User, Mail, Phone 
} from 'lucide-react';
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

  const formatDisplayDate = (dateStr) => {
    if (!dateStr) return '';
    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        const d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
        return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
      }
      return dateStr;
    } catch {
      return dateStr;
    }
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
  const tagsList = ['Window View', 'Quiet Corner', 'Romantic Setting', 'Booth Preferred', 'High Chair Needed'];

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
      setErrorMessage(error.message || "Unable to complete reservation. Please select an alternate slot or verify details.");
      setStatus('error');
    }
  };

  if (status === 'success' && confirmedBooking) {
    return (
      <div className="min-h-[80vh] pt-12 sm:pt-16 pb-20 sm:pb-24 flex items-center justify-center px-4">
        <div className="glass-card p-8 sm:p-12 rounded-3xl shadow-2xl max-w-lg w-full text-center border border-amber-500/30 animate-in fade-in zoom-in duration-300">
          <div className="w-20 h-20 bg-amber-500/15 text-amber-400 rounded-full flex items-center justify-center mx-auto mb-6 border border-amber-500/30 shadow-lg shadow-amber-500/20">
            <Check size={40} className="stroke-[2.5]" />
          </div>
          <span className="text-amber-400 font-bold text-xs uppercase tracking-[0.2em] mb-2 block">
            Table Reserved
          </span>
          <h2 className="text-3xl font-serif font-bold text-white mb-2">Reservation Confirmed!</h2>
          <p className="text-slate-400 mb-8 text-xs sm:text-sm leading-relaxed">
            Our team looks forward to welcoming you to Tartuca.
          </p>

          <div className="bg-white/[0.03] rounded-2xl p-6 mb-8 text-left space-y-3.5 border border-white/[0.08]">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500 uppercase tracking-wider font-semibold">Booking ID</span>
              <span className="font-mono font-bold text-amber-400">#{confirmedBooking.id}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500 uppercase tracking-wider font-semibold">Date</span>
              <span className="font-semibold text-white">{confirmedBooking.reservation_date}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500 uppercase tracking-wider font-semibold">Seating Time</span>
              <span className="font-semibold text-white">
                {confirmedBooking.reservation_time ? confirmedBooking.reservation_time.slice(0, 5) : selectedTime.slice(0, 5)}
              </span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500 uppercase tracking-wider font-semibold">Party</span>
              <span className="font-semibold text-white">{confirmedBooking.party_size} Guests</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500 uppercase tracking-wider font-semibold">Primary Guest</span>
              <span className="font-semibold text-white">{confirmedBooking.customer_name}</span>
            </div>
            <div className="flex justify-between items-center text-xs pt-2 border-t border-white/[0.06]">
              <span className="text-slate-500 uppercase tracking-wider font-semibold">Status</span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30 capitalize">
                {confirmedBooking.status || 'Confirmed'}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link 
              to="/profile" 
              className="flex-1 bg-gradient-to-r from-amber-400 to-amber-600 text-slate-950 py-3.5 rounded-xl font-extrabold hover:from-amber-300 hover:to-amber-500 transition-all shadow-md shadow-amber-500/20 text-center text-xs uppercase tracking-wider"
            >
              View In Profile
            </Link>
            <button 
              onClick={() => {
                setStatus('idle');
                setConfirmedBooking(null);
              }} 
              className="flex-1 bg-white/[0.05] border border-white/10 text-slate-200 py-3.5 rounded-xl font-bold hover:bg-white/[0.1] transition-all text-xs uppercase tracking-wider"
            >
              Reserve Another Table
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-8 sm:pt-10 pb-20 sm:pb-24 relative">
      <LoadingOverlay isVisible={status === 'submitting'} text="Confirming your table reservation..." />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="mb-10 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles size={13} /> Table Reservations
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-white tracking-tight">
            Reserve a Table
          </h1>
          <p className="text-slate-400 text-sm mt-2 max-w-xl">
            Book your table online for lunch or dinner. We look forward to serving you.
          </p>
        </div>

        {errorMessage && (
          <div className="mb-8 p-4 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 flex items-center gap-3 animate-in fade-in">
            <AlertCircle size={20} className="shrink-0 text-rose-400" />
            <span className="text-xs sm:text-sm font-medium">{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-8">
          
          {/* Left Column - Steps */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Step 1: Party Size & Occasion */}
            <div className="glass-card p-6 sm:p-8 rounded-3xl border border-stone-200/80 dark:border-white/10 shadow-sm">
              <div className="flex items-center gap-4 mb-6">
                <span className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 font-serif font-bold flex items-center justify-center shrink-0 border border-amber-500/30">
                  1
                </span>
                <div>
                  <h2 className="text-lg sm:text-xl font-serif font-bold text-stone-900 dark:text-white">Party Size & Occasion</h2>
                  <p className="text-xs text-stone-500 dark:text-slate-400">Select guest count and the dining mood</p>
                </div>
              </div>
              
              <div className="space-y-6">
                {/* Party Size Selector */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-slate-300 mb-3">
                    Select Guest Count
                  </label>
                  <div className="flex flex-wrap items-center gap-3">
                    {/* Stepper */}
                    <div className="flex items-center bg-stone-100 dark:bg-[#0E1015] rounded-xl p-1 border border-stone-300/90 dark:border-white/10 shadow-inner">
                      <button 
                        type="button"
                        onClick={() => setPartySize(Math.max(1, partySize - 1))}
                        className="w-10 h-10 flex items-center justify-center text-stone-800 dark:text-slate-200 hover:text-stone-950 dark:hover:text-white hover:bg-stone-200 dark:hover:bg-white/[0.08] rounded-lg transition-all font-bold text-lg"
                        aria-label="Decrease guest count"
                      >
                        -
                      </button>
                      <span className="w-24 text-center font-bold text-sm sm:text-base text-stone-900 dark:text-white font-sans">
                        {partySize} {partySize === 1 ? 'Guest' : 'Guests'}
                      </span>
                      <button 
                        type="button"
                        onClick={() => setPartySize(partySize + 1)}
                        className="w-10 h-10 flex items-center justify-center text-amber-600 dark:text-amber-400 hover:text-amber-500 hover:bg-stone-200 dark:hover:bg-white/[0.08] rounded-lg transition-all font-bold text-lg"
                        aria-label="Increase guest count"
                      >
                        +
                      </button>
                    </div>

                    {/* Quick Preset Pills */}
                    <div className="flex flex-wrap gap-1.5 items-center">
                      {[1, 2, 4, 6, 8].map((count) => (
                        <button
                          type="button"
                          key={count}
                          onClick={() => setPartySize(count)}
                          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all border ${
                            partySize === count
                              ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-md shadow-amber-500/20'
                              : 'bg-stone-100 hover:bg-stone-200/70 text-stone-700 hover:text-stone-950 border-stone-300/80 dark:bg-white/[0.04] dark:hover:bg-white/[0.08] dark:text-slate-300 dark:hover:text-white dark:border-white/10'
                          }`}
                        >
                          {count} {count === 1 ? 'Guest' : 'Guests'}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Occasion Selector */}
                <div className="pt-5 border-t border-stone-200/80 dark:border-white/[0.08]">
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-slate-300 mb-3">
                    Dining Occasion
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {['Date Night', 'Business Dinner', 'Anniversary', 'Family Celebration', 'Casual Tasting'].map((type) => (
                      <button
                        type="button"
                        key={type}
                        onClick={() => setOccasion(type)}
                        className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all border ${
                          occasion === type 
                            ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-md shadow-amber-500/20' 
                            : 'bg-stone-100 hover:bg-stone-200/70 text-stone-700 hover:text-stone-950 border-stone-300/80 dark:bg-white/[0.04] dark:hover:bg-white/[0.08] dark:text-slate-300 dark:hover:text-white dark:border-white/10'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2: Date & Available Times */}
            <div className="glass-card p-6 sm:p-8 rounded-3xl border border-stone-200/80 dark:border-white/10 shadow-sm">
              <div className="flex items-center gap-4 mb-6">
                <span className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 font-serif font-bold flex items-center justify-center shrink-0 border border-amber-500/30">
                  2
                </span>
                <div>
                  <h2 className="text-lg sm:text-xl font-serif font-bold text-stone-900 dark:text-white">Date & Seating Slot</h2>
                  <p className="text-xs text-stone-500 dark:text-slate-400">Choose when you would like to be seated</p>
                </div>
              </div>

              {/* Date Quick Buttons & Picker */}
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-slate-300 mb-3">
                    Reservation Date
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => setSelectedDate(getTodayDate())}
                      className={`py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all text-center ${
                        selectedDate === getTodayDate()
                          ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-sm'
                          : 'bg-stone-100 hover:bg-stone-200/70 text-stone-700 hover:text-stone-950 border-stone-300/80 dark:bg-white/[0.04] dark:hover:bg-white/[0.08] dark:text-slate-300 dark:hover:text-white dark:border-white/10'
                      }`}
                    >
                      Today
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedDate(getTomorrowDate())}
                      className={`py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all text-center ${
                        selectedDate === getTomorrowDate()
                          ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-sm'
                          : 'bg-stone-100 hover:bg-stone-200/70 text-stone-700 hover:text-stone-950 border-stone-300/80 dark:bg-white/[0.04] dark:hover:bg-white/[0.08] dark:text-slate-300 dark:hover:text-white dark:border-white/10'
                      }`}
                    >
                      Tomorrow
                    </button>
                    <div className="relative">
                      <input
                        type="date"
                        min={getTodayDate()}
                        value={selectedDate}
                        onChange={e => setSelectedDate(e.target.value)}
                        required
                        className="w-full h-full py-2.5 px-4 bg-stone-100 dark:bg-[#0E1015] border border-stone-300/90 dark:border-white/10 rounded-xl text-xs text-stone-900 dark:text-white font-semibold focus:outline-none focus:border-amber-500 cursor-pointer shadow-inner"
                      />
                    </div>
                  </div>
                </div>

                {/* Seating Times */}
                <div className="pt-5 border-t border-stone-200/80 dark:border-white/[0.08]">
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-slate-300">
                      Available Service Times (Dinner)
                    </label>
                    <span className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold">90-minute dining duration</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                    {times.map((time) => (
                      <button
                        type="button"
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        className={`py-3 rounded-xl text-xs font-bold font-mono transition-all border ${
                          selectedTime === time
                            ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-md shadow-amber-500/25 scale-[1.02]'
                            : 'bg-stone-100 hover:bg-stone-200/70 text-stone-800 hover:text-stone-950 border-stone-300/80 dark:bg-white/[0.04] dark:hover:bg-white/[0.08] dark:text-slate-300 dark:hover:text-white dark:border-white/10'
                        }`}
                      >
                        {time.slice(0, 5)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3: Atmosphere & Special Requests */}
            <div className="glass-card p-6 sm:p-8 rounded-3xl border border-stone-200/80 dark:border-white/10 shadow-sm">
              <div className="flex items-center gap-4 mb-6">
                <span className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 font-serif font-bold flex items-center justify-center shrink-0 border border-amber-500/30">
                  3
                </span>
                <div>
                  <h2 className="text-lg sm:text-xl font-serif font-bold text-stone-900 dark:text-white">Atmosphere & Special Requests</h2>
                  <p className="text-xs text-stone-500 dark:text-slate-400">Tailor your location and dietary requirements</p>
                </div>
              </div>

              <div className="space-y-6">
                {/* Seating Location Cards */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-slate-300 mb-3">
                    Seating Area & Ambiance
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-3.5">
                    <button
                      type="button"
                      onClick={() => setSeatingArea('Main Dining')}
                      className={`p-4 rounded-2xl border text-left transition-all ${
                        seatingArea === 'Main Dining'
                          ? 'border-amber-500 bg-amber-500/15 dark:bg-amber-500/10 shadow-sm ring-1 ring-amber-500/30'
                          : 'border-stone-300/80 dark:border-white/10 bg-stone-100/70 dark:bg-white/[0.03] hover:border-amber-500/40'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="text-sm font-bold text-stone-900 dark:text-white flex items-center gap-2">
                          <Flame size={16} className="text-amber-600 dark:text-amber-400" />
                          <span>Main Indoor Dining (AC)</span>
                        </div>
                        {seatingArea === 'Main Dining' && (
                          <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center text-xs font-bold">✓</span>
                        )}
                      </div>
                      <div className="text-xs text-stone-600 dark:text-slate-400 font-normal">
                        Comfortable air-conditioned indoor seating with a view of our woodfired pizza oven
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSeatingArea('Patio / Terrace')}
                      className={`p-4 rounded-2xl border text-left transition-all ${
                        seatingArea === 'Patio / Terrace'
                          ? 'border-amber-500 bg-amber-500/15 dark:bg-amber-500/10 shadow-sm ring-1 ring-amber-500/30'
                          : 'border-stone-300/80 dark:border-white/10 bg-stone-100/70 dark:bg-white/[0.03] hover:border-amber-500/40'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="text-sm font-bold text-stone-900 dark:text-white flex items-center gap-2">
                          <Leaf size={16} className="text-emerald-600 dark:text-emerald-400" />
                          <span>Garden Terrace (Outdoor)</span>
                        </div>
                        {seatingArea === 'Patio / Terrace' && (
                          <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center text-xs font-bold">✓</span>
                        )}
                      </div>
                      <div className="text-xs text-stone-600 dark:text-slate-400 font-normal">
                        Relaxing outdoor garden terrace seating, pleasant for warm evening dining
                      </div>
                    </button>
                  </div>
                </div>

                {/* Table Preferences Tags */}
                <div className="pt-5 border-t border-stone-200/80 dark:border-white/[0.08]">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-slate-300 mb-3">
                    Table Preferences (Optional)
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {tagsList.map(req => {
                      const isChecked = selectedTags.includes(req);
                      return (
                        <button
                          type="button"
                          key={req}
                          onClick={() => toggleTag(req)}
                          className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all border flex items-center gap-1.5 ${
                            isChecked
                              ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-sm font-bold'
                              : 'bg-stone-100 hover:bg-stone-200/70 text-stone-700 hover:text-stone-950 border-stone-300/80 dark:bg-white/[0.04] dark:hover:bg-white/[0.08] dark:text-slate-300 dark:hover:text-white dark:border-white/10'
                          }`}
                        >
                          <span>{isChecked ? '✓' : '+'}</span>
                          <span>{req}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Special Requests Textarea */}
                <div className="pt-5 border-t border-stone-200/80 dark:border-white/[0.08]">
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-slate-300 mb-2">
                    Dietary Requirements & Notes for the Kitchen
                  </label>
                  <textarea 
                    placeholder="e.g. Celebrating a milestone anniversary; one guest has a shellfish allergy; prefer high table if available..." 
                    className="w-full h-24 bg-stone-100 dark:bg-[#0E1015] rounded-2xl border border-stone-300/90 dark:border-white/10 p-3.5 text-xs text-stone-900 dark:text-white placeholder:text-stone-400 dark:placeholder:text-slate-500 focus:border-amber-500 focus:outline-none resize-none shadow-inner font-normal"
                    value={specialNotes}
                    onChange={e => setSpecialNotes(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Step 4: Contact Information */}
            <div className="glass-card p-6 sm:p-8 rounded-3xl border border-stone-200/80 dark:border-white/10 shadow-sm">
              <div className="flex items-center gap-4 mb-6">
                <span className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 font-serif font-bold flex items-center justify-center shrink-0 border border-amber-500/30">
                  4
                </span>
                <div>
                  <h2 className="text-lg sm:text-xl font-serif font-bold text-stone-900 dark:text-white">Lead Guest Information</h2>
                  <p className="text-xs text-stone-500 dark:text-slate-400">Where we send SMS & email booking confirmation</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-slate-300 mb-1.5">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-500 dark:text-slate-400" size={16} />
                    <input 
                      type="text" 
                      placeholder="e.g. Kasun Perera" 
                      required
                      className="w-full pl-10 pr-4 py-3 bg-stone-100 dark:bg-[#0E1015] rounded-xl border border-stone-300/90 dark:border-white/10 text-xs text-stone-900 dark:text-white placeholder:text-stone-400 dark:placeholder:text-slate-500 focus:border-amber-500 focus:outline-none shadow-inner font-medium"
                      value={formData.customer_name}
                      onChange={e => setFormData({...formData, customer_name: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-slate-300 mb-1.5">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-500 dark:text-slate-400" size={16} />
                      <input 
                        type="email" 
                        placeholder="e.g. kasun@example.com" 
                        required
                        className="w-full pl-10 pr-4 py-3 bg-stone-100 dark:bg-[#0E1015] rounded-xl border border-stone-300/90 dark:border-white/10 text-xs text-stone-900 dark:text-white placeholder:text-stone-400 dark:placeholder:text-slate-500 focus:border-amber-500 focus:outline-none shadow-inner font-medium"
                        value={formData.customer_email}
                        onChange={e => setFormData({...formData, customer_email: e.target.value})}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-slate-300 mb-1.5">
                      Mobile Phone Number *
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-500 dark:text-slate-400" size={16} />
                      <input 
                        type="tel" 
                        placeholder="e.g. +94 77 123 4567" 
                        required
                        className="w-full pl-10 pr-4 py-3 bg-stone-100 dark:bg-[#0E1015] rounded-xl border border-stone-300/90 dark:border-white/10 text-xs text-stone-900 dark:text-white placeholder:text-stone-400 dark:placeholder:text-slate-500 focus:border-amber-500 focus:outline-none shadow-inner font-medium"
                        value={formData.customer_phone}
                        onChange={e => setFormData({...formData, customer_phone: e.target.value})}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column - Booking Summary Box */}
          <div className="lg:col-span-1">
            <div className="glass-card rounded-3xl border border-stone-200/80 dark:border-white/10 sticky top-6 overflow-hidden shadow-2xl space-y-0">
              
              {/* Header Visual Banner */}
              <div className="h-44 bg-[#0E1015] relative overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800" 
                  alt="Tartuca Dining Atmosphere" 
                  className="w-full h-full object-cover" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-transparent flex items-end p-6 z-10">
                  <div>
                    <span className="!text-amber-400 text-amber-400 text-[10px] font-extrabold uppercase tracking-widest block mb-0.5">
                      Tartuca Dining
                    </span>
                    <h2 className="!text-white text-white font-serif font-bold text-xl drop-shadow-md">Reservation Summary</h2>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div className="flex gap-3.5 items-center">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
                    <Calendar size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-stone-500 dark:text-slate-400 uppercase tracking-wider">Date</p>
                    <p className="font-bold text-stone-900 dark:text-white text-xs sm:text-sm">
                      {formatDisplayDate(selectedDate)}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3.5 items-center">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
                    <Clock size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-stone-500 dark:text-slate-400 uppercase tracking-wider">Seating Time</p>
                    <p className="font-bold text-stone-900 dark:text-white text-xs sm:text-sm">
                      {selectedTime.slice(0, 5)} (Dinner Service)
                    </p>
                  </div>
                </div>

                <div className="flex gap-3.5 items-center">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
                    <Users size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-stone-500 dark:text-slate-400 uppercase tracking-wider">Party Size</p>
                    <p className="font-bold text-stone-900 dark:text-white text-xs sm:text-sm">{partySize} {partySize === 1 ? 'Guest' : 'Guests'}</p>
                  </div>
                </div>

                <div className="flex gap-3.5 items-center pb-4 border-b border-stone-200/80 dark:border-white/[0.08]">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
                    <Utensils size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-stone-500 dark:text-slate-400 uppercase tracking-wider">Occasion & Area</p>
                    <p className="font-bold text-stone-900 dark:text-white text-xs sm:text-sm">{occasion} • {seatingArea}</p>
                  </div>
                </div>

                {/* Reservation Notes */}
                <div className="p-3.5 rounded-2xl bg-amber-500/[0.08] border border-amber-500/25 text-xs space-y-2">
                  <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-bold uppercase tracking-wider text-[10px]">
                    <Sparkles size={13} /> Reservation Information
                  </div>
                  <ul className="text-[11px] text-stone-700 dark:text-slate-300 space-y-1 font-medium">
                    <li className="flex items-center gap-1.5">
                      <Check size={12} className="text-emerald-600 dark:text-emerald-400 shrink-0 stroke-[2.5]" />
                      <span>Complimentary bread basket & olive oil</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Check size={12} className="text-emerald-600 dark:text-emerald-400 shrink-0 stroke-[2.5]" />
                      <span>Indoor AC & outdoor terrace seating options</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Check size={12} className="text-emerald-600 dark:text-emerald-400 shrink-0 stroke-[2.5]" />
                      <span>15-minute table hold grace period</span>
                    </li>
                  </ul>
                </div>

                <button 
                  type="submit"
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-amber-500/25 transition-all duration-200 hover:scale-[1.01] active:scale-95 flex items-center justify-center gap-2"
                >
                  <Sparkles size={15} className="stroke-[2.5]" />
                  <span>Confirm Table Reservation</span>
                </button>

                <p className="text-[10px] text-stone-600 dark:text-slate-400 text-center leading-relaxed flex items-center justify-center gap-1 pt-1 font-medium">
                  <ShieldCheck size={13} className="text-amber-600 dark:text-amber-400" /> Instant confirmation. No cancellation fee.
                </p>
              </div>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
}

export default BookTablePage;
