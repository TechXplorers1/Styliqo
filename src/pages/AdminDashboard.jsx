import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Trash2, Edit } from 'lucide-react';
import Button from '../components/common/Button';
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminStats from '../components/admin/AdminStats';
import OrderManagement from '../components/admin/OrderManagement';
import { getProducts, deleteProduct, addProduct } from '../lib/firebase';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (activeTab === 'products') {
            const unsubscribe = getProducts(
                (data) => {
                    setProducts(data);
                    setLoading(false);
                },
                (error) => {
                    console.error("Error fetching products:", error);
                    setLoading(false);
                }
            );
            return () => unsubscribe();
        }
    }, [activeTab]);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await deleteProduct(id);
                // List updates automatically via onSnapshot
            } catch (error) {
                console.error("Error deleting product:", error);
                alert("Failed to delete product");
            }
        }
    };

    const handleRemoveDuplicates = async () => {
        if (window.confirm('This will remove duplicate products based on their Title. Continue?')) {
            setLoading(true);
            try {
                const uniqueTitles = new Set();
                const duplicates = [];

                // Identify duplicates
                products.forEach(product => {
                    const normalizedTitle = product.title.trim().toLowerCase();
                    if (uniqueTitles.has(normalizedTitle)) {
                        duplicates.push(product.id);
                    } else {
                        uniqueTitles.add(normalizedTitle);
                    }
                });

                if (duplicates.length === 0) {
                    alert("No duplicates found.");
                    setLoading(false);
                    return;
                }

                // Delete duplicates
                let count = 0;
                for (const id of duplicates) {
                    await deleteProduct(id);
                    count++;
                }

                alert(`Successfully removed ${count} duplicate products.`);
            } catch (error) {
                console.error("Error removing duplicates:", error);
                alert("Failed to remove duplicates: " + error.message);
            } finally {
                setLoading(false);
            }
        }
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard':
                return (
                    <div>
                        <h2 className="text-2xl font-bold mb-6">Dashboard Overview</h2>
                        <AdminStats />

                        <div className="mt-8">
                            <h3 className="text-lg font-bold mb-4">Recent Transactions</h3>
                            {/* Placeholder for transactions */}
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center text-gray-500">
                                No recent transactions
                            </div>
                        </div>
                    </div>
                );
            case 'products':
                return (
                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold">Products</h2>
                            <Link to="/admin/add-product">
                                <Button variant="primary">
                                    <Plus className="w-5 h-5 mr-2" />
                                    Add New Product
                                </Button>
                            </Link>
                        </div>

                        <div className="bg-white rounded-lg shadow overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">S.No</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {loading ? (
                                            <tr>
                                                <td colSpan="5" className="px-6 py-4 text-center">Loading products...</td>
                                            </tr>
                                        ) : products.length === 0 ? (
                                            <tr>
                                                <td colSpan="5" className="px-6 py-4 text-center">No products found</td>
                                            </tr>
                                        ) : (
                                            products.map((product, index) => (
                                                <tr key={product.id}>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {index + 1}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <div className="h-10 w-10 flex-shrink-0">
                                                                <img className="h-10 w-10 rounded-full object-cover" src={product.image} alt="" />
                                                            </div>
                                                            <div className="ml-4">
                                                                <div className="text-sm font-medium text-gray-900">{product.title}</div>
                                                                {/* <div className="text-sm text-gray-500">ID: {product.id}</div> */}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        ₹{product.price}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {product.category}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                        <Link to={`/admin/edit-product/${product.id}`} className="text-indigo-600 hover:text-indigo-900 mr-4 inline-block">
                                                            <Edit className="w-5 h-5" />
                                                        </Link>
                                                        <button
                                                            onClick={() => handleDelete(product.id)}
                                                            className="text-red-600 hover:text-red-900"
                                                        >
                                                            <Trash2 className="w-5 h-5" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                );
            case 'orders':
                return <OrderManagement />;
            case 'customers':
            case 'analytics':
                return (
                    <div className="flex flex-col items-center justify-center h-full min-h-[400px]">
                        <h2 className="text-2xl font-bold text-gray-300">Coming Soon</h2>
                        <p className="text-gray-400 mt-2">This feature is under development</p>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-50">
            <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
            <div className="flex-1 p-8 overflow-y-auto h-screen">
                {renderContent()}
            </div>
        </div>
    );
};

export default AdminDashboard;
