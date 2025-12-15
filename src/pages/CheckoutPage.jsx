import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { Lock, CreditCard, ShoppingBag, CheckCircle, ShieldCheck, Truck } from 'lucide-react';
import useCartStore from '../store/useCartStore';
import useAuthStore from '../store/useAuthStore';
import { addOrder } from '../lib/firebase';

const CheckoutPage = () => {
    const navigate = useNavigate();
    const { items: cartItems, totalPrice, clearCart } = useCartStore();
    // const addOrder = useOrderStore(state => state.addOrder); // Removed local store
    const { user } = useAuthStore();

    // Form States
    const [step, setStep] = useState(1); // 1: Address, 2: Payment, 3: Success
    const [formData, setFormData] = useState({
        name: user?.displayName || '', // Changed to displayName based on user object structure
        phone: '',
        houseNo: '',
        roadName: '',
        pinCode: '',
        city: '',
        state: '',
    });
    const [paymentMethod, setPaymentMethod] = useState('cod');
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        if (cartItems.length === 0 && step !== 3) {
            navigate('/cart');
        }
    }, [cartItems, navigate, step]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAddressSubmit = (e) => {
        e.preventDefault();
        // Basic validation
        if (!formData.name || !formData.phone || !formData.houseNo || !formData.roadName || !formData.pinCode || !formData.city || !formData.state) {
            alert('Please fill in all address fields.');
            return;
        }
        setStep(2);
    };

    const handlePayment = async () => {
        setIsProcessing(true);

        try {
            // Create Order Object
            const newOrder = {
                userId: user?.uid || 'guest',
                userEmail: user?.email || 'guest@example.com',
                status: 'Upcoming', // Use 'Upcoming' as the initial status for Admin to accept
                items: cartItems,
                totalAmount: totalPrice(),
                shippingAddress: formData,
                paymentMethod: paymentMethod,
                updatedAt: new Date()
            };

            await addOrder(newOrder); // Call Firebase function

            clearCart();
            setStep(3);
            window.scrollTo(0, 0);
        } catch (error) {
            console.error("Order Placement Error:", error);
            alert("Failed to place order. Please try again.");
        } finally {
            setIsProcessing(false);
        }
    };

    const totalAmount = totalPrice();

    return (
        <div className="min-h-screen bg-background pb-12">
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold mb-8">Checkout</h1>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Left Column: Forms */}
                    <div className="flex-1 space-y-6">
                        {/* Stepper */}
                        <div className="flex items-center justify-between mb-8">
                            <div className={`flex items-center space-x-2 ${step >= 1 ? 'text-primary' : 'text-gray-400'}`}>
                                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold ${step >= 1 ? 'border-primary bg-pink-50' : 'border-gray-300'}`}>1</div>
                                <span className="font-bold">Address</span>
                            </div>
                            <div className="flex-1 border-t-2 border-dashed border-gray-200 mx-4"></div>
                            <div className={`flex items-center space-x-2 ${step >= 2 ? 'text-primary' : 'text-gray-400'}`}>
                                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold ${step >= 2 ? 'border-primary bg-pink-50' : 'border-gray-300'}`}>2</div>
                                <span className="font-bold">Payment</span>
                            </div>
                            <div className="flex-1 border-t-2 border-dashed border-gray-200 mx-4"></div>
                            <div className={`flex items-center space-x-2 ${step >= 3 ? 'text-primary' : 'text-gray-400'}`}>
                                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold ${step >= 3 ? 'border-primary bg-pink-50' : 'border-gray-300'}`}>3</div>
                                <span className="font-bold">Confirmation</span>
                            </div>
                        </div>

                        {step === 1 && (
                            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                                <h2 className="text-lg font-bold mb-4 flex items-center">
                                    <span className="bg-blue-50 text-blue-600 p-1 rounded mr-2"><Truck className="w-5 h-5" /></span>
                                    Delivery Address
                                </h2>
                                <form onSubmit={handleAddressSubmit} className="space-y-4">
                                    <Input label="Name" name="name" placeholder="John Doe" value={formData.name} onChange={handleInputChange} required />
                                    <Input label="Phone Number" name="phone" placeholder="9876543210" value={formData.phone} onChange={handleInputChange} required />
                                    <Input label="House No. / Building Name" name="houseNo" placeholder="Flat 402, Sunshine Apts" value={formData.houseNo} onChange={handleInputChange} required />
                                    <Input label="Road Name / Area / Colony" name="roadName" placeholder="MG Road, Indiranagar" value={formData.roadName} onChange={handleInputChange} required />
                                    <div className="grid grid-cols-2 gap-4">
                                        <Input label="Pin Code" name="pinCode" placeholder="560038" value={formData.pinCode} onChange={handleInputChange} required />
                                        <Input label="City" name="city" placeholder="Bangalore" value={formData.city} onChange={handleInputChange} required />
                                    </div>
                                    <Input label="State" name="state" placeholder="Karnataka" value={formData.state} onChange={handleInputChange} required />

                                    <Button type="submit" variant="primary" className="w-full mt-4 h-12 text-md shadow-lg">Save Address and Continue</Button>
                                </form>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                                <h2 className="text-lg font-bold mb-6">Select Payment Method</h2>

                                <div className="space-y-4">
                                    <label className={`border p-4 rounded-lg flex items-center cursor-pointer transition-all ${paymentMethod === 'cod' ? 'border-primary bg-pink-50' : 'border-gray-200 hover:border-gray-300'}`}>
                                        <div className="relative flex items-center">
                                            <input type="radio" name="payment" value="cod" className="peer w-5 h-5 border-2 border-gray-300 rounded-full text-primary focus:ring-0 checked:bg-primary checked:border-primary" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} />
                                        </div>
                                        <div className="ml-4">
                                            <span className="font-bold text-gray-800 block">Cash on Delivery</span>
                                            <span className="text-xs text-gray-500">Pay when you receive the order</span>
                                        </div>
                                    </label>

                                    <label className="border p-4 rounded-lg flex items-center cursor-pointer opacity-60">
                                        <div className="relative flex items-center">
                                            <input type="radio" name="payment" className="peer w-5 h-5 border-2 border-gray-300 rounded-full" disabled />
                                        </div>
                                        <div className="ml-4">
                                            <span className="font-bold text-gray-800 block flex items-center">Online Payment <span className="ml-2 bg-gray-100 text-gray-500 text-[10px] px-1 rounded">Coming Soon</span></span>
                                            <span className="text-xs text-gray-500">UPI, Cards, Net Banking</span>
                                        </div>
                                    </label>
                                </div>

                                <Button onClick={handlePayment} variant="primary" className="w-full mt-8 h-12 text-md shadow-lg" disabled={isProcessing}>
                                    {isProcessing ? 'Processing...' : 'Place Order'}
                                </Button>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 text-center">
                                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                                <h2 className="text-2xl font-bold mb-2">Order Placed Successfully!</h2>
                                <p className="text-gray-600 mb-6">Thank you for your purchase. Your order will be delivered soon.</p>
                                <Button onClick={() => navigate('/orders')} variant="primary" className="h-12 text-md shadow-lg mr-4">View Orders</Button>
                                <Button onClick={() => navigate('/')} variant="secondary" className="h-12 text-md shadow-lg">Continue Shopping</Button>
                            </div>
                        )}
                    </div>

                    {/* Right Column: Order Summary */}
                    <div className="w-full lg:w-96">
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 sticky top-24">
                            <h2 className="font-bold text-gray-800 mb-4 flex items-center">
                                <ShoppingBag className="w-5 h-5 mr-2 text-primary" /> Order Summary
                            </h2>

                            <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2">
                                {cartItems.map(item => (
                                    <div key={item.id} className="flex gap-3">
                                        <div className="w-16 h-20 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                                            <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-gray-800 line-clamp-2">{item.title}</p>
                                            <p className="text-xs text-gray-500 mt-1">Size: {item.selectedSize || 'N/A'}</p>
                                            <p className="text-xs font-bold mt-1">Qty: {item.quantity}</p>
                                        </div>
                                        <div className="font-bold text-sm">₹{item.price * item.quantity}</div>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between text-gray-600">
                                    <span>Total Product Price</span>
                                    <span>₹{totalAmount}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Total Discounts</span>
                                    <span className="text-green-600">- ₹{Math.floor(totalAmount * 0.1)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Delivery Charges</span>
                                    <span className="text-green-600">Free</span>
                                </div>
                                <div className="my-2 border-t border-dashed border-gray-200"></div>
                                <div className="flex justify-between items-center">
                                    <span className="font-bold text-lg text-gray-800">Order Total</span>
                                    <span className="font-bold text-lg text-gray-900">₹{totalAmount}</span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-4 bg-blue-50 p-4 rounded-lg flex items-start gap-3">
                            <ShieldCheck className="w-5 h-5 text-blue-600 mt-0.5" />
                            <div>
                                <h4 className="font-bold text-blue-800 text-sm">Safe & Secure Payment</h4>
                                <p className="text-xs text-blue-600 mt-1">100% authentic products. Easy returns.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
