import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, LogOut, Package, MapPin, ChevronRight, Settings, Heart } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';
import useWishlistStore from '../store/useWishlistStore';
import ProductCard from '../components/common/ProductCard';
import Button from '../components/common/Button';

const ProfilePage = () => {
    const { user, logout } = useAuthStore();
    const wishlistItems = useWishlistStore(state => state.items);
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    if (!user) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4">
                <div className="text-center">
                    <h2 className="text-xl font-bold text-gray-800 mb-2">Not Logged In</h2>
                    <p className="text-gray-500 mb-6">Please login to view your profile</p>
                    <Button onClick={() => navigate('/login')} className="px-8">
                        Login Now
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-20 md:pb-8">
            {/* Header / Profile Card */}
            <div className="bg-white shadow-sm mb-4">
                <div className="container mx-auto px-4 py-8">
                    <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center text-primary text-2xl font-bold border-2 border-white shadow-md">
                            {user.displayName ? user.displayName.charAt(0).toUpperCase() : <User />}
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900">{user.displayName || 'Styliqo User'}</h1>
                            <div className="flex items-center text-gray-500 text-sm mt-1">
                                <Mail className="w-3 h-3 mr-1" />
                                <span>{user.email}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 max-w-4xl space-y-4">
                {/* Account Actions Grid */}
                <div>
                    <h2 className="text-xl font-bold text-gray-800 mb-4 px-1">My Dashboard</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Orders Section */}
                        <Link to="/orders" className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:border-pink-100 transition-colors cursor-pointer group flex items-start justify-between">
                            <div>
                                <div className="bg-blue-50 w-10 h-10 rounded-full flex items-center justify-center text-blue-600 mb-3">
                                    <Package className="w-5 h-5" />
                                </div>
                                <h3 className="font-bold text-gray-800">My Orders</h3>
                                <p className="text-xs text-gray-500 mt-1">Check order status & returns</p>
                            </div>
                            <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-primary transition-colors" />
                        </Link>

                        {/* Address Section */}
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:border-pink-100 transition-colors cursor-pointer group flex items-start justify-between">
                            <div>
                                <div className="bg-green-50 w-10 h-10 rounded-full flex items-center justify-center text-green-600 mb-3">
                                    <MapPin className="w-5 h-5" />
                                </div>
                                <h3 className="font-bold text-gray-800">My Addresses</h3>
                                <p className="text-xs text-gray-500 mt-1">Manage delivery addresses</p>
                            </div>
                            <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-primary transition-colors" />
                        </div>

                        {/* Settings Section */}
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:border-pink-100 transition-colors cursor-pointer group flex items-start justify-between">
                            <div>
                                <div className="bg-purple-50 w-10 h-10 rounded-full flex items-center justify-center text-purple-600 mb-3">
                                    <Settings className="w-5 h-5" />
                                </div>
                                <h3 className="font-bold text-gray-800">Settings</h3>
                                <p className="text-xs text-gray-500 mt-1">Notifications & privacy</p>
                            </div>
                            <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-primary transition-colors" />
                        </div>

                        {/* Points Section */}
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:border-pink-100 transition-colors cursor-pointer group">
                            <h3 className="font-bold text-gray-800 mb-2">Styliqo Points</h3>
                            <p className="text-3xl font-bold text-pink-500 mb-1">0</p>
                            <p className="text-xs text-gray-400">Points expire in 30 days</p>
                        </div>
                    </div>
                </div>

                {/* Wishlist Section */}
                <div className="mt-8">
                    <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center px-1">
                        <Heart className="w-5 h-5 mr-2 text-primary fill-current" /> My Wishlist ({wishlistItems.length})
                    </h2>
                    {wishlistItems.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {wishlistItems.map(product => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 bg-white rounded-lg border border-dashed border-gray-200">
                            <Heart className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                            <p className="text-gray-500 font-medium">Your wishlist is empty</p>
                            <p className="text-xs text-gray-400 mt-1">Tap the heart on any product to save it here</p>
                        </div>
                    )}
                </div>

                {/* Logout Button */}
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 mt-6">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center space-x-2 text-red-500 font-bold py-3 hover:bg-red-50 rounded-lg transition-colors"
                    >
                        <LogOut className="w-5 h-5" />
                        <span>Log Out</span>
                    </button>
                    <div className="text-center mt-4 text-xs text-gray-400">
                        App Version 1.0.0
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
