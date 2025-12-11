import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Grid, ShoppingBag, User } from 'lucide-react';
import { cn } from '../../utils/cn';

const MobileNav = () => {
    const navItems = [
        { name: 'Home', icon: Home, path: '/' },
        { name: 'Categories', icon: Grid, path: '/category/all' }, // Placeholder path
        { name: 'Cart', icon: ShoppingBag, path: '/cart' },
        { name: 'Profile', icon: User, path: '/profile' },
    ];

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 shadow-nav z-50 md:hidden pb-safe">
            <div className="flex justify-around items-center h-16">
                {navItems.map((item) => (
                    <NavLink
                        key={item.name}
                        to={item.path}
                        className={({ isActive }) => cn(
                            "flex flex-col items-center justify-center w-full h-full transition-colors duration-200",
                            isActive ? "text-primary" : "text-gray-400 hover:text-gray-600"
                        )}
                    >
                        <item.icon className="w-6 h-6 mb-1" strokeWidth={2} />
                        <span className="text-[10px] font-medium">{item.name}</span>
                    </NavLink>
                ))}
            </div>
        </div>
    );
};

export default MobileNav;
