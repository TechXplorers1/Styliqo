import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Package, Truck, CheckCircle, Clock, ChevronLeft } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';
import { getUserOrders } from '../lib/firebase';
import LazyImage from '../components/common/LazyImage';

const OrdersPage = () => {
    const { user } = useAuthStore();
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        const unsubscribe = getUserOrders(user.uid, (data) => {
            // Sort by date desc
            const sorted = data.sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds);
            setOrders(sorted);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching orders:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user, navigate]);

    const getStatusStep = (status) => {
        switch (status) {
            case 'Ordered': return 1;
            case 'Upcoming': return 1;
            case 'Approved': return 1;
            case 'Packing': return 1;
            case 'Shipped': return 2;
            case 'Shipping': return 2; // Handle new status from Admin
            case 'Out for Delivery': return 3;
            case 'Delivered': return 4;
            default: return 0;
        }
    };

    // Helper to format date safely
    const formatDate = (timestamp) => {
        if (!timestamp) return 'Date N/A';
        // Handle Firestore Timestamp or JS Date
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        return date.toLocaleDateString();
    };

    // Helper to format status text
    const formatStatus = (status) => {
        if (status === 'Upcoming') return 'Ordered';
        return status;
    };

    // Helper to get status color
    const getStatusColor = (status) => {
        if (status === 'Declined') return 'bg-red-100 text-red-600';
        return 'bg-green-100 text-green-600'; // Green for all active statuses
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 dark:bg-gray-900">
            <div className="container mx-auto px-4 max-w-4xl">
                {/* Header */}
                <div className="flex items-center mb-6">
                    <Link to="/profile" className="mr-4 p-2 hover:bg-white rounded-full transition-colors dark:hover:bg-gray-800">
                        <ChevronLeft className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white">My Orders</h1>
                </div>

                {orders.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-sm p-12 text-center dark:bg-gray-800">
                        <Package className="w-16 h-16 text-gray-300 mx-auto mb-4 dark:text-gray-600" />
                        <h2 className="text-xl font-bold text-gray-800 mb-2 dark:text-white">No orders yet</h2>
                        <p className="text-gray-500 mb-6 dark:text-gray-400">Start shopping to see your orders here!</p>
                        <Link to="/" className="inline-block bg-primary text-white font-bold py-3 px-8 rounded-lg hover:bg-primary/90 transition-colors">
                            Start Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => {
                            const currentStep = getStatusStep(order.status);
                            const isDeclined = order.status === 'Declined';

                            return (
                                <div key={order.id} className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 dark:bg-gray-800 dark:border-gray-700">
                                    {/* Order Header */}
                                    <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex flex-wrap justify-between items-center gap-4 dark:bg-gray-700/50 dark:border-gray-700">
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase font-bold tracking-wide dark:text-gray-400">Order ID</p>
                                            <p className="font-mono font-medium text-gray-800 dark:text-gray-200">#{order.id.slice(0, 8)}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase font-bold tracking-wide dark:text-gray-400">Date</p>
                                            <p className="text-sm text-gray-800 dark:text-gray-200">{formatDate(order.createdAt)}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase font-bold tracking-wide dark:text-gray-400">Total Amount</p>
                                            <p className="font-bold text-primary">₹{order.totalAmount}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase font-bold tracking-wide dark:text-gray-400">Status</p>
                                            <span className={`inline-block px-2 py-1 text-xs font-bold rounded ${getStatusColor(order.status)}`}>
                                                {formatStatus(order.status)}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Tracking Stepper - Hide if declined */}
                                    {!isDeclined && (
                                        <div className="px-6 py-6 border-b border-gray-100 hidden md:block dark:border-gray-700">
                                            <div className="relative">
                                                {/* Progress Bar Background */}
                                                <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -translate-y-1/2 z-0"></div>
                                                {/* Active Progress */}
                                                <div
                                                    className="absolute top-1/2 left-0 h-1 bg-green-500 -translate-y-1/2 z-0 transition-all duration-500"
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
                                                                    : 'bg-white border-gray-300 text-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-500'
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
                                    )}

                                    {/* Order Items */}
                                    <div className="p-6">
                                        <h3 className="font-bold text-gray-800 mb-4 text-sm dark:text-white">Items in this order</h3>
                                        <div className="space-y-4">
                                            {order.items.map((item, index) => (
                                                <div key={index} className="flex items-start gap-4">
                                                    <div className="w-20 h-24 rounded-md overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-200 dark:border-gray-600 dark:bg-gray-700">
                                                        <LazyImage src={item.image} alt={item.title} className="w-full h-full object-cover" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <h4 className="font-medium text-gray-800 text-sm md:text-base line-clamp-2 dark:text-gray-200">{item.title}</h4>
                                                        <p className="text-gray-500 text-xs mt-1 dark:text-gray-400">Size: {item.selectedSize || 'N/A'} | Qty: {item.quantity}</p>
                                                        <p className="font-bold text-gray-900 mt-2 dark:text-white">₹{item.price}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
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
