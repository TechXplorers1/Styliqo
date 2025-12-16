import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { Lock, CreditCard, ShoppingBag, CheckCircle, ShieldCheck, Truck, MapPin, Plus, Check, ArrowRight, Package } from 'lucide-react';
import useCartStore from '../store/useCartStore';
import useAuthStore from '../store/useAuthStore';
import { addOrder, addUserAddress, getUserAddresses } from '../lib/firebase';

const CheckoutPage = () => {
    const navigate = useNavigate();
    const { items: cartItems, totalPrice, clearCart } = useCartStore();
    const { user } = useAuthStore();

    // Form States
    const [step, setStep] = useState(1); // 1: Address, 2: Payment, 3: Success
    const [addresses, setAddresses] = useState([]);
    const [selectedAddressId, setSelectedAddressId] = useState(null);
    const [showAddAddressForm, setShowAddAddressForm] = useState(false);

    // Form Data for new address
    const [formData, setFormData] = useState({
        name: user?.displayName || '',
        phone: '',
        houseNo: '',
        roadName: '',
        pinCode: '',
        city: '',
        state: '',
    });
    const [paymentMethod, setPaymentMethod] = useState('cod');
    const [isProcessing, setIsProcessing] = useState(false);
    const [isLoadingAddresses, setIsLoadingAddresses] = useState(true);

    useEffect(() => {
        if (cartItems.length === 0 && step !== 3) {
            navigate('/cart');
        }
    }, [cartItems, navigate, step]);

    // Fetch addresses on mount/user change
    useEffect(() => {
        if (user) {
            setIsLoadingAddresses(true);
            const unsubscribe = getUserAddresses(user.uid, (data) => {
                setAddresses(data);
                // Select default if not selected and data exists
                if (data.length > 0 && !selectedAddressId) {
                    setSelectedAddressId(data[0].id);
                }
                // Show form if no addresses
                if (data.length === 0) {
                    setShowAddAddressForm(true);
                } else {
                    setShowAddAddressForm(false);
                }
                setIsLoadingAddresses(false);
            }, (error) => {
                console.error("Error loading addresses", error);
                setIsLoadingAddresses(false);
            });
            return () => unsubscribe();
        }
    }, [user]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAddressSubmit = async (e) => {
        e.preventDefault();

        // Basic validation
        if (!formData.name || !formData.phone || !formData.houseNo || !formData.roadName || !formData.pinCode || !formData.city || !formData.state) {
            alert('Please fill in all address fields.');
            return;
        }

        try {
            const addedRef = await addUserAddress(user.uid, formData);
            setSelectedAddressId(addedRef.id); // Auto-select new address
            setShowAddAddressForm(false); // Hide form
            // Reset form for next use (keeping name/phone potentially)
            setFormData(prev => ({ ...prev, houseNo: '', roadName: '', pinCode: '', city: '', state: '' }));
        } catch (error) {
            console.error("Error saving address:", error);
            alert("Failed to save address.");
        }
    };

    const handleProceedToPayment = () => {
        if (!selectedAddressId) {
            alert("Please select a delivery address.");
            return;
        }
        setStep(2);
    };

    const handlePayment = async () => {
        if (!selectedAddressId) {
            alert("Please select a delivery address.");
            return;
        }

        setIsProcessing(true);

        try {
            const selectedAddress = addresses.find(addr => addr.id === selectedAddressId);

            if (!selectedAddress) {
                throw new Error("Selected address not found");
            }

            // Clean the order data to remove any undefined values
            const orderData = {
                userId: user.uid,
                userEmail: user.email,
                items: cartItems.map(item => ({
                    productId: item.id || '',
                    title: item.title || '',
                    price: item.price || 0,
                    quantity: item.quantity || 1,
                    selectedSize: item.selectedSize || 'Free Size',
                    image: item.image || ''
                })),
                totalAmount: totalAmount || 0,
                paymentMethod: paymentMethod || 'cod',
                shippingAddress: {
                    name: selectedAddress.name || '',
                    phone: selectedAddress.phone || '',
                    houseNo: selectedAddress.houseNo || '',
                    roadName: selectedAddress.roadName || '',
                    city: selectedAddress.city || '',
                    state: selectedAddress.state || '',
                    pinCode: selectedAddress.pinCode || ''
                },
                status: 'Ordered',
                createdAt: new Date().toISOString()
            };

            console.log("Order data being sent:", orderData);

            await addOrder(orderData);
            clearCart();
            setStep(3);
        } catch (error) {
            console.error("Error placing order:", error);
            console.error("Error details:", {
                message: error.message,
                code: error.code,
                stack: error.stack
            });
            alert("Failed to place order. Please try again.");
        } finally {
            setIsProcessing(false);
        }
    };

    const totalAmount = totalPrice();

    // Step Indicator Component
    const StepIndicator = () => (
        <div className="flex items-center justify-center mb-8">
            <div className="flex items-center gap-2">
                {/* Step 1 */}
                <div className={`flex items-center gap-2 ${step >= 1 ? 'text-pink-600' : 'text-gray-400'}`}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${step >= 1 ? 'bg-gradient-to-br from-pink-500 to-purple-500 text-white shadow-lg' : 'bg-gray-200'}`}>
                        {step > 1 ? <Check className="w-5 h-5" /> : '1'}
                    </div>
                    <span className="hidden md:inline font-medium">Address</span>
                </div>

                <div className={`w-12 h-1 rounded-full ${step >= 2 ? 'bg-gradient-to-r from-pink-500 to-purple-500' : 'bg-gray-200'}`}></div>

                {/* Step 2 */}
                <div className={`flex items-center gap-2 ${step >= 2 ? 'text-pink-600' : 'text-gray-400'}`}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${step >= 2 ? 'bg-gradient-to-br from-pink-500 to-purple-500 text-white shadow-lg' : 'bg-gray-200'}`}>
                        {step > 2 ? <Check className="w-5 h-5" /> : '2'}
                    </div>
                    <span className="hidden md:inline font-medium">Payment</span>
                </div>

                <div className={`w-12 h-1 rounded-full ${step >= 3 ? 'bg-gradient-to-r from-pink-500 to-purple-500' : 'bg-gray-200'}`}></div>

                {/* Step 3 */}
                <div className={`flex items-center gap-2 ${step >= 3 ? 'text-pink-600' : 'text-gray-400'}`}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${step >= 3 ? 'bg-gradient-to-br from-pink-500 to-purple-500 text-white shadow-lg' : 'bg-gray-200'}`}>
                        {step >= 3 ? <Check className="w-5 h-5" /> : '3'}
                    </div>
                    <span className="hidden md:inline font-medium">Success</span>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-pink-50/30 to-purple-50/30 pb-24 md:pb-12">
            {/* Header */}
            <div className="bg-white shadow-sm border-b border-gray-100">
                <div className="container mx-auto px-4 py-6 max-w-6xl">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-500 rounded-xl flex items-center justify-center">
                            <Lock className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Secure Checkout</h1>
                            <p className="text-sm text-gray-500">Complete your purchase safely</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 max-w-6xl pt-8">
                <StepIndicator />

                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Main Content */}
                    <div className="flex-1">
                        {/* Step 1: Address Selection */}
                        {step === 1 && (
                            <div className="space-y-4">
                                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                    <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                                        <div className="w-1 h-6 bg-gradient-to-b from-pink-500 to-purple-500 rounded-full mr-3"></div>
                                        Delivery Address
                                    </h2>

                                    {isLoadingAddresses ? (
                                        <div className="text-center py-8">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500 mx-auto"></div>
                                        </div>
                                    ) : (
                                        <>
                                            {/* Existing Addresses */}
                                            {addresses.length > 0 && (
                                                <div className="space-y-3 mb-6">
                                                    {addresses.map(addr => (
                                                        <label
                                                            key={addr.id}
                                                            className={`block border-2 rounded-xl p-4 cursor-pointer transition-all ${selectedAddressId === addr.id ? 'border-pink-500 bg-pink-50' : 'border-gray-200 hover:border-pink-200'}`}
                                                        >
                                                            <div className="flex items-start gap-3">
                                                                <input
                                                                    type="radio"
                                                                    name="address"
                                                                    checked={selectedAddressId === addr.id}
                                                                    onChange={() => setSelectedAddressId(addr.id)}
                                                                    className="mt-1 w-5 h-5 text-pink-600 focus:ring-pink-500"
                                                                />
                                                                <div className="flex-1">
                                                                    <div className="flex items-center gap-2 mb-2">
                                                                        <MapPin className="w-4 h-4 text-pink-600" />
                                                                        <span className="font-bold text-gray-900">{addr.name}</span>
                                                                        <span className="text-sm text-gray-500">• {addr.phone}</span>
                                                                    </div>
                                                                    <p className="text-sm text-gray-600 leading-relaxed">
                                                                        {addr.houseNo}, {addr.roadName}, {addr.city}, {addr.state} - {addr.pinCode}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </label>
                                                    ))}
                                                </div>
                                            )}

                                            {/* Add New Address Button */}
                                            {!showAddAddressForm && (
                                                <button
                                                    onClick={() => setShowAddAddressForm(true)}
                                                    className="w-full border-2 border-dashed border-gray-300 rounded-xl p-4 text-pink-600 font-bold hover:border-pink-500 hover:bg-pink-50 transition-all flex items-center justify-center gap-2"
                                                >
                                                    <Plus className="w-5 h-5" />
                                                    Add New Address
                                                </button>
                                            )}

                                            {/* Add Address Form */}
                                            {showAddAddressForm && (
                                                <form onSubmit={handleAddressSubmit} className="space-y-4 bg-gray-50 rounded-xl p-6 border border-gray-200">
                                                    <h3 className="font-bold text-gray-900 mb-4">New Delivery Address</h3>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <Input label="Full Name" name="name" placeholder="John Doe" value={formData.name} onChange={handleInputChange} required />
                                                        <Input label="Phone Number" name="phone" placeholder="9876543210" value={formData.phone} onChange={handleInputChange} required />
                                                    </div>
                                                    <Input label="House No. / Building Name" name="houseNo" placeholder="Flat 402, Sunshine Apts" value={formData.houseNo} onChange={handleInputChange} required />
                                                    <Input label="Road Name / Area / Colony" name="roadName" placeholder="MG Road, Indiranagar" value={formData.roadName} onChange={handleInputChange} required />
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <Input label="Pin Code" name="pinCode" placeholder="560038" value={formData.pinCode} onChange={handleInputChange} required />
                                                        <Input label="City" name="city" placeholder="Bangalore" value={formData.city} onChange={handleInputChange} required />
                                                    </div>
                                                    <Input label="State" name="state" placeholder="Karnataka" value={formData.state} onChange={handleInputChange} required />

                                                    <div className="flex gap-3 pt-4">
                                                        {addresses.length > 0 && (
                                                            <Button type="button" onClick={() => setShowAddAddressForm(false)} variant="outline" className="flex-1 h-12">Cancel</Button>
                                                        )}
                                                        <Button type="submit" variant="primary" className="flex-1 h-12 shadow-lg">Save Address</Button>
                                                    </div>
                                                </form>
                                            )}
                                        </>
                                    )}
                                </div>

                                <Button
                                    onClick={handleProceedToPayment}
                                    variant="primary"
                                    className="w-full h-14 text-base font-bold shadow-lg group"
                                    disabled={!selectedAddressId}
                                >
                                    Continue to Payment
                                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </div>
                        )}

                        {/* Step 2: Payment Method */}
                        {step === 2 && (
                            <div className="space-y-4">
                                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                    <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                                        <div className="w-1 h-6 bg-gradient-to-b from-pink-500 to-purple-500 rounded-full mr-3"></div>
                                        Payment Method
                                    </h2>

                                    <div className="space-y-3">
                                        {/* Cash on Delivery */}
                                        <label className={`border-2 rounded-xl p-5 flex items-center cursor-pointer transition-all ${paymentMethod === 'cod' ? 'border-pink-500 bg-pink-50' : 'border-gray-200 hover:border-pink-200'}`}>
                                            <input
                                                type="radio"
                                                name="payment"
                                                value="cod"
                                                className="w-5 h-5 text-pink-600 focus:ring-pink-500"
                                                checked={paymentMethod === 'cod'}
                                                onChange={() => setPaymentMethod('cod')}
                                            />
                                            <div className="ml-4 flex-1">
                                                <div className="flex items-center gap-2">
                                                    <Package className="w-5 h-5 text-pink-600" />
                                                    <span className="font-bold text-gray-900">Cash on Delivery</span>
                                                </div>
                                                <p className="text-sm text-gray-500 mt-1">Pay when you receive the order</p>
                                            </div>
                                        </label>

                                        {/* Online Payment (Disabled) */}
                                        <label className="border-2 border-gray-200 rounded-xl p-5 flex items-center opacity-50 cursor-not-allowed">
                                            <input
                                                type="radio"
                                                name="payment"
                                                className="w-5 h-5"
                                                disabled
                                            />
                                            <div className="ml-4 flex-1">
                                                <div className="flex items-center gap-2">
                                                    <CreditCard className="w-5 h-5 text-gray-400" />
                                                    <span className="font-bold text-gray-700">Online Payment</span>
                                                    <span className="bg-gray-200 text-gray-600 text-xs px-2 py-1 rounded-full">Coming Soon</span>
                                                </div>
                                                <p className="text-sm text-gray-400 mt-1">UPI, Cards, Net Banking</p>
                                            </div>
                                        </label>
                                    </div>
                                </div>

                                <Button
                                    onClick={handlePayment}
                                    variant="primary"
                                    className="w-full h-14 text-base font-bold shadow-lg group"
                                    disabled={isProcessing}
                                >
                                    {isProcessing ? (
                                        <>
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            Place Order
                                            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </Button>
                            </div>
                        )}

                        {/* Step 3: Success */}
                        {step === 3 && (
                            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 text-center">
                                <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                                    <CheckCircle className="w-14 h-14 text-white" />
                                </div>
                                <h2 className="text-3xl font-bold text-gray-900 mb-3">Order Placed Successfully!</h2>
                                <p className="text-gray-600 mb-8 max-w-md mx-auto">Thank you for your purchase. Your order will be delivered soon. We've sent a confirmation email to {user?.email}</p>
                                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                    <Button onClick={() => navigate('/orders')} variant="primary" className="h-12 px-8 shadow-lg">
                                        View Orders
                                    </Button>
                                    <Button onClick={() => navigate('/')} variant="outline" className="h-12 px-8">
                                        Continue Shopping
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Order Summary Sidebar */}
                    <div className="lg:w-96 flex-shrink-0">
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sticky top-24">
                            <h2 className="font-bold text-gray-900 text-lg mb-5 flex items-center">
                                <div className="w-1 h-6 bg-gradient-to-b from-pink-500 to-purple-500 rounded-full mr-3"></div>
                                Order Summary
                            </h2>

                            {/* Cart Items */}
                            <div className="space-y-3 mb-6 max-h-60 overflow-y-auto pr-2">
                                {cartItems.map(item => (
                                    <div key={item.id} className="flex gap-3">
                                        <div className="w-16 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                            <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900 line-clamp-2">{item.title}</p>
                                            <p className="text-xs text-gray-500 mt-1">Size: {item.selectedSize || 'Free'} • Qty: {item.quantity}</p>
                                        </div>
                                        <div className="font-bold text-sm text-gray-900">₹{item.price * item.quantity}</div>
                                    </div>
                                ))}
                            </div>

                            {/* Price Breakdown */}
                            <div className="space-y-3 text-sm border-t border-gray-200 pt-4">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal ({cartItems.length} items)</span>
                                    <span className="font-medium">₹{totalAmount}</span>
                                </div>
                                <div className="flex justify-between text-green-600 bg-green-50 p-3 rounded-xl">
                                    <span className="font-medium">Discount</span>
                                    <span className="font-bold">-₹{Math.floor(totalAmount * 0.1)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Delivery</span>
                                    <span className="font-bold text-green-600">FREE</span>
                                </div>
                                <div className="border-t-2 border-dashed border-gray-200 my-3"></div>
                                <div className="flex justify-between items-center bg-gradient-to-r from-pink-50 to-purple-50 p-4 rounded-xl">
                                    <span className="font-bold text-gray-900 text-base">Total</span>
                                    <span className="font-bold text-2xl text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600">
                                        ₹{totalAmount}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Trust Badges */}
                        <div className="mt-4 space-y-3">
                            <div className="bg-blue-50 rounded-xl p-4 flex items-center gap-3 border border-blue-100">
                                <ShieldCheck className="w-6 h-6 text-blue-600 flex-shrink-0" />
                                <div>
                                    <h4 className="font-bold text-blue-900 text-sm">Safe & Secure</h4>
                                    <p className="text-xs text-blue-600">100% secure payment</p>
                                </div>
                            </div>
                            <div className="bg-green-50 rounded-xl p-4 flex items-center gap-3 border border-green-100">
                                <Truck className="w-6 h-6 text-green-600 flex-shrink-0" />
                                <div>
                                    <h4 className="font-bold text-green-900 text-sm">Free Delivery</h4>
                                    <p className="text-xs text-green-600">On all orders</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
