import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Mail, Lock, User, CheckCircle } from 'lucide-react';
import { registerUser } from '../services/api';

function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const { confirmPassword, ...dataToSend } = formData;
      await registerUser(dataToSend);
      navigate('/login');
    } catch (err) {
      console.error(err);
      setError('Registration failed. Please verify your details or use another email.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex w-full max-w-5xl glass-card rounded-3xl border border-white/10 shadow-2xl overflow-hidden relative min-h-[600px]">
      {/* Left Side - Image */}
      <div className="hidden lg:block w-1/2 relative bg-[#0F1117]">
        <img
          src="https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80&w=1200"
          alt="Restaurant Atmosphere"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
        <div className="absolute bottom-10 left-10 right-10 z-20 text-white">
          <span className="!text-amber-400 text-amber-400 text-xs font-bold uppercase tracking-widest block mb-1">
            Private Member Benefits
          </span>
          <h2 className="!text-white text-white text-2xl font-serif font-bold mb-2 drop-shadow-md">Welcome to the Tartuca Table</h2>
          <p className="text-xs !text-slate-200 text-slate-200 leading-relaxed font-normal drop-shadow-sm">
            Enjoy personalized tasting invitations, reservation priority, and seamless checkout for all your orders.
          </p>
        </div>
      </div>

      {/* Right Side - Content */}
      <div className="w-full lg:w-1/2 p-8 sm:p-12 flex flex-col justify-center">
        <div className="max-w-sm mx-auto w-full">
          <div className="mb-6 text-center flex flex-col items-center">
            <Link to="/" className="inline-flex items-center gap-2 mb-4 group">
              <div className="relative w-16 h-16">
                <img
                  src="/tartuca-favicon.png"
                  alt="Tartuca Emblem"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-3xl font-serif font-bold text-white">
                Tar<span className="text-[#C47A16]">tuca</span>
              </span>
            </Link>
            <h1 className="text-3xl font-serif font-bold text-white mb-1.5">Join The Club</h1>
            <p className="text-xs text-slate-400">Create an account for reservations and tasting deliveries.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {error && <div className="text-rose-400 text-xs bg-rose-500/10 p-3 rounded-xl border border-rose-500/20">{error}</div>}

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                <input
                  type="text"
                  name="full_name"
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-[#0E1015] rounded-xl border border-white/10 text-xs text-white focus:border-amber-400/60 focus:outline-none transition-all"
                  placeholder="Elena Rostova"
                  value={formData.full_name}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                <input
                  type="email"
                  name="email"
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-[#0E1015] rounded-xl border border-white/10 text-xs text-white focus:border-amber-400/60 focus:outline-none transition-all"
                  placeholder="elena@example.com"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                  <input
                    type="password"
                    name="password"
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-[#0E1015] rounded-xl border border-white/10 text-xs text-white focus:border-amber-400/60 focus:outline-none transition-all"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Confirm Password</label>
                <div className="relative">
                  <CheckCircle className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                  <input
                    type="password"
                    name="confirmPassword"
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-[#0E1015] rounded-xl border border-white/10 text-xs text-white focus:border-amber-400/60 focus:outline-none transition-all"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-bold py-3.5 rounded-xl shadow-lg shadow-amber-500/25 transition-all flex items-center justify-center gap-2 group text-xs uppercase tracking-wider disabled:opacity-70 disabled:cursor-not-allowed mt-2"
            >
              <span>{loading ? 'Creating Member Pass...' : 'Create Account'}</span>
              {!loading && <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-slate-500 text-xs">
              Already have an account?{' '}
              <Link to="/login" className="font-bold text-amber-400 hover:text-amber-300 transition-colors">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
