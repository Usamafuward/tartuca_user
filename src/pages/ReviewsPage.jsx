import { useState, useEffect } from 'react';
import { Star, ThumbsUp, Send, CheckCircle2, ShieldCheck, Sparkles, LogIn, MessageSquare } from 'lucide-react';
import { fetchReviews, createReview, fetchUserProfile } from '../services/api';
import { Skeleton, ReviewSkeleton } from '../components/common/Skeleton';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Link } from 'react-router-dom';

function ReviewsPage() {
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast?.() || { showToast: () => {} };
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '', name: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submittedNotice, setSubmittedNotice] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadReviews();
    const token = localStorage.getItem('token');
    if (token) {
      fetchUserProfile(token)
        .then(profile => {
          if (profile && profile.full_name) {
            setNewReview(prev => ({ ...prev, name: profile.full_name }));
          }
        })
        .catch(() => {});
    }
  }, []);

  const getInitials = (name = '') => {
    const clean = name.trim();
    if (!clean) return 'TP';
    const parts = clean.split(/\s+/).filter(Boolean);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const loadReviews = async () => {
    try {
      const data = await fetchReviews().catch(() => []);
      const mappedReviews = data.map(review => ({
        id: review.id,
        name: review.author_name || "Tartuca Patron",
        date: review.created_at ? new Date(review.created_at).toLocaleDateString() : 'Recent Guest',
        rating: review.rating || 5,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(review.author_name || 'Guest')}&background=151821&color=F59E0B`,
        content: review.comment
      }));
      setReviews(mappedReviews);
    } catch (error) {
      console.error('Failed to load reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      if (showToast) showToast("Please login to share your dining experience.", "error");
      return;
    }
    
    setSubmitting(true);
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      await createReview(token, {
        author_name: newReview.name || "Happy Patron",
        rating: newReview.rating,
        comment: newReview.comment
      });
      
      setNewReview(prev => ({ rating: 5, comment: '', name: prev.name }));
      setSubmittedNotice(true);
      loadReviews();
      if (showToast) showToast("Review submitted! Thank you for your feedback.", "success");
    } catch (err) {
      console.error(err);
      if (showToast) showToast('Failed to submit review', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const averageRating = reviews.length > 0
    ? (reviews.reduce((acc, r) => acc + (r.rating || 5), 0) / reviews.length).toFixed(1)
    : '4.9';

  const getRatingPercentage = (star) => {
    if (reviews.length === 0) return star === 5 ? 100 : 0;
    const count = reviews.filter(r => Math.round(r.rating) === star).length;
    return Math.round((count / reviews.length) * 100);
  };

  return (
    <div className="min-h-screen py-10 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider mb-4">
            <Sparkles size={13} /> Customer Reviews
          </div>
          <h1 className="text-4xl sm:text-5xl font-serif font-bold text-white tracking-tight mb-4">
            What Our Diners Say
          </h1>
          <p className="text-slate-400 text-sm leading-relaxed">
            Read genuine reviews from guests who have dined with us or ordered for delivery.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Summary Card & Write Review Column */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Score Breakdown Card */}
            <div className="glass-card p-6 sm:p-8 rounded-3xl border border-white/10">
              <div className="text-center mb-6">
                <div className="text-6xl font-serif font-bold text-white mb-2">{averageRating}</div>
                <div className="flex justify-center gap-1.5 mb-2 text-amber-400">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} size={22} fill="currentColor" strokeWidth={0} />
                  ))}
                </div>
                <p className="text-slate-400 text-xs font-medium">
                  Based on {reviews.length} authentic dining reviews
                </p>
              </div>

              {/* Progress bars */}
              <div className="space-y-2.5">
                {[5, 4, 3, 2, 1].map((rating) => (
                  <div key={rating} className="flex items-center gap-3">
                    <span className="text-xs font-bold text-slate-400 w-3 font-mono">{rating}</span>
                    <div className="flex-1 h-2 bg-white/[0.06] rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full transition-all duration-500" 
                        style={{ width: `${getRatingPercentage(rating)}%` }}
                      />
                    </div>
                    <span className="text-[11px] text-slate-400 w-9 text-right font-mono font-medium">
                      {getRatingPercentage(rating)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Write Review Card */}
            {isAuthenticated ? (
              <div className="glass-card p-6 sm:p-8 rounded-3xl border border-white/10">
                <h3 className="text-lg font-serif font-bold text-white mb-1">Write a Review</h3>
                <p className="text-xs text-slate-400 mb-4">Share your dining experience at Tartuca</p>

                {submittedNotice && (
                  <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs mb-4 flex items-start gap-2.5 animate-in fade-in">
                    <CheckCircle2 size={16} className="text-amber-400 shrink-0 mt-0.5" />
                    <span>Your testimonial has been received and will be published following moderation.</span>
                  </div>
                )}

                {error && <p className="text-rose-400 text-xs mb-3">{error}</p>}
                
                <form onSubmit={handleSubmitReview} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5">Your Name</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-2.5 bg-[#0E1015] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400/60"
                      placeholder="e.g. Marcella Hazan"
                      required
                      value={newReview.name || ''}
                      onChange={(e) => setNewReview({...newReview, name: e.target.value})}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5">Rating Experience</label>
                    <div className="flex gap-1.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setNewReview({...newReview, rating: star})}
                          className="focus:outline-none transition-transform hover:scale-110 p-1"
                        >
                          <Star 
                            size={24} 
                            fill={star <= newReview.rating ? "currentColor" : "none"}
                            className={star <= newReview.rating ? "text-amber-400 fill-amber-400" : "text-white/20"} 
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5">Your Review</label>
                    <textarea 
                      rows="4"
                      className="w-full px-4 py-2.5 bg-[#0E1015] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400/60 resize-none"
                      placeholder="Tell us about the woodfire dishes, wine pairing, or dining ambiance..."
                      required
                      value={newReview.comment}
                      onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                    />
                  </div>

                  <button 
                    type="submit" 
                    disabled={submitting}
                    className="w-full bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-extrabold py-3 rounded-xl text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md shadow-amber-500/20 disabled:opacity-50"
                  >
                    <Send size={14} />
                    <span>{submitting ? 'Submitting...' : 'Post Testimonial'}</span>
                  </button>
                </form>
              </div>
            ) : (
              <div className="glass-card p-6 rounded-3xl border border-white/10 text-center">
                <MessageSquare size={32} className="mx-auto text-amber-400 mb-3" />
                <h4 className="font-serif font-bold text-white text-base mb-1">Dined With Us?</h4>
                <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                  Sign in to leave a verified review and earn dining club loyalty privileges.
                </p>
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-md shadow-amber-500/20 hover:bg-amber-400 transition-all"
                >
                  <LogIn size={14} />
                  <span>Sign In To Review</span>
                </Link>
              </div>
            )}

          </div>

          {/* Reviews List */}
          <div className="lg:col-span-2 space-y-4">
            {loading ? (
              <ReviewSkeleton count={3} />
            ) : reviews.length === 0 ? (
              <div className="glass-card p-12 rounded-3xl border border-white/10 text-center text-slate-400">
                <p className="text-sm">Be the first to share an accolade for Tartuca.</p>
              </div>
            ) : (
              reviews.map((r) => (
                <div 
                  key={r.id} 
                  className="glass-card p-6 sm:p-8 rounded-3xl border border-white/10 hover:border-amber-500/30 transition-all duration-300 shadow-sm"
                >
                  <div className="flex items-center justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3.5">
                      <div className="w-11 h-11 rounded-full bg-linear-to-br from-amber-400 via-amber-500 to-amber-600 text-slate-950 font-serif font-black text-sm flex items-center justify-center shrink-0 shadow-md shadow-amber-500/20 border border-amber-300/40">
                        {getInitials(r.name)}
                      </div>
                      <div>
                        <h4 className="font-serif font-bold text-white text-base">{r.name}</h4>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[11px] text-emerald-400 flex items-center gap-1 font-semibold">
                            <ShieldCheck size={13} /> Verified Patron
                          </span>
                          <span className="text-slate-600 text-xs">•</span>
                          <span className="text-[11px] text-slate-500">{r.date}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-1 text-amber-400">
                      {Array.from({ length: r.rating || 5 }).map((_, i) => (
                        <Star key={i} size={14} fill="currentColor" strokeWidth={0} />
                      ))}
                    </div>
                  </div>

                  <p className="text-slate-300 text-xs sm:text-sm leading-relaxed italic font-normal">
                    "{r.content}"
                  </p>
                </div>
              ))
            )}
          </div>

        </div>

      </div>
    </div>
  );
}

export default ReviewsPage;