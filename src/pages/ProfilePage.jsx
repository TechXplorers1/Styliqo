import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, LogOut, Package, MapPin, ChevronRight, Settings, Heart, Award, TrendingUp, Gift } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';
import useWishlistStore from '../store/useWishlistStore';
import { getUserOrders } from '../lib/firebase';
import ProductCard from '../components/common/ProductCard';
import Button from '../components/common/Button';

const ProfilePage = () => {
    const { user, logout } = useAuthStore();
    const wishlistItems = useWishlistStore(state => state.items);
    const navigate = useNavigate();
    const [orderCount, setOrderCount] = useState(0);

    useEffect(() => {
        if (user) {
            const unsubscribe = getUserOrders(user.uid, (orders) => {
                setOrderCount(orders.length);
            });
            return () => unsubscribe();
        }
    }, [user]);

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    if (!user) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-pink-50 to-purple-50">
                <div className="text-center bg-white p-8 rounded-2xl shadow-xl max-w-md">
                    <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <User className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Not Logged In</h2>
                    <p className="text-gray-500 mb-6">Please login to view your profile</p>
                    <Button onClick={() => navigate('/login')} className="px-8 w-full">
                        Login Now
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-pink-50/30 to-purple-50/30 pb-20 md:pb-8 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900">
            {/* Hero Header with Gradient */}
            <div className="bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 text-white shadow-xl mb-8">
                <div className="container mx-auto px-4 py-12">
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                        {/* Avatar */}
                        <div className="relative">
                            <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white text-3xl font-bold border-4 border-white/30 shadow-2xl">
                                {user.displayName ? user.displayName.charAt(0).toUpperCase() : <User className="w-12 h-12" />}
                            </div>
                            <div className="absolute -bottom-2 -right-2 bg-green-500 w-8 h-8 rounded-full border-4 border-white flex items-center justify-center">
                                <Award className="w-4 h-4 text-white" />
                            </div>
                        </div>

                        {/* User Info */}
                        <div className="flex-1 text-center md:text-left">
                            <h1 className="text-3xl font-bold mb-2">{user.displayName || 'Styliqo User'}</h1>
                            <div className="flex items-center justify-center md:justify-start text-white/90 text-sm mb-3">
                                <Mail className="w-4 h-4 mr-2" />
                                <span>{user.email}</span>
                            </div>
                            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                                <TrendingUp className="w-4 h-4" />
                                <span className="text-sm font-medium">Premium Member</span>
                            </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="hidden md:flex gap-4">
                            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center min-w-[100px]">
                                <div className="text-2xl font-bold">{orderCount}</div>
                                <div className="text-xs text-white/80 mt-1">Orders</div>
                            </div>
                            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center min-w-[100px]">
                                <div className="text-2xl font-bold">{wishlistItems.length}</div>
                                <div className="text-xs text-white/80 mt-1">Wishlist</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 max-w-6xl space-y-8">
                {/* Quick Actions Grid */}
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center dark:text-white">
                        <div className="w-1 h-8 bg-gradient-to-b from-pink-500 to-purple-500 rounded-full mr-3"></div>
                        Quick Actions
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Orders Card */}
                        <Link to="/orders" className="group bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-pink-200 transition-all duration-300 transform hover:-translate-y-1 dark:bg-gray-800 dark:border-gray-700">
                            <div className="bg-gradient-to-br from-blue-500 to-blue-600 w-14 h-14 rounded-2xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform shadow-lg">
                                <Package className="w-7 h-7" />
                            </div>
                            <h3 className="font-bold text-gray-900 text-lg mb-1 dark:text-white">My Orders</h3>
                            <p className="text-sm text-gray-500 mb-3 dark:text-gray-400">Track & manage orders</p>
                            <div className="flex items-center text-pink-600 text-sm font-medium">
                                View All <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </Link>

                        {/* Addresses Card */}
                        <Link to="/addresses" className="group bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-pink-200 transition-all duration-300 transform hover:-translate-y-1 dark:bg-gray-800 dark:border-gray-700">
                            <div className="bg-gradient-to-br from-green-500 to-green-600 w-14 h-14 rounded-2xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform shadow-lg">
                                <MapPin className="w-7 h-7" />
                            </div>
                            <h3 className="font-bold text-gray-900 text-lg mb-1 dark:text-white">Addresses</h3>
                            <p className="text-sm text-gray-500 mb-3 dark:text-gray-400">Manage delivery locations</p>
                            <div className="flex items-center text-pink-600 text-sm font-medium">
                                Manage <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </Link>

                        {/* Settings Card */}
                        <Link to="/settings" className="group bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-pink-200 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer dark:bg-gray-800 dark:border-gray-700">
                            <div className="bg-gradient-to-br from-purple-500 to-purple-600 w-14 h-14 rounded-2xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform shadow-lg">
                                <Settings className="w-7 h-7" />
                            </div>
                            <h3 className="font-bold text-gray-900 text-lg mb-1 dark:text-white">Settings</h3>
                            <p className="text-sm text-gray-500 mb-3 dark:text-gray-400">Privacy & preferences</p>
                            <div className="flex items-center text-pink-600 text-sm font-medium">
                                Configure <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </Link>

                        {/* Rewards Card */}
                        <div className="group bg-gradient-to-br from-amber-500 to-orange-500 p-6 rounded-2xl shadow-lg border border-amber-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer text-white">
                            <div className="bg-white/20 backdrop-blur-sm w-14 h-14 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <Gift className="w-7 h-7" />
                            </div>
                            <h3 className="font-bold text-lg mb-1">Styliqo Points</h3>
                            <p className="text-3xl font-bold mb-1">0</p>
                            <p className="text-xs text-white/80">Earn rewards on every purchase</p>
                        </div>
                    </div>
                </div>

                {/* Wishlist Section */}
                <div>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-gray-900 flex items-center dark:text-white">
                            <div className="w-1 h-8 bg-gradient-to-b from-pink-500 to-purple-500 rounded-full mr-3"></div>
                            My Wishlist
                            <span className="ml-3 bg-pink-100 text-pink-600 px-3 py-1 rounded-full text-sm font-bold">
                                {wishlistItems.length}
                            </span>
                        </h2>
                    </div>

                    {wishlistItems.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                            {wishlistItems.map(product => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-12 text-center dark:bg-gray-800 dark:border-gray-700">
                            <div className="w-20 h-20 bg-gradient-to-br from-pink-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 dark:from-gray-700 dark:to-gray-600">
                                <Heart className="w-10 h-10 text-pink-400" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2 dark:text-white">Your wishlist is empty</h3>
                            <p className="text-gray-500 mb-6 dark:text-gray-400">Save your favorite items for later</p>
                            <Button onClick={() => navigate('/')} variant="primary" className="px-8">
                                Start Shopping
                            </Button>
                        </div>
                    )}
                </div>

                {/* Logout Section */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 dark:bg-gray-800 dark:border-gray-700">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-3 text-red-600 font-bold py-4 hover:bg-red-50 rounded-xl transition-all group"
                    >
                        <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        <span>Log Out</span>
                    </button>
                    <div className="text-center mt-4 text-xs text-gray-400">
                        Styliqo v1.0.0 • Made with ❤️
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
