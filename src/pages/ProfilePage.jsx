import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchUserProfile, updateUserProfile, fetchUserOrders } from '../services/api';
import { User, Mail, Phone, MapPin, LogOut, Package, ChevronDown, ChevronUp } from 'lucide-react';
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
    const [orders, setOrders] = useState([]);
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
                const [profileData, ordersData] = await Promise.all([
                    fetchUserProfile(token),
                    fetchUserOrders(token)
                ]);
                
                setUser({
                    full_name: profileData.full_name || '',
                    email: profileData.email || '',
                    phone: profileData.phone || '',
                    address: profileData.address || ''
                });
                setOrders(ordersData);
            } catch (error) {
                console.error("Error loading profile data", error);
                // Don't auto logout on minor errors, but maybe check if 401
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

                    {/* Order History */}
                    <div className="lg:col-span-2">
                        <h2 className="text-xl font-bold text-dark mb-6 flex items-center gap-2">
                            <span className="w-2 h-6 bg-primary rounded-full"></span>
                            Order History
                        </h2>
                        <div className="space-y-4">
                            {orders.length === 0 ? (
                                <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-center text-gray-500">
                                    <Package size={48} className="mx-auto mb-4 opacity-20" />
                                    <p>You haven't placed any orders yet.</p>
                                </div>
                            ) : (
                                orders.map((order) => (
                                    <div key={order.id} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                                        <div 
                                            className="p-6 flex flex-col md:flex-row md:items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
                                            onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                                        >
                                            <div className="flex items-center gap-4 mb-4 md:mb-0">
                                                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
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
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProfilePage;