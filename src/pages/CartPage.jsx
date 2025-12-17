import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useCartStore from '../store/useCartStore';
import Button from '../components/common/Button';
import { Trash2, ShoppingBag, Plus, Minus, Tag, Truck, Shield, ArrowRight } from 'lucide-react';

const CartPage = () => {
    const { items, removeItem, updateQuantity, totalPrice } = useCartStore();
    const navigate = useNavigate();

    if (items.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-gray-50 via-pink-50/30 to-purple-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900">
                <div className="bg-white p-12 rounded-3xl shadow-xl max-w-md text-center dark:bg-gray-800 dark:shadow-none">
                    <div className="w-32 h-32 bg-gradient-to-br from-pink-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6 dark:from-gray-700 dark:to-gray-600">
                        <ShoppingBag className="w-16 h-16 text-pink-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-3 dark:text-white">Your Cart is Empty</h2>
                    <p className="text-gray-500 mb-8 dark:text-gray-400">Discover amazing products and start shopping!</p>
                    <Link to="/">
                        <Button variant="primary" size="lg" className="w-full font-bold shadow-lg">
                            Start Shopping
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    const priceDetails = {
        total: totalPrice(),
        discount: total => Math.round(total * 0.1), // Mock discount 10%
        delivery: 0,
    };

    const finalTotal = priceDetails.total - priceDetails.discount(priceDetails.total);
    const savings = priceDetails.discount(priceDetails.total);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-pink-50/30 to-purple-50/30 pb-24 md:pb-12 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900">
            {/* Header */}
            <div className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-10 dark:bg-gray-800 dark:border-gray-700">
                <div className="container mx-auto px-4 py-4 max-w-6xl">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-500 rounded-xl flex items-center justify-center">
                                <ShoppingBag className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-gray-900 dark:text-white">Shopping Cart</h1>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{items.length} {items.length === 1 ? 'item' : 'items'}</p>
                            </div>
                        </div>
                        {savings > 0 && (
                            <div className="hidden md:flex items-center gap-2 bg-green-50 px-4 py-2 rounded-full border border-green-200">
                                <Tag className="w-4 h-4 text-green-600" />
                                <span className="text-sm font-bold text-green-700">You're saving ₹{savings}!</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 max-w-6xl pt-6">
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Cart Items List */}
                    <div className="flex-1 space-y-4">
                        {items.map(item => (
                            <div key={`${item.id}-${item.selectedSize}`} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-all duration-300 group dark:bg-gray-800 dark:border-gray-700">
                                <div className="flex gap-4">
                                    {/* Product Image */}
                                    <div className="w-28 h-28 flex-shrink-0 rounded-xl overflow-hidden border border-gray-100 bg-gray-50 dark:border-gray-600 dark:bg-gray-700">
                                        <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                    </div>

                                    {/* Product Details */}
                                    <div className="flex-1 flex flex-col justify-between">
                                        <div>
                                            <div className="flex justify-between items-start gap-3">
                                                <h3 className="font-bold text-gray-900 line-clamp-2 text-base dark:text-white">{item.title}</h3>
                                                <button
                                                    onClick={() => removeItem(item.id)}
                                                    className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition-all"
                                                    title="Remove item"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                            <div className="flex items-center gap-3 mt-2">
                                                <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                                                    Size: <span className="font-medium text-gray-700">{item.selectedSize || 'Free'}</span>
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between mt-3">
                                            {/* Price */}
                                            <div className="flex items-baseline gap-2">
                                                <span className="font-bold text-xl text-gray-900 dark:text-white">₹{item.price}</span>
                                                <span className="text-sm text-gray-400 line-through">₹{item.originalPrice}</span>
                                                <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded">
                                                    {Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}% OFF
                                                </span>
                                            </div>

                                            {/* Quantity Controls */}
                                            <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-3 py-2 border border-gray-200 dark:bg-gray-700 dark:border-gray-600">
                                                <button
                                                    className="w-8 h-8 flex items-center justify-center text-pink-600 font-bold hover:bg-white rounded-lg transition-all dark:text-pink-400 dark:hover:bg-gray-600"
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    disabled={item.quantity <= 1}
                                                >
                                                    <Minus className="w-4 h-4" />
                                                </button>
                                                <span className="text-sm font-bold w-6 text-center dark:text-white">{item.quantity}</span>
                                                <button
                                                    className="w-8 h-8 flex items-center justify-center text-pink-600 font-bold hover:bg-white rounded-lg transition-all dark:text-pink-400 dark:hover:bg-gray-600"
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                >
                                                    <Plus className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Trust Badges */}
                        <div className="grid grid-cols-3 gap-3 mt-6">
                            <div className="bg-white rounded-xl p-4 text-center border border-gray-100 dark:bg-gray-800 dark:border-gray-700">
                                <Shield className="w-6 h-6 text-green-600 mx-auto mb-2" />
                                <p className="text-xs font-medium text-gray-700 dark:text-gray-300">Secure Payment</p>
                            </div>
                            <div className="bg-white rounded-xl p-4 text-center border border-gray-100 dark:bg-gray-800 dark:border-gray-700">
                                <Truck className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                                <p className="text-xs font-medium text-gray-700 dark:text-gray-300">Free Delivery</p>
                            </div>
                            <div className="bg-white rounded-xl p-4 text-center border border-gray-100 dark:bg-gray-800 dark:border-gray-700">
                                <Tag className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                                <p className="text-xs font-medium text-gray-700 dark:text-gray-300">Best Prices</p>
                            </div>
                        </div>
                    </div>

                    {/* Price Summary Sidebar */}
                    <div className="lg:w-96 flex-shrink-0">
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sticky top-24 dark:bg-gray-800 dark:border-gray-700">
                            <h3 className="font-bold text-gray-900 text-lg mb-5 flex items-center dark:text-white">
                                <div className="w-1 h-6 bg-gradient-to-b from-pink-500 to-purple-500 rounded-full mr-3"></div>
                                Price Summary
                            </h3>

                            <div className="space-y-4">
                                {/* Price Details */}
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between text-gray-600 dark:text-gray-300">
                                        <span>Subtotal ({items.length} items)</span>
                                        <span className="font-medium">₹{priceDetails.total}</span>
                                    </div>
                                    <div className="flex justify-between text-green-600 bg-green-50 p-3 rounded-xl">
                                        <span className="font-medium">Total Savings</span>
                                        <span className="font-bold">-₹{savings}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600 dark:text-gray-300">
                                        <span>Delivery Charges</span>
                                        <span className="font-bold text-green-600">FREE</span>
                                    </div>
                                </div>

                                {/* Divider */}
                                <div className="border-t-2 border-dashed border-gray-200 my-4"></div>

                                {/* Total */}
                                <div className="flex justify-between items-center bg-gradient-to-r from-pink-50 to-purple-50 p-4 rounded-xl dark:from-gray-700 dark:to-gray-700">
                                    <span className="font-bold text-gray-900 text-lg dark:text-white">Total Amount</span>
                                    <span className="font-bold text-2xl text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600">
                                        ₹{finalTotal}
                                    </span>
                                </div>

                                {/* Checkout Button */}
                                <Button
                                    variant="primary"
                                    className="w-full h-14 text-base font-bold shadow-lg shadow-pink-500/20 hover:shadow-pink-500/30 transition-all group"
                                    onClick={() => navigate('/checkout')}
                                >
                                    <span>Proceed to Checkout</span>
                                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                                </Button>

                                {/* Terms */}
                                <p className="text-xs text-gray-400 text-center mt-4 leading-relaxed">
                                    By continuing, you agree to Styliqo's <span className="text-pink-600">Terms of Use</span> and <span className="text-pink-600">Privacy Policy</span>
                                </p>
                            </div>
                        </div>

                        {/* Payment Methods */}
                        <div className="mt-4 bg-white rounded-xl p-4 border border-gray-100 dark:bg-gray-800 dark:border-gray-700">
                            <p className="text-xs text-gray-500 text-center mb-3 dark:text-gray-400">We Accept</p>
                            <div className="flex justify-center items-center gap-3 opacity-60 hover:opacity-100 transition-opacity">
                                <img src="https://images.meesho.com/images/marketing/1588578650850.png" alt="Payment Methods" className="h-6" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartPage;
