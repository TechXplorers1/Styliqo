import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Trash2, Edit, Menu } from 'lucide-react';
import Button from '../components/common/Button';
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminStats from '../components/admin/AdminStats';
import OrderManagement from '../components/admin/OrderManagement';
import CustomersManagement from '../components/admin/CustomersManagement';
import ConfirmationModal from '../components/common/ConfirmationModal';
import SuccessModal from '../components/common/SuccessModal';
import { getProducts, deleteProduct, addProduct } from '../lib/firebase';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('dashboard');
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Modal state for delete only
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, productId: null, productName: '' });
    const [successModal, setSuccessModal] = useState({ isOpen: false, message: '' });

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

    const handleDeleteClick = (product) => {
        setDeleteModal({ isOpen: true, productId: product.id, productName: product.title });
    };

    const handleDeleteConfirm = async () => {
        try {
            await deleteProduct(deleteModal.productId);
            setSuccessModal({ isOpen: true, message: 'Product deleted successfully!' });
            // List updates automatically via onSnapshot
        } catch (error) {
            console.error("Error deleting product:", error);
            alert("Failed to delete product");
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
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                            <h2 className="text-2xl font-bold">Products</h2>
                            <Link to="/admin/add-product" className="w-full md:w-auto">
                                <Button variant="primary" className="w-full md:w-auto">
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
                                                                <div className="text-sm font-medium text-gray-900 line-clamp-1 max-w-[150px]">{product.title}</div>
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
                                                        <Link
                                                            to={`/admin/edit-product/${product.id}`}
                                                            className="text-indigo-600 hover:text-indigo-900 mr-4 inline-block"
                                                        >
                                                            <Edit className="w-5 h-5" />
                                                        </Link>
                                                        <button
                                                            onClick={() => handleDeleteClick(product)}
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
                return <CustomersManagement />;
            default:
                return null;
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-50 flex-col md:flex-row">
            {/* Mobile Header */}
            <div className="bg-white border-b p-4 md:hidden flex items-center justify-between shadow-sm sticky top-0 z-30">
                <button onClick={() => setIsSidebarOpen(true)} className="p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-full">
                    <Menu className="w-6 h-6" />
                </button>
                <span className="font-bold text-lg text-primary">Styliqo Admin</span>
                <div className="w-8"></div> {/* Spacer for center alignment */}
            </div>

            <AdminSidebar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />

            <div className="flex-1 p-4 md:p-8 overflow-y-auto h-screen">
                {renderContent()}
            </div>

            {/* Delete Confirmation Modal */}
            <ConfirmationModal
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ isOpen: false, productId: null, productName: '' })}
                onConfirm={handleDeleteConfirm}
                title="Delete Product?"
                message={`Are you sure you want to delete "${deleteModal.productName}"? This action cannot be undone.`}
                confirmText="Delete"
                confirmVariant="primary"
                cancelText="Cancel"
            />

            {/* Success Modal */}
            <SuccessModal
                isOpen={successModal.isOpen}
                onClose={() => setSuccessModal({ isOpen: false, message: '' })}
                title="Success!"
                message={successModal.message}
            />
        </div>
    );
};

export default AdminDashboard;
