import React from 'react';
import { useParams } from 'react-router-dom';
import ProductCard from '../components/common/ProductCard';
import { products } from '../data/mockData';

const ProductListingPage = () => {
    const { category } = useParams();

    // Filter products by category if provided, otherwise show all
    const displayProducts = category
        ? products.filter(p => p.category.toLowerCase() === category.toLowerCase())
        : products;

    // Use products directly
    const finalProducts = displayProducts;

    return (
        <div className="bg-background min-h-screen">
            <div className="bg-white shadow-sm mb-4">
                <div className="container mx-auto px-4 py-4">
                    <h1 className="text-xl font-bold capitalize text-gray-800">{category || 'All Products'}</h1>
                    <p className="text-gray-500 text-xs mt-1">{finalProducts.length} Products Found</p>
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
