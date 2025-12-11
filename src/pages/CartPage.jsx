import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useCartStore from '../store/useCartStore';
import Button from '../components/common/Button';
import { Trash2 } from 'lucide-react';

const CartPage = () => {
    const { items, removeItem, updateQuantity, totalPrice } = useCartStore();
    const navigate = useNavigate();

    if (items.length === 0) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center p-4 bg-background">
                <div className="w-48 h-48 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                    <img src="https://images.meesho.com/images/pow/empty-cart.png" alt="Empty Cart" className="w-32 opacity-60 mix-blend-multiply" />
                </div>
                <h2 className="text-xl font-bold text-gray-800">Your Cart is Empty</h2>
                <p className="text-gray-500 mt-2 mb-8 text-center max-w-xs">You can go to home page to view more products.</p>
                <Link to="/">
                    <Button variant="primary" size="lg" className="w-48 font-bold shadow-lg">View Products</Button>
                </Link>
            </div>
        );
    }

    const priceDetails = {
        total: totalPrice(),
        discount: total => Math.round(total * 0.1), // Mock discount 10%
        delivery: 0,
    };

    const finalTotal = priceDetails.total - priceDetails.discount(priceDetails.total);

    return (
        <div className="bg-background min-h-screen pb-24 md:pb-12 pt-4">
            <div className="container mx-auto px-4 max-w-5xl">
                <div className="flex items-center gap-2 mb-6">
                    <div className="h-6 w-1 bg-primary rounded-full"></div>
                    <h1 className="text-lg font-bold text-gray-800">Cart <span className="text-gray-500 text-sm font-normal">({items.length} Items)</span></h1>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Cart Items List */}
                    <div className="flex-grow space-y-4">
                        {items.map(item => (
                            <div key={`${item.id}-${item.selectedSize}`} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex gap-4 transition-shadow hover:shadow-md">
                                <div className="w-24 h-24 flex-shrink-0 border border-gray-100 rounded overflow-hidden">
                                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                                </div>

                                <div className="flex-1 flex flex-col justify-between">
                                    <div>
                                        <div className="flex justify-between items-start">
                                            <h3 className="font-semibold text-gray-800 line-clamp-2 text-sm md:text-base">{item.title}</h3>
                                            <button
                                                onClick={() => removeItem(item.id)}
                                                className="text-gray-400 hover:text-red-500 transition-colors p-1"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1">Size: <span className="font-medium text-gray-800">{item.selectedSize || 'Free Size'}</span></p>
                                        <p className="text-xs text-gray-500">Qty: <span className="font-medium text-gray-800">{item.quantity}</span></p>
                                    </div>

                                    <div className="flex items-end justify-between mt-2">
                                        <div className="flex items-baseline gap-2">
                                            <span className="font-bold text-lg text-gray-900">₹{item.price}</span>
                                            <span className="text-xs text-gray-400 line-through">₹{item.originalPrice}</span>
                                            <span className="text-xs text-green-600 font-bold">10% OFF</span>
                                        </div>

                                        <div className="flex items-center space-x-3 bg-gray-50 rounded px-2 py-1 border border-gray-200">
                                            <button
                                                className="w-5 h-5 flex items-center justify-center text-primary font-bold hover:bg-white rounded transition-colors"
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                            >-</button>
                                            <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                                            <button
                                                className="w-5 h-5 flex items-center justify-center text-primary font-bold hover:bg-white rounded transition-colors"
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                            >+</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Price Breakdown */}
                    <div className="lg:w-96 flex-shrink-0">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-5 sticky top-24">
                            <h3 className="font-bold text-gray-800 mb-4 pb-2 border-b border-gray-100">Price Details</h3>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between text-gray-600">
                                    <span>Total Product Price</span>
                                    <span>₹{priceDetails.total}</span>
                                </div>
                                <div className="flex justify-between text-green-600 bg-green-50 p-2 rounded -mx-2">
                                    <span>Total Discounts</span>
                                    <span>-₹{priceDetails.discount(priceDetails.total)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Delivery Charges</span>
                                    <span className="text-green-600 font-medium">Free</span>
                                </div>
                                <div className="my-2 border-t border-dashed border-gray-200"></div>
                                <div className="flex justify-between items-center">
                                    <span className="font-bold text-lg text-gray-800">Order Total</span>
                                    <span className="font-bold text-lg text-gray-900">₹{finalTotal}</span>
                                </div>
                            </div>

                            <div className="mt-6">
                                <Button
                                    variant="primary"
                                    className="w-full h-12 text-md font-bold shadow-lg shadow-primary/20"
                                    onClick={() => navigate('/checkout')}
                                >
                                    Continue
                                </Button>
                                <p className="text-[10px] text-gray-400 text-center mt-3">
                                    By continuing, you agree to Styliqo's Terms of Use and Privacy Policy.
                                </p>
                            </div>
                        </div>

                        <div className="mt-4 flex justify-center opacity-60 grayscale hover:grayscale-0 transition-all">
                            <img src="https://images.meesho.com/images/marketing/1588578650850.png" alt="Trusted Payment" className="h-5" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartPage;
