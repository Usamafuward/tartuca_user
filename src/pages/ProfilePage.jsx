import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { fetchUserProfile, updateUserProfile, fetchUserOrders, fetchUserReservations, uploadUserProfilePicture } from '../services/api';
import { User, Mail, Phone, MapPin, LogOut, Package, Calendar, Clock, Users, Utensils, ChevronDown, ChevronUp, Sparkles, ShieldCheck, Image as ImageIcon, Upload, Link as LinkIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import UserAvatar from '../components/common/UserAvatar';

function ProfilePage() {
    const navigate = useNavigate();
    const { logout, refreshUser } = useAuth();
    const { formatPrice } = useSettings();
    const [user, setUser] = useState({
        full_name: '',
        email: '',
        phone: '',
        address: '',
        profile_picture: ''
    });
    const [activeTab, setActiveTab] = useState('orders');
    const [orders, setOrders] = useState([]);
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');
    const [expandedOrder, setExpandedOrder] = useState(null);
    const [photoInputMode, setPhotoInputMode] = useState('url'); // 'url' | 'upload'
    const [uploadingPhoto, setUploadingPhoto] = useState(false);
    const [selectedFileName, setSelectedFileName] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        const loadData = async () => {
            try {
                const [profileData, ordersData, reservationsData] = await Promise.all([
                    fetchUserProfile(token).catch(() => ({})),
                    fetchUserOrders(token).catch(() => []),
                    fetchUserReservations(token).catch(() => [])
                ]);
                
                setUser({
                    full_name: profileData.full_name || '',
                    email: profileData.email || '',
                    phone: profileData.phone || '',
                    address: profileData.address || '',
                    profile_picture: profileData.profile_picture || ''
                });
                setOrders(ordersData || []);
                setReservations(reservationsData || []);
            } catch (error) {
                console.error("Error loading profile data", error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [navigate, logout]);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            setMessage('Please select a valid image file (JPEG, PNG, WebP).');
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            setMessage('Image file size must be less than 5MB.');
            return;
        }

        setSelectedFileName(file.name);
        setUploadingPhoto(true);
        setMessage('');
        const token = localStorage.getItem('token');
        try {
            const updatedUser = await uploadUserProfilePicture(token, file);
            setUser(prev => ({
                ...prev,
                profile_picture: updatedUser.profile_picture
            }));
            if (refreshUser) refreshUser();
            setMessage('Profile photo uploaded and updated successfully!');
        } catch (err) {
            console.error(err);
            setMessage(err.message || 'Failed to upload photo.');
        } finally {
            setUploadingPhoto(false);
        }
    };

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const getStatusColor = (status = '') => {
        switch (status.toLowerCase()) {
            case 'pending': return 'bg-amber-500/15 text-amber-300 border border-amber-500/30';
            case 'cooking': return 'bg-sky-500/15 text-sky-300 border border-sky-500/30';
            case 'delivered': return 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30';
            case 'confirmed': return 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30';
            case 'completed': return 'bg-purple-500/15 text-purple-300 border border-purple-500/30';
            case 'cancelled': return 'bg-rose-500/15 text-rose-300 border border-rose-500/30';
            default: return 'bg-white/10 text-slate-300 border border-white/10';
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage('');
        const token = localStorage.getItem('token');
        try {
            await updateUserProfile(token, {
                full_name: user.full_name,
                phone: user.phone,
                address: user.address,
                profile_picture: user.profile_picture || null
            });
            if (refreshUser) refreshUser();
            setMessage('Profile updated successfully!');
        } catch (err) {
            console.error(err);
            setMessage('Failed to update profile.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
        <div className="min-h-[60vh] flex items-center justify-center">
            <div className="text-amber-400 font-serif font-bold text-lg animate-pulse">Loading Member Details...</div>
        </div>
    );

    return (
        <div className="min-h-screen pt-8 sm:pt-10 pb-20 sm:pb-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
                            <Sparkles size={13} /> Dining Club Member
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight">
                            {user.full_name ? `Welcome, ${user.full_name}` : 'My Dining Account'}
                        </h1>
                        <p className="text-slate-400 text-xs sm:text-sm mt-1">Review active orders, table reservations, and delivery preferences.</p>
                    </div>
                    
                    <button 
                        onClick={handleLogout}
                        className="flex items-center gap-2 text-rose-400 hover:text-rose-300 font-bold px-5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 hover:border-rose-500/30 text-xs uppercase tracking-wider transition-all"
                    >
                        <LogOut size={16} />
                        <span>Sign Out</span>
                    </button>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    
                    {/* Left Column: Personal Information Form */}
                    <div className="lg:col-span-1">
                        <div className="glass-card rounded-3xl border border-white/10 p-6 sm:p-8 sticky top-28 shadow-2xl">
                            <h2 className="text-lg font-serif font-bold text-white mb-6 flex items-center gap-2.5">
                                <span className="w-2.5 h-6 bg-amber-500 rounded-full"></span>
                                Personal Profile
                            </h2>

                            {message && (
                                <div className={`p-3.5 rounded-xl mb-6 text-xs font-medium ${message.includes('successfully') ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/15 text-rose-300 border border-rose-500/30'}`}>
                                    {message}
                                </div>
                            )}

                            {/* Member Profile Avatar Spotlight */}
                            <div className="flex flex-col items-center justify-center mb-6 pb-6 border-b border-white/[0.08]">
                                <div className="relative">
                                    <UserAvatar 
                                        src={user.profile_picture} 
                                        name={user.full_name || user.email} 
                                        size="2xl"
                                        className="ring-4 ring-amber-500/20 shadow-2xl"
                                    />
                                    <div className="absolute -bottom-1 -right-1 bg-amber-500 text-slate-950 p-1.5 rounded-full shadow-lg border-2 border-[#0B0D13]">
                                        <Sparkles size={12} />
                                    </div>
                                </div>
                                <h3 className="text-white font-serif font-bold text-base mt-3">
                                    {user.full_name || 'Tartuca Member'}
                                </h3>
                                <p className="text-slate-400 text-xs font-mono mt-0.5">{user.email}</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* Profile Picture Mode: URL or Upload */}
                                <div className="space-y-2.5">
                                    <div className="flex items-center justify-between">
                                        <label className="block text-xs font-semibold text-slate-400">Profile Picture</label>
                                        {user.profile_picture && (
                                            <button 
                                                type="button" 
                                                onClick={() => {
                                                    setUser(prev => ({ ...prev, profile_picture: '' }));
                                                    setSelectedFileName('');
                                                }}
                                                className="text-[10px] text-rose-400 hover:text-rose-300 font-medium transition-colors"
                                            >
                                                Reset to Initial
                                            </button>
                                        )}
                                    </div>

                                    {/* Dual-Mode Selector */}
                                    <div className="grid grid-cols-2 p-1 rounded-xl bg-black/40 border border-white/10 text-xs">
                                        <button
                                            type="button"
                                            onClick={() => setPhotoInputMode('url')}
                                            className={`py-1.5 px-3 rounded-lg font-medium transition-all flex items-center justify-center gap-1.5 ${
                                                photoInputMode === 'url'
                                                    ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                                                    : 'text-slate-400 hover:text-white'
                                            }`}
                                        >
                                            <LinkIcon size={12} />
                                            <span>Image URL</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setPhotoInputMode('upload')}
                                            className={`py-1.5 px-3 rounded-lg font-medium transition-all flex items-center justify-center gap-1.5 ${
                                                photoInputMode === 'upload'
                                                    ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                                                    : 'text-slate-400 hover:text-white'
                                            }`}
                                        >
                                            <Upload size={12} />
                                            <span>Upload Photo</span>
                                        </button>
                                    </div>

                                    {photoInputMode === 'url' ? (
                                        <div className="space-y-1">
                                            <div className="relative">
                                                <ImageIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                                                <input
                                                    type="url"
                                                    name="profile_picture"
                                                    value={user.profile_picture}
                                                    onChange={handleChange}
                                                    placeholder="https://images.unsplash.com/..."
                                                    className="w-full pl-10 pr-4 py-2.5 bg-[#0E1015] rounded-xl border border-white/10 text-xs text-white placeholder-slate-600 focus:border-amber-400/60 focus:outline-none"
                                                />
                                            </div>
                                            <p className="text-[10px] text-slate-500">
                                                Paste an image web link. Leave blank to automatically use your name's initial letter.
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="space-y-1">
                                            <label className="relative flex flex-col items-center justify-center p-4 border border-dashed border-white/20 hover:border-amber-500/50 rounded-xl bg-[#0E1015] cursor-pointer group transition-all">
                                                <input 
                                                    type="file" 
                                                    accept="image/png, image/jpeg, image/webp" 
                                                    onChange={handleFileUpload} 
                                                    className="hidden" 
                                                    disabled={uploadingPhoto}
                                                />
                                                <Upload size={20} className={`mb-1.5 text-slate-400 group-hover:text-amber-400 transition-colors ${uploadingPhoto ? 'animate-bounce text-amber-400' : ''}`} />
                                                <span className="text-xs font-semibold text-slate-300 group-hover:text-white transition-colors">
                                                    {uploadingPhoto ? 'Uploading photo...' : (selectedFileName ? `Selected: ${selectedFileName}` : 'Choose Photo File')}
                                                </span>
                                                <span className="text-[10px] text-slate-500 mt-0.5">JPG, PNG, WebP up to 5MB</span>
                                            </label>
                                            <p className="text-[10px] text-slate-500">
                                                Select a photo from your computer or phone to upload directly.
                                            </p>
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-400 mb-1.5">Full Name</label>
                                    <div className="relative">
                                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                                        <input
                                            type="text"
                                            name="full_name"
                                            value={user.full_name}
                                            onChange={handleChange}
                                            className="w-full pl-10 pr-4 py-2.5 bg-[#0E1015] rounded-xl border border-white/10 text-xs text-white focus:border-amber-400/60 focus:outline-none"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-400 mb-1.5">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                                        <input
                                            type="email"
                                            value={user.email}
                                            disabled
                                            className="w-full pl-10 pr-4 py-2.5 bg-white/[0.02] rounded-xl border border-white/5 text-xs text-slate-500 cursor-not-allowed"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-400 mb-1.5">Phone Number</label>
                                    <div className="relative">
                                        <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={user.phone}
                                            onChange={handleChange}
                                            placeholder="+94 77 123 4567"
                                            className="w-full pl-10 pr-4 py-2.5 bg-[#0E1015] rounded-xl border border-white/10 text-xs text-white focus:border-amber-400/60 focus:outline-none"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-400 mb-1.5">Default Delivery Address</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3.5 top-3 text-slate-500" size={16} />
                                        <textarea
                                            name="address"
                                            value={user.address}
                                            onChange={handleChange}
                                            rows="3"
                                            placeholder="No. 45, Alfred House Gardens, Colombo 03"
                                            className="w-full pl-10 pr-4 py-2.5 bg-[#0E1015] rounded-xl border border-white/10 text-xs text-white focus:border-amber-400/60 focus:outline-none resize-none"
                                        />
                                    </div>
                                </div>

                                <button 
                                    type="submit" 
                                    disabled={saving}
                                    className="w-full bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-bold py-3 rounded-xl text-xs uppercase tracking-wider shadow-md shadow-amber-500/20 transition-all disabled:opacity-60"
                                >
                                    {saving ? 'Saving...' : 'Update Details'}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Right Column: Orders & Reservations Tabs */}
                    <div className="lg:col-span-2 space-y-6">
                        
                        {/* Tab Switcher */}
                        <div className="flex bg-[#0E1015] p-1.5 rounded-2xl border border-white/10 w-fit gap-1">
                            <button
                                onClick={() => setActiveTab('orders')}
                                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                                    activeTab === 'orders'
                                        ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                                        : 'text-slate-400 hover:text-white'
                                }`}
                            >
                                <Package size={15} />
                                <span>My Orders ({orders.length})</span>
                            </button>
                            <button
                                onClick={() => setActiveTab('reservations')}
                                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                                    activeTab === 'reservations'
                                        ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                                        : 'text-slate-400 hover:text-white'
                                }`}
                            >
                                <Calendar size={15} />
                                <span>Table Bookings ({reservations.length})</span>
                            </button>
                        </div>

                        {/* Order History View */}
                        {activeTab === 'orders' && (
                            <div className="space-y-4">
                                {orders.length === 0 ? (
                                    <div className="glass-card p-12 rounded-3xl border border-white/10 text-center text-slate-400">
                                        <Package size={44} className="mx-auto mb-3 text-slate-600" />
                                        <p className="font-serif font-bold text-white text-base mb-1">No orders yet</p>
                                        <p className="text-xs text-slate-400 mb-6">Craving delicious food from Tartuca?</p>
                                        <Link to="/menu" className="inline-flex items-center gap-2 px-6 py-2.5 bg-amber-500 text-slate-950 rounded-xl text-xs font-bold uppercase tracking-wider shadow-md shadow-amber-500/20 hover:bg-amber-400 transition-all">
                                            Explore Menu
                                        </Link>
                                    </div>
                                ) : (
                                    orders.map((order) => (
                                        <div key={order.id} className="glass-card rounded-3xl border border-white/10 overflow-hidden hover:border-amber-500/30 transition-all">
                                            <div 
                                                className="p-6 flex flex-col md:flex-row md:items-center justify-between cursor-pointer hover:bg-white/[0.02] transition-colors"
                                                onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                                            >
                                                <div className="flex items-center gap-4 mb-4 md:mb-0">
                                                    <div className="w-11 h-11 bg-amber-500/15 rounded-xl border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                                                        <Package size={20} />
                                                    </div>
                                                    <div>
                                                        <h3 className="font-serif font-bold text-white text-base">Order #{order.id}</h3>
                                                        <p className="text-xs text-slate-400">
                                                            {new Date(order.created_at).toLocaleDateString()} at {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </p>
                                                    </div>
                                                </div>
                                                
                                                <div className="flex items-center gap-6">
                                                    <div className="text-right">
                                                        <p className="font-sans font-extrabold text-amber-400 text-base">{formatPrice(order.total_amount)}</p>
                                                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide mt-0.5 ${getStatusColor(order.status)}`}>
                                                            {order.status}
                                                        </span>
                                                    </div>
                                                    <div className="w-7 h-7 rounded-lg bg-white/[0.04] border border-white/10 flex items-center justify-center text-slate-400">
                                                        {expandedOrder === order.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                                    </div>
                                                </div>
                                            </div>

                                            {expandedOrder === order.id && (
                                                <div className="px-6 pb-6 pt-2 border-t border-white/[0.06]">
                                                    <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 mt-2">Ordered Items</h4>
                                                    <div className="space-y-2">
                                                        {order.items?.map((item, index) => (
                                                            <div key={index} className="flex justify-between text-xs items-center bg-white/[0.02] p-2.5 rounded-xl border border-white/[0.06]">
                                                                <div className="flex items-center gap-2.5">
                                                                    <span className="bg-amber-500/20 text-amber-300 font-bold px-2 py-0.5 rounded text-[11px]">{item.quantity}x</span>
                                                                    <span className="text-slate-200 font-medium">
                                                                        {item.menu_item?.name || item.special_offer?.title || `Dish #${item.menu_item_id || item.special_offer_id}`}
                                                                    </span>
                                                                </div>
                                                                <span className="font-mono font-bold text-amber-400">{formatPrice(item.unit_price)}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <div className="mt-4 pt-4 border-t border-white/[0.06] flex justify-between text-sm items-center">
                                                        <span className="text-slate-400 font-medium text-xs">Total Amount</span>
                                                        <span className="font-sans font-extrabold text-amber-400 text-lg">{formatPrice(order.total_amount)}</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        )}

                        {/* Reservations View */}
                        {activeTab === 'reservations' && (
                            <div className="space-y-4">
                                {reservations.length === 0 ? (
                                    <div className="glass-card p-12 rounded-3xl border border-white/10 text-center text-slate-400">
                                        <Calendar size={44} className="mx-auto mb-3 text-slate-600" />
                                        <p className="font-serif font-bold text-white text-base mb-1">No table reservations on record</p>
                                        <p className="text-xs text-slate-400 mb-6">Plan an intimate celebration or culinary tasting with us.</p>
                                        <Link to="/book-table" className="inline-flex items-center gap-2 px-6 py-2.5 bg-amber-500 text-slate-950 rounded-xl text-xs font-bold uppercase tracking-wider shadow-md shadow-amber-500/20 hover:bg-amber-400 transition-all">
                                            Book a Table Now
                                        </Link>
                                    </div>
                                ) : (
                                    reservations.map((res) => (
                                        <div key={res.id} className="glass-card rounded-3xl border border-white/10 p-6 hover:border-amber-500/30 transition-all">
                                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                                                <div className="flex items-center gap-3.5">
                                                    <div className="w-11 h-11 bg-amber-500/15 rounded-xl border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                                                        <Utensils size={20} />
                                                    </div>
                                                    <div>
                                                        <h3 className="font-serif font-bold text-white text-base">Table for {res.party_size} {res.party_size === 1 ? 'Guest' : 'Guests'}</h3>
                                                        <p className="text-xs text-slate-400 font-mono">Reference #{res.id}</p>
                                                    </div>
                                                </div>
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusColor(res.status)}`}>
                                                    {res.status}
                                                </span>
                                            </div>

                                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-white/[0.06] text-xs">
                                                <div className="flex items-center gap-2 text-slate-300">
                                                    <Calendar size={15} className="text-amber-400 shrink-0" />
                                                    <span className="font-medium">{res.reservation_date}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-slate-300">
                                                    <Clock size={15} className="text-amber-400 shrink-0" />
                                                    <span className="font-medium">{res.reservation_time ? res.reservation_time.slice(0, 5) : '19:00'}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-slate-300">
                                                    <Users size={15} className="text-amber-400 shrink-0" />
                                                    <span className="font-medium">{res.party_size} Guests</span>
                                                </div>
                                            </div>

                                            {res.occasion && (
                                                <div className="mt-4 pt-3 border-t border-white/[0.06] text-xs text-slate-400 bg-white/[0.02] p-3 rounded-xl">
                                                    <span className="font-semibold text-amber-300">Special Notes: </span>
                                                    {res.occasion}
                                                </div>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                    </div>

                </div>

            </div>
        </div>
    );
}

export default ProfilePage;