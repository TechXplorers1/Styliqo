import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';
import { getUserAddresses } from '../lib/firebase';
import Button from '../components/common/Button';

const AddressesPage = () => {
    const { user, loading: authLoading } = useAuthStore();
    const navigate = useNavigate();
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Wait for auth to initialize
        if (authLoading) return;

        if (!user) {
            navigate('/login');
            return;
        }

        console.log("Fetching addresses for user:", user.uid);
        const unsubscribe = getUserAddresses(user.uid, (data) => {
            console.log("Addresses fetched:", data);
            setAddresses(data);
            setLoading(false);
        }, (error) => {
            console.error("Error loading addresses", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user, authLoading, navigate]);

    if (authLoading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-50 pb-20 md:pb-8">
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                {/* Header */}
                <div className="flex items-center mb-6">
                    <button onClick={() => navigate('/profile')} className="mr-4 p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <ArrowLeft className="w-5 h-5 text-gray-600" />
                    </button>
                    <h1 className="text-2xl font-bold text-gray-900">My Addresses</h1>
                </div>

                {loading ? (
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                        <p className="text-gray-500 mt-2">Loading addresses...</p>
                    </div>
                ) : addresses.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-sm p-8 text-center border border-dashed border-gray-200">
                        <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <h3 className="text-lg font-medium text-gray-900">No Addresses Found</h3>
                        <p className="text-gray-500 mb-6">You haven't saved any addresses yet.</p>
                        <Button onClick={() => navigate('/checkout')} variant="primary">
                            Add Address at Checkout
                        </Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {addresses.map(addr => (
                            <div key={addr.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 relative group">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start space-x-3">
                                        <div className="bg-green-50 p-2 rounded-full hidden sm:block">
                                            <MapPin className="w-5 h-5 text-green-600" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-bold text-gray-900">{addr.name}</h3>
                                                <span className="bg-gray-100 text-gray-600 text-[10px] px-1.5 py-0.5 rounded uppercase tracking-wide font-medium">Home</span>
                                            </div>
                                            <p className="text-sm text-gray-500 font-medium mt-0.5">{addr.phone}</p>

                                            <div className="mt-3 text-sm text-gray-600 leading-relaxed">
                                                <p>{addr.houseNo}, {addr.roadName}</p>
                                                <p>{addr.city}, {addr.state} - {addr.pinCode}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AddressesPage;
