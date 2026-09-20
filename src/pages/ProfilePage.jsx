import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { fetchUserProfile, updateUserProfile, fetchUserOrders, fetchUserReservations } from '../services/api';
import { User, Mail, Phone, MapPin, LogOut, Package, Calendar, Clock, Users, Utensils, ChevronDown, ChevronUp } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

function ProfilePage() {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const [user, setUser] = useState({
        full_name: '',
        email: '',
        phone: '',
        address: ''
    });
    const [activeTab, setActiveTab] = useState('orders');
    const [orders, setOrders] = useState([]);
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');
    const [expandedOrder, setExpandedOrder] = useState(null);

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
                    address: profileData.address || ''
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
    };

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-700';
            case 'cooking': return 'bg-blue-100 text-blue-700';
            case 'delivered': return 'bg-green-100 text-green-700';
            case 'confirmed': return 'bg-green-100 text-green-700';
            case 'completed': return 'bg-purple-100 text-purple-700';
            case 'cancelled': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
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
                address: user.address
            });
            setMessage('Profile updated successfully!');
        } catch (err) {
            console.error(err);
            setMessage('Failed to update profile.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
        <div className="bg-light min-h-screen flex items-center justify-center">
            <div className="text-primary font-bold text-xl">Loading...</div>
        </div>
    );

    return (
        <div className="bg-light min-h-screen py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-4">
                    <div>
                        <h1 className="text-4xl font-bold text-dark mb-2">My Profile</h1>
                        <p className="text-gray-500">Manage your details and view order history.</p>
                    </div>
                    <button 
                        onClick={handleLogout}
                        className="flex items-center gap-2 text-red-500 hover:text-red-700 font-bold px-6 py-3 rounded-xl bg-white shadow-sm hover:shadow-md transition-all border border-red-100"
                    >
                        <LogOut size={20} />
                        Logout
                    </button>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Profile Form */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 h-fit sticky top-24">
                            <h2 className="text-xl font-bold text-dark mb-6 flex items-center gap-2">
                                <span className="w-2 h-6 bg-primary rounded-full"></span>
                                Personal Details
                            </h2>
                            {message && (
                                <div className={`p-4 rounded-lg mb-6 ${message.includes('success') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                                    {message}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                        <input
                                            type="text"
                                            name="full_name"
                                            value={user.full_name}
                                            onChange={handleChange}
                                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                        <input
                                            type="email"
                                            value={user.email}
                                            disabled
                                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={user.phone}
                                            onChange={handleChange}
                                            placeholder="+1 (555) 000-0000"
                                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Address</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-3 text-gray-400" size={20} />
                                        <textarea
                                            name="address"
                                            value={user.address}
                                            onChange={handleChange}
                                            rows="3"
                                            placeholder="123 Main St, Apt 4B, New York, NY 10001"
                                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                                        />
                                    </div>
                                </div>

                                <button 
                                    type="submit" 
                                    disabled={saving}
                                    className="w-full bg-primary text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/40 hover:-translate-y-1 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {saving ? 'Saving...' : 'Save Changes'}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Tabs: Order History & My Reservations */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex bg-white p-1.5 rounded-2xl border border-gray-100 shadow-sm w-fit gap-1">
                            <button
                                onClick={() => setActiveTab('orders')}
                                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                                    activeTab === 'orders'
                                        ? 'bg-primary text-white shadow-md shadow-primary/20'
                                        : 'text-gray-600 hover:text-dark hover:bg-gray-50'
                                }`}
                            >
                                <Package size={18} />
                                Order History ({orders.length})
                            </button>
                            <button
                                onClick={() => setActiveTab('reservations')}
                                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                                    activeTab === 'reservations'
                                        ? 'bg-primary text-white shadow-md shadow-primary/20'
                                        : 'text-gray-600 hover:text-dark hover:bg-gray-50'
                                }`}
                            >
                                <Calendar size={18} />
                                Table Reservations ({reservations.length})
                            </button>
                        </div>

                        {/* Order History View */}
                        {activeTab === 'orders' && (
                            <div className="space-y-4">
                                {orders.length === 0 ? (
                                    <div className="bg-white p-12 rounded-3xl shadow-sm border border-gray-100 text-center text-gray-500">
                                        <Package size={48} className="mx-auto mb-4 opacity-20" />
                                        <p className="font-semibold text-dark mb-1">No orders yet</p>
                                        <p className="text-sm text-gray-400 mb-6">Craving something delicious from our Italian kitchen?</p>
                                        <Link to="/menu" className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-xl text-sm font-bold shadow-md shadow-primary/20 hover:bg-primary-dark transition-all">
                                            Explore Menu
                                        </Link>
                                    </div>
                                ) : (
                                    orders.map((order) => (
                                        <div key={order.id} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                                            <div 
                                                className="p-6 flex flex-col md:flex-row md:items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
                                                onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                                            >
                                                <div className="flex items-center gap-4 mb-4 md:mb-0">
                                                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary shrink-0">
                                                        <Package size={24} />
                                                    </div>
                                                    <div>
                                                        <h3 className="font-bold text-dark text-lg">Order #{order.id}</h3>
                                                        <p className="text-sm text-gray-500">{new Date(order.created_at).toLocaleDateString()} at {new Date(order.created_at).toLocaleTimeString()}</p>
                                                    </div>
                                                </div>
                                                
                                                <div className="flex items-center gap-6">
                                                    <div className="text-right">
                                                        <p className="font-bold text-dark text-lg">${Number(order.total_amount).toFixed(2)}</p>
                                                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${getStatusColor(order.status)}`}>
                                                            {order.status}
                                                        </span>
                                                    </div>
                                                    <div className={`w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center transition-colors ${expandedOrder === order.id ? 'bg-primary text-white' : 'text-gray-400'}`}>
                                                        {expandedOrder === order.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                                    </div>
                                                </div>
                                            </div>

                                            {expandedOrder === order.id && (
                                                <div className="px-6 pb-6 pt-2 border-t border-gray-50 bg-gray-50/50">
                                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 mt-2">Items Ordered</h4>
                                                    <div className="space-y-3">
                                                        {order.items.map((item, index) => (
                                                            <div key={index} className="flex justify-between text-sm items-center bg-white p-3 rounded-xl border border-gray-100">
                                                                <div className="flex items-center gap-3">
                                                                    <span className="bg-gray-100 text-dark font-bold px-2 py-1 rounded-lg text-xs">{item.quantity}x</span>
                                                                    <span className="text-gray-700 font-medium">
                                                                        {item.menu_item?.name || item.special_offer?.title || `Item #${item.menu_item_id || item.special_offer_id}`}
                                                                    </span>
                                                                </div>
                                                                <span className="font-bold text-dark">${Number(item.unit_price).toFixed(2)}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between text-base items-center">
                                                        <span className="font-bold text-gray-600">Total Amount</span>
                                                        <span className="font-bold text-primary text-xl">${Number(order.total_amount).toFixed(2)}</span>
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
                                    <div className="bg-white p-12 rounded-3xl shadow-sm border border-gray-100 text-center text-gray-500">
                                        <Calendar size={48} className="mx-auto mb-4 opacity-20" />
                                        <p className="font-semibold text-dark mb-1">No table reservations found</p>
                                        <p className="text-sm text-gray-400 mb-6">Planning a dinner or special celebration with us?</p>
                                        <Link to="/book-table" className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-xl text-sm font-bold shadow-md shadow-primary/20 hover:bg-primary-dark transition-all">
                                            Book a Table Now
                                        </Link>
                                    </div>
                                ) : (
                                    reservations.map((res) => (
                                        <div key={res.id} className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
                                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-primary shrink-0">
                                                        <Utensils size={22} />
                                                    </div>
                                                    <div>
                                                        <h3 className="font-bold text-dark text-lg">Table for {res.party_size} {res.party_size === 1 ? 'Guest' : 'Guests'}</h3>
                                                        <p className="text-xs text-gray-400">Booking Reference #{res.id}</p>
                                                    </div>
                                                </div>
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusColor(res.status)}`}>
                                                    {res.status}
                                                </span>
                                            </div>

                                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-gray-100 text-sm">
                                                <div className="flex items-center gap-2 text-gray-600">
                                                    <Calendar size={16} className="text-primary shrink-0" />
                                                    <span className="font-medium">{res.reservation_date}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-gray-600">
                                                    <Clock size={16} className="text-primary shrink-0" />
                                                    <span className="font-medium">{res.reservation_time ? res.reservation_time.slice(0, 5) : '19:00'}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-gray-600">
                                                    <Users size={16} className="text-primary shrink-0" />
                                                    <span className="font-medium">{res.party_size} People</span>
                                                </div>
                                            </div>

                                            {res.occasion && (
                                                <div className="mt-4 pt-3 border-t border-gray-50 text-xs text-gray-500 bg-gray-50 p-3 rounded-xl">
                                                    <span className="font-semibold text-dark">Preferences: </span>
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