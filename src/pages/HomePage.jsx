import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import CategoryRow from '../components/home/CategoryRow';
import ProductCard from '../components/common/ProductCard';
import FilterSidebar from '../components/home/FilterSidebar';
import { products } from '../data/mockData';

const HomePage = () => {
    const [activeFilters, setActiveFilters] = useState({
        category: [],
        price: [],
        rating: []
    });
    const [sortOption, setSortOption] = useState('Relevance');

    const [filteredProducts, setFilteredProducts] = useState(products);
    const [searchParams, setSearchParams] = useSearchParams();
    const searchQuery = searchParams.get('search') || '';

    const handleFilterChange = (newFilters) => {
        setActiveFilters(newFilters);
    };

    const handleClearAll = () => {
        setActiveFilters({
            category: [],
            price: [],
            rating: []
        });
        setSortOption('Relevance');
        setSearchParams({});
    };

    useEffect(() => {
        let result = [...products];

        // Filter by Category
        if (activeFilters.category.length > 0) {
            result = result.filter(p => activeFilters.category.includes(p.category));
        }

        // Filter by Price
        if (activeFilters.price.length > 0) {
            result = result.filter(p => {
                const price = p.price;
                return activeFilters.price.some(range => {
                    if (range === 'Under ₹500') return price < 500;
                    if (range === '₹500 - ₹1000') return price >= 500 && price <= 1000;
                    if (range === '₹1000 - ₹2000') return price >= 1000 && price <= 2000;
                    if (range === 'Above ₹2000') return price > 2000;
                    return false;
                });
            });
        }

        // Filter by Rating
        if (activeFilters.rating.length > 0) {
            result = result.filter(p => {
                return activeFilters.rating.some(rate => {
                    if (rate === '4.0+') return p.rating >= 4.0;
                    if (rate === '3.0+') return p.rating >= 3.0;
                    return false;
                });
            });
        }

        // Filter by Search Query
        if (searchQuery) {
            const lowerQuery = searchQuery.toLowerCase();
            result = result.filter(p =>
                p.title.toLowerCase().includes(lowerQuery) ||
                p.category.toLowerCase().includes(lowerQuery)
            );
        }

        // Sort Logic
        if (sortOption === 'Price: Low to High') {
            result.sort((a, b) => a.price - b.price);
        } else if (sortOption === 'Price: High to Low') {
            result.sort((a, b) => b.price - a.price);
        } else if (sortOption === 'Rating') {
            result.sort((a, b) => b.rating - a.rating);
        }

        setFilteredProducts(result);
    }, [activeFilters, searchQuery, sortOption]);


    return (
        <div className="bg-background min-h-screen">
            {/* Top Banner - App Download Gradient */}
            <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-pink-500 text-white py-8 px-4 mb-4">
                <div className="container mx-auto flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-bold mb-2">Lowest Prices <br /> Best Quality Shopping</h1>
                        <div className="flex items-center space-x-4 bg-white/20 p-2 rounded backdrop-blur-sm w-max mt-4">
                            <span className="font-bold"> Download the App </span>
                        </div>
                    </div>
                    {/* Decorative element resembling the image somewhat */}
                    <div className="hidden md:block">
                        <div className="bg-white/10 w-64 h-32 rounded-lg"></div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4">
                <CategoryRow />

                {/* Gold Banner */}
                <div className="bg-gradient-to-r from-yellow-900 to-yellow-600 rounded-lg p-6 mb-8 relative overflow-hidden text-white shadow-lg">
                    <div className="relative z-10">
                        <h2 className="text-2xl font-bold text-yellow-100 mb-1">Styliqo Gold</h2>
                        <p className="text-yellow-200 text-sm">Premium Quality Products</p>
                    </div>
                </div>

                <div className="flex items-start">
                    {/* Left Sidebar (Desktop) */}
                    <FilterSidebar
                        filters={activeFilters}
                        onFilterChange={handleFilterChange}
                        onClearAll={handleClearAll}
                    />

                    {/* Right Content (Product Grid) */}
                    <div className="flex-1">
                        <div className="mb-6 flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-gray-800">
                                Products For You
                                <span className="text-sm font-normal text-gray-500 ml-2">({filteredProducts.length} items)</span>
                            </h2>

                            {/* Sort Dropdown */}
                            <div className="flex items-center space-x-2 text-sm border border-gray-300 rounded px-3 py-2 bg-white hover:border-primary transition-colors">
                                <span className="text-gray-500">Sort by:</span>
                                <select
                                    value={sortOption}
                                    onChange={(e) => setSortOption(e.target.value)}
                                    className="font-bold bg-transparent outline-none cursor-pointer text-gray-800"
                                >
                                    <option value="Relevance">Relevance</option>
                                    <option value="Price: Low to High">Price: Low to High</option>
                                    <option value="Price: High to Low">Price: High to Low</option>
                                    <option value="Rating">Rating: High to Low</option>
                                </select>
                            </div>
                        </div>

                        {filteredProducts.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                {filteredProducts.map(product => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 bg-white rounded-lg border border-dashed border-gray-300">
                                <p className="text-xl text-gray-400 font-medium">No products found matching filters</p>
                                <button onClick={handleClearAll} className="mt-4 text-primary font-bold hover:underline">
                                    Clear Filters
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
