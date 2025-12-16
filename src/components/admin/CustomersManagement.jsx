import React, { useState, useEffect } from 'react';
import { getUsers, getOrders } from '../../lib/firebase';
import { Users, User, Calendar } from 'lucide-react';

const CustomersManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let unsubscribeUsers = () => { };
        let unsubscribeOrders = () => { };
        let fetchedUsers = [];
        let fetchedOrders = [];
        let usersLoaded = false;
        let ordersLoaded = false;

        const mergeAndSetUsers = () => {
            if (!usersLoaded || !ordersLoaded) return;

            const userMap = new Map();

            // 1. Add all registered users
            fetchedUsers.forEach(u => {
                if (u.email !== 'admin@gmail.com') {
                    userMap.set(u.uid || u.id, u);
                }
            });

            // 2. Add users from orders if not already present
            fetchedOrders.forEach(order => {
                const userId = order.userId;
                // Basic validation
                if (userId && !userMap.has(userId) && order.userEmail !== 'admin@gmail.com') {
                    // Create a synthetic user object from order details
                    userMap.set(userId, {
                        id: userId,
                        uid: userId,
                        displayName: order.shippingAddress?.name || order.userEmail?.split('@')[0] || 'Unknown',
                        email: order.userEmail,
                        role: 'customer', // Distinguish these if needed, or just use 'user'
                        createdAt: order.createdAt // Best guess for join date is first order date
                    });
                }
            });

            // Convert to array and sort
            const unifiedUsers = Array.from(userMap.values()).sort((a, b) => {
                const dateA = a.createdAt?.seconds ? new Date(a.createdAt.seconds * 1000) : new Date(a.createdAt || 0);
                const dateB = b.createdAt?.seconds ? new Date(b.createdAt.seconds * 1000) : new Date(b.createdAt || 0);
                return dateB - dateA;
            });

            setUsers(unifiedUsers);
            setLoading(false);
        };

        // Fetch Users
        unsubscribeUsers = getUsers(
            (data) => {
                fetchedUsers = data;
                usersLoaded = true;
                mergeAndSetUsers();
            },
            (error) => {
                console.error("Error fetching users:", error);
                usersLoaded = true; // Proceed anyway
                mergeAndSetUsers();
            }
        );

        // Fetch Orders
        unsubscribeOrders = getOrders(
            (data) => {
                fetchedOrders = data;
                ordersLoaded = true;
                mergeAndSetUsers();
            },
            (error) => {
                console.error("Error fetching orders:", error);
                ordersLoaded = true;
                mergeAndSetUsers();
            }
        );

        return () => {
            unsubscribeUsers();
            unsubscribeOrders();
        };
    }, []);

    const formatDate = (timestamp) => {
        if (!timestamp) return 'N/A';
        // Handle Firestore Timestamp or JS ISO string or Date object
        let date;
        if (timestamp.toDate) {
            date = timestamp.toDate();
        } else {
            date = new Date(timestamp);
        }
        return isNaN(date.getTime()) ? 'N/A' : date.toLocaleDateString();
    };

    if (loading) return <div className="text-center py-12">Loading customers...</div>;

    if (users.length === 0) {
        return (
            <div className="bg-white p-8 rounded-lg shadow-sm text-center text-gray-500">
                <Users className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p>No customers found.</p>
            </div>
        );
    }

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6">Customers</h2>
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Join/First Order Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {users.map((user) => (
                                <tr key={user.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                                                <User className="w-5 h-5" />
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">{user.displayName || 'N/A'}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {user.email}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <div className="flex items-center">
                                            <Calendar className="w-4 h-4 mr-2 opacity-50" />
                                            {formatDate(user.createdAt)}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === 'customer' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                                            {user.role === 'customer' ? 'Customer' : 'User'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default CustomersManagement;
