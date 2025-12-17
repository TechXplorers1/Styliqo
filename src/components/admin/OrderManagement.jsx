import React, { useState, useEffect } from 'react';
import { getOrders, updateOrderStatus } from '../../lib/firebase';
import { Package, Truck, CheckCircle, Clock, XCircle, ShoppingBag } from 'lucide-react';
import Button from '../common/Button';
import ConfirmationModal from '../common/ConfirmationModal';

const OrderManagement = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('Ordered');

    const [confirmModal, setConfirmModal] = useState({
        isOpen: false,
        orderId: null,
        status: null,
        title: '',
        message: '',
        confirmText: 'Confirm',
        confirmVariant: 'primary'
    });

    useEffect(() => {
        const unsubscribe = getOrders(
            (data) => {
                // Sort by date descending
                setOrders(data.sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds));
                setLoading(false);
            },
            (error) => {
                console.error("Error fetching orders:", error);
                setLoading(false);
            }
        );
        return () => unsubscribe();
    }, []);

    const handleStatusUpdate = (orderId, newStatus) => {
        setConfirmModal({
            isOpen: true,
            orderId,
            status: newStatus,
            title: `Update Order Status`,
            message: `Are you sure you want to move this order to '${newStatus}'?`,
            confirmText: `Move to ${newStatus}`,
            confirmVariant: 'primary'
        });
    };

    const handleDecline = (orderId) => {
        setConfirmModal({
            isOpen: true,
            orderId,
            status: 'Declined',
            title: 'Decline Order',
            message: 'Are you sure you want to DECLINE this order?',
            confirmText: 'Decline Order',
            confirmVariant: 'danger'
        });
    };

    const executeStatusUpdate = async () => {
        const { orderId, status } = confirmModal;
        if (!orderId || !status) return;

        try {
            await updateOrderStatus(orderId, status);
        } catch (error) {
            console.error("Error updating status:", error);
            alert("Failed to update status");
        }
    };

    // Tabs map: Tab Name -> Filter Function
    const tabs = [
        { name: 'Ordered', filter: (status) => ['Ordered', 'pending', 'Upcoming', 'Approved', 'Packing'].includes(status) },
        { name: 'Shipped', filter: (status) => status === 'Shipping' },
        { name: 'Out for Delivery', filter: (status) => status === 'Out for Delivery' },
        { name: 'Delivered', filter: (status) => status === 'Delivered' },
    ];

    const filteredOrders = orders.filter(order => {
        const currentTab = tabs.find(t => t.name === activeTab);
        return currentTab ? currentTab.filter(order.status) : false;
    });

    const renderActionButtons = (order) => {
        switch (order.status) {
            case 'Ordered':
            case 'pending':
            case 'Upcoming':
                return (
                    <div className="flex gap-2">
                        <Button
                            variant="primary"
                            className="bg-green-600 hover:bg-green-700 text-sm py-1"
                            onClick={() => handleStatusUpdate(order.id, 'Shipping')}
                        >
                            Accept
                        </Button>
                        <Button
                            variant="outline"
                            className="text-red-600 border-red-200 hover:bg-red-50 text-sm py-1"
                            onClick={() => handleDecline(order.id)}
                        >
                            Decline
                        </Button>
                    </div>
                );
            case 'Approved': // Fallback for legacy orders
            case 'Packing':  // Fallback for legacy orders
                return (
                    <Button
                        variant="primary"
                        className="text-sm py-1"
                        onClick={() => handleStatusUpdate(order.id, 'Shipping')}
                    >
                        Move to Shipping
                    </Button>
                );
            case 'Shipping':
                return (
                    <Button
                        variant="primary"
                        className="text-sm py-1"
                        onClick={() => handleStatusUpdate(order.id, 'Out for Delivery')}
                    >
                        Out for Delivery
                    </Button>
                );
            case 'Out for Delivery':
                return (
                    <Button
                        variant="primary"
                        className="text-sm py-1"
                        onClick={() => handleStatusUpdate(order.id, 'Delivered')}
                    >
                        Delivered
                    </Button>
                );
            default:
                return null;
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6">Order Management</h2>

            {/* Tabs */}
            <div className="flex overflow-x-auto border-b mb-6 no-scrollbar pb-1">
                {tabs.map(tab => (
                    <button
                        key={tab.name}
                        onClick={() => setActiveTab(tab.name)}
                        className={`px-4 py-2 whitespace-nowrap font-medium transition-colors border-b-2 ${activeTab === tab.name
                            ? 'border-primary text-primary'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        {tab.name}
                    </button>
                ))}
            </div>

            {/* Order List */}
            {loading ? (
                <div className="text-center py-12">Loading orders...</div>
            ) : filteredOrders.length === 0 ? (
                <div className="bg-white p-8 rounded-lg shadow-sm text-center text-gray-500">
                    <ShoppingBag className="w-12 h-12 mx-auto mb-3 opacity-20" />
                    <p>No orders found in '{activeTab}'</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredOrders.map(order => (
                        <div key={order.id} className="bg-white border rounded-lg p-6 shadow-sm">
                            <div className="flex flex-col md:flex-row justify-between md:items-start gap-4 mb-4">
                                <div>
                                    <h3 className="font-bold text-lg text-gray-800">Order #{order.id.slice(-6).toUpperCase()}</h3>
                                    <p className="text-sm text-gray-500">Placed on: {new Date(order.createdAt?.seconds * 1000).toLocaleString()}</p>
                                    <p className="text-sm text-gray-500">User: {order.userEmail}</p>
                                </div>
                                <div className="text-right">
                                    <div className="font-bold text-xl text-primary">₹{order.totalAmount}</div>
                                    <div className="text-sm text-gray-500 capitalize">{order.paymentMethod}</div>
                                </div>
                            </div>

                            <div className="border-t border-b py-4 my-4">
                                <h4 className="font-semibold mb-2 text-sm text-gray-700">Items:</h4>
                                <div className="space-y-2">
                                    {order.items?.map((item, idx) => (
                                        <div key={idx} className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-gray-100 rounded overflow-hidden">
                                                <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex-1 text-sm">
                                                <span className="font-medium">{item.title}</span>
                                                <span className="text-gray-500 ml-2">x{item.quantity}</span>
                                            </div>
                                            <div className="text-sm font-medium">₹{item.price * item.quantity}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                                <div className="text-sm">
                                    <span className="font-semibold">Shipping to:</span> {order.shippingAddress?.name}, {order.shippingAddress?.city}
                                </div>
                                <div>
                                    {renderActionButtons(order)}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            {/* Confirmation Modal */}
            <ConfirmationModal
                isOpen={confirmModal.isOpen}
                onClose={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
                onConfirm={executeStatusUpdate}
                title={confirmModal.title}
                message={confirmModal.message}
                confirmText={confirmModal.confirmText}
                confirmVariant={confirmModal.confirmVariant}
            />
        </div>
    );
};

export default OrderManagement;
