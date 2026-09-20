import { useState, useEffect } from 'react';
import { Star, ThumbsUp, MessageCircle, Send, CheckCircle2 } from 'lucide-react';
import { fetchReviews, createReview, fetchUserProfile } from '../services/api';
import { Skeleton, ReviewSkeleton } from '../components/common/Skeleton';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

function ReviewsPage() {
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();
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

  const loadReviews = async () => {
    try {
      const data = await fetchReviews();
      const mappedReviews = data.map(review => ({
        id: review.id,
        name: review.author_name || "Anonymous Guest",
        date: new Date(review.created_at).toLocaleDateString(),
        rating: review.rating,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(review.author_name || "Guest")}&background=random`,
        content: review.comment,
        likes: 0,
        replies: 0
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
        showToast("Please login to submit a review.", "error");
        return;
    }
    
    setSubmitting(true);
    setError('');
    
    try {
        const token = localStorage.getItem('token');
        await createReview(token, {
            author_name: newReview.name || "Happy Customer",
            rating: newReview.rating,
            comment: newReview.comment
        });
        
        setNewReview(prev => ({ rating: 5, comment: '', name: prev.name }));
        setSubmittedNotice(true);
        loadReviews();
        showToast("Review submitted successfully! It will appear once approved.", "success");
    } catch (err) {
        console.error(err);
        showToast('Failed to submit review', 'error');
    } finally {
        setSubmitting(false);
    }
  };

  const averageRating = reviews.length > 0
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : '5.0';

  const getRatingPercentage = (star) => {
    if (reviews.length === 0) return star === 5 ? 100 : 0;
    const count = reviews.filter(r => Math.round(r.rating) === star).length;
    return Math.round((count / reviews.length) * 100);
  };

  if (loading) {
      return (
        <div className="bg-light min-h-screen py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <Skeleton className="h-10 w-64 mx-auto mb-4 rounded-lg" />
                    <Skeleton className="h-4 w-96 mx-auto rounded-md" />
                </div>
                <div className="grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1">
                        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 h-64 relative overflow-hidden">
                            <Skeleton className="h-8 w-32 mb-6 rounded-md" />
                            <Skeleton className="h-16 w-24 mb-4 rounded-lg" />
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-full rounded-md" />
                                <Skeleton className="h-4 w-3/4 rounded-md" />
                            </div>
                        </div>
                    </div>
                    <div className="lg:col-span-2">
                        <ReviewSkeleton count={3} />
                    </div>
                </div>
            </div>
        </div>
      );
  }

  return (
    <div className="bg-light min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-dark mb-4">Customer Reviews</h1>
          <p className="text-gray-500 max-w-2xl mx-auto">
            See what our guests are saying about their experience at Tartuca.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Summary Card & Write Review */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <div className="text-center mb-6">
                <div className="text-6xl font-bold text-dark mb-2">{averageRating}</div>
                <div className="flex justify-center gap-1 mb-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} size={24} className="text-secondary fill-secondary" />
                  ))}
                </div>
                <p className="text-gray-400 text-sm">Based on {reviews.length} verified reviews</p>
              </div>

              <div className="space-y-3 mb-2">
                {[5, 4, 3, 2, 1].map((rating) => (
                  <div key={rating} className="flex items-center gap-3">
                    <span className="text-sm font-bold text-gray-500 w-3">{rating}</span>
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-secondary rounded-full transition-all duration-500" 
                        style={{ width: `${getRatingPercentage(rating)}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-400 w-8 text-right font-medium">{getRatingPercentage(rating)}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Write Review Form */}
            {isAuthenticated ? (
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                    <h3 className="text-xl font-bold text-dark mb-1">Write a Review</h3>
                    <p className="text-xs text-gray-400 mb-4">Share your feedback with the Tartuca community</p>

                    {submittedNotice && (
                        <div className="p-4 rounded-2xl bg-green-50 border border-green-200 text-green-800 text-xs mb-4 flex items-start gap-2.5">
                            <CheckCircle2 size={16} className="text-green-600 shrink-0 mt-0.5" />
                            <span>Thank you! Your review has been submitted for moderation and will appear publicly once approved.</span>
                        </div>
                    )}

                    {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                    <form onSubmit={handleSubmitReview} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Display Name</label>
                            <input 
                                type="text" 
                                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
                                placeholder="Your Name"
                                required
                                value={newReview.name || ''}
                                onChange={(e) => setNewReview({...newReview, name: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                            <div className="flex gap-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setNewReview({...newReview, rating: star})}
                                        className="focus:outline-none transition-transform hover:scale-110"
                                    >
                                        <Star 
                                            size={24} 
                                            className={star <= newReview.rating ? "text-secondary fill-secondary" : "text-gray-300"} 
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Comment</label>
                            <textarea 
                                rows="4"
                                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                                placeholder="Share your experience..."
                                required
                                value={newReview.comment}
                                onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                            ></textarea>
                        </div>
                        <button 
                            type="submit" 
                            disabled={submitting}
                            className="w-full bg-primary text-white font-bold py-3 rounded-xl hover:bg-primary-dark transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
                        >
                            {submitting ? 'Submitting...' : 'Submit Review'}
                            {!submitting && <Send size={18} />}
                        </button>
                    </form>
                </div>
            ) : (
                <div className="bg-primary/5 p-8 rounded-3xl border border-primary/10 text-center">
                    <h3 className="font-bold text-dark mb-2">Have you dined with us?</h3>
                    <p className="text-gray-500 mb-4 text-sm">Log in to share your experience and help others.</p>
                    <a href="/login" className="inline-block bg-primary text-white font-bold py-2 px-6 rounded-xl hover:bg-primary-dark transition-colors">
                        Login to Review
                    </a>
                </div>
            )}
          </div>

          {/* Reviews List */}
          <div className="lg:col-span-2 space-y-6">
            {reviews.map((review) => (
              <div key={review.id} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gray-100 overflow-hidden">
                        <img src={review.avatar} alt={review.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className="font-bold text-dark">{review.name}</h4>
                      <p className="text-xs text-gray-400">{review.date}</p>
                    </div>
                  </div>
                  <div className="flex bg-gray-50 px-2 py-1 rounded-lg">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} size={14} className={i <= review.rating ? "text-secondary fill-secondary" : "text-gray-300"} />
                    ))}
                  </div>
                </div>
                
                <p className="text-gray-600 leading-relaxed mb-6">
                  {review.content}
                </p>

                <div className="flex items-center gap-6 pt-6 border-t border-gray-50">
                  <button className="flex items-center gap-2 text-gray-400 hover:text-primary transition-colors text-sm font-medium">
                    <ThumbsUp size={18} />
                    Helpful ({review.likes})
                  </button>
                  <button className="flex items-center gap-2 text-gray-400 hover:text-primary transition-colors text-sm font-medium">
                    <MessageCircle size={18} />
                    Reply
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReviewsPage;