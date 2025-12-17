import React, { useState, useEffect } from 'react';
import useThemeStore from '../store/useThemeStore';
import { useParams } from 'react-router-dom';
import ProductCard from '../components/common/ProductCard';
import { getProducts } from '../lib/firebase';

const ProductListingPage = () => {
    const { category } = useParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { isDarkMode } = useThemeStore();

    // Fetch products from Firestore
    useEffect(() => {
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
    }, []);

    // Filter products by category if provided, otherwise show all
    const displayProducts = (category && category.toLowerCase() !== 'all')
        ? products.filter(p => p.category.toLowerCase() === category.toLowerCase())
        : products;

    // Use products directly
    const finalProducts = displayProducts;

    if (loading) {
        return (
            <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-gray-900' : ''}`}>
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className={`text-gray-600 ${isDarkMode ? 'dark:text-gray-400 text-gray-300' : ''}`}>Loading products...</p>
                </div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
            <div className={`${isDarkMode ? 'bg-gray-800 shadow-none border-b border-gray-700' : 'bg-white shadow-sm mb-4'} mb-4`}> 
                <div className="container mx-auto px-4 py-4">
                    <h1 className={`text-xl font-bold capitalize ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{category || 'All Products'}</h1>
                    <p className={`text-gray-500 text-xs mt-1 ${isDarkMode ? 'text-gray-400' : ''}`}>{finalProducts.length} Products Found</p>
                </div>
            </div>

            <div className="container mx-auto px-4 pb-12">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
                    {finalProducts.map((product, index) => (
                        <ProductCard key={`${product.id}-${index}`} product={{ ...product, id: `${product.id}-${index}` }} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProductListingPage;
