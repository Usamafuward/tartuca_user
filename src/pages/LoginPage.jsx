import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Mail, Lock, Sparkles } from 'lucide-react';
import { loginUser } from '../services/api';
import { useAuth } from '../context/AuthContext';

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await loginUser(formData);
      login(response.access_token);
      navigate('/');
    } catch (err) {
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex w-full max-w-5xl glass-card rounded-3xl border border-white/10 shadow-2xl overflow-hidden relative min-h-[600px]">
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 p-8 sm:p-12 flex flex-col justify-center">
        <div className="max-w-sm mx-auto w-full">
          <div className="mb-8">
            <Link to="/" className="inline-flex items-center gap-2 mb-6 group">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 flex items-center justify-center text-slate-950 font-serif font-black text-sm shadow-md">
                T
              </div>
              <span className="text-xl font-serif font-bold text-white">
                Tar<span className="text-amber-400">tuca</span>
              </span>
            </Link>
            <h1 className="text-3xl font-serif font-bold text-white mb-2">Welcome Back</h1>
            <p className="text-xs text-slate-400">Sign in to your Tartuca Dining Club account.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="text-rose-400 text-xs bg-rose-500/10 p-3 rounded-xl border border-rose-500/20">{error}</div>}

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                <input
                  type="email"
                  name="email"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-[#0E1015] rounded-xl border border-white/10 text-xs text-white focus:border-amber-400/60 focus:outline-none transition-all"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                <input
                  type="password"
                  name="password"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-[#0E1015] rounded-xl border border-white/10 text-xs text-white focus:border-amber-400/60 focus:outline-none transition-all"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-bold py-3.5 rounded-xl shadow-lg shadow-amber-500/25 transition-all flex items-center justify-center gap-2 group text-xs uppercase tracking-wider disabled:opacity-70 disabled:cursor-not-allowed mt-2"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
              {!loading && <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-slate-500 text-xs">
              Don't have an account?{' '}
              <Link to="/register" className="font-bold text-amber-400 hover:text-amber-300 transition-colors">
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Image */}
      <div className="hidden lg:block w-1/2 relative bg-[#0F1117]">
        <img 
          src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=1200" 
          alt="Artisanal Dining" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
        <div className="absolute bottom-10 left-10 right-10 z-20 text-white">
          <span className="!text-amber-400 text-amber-400 text-xs font-bold uppercase tracking-widest block mb-1">
            Italian Hospitality
          </span>
          <h2 className="!text-white text-white text-2xl font-serif font-bold mb-2 drop-shadow-md">Welcome to Tartuca</h2>
          <p className="text-xs !text-slate-200 text-slate-200 leading-relaxed font-normal drop-shadow-sm">
            Track your delivery orders, manage table reservations, and easily reorder your favourite Italian dishes.
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
