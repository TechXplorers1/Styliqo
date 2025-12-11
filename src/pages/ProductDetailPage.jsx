import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { products } from '../data/mockData';
import { Star, ShoppingCart, Truck, ShieldCheck, RefreshCcw } from 'lucide-react';
import Button from '../components/common/Button';
import LazyImage from '../components/common/LazyImage';
import useCartStore from '../store/useCartStore';

const ProductDetailPage = () => {
    const { id } = useParams();
    const addToCart = useCartStore(state => state.addItem);
    const [selectedSize, setSelectedSize] = useState('');

    // Find product (parse ID because we mocked dupes with strings)
    const product = products.find(p => p.id == parseInt(id)) || products[0];

    const handleAddToCart = () => {
        if (!selectedSize) {
            alert('Please select a size');
            return;
        }
        addToCart({ ...product, selectedSize });
    };

    if (!product) return <div>Product not found</div>;

    return (
        <div className="bg-white min-h-screen pb-24 md:pb-8">
            <div className="max-w-6xl mx-auto md:flex md:space-x-8">
                {/* Desktop Sticky Image Section */}
                <div className="md:w-5/12 lg:w-4/12 md:sticky md:top-24 md:h-[calc(100vh-8rem)]">
                    <div className="grid grid-cols-5 gap-2 h-full">
                        {/* Thumbnail Strip */}
                        <div className="hidden md:flex flex-col gap-2 overflow-y-auto no-scrollbar col-span-1">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="aspect-[3/4] border border-gray-200 rounded cursor-pointer hover:border-primary overflow-hidden">
                                    <LazyImage
                                        src={product.image}
                                        className="w-full h-full opacity-80 hover:opacity-100"
                                        alt=""
                                    />
                                </div>
                            ))}
                        </div>
                        {/* Main Image */}
                        <div className="col-span-5 md:col-span-4 border border-gray-100 rounded-lg overflow-hidden relative">
                            <LazyImage
                                src={product.image}
                                alt={product.title}
                                className="w-full h-full"
                            />
                            <div className="absolute top-4 right-4 flex flex-col gap-3">
                                <button className="bg-white p-2 rounded-full shadow-md text-gray-400 hover:text-red-500 transition-colors">
                                    <ShieldCheck className="w-5 h-5" />
                                </button>
                                <button className="bg-white p-2 rounded-full shadow-md text-gray-400 hover:text-primary transition-colors">
                                    <RefreshCcw className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                    {/* Mobile Only Action Buttons (Shown below image on scroll, but sticking to bottom is handled globally) */}
                </div>

                {/* Product Info Section */}
                <div className="md:w-7/12 lg:w-6/12 pt-4 md:pt-0 px-4 md:px-0">
                    <div className="border-b border-gray-100 pb-4">
                        <h1 className="text-xl md:text-2xl font-bold text-gray-800 leading-tight">{product.title}</h1>
                        <div className="flex items-center gap-2 mt-2">
                            <span className="text-3xl font-bold text-gray-900">₹{product.price}</span>
                            {product.originalPrice && (
                                <span className="text-lg text-gray-500 line-through decoration-1">₹{product.originalPrice}</span>
                            )}
                            {product.discount && (
                                <span className="text-green-600 font-bold bg-green-50 px-1.5 py-0.5 rounded text-sm">{product.discount}% off</span>
                            )}
                        </div>

                        <div className="flex items-center mt-3 gap-3">
                            <div className="flex items-center bg-green-700 text-white px-2 py-1 rounded-full text-sm font-bold shadow-sm">
                                <span className="mr-1">{product.rating}</span>
                                <Star className="w-3.5 h-3.5 fill-current" />
                            </div>
                            <span className="text-gray-400 text-sm font-medium">{product.reviews} Ratings, {Math.floor(product.reviews / 5)} Reviews</span>
                        </div>
                        <div className="mt-2 inline-flex items-center px-2 py-1 bg-gray-100 rounded text-xs text-gray-600 font-medium">
                            <Truck className="w-3 h-3 mr-1" /> Free Delivery
                        </div>
                    </div>

                    {/* Size Selector */}
                    <div className="py-6 border-b border-gray-100">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-lg text-gray-800">Select Size</h3>
                            <span className="text-primary text-sm font-bold cursor-pointer">Size Chart</span>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map(size => (
                                <button
                                    key={size}
                                    onClick={() => setSelectedSize(size)}
                                    className={`h-12 px-6 rounded-full border-2 flex items-center justify-center text-sm font-bold transition-all transform active:scale-95
                                    ${selectedSize === size
                                            ? 'border-primary text-primary bg-pink-50 shadow-sm'
                                            : 'border-gray-200 text-gray-700 hover:border-black'}`}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                        {selectedSize && <p className="text-green-600 text-xs mt-2 font-medium">Perfect! This size is available.</p>}
                    </div>

                    {/* Desktop Action Buttons */}
                    <div className="hidden md:flex gap-4 py-6 border-b border-gray-100">
                        <Button
                            variant="outline"
                            className="flex-1 h-12 text-lg font-bold border-primary text-primary hover:bg-pink-50"
                            onClick={handleAddToCart}
                        >
                            <ShoppingCart className="w-5 h-5 mr-2" /> Add to Cart
                        </Button>
                        <Button
                            variant="primary"
                            className="flex-1 h-12 text-lg font-bold shadow-lg hover:shadow-xl transition-shadow"
                            onClick={() => {
                                if (!selectedSize) {
                                    alert('Please select a size');
                                    return;
                                }
                                addToCart({ ...product, selectedSize });
                                // Navigate to checkout or cart could be added here
                            }}
                        >
                            Buy Now
                        </Button>
                    </div>

                    {/* Product Details Accordion Placeholders */}
                    <div className="py-6 space-y-4">
                        <div className="flex items-center justify-between py-2 cursor-pointer group">
                            <h3 className="font-bold text-lg text-gray-800">Product Details</h3>
                            <p className="text-gray-500 text-sm group-hover:text-primary transition-colors line-clamp-2 w-2/3 text-right">
                                {product.category} - High quality fabric, comfortable fit for all occasions.
                            </p>
                        </div>

                        <div className="bg-blue-50 p-4 rounded-lg flex items-start gap-3 border border-blue-100">
                            <ShieldCheck className="w-6 h-6 text-blue-600 shrink-0" />
                            <div>
                                <h4 className="font-bold text-blue-900 text-sm">Shop with Confidence</h4>
                                <p className="text-blue-700/80 text-xs mt-0.5">Lowest Price Guaranteed • Cash on Delivery • 7 Day Returns</p>
                            </div>
                        </div>
                    </div>

                    {/* Review Section Placeholder */}
                    <div className="py-6 border-t border-gray-100">
                        <h3 className="font-bold text-lg text-gray-800 mb-4">Ratings & Reviews</h3>
                        <div className="space-y-4">
                            {[1, 2].map((i) => (
                                <div key={i} className="border-b border-gray-100 pb-4 last:border-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <div className="bg-green-700 text-white text-xs px-1.5 py-0.5 rounded flex items-center">
                                            5 <Star className="w-2 h-2 ml-0.5 fill-current" />
                                        </div>
                                        <span className="text-xs font-bold text-gray-800">Excellent Quality</span>
                                    </div>
                                    <p className="text-gray-600 text-sm">Really loved the fabric and the fit. Delivered on time!</p>
                                    <div className="mt-2 flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-gray-200"></div>
                                        <span className="text-xs text-gray-400">Priya User • Oct 2023</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Fixed Bottom Bar / Desktop Action Bar */}
            <div className="fixed bottom-0 left-0 right-0 p-3 bg-white border-t border-gray-200 z-50 md:hidden shadow-nav">
                <div className="flex gap-3">
                    <Button
                        variant="outline"
                        className="flex-1 h-12 text-md border-gray-300 text-gray-800 font-bold"
                        onClick={handleAddToCart}
                    >
                        <ShoppingCart className="w-5 h-5 mr-2" /> Add to Cart
                    </Button>
                    <Button
                        variant="primary"
                        className="flex-1 h-12 text-md font-bold shadow-lg"
                        onClick={() => { handleAddToCart(); /* And Navigate */ }}
                    >
                        Buy Now
                    </Button>
                </div>
            </div>

            {/* Desktop Floating Action (Optional if needed, but standard is static) */}
            {/* Not needed as "Buy Now" logic usually fits near size selector in desktop or keeps separate. Leaving implied. */}
        </div>
    );
};

export default ProductDetailPage;
