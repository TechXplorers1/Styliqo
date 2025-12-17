import { Outlet, Link, useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { ShoppingCart, User, Search, Menu, Bell } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';
import useCartStore from '../store/useCartStore';
import useThemeStore from '../store/useThemeStore';
import MobileNav from '../components/common/MobileNav';

const MainLayout = () => {
    const cartItems = useCartStore(state => state.items);
    const { user, logout } = useAuthStore();
    const { isDarkMode } = useThemeStore();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [isDarkMode]);

    const handleSearch = (e) => {
        if (e.key === 'Enter') {
            if (searchQuery.trim()) {
                navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
            } else {
                navigate('/');
            }
        }
    };

    return (
        <div className={`min-h-screen flex flex-col transition-colors duration-300 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
            {/* Header - Desktop & Tablet */}
            <header className={`sticky top-0 z-40 backdrop-blur-md shadow-soft border-b transition-all duration-300 ${isDarkMode ? 'bg-gray-900/95 border-gray-800' : 'bg-white/95 border-gray-100'}`}>
                <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">

                    {/* Logo */}
                    <Link to="/" className="text-2xl font-bold text-primary tracking-tight shrink-0">
                        Styliqo
                    </Link>

                    {/* Search Bar */}
                    <div className="hidden md:flex flex-1 max-w-2xl mx-auto relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search for Sarees, Kurtis & more..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={handleSearch}
                            className={`block w-full pl-11 pr-4 py-2.5 rounded-lg text-sm transition-all outline-none placeholder:text-gray-400 focus:border-primary focus:ring-4 focus:ring-primary/10 ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border border-gray-200 text-gray-900'}`}
                        />
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center space-x-1 md:space-x-6 text-gray-600 dark:text-gray-300">
                        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors hidden md:block">
                            <Bell className="w-6 h-6" />
                        </button>
                        <div className="h-6 w-px bg-gray-200 hidden md:block"></div>

                        {user ? (
                            <Link to="/profile" className="flex flex-col items-center hover:text-primary transition group hidden md:flex cursor-pointer relative">
                                <User className="h-6 w-6 group-hover:scale-110 transition-transform" />
                                <span className="text-xs mt-1 font-medium">Profile</span>
                            </Link>
                        ) : (
                            <Link to="/login" className="flex flex-col items-center hover:text-primary transition group hidden md:flex">
                                <User className="h-6 w-6 group-hover:scale-110 transition-transform" />
                                <span className="text-xs mt-1 font-medium">Login</span>
                            </Link>
                        )}

                        <Link to="/cart" className="flex flex-col items-center hover:text-primary transition group relative hidden md:flex">
                            <div className="relative">
                                <ShoppingCart className="h-6 w-6 group-hover:scale-110 transition-transform" />
                                {cartItems.length > 0 && (
                                    <span className="absolute -top-1.5 -right-1.5 bg-primary text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center border-2 border-white">
                                        {cartItems.length}
                                    </span>
                                )}
                            </div>
                            <span className="text-xs mt-1 font-medium">Cart</span>
                        </Link>

                        {/* Mobile Search Icon (visible only on small screens) */}
                        <button className="p-2 md:hidden text-gray-600 dark:text-gray-300">
                            <Search className="w-6 h-6" />
                        </button>

                        <Link to="/cart" className="p-2 md:hidden relative text-gray-600 dark:text-gray-300">
                            <ShoppingCart className="w-6 h-6" />
                            {cartItems.length > 0 && (
                                <span className="absolute top-0 right-0 bg-primary text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center border-2 border-white">
                                    {cartItems.length}
                                </span>
                            )}
                        </Link>
                    </div>
                </div>
                {/* Mobile Search Bar (visible only on small screens) */}
                <div className="md:hidden px-4 pb-3">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search by Keyword or Product ID"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={handleSearch}
                            className={`block w-full pl-9 pr-3 py-2 rounded-md text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border border-gray-200 text-gray-900'}`}
                        />
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className={`flex-grow container mx-auto px-4 py-6 mb-16 md:mb-0 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                <Outlet />
            </main>

            {/* Footer (Hidden on Mobile due to Bottom Nav) */}
            <footer className={`mt-auto hidden md:block border-t ${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
                <div className="container mx-auto px-4 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                        <div>
                            <h3 className="font-bold text-lg mb-4 text-primary dark:text-white">Styliqo</h3>
                            <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                Trusted by over 10 Crore Indians. Shop online for the latest trends in fashion.
                            </p>
                            </div>
                        <div>
                            <h4 className="font-bold mb-4 dark:text-white">Legal</h4>
                            <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
                                <li><a href="#" className="hover:text-primary dark:hover:text-primary">Returns</a></li>
                                <li><a href="#" className="hover:text-primary dark:hover:text-primary">Terms</a></li>
                                <li><a href="#" className="hover:text-primary dark:hover:text-primary">Privacy</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold mb-4 dark:text-white">Social</h4>
                            <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
                                <li><a href="#" className="hover:text-primary dark:hover:text-primary">Instagram</a></li>
                                <li><a href="#" className="hover:text-primary dark:hover:text-primary">Facebook</a></li>
                                <li><a href="#" className="hover:text-primary dark:hover:text-primary">Twitter</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold mb-4">Contact Us</h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">query@Styliqo.com</p>
                            <p className="text-sm text-gray-500 mt-1 dark:text-gray-400">+91 98765 43210</p>
                        </div>
                    </div>
                    <div className="border-t pt-8 text-center text-gray-400 text-sm dark:border-gray-800">
                        © 2025 Styliqo. All rights reserved.
                    </div>
                </div>
            </footer>

            {/* Mobile Bottom Navigationn */}
            <MobileNav />
        </div>
    );
};

export default MainLayout;
