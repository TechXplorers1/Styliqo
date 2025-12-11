import React from 'react';
import { Link } from 'react-router-dom';
import { Package, Truck, CheckCircle, Clock, ChevronLeft } from 'lucide-react';
import useOrderStore from '../store/useOrderStore';
import LazyImage from '../components/common/LazyImage';

const OrdersPage = () => {
    const orders = useOrderStore(state => state.orders);

    const getStatusStep = (status) => {
        switch (status) {
            case 'Processing': return 1;
            case 'Shipped': return 2;
            case 'Out for Delivery': return 3;
            case 'Delivered': return 4;
            default: return 1;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4 max-w-4xl">
                {/* Header */}
                <div className="flex items-center mb-6">
                    <Link to="/profile" className="mr-4 p-2 hover:bg-white rounded-full transition-colors">
                        <ChevronLeft className="w-6 h-6 text-gray-600" />
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-800">My Orders</h1>
                </div>

                {orders.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                        <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h2 className="text-xl font-bold text-gray-800 mb-2">No orders yet</h2>
                        <p className="text-gray-500 mb-6">Start shopping to see your orders here!</p>
                        <Link to="/" className="inline-block bg-primary text-white font-bold py-3 px-8 rounded-lg hover:bg-primary/90 transition-colors">
                            Start Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => {
                            const currentStep = getStatusStep(order.status);

                            return (
                                <div key={order.id} className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
                                    {/* Order Header */}
                                    <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex flex-wrap justify-between items-center gap-4">
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase font-bold tracking-wide">Order ID</p>
                                            <p className="font-mono font-medium text-gray-800">#{order.id}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase font-bold tracking-wide">Date</p>
                                            <p className="text-sm text-gray-800">{new Date(order.date).toLocaleDateString()}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase font-bold tracking-wide">Total Amount</p>
                                            <p className="font-bold text-primary">₹{order.total}</p>
                                        </div>
                                    </div>

                                    {/* Tracking Stepper */}
                                    <div className="px-6 py-6 border-b border-gray-100">
                                        <div className="relative">
                                            {/* Progress Bar Background */}
                                            <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -translate-y-1/2 z-0 hidden md:block"></div>
                                            {/* Active Progress */}
                                            <div
                                                className="absolute top-1/2 left-0 h-1 bg-green-500 -translate-y-1/2 z-0 transition-all duration-500 hidden md:block"
                                                style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
                                            ></div>

                                            <div className="flex justify-between relative z-10">
                                                {['Ordered', 'Shipped', 'Out for Delivery', 'Delivered'].map((step, index) => {
                                                    const stepNum = index + 1;
                                                    const isCompleted = stepNum <= currentStep;
                                                    const isCurrent = stepNum === currentStep;

                                                    return (
                                                        <div key={step} className="flex flex-col items-center">
                                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${isCompleted
                                                                    ? 'bg-green-500 border-green-500 text-white'
                                                                    : 'bg-white border-gray-300 text-gray-300'
                                                                }`}>
                                                                {isCompleted ? <CheckCircle className="w-5 h-5" /> : <Clock className="w-4 h-4" />}
                                                            </div>
                                                            <span className={`text-xs mt-2 font-medium ${isCurrent ? 'text-green-600' : 'text-gray-400'}`}>
                                                                {step}
                                                            </span>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Order Items */}
                                    <div className="p-6">
                                        <h3 className="font-bold text-gray-800 mb-4 text-sm">Items in this order</h3>
                                        <div className="space-y-4">
                                            {order.items.map((item, index) => (
                                                <div key={index} className="flex items-start gap-4">
                                                    <div className="w-20 h-24 rounded-md overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-200">
                                                        <LazyImage src={item.image} alt={item.title} className="w-full h-full object-cover" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <h4 className="font-medium text-gray-800 text-sm md:text-base line-clamp-2">{item.title}</h4>
                                                        <p className="text-gray-500 text-xs mt-1">Size: {item.selectedSize || 'N/A'} | Qty: {item.quantity}</p>
                                                        <p className="font-bold text-gray-900 mt-2">₹{item.price}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Footer Actions */}
                                    {order.status === 'Delivered' && (
                                        <div className="px-6 py-4 bg-gray-50 text-right">
                                            <button className="text-primary text-sm font-bold hover:underline">Write a Review</button>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrdersPage;
